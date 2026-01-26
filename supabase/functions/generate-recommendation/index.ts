import { createClient } from 'jsr:@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// Types
interface QuestionnaireOption {
  option_value: string;
  option_label: string;
}

interface QuestionnaireQuestion {
  field_name: string;
  question_text: string;
  questionnaire_options: QuestionnaireOption[];
}

interface Role {
  id: number;
  name: string;
  description: string;
}

interface QuestionnaireResponses {
  work_style?: string;
  client_interaction?: string;
  aesthetic_focus?: string;
  teamwork_preference?: string;
  problem_solving_approach?: string;
  [key: string]: string | undefined;
}

interface AIRecommendation {
  role_id: number;
  role_name: string;
  justification: string;
}

interface LLMResponse {
  role_id: number;
  role_name: string;
  justification: string;
}

// OpenRouter configuration - using free models for development
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
// Free models from OpenRouter free collection - limit ~50 requests/day
const MODELS = [
  'google/gemini-2.0-flash-exp:free',
  'mistralai/devstral-small-2505:free',
  'deepseek/deepseek-chat-v3-0324:free',
  'meta-llama/llama-4-scout:free',
];

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get OpenRouter API key from environment
    const openrouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!openrouterApiKey) {
      throw new Error('OPENROUTER_API_KEY not configured');
    }

    // Get Supabase credentials
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Create admin client for service operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get user ID - either from JWT auth or from request body (MVP mode)
    let userId: string;

    // Try to parse request body for user_id (MVP mode without auth)
    let requestBody: { user_id?: string } = {};
    try {
      const bodyText = await req.text();
      if (bodyText) {
        requestBody = JSON.parse(bodyText);
      }
    } catch {
      // Body parsing failed, continue with auth header check
    }

    if (requestBody.user_id) {
      // MVP mode: use user_id from request body
      userId = requestBody.user_id;
    } else {
      // Production mode: get user from JWT
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'AUTH_ERROR', message: 'Missing Authorization header or user_id' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create Supabase client with user's JWT for RLS
      const supabaseUser = createClient(supabaseUrl, supabaseServiceKey, {
        global: { headers: { Authorization: authHeader } },
      });

      // Get user from JWT
      const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
      if (userError || !user) {
        return new Response(
          JSON.stringify({ error: 'AUTH_ERROR', message: 'Invalid or expired token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      userId = user.id;
    }

    // 1. Fetch user profile with questionnaire responses
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('questionnaire_responses, ai_recommendations, cv_uploaded_at')
      .eq('id', userId)
      .single();

    if (profileError) {
      throw new Error(`Failed to fetch profile: ${profileError.message}`);
    }

    // Check if recommendations already exist
    if (profile.ai_recommendations) {
      return new Response(
        JSON.stringify({ 
          error: 'RECOMMENDATIONS_EXIST',
          message: 'AI recommendations have already been generated for this user' 
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const questionnaireResponses = profile.questionnaire_responses as QuestionnaireResponses;

    // Check if questionnaire is complete
    const requiredFields = ['work_style', 'client_interaction', 'aesthetic_focus', 'teamwork_preference', 'problem_solving_approach'];
    const missingFields = requiredFields.filter(field => !questionnaireResponses?.[field]);
    
    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'QUESTIONNAIRE_INCOMPLETE',
          message: 'Questionnaire is not complete',
          missing_fields: missingFields
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Fetch questionnaire configuration with labels
    const { data: questions, error: questionsError } = await supabaseAdmin
      .from('questionnaire_questions')
      .select('field_name, question_text, questionnaire_options(option_value, option_label)')
      .eq('is_active', true)
      .order('question_order');

    if (questionsError) {
      throw new Error(`Failed to fetch questions: ${questionsError.message}`);
    }

    // 3. Fetch all roles
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from('roles')
      .select('id, name, description')
      .order('id');

    if (rolesError) {
      throw new Error(`Failed to fetch roles: ${rolesError.message}`);
    }

    // 4. Try to fetch CV text (optional)
    let cvText = '';
    if (profile.cv_uploaded_at) {
      try {
        const cvPath = `${userId}/cv.pdf`;
        const { data: cvData, error: cvError } = await supabaseAdmin.storage
          .from('cv')
          .download(cvPath);

        if (!cvError && cvData) {
          // For PDF text extraction, we'll use a simple approach
          // In production, you might want to use a PDF parsing library
          const arrayBuffer = await cvData.arrayBuffer();
          cvText = await extractTextFromPDF(arrayBuffer);
        }
      } catch (e) {
        console.warn('Failed to fetch CV, proceeding without it:', e);
      }
    }

    // 5. Build the prompt dynamically
    const prompt = buildPrompt(
      questions as QuestionnaireQuestion[],
      questionnaireResponses,
      roles as Role[],
      cvText
    );

    // 6. Call OpenRouter API
    const llmResponse = await callOpenRouter(openrouterApiKey, prompt);

    // 7. Parse and validate LLM response
    const recommendation = parseLLMResponse(llmResponse, roles as Role[]);

    // 8. Save recommendation to profile
    const aiRecommendations = {
      recommendations: [recommendation],
      generated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ ai_recommendations: aiRecommendations })
      .eq('id', userId);

    if (updateError) {
      throw new Error(`Failed to save recommendation: ${updateError.message}`);
    }

    // 9. Return result
    return new Response(
      JSON.stringify({
        success: true,
        recommendations: aiRecommendations.recommendations,
        generated_at: aiRecommendations.generated_at,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-recommendation:', error);
    return new Response(
      JSON.stringify({ 
        error: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Build the LLM prompt dynamically with questionnaire data
 */
function buildPrompt(
  questions: QuestionnaireQuestion[],
  responses: QuestionnaireResponses,
  roles: Role[],
  cvText: string
): string {
  // Build questionnaire section with labels
  const questionnaireSection = questions.map(q => {
    const selectedValue = responses[q.field_name];
    const selectedOption = q.questionnaire_options.find(
      opt => opt.option_value === selectedValue
    );
    const answerLabel = selectedOption?.option_label ?? selectedValue ?? 'Brak odpowiedzi';
    
    return `- ${q.question_text}\n  Odpowiedź: ${answerLabel}`;
  }).join('\n\n');

  // Build roles section
  const rolesSection = roles.map((r, idx) => 
    `${idx + 1}. ${r.name} (ID: ${r.id})\n   ${r.description}`
  ).join('\n\n');

  // CV section
  const cvSection = cvText 
    ? `CV KANDYDATA (hobby, zainteresowania, dotychczasowe doświadczenie):\n${cvText}`
    : 'CV: Nie przesłano CV.';

  return `Jesteś ekspertem kariery IT pomagającym osobom BEZ doświadczenia w IT wybrać pierwszą rolę zawodową.

TWOJE ZADANIE:
Na podstawie odpowiedzi z ankiety i CV (jeśli dostępne) przypisz kandydatowi JEDNĄ najbardziej pasującą rolę z listy poniżej.

WAŻNE WSKAZÓWKI:
- Kandydat NIE ma doświadczenia w IT - dopasowuj rolę na podstawie preferencji i osobowości
- W uzasadnieniu MUSISZ odnieść się do konkretnych odpowiedzi z ankiety
- Jeśli CV jest dostępne, wykorzystaj hobby/zainteresowania jako dodatkowe wskazówki
- Wyjaśnij dlaczego ta rola pasuje do osobowości i preferencji kandydata
- Odnieś się do opisu roli i wyjaśnij czym się zajmuje

DOSTĘPNE ROLE:
${rolesSection}

---

ANKIETA KANDYDATA:
${questionnaireSection}

---

${cvSection}

---

INSTRUKCJE ODPOWIEDZI:
Odpowiedz WYŁĄCZNIE w formacie JSON (bez markdown, bez komentarzy):
{
  "role_id": <numer ID roli>,
  "role_name": "<pełna nazwa roli>",
  "justification": "<3-5 zdań uzasadnienia: 1) dlaczego ta rola pasuje do preferencji kandydata, 2) odniesienie do konkretnych odpowiedzi z ankiety, 3) jeśli CV dostępne - odniesienie do hobby/zainteresowań>"
}`;
}

/**
 * Call OpenRouter API with the prompt, trying multiple models as fallback
 */
async function callOpenRouter(apiKey: string, prompt: string): Promise<string> {
  let lastError: Error | null = null;

  for (const model of MODELS) {
    try {
      console.log(`Trying model: ${model}`);
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://job-switch.app',
          'X-Title': 'JobSwitch Career Advisor',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const statusCode = response.status;
        
        // If rate limited (429) or model not found (404), try next model
        if (statusCode === 429 || statusCode === 404) {
          console.warn(`Model ${model} unavailable (${statusCode}), trying next...`);
          lastError = new Error(`${model} unavailable: ${statusCode}`);
          continue;
        }
        
        throw new Error(`OpenRouter API error: ${statusCode} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from OpenRouter');
      }

      console.log(`Successfully used model: ${model}`);
      return data.choices[0].message.content;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Model ${model} failed:`, lastError.message);
      // Continue to next model
    }
  }

  throw lastError ?? new Error('All models failed');
}

/**
 * Parse and validate LLM response
 */
function parseLLMResponse(response: string, roles: Role[]): AIRecommendation {
  // Clean the response - remove markdown code blocks if present
  let cleanResponse = response.trim();
  if (cleanResponse.startsWith('```json')) {
    cleanResponse = cleanResponse.slice(7);
  }
  if (cleanResponse.startsWith('```')) {
    cleanResponse = cleanResponse.slice(3);
  }
  if (cleanResponse.endsWith('```')) {
    cleanResponse = cleanResponse.slice(0, -3);
  }
  cleanResponse = cleanResponse.trim();

  let parsed: LLMResponse;
  try {
    parsed = JSON.parse(cleanResponse);
  } catch (e) {
    console.error('Failed to parse LLM response:', cleanResponse);
    throw new Error('Invalid JSON response from AI model');
  }

  // Validate role_id
  const validRole = roles.find(r => r.id === parsed.role_id);
  if (!validRole) {
    // Try to find by name as fallback
    const roleByName = roles.find(r => 
      r.name.toLowerCase() === parsed.role_name?.toLowerCase()
    );
    if (roleByName) {
      parsed.role_id = roleByName.id;
      parsed.role_name = roleByName.name;
    } else {
      throw new Error(`Invalid role_id: ${parsed.role_id}`);
    }
  } else {
    // Ensure role_name matches
    parsed.role_name = validRole.name;
  }

  // Validate justification
  if (!parsed.justification || parsed.justification.length < 50) {
    throw new Error('Justification is too short or missing');
  }

  return {
    role_id: parsed.role_id,
    role_name: parsed.role_name,
    justification: parsed.justification,
  };
}

/**
 * Extract text from PDF (basic implementation)
 * For production, consider using a proper PDF parsing library
 */
async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  // Basic text extraction - looks for text streams in PDF
  // This is a simplified approach and may not work for all PDFs
  const bytes = new Uint8Array(arrayBuffer);
  const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  
  // Try to extract readable text from the PDF
  const textMatches: string[] = [];
  
  // Look for text between parentheses (common in PDF text objects)
  const parenRegex = /\(([^)]+)\)/g;
  let match;
  while ((match = parenRegex.exec(text)) !== null) {
    const extracted = match[1]
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '')
      .replace(/\\\(/g, '(')
      .replace(/\\\)/g, ')')
      .trim();
    if (extracted.length > 2 && /[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(extracted)) {
      textMatches.push(extracted);
    }
  }

  // Also try to find BT/ET text blocks
  const btEtRegex = /BT\s*(.*?)\s*ET/gs;
  while ((match = btEtRegex.exec(text)) !== null) {
    const block = match[1];
    const tjRegex = /\[?\(([^)]+)\)\]?\s*T[jJ]/g;
    let tjMatch;
    while ((tjMatch = tjRegex.exec(block)) !== null) {
      const extracted = tjMatch[1].trim();
      if (extracted.length > 2 && /[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(extracted)) {
        textMatches.push(extracted);
      }
    }
  }

  const result = [...new Set(textMatches)].join(' ').substring(0, 3000);
  
  return result || 'Nie udało się wyekstrahować tekstu z CV.';
}

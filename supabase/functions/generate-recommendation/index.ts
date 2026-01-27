import { createClient } from '@supabase/supabase-js';
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
  // Original questions (1-5)
  work_style?: string;
  client_interaction?: string;
  aesthetic_focus?: string;
  teamwork_preference?: string;
  problem_solving_approach?: string;
  // New questions (6-10)
  leadership_preference?: string;
  technical_depth?: string;
  data_vs_design?: string;
  coding_interest?: string;
  uncertainty_handling?: string;
  // Optional open answer
  open_answer?: string;
  [key: string]: string | undefined;
}

interface AIRecommendation {
  role_id: number;
  role_name: string;
  justification: string;
}

interface LLMResponse {
  recommendations: AIRecommendation[];
}

// API Request/Response types
interface GenerateRecommendationRequest {
  user_id?: string;
}

interface GenerateRecommendationResponse {
  success: true;
  recommendations: AIRecommendation[];
  generated_at: string;
}

type ErrorCode = 'AUTH_ERROR' | 'QUESTIONNAIRE_INCOMPLETE' | 'RECOMMENDATIONS_EXIST' | 'INTERNAL_ERROR';

interface ErrorResponse {
  error: ErrorCode;
  message: string;
  missing_fields?: string[];
}

function createErrorResponse(
  error: ErrorCode,
  message: string,
  status: number,
  missingFields?: string[]
): Response {
  const body: ErrorResponse = { error, message };
  if (missingFields) {
    body.missing_fields = missingFields;
  }
  return new Response(
    JSON.stringify(body),
    { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

function createSuccessResponse(
  recommendations: AIRecommendation[],
  generatedAt: string
): Response {
  const body: GenerateRecommendationResponse = {
    success: true,
    recommendations,
    generated_at: generatedAt,
  };
  return new Response(
    JSON.stringify(body),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// OpenRouter configuration - using free models for development
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Free text models - limit ~50 requests/day
const TEXT_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemma-3-27b-it:free',
  'deepseek/deepseek-r1-0528:free',
  'tngtech/deepseek-r1t2-chimera:free',
  'google/gemini-2.0-flash-exp:free',
  'openai/gpt-oss-120b', //paid model
  "google/gemini-2.5-flash-lite" // paid model
];

// Free vision models for PDF/image processing (support multimodal input)
const VISION_MODELS = [
  'google/gemini-2.0-flash-exp:free',
  'qwen/qwen-2.5-vl-7b-instruct:free',
  'meta-llama/llama-4-maverick:free',
  'google/gemini-2.5-flash-lite', // paid model
  'openai/gpt-4o-mini' // paid model
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
    let requestBody: GenerateRecommendationRequest = {};
    try {
      const bodyText = await req.text();
      if (bodyText) {
        requestBody = JSON.parse(bodyText) as GenerateRecommendationRequest;
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
        return createErrorResponse('AUTH_ERROR', 'Missing Authorization header or user_id', 401);
      }

      // Create Supabase client with user's JWT for RLS
      const supabaseUser = createClient(supabaseUrl, supabaseServiceKey, {
        global: { headers: { Authorization: authHeader } },
      });

      // Get user from JWT
      const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
      if (userError || !user) {
        return createErrorResponse('AUTH_ERROR', 'Invalid or expired token', 401);
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
      return createErrorResponse(
        'RECOMMENDATIONS_EXIST',
        'AI recommendations have already been generated for this user',
        409
      );
    }

    const questionnaireResponses = profile.questionnaire_responses as QuestionnaireResponses;

    // Check if questionnaire is complete (all 10 questions required, open_answer optional)
    const requiredFields = [
      // Original questions (1-5)
      'work_style', 
      'client_interaction', 
      'aesthetic_focus', 
      'teamwork_preference', 
      'problem_solving_approach',
      // New questions (6-10)
      'leadership_preference',
      'technical_depth',
      'data_vs_design',
      'coding_interest',
      'uncertainty_handling'
    ];
    const missingFields = requiredFields.filter(field => !questionnaireResponses?.[field]);
    
    if (missingFields.length > 0) {
      return createErrorResponse(
        'QUESTIONNAIRE_INCOMPLETE',
        'Questionnaire is not complete',
        400,
        missingFields
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

    // 4. Try to fetch and extract CV text using vision model (optional)
    let cvText = '';
    if (profile.cv_uploaded_at) {
      try {
        const cvPath = `${userId}/cv.pdf`;
        const { data: cvData, error: cvError } = await supabaseAdmin.storage
          .from('cv')
          .download(cvPath);

        if (!cvError && cvData) {
          const arrayBuffer = await cvData.arrayBuffer();
          
          // Try vision model extraction first (handles scanned PDFs and images)
          cvText = await extractTextFromPDFWithVision(openrouterApiKey, arrayBuffer);
          
          // Fallback to basic extraction if vision failed
          if (!cvText || cvText.length < 50) {
            console.log('Vision extraction returned little text, trying basic extraction...');
            const basicText = extractTextFromPDFBasic(arrayBuffer);
            if (basicText.length > cvText.length) {
              cvText = basicText;
            }
          }
        }
      } catch (e) {
        console.warn('Failed to fetch/extract CV, proceeding without it:', e);
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
    const recommendations = parseLLMResponse(llmResponse, roles as Role[]);

    // 8. Save recommendations to profile
    const aiRecommendations = {
      recommendations,
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
    return createSuccessResponse(aiRecommendations.recommendations, aiRecommendations.generated_at);

  } catch (error) {
    console.error('Error in generate-recommendation:', error);
    return createErrorResponse(
      'INTERNAL_ERROR',
      error instanceof Error ? error.message : 'Unknown error occurred',
      500
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
  // Build questionnaire section with labels (10 questions)
  const questionnaireSection = questions.map(q => {
    const selectedValue = responses[q.field_name];
    const selectedOption = q.questionnaire_options.find(
      opt => opt.option_value === selectedValue
    );
    const answerLabel = selectedOption?.option_label ?? selectedValue ?? 'Brak odpowiedzi';
    
    return `- ${q.question_text}\n  Odpowiedź: ${answerLabel}`;
  }).join('\n\n');

  // Build roles section (6 roles including Project Manager)
  const rolesSection = roles.map((r, idx) => 
    `${idx + 1}. ${r.name} (ID: ${r.id})\n   ${r.description}`
  ).join('\n\n');

  // Open answer section (optional, max 200 chars)
  const openAnswerSection = responses.open_answer && responses.open_answer.trim().length > 0
    ? `DODATKOWE INFORMACJE OD KANDYDATA:\n"${responses.open_answer.trim()}"`
    : 'DODATKOWE INFORMACJE: Kandydat nie dodał dodatkowych informacji.';

  // CV section
  const cvSection = cvText 
    ? `CV KANDYDATA (hobby, zainteresowania, dotychczasowe doświadczenie):\n${cvText}`
    : 'CV: Nie przesłano CV.';

  // Determine if CV was uploaded
  const hasCv = cvText.length > 0;
  
  // Build CV requirement instruction
  const cvRequirement = hasCv 
    ? `
OBOWIĄZKOWE ODNIESIENIE DO CV:
Ponieważ kandydat załączył CV, KAŻDE uzasadnienie MUSI zawierać przynajmniej jedno zdanie odnoszące się do treści CV. 
Może to być:
- Pozytywne ("Twoje doświadczenie w X świetnie się przełoży na...")
- Neutralne ("Choć pracowałeś dotąd w Y, to...")  
- Krytyczne, ale szczere ("Do tej pory nie miałeś styczności z branżą IT, więc znalezienie pierwszej pracy może być wyzwaniem - ale...")
Bądź szczery i pomocny - nie unikaj trudnych prawd, jeśli CV nie wspiera danej roli.`
    : '';

  return `Jesteś ekspertem kariery IT pomagającym osobom BEZ doświadczenia w IT wybrać pierwszą rolę zawodową.

TWOJE ZADANIE:
Na podstawie odpowiedzi z ankiety (10 pytań), dodatkowych informacji od kandydata i CV (jeśli dostępne) przypisz użytkownikowi DWIE najbardziej pasujące role z listy poniżej. Pierwsza rola powinna być najlepszym dopasowaniem, druga - alternatywą.

WAŻNE WSKAZÓWKI:
- Użytkownik NIE ma doświadczenia w IT - dopasowuj rolę na podstawie preferencji i osobowości
- Pisz uzasadnienie BEZPOŚREDNIO do użytkownika, zwracając się na TY (np. "Lubisz pracować samodzielnie...", "Zależy ci na...")
- Używaj luźnego, przyjaznego tonu - pisz jak kumpel-mentor, nie jak formalny doradca
- NIE cytuj pytań ani odpowiedzi dosłownie - zamiast tego opisz preferencje użytkownika swoimi słowami
- Odnieś się do tego, na czym polega dana rola i dlaczego pasuje do osobowości użytkownika
- Jeśli kandydat dodał dodatkowe informacje - weź je pod uwagę przy rekomendacji
- Obie role muszą być RÓŻNE
${cvRequirement}

STYL UZASADNIENIA:
❌ ŹLE: "Kandydat wybrał odpowiedź 'minimum – wolę skupić się na kodzie' w pytaniu o kontakt z klientem"
✅ DOBRZE: "Wolisz skupić się na kodzie bez ciągłego kontaktu z klientami - frontend ci to da"

❌ ŹLE: "Praca samodzielna została wybrana jako preferowany styl"  
✅ DOBRZE: "Lubisz działać w swoim tempie i na własnych zasadach - jako frontendowiec masz sporo autonomii"

${hasCv ? `❌ ŹLE (brak odniesienia do CV): "Ta rola pasuje do Twoich preferencji"
✅ DOBRZE (z odniesieniem do CV): "Choć do tej pory pracowałeś w zupełnie innej branży, Twoje umiejętności organizacyjne widoczne w CV mogą się przydać..."` : ''}

DOSTĘPNE ROLE (6):
${rolesSection}

---

ANKIETA KANDYDATA (10 pytań):
${questionnaireSection}

---

${openAnswerSection}

---

${cvSection}

---

INSTRUKCJE ODPOWIEDZI:
Odpowiedz WYŁĄCZNIE w formacie JSON (bez markdown, bez komentarzy):
{
  "recommendations": [
    {
      "role_id": <numer ID pierwszej roli>,
      "role_name": "<pełna nazwa pierwszej roli>",
      "justification": "<3-5 zdań uzasadnienia>"
    },
    {
      "role_id": <numer ID drugiej roli>,
      "role_name": "<pełna nazwa drugiej roli>",
      "justification": "<3-5 zdań uzasadnienia>"
    }
  ]
}`;
}

/**
 * Call OpenRouter API with the prompt, trying multiple models as fallback
 */
async function callOpenRouter(apiKey: string, prompt: string): Promise<string> {
  let lastError: Error | null = null;

  for (const model of TEXT_MODELS) {
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
 * Parse and validate LLM response - expects array of 2 recommendations
 */
function parseLLMResponse(response: string, roles: Role[]): AIRecommendation[] {
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
  } catch {
    console.error('Failed to parse LLM response:', cleanResponse);
    throw new Error('Invalid JSON response from AI model');
  }

  // Validate we have recommendations array
  if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
    throw new Error('Invalid response format: missing recommendations array');
  }

  if (parsed.recommendations.length < 2) {
    throw new Error('Expected 2 recommendations, got ' + parsed.recommendations.length);
  }

  const validatedRecommendations: AIRecommendation[] = [];
  const usedRoleIds = new Set<number>();

  for (const rec of parsed.recommendations.slice(0, 2)) {
    // Validate role_id
    let validRole = roles.find(r => r.id === rec.role_id);
    
    if (!validRole) {
      // Try to find by name as fallback
      const roleByName = roles.find(r => 
        r.name.toLowerCase() === rec.role_name?.toLowerCase()
      );
      if (roleByName) {
        validRole = roleByName;
      } else {
        throw new Error(`Invalid role_id: ${rec.role_id}`);
      }
    }

    // Ensure unique roles
    if (usedRoleIds.has(validRole.id)) {
      console.warn(`Duplicate role_id ${validRole.id}, skipping...`);
      continue;
    }
    usedRoleIds.add(validRole.id);

    // Validate justification
    if (!rec.justification || rec.justification.length < 30) {
      throw new Error('Justification is too short or missing');
    }

    validatedRecommendations.push({
      role_id: validRole.id,
      role_name: validRole.name,
      justification: rec.justification,
    });
  }

  if (validatedRecommendations.length < 2) {
    throw new Error('Could not validate 2 unique recommendations');
  }

  return validatedRecommendations;
}

/**
 * Extract text from PDF using vision model (handles scanned PDFs and images)
 * Uses OpenRouter's PDF support with free vision models
 */
async function extractTextFromPDFWithVision(apiKey: string, arrayBuffer: ArrayBuffer): Promise<string> {
  const base64PDF = arrayBufferToBase64(arrayBuffer);
  const pdfDataUrl = `data:application/pdf;base64,${base64PDF}`;

  const extractionPrompt = `Wyciągnij CAŁY tekst z tego CV/dokumentu PDF. 
Zwróć tylko sam tekst, bez żadnych komentarzy ani formatowania markdown.
Zachowaj strukturę (sekcje, listy) używając zwykłego tekstu i nowych linii.
Jeśli dokument zawiera obrazy lub skany, użyj OCR do odczytania tekstu.`;

  let lastError: Error | null = null;

  for (const model of VISION_MODELS) {
    try {
      console.log(`Trying vision model for PDF extraction: ${model}`);
      
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://job-switch.app',
          'X-Title': 'JobSwitch CV Extractor',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: extractionPrompt },
                { type: 'image_url', image_url: { url: pdfDataUrl } },
              ],
            },
          ],
          // Use native PDF processing for models that support it
          plugins: [
            {
              id: 'file-parser',
              pdf: { engine: 'native' },
            },
          ],
          temperature: 0.1,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const statusCode = response.status;
        if (statusCode === 429 || statusCode === 404 || statusCode === 400) {
          console.warn(`Vision model ${model} unavailable (${statusCode}), trying next...`);
          lastError = new Error(`${model} unavailable: ${statusCode}`);
          continue;
        }
        const errorText = await response.text();
        throw new Error(`OpenRouter API error: ${statusCode} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from vision model');
      }

      const extractedText = data.choices[0].message.content?.trim() ?? '';
      console.log(`Successfully extracted ${extractedText.length} chars using ${model}`);
      
      // Return up to 4000 chars of extracted text
      return extractedText.substring(0, 4000);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Vision model ${model} failed:`, lastError.message);
    }
  }

  console.warn('All vision models failed for PDF extraction:', lastError?.message);
  return '';
}

/**
 * Convert ArrayBuffer to base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Extract text from PDF using basic regex (fallback method)
 * Works only for simple text-based PDFs, not scanned documents
 */
function extractTextFromPDFBasic(arrayBuffer: ArrayBuffer): string {
  const bytes = new Uint8Array(arrayBuffer);
  const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  
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

  return [...new Set(textMatches)].join(' ').substring(0, 3000);
}

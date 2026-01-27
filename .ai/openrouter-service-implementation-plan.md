# Plan Implementacji Usługi OpenRouter - JobSwitch

## 1. Opis usługi

### 1.1. Cel usługi

Usługa OpenRouter w projekcie JobSwitch służy jako warstwa pośrednia między aplikacją a zewnętrznym API OpenRouter.ai. Główne zadania usługi:

1. **Generowanie rekomendacji kariery** - analiza odpowiedzi z kwestionariusza (10 pytań) i CV użytkownika w celu wygenerowania 2 najlepiej dopasowanych ról IT
2. **Ekstrakcja tekstu z CV** - przetwarzanie plików PDF (w tym skanów) za pomocą modeli vision
3. **Bezpieczne pośrednictwo API** - ukrycie klucza API przed frontendem, walidacja danych wejściowych/wyjściowych

### 1.2. Architektura

```
Frontend (React)
       │
       ▼
Supabase Edge Function (Deno)
       │
       ├─► Supabase DB (profiles, roles, questionnaire_questions)
       ├─► Supabase Storage (CV files)
       │
       ▼
OpenRouter API (https://openrouter.ai/api/v1/chat/completions)
       │
       ▼
LLM Models (Llama, Gemini, DeepSeek, GPT)
```

### 1.3. Środowisko uruchomieniowe

| Element | Technologia |
|---------|-------------|
| Runtime | Deno (Supabase Edge Functions) |
| Język | TypeScript |
| HTTP Client | Native `fetch` API |
| Deployment | Supabase Cloud |

---

## 2. Opis konstruktora / Konfiguracja

### 2.1. Zmienne środowiskowe

Wymagane zmienne środowiskowe (definiowane w `supabase/config.toml` i Supabase Dashboard):

```toml
# supabase/config.toml
[functions.generate-recommendation.env]
OPENROUTER_API_KEY = "env(OPENROUTER_API_KEY)"
```

| Zmienna | Wymagana | Opis |
|---------|----------|------|
| `OPENROUTER_API_KEY` | Tak | Klucz API do OpenRouter.ai |
| `SUPABASE_URL` | Tak | URL instancji Supabase (automatyczne) |
| `SUPABASE_SERVICE_ROLE_KEY` | Tak | Klucz service_role (automatyczne) |

### 2.2. Stałe konfiguracyjne

```typescript
// URL bazowy OpenRouter API
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Modele tekstowe (fallback chain) - od najbardziej preferowanych
const TEXT_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',    // Free, ~50 req/day
  'google/gemma-3-27b-it:free',                 // Free
  'deepseek/deepseek-r1-0528:free',             // Free
  'tngtech/deepseek-r1t2-chimera:free',         // Free
  'google/gemini-2.0-flash-exp:free',           // Free
  'openai/gpt-oss-120b',                        // Paid fallback
  'google/gemini-2.5-flash-lite',               // Paid fallback
];

// Modele vision dla ekstrakcji PDF
const VISION_MODELS = [
  'google/gemini-2.0-flash-exp:free',           // Free, multimodal
  'qwen/qwen-2.5-vl-7b-instruct:free',          // Free
  'meta-llama/llama-4-maverick:free',           // Free
  'google/gemini-2.5-flash-lite',               // Paid fallback
  'openai/gpt-4o-mini',                         // Paid fallback
];
```

### 2.3. Nagłówki HTTP

Wymagane nagłówki dla każdego żądania do OpenRouter:

```typescript
const headers = {
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
  'HTTP-Referer': 'https://job-switch.app',     // Identyfikacja aplikacji
  'X-Title': 'JobSwitch Career Advisor',        // Nazwa aplikacji w dashboardzie OpenRouter
};
```

---

## 3. Publiczne metody i pola

### 3.1. Główny endpoint: `POST /functions/v1/generate-recommendation`

#### Request

```typescript
// Request body (MVP mode - bez pełnej autentykacji)
interface GenerateRecommendationRequest {
  user_id: string;  // UUID użytkownika z profiles
}

// Headers (produkcja)
// Authorization: Bearer {jwt_token}
```

#### Response (sukces - 200)

```typescript
interface GenerateRecommendationResponse {
  success: true;
  recommendations: AIRecommendation[];
  generated_at: string;  // ISO 8601 timestamp
}

interface AIRecommendation {
  role_id: number;
  role_name: string;
  justification: string;  // 3-5 zdań uzasadnienia
}
```

#### Response (błąd)

```typescript
interface ErrorResponse {
  error: string;      // Kod błędu
  message: string;    // Opis dla użytkownika
  missing_fields?: string[];  // Tylko dla QUESTIONNAIRE_INCOMPLETE
}
```

### 3.2. Przepływ danych (flow)

```
1. Walidacja autentykacji (user_id lub JWT)
       │
       ▼
2. Pobranie profilu użytkownika (questionnaire_responses, cv_uploaded_at)
       │
       ▼
3. Sprawdzenie czy rekomendacje już istnieją (409 jeśli tak)
       │
       ▼
4. Walidacja kompletności kwestionariusza (10 wymaganych pól)
       │
       ▼
5. Pobranie konfiguracji pytań z questionnaire_questions
       │
       ▼
6. Pobranie listy dostępnych ról z roles
       │
       ▼
7. [Opcjonalne] Ekstrakcja tekstu z CV (vision model)
       │
       ▼
8. Budowanie promptu dynamicznie
       │
       ▼
9. Wywołanie OpenRouter API (z fallback na kolejne modele)
       │
       ▼
10. Parsowanie i walidacja odpowiedzi JSON
       │
       ▼
11. Zapis rekomendacji do profiles.ai_recommendations
       │
       ▼
12. Zwrócenie wyniku do klienta
```

---

## 4. Prywatne metody i pola

### 4.1. `buildPrompt()` - Budowanie promptu

Dynamicznie buduje prompt zawierający:
- System instructions (styl odpowiedzi, ton, format)
- Listę dostępnych ról z opisami
- Odpowiedzi z kwestionariusza (10 pytań z labelami)
- Dodatkowe informacje od kandydata (open_answer)
- Tekst CV (jeśli dostępny)
- Instrukcje formatu odpowiedzi (JSON)

```typescript
function buildPrompt(
  questions: QuestionnaireQuestion[],
  responses: QuestionnaireResponses,
  roles: Role[],
  cvText: string
): string
```

#### Struktura promptu

```
[SYSTEM CONTEXT]
Jesteś ekspertem kariery IT pomagającym osobom BEZ doświadczenia w IT...

[WSKAZÓWKI STYLU]
- Zwracaj się bezpośrednio do użytkownika (TY)
- Pisz jak kumpel-mentor
- NIE cytuj pytań dosłownie

[DOSTĘPNE ROLE]
1. Frontend Developer (ID: 1)
   Opis roli...
2. Backend Developer (ID: 2)
   ...

[ANKIETA KANDYDATA]
- Jak wolisz pracować?
  Odpowiedź: Samodzielnie

- Jak często chcesz kontaktować się z klientami?
  Odpowiedź: Rzadko
...

[DODATKOWE INFORMACJE]
"Interesują mnie nowoczesne technologie..."

[CV KANDYDATA]
(tekst wyekstrahowany z PDF)

[INSTRUKCJE ODPOWIEDZI - JSON Schema]
{
  "recommendations": [
    {
      "role_id": <number>,
      "role_name": "<string>",
      "justification": "<string 3-5 sentences>"
    },
    ...
  ]
}
```

### 4.2. `callOpenRouter()` - Wywołanie API

Implementuje wzorzec **fallback chain** - próbuje kolejne modele w przypadku błędu.

```typescript
async function callOpenRouter(
  apiKey: string, 
  prompt: string
): Promise<string>
```

#### Parametry żądania do OpenRouter

```typescript
const requestBody = {
  model: model,                    // Nazwa modelu z listy
  messages: [
    {
      role: 'user',                // Tylko user message (brak system)
      content: prompt,             // Pełny prompt z instrukcjami
    },
  ],
  temperature: 0.7,                // Balans kreatywności i spójności
  max_tokens: 1000,                // Limit odpowiedzi
};
```

#### Logika fallback

```typescript
for (const model of TEXT_MODELS) {
  try {
    const response = await fetch(OPENROUTER_API_URL, { ... });
    
    if (response.status === 429 || response.status === 404) {
      // Rate limit lub model niedostępny - próbuj następny
      continue;
    }
    
    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }
    
    return response.choices[0].message.content;
  } catch (error) {
    lastError = error;
    continue;  // Próbuj następny model
  }
}

throw lastError ?? new Error('All models failed');
```

### 4.3. `parseLLMResponse()` - Parsowanie odpowiedzi

Parsuje i waliduje odpowiedź JSON z modelu LLM.

```typescript
function parseLLMResponse(
  response: string, 
  roles: Role[]
): AIRecommendation[]
```

#### Kroki walidacji

1. **Czyszczenie odpowiedzi** - usuwanie markdown code blocks (```` ```json ````)
2. **Parsowanie JSON** - `JSON.parse()`
3. **Walidacja struktury** - sprawdzenie `recommendations` array
4. **Walidacja role_id** - czy istnieje w bazie
5. **Walidacja unikalności** - 2 różne role
6. **Walidacja justification** - minimum 30 znaków

### 4.4. `extractTextFromPDFWithVision()` - Ekstrakcja CV

Używa modeli vision do ekstrakcji tekstu z PDF (obsługuje skany).

```typescript
async function extractTextFromPDFWithVision(
  apiKey: string, 
  arrayBuffer: ArrayBuffer
): Promise<string>
```

#### Format żądania multimodal

```typescript
const requestBody = {
  model: visionModel,
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: extractionPrompt },
        { 
          type: 'image_url', 
          image_url: { 
            url: `data:application/pdf;base64,${base64PDF}` 
          } 
        },
      ],
    },
  ],
  plugins: [
    {
      id: 'file-parser',
      pdf: { engine: 'native' },  // Natywne przetwarzanie PDF
    },
  ],
  temperature: 0.1,               // Niska temperatura dla dokładności
  max_tokens: 4000,               // Więcej tokenów dla długich CV
};
```

### 4.5. `extractTextFromPDFBasic()` - Fallback ekstrakcja

Podstawowa ekstrakcja tekstu z PDF za pomocą regex (tylko dla tekstowych PDF).

```typescript
function extractTextFromPDFBasic(arrayBuffer: ArrayBuffer): string
```

---

## 5. Obsługa błędów

### 5.1. Kody błędów aplikacji

| Kod błędu | HTTP Status | Opis | Akcja użytkownika |
|-----------|-------------|------|-------------------|
| `AUTH_ERROR` | 401 | Brak/nieprawidłowy token | Zaloguj się ponownie |
| `QUESTIONNAIRE_INCOMPLETE` | 400 | Nie wszystkie pytania wypełnione | Uzupełnij kwestionariusz |
| `RECOMMENDATIONS_EXIST` | 409 | Rekomendacje już wygenerowane | - (nie można powtórzyć) |
| `INTERNAL_ERROR` | 500 | Błąd serwera/AI | Spróbuj ponownie później |

### 5.2. Błędy OpenRouter API

| HTTP Status | Przyczyna | Obsługa |
|-------------|-----------|---------|
| 429 | Rate limit (za dużo żądań) | Automatyczny fallback na kolejny model |
| 404 | Model niedostępny | Automatyczny fallback na kolejny model |
| 400 | Nieprawidłowe żądanie | Log + INTERNAL_ERROR |
| 401 | Nieprawidłowy API key | Log + INTERNAL_ERROR |
| 500+ | Błąd serwera OpenRouter | Fallback lub INTERNAL_ERROR |

### 5.3. Błędy parsowania odpowiedzi

```typescript
// Scenariusze błędów parsowania
try {
  const parsed = JSON.parse(cleanResponse);
} catch (e) {
  throw new Error('Invalid JSON response from AI model');
}

if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
  throw new Error('Invalid response format: missing recommendations array');
}

if (parsed.recommendations.length < 2) {
  throw new Error('Expected 2 recommendations, got ' + parsed.recommendations.length);
}

const validRole = roles.find(r => r.id === rec.role_id);
if (!validRole) {
  throw new Error(`Invalid role_id: ${rec.role_id}`);
}

if (!rec.justification || rec.justification.length < 30) {
  throw new Error('Justification is too short or missing');
}
```

### 5.4. Strategia retry

```typescript
// Wbudowana w callOpenRouter() - iteracja po modelach
// Zewnętrzny retry NIE jest implementowany (pojedyncze wywołanie Edge Function)

// Rekomendacja dla klienta:
// - Wyświetl komunikat błędu z przyciskiem "Spróbuj ponownie"
// - Nie implementuj automatycznego retry (może powodować duplikaty)
```

---

## 6. Kwestie bezpieczeństwa

### 6.1. Ochrona klucza API

```typescript
// ✅ DOBRZE: Klucz pobierany z env w Edge Function
const apiKey = Deno.env.get('OPENROUTER_API_KEY');

// ❌ ŹLE: Klucz hardcoded lub w frontend
const apiKey = 'sk-or-...';  // NIGDY!
```

**Konfiguracja:**
- Klucz przechowywany w Supabase Secrets (Dashboard → Edge Functions → Secrets)
- Nigdy nie commitowany do repozytorium
- `.env.example` zawiera tylko placeholder

### 6.2. Walidacja danych wejściowych

```typescript
// 1. Walidacja user_id
if (!requestBody.user_id) {
  // Próba odczytu z JWT header
}

// 2. Walidacja kompletności kwestionariusza
const requiredFields = [
  'work_style', 'client_interaction', 'aesthetic_focus',
  'teamwork_preference', 'problem_solving_approach',
  'leadership_preference', 'technical_depth', 'data_vs_design',
  'coding_interest', 'uncertainty_handling'
];
const missingFields = requiredFields.filter(f => !responses[f]);

// 3. Walidacja odpowiedzi AI przed zapisem
if (validatedRecommendations.length < 2) {
  throw new Error('Could not validate 2 unique recommendations');
}
```

### 6.3. Ochrona przed duplikatami

```typescript
// Sprawdzenie przed generowaniem
if (profile.ai_recommendations) {
  return new Response(
    JSON.stringify({ 
      error: 'RECOMMENDATIONS_EXIST',
      message: 'AI recommendations have already been generated for this user' 
    }),
    { status: 409, ... }
  );
}
```

### 6.4. CORS

```typescript
// supabase/functions/_shared/cors.ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',  // W produkcji: konkretna domena
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Obsługa preflight
if (req.method === 'OPTIONS') {
  return new Response('ok', { headers: corsHeaders });
}
```

### 6.5. Limity

| Element | Limit | Powód |
|---------|-------|-------|
| CV file size | 3 MB | Ochrona przed DoS |
| CV text extracted | 4000 chars | Limit kontekstu LLM |
| Justification min | 30 chars | Walidacja jakości |
| max_tokens | 1000 | Kontrola kosztów |

---

## 7. Plan wdrożenia krok po kroku

### Krok 1: Konfiguracja środowiska

```powershell
# 1.1. Utwórz plik .env (lokalnie)
Copy-Item .env.example .env

# 1.2. Dodaj klucz OpenRouter do .env
# OPENROUTER_API_KEY=sk-or-v1-xxxxx

# 1.3. Skonfiguruj Supabase CLI
npx supabase login
npx supabase link --project-ref your-project-ref

# 1.4. Dodaj secret do Supabase
npx supabase secrets set OPENROUTER_API_KEY=sk-or-v1-xxxxx
```

### Krok 2: Struktura plików Edge Function

```
supabase/
├── functions/
│   ├── _shared/
│   │   └── cors.ts           # Nagłówki CORS
│   └── generate-recommendation/
│       └── index.ts          # Główna funkcja
└── config.toml               # Konfiguracja env
```

### Krok 3: Implementacja typów

```typescript
// W index.ts lub osobnym types.ts

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
  leadership_preference?: string;
  technical_depth?: string;
  data_vs_design?: string;
  coding_interest?: string;
  uncertainty_handling?: string;
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
```

### Krok 4: Implementacja głównego handlera

```typescript
import { createClient } from '@supabase/supabase-js';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // 4.1. Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 4.2. Pobierz klucze z env
    const openrouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!openrouterApiKey) {
      throw new Error('OPENROUTER_API_KEY not configured');
    }

    // 4.3. Utwórz klienta Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 4.4. Pobierz user_id (z body lub JWT)
    // ... (patrz istniejąca implementacja)

    // 4.5. Wykonaj logikę biznesową
    // ... (fetch profile, validate, build prompt, call API, save)

    // 4.6. Zwróć wynik
    return new Response(
      JSON.stringify({ success: true, recommendations, generated_at }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'INTERNAL_ERROR', message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### Krok 5: Implementacja `buildPrompt()`

```typescript
function buildPrompt(
  questions: QuestionnaireQuestion[],
  responses: QuestionnaireResponses,
  roles: Role[],
  cvText: string
): string {
  // 5.1. Buduj sekcję z odpowiedziami (z labelami)
  const questionnaireSection = questions.map(q => {
    const selectedValue = responses[q.field_name];
    const selectedOption = q.questionnaire_options.find(
      opt => opt.option_value === selectedValue
    );
    const answerLabel = selectedOption?.option_label ?? selectedValue ?? 'Brak odpowiedzi';
    return `- ${q.question_text}\n  Odpowiedź: ${answerLabel}`;
  }).join('\n\n');

  // 5.2. Buduj sekcję ról
  const rolesSection = roles.map((r, idx) => 
    `${idx + 1}. ${r.name} (ID: ${r.id})\n   ${r.description}`
  ).join('\n\n');

  // 5.3. Sekcja open_answer
  const openAnswerSection = responses.open_answer?.trim()
    ? `DODATKOWE INFORMACJE OD KANDYDATA:\n"${responses.open_answer.trim()}"`
    : 'DODATKOWE INFORMACJE: Kandydat nie dodał dodatkowych informacji.';

  // 5.4. Sekcja CV
  const cvSection = cvText 
    ? `CV KANDYDATA:\n${cvText}`
    : 'CV: Nie przesłano CV.';

  // 5.5. Złóż pełny prompt
  return `[SYSTEM CONTEXT + INSTRUCTIONS]...
  
DOSTĘPNE ROLE:
${rolesSection}

ANKIETA KANDYDATA:
${questionnaireSection}

${openAnswerSection}

${cvSection}

INSTRUKCJE ODPOWIEDZI:
Odpowiedz WYŁĄCZNIE w formacie JSON:
{
  "recommendations": [
    { "role_id": <number>, "role_name": "<string>", "justification": "<string>" },
    { "role_id": <number>, "role_name": "<string>", "justification": "<string>" }
  ]
}`;
}
```

### Krok 6: Implementacja `callOpenRouter()` z fallback

```typescript
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const TEXT_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemma-3-27b-it:free',
  // ... więcej modeli
];

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
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (response.status === 429 || response.status === 404) {
        console.warn(`Model ${model} unavailable, trying next...`);
        lastError = new Error(`${model} unavailable`);
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('No response from OpenRouter');
      }

      console.log(`Successfully used model: ${model}`);
      return data.choices[0].message.content;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Model ${model} failed:`, lastError.message);
    }
  }

  throw lastError ?? new Error('All models failed');
}
```

### Krok 7: Implementacja `parseLLMResponse()`

```typescript
function parseLLMResponse(response: string, roles: Role[]): AIRecommendation[] {
  // 7.1. Usuń markdown code blocks
  let cleanResponse = response.trim();
  if (cleanResponse.startsWith('```json')) cleanResponse = cleanResponse.slice(7);
  if (cleanResponse.startsWith('```')) cleanResponse = cleanResponse.slice(3);
  if (cleanResponse.endsWith('```')) cleanResponse = cleanResponse.slice(0, -3);
  cleanResponse = cleanResponse.trim();

  // 7.2. Parse JSON
  let parsed: LLMResponse;
  try {
    parsed = JSON.parse(cleanResponse);
  } catch (e) {
    console.error('Failed to parse LLM response:', cleanResponse);
    throw new Error('Invalid JSON response from AI model');
  }

  // 7.3. Walidacja struktury
  if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
    throw new Error('Invalid response format: missing recommendations array');
  }

  if (parsed.recommendations.length < 2) {
    throw new Error('Expected 2 recommendations');
  }

  // 7.4. Walidacja każdej rekomendacji
  const validatedRecommendations: AIRecommendation[] = [];
  const usedRoleIds = new Set<number>();

  for (const rec of parsed.recommendations.slice(0, 2)) {
    // Znajdź rolę po ID lub nazwie
    let validRole = roles.find(r => r.id === rec.role_id);
    
    if (!validRole) {
      validRole = roles.find(r => 
        r.name.toLowerCase() === rec.role_name?.toLowerCase()
      );
    }

    if (!validRole) {
      throw new Error(`Invalid role_id: ${rec.role_id}`);
    }

    // Sprawdź unikalność
    if (usedRoleIds.has(validRole.id)) continue;
    usedRoleIds.add(validRole.id);

    // Sprawdź justification
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
```

### Krok 8: Implementacja ekstrakcji CV (vision)

```typescript
async function extractTextFromPDFWithVision(
  apiKey: string, 
  arrayBuffer: ArrayBuffer
): Promise<string> {
  const base64PDF = arrayBufferToBase64(arrayBuffer);
  const pdfDataUrl = `data:application/pdf;base64,${base64PDF}`;

  const extractionPrompt = `Wyciągnij CAŁY tekst z tego CV/dokumentu PDF. 
Zwróć tylko sam tekst, bez żadnych komentarzy ani formatowania markdown.
Zachowaj strukturę (sekcje, listy) używając zwykłego tekstu i nowych linii.`;

  for (const model of VISION_MODELS) {
    try {
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
          plugins: [
            { id: 'file-parser', pdf: { engine: 'native' } },
          ],
          temperature: 0.1,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        if ([429, 404, 400].includes(response.status)) continue;
        throw new Error(`Vision API error: ${response.status}`);
      }

      const data = await response.json();
      const extractedText = data.choices[0]?.message?.content?.trim() ?? '';
      
      return extractedText.substring(0, 4000);

    } catch (error) {
      console.warn(`Vision model ${model} failed:`, error);
    }
  }

  return '';  // Fallback - brak tekstu z CV
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
```

### Krok 9: Deployment

```powershell
# 9.1. Deploy funkcji
npx supabase functions deploy generate-recommendation

# 9.2. Sprawdź logi
npx supabase functions logs generate-recommendation --tail

# 9.3. Test endpoint
$headers = @{
    "Content-Type" = "application/json"
    "apikey" = $env:VITE_SUPABASE_ANON_KEY
}
$body = '{"user_id": "00000000-0000-0000-0000-000000000001"}'

Invoke-RestMethod -Method POST `
    -Uri "$env:VITE_SUPABASE_URL/functions/v1/generate-recommendation" `
    -Headers $headers `
    -Body $body
```

### Krok 10: Monitoring i Debugowanie

```powershell
# 10.1. Sprawdź logi błędów
npx supabase functions logs generate-recommendation --level error

# 10.2. Dashboard OpenRouter
# https://openrouter.ai/activity - sprawdź użycie i koszty

# 10.3. Dashboard Supabase
# https://supabase.com/dashboard/project/xxx/functions - metryki wywołań
```

---

## 8. Przykłady użycia response_format (structured outputs)

### 8.1. Aktualny format (JSON w prompt)

Obecna implementacja używa instrukcji w prompt zamiast `response_format`:

```typescript
// W prompt:
`INSTRUKCJE ODPOWIEDZI:
Odpowiedz WYŁĄCZNIE w formacie JSON:
{
  "recommendations": [...]
}`
```

### 8.2. Alternatywa z response_format (JSON Schema)

OpenRouter wspiera `response_format` dla modeli, które go obsługują:

```typescript
const requestBody = {
  model: 'openai/gpt-4o-mini',  // Model wspierający JSON mode
  messages: [{ role: 'user', content: prompt }],
  response_format: {
    type: 'json_schema',
    json_schema: {
      name: 'career_recommendations',
      strict: true,
      schema: {
        type: 'object',
        properties: {
          recommendations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                role_id: { type: 'integer' },
                role_name: { type: 'string' },
                justification: { 
                  type: 'string',
                  minLength: 30,
                  maxLength: 500
                }
              },
              required: ['role_id', 'role_name', 'justification']
            },
            minItems: 2,
            maxItems: 2
          }
        },
        required: ['recommendations']
      }
    }
  },
  temperature: 0.7,
  max_tokens: 1000,
};
```

**Uwaga:** Nie wszystkie modele free wspierają `response_format`. W obecnej implementacji używamy instrukcji w prompt dla kompatybilności z różnymi modelami.

---

## 9. Checklist wdrożenia

- [x] Utworzenie struktury folderów (`supabase/functions/`)
- [x] Implementacja `cors.ts`
- [x] Implementacja typów TypeScript
- [x] Implementacja głównego handlera
- [x] Implementacja `buildPrompt()`
- [x] Implementacja `callOpenRouter()` z fallback
- [x] Implementacja `parseLLMResponse()`
- [x] Implementacja `extractTextFromPDFWithVision()`
- [x] Konfiguracja zmiennych środowiskowych
- [x] Deploy do Supabase Cloud
- [ ] Konfiguracja monitoringu kosztów OpenRouter
- [ ] Konfiguracja alertów na błędy

---

## 10. Przyszłe ulepszenia

1. **Caching odpowiedzi** - Redis/KV dla identycznych zapytań
2. **Queue system** - Kolejka dla długich operacji
3. **Streaming responses** - SSE dla real-time feedback
4. **A/B testing modeli** - Porównanie jakości różnych modeli
5. **Cost tracking** - Śledzenie kosztów per user/session
6. **Rate limiting per user** - Ochrona przed nadużyciami

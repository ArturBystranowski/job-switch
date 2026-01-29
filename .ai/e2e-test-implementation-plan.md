# Plan Implementacji Testu E2E - JobSwitch

## 1. Przegląd

### 1.1 Cel dokumentu

Dokument opisuje szczegółowy plan implementacji pierwszego testu E2E dla aplikacji JobSwitch przy użyciu **Playwright**. Test pokrywa główny przepływ użytkownika od rejestracji do wyświetlenia roadmapy.

### 1.2 Wybrany scenariusz testowy

**Scenariusz:** Pełny przepływ użytkownika - od rejestracji do wyświetlenia roadmapy

**Opis:** Test weryfikuje kompletny happy path użytkownika:

1. Rejestracja nowego użytkownika – po udanej rejestracji użytkownik jest od razu zalogowany i widzi homepage (`/`)
2. Kliknięcie przycisku „Rozpocznij” na stronie głównej – przejście do kwestionariusza
3. Wypełnienie kwestionariusza preferencji (5 pytań + opcjonalne otwarte)
4. Upload pliku CV (PDF)
5. Oczekiwanie na wygenerowanie rekomendacji przez AI
6. Przegląd dwóch rekomendowanych ról
7. Wybór jednej roli
8. Wyświetlenie roadmapy z 10 krokami

**Zachowanie po rejestracji:** Po udanej rejestracji użytkownik jest od razu zalogowany i trafia na homepage (`/`). Aby przejść do kwestionariusza, musi kliknąć przycisk „Rozpocznij” na stronie głównej.

**Kryteria akceptacji:**

- Użytkownik może zarejestrować się z poprawnymi danymi
- Po rejestracji użytkownik widzi homepage i klika „Rozpocznij”, aby przejść do kwestionariusza
- Formularz kwestionariusza działa poprawnie dla wszystkich pytań
- Upload CV akceptuje tylko pliki PDF do 3MB
- Rekomendacje są wygenerowane i wyświetlone poprawnie
- Wybór roli jest zapisany i nie można go zmienić
- Roadmapa jest wyświetlona z poprawną strukturą kroków

---

## 2. Konfiguracja środowiska testowego

### 2.1 Instalacja zależności

```bash
npm install -D @playwright/test
npm install -D dotenv
```

### 2.2 Konfiguracja Playwright (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

### 2.3 Konfiguracja bazy testowej (`.env.test`)

```env
# Supabase Test Project
SUPABASE_URL=https://your-test-project.supabase.co
SUPABASE_PUBLIC_KEY=your-test-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-test-service-role-key

# E2E Test User Credentials
E2E_USERNAME=test-user@example.com
E2E_PASSWORD=TestPassword123!
E2E_USER_ID=uuid-of-test-user

# Application URL
E2E_BASE_URL=http://localhost:5173
```

**Uwagi:**

- `.env.test` powinien być dodany do `.gitignore` i `.cursorignore`
- Wymagany jest dedykowany projekt Supabase dla testów E2E (zgodnie z rekomendacją z materiałów szkoleniowych)
- Przed uruchomieniem testów należy wykonać migracje na bazę testową: `supabase link --project-ref <project-ref>` i `supabase db push`

### 2.4 Struktura folderów

```
e2e/
├── page-objects/
│   ├── LandingPage.ts
│   ├── RegisterPage.ts
│   ├── LoginPage.ts
│   ├── QuestionnairePage.ts
│   ├── UploadCVPage.ts
│   ├── RecommendationsPage.ts
│   └── RoadmapPage.ts
├── fixtures/
│   └── test-data.ts
├── utils/
│   ├── auth.ts
│   └── cleanup.ts
├── global-setup.ts
├── global-teardown.ts
└── user-journey.spec.ts
```

---

## 3. Identyfikacja elementów UI i dodanie selektorów

### 3.1 Zasady dodawania `data-testid`

**Ważne:** Selektory `data-testid` powinny być dodawane **wewnątrz komponentów**, a nie w miejscu ich użycia, aby zapewnić największą kompatybilność i precyzję działania testów.

**Konwencja nazewnictwa:**

- Używaj camelCase: `data-testid="registerButton"`
- Bądź opisowy: `data-testid="questionnaireNextButton"` zamiast `data-testid="next"`
- Grupuj logicznie: `data-testid="roleCard-frontend"` dla kart ról

### 3.2 Lista komponentów wymagających selektorów

#### 3.2.1 LandingPage (`src/pages/LandingPage/LandingPage.tsx`)

- `data-testid="landing-hero"`
- `data-testid="landing-start-button"` - przycisk "Rozpocznij"

#### 3.2.2 RegisterPage (`src/pages/auth/RegisterPage/RegisterPage.tsx`)

- `data-testid="register-form"`
- `data-testid="register-email-input"`
- `data-testid="register-password-input"`
- `data-testid="register-confirm-password-input"`
- `data-testid="register-submit-button"`
- `data-testid="register-error-message"` - komunikat błędu

#### 3.2.3 LoginPage (`src/pages/auth/LoginPage/LoginPage.tsx`)

- `data-testid="login-form"`
- `data-testid="login-email-input"`
- `data-testid="login-password-input"`
- `data-testid="login-submit-button"`

#### 3.2.4 QuestionnairePage (`src/pages/QuestionnairePage/QuestionnairePage.tsx`)

- `data-testid="questionnaire-stepper"`
- `data-testid="questionnaire-card"`
- `data-testid="questionnaire-option-{value}"` - opcje odpowiedzi
- `data-testid="questionnaire-back-button"`
- `data-testid="questionnaire-next-button"`
- `data-testid="questionnaire-open-answer-input"` - pole otwartej odpowiedzi (opcjonalne)

#### 3.2.5 UploadCVPage (`src/pages/UploadCVPage/UploadCVPage.tsx`)

- `data-testid="cv-dropzone"`
- `data-testid="cv-file-input"` - ukryty input file
- `data-testid="cv-upload-button"`
- `data-testid="cv-error-message"`

#### 3.2.6 RecommendationsPage (`src/pages/RecommendationsPage/RecommendationsPage.tsx`)

- `data-testid="recommendations-container"`
- `data-testid="recommendations-loading"` - loader podczas generowania
- `data-testid="role-card-{roleId}"` - karty ról
- `data-testid="role-select-button-{roleId}"` - przycisk wyboru roli
- `data-testid="role-justification-{roleId}"` - uzasadnienie roli

#### 3.2.7 RoadmapPage (`src/pages/RoadmapPage/RoadmapPage.tsx`)

- `data-testid="roadmap-container"`
- `data-testid="roadmap-progress-header"`
- `data-testid="roadmap-progress-percentage"`
- `data-testid="roadmap-step-{stepNumber}"` - kroki roadmapy
- `data-testid="roadmap-step-variant-{stepNumber}-{variantNumber}"` - warianty kroków
- `data-testid="roadmap-task-checkbox-{taskId}"` - checkboxy zadań

---

## 4. Implementacja Page Object Model

### 4.1 LandingPage (`e2e/page-objects/LandingPage.ts`)

```typescript
import { Page, Locator } from '@playwright/test';

export class LandingPage {
  readonly page: Page;
  readonly hero: Locator;
  readonly startButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.hero = page.getByTestId('landing-hero');
    this.startButton = page.getByTestId('landing-start-button');
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickStart() {
    await this.startButton.click();
  }
}
```

### 4.2 RegisterPage (`e2e/page-objects/RegisterPage.ts`)

```typescript
import { Page, Locator } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('register-email-input');
    this.passwordInput = page.getByTestId('register-password-input');
    this.confirmPasswordInput = page.getByTestId(
      'register-confirm-password-input'
    );
    this.submitButton = page.getByTestId('register-submit-button');
    this.errorMessage = page.getByTestId('register-error-message');
  }

  async goto() {
    await this.page.goto('/register');
  }

  async fillForm(email: string, password: string, confirmPassword: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
  }

  async submit() {
    await this.submitButton.click();
  }

  async register(email: string, password: string) {
    await this.fillForm(email, password, password);
    await this.submit();
  }
}
```

### 4.3 QuestionnairePage (`e2e/page-objects/QuestionnairePage.ts`)

```typescript
import { Page, Locator } from '@playwright/test';

export class QuestionnairePage {
  readonly page: Page;
  readonly stepper: Locator;
  readonly questionCard: Locator;
  readonly backButton: Locator;
  readonly nextButton: Locator;
  readonly openAnswerInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.stepper = page.getByTestId('questionnaire-stepper');
    this.questionCard = page.getByTestId('questionnaire-card');
    this.backButton = page.getByTestId('questionnaire-back-button');
    this.nextButton = page.getByTestId('questionnaire-next-button');
    this.openAnswerInput = page.getByTestId('questionnaire-open-answer-input');
  }

  async goto() {
    await this.page.goto('/questionnaire');
  }

  async selectOption(value: string) {
    await this.page.getByTestId(`questionnaire-option-${value}`).click();
  }

  async clickNext() {
    await this.nextButton.click();
  }

  async clickBack() {
    await this.backButton.click();
  }

  async fillOpenAnswer(text: string) {
    await this.openAnswerInput.fill(text);
  }

  async completeQuestionnaire(
    responses: Record<string, string>,
    openAnswer?: string
  ) {
    for (const [field, value] of Object.entries(responses)) {
      await this.selectOption(value);
      await this.clickNext();
    }

    if (openAnswer) {
      await this.fillOpenAnswer(openAnswer);
    }

    await this.clickNext(); // Submit questionnaire
  }
}
```

### 4.4 UploadCVPage (`e2e/page-objects/UploadCVPage.ts`)

```typescript
import { Page, Locator } from '@playwright/test';

export class UploadCVPage {
  readonly page: Page;
  readonly dropzone: Locator;
  readonly fileInput: Locator;
  readonly uploadButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dropzone = page.getByTestId('cv-dropzone');
    this.fileInput = page.getByTestId('cv-file-input');
    this.uploadButton = page.getByTestId('cv-upload-button');
    this.errorMessage = page.getByTestId('cv-error-message');
  }

  async goto() {
    await this.page.goto('/upload-cv');
  }

  async uploadFile(filePath: string) {
    await this.fileInput.setInputFiles(filePath);
  }

  async waitForUploadComplete() {
    // Wait for navigation to recommendations page or success message
    await this.page.waitForURL('/recommendations', { timeout: 60000 });
  }
}
```

### 4.5 RecommendationsPage (`e2e/page-objects/RecommendationsPage.ts`)

```typescript
import { Page, Locator } from '@playwright/test';

export class RecommendationsPage {
  readonly page: Page;
  readonly container: Locator;
  readonly loadingIndicator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId('recommendations-container');
    this.loadingIndicator = page.getByTestId('recommendations-loading');
  }

  async goto() {
    await this.page.goto('/recommendations');
  }

  async waitForRecommendations(timeout = 60000) {
    // Wait for loading to disappear and recommendations to appear
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout });
    await this.container.waitFor({ state: 'visible', timeout });
  }

  getRoleCard(roleId: string): Locator {
    return this.page.getByTestId(`role-card-${roleId}`);
  }

  getRoleSelectButton(roleId: string): Locator {
    return this.page.getByTestId(`role-select-button-${roleId}`);
  }

  getRoleJustification(roleId: string): Locator {
    return this.page.getByTestId(`role-justification-${roleId}`);
  }

  async selectRole(roleId: string) {
    await this.getRoleSelectButton(roleId).click();
    // Handle confirmation dialog if present
    await this.page.getByRole('button', { name: /potwierdź|confirm/i }).click();
  }

  async getRecommendedRoles(): Promise<string[]> {
    const roleCards = await this.page
      .locator('[data-testid^="role-card-"]')
      .all();
    return Promise.all(
      roleCards.map(async (card) => {
        const testId = await card.getAttribute('data-testid');
        return testId?.replace('role-card-', '') ?? '';
      })
    );
  }
}
```

### 4.6 RoadmapPage (`e2e/page-objects/RoadmapPage.ts`)

```typescript
import { Page, Locator } from '@playwright/test';

export class RoadmapPage {
  readonly page: Page;
  readonly container: Locator;
  readonly progressHeader: Locator;
  readonly progressPercentage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId('roadmap-container');
    this.progressHeader = page.getByTestId('roadmap-progress-header');
    this.progressPercentage = page.getByTestId('roadmap-progress-percentage');
  }

  async goto() {
    await this.page.goto('/roadmap');
  }

  getStep(stepNumber: number): Locator {
    return this.page.getByTestId(`roadmap-step-${stepNumber}`);
  }

  getStepVariant(stepNumber: number, variantNumber: number): Locator {
    return this.page.getByTestId(
      `roadmap-step-variant-${stepNumber}-${variantNumber}`
    );
  }

  getTaskCheckbox(taskId: string): Locator {
    return this.page.getByTestId(`roadmap-task-checkbox-${taskId}`);
  }

  async waitForRoadmapLoaded() {
    await this.container.waitFor({ state: 'visible', timeout: 30000 });
  }

  async getProgressPercentage(): Promise<string> {
    return (await this.progressPercentage.textContent()) ?? '0%';
  }
}
```

---

## 5. Implementacja testu głównego

### 5.1 Test Data (`e2e/fixtures/test-data.ts`)

```typescript
export const testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'TestPassword123!',
};

export const questionnaireResponses = {
  work_style: 'independent',
  client_interaction: 'minimal',
  aesthetic_focus: 'low',
  teamwork_preference: 'medium',
  problem_solving_approach: 'analytical',
  leadership_preference: 'executor',
  technical_depth: 'deep',
  data_vs_design: 'data',
  coding_interest: 'daily_coding',
  uncertainty_handling: 'stability',
};

export const testCVPath = './e2e/fixtures/sample-cv.pdf';
```

### 5.2 Auth Utilities (`e2e/utils/auth.ts`)

```typescript
import { Page } from '@playwright/test';
import { RegisterPage } from '../page-objects/RegisterPage';
import { LoginPage } from '../page-objects/LoginPage';

export async function registerUser(
  page: Page,
  email: string,
  password: string
) {
  const registerPage = new RegisterPage(page);
  await registerPage.goto();
  await registerPage.register(email, password);
  // After successful registration user is logged in and redirected to homepage
  await page.waitForURL('/', { timeout: 10000 });
}

export async function loginUser(page: Page, email: string, password: string) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(email, password);
  // Wait for redirect after login (questionnaire or other app route)
  await page.waitForURL(/\/(questionnaire|recommendations|roadmap)/, {
    timeout: 10000,
  });
}
```

### 5.3 Główny test (`e2e/user-journey.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';
import { LandingPage } from './page-objects/LandingPage';
import { RegisterPage } from './page-objects/RegisterPage';
import { QuestionnairePage } from './page-objects/QuestionnairePage';
import { UploadCVPage } from './page-objects/UploadCVPage';
import { RecommendationsPage } from './page-objects/RecommendationsPage';
import { RoadmapPage } from './page-objects/RoadmapPage';
import {
  testUser,
  questionnaireResponses,
  testCVPath,
} from './fixtures/test-data';
import { registerUser, loginUser } from './utils/auth';

test.describe('User Journey - Registration to Roadmap', () => {
  test('complete user journey from registration to roadmap display', async ({
    page,
  }) => {
    // ARRANGE
    const landingPage = new LandingPage(page);
    const registerPage = new RegisterPage(page);
    const questionnairePage = new QuestionnairePage(page);
    const uploadCVPage = new UploadCVPage(page);
    const recommendationsPage = new RecommendationsPage(page);
    const roadmapPage = new RoadmapPage(page);

    // ACT & ASSERT - Step 1: Landing Page
    await landingPage.goto();
    await expect(landingPage.hero).toBeVisible();
    await landingPage.clickStart();

    // Step 2: Registration (user is immediately logged in and redirected to homepage)
    await expect(page).toHaveURL(/\/(login|register)/);
    await registerPage.register(testUser.email, testUser.password);
    await expect(page).toHaveURL('/', { timeout: 15000 });

    // Step 3: Start questionnaire from homepage (click "Rozpocznij")
    await expect(landingPage.hero).toBeVisible();
    await landingPage.clickStart();
    await page.waitForURL(/\/(questionnaire|recommendations|roadmap)/, {
      timeout: 15000,
    });

    // Step 4: Questionnaire
    await expect(page).toHaveURL('/questionnaire');
    await expect(questionnairePage.stepper).toBeVisible();

    // Complete questionnaire with all required responses
    await questionnairePage.completeQuestionnaire(questionnaireResponses);

    // Wait for navigation to upload CV page
    await expect(page).toHaveURL('/upload-cv', { timeout: 10000 });

    // Step 5: Upload CV
    await expect(uploadCVPage.dropzone).toBeVisible();
    await uploadCVPage.uploadFile(testCVPath);
    await uploadCVPage.waitForUploadComplete();

    // Step 6: Wait for recommendations
    await expect(page).toHaveURL('/recommendations');
    await recommendationsPage.waitForRecommendations();

    // Verify recommendations are displayed
    const roles = await recommendationsPage.getRecommendedRoles();
    expect(roles.length).toBe(2);

    // Verify role cards are visible
    for (const roleId of roles) {
      await expect(recommendationsPage.getRoleCard(roleId)).toBeVisible();
      await expect(
        recommendationsPage.getRoleJustification(roleId)
      ).toBeVisible();
    }

    // Step 7: Select a role
    const selectedRoleId = roles[0];
    await recommendationsPage.selectRole(selectedRoleId);

    // Step 8: Verify roadmap is displayed
    await expect(page).toHaveURL('/roadmap', { timeout: 10000 });
    await roadmapPage.waitForRoadmapLoaded();

    // Verify roadmap structure
    await expect(roadmapPage.container).toBeVisible();
    await expect(roadmapPage.progressHeader).toBeVisible();

    // Verify progress percentage is displayed
    const progressText = await roadmapPage.getProgressPercentage();
    expect(progressText).toMatch(/\d+%/);

    // Verify at least one step is visible
    const step1 = roadmapPage.getStep(1);
    await expect(step1).toBeVisible({ timeout: 5000 });
  });
});
```

---

## 6. Global Setup i Teardown

### 6.1 Global Setup (`e2e/global-setup.ts`)

```typescript
import { chromium, FullConfig } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

async function globalSetup(config: FullConfig) {
  // Verify test database connection
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_PUBLIC_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_PUBLIC_KEY in .env.test');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Test connection
  const { error } = await supabase.from('profiles').select('count').limit(1);
  if (error) {
    console.warn('Warning: Could not connect to test database:', error.message);
  }

  console.log('Global setup completed');
}

export default globalSetup;
```

### 6.2 Global Teardown (`e2e/global-teardown.ts`)

```typescript
import { FullConfig } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

async function globalTeardown(config: FullConfig) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY - skipping cleanup'
    );
    return;
  }

  // Use service role key for admin operations
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Sign in as test user to clean up their data
  const testEmail = process.env.E2E_USERNAME;
  const testPassword = process.env.E2E_PASSWORD;

  if (testEmail && testPassword) {
    const { data: authData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

    if (!signInError && authData.user) {
      const userId = authData.user.id;

      // Clean up user data (order matters due to foreign keys)
      await supabase.from('user_progress').delete().eq('user_id', userId);
      await supabase.from('profiles').delete().eq('id', userId);

      // Note: Auth user deletion might require admin API
      console.log(`Cleaned up data for user: ${userId}`);
    }
  }

  console.log('Global teardown completed');
}

export default globalTeardown;
```

**Aktualizacja `playwright.config.ts`:**

```typescript
export default defineConfig({
  // ... existing config
  globalSetup: require.resolve('./e2e/global-setup.ts'),
  globalTeardown: require.resolve('./e2e/global-teardown.ts'),
});
```

---

## 7. Przygotowanie danych testowych

### 7.1 Przykładowy plik CV (`e2e/fixtures/sample-cv.pdf`)

Wymagany jest przykładowy plik PDF z CV do testów. Plik powinien:

- Mieć rozmiar < 1MB
- Zawierać przykładowe dane zawodowe
- Być w formacie PDF

**Uwaga:** Plik powinien być dodany do repozytorium lub generowany dynamicznie w setup.

### 7.2 Seed danych testowych

Przed uruchomieniem testów należy upewnić się, że:

- Baza testowa ma zastosowane migracje (`supabase db push`)
- Tabela `questionnaire_config` zawiera wymagane pytania
- Tabela `roles` zawiera dostępne role IT
- Edge Function `generate-recommendation` jest wdrożona i działa

---

## 8. Skrypty w package.json

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:report": "playwright show-report"
  }
}
```

---

## 9. Kolejność implementacji

### Faza 1: Konfiguracja środowiska (1-2h)

1. ✅ Instalacja Playwright i zależności
2. ✅ Konfiguracja `playwright.config.ts`
3. ✅ Utworzenie `.env.test` z danymi testowej bazy
4. ✅ Linkowanie bazy testowej i zastosowanie migracji

### Faza 2: Dodanie selektorów do komponentów (2-3h)

1. ✅ Dodanie `data-testid` do LandingPage
2. ✅ Dodanie `data-testid` do RegisterPage i LoginPage
3. ✅ Dodanie `data-testid` do QuestionnairePage
4. ✅ Dodanie `data-testid` do UploadCVPage
5. ✅ Dodanie `data-testid` do RecommendationsPage
6. ✅ Dodanie `data-testid` do RoadmapPage

### Faza 3: Implementacja Page Objects (2-3h)

1. ✅ LandingPage
2. ✅ RegisterPage i LoginPage
3. ✅ QuestionnairePage
4. ✅ UploadCVPage
5. ✅ RecommendationsPage
6. ✅ RoadmapPage

### Faza 4: Implementacja testu głównego (2-3h)

1. ✅ Utworzenie fixtures z danymi testowymi
2. ✅ Implementacja utilities (auth helpers)
3. ✅ Implementacja głównego testu user-journey
4. ✅ Dodanie global setup i teardown

### Faza 5: Weryfikacja i optymalizacja (1-2h)

1. ✅ Uruchomienie testu i naprawa błędów
2. ✅ Optymalizacja timeoutów i oczekiwań
3. ✅ Dodanie screenshotów dla błędów
4. ✅ Dokumentacja uruchamiania testów

---

## 10. Potencjalne problemy i rozwiązania

### 10.1 Problem: Długi czas generowania rekomendacji przez AI

**Rozwiązanie:** Zwiększyć timeout dla `waitForRecommendations()` do 60-90 sekund. Rozważyć mockowanie odpowiedzi AI w testach deweloperskich.

### 10.2 Problem: Flakiness związany z animacjami UI

**Rozwiązanie:** Używać `waitFor` z odpowiednimi opcjami zamiast `waitForTimeout`. Czekać na konkretne stany elementów.

### 10.3 Problem: Konflikty danych między równoległymi testami

**Rozwiązanie:** Używać unikalnych emaili (timestamp) dla każdego testu. Rozważyć izolację przez browser contexts.

### 10.4 Problem: Brak pliku CV do testów

**Rozwiązanie:** Wygenerować przykładowy PDF programatycznie lub użyć małego pliku testowego w repozytorium.

### 10.5 Problem: Row-Level Security blokuje cleanup

**Rozwiązanie:** Używać Service Role Key w teardown lub logować się jako użytkownik testowy przed cleanup.

---

## 11. Metryki sukcesu

Test będzie uznany za udany, gdy:

- ✅ Wszystkie kroki przepływu użytkownika są wykonane poprawnie
- ✅ Test przechodzi stabilnie w 100% uruchomień (bez flakiness)
- ✅ Czas wykonania testu < 4 minuty (włącznie z generowaniem rekomendacji)
- ✅ Test nie pozostawia danych w bazie po zakończeniu (poprawny cleanup)

---

## 12. Następne kroki (opcjonalne)

Po zaimplementowaniu podstawowego testu można rozważyć:

1. **Optymalizacja logowania** - użycie zapisanych sesji zamiast logowania przez UI
2. **Dodatkowe scenariusze** - testy błędnych ścieżek (niepoprawne dane, błędy uploadu)
3. **Testy wizualne** - screenshot comparison dla kluczowych widoków
4. **Testy API** - weryfikacja backendu równolegle z testami E2E
5. **CI/CD Integration** - automatyczne uruchamianie testów w pipeline

---

## 13. Podsumowanie

Plan implementacji obejmuje:

- ✅ Konfigurację środowiska testowego z dedykowaną bazą danych
- ✅ Dodanie selektorów `data-testid` do wszystkich kluczowych komponentów
- ✅ Implementację Page Object Model dla wszystkich stron
- ✅ Pełny test przepływu użytkownika od rejestracji do roadmapy
- ✅ Setup i teardown dla zarządzania danymi testowymi

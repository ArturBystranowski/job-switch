# Plan Testowania Unit Testów - JobSwitch

## 1. Przegląd i Cele

### 1.1 Cel dokumentu
Dokument opisuje szczegółowy plan testowania jednostkowego dla aplikacji JobSwitch przy użyciu **Vitest** oraz **React Testing Library**. Plan koncentruje się na testach wnoszących realną wartość biznesową i jakościową do projektu.

### 1.2 Zasady testowania
- **Testujemy logikę biznesową** - funkcje walidacji, transformacje danych, type guardy
- **Testujemy integrację** - hooki z React Query, konteksty
- **Testujemy interakcje użytkownika** - formularze, komponenty UI z logiką
- **Pomijamy trywialne testy** - czyste komponenty prezentacyjne bez logiki

### 1.3 Stack testowy
| Narzędzie | Zastosowanie |
|-----------|--------------|
| Vitest | Framework testowy, runner |
| React Testing Library | Testowanie komponentów React |
| @testing-library/user-event | Symulacja interakcji użytkownika |
| MSW (Mock Service Worker) | Mockowanie API (opcjonalnie) |
| vi.mock() | Mockowanie modułów i zależności |

---

## 2. Konfiguracja Środowiska Testowego

### 2.1 Instalacja zależności

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @types/testing-library__jest-dom
```

### 2.2 Konfiguracja Vitest (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.types.ts',
        '**/*.sx.ts',
        '**/index.ts',
      ],
    },
  },
});
```

### 2.3 Setup file (`src/test/setup.ts`)

```typescript
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

### 2.4 Test utilities (`src/test/test-utils.tsx`)

```typescript
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface WrapperProps {
  children: React.ReactNode;
}

const AllProviders = ({ children }: WrapperProps) => {
  const queryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>{children}</BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

---

## 3. Plan Testów - Warstwa Logiki Biznesowej

### 3.1 Type Guards (`src/types/types.ts`)

**Priorytet: WYSOKI** - Krytyczne dla bezpieczeństwa typów i walidacji danych.

#### Plik: `src/types/__tests__/type-guards.test.ts`

| Test Case | Opis | Dane wejściowe |
|-----------|------|----------------|
| `isQuestionnaireComplete` returns true for valid complete questionnaire | Weryfikuje pełne odpowiedzi | Kompletny obiekt z 10 polami |
| `isQuestionnaireComplete` returns false for missing fields | Brakujące pola | Obiekt z 8 polami |
| `isQuestionnaireComplete` returns false for null/undefined | Wartości null | `null`, `undefined`, `{}` |
| `isQuestionnaireComplete` handles open_answer as optional | Opcjonalne pole | Bez `open_answer` |
| `hasAIRecommendations` returns true for valid recommendations | Poprawne rekomendacje | Array z `role_id`, `role_name`, `justification` |
| `hasAIRecommendations` returns false for empty recommendations | Pusta tablica | `{ recommendations: [], generated_at: '...' }` |
| `hasAIRecommendations` returns false for missing generated_at | Brak timestamp | Obiekt bez `generated_at` |
| `hasValidResources` returns true for valid resources | Poprawne zasoby | `{ links: [...] }` |
| `hasValidResources` returns false for invalid structure | Niepoprawna struktura | `{ links: 'not-array' }` |

**Przykładowa implementacja:**

```typescript
describe('Type Guards', () => {
  describe('isQuestionnaireComplete', () => {
    it('returns true for valid complete questionnaire', () => {
      const validResponses = {
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

      expect(isQuestionnaireComplete(validResponses)).toBe(true);
    });

    it('returns false when missing required field', () => {
      const incompleteResponses = {
        work_style: 'independent',
        client_interaction: 'minimal',
        // missing other required fields
      };

      expect(isQuestionnaireComplete(incompleteResponses)).toBe(false);
    });
  });
});
```

---

### 3.2 Walidacja plików CV (`src/api/cv.api.ts`)

**Priorytet: WYSOKI** - Krytyczne dla bezpieczeństwa uploadu plików.

#### Plik: `src/api/__tests__/cv.api.test.ts`

| Test Case | Opis | Oczekiwany rezultat |
|-----------|------|---------------------|
| `validateFile` accepts valid PDF under 3MB | Poprawny plik | Brak błędu |
| `validateFile` rejects file over 3MB | Plik > 3MB | Throw `CV_FILE_TOO_LARGE` |
| `validateFile` rejects non-PDF MIME type | Plik DOCX | Throw `CV_INVALID_FILE_TYPE` |
| `validateFile` rejects file with wrong extension | Plik .txt | Throw `CV_INVALID_FILE_EXTENSION` |
| `validateFile` handles edge case - exactly 3MB | Plik = 3MB | Brak błędu |

**Przykładowa implementacja:**

```typescript
describe('cvApi.validateFile', () => {
  const createMockFile = (
    name: string,
    size: number,
    type: string
  ): File => {
    const file = new File([''], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  };

  it('accepts valid PDF under 3MB', () => {
    const validFile = createMockFile('cv.pdf', 2 * 1024 * 1024, 'application/pdf');
    expect(() => cvApi.validateFile(validFile)).not.toThrow();
  });

  it('rejects file over 3MB', () => {
    const largeFile = createMockFile('cv.pdf', 4 * 1024 * 1024, 'application/pdf');
    expect(() => cvApi.validateFile(largeFile)).toThrow('CV_FILE_TOO_LARGE');
  });

  it('rejects non-PDF MIME type', () => {
    const docxFile = createMockFile('cv.docx', 1024, 'application/vnd.openxmlformats');
    expect(() => cvApi.validateFile(docxFile)).toThrow('CV_INVALID_FILE_TYPE');
  });
});
```

---

### 3.3 Utility - Avatar URL (`src/utils/avatars.ts`)

**Priorytet: ŚREDNI** - Pomocnicza funkcja z mapowaniem.

#### Plik: `src/utils/__tests__/avatars.test.ts`

| Test Case | Opis | Oczekiwany rezultat |
|-----------|------|---------------------|
| Returns correct URL for Frontend Developer | Znana rola | `/avatars/frontend_dev.png` |
| Returns correct URL for Backend Developer | Znana rola | `/avatars/backend_dev.png` |
| Returns correct URL for all mapped roles | Wszystkie role | Poprawne URL |
| Returns undefined for unknown role | Nieznana rola | `undefined` |
| Returns undefined for empty string | Pusty string | `undefined` |

---

### 3.4 Questionnaire Helpers (`src/hooks/useQuestionnaire.ts`)

**Priorytet: WYSOKI** - Logika walidacji kwestionariusza.

#### Plik: `src/hooks/__tests__/questionnaire-helpers.test.ts`

| Test Case | Opis | Oczekiwany rezultat |
|-----------|------|---------------------|
| `getOptionLabel` returns label for valid field and value | Istniejące pole | Etykieta opcji |
| `getOptionLabel` returns undefined for invalid field | Nieistniejące pole | `undefined` |
| `getOptionLabel` returns undefined for invalid option value | Nieistniejąca wartość | `undefined` |
| `validateQuestionnaireResponses` returns valid for complete | Kompletne odpowiedzi | `{ isValid: true, missingFields: [] }` |
| `validateQuestionnaireResponses` returns missing fields | Niekompletne odpowiedzi | Lista brakujących pól |

---

### 3.5 Auth Error Mapping (`src/services/auth.service.ts`)

**Priorytet: WYSOKI** - Krytyczne dla UX błędów autentykacji.

#### Plik: `src/services/__tests__/auth.service.test.ts`

| Test Case | Opis | Oczekiwany rezultat |
|-----------|------|---------------------|
| Maps `invalid_credentials` error correctly | Błąd logowania | `'Nieprawidłowy email lub hasło'` |
| Maps `user_already_exists` error correctly | Błąd rejestracji | `'Konto z tym adresem email już istnieje'` |
| Maps `email_not_confirmed` error correctly | Niezweryfikowany email | Odpowiedni komunikat |
| Maps `weak_password` error correctly | Słabe hasło | `'Hasło jest zbyt słabe'` |
| Maps `rate_limit_exceeded` error correctly | Za dużo prób | `'Zbyt wiele prób...'` |
| Maps unknown error to default message | Nieznany błąd | `'Wystąpił nieoczekiwany błąd...'` |
| Handles network errors | Błąd sieci | `'Brak połączenia z internetem...'` |

**Uwaga:** Wymaga ekstraktowania funkcji `mapAuthError` lub testowania przez publiczne API.

---

## 4. Plan Testów - Komponenty z Logiką

### 4.1 PasswordStrengthIndicator (`src/components/auth/PasswordStrengthIndicator/`)

**Priorytet: WYSOKI** - Logika obliczania siły hasła.

#### Plik: `src/components/auth/PasswordStrengthIndicator/__tests__/PasswordStrengthIndicator.test.tsx`

| Test Case | Opis | Oczekiwany rezultat |
|-----------|------|---------------------|
| Returns null for empty password | Brak hasła | Nie renderuje się |
| Shows 'weak' for short password (<8 chars) | `"abc123"` | Pokazuje "Słabe" |
| Shows 'medium' for password with uppercase OR digit | `"abcdefgh1"` | Pokazuje "Średnie" |
| Shows 'strong' for password with uppercase AND digit | `"Abcdefgh1"` | Pokazuje "Silne" |
| Shows 'veryStrong' for long password with all criteria | `"Abcdefgh1234!"` | Pokazuje "Bardzo silne" |
| Displays correct progress bar value | Różne hasła | Odpowiednie % (25, 50, 75, 100) |
| Uses correct color for each strength level | Różne poziomy | error/warning/success/primary |

**Przykładowa implementacja:**

```typescript
describe('PasswordStrengthIndicator', () => {
  it('returns null for empty password', () => {
    const { container } = render(<PasswordStrengthIndicator password="" />);
    expect(container.firstChild).toBeNull();
  });

  it('shows weak strength for short password', () => {
    render(<PasswordStrengthIndicator password="abc" />);
    expect(screen.getByText(/Słabe/)).toBeInTheDocument();
  });

  it('shows veryStrong for password meeting all criteria', () => {
    render(<PasswordStrengthIndicator password="MyP@ssw0rd123!" />);
    expect(screen.getByText(/Bardzo silne/)).toBeInTheDocument();
  });
});
```

---

### 4.2 LoginForm (`src/components/auth/LoginForm/`)

**Priorytet: WYSOKI** - Walidacja formularza logowania.

#### Plik: `src/components/auth/LoginForm/__tests__/LoginForm.test.tsx`

| Test Case | Opis | Oczekiwany rezultat |
|-----------|------|---------------------|
| Renders email and password fields | Inicjalna struktura | Widoczne pola |
| Shows error for empty email on blur | Puste pole email | `'Email jest wymagany'` |
| Shows error for invalid email format | `"invalid-email"` | `'Nieprawidłowy format email'` |
| Shows error for empty password on blur | Puste hasło | `'Hasło jest wymagane'` |
| Does not call onSubmit with invalid data | Niepoprawne dane | `onSubmit` nie wywołane |
| Calls onSubmit with valid data | Poprawne dane | `onSubmit` wywołane z danymi |
| Displays external error from props | Prop `error` | Alert z błędem |
| Disables form when isLoading is true | `isLoading=true` | Pola i przycisk disabled |
| Shows loading text on submit button | `isLoading=true` | `'Logowanie...'` |
| Validates on change after field is touched | Zmiana po blur | Dynamiczna walidacja |

**Przykładowa implementacja:**

```typescript
describe('LoginForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('shows error for invalid email format', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    await user.tab(); // blur

    expect(screen.getByText(/Nieprawidłowy format email/)).toBeInTheDocument();
  });

  it('calls onSubmit with valid data', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/hasło/i), 'password123');
    await user.click(screen.getByRole('button', { name: /zaloguj się/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
```

---

### 4.3 RegisterForm (`src/components/auth/RegisterForm/`)

**Priorytet: WYSOKI** - Rozszerzona walidacja z wymaganiami hasła.

#### Plik: `src/components/auth/RegisterForm/__tests__/RegisterForm.test.tsx`

| Test Case | Opis | Oczekiwany rezultat |
|-----------|------|---------------------|
| Shows error for password shorter than 8 chars | `"short"` | `'Hasło musi mieć minimum 8 znaków'` |
| Shows error for password without uppercase | `"password123"` | `'Hasło musi zawierać...wielką literę'` |
| Shows error for password without digit | `"Password"` | `'Hasło musi zawierać...cyfrę'` |
| Shows error when passwords don't match | Różne hasła | `'Hasła muszą być identyczne'` |
| Shows error for empty confirm password | Puste potwierdzenie | `'Potwierdzenie hasła jest wymagane'` |
| Accepts valid registration data | Poprawne dane | `onSubmit` wywołane |
| Renders PasswordStrengthIndicator | Wpisane hasło | Widoczny wskaźnik siły |
| Updates confirm password validation when password changes | Zmiana hasła | Aktualizacja błędu |

---

### 4.4 CVDropzone (`src/components/cv-upload/CVDropzone/`)

**Priorytet: ŚREDNI** - Komponent uploadu z react-dropzone.

#### Plik: `src/components/cv-upload/CVDropzone/__tests__/CVDropzone.test.tsx`

| Test Case | Opis | Oczekiwany rezultat |
|-----------|------|---------------------|
| Renders dropzone with default text | Inicjalny stan | Tekst instrukcji |
| Calls onFileSelect when valid file is dropped | Drop poprawnego PDF | `onFileSelect` wywołane |
| Shows drag active state when dragging over | Drag over | Zmieniony tekst/styl |
| Respects disabled prop | `disabled=true` | Dropzone nieaktywny |
| Shows correct max size in UI | Domyślny prop | `'Maksymalnie 3MB'` |
| Only accepts PDF files | Konfiguracja accept | Tylko `.pdf` |

---

### 4.5 QuestionCard (`src/components/questionnaire/QuestionCard/`)

**Priorytet: ŚREDNI** - Logika nawigacji kwestionariusza.

#### Plik: `src/components/questionnaire/QuestionCard/__tests__/QuestionCard.test.tsx`

| Test Case | Opis | Oczekiwany rezultat |
|-----------|------|---------------------|
| Disables Back button on first question | `isFirstQuestion=true` | Przycisk disabled |
| Disables Next button when no selection | `selectedValue=null` | Przycisk disabled |
| Enables Next button after selection | Wybrana opcja | Przycisk enabled |
| Calls onNext when Next clicked | Klik Next | `onNext` wywołane |
| Calls onBack when Back clicked | Klik Back | `onBack` wywołane |
| Shows 'Zakończ' on last question | `isLastQuestion=true` | Tekst "Zakończ" |
| Shows CheckIcon on last question | `isLastQuestion=true` | Ikona ✓ |

---

### 4.6 ConfirmDialog (`src/components/common/ConfirmDialog/`)

**Priorytet: ŚREDNI** - Uniwersalny dialog potwierdzenia.

#### Plik: `src/components/common/ConfirmDialog/__tests__/ConfirmDialog.test.tsx`

| Test Case | Opis | Oczekiwany rezultat |
|-----------|------|---------------------|
| Renders with title and message | Podstawowe propsy | Widoczne tytuł i wiadomość |
| Calls onConfirm when confirm button clicked | Klik Potwierdź | `onConfirm` wywołane |
| Calls onCancel when cancel button clicked | Klik Anuluj | `onCancel` wywołane |
| Shows loading spinner when isLoading | `isLoading=true` | Spinner w przycisku |
| Disables buttons when isLoading | `isLoading=true` | Przyciski disabled |
| Uses custom button texts | Niestandardowe teksty | Wyświetlone teksty |
| Does not close on backdrop click when loading | `isLoading=true`, klik tła | Dialog otwarty |

---

### 4.7 RoleCard (`src/components/recommendations/RoleCard/`)

**Priorytet: ŚREDNI** - Karta wyboru roli.

#### Plik: `src/components/recommendations/RoleCard/__tests__/RoleCard.test.tsx`

| Test Case | Opis | Oczekiwany rezultat |
|-----------|------|---------------------|
| Renders role name and justification | Dane roli | Widoczne informacje |
| Calls onSelect with roleId when button clicked | Klik przycisku | `onSelect(roleId)` wywołane |
| Applies recommended style when variant is 'recommended' | `variant='recommended'` | Odpowiedni styl |
| Disables button when disabled prop is true | `disabled=true` | Przycisk disabled |
| Shows avatar for known roles | Znana rola | Avatar widoczny |
| Falls back to icon for unknown roles | Nieznana rola | Ikona WorkIcon |

---

### 4.8 ProtectedRoute (`src/components/layout/ProtectedRoute/`)

**Priorytet: WYSOKI** - Ochrona tras przed nieautoryzowanym dostępem.

#### Plik: `src/components/layout/ProtectedRoute/__tests__/ProtectedRoute.test.tsx`

| Test Case | Opis | Oczekiwany rezultat |
|-----------|------|---------------------|
| Shows loading spinner when auth is loading | `isLoading=true` | Spinner widoczny |
| Redirects to login when not authenticated | `isAuthenticated=false` | Redirect do `/login` |
| Renders children when authenticated | `isAuthenticated=true` | Children widoczne |
| Saves current location in redirect state | Redirect | `state.from` ustawione |
| Uses custom redirectTo prop | `redirectTo='/custom'` | Redirect do `/custom` |

**Wymaga mockowania `useAuth`:**

```typescript
vi.mock('../../../hooks', () => ({
  useAuth: vi.fn(),
}));

describe('ProtectedRoute', () => {
  it('redirects to login when not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      session: null,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
```

---

## 5. Plan Testów - Custom Hooks

### 5.1 useAuth (`src/hooks/useAuth.ts`)

**Priorytet: WYSOKI** - Hook do kontekstu autentykacji.

#### Plik: `src/hooks/__tests__/useAuth.test.tsx`

| Test Case | Opis | Oczekiwany rezultat |
|-----------|------|---------------------|
| Throws error when used outside AuthProvider | Brak providera | Error: `'useAuth must be used...'` |
| Returns context value when inside AuthProvider | Wewnątrz providera | Wartość kontekstu |

---

### 5.2 useValidateCV (`src/hooks/useCV.ts`)

**Priorytet: ŚREDNI** - Helper walidacji plików.

#### Plik: `src/hooks/__tests__/useCV.test.tsx`

| Test Case | Opis | Oczekiwany rezultat |
|-----------|------|---------------------|
| Returns correct maxSize value | Wywołanie hooka | `3 * 1024 * 1024` |
| Returns correct acceptedTypes | Wywołanie hooka | `'.pdf'` |
| validate returns valid: true for correct file | Poprawny plik | `{ valid: true }` |
| validate returns error for invalid file | Niepoprawny plik | `{ valid: false, error: '...' }` |

---

## 6. Plan Testów - Kontekst Autentykacji

### 6.1 AuthProvider (`src/context/AuthContext.tsx`)

**Priorytet: WYSOKI** - Provider zarządzający stanem auth.

#### Plik: `src/context/__tests__/AuthContext.test.tsx`

| Test Case | Opis | Oczekiwany rezultat |
|-----------|------|---------------------|
| Initializes with loading state | Mount | `isLoading=true` |
| Sets user and session after initialization | Po init | Dane użytkownika |
| Handles signIn success | Poprawne logowanie | `isAuthenticated=true` |
| Handles signIn failure | Błędne logowanie | Error message |
| Handles signUp success | Poprawna rejestracja | Użytkownik utworzony |
| Handles signOut | Wylogowanie | `isAuthenticated=false` |
| Subscribes to auth state changes | Mount | Subskrypcja aktywna |
| Cleans up subscription on unmount | Unmount | Subskrypcja usunięta |

**Wymaga mockowania `authService`:**

```typescript
vi.mock('../services', () => ({
  authService: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updatePassword: vi.fn(),
  },
}));
```

---

## 7. Priorytety i Kolejność Implementacji

### Faza 1 - Krytyczna logika biznesowa (MUST HAVE)
1. ✅ Type Guards (`isQuestionnaireComplete`, `hasAIRecommendations`, `hasValidResources`)
2. ✅ CV file validation (`cvApi.validateFile`)
3. ✅ Password validation functions (RegisterForm validators)
4. ✅ Email validation function (LoginForm validator)
5. ✅ Auth error mapping

### Faza 2 - Komponenty formularzy (HIGH PRIORITY)
1. ✅ LoginForm - walidacja i submission
2. ✅ RegisterForm - walidacja rozszerzona
3. ✅ PasswordStrengthIndicator - logika obliczania siły

### Faza 3 - Komponenty z logiką UI (MEDIUM PRIORITY)
1. ✅ ProtectedRoute - ochrona tras
2. ✅ ConfirmDialog - podstawowe interakcje
3. ✅ QuestionCard - nawigacja
4. ✅ RoleCard - wybór roli

### Faza 4 - Custom hooks i kontekst (MEDIUM PRIORITY)
1. ✅ useAuth - błąd bez providera
2. ✅ useValidateCV - helper walidacji
3. ✅ AuthProvider - zarządzanie stanem

### Faza 5 - Pozostałe komponenty (NICE TO HAVE)
1. CVDropzone - interakcja drag & drop
2. Utilities - `getAvatarUrl`, `getOptionLabel`

---

## 8. Struktura folderów testów

```
src/
├── test/
│   ├── setup.ts
│   ├── test-utils.tsx
│   └── mocks/
│       ├── auth.mock.ts
│       ├── supabase.mock.ts
│       └── handlers.ts (MSW - opcjonalnie)
├── types/
│   └── __tests__/
│       └── type-guards.test.ts
├── api/
│   └── __tests__/
│       └── cv.api.test.ts
├── utils/
│   └── __tests__/
│       └── avatars.test.ts
├── services/
│   └── __tests__/
│       └── auth.service.test.ts
├── hooks/
│   └── __tests__/
│       ├── useAuth.test.tsx
│       ├── useCV.test.tsx
│       └── questionnaire-helpers.test.ts
├── context/
│   └── __tests__/
│       └── AuthContext.test.tsx
└── components/
    ├── auth/
    │   ├── LoginForm/
    │   │   └── __tests__/
    │   │       └── LoginForm.test.tsx
    │   ├── RegisterForm/
    │   │   └── __tests__/
    │   │       └── RegisterForm.test.tsx
    │   └── PasswordStrengthIndicator/
    │       └── __tests__/
    │           └── PasswordStrengthIndicator.test.tsx
    ├── common/
    │   └── ConfirmDialog/
    │       └── __tests__/
    │           └── ConfirmDialog.test.tsx
    ├── cv-upload/
    │   └── CVDropzone/
    │       └── __tests__/
    │           └── CVDropzone.test.tsx
    ├── questionnaire/
    │   └── QuestionCard/
    │       └── __tests__/
    │           └── QuestionCard.test.tsx
    ├── recommendations/
    │   └── RoleCard/
    │       └── __tests__/
    │           └── RoleCard.test.tsx
    └── layout/
        └── ProtectedRoute/
            └── __tests__/
                └── ProtectedRoute.test.tsx
```

---

## 9. Metryki i cele pokrycia

### 9.1 Cele coverage (sugerowane)
| Kategoria | Min Coverage | Target Coverage |
|-----------|--------------|-----------------|
| Type Guards | 100% | 100% |
| Validation Functions | 90% | 100% |
| Auth Service | 80% | 90% |
| Form Components | 80% | 90% |
| UI Components | 60% | 80% |
| Custom Hooks | 70% | 85% |

### 9.2 Raportowanie
```bash
# Uruchomienie testów z coverage
npm run test:coverage

# Uruchomienie testów w trybie watch
npm run test
```

### 9.3 Skrypty w package.json
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

---

## 10. Best Practices

### 10.1 Zasady pisania testów
1. **Arrange-Act-Assert** - każdy test ma trzy sekcje
2. **Jeden test = jeden koncept** - nie testuj wielu rzeczy naraz
3. **Opisowe nazwy** - `it('shows error when email is invalid')` nie `it('test 1')`
4. **Izolacja** - każdy test jest niezależny
5. **Mockowanie zewnętrznych zależności** - Supabase, window.location

### 10.2 Mockowanie Supabase

```typescript
// src/test/mocks/supabase.mock.ts
export const mockSupabaseClient = {
  auth: {
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
  })),
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn(),
      download: vi.fn(),
      list: vi.fn(),
      createSignedUrl: vi.fn(),
      remove: vi.fn(),
    })),
  },
};

vi.mock('../db/supabase.client', () => ({
  supabaseClient: mockSupabaseClient,
}));
```

### 10.3 Testing Library - dobre praktyki
1. **Preferuj zapytania po roli** - `getByRole`, `getByLabelText`
2. **Unikaj `getByTestId`** - używaj tylko gdy nie ma innej opcji
3. **Używaj `userEvent` zamiast `fireEvent`** - bardziej realistyczne
4. **Testuj zachowanie, nie implementację** - co widzi użytkownik
5. **Używaj `waitFor` dla asynchronicznych operacji**

---

## 11. Podsumowanie

Plan testowania skupia się na:
- **Jakości, nie ilości** - testujemy logikę, nie markup
- **Krytycznych ścieżkach** - autentykacja, walidacja, bezpieczeństwo
- **Wartości biznesowej** - testy które chronią przed regresją
- **Utrzymywalności** - testy łatwe do zrozumienia i modyfikacji

Implementacja powinna odbywać się fazami, zaczynając od najbardziej krytycznej logiki biznesowej, a kończąc na komponentach UI. Każda faza powinna być zakończona code review i weryfikacją pokrycia przed przejściem do następnej.

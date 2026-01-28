# Specyfikacja Techniczna Modułu Autentykacji - JobSwitch

## 1. Wprowadzenie

### 1.1. Cel dokumentu

Niniejsza specyfikacja opisuje architekturę i wymagania techniczne dla modułu rejestracji, logowania, wylogowywania i odzyskiwania hasła w aplikacji JobSwitch. Dokument stanowi podstawę do implementacji funkcjonalności autentykacji z wykorzystaniem Supabase Auth.

### 1.2. Wymagania biznesowe (US-001, US-002, US-011)

- Rejestracja użytkownika za pomocą email + hasło
- Walidacja poprawności email i siły hasła
- Logowanie z wyświetlaniem komunikatów błędów
- Bezpieczne uwierzytelnianie (JWT, hashowanie haseł)
- Odzyskiwanie hasła przez email

### 1.3. Ograniczenia dostępu dla użytkowników niezalogowanych

Użytkownicy niezalogowani mają dostęp wyłącznie do:
- **Hero Section** na Landing Page
- Strony logowania (`/login`)
- Strony rejestracji (`/register`)
- Strony resetowania hasła (`/forgot-password`)
- Strony ustawiania nowego hasła (`/reset-password`)

Użytkownicy niezalogowani **NIE mają dostępu** do:
- Kwestionariusza (`/questionnaire`)
- Uploadu CV (`/upload-cv`)
- Rekomendacji (`/recommendations`)
- Roadmapy (`/roadmap`)
- Profilu (`/profile`)

---

## 2. Architektura Interfejsu Użytkownika

### 2.1. Nowe strony (Pages)

#### 2.1.1. LoginPage (`/login`)

**Cel**: Umożliwienie zalogowania istniejącego użytkownika.

**Layout**:
- Nagłówek: "Zaloguj się do JobSwitch"
- Formularz z polami:
  - Email (TextField, type="email")
  - Hasło (TextField, type="password", z ikoną pokazywania/ukrywania)
- Przycisk "Zaloguj się" (Button, primary, disabled podczas ładowania)
- Link "Nie pamiętasz hasła?" → `/forgot-password`
- Link "Nie masz konta? Zarejestruj się" → `/register`
- Opcjonalnie: Divider z tekstem "lub" i przyszłe opcje OAuth (poza MVP)

**Komponenty**:
- `LoginForm` - formularz logowania z walidacją
- `PasswordField` - pole hasła z toggle widoczności
- `AuthFormContainer` - wspólny kontener dla formularzy auth

**Walidacja pól**:
| Pole | Reguły walidacji | Komunikat błędu |
|------|------------------|-----------------|
| Email | Wymagane, poprawny format email | "Email jest wymagany" / "Nieprawidłowy format email" |
| Hasło | Wymagane, min. 1 znak | "Hasło jest wymagane" |

**Komunikaty błędów API**:
| Kod błędu Supabase | Komunikat UI |
|--------------------|--------------|
| `invalid_credentials` | "Nieprawidłowy email lub hasło" |
| `email_not_confirmed` | "Email nie został potwierdzony. Sprawdź skrzynkę pocztową." |
| `too_many_requests` | "Zbyt wiele prób logowania. Spróbuj ponownie za chwilę." |
| Network error | "Brak połączenia z internetem. Sprawdź połączenie i spróbuj ponownie." |

---

#### 2.1.2. RegisterPage (`/register`)

**Cel**: Umożliwienie utworzenia nowego konta użytkownika.

**Layout**:
- Nagłówek: "Utwórz konto w JobSwitch"
- Formularz z polami:
  - Email (TextField, type="email")
  - Hasło (TextField, type="password", z ikoną pokazywania/ukrywania)
  - Potwierdzenie hasła (TextField, type="password")
- Wskaźnik siły hasła (PasswordStrengthIndicator)
- Przycisk "Zarejestruj się" (Button, primary)
- Link "Masz już konto? Zaloguj się" → `/login`

**Komponenty**:
- `RegisterForm` - formularz rejestracji z walidacją
- `PasswordField` - pole hasła z toggle widoczności
- `PasswordStrengthIndicator` - wizualny wskaźnik siły hasła
- `AuthFormContainer` - wspólny kontener dla formularzy auth

**Walidacja pól**:
| Pole | Reguły walidacji | Komunikat błędu |
|------|------------------|-----------------|
| Email | Wymagane, poprawny format email | "Email jest wymagany" / "Nieprawidłowy format email" |
| Hasło | Wymagane, min. 8 znaków, min. 1 wielka litera, min. 1 cyfra | "Hasło musi mieć min. 8 znaków" / "Hasło musi zawierać wielką literę" / "Hasło musi zawierać cyfrę" |
| Potwierdzenie hasła | Musi być identyczne z hasłem | "Hasła muszą być identyczne" |

**Komunikaty błędów API**:
| Kod błędu Supabase | Komunikat UI |
|--------------------|--------------|
| `user_already_exists` | "Konto z tym adresem email już istnieje" |
| `weak_password` | "Hasło jest zbyt słabe. Użyj silniejszego hasła." |
| `invalid_email` | "Nieprawidłowy format adresu email" |
| Network error | "Brak połączenia z internetem. Sprawdź połączenie i spróbuj ponownie." |

**Po pomyślnej rejestracji**:
- Wyświetl komunikat sukcesu: "Konto zostało utworzone. Sprawdź email, aby potwierdzić rejestrację."
- Opcjonalnie: Automatyczne przekierowanie do strony logowania po 3 sekundach

---

#### 2.1.3. ForgotPasswordPage (`/forgot-password`)

**Cel**: Umożliwienie wysłania linku do resetowania hasła.

**Layout**:
- Nagłówek: "Odzyskaj hasło"
- Opis: "Podaj adres email powiązany z Twoim kontem. Wyślemy Ci link do resetowania hasła."
- Formularz z polem:
  - Email (TextField, type="email")
- Przycisk "Wyślij link" (Button, primary)
- Link "Wróć do logowania" → `/login`

**Komponenty**:
- `ForgotPasswordForm` - formularz z polem email
- `AuthFormContainer` - wspólny kontener dla formularzy auth

**Walidacja pól**:
| Pole | Reguły walidacji | Komunikat błędu |
|------|------------------|-----------------|
| Email | Wymagane, poprawny format email | "Email jest wymagany" / "Nieprawidłowy format email" |

**Komunikaty**:
| Scenariusz | Komunikat UI |
|------------|--------------|
| Sukces | "Link do resetowania hasła został wysłany na podany adres email." |
| Email nie istnieje | Ten sam komunikat jak sukces (bezpieczeństwo) |
| Rate limit | "Zbyt wiele prób. Spróbuj ponownie za kilka minut." |
| Network error | "Brak połączenia z internetem." |

---

#### 2.1.4. ResetPasswordPage (`/reset-password`)

**Cel**: Umożliwienie ustawienia nowego hasła po kliknięciu linku z emaila.

**Layout**:
- Nagłówek: "Ustaw nowe hasło"
- Formularz z polami:
  - Nowe hasło (TextField, type="password")
  - Potwierdzenie nowego hasła (TextField, type="password")
- Wskaźnik siły hasła (PasswordStrengthIndicator)
- Przycisk "Zapisz nowe hasło" (Button, primary)

**Komponenty**:
- `ResetPasswordForm` - formularz z walidacją
- `PasswordField` - pole hasła z toggle widoczności
- `PasswordStrengthIndicator` - wizualny wskaźnik siły hasła
- `AuthFormContainer` - wspólny kontener dla formularzy auth

**Walidacja pól**:
| Pole | Reguły walidacji | Komunikat błędu |
|------|------------------|-----------------|
| Nowe hasło | Wymagane, min. 8 znaków, min. 1 wielka litera, min. 1 cyfra | "Hasło musi mieć min. 8 znaków" / "Hasło musi zawierać wielką literę" / "Hasło musi zawierać cyfrę" |
| Potwierdzenie hasła | Musi być identyczne z nowym hasłem | "Hasła muszą być identyczne" |

**Komunikaty**:
| Scenariusz | Komunikat UI |
|------------|--------------|
| Sukces | "Hasło zostało zmienione. Możesz się teraz zalogować." |
| Link wygasł | "Link do resetowania hasła wygasł. Poproś o nowy link." |
| Nieprawidłowy token | "Nieprawidłowy link do resetowania hasła." |

**Po pomyślnej zmianie hasła**:
- Przekierowanie do `/login` z komunikatem sukcesu

---

#### 2.1.5. EmailConfirmationPage (`/confirm-email`)

**Cel**: Strona wyświetlana po kliknięciu linku potwierdzającego email (opcjonalna w MVP).

**Layout**:
- Nagłówek: "Email potwierdzony" lub "Potwierdzenie nie powiodło się"
- Komunikat informacyjny
- Przycisk "Przejdź do logowania" → `/login`

---

### 2.2. Modyfikacje istniejących stron

#### 2.2.1. LandingPage (`/`) - Modyfikacje

**Obecna struktura** (bez zmian dla zalogowanych użytkowników):
- `LandingHero` - sekcja hero z CTA "Rozpocznij"
- `StepsPreview` - wizualizacja kroków procesu

**Nowe wymagania dla niezalogowanych użytkowników**:
- Hero Section pozostaje widoczna
- Przycisk "Rozpocznij" przekierowuje do `/login` zamiast `/questionnaire`
- Dodatkowy przycisk "Zaloguj się" w prawym górnym rogu
- `StepsPreview` pozostaje widoczna (informacyjna)

**Nowe wymagania dla zalogowanych użytkowników**:
- Hero Section pozostaje widoczna
- Przycisk "Rozpocznij" przekierowuje do `/questionnaire` (bez zmian)
- Przycisk "Wyloguj" w prawym górnym rogu (w nawigacji)
- Opcjonalnie: Avatar użytkownika z menu dropdown

**Zmiany w komponencie `LandingHero`**:
- Props: `isAuthenticated: boolean` - determinuje zachowanie CTA
- Props: `onStart: () => void` - handler kliknięcia (różna logika dla auth/non-auth)

---

#### 2.2.2. Nawigacja - Nowy komponent `AppHeader`

**Cel**: Wspólny nagłówek z nawigacją i statusem autentykacji.

**Wariant dla niezalogowanego użytkownika**:
- Logo (klikalny → `/`)
- Przycisk "Zaloguj się" (Button, outlined)
- Przycisk "Zarejestruj się" (Button, contained)

**Wariant dla zalogowanego użytkownika**:
- Logo (klikalny → `/`)
- Nawigacja (tylko po wyborze roli): Roadmapa | Profil
- Avatar/email użytkownika z menu dropdown:
  - Email użytkownika (nieaktywne)
  - Divider
  - "Wyloguj" (logout handler)

**Komponenty**:
- `AppHeader` - główny komponent nagłówka
- `AuthButtons` - przyciski logowania/rejestracji dla niezalogowanych
- `UserMenu` - menu dropdown dla zalogowanych użytkowników

---

### 2.3. Protected Routes - Ochrona tras

**Cel**: Zapewnienie, że chronione zasoby są dostępne tylko dla zalogowanych użytkowników.

**Komponenty**:
- `ProtectedRoute` - wrapper komponent sprawdzający autentykację
- `AuthLayout` - layout dla stron auth (login, register, etc.)
- `AppLayout` - layout dla stron aplikacji (z nawigacją)

**Logika `ProtectedRoute`**:
```
1. Sprawdź stan sesji (useAuth hook)
2. Jeśli ładowanie → wyświetl LoadingSpinner
3. Jeśli brak sesji → przekieruj do /login (z zapisaniem return URL)
4. Jeśli sesja aktywna → renderuj children
```

**Trasy chronione**:
- `/questionnaire` - wymaga autentykacji
- `/upload-cv` - wymaga autentykacji
- `/recommendations` - wymaga autentykacji
- `/roadmap` - wymaga autentykacji
- `/profile` - wymaga autentykacji

**Trasy publiczne**:
- `/` - dostępna dla wszystkich (z różnym UI)
- `/login` - tylko dla niezalogowanych (redirect do `/` jeśli zalogowany)
- `/register` - tylko dla niezalogowanych
- `/forgot-password` - tylko dla niezalogowanych
- `/reset-password` - tylko dla niezalogowanych

---

### 2.4. Nowe komponenty wspólne (common)

#### 2.4.1. AuthFormContainer

**Cel**: Ujednolicony kontener dla wszystkich formularzy autentykacji.

**Props**:
- `title: string` - nagłówek formularza
- `subtitle?: string` - opcjonalny opis
- `children: ReactNode` - zawartość formularza
- `maxWidth?: 'xs' | 'sm' | 'md'` - szerokość kontenera

**Styling**:
- Centrowanie na stronie (vertical + horizontal)
- Card/Paper z cieniem
- Responsive padding
- Logo JobSwitch na górze

---

#### 2.4.2. PasswordField

**Cel**: Pole hasła z możliwością pokazywania/ukrywania wartości.

**Props**:
- `label: string` - etykieta pola
- `value: string` - wartość
- `onChange: (value: string) => void` - handler zmiany
- `error?: boolean` - stan błędu
- `helperText?: string` - tekst pomocniczy/błędu
- `disabled?: boolean` - stan disabled

**Features**:
- IconButton z ikoną Visibility/VisibilityOff
- Toggle widoczności hasła
- Integracja z MUI TextField

---

#### 2.4.3. PasswordStrengthIndicator

**Cel**: Wizualny wskaźnik siły hasła.

**Props**:
- `password: string` - aktualne hasło do oceny

**Logika oceny siły**:
| Siła | Kryteria | Kolor | Label |
|------|----------|-------|-------|
| Słabe | < 8 znaków | error (red) | "Słabe" |
| Średnie | ≥ 8 znaków, 1 z: wielka litera, cyfra | warning (amber) | "Średnie" |
| Silne | ≥ 8 znaków, wielka litera, cyfra | success (green) | "Silne" |
| Bardzo silne | ≥ 12 znaków, wielka litera, cyfra, znak specjalny | primary (teal) | "Bardzo silne" |

**Rendering**:
- LinearProgress (MUI) z kolorem odpowiadającym sile
- Label tekstowy pod paskiem

---

### 2.5. Struktura plików komponentów autentykacji

```
src/
├── components/
│   ├── auth/
│   │   ├── index.ts
│   │   ├── AuthFormContainer/
│   │   │   ├── index.ts
│   │   │   ├── AuthFormContainer.tsx
│   │   │   ├── AuthFormContainer.sx.ts
│   │   │   └── AuthFormContainer.types.ts
│   │   ├── LoginForm/
│   │   │   ├── index.ts
│   │   │   ├── LoginForm.tsx
│   │   │   ├── LoginForm.sx.ts
│   │   │   └── LoginForm.types.ts
│   │   ├── RegisterForm/
│   │   │   ├── index.ts
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── RegisterForm.sx.ts
│   │   │   └── RegisterForm.types.ts
│   │   ├── ForgotPasswordForm/
│   │   │   ├── index.ts
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   ├── ForgotPasswordForm.sx.ts
│   │   │   └── ForgotPasswordForm.types.ts
│   │   ├── ResetPasswordForm/
│   │   │   ├── index.ts
│   │   │   ├── ResetPasswordForm.tsx
│   │   │   ├── ResetPasswordForm.sx.ts
│   │   │   └── ResetPasswordForm.types.ts
│   │   ├── PasswordField/
│   │   │   ├── index.ts
│   │   │   ├── PasswordField.tsx
│   │   │   ├── PasswordField.sx.ts
│   │   │   └── PasswordField.types.ts
│   │   ├── PasswordStrengthIndicator/
│   │   │   ├── index.ts
│   │   │   ├── PasswordStrengthIndicator.tsx
│   │   │   ├── PasswordStrengthIndicator.sx.ts
│   │   │   └── PasswordStrengthIndicator.types.ts
│   │   └── UserMenu/
│   │       ├── index.ts
│   │       ├── UserMenu.tsx
│   │       ├── UserMenu.sx.ts
│   │       └── UserMenu.types.ts
│   ├── layout/
│   │   ├── index.ts
│   │   ├── AppHeader/
│   │   │   ├── index.ts
│   │   │   ├── AppHeader.tsx
│   │   │   ├── AppHeader.sx.ts
│   │   │   └── AppHeader.types.ts
│   │   ├── AppLayout/
│   │   │   ├── index.ts
│   │   │   ├── AppLayout.tsx
│   │   │   ├── AppLayout.sx.ts
│   │   │   └── AppLayout.types.ts
│   │   ├── AuthLayout/
│   │   │   ├── index.ts
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── AuthLayout.sx.ts
│   │   │   └── AuthLayout.types.ts
│   │   └── ProtectedRoute/
│   │       ├── index.ts
│   │       ├── ProtectedRoute.tsx
│   │       └── ProtectedRoute.types.ts
├── pages/
│   ├── auth/
│   │   ├── index.ts
│   │   ├── LoginPage/
│   │   │   ├── index.ts
│   │   │   ├── LoginPage.tsx
│   │   │   └── LoginPage.sx.ts
│   │   ├── RegisterPage/
│   │   │   ├── index.ts
│   │   │   ├── RegisterPage.tsx
│   │   │   └── RegisterPage.sx.ts
│   │   ├── ForgotPasswordPage/
│   │   │   ├── index.ts
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   └── ForgotPasswordPage.sx.ts
│   │   └── ResetPasswordPage/
│   │       ├── index.ts
│   │       ├── ResetPasswordPage.tsx
│   │       └── ResetPasswordPage.sx.ts
```

---

## 3. Logika Backendowa

### 3.1. Wykorzystanie Supabase Auth

Aplikacja wykorzystuje Supabase Auth jako gotowe rozwiązanie do autentykacji. Nie implementujemy własnych endpointów - korzystamy bezpośrednio z SDK Supabase.

### 3.2. Operacje autentykacji (Supabase Auth SDK)

#### 3.2.1. Rejestracja użytkownika

**Metoda SDK**: `supabase.auth.signUp()`

**Parametry wejściowe**:
```typescript
interface SignUpParams {
  email: string;
  password: string;
  options?: {
    emailRedirectTo?: string; // URL dla linku potwierdzającego
  };
}
```

**Odpowiedź sukcesu**:
```typescript
interface SignUpResponse {
  user: User | null;
  session: Session | null;
}
```

**Efekty uboczne**:
1. Utworzenie rekordu w `auth.users`
2. Trigger `on_auth_user_created` tworzy rekord w `profiles` (istniejący mechanizm)
3. Wysłanie emaila potwierdzającego (jeśli włączone w Supabase)

---

#### 3.2.2. Logowanie użytkownika

**Metoda SDK**: `supabase.auth.signInWithPassword()`

**Parametry wejściowe**:
```typescript
interface SignInParams {
  email: string;
  password: string;
}
```

**Odpowiedź sukcesu**:
```typescript
interface SignInResponse {
  user: User;
  session: Session;
}
```

**Session zawiera**:
- `access_token` - JWT token (ważny 1h)
- `refresh_token` - token do odświeżania sesji (ważny 7 dni)
- `expires_at` - timestamp wygaśnięcia

---

#### 3.2.3. Wylogowanie użytkownika

**Metoda SDK**: `supabase.auth.signOut()`

**Parametry wejściowe**: brak

**Efekty**:
1. Unieważnienie sesji po stronie Supabase
2. Usunięcie tokenów z localStorage
3. Przekierowanie do strony głównej

---

#### 3.2.4. Resetowanie hasła - Wysłanie linku

**Metoda SDK**: `supabase.auth.resetPasswordForEmail()`

**Parametry wejściowe**:
```typescript
interface ResetPasswordParams {
  email: string;
  options?: {
    redirectTo?: string; // URL strony /reset-password
  };
}
```

**Efekty**:
1. Wysłanie emaila z linkiem do resetowania hasła
2. Link zawiera token ważny przez określony czas

---

#### 3.2.5. Resetowanie hasła - Ustawienie nowego hasła

**Metoda SDK**: `supabase.auth.updateUser()`

**Parametry wejściowe**:
```typescript
interface UpdatePasswordParams {
  password: string;
}
```

**Wymagania**:
- Użytkownik musi być zalogowany przez link resetujący (automatyczna sesja)

---

#### 3.2.6. Odświeżanie sesji

**Metoda SDK**: `supabase.auth.refreshSession()`

**Automatyczne odświeżanie**:
- Supabase SDK automatycznie odświeża sesję przed wygaśnięciem
- Konfiguracja w `supabase.client.ts`

---

### 3.3. Walidacja danych wejściowych

#### 3.3.1. Walidacja email

```typescript
interface EmailValidation {
  required: true;
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  maxLength: 255;
}
```

**Komunikaty błędów**:
- Puste pole: "Email jest wymagany"
- Nieprawidłowy format: "Nieprawidłowy format email"
- Za długi: "Email jest zbyt długi"

---

#### 3.3.2. Walidacja hasła

```typescript
interface PasswordValidation {
  required: true;
  minLength: 8;
  maxLength: 128;
  patterns: {
    uppercase: /[A-Z]/;    // Min. 1 wielka litera
    digit: /[0-9]/;        // Min. 1 cyfra
  };
}
```

**Komunikaty błędów**:
- Puste pole: "Hasło jest wymagane"
- Za krótkie: "Hasło musi mieć minimum 8 znaków"
- Brak wielkiej litery: "Hasło musi zawierać przynajmniej jedną wielką literę"
- Brak cyfry: "Hasło musi zawierać przynajmniej jedną cyfrę"

---

#### 3.3.3. Walidacja potwierdzenia hasła

```typescript
interface ConfirmPasswordValidation {
  required: true;
  matchField: 'password';
}
```

**Komunikaty błędów**:
- Puste pole: "Potwierdzenie hasła jest wymagane"
- Niezgodność: "Hasła muszą być identyczne"

---

### 3.4. Obsługa wyjątków (Error Handling)

#### 3.4.1. Mapowanie błędów Supabase na komunikaty UI

```typescript
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  // Błędy logowania
  'invalid_credentials': 'Nieprawidłowy email lub hasło',
  'email_not_confirmed': 'Email nie został potwierdzony. Sprawdź skrzynkę pocztową.',
  'user_not_found': 'Użytkownik nie istnieje',
  
  // Błędy rejestracji
  'user_already_exists': 'Konto z tym adresem email już istnieje',
  'weak_password': 'Hasło jest zbyt słabe',
  'invalid_email': 'Nieprawidłowy format adresu email',
  'signup_disabled': 'Rejestracja jest obecnie wyłączona',
  
  // Błędy resetowania hasła
  'expired_token': 'Link do resetowania hasła wygasł. Poproś o nowy link.',
  'invalid_token': 'Nieprawidłowy link do resetowania hasła',
  
  // Błędy ogólne
  'rate_limit_exceeded': 'Zbyt wiele prób. Spróbuj ponownie za kilka minut.',
  'network_error': 'Brak połączenia z internetem. Sprawdź połączenie i spróbuj ponownie.',
  'server_error': 'Wystąpił błąd serwera. Spróbuj ponownie później.',
  
  // Default
  'unknown_error': 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.',
};
```

#### 3.4.2. Struktura błędu

```typescript
interface AuthError {
  code: string;
  message: string;
  status?: number;
}
```

---

## 4. System Autentykacji

### 4.1. Kontekst autentykacji (AuthContext)

#### 4.1.1. Zastąpienie DevUserContext

Obecny `DevUserContext` zostanie zastąpiony przez `AuthContext`, który będzie zarządzał stanem autentykacji w całej aplikacji.

```typescript
interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}
```

#### 4.1.2. AuthProvider

**Odpowiedzialności**:
1. Nasłuchiwanie zmian stanu sesji (`onAuthStateChange`)
2. Inicjalizacja sesji przy starcie aplikacji
3. Automatyczne odświeżanie tokenów
4. Udostępnianie metod autentykacji komponentom

**Implementacja**:
- Hook `useAuth()` - dostęp do kontekstu autentykacji
- Wrapper `AuthProvider` - provider kontekstu
- Integracja z Supabase `onAuthStateChange`

---

### 4.2. Hook useAuth

```typescript
interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

const useAuth = (): UseAuthReturn;
```

**Użycie w komponentach**:
```typescript
const { user, isAuthenticated, signIn, signOut } = useAuth();
```

---

### 4.3. Zarządzanie sesją

#### 4.3.1. Inicjalizacja sesji

Przy starcie aplikacji:
1. Sprawdzenie czy istnieje zapisana sesja (`supabase.auth.getSession()`)
2. Jeśli sesja istnieje i jest ważna → ustaw stan jako zalogowany
3. Jeśli sesja wygasła → próba odświeżenia (`refreshSession()`)
4. Jeśli brak sesji lub odświeżenie nieudane → stan niezalogowany

#### 4.3.2. Nasłuchiwanie zmian

```typescript
supabase.auth.onAuthStateChange((event, session) => {
  switch (event) {
    case 'SIGNED_IN':
      // Użytkownik zalogował się
      break;
    case 'SIGNED_OUT':
      // Użytkownik wylogował się
      break;
    case 'TOKEN_REFRESHED':
      // Token został odświeżony
      break;
    case 'USER_UPDATED':
      // Dane użytkownika zostały zaktualizowane
      break;
    case 'PASSWORD_RECOVERY':
      // Użytkownik kliknął link resetowania hasła
      break;
  }
});
```

#### 4.3.3. Automatyczne wylogowanie

Scenariusze automatycznego wylogowania:
- Wygaśnięcie refresh token (po 7 dniach nieaktywności)
- Błąd odświeżania sesji
- Jawne wywołanie `signOut()`

---

### 4.4. Routing z autentykacją

#### 4.4.1. Nowa struktura routera

```typescript
const router = createBrowserRouter([
  // Trasy publiczne
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
    ],
  },
  
  // Trasy auth (tylko dla niezalogowanych)
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: 'reset-password',
        element: <ResetPasswordPage />,
      },
    ],
  },
  
  // Trasy chronione (tylko dla zalogowanych)
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: 'questionnaire',
        element: <QuestionnairePage />,
      },
      {
        path: 'upload-cv',
        element: <UploadCVPage />,
      },
      {
        path: 'recommendations',
        element: <RecommendationsPage />,
      },
      {
        path: 'roadmap',
        element: <RoadmapPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
]);
```

#### 4.4.2. Komponent ProtectedRoute

```typescript
interface ProtectedRouteProps {
  children?: ReactNode;
  redirectTo?: string;
}
```

**Logika**:
1. Pobierz stan autentykacji z `useAuth()`
2. Jeśli `isLoading` → wyświetl `LoadingSpinner`
3. Jeśli `!isAuthenticated` → przekieruj do `redirectTo` (default: `/login`)
4. Jeśli `isAuthenticated` → renderuj `children` lub `<Outlet />`

**Zapisywanie return URL**:
- Przed przekierowaniem zapisz aktualny URL do `sessionStorage`
- Po zalogowaniu przekieruj do zapisanego URL lub do `/`

---

### 4.5. Integracja z istniejącą logiką aplikacji

#### 4.5.1. Migracja z DevUserContext

**Obecnie**:
```typescript
const { userId } = useDevUser();
```

**Po migracji**:
```typescript
const { user } = useAuth();
const userId = user?.id;
```

**Zmiany w komponentach**:
- Wszystkie użycia `useDevUser()` zamienić na `useAuth()`
- Dodać obsługę przypadku gdy `user` jest `null`

#### 4.5.2. Aktualizacja API calls

**Obecnie** (z hardcoded DEV_USER_ID):
```typescript
const { data } = await supabaseClient
  .from('profiles')
  .select('*')
  .eq('id', userId);
```

**Po migracji** (z auth.uid() przez RLS):
```typescript
// RLS automatycznie filtruje po auth.uid()
const { data } = await supabaseClient
  .from('profiles')
  .select('*')
  .single();
```

**Uwaga**: Dzięki Row Level Security (RLS) w Supabase, większość zapytań nie wymaga jawnego przekazywania `user_id`. Supabase automatycznie identyfikuje użytkownika na podstawie JWT tokenu.

---

### 4.6. Konfiguracja Supabase

#### 4.6.1. Aktualizacja supabase.client.ts

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.',
  );
}

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // Dla obsługi linków z emaili (reset password, confirm)
  },
});
```

#### 4.6.2. Konfiguracja Supabase Dashboard

**Email Templates** (do skonfigurowania w Supabase Dashboard):
- Confirmation email (potwierdzenie rejestracji)
- Reset password email (resetowanie hasła)

**Redirect URLs** (do skonfigurowania):
- `{APP_URL}/reset-password` - dla linków resetowania hasła
- `{APP_URL}/confirm-email` - dla linków potwierdzenia email (opcjonalnie)

**Site URL**:
- Ustawić na URL aplikacji (np. `http://localhost:5173` dla dev, `https://jobswitch.app` dla prod)

---

## 5. Scenariusze użycia

### 5.1. Rejestracja nowego użytkownika

```
1. Użytkownik wchodzi na /register
2. Wypełnia formularz (email, hasło, potwierdzenie hasła)
3. System waliduje dane po stronie klienta
4. Jeśli walidacja OK → wywołanie supabase.auth.signUp()
5. Supabase tworzy użytkownika w auth.users
6. Trigger tworzy profil w profiles
7. (Opcjonalnie) Supabase wysyła email potwierdzający
8. Użytkownik widzi komunikat sukcesu
9. Przekierowanie do /login
```

### 5.2. Logowanie istniejącego użytkownika

```
1. Użytkownik wchodzi na /login
2. Wypełnia formularz (email, hasło)
3. System waliduje dane po stronie klienta
4. Jeśli walidacja OK → wywołanie supabase.auth.signInWithPassword()
5. Supabase waliduje credentials
6. Jeśli OK → zwraca session z tokenami
7. AuthContext aktualizuje stan (isAuthenticated = true)
8. Przekierowanie do / lub zapisanego return URL
9. Użytkownik widzi UI zalogowanego użytkownika
```

### 5.3. Wylogowanie użytkownika

```
1. Użytkownik klika "Wyloguj" w UserMenu
2. Wywołanie supabase.auth.signOut()
3. Supabase unieważnia sesję
4. AuthContext aktualizuje stan (isAuthenticated = false)
5. Przekierowanie do /
6. Użytkownik widzi UI niezalogowanego użytkownika
```

### 5.4. Resetowanie hasła

```
1. Użytkownik wchodzi na /forgot-password
2. Wpisuje email
3. Wywołanie supabase.auth.resetPasswordForEmail()
4. Supabase wysyła email z linkiem
5. Użytkownik widzi komunikat "Link wysłany"
6. Użytkownik klika link w emailu
7. Przekierowanie do /reset-password z tokenem
8. Supabase automatycznie tworzy sesję recovery
9. Użytkownik wpisuje nowe hasło
10. Wywołanie supabase.auth.updateUser({ password })
11. Hasło zaktualizowane
12. Przekierowanie do /login z komunikatem sukcesu
```

### 5.5. Dostęp do chronionej trasy (niezalogowany)

```
1. Niezalogowany użytkownik próbuje wejść na /questionnaire
2. ProtectedRoute sprawdza isAuthenticated
3. isAuthenticated = false
4. Zapisanie /questionnaire do sessionStorage
5. Przekierowanie do /login
6. (Po zalogowaniu) Odczytanie return URL
7. Przekierowanie do /questionnaire
```

---

## 6. Wpływ na istniejącą dokumentację

### 6.1. Aktualizacja api-plan.md

Sekcja "2.1. Authentication Endpoints" (obecnie zakomentowana) powinna zostać odkomentowana i zaktualizowana zgodnie z tą specyfikacją.

### 6.2. Aktualizacja ui-architecture-plan.md

**Sekcja 1.2. Główne założenia**:
- Zmiana: "Brak autentykacji w MVP (hardcoded dev user)" → "Pełna autentykacja z Supabase Auth"

**Sekcja 2.1. Routes**:
- Dodanie tras auth: `/login`, `/register`, `/forgot-password`, `/reset-password`
- Aktualizacja dostępności tras (wymóg autentykacji)

**Sekcja 6.3. Dev User Context**:
- Usunięcie lub oznaczenie jako deprecated
- Zastąpienie przez AuthContext

### 6.3. Brak zmian w db-plan.md

Schemat bazy danych nie wymaga zmian - autentykacja korzysta z wbudowanych mechanizmów Supabase (`auth.users`) oraz istniejącego triggera tworzącego profil.

---

## 7. Podsumowanie

### 7.1. Nowe komponenty do implementacji

| Komponent | Typ | Priorytet |
|-----------|-----|-----------|
| `AuthProvider` / `AuthContext` | Context | Krytyczny |
| `useAuth` | Hook | Krytyczny |
| `ProtectedRoute` | Component | Krytyczny |
| `LoginPage` | Page | Krytyczny |
| `RegisterPage` | Page | Krytyczny |
| `LoginForm` | Component | Krytyczny |
| `RegisterForm` | Component | Krytyczny |
| `PasswordField` | Component | Wysoki |
| `AppHeader` | Component | Wysoki |
| `AuthFormContainer` | Component | Wysoki |
| `ForgotPasswordPage` | Page | Średni |
| `ResetPasswordPage` | Page | Średni |
| `PasswordStrengthIndicator` | Component | Średni |
| `UserMenu` | Component | Średni |
| `AuthLayout` | Layout | Średni |
| `AppLayout` | Layout | Średni |

### 7.2. Istniejące komponenty do modyfikacji

| Komponent | Zmiany |
|-----------|--------|
| `App.tsx` | Nowa struktura routera, zastąpienie DevUserProvider na AuthProvider |
| `LandingPage` | Warunkowy render dla auth/non-auth |
| `LandingHero` | Nowe props (isAuthenticated), zmiana logiki CTA |
| `supabase.client.ts` | Dodanie konfiguracji auth |
| Wszystkie komponenty używające `useDevUser` | Migracja na `useAuth` |

### 7.3. Kontrakty API (Supabase Auth SDK)

| Operacja | Metoda SDK |
|----------|------------|
| Rejestracja | `supabase.auth.signUp()` |
| Logowanie | `supabase.auth.signInWithPassword()` |
| Wylogowanie | `supabase.auth.signOut()` |
| Reset hasła (email) | `supabase.auth.resetPasswordForEmail()` |
| Reset hasła (nowe hasło) | `supabase.auth.updateUser()` |
| Pobieranie sesji | `supabase.auth.getSession()` |
| Nasłuchiwanie zmian | `supabase.auth.onAuthStateChange()` |

### 7.4. Zgodność z istniejącą aplikacją

- ✅ Nie narusza istniejącej struktury bazy danych
- ✅ Wykorzystuje istniejący trigger tworzenia profilu
- ✅ Kompatybilne z obecnymi politykami RLS
- ✅ Nie wymaga zmian w Edge Functions
- ✅ Zachowuje obecną strukturę stron i komponentów (rozszerza ją)

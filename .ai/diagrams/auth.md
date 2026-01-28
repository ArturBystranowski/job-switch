# Diagram Autentykacji - JobSwitch

## Przegląd

Niniejszy diagram przedstawia kompletny przepływ autentykacji w aplikacji JobSwitch
z wykorzystaniem Supabase Auth. Obejmuje procesy rejestracji, logowania, wylogowania,
resetowania hasła oraz zarządzania sesją.

## Aktorzy

- **Przeglądarka** - interfejs użytkownika, formularze, localStorage
- **React App** - AuthContext, ProtectedRoute, komponenty
- **Supabase Auth** - serwis autentykacji, walidacja, tokeny JWT
- **Baza Danych** - tabele auth.users oraz profiles

---

## 1. Przepływ rejestracji użytkownika

```mermaid
sequenceDiagram
    autonumber
    participant P as Przeglądarka
    participant R as React App
    participant S as Supabase Auth
    participant DB as Baza Danych

    P->>R: Nawigacja do /register
    R->>P: Renderowanie RegisterForm

    P->>R: Wprowadzenie email, hasło, potwierdzenie
    activate R
    R->>R: Walidacja kliencka
    Note over R: Sprawdzenie formatu email<br/>Min. 8 znaków hasła<br/>Wielka litera + cyfra<br/>Zgodność haseł
    deactivate R

    alt Walidacja niepoprawna
        R-->>P: Wyświetlenie błędów walidacji
    else Walidacja poprawna
        R->>S: signUp(email, password)
        activate S
        S->>S: Walidacja serwerowa
        
        alt Email już istnieje
            S-->>R: Błąd user_already_exists
            R-->>P: Konto z tym adresem już istnieje
        else Hasło zbyt słabe
            S-->>R: Błąd weak_password
            R-->>P: Hasło jest zbyt słabe
        else Rejestracja udana
            S->>DB: Utworzenie rekordu auth.users
            DB->>DB: Trigger on_auth_user_created
            DB->>DB: Utworzenie rekordu profiles
            S->>S: Wysłanie emaila potwierdzającego
            S-->>R: Sukces + user data
            deactivate S
            R-->>P: Konto utworzone. Sprawdź email.
            R->>P: Przekierowanie do /login
        end
    end
```

---

## 2. Przepływ logowania użytkownika

```mermaid
sequenceDiagram
    autonumber
    participant P as Przeglądarka
    participant R as React App
    participant S as Supabase Auth

    P->>R: Nawigacja do /login
    R->>P: Renderowanie LoginForm

    P->>R: Wprowadzenie email i hasła
    activate R
    R->>R: Walidacja kliencka
    Note over R: Sprawdzenie czy pola<br/>nie są puste
    deactivate R

    R->>S: signInWithPassword(email, password)
    activate S
    S->>S: Weryfikacja credentials

    alt Nieprawidłowe dane
        S-->>R: Błąd invalid_credentials
        R-->>P: Nieprawidłowy email lub hasło
    else Email niepotwierdzony
        S-->>R: Błąd email_not_confirmed
        R-->>P: Email nie został potwierdzony
    else Zbyt wiele prób
        S-->>R: Błąd too_many_requests
        R-->>P: Zbyt wiele prób logowania
    else Logowanie udane
        S->>S: Generowanie tokenów JWT
        Note over S: access_token (1h)<br/>refresh_token (7d)
        S-->>R: Session + User data
        deactivate S
        
        activate R
        R->>R: AuthContext.setState
        Note over R: isAuthenticated = true<br/>user = userData
        R->>P: Zapis sesji do localStorage
        deactivate R
        
        R->>R: Sprawdzenie return URL
        alt Istnieje zapisany URL
            R->>P: Przekierowanie do return URL
        else Brak zapisanego URL
            R->>P: Przekierowanie do /
        end
    end
```

---

## 3. Przepływ wylogowania użytkownika

```mermaid
sequenceDiagram
    autonumber
    participant P as Przeglądarka
    participant R as React App
    participant S as Supabase Auth

    P->>R: Kliknięcie Wyloguj w UserMenu
    
    R->>S: signOut()
    activate S
    S->>S: Unieważnienie sesji
    S-->>R: Potwierdzenie wylogowania
    deactivate S
    
    activate R
    R->>R: AuthContext.setState
    Note over R: isAuthenticated = false<br/>user = null<br/>session = null
    R->>P: Usunięcie tokenów z localStorage
    deactivate R
    
    R->>P: Przekierowanie do /
    P->>R: Renderowanie UI niezalogowanego
```

---

## 4. Przepływ resetowania hasła

```mermaid
sequenceDiagram
    autonumber
    participant P as Przeglądarka
    participant R as React App
    participant S as Supabase Auth
    participant E as Email

    rect rgb(240, 248, 255)
        Note over P,E: Etap 1: Wysłanie linku
        P->>R: Nawigacja do /forgot-password
        R->>P: Renderowanie ForgotPasswordForm
        
        P->>R: Wprowadzenie email
        R->>S: resetPasswordForEmail(email)
        activate S
        S->>E: Wysłanie emaila z linkiem
        Note over E: Link zawiera token<br/>i redirectTo URL
        S-->>R: Sukces
        deactivate S
        R-->>P: Link wysłany na podany adres
    end

    rect rgb(255, 250, 240)
        Note over P,E: Etap 2: Ustawienie nowego hasła
        E->>P: Użytkownik klika link w emailu
        P->>R: Nawigacja do /reset-password z tokenem
        
        activate S
        S->>S: Weryfikacja tokenu
        S->>R: Automatyczna sesja recovery
        deactivate S
        
        R->>P: Renderowanie ResetPasswordForm
        P->>R: Wprowadzenie nowego hasła
        
        activate R
        R->>R: Walidacja siły hasła
        deactivate R
        
        R->>S: updateUser(password)
        activate S
        
        alt Token wygasł
            S-->>R: Błąd expired_token
            R-->>P: Link wygasł. Poproś o nowy.
        else Token nieprawidłowy
            S-->>R: Błąd invalid_token
            R-->>P: Nieprawidłowy link
        else Sukces
            S->>S: Aktualizacja hasła
            S-->>R: Potwierdzenie
            deactivate S
            R-->>P: Hasło zmienione
            R->>P: Przekierowanie do /login
        end
    end
```

---

## 5. Przepływ ochrony tras (Protected Routes)

```mermaid
sequenceDiagram
    autonumber
    participant P as Przeglądarka
    participant PR as ProtectedRoute
    participant AC as AuthContext
    participant R as React App
    participant S as Supabase Auth

    P->>PR: Nawigacja do chronionej trasy
    Note over P: np. /questionnaire

    PR->>AC: Sprawdzenie useAuth()
    
    alt isLoading = true
        AC-->>PR: Stan ładowania
        PR->>P: Wyświetlenie LoadingSpinner
        
        AC->>S: getSession()
        S-->>AC: Session lub null
        AC->>AC: Aktualizacja stanu
    end

    alt isAuthenticated = false
        AC-->>PR: Brak sesji
        PR->>P: Zapis URL do sessionStorage
        Note over P: returnUrl = /questionnaire
        PR->>P: Przekierowanie do /login
        
        Note over P,S: Po zalogowaniu
        P->>PR: Powrót do chronionej trasy
        PR->>AC: Sprawdzenie useAuth()
        AC-->>PR: isAuthenticated = true
        PR->>P: Odczytanie returnUrl
        PR->>R: Renderowanie chronionego komponentu
    else isAuthenticated = true
        AC-->>PR: Sesja aktywna
        PR->>R: Renderowanie children/Outlet
        R->>P: Wyświetlenie chronionej strony
    end
```

---

## 6. Zarządzanie sesją i odświeżanie tokenów

```mermaid
sequenceDiagram
    autonumber
    participant P as Przeglądarka
    participant AC as AuthContext
    participant S as Supabase Auth

    rect rgb(240, 255, 240)
        Note over P,S: Inicjalizacja aplikacji
        P->>AC: Montowanie AuthProvider
        AC->>S: getSession()
        
        alt Brak zapisanej sesji
            S-->>AC: null
            AC->>AC: setState(isAuthenticated: false)
        else Sesja ważna
            S-->>AC: Session data
            AC->>AC: setState(isAuthenticated: true)
        else Sesja wygasła
            S->>S: refreshSession()
            alt Odświeżenie udane
                S-->>AC: Nowa session
                AC->>AC: setState(isAuthenticated: true)
            else Odświeżenie nieudane
                S-->>AC: null
                AC->>AC: setState(isAuthenticated: false)
            end
        end
    end

    rect rgb(255, 245, 238)
        Note over P,S: Nasłuchiwanie zmian sesji
        AC->>S: onAuthStateChange(callback)
        
        par Zdarzenie SIGNED_IN
            S-->>AC: Event: SIGNED_IN
            AC->>AC: Aktualizacja user i session
        and Zdarzenie SIGNED_OUT
            S-->>AC: Event: SIGNED_OUT
            AC->>AC: Wyczyszczenie stanu
        and Zdarzenie TOKEN_REFRESHED
            S-->>AC: Event: TOKEN_REFRESHED
            AC->>AC: Aktualizacja session
        and Zdarzenie PASSWORD_RECOVERY
            S-->>AC: Event: PASSWORD_RECOVERY
            AC->>P: Przekierowanie do /reset-password
        end
    end

    rect rgb(255, 240, 245)
        Note over P,S: Automatyczne odświeżanie tokenu
        S->>S: Monitor wygaśnięcia access_token
        Note over S: Token wygasa za 1h
        
        alt Przed wygaśnięciem
            S->>S: refreshSession()
            S-->>AC: EVENT: TOKEN_REFRESHED
            AC->>P: Aktualizacja localStorage
        else Refresh token wygasł
            S-->>AC: EVENT: SIGNED_OUT
            AC->>AC: setState(isAuthenticated: false)
            AC->>P: Przekierowanie do /login
        end
    end
```

---

## 7. Kompletny przepływ dostępu do aplikacji

```mermaid
sequenceDiagram
    autonumber
    participant U as Użytkownik
    participant P as Przeglądarka
    participant R as React App
    participant S as Supabase Auth
    participant DB as Baza Danych

    U->>P: Wejście na stronę główną
    P->>R: Renderowanie LandingPage
    
    R->>S: getSession()
    
    alt Niezalogowany użytkownik
        S-->>R: null
        R->>P: UI niezalogowanego
        Note over P: Przyciski Zaloguj/Zarejestruj
        
        U->>P: Kliknięcie Rozpocznij
        P->>R: Przekierowanie do /login
        
        Note over U,DB: Proces logowania/rejestracji
        
        R->>S: signInWithPassword()
        S-->>R: Session + User
        R->>P: Przekierowanie do /questionnaire
        
    else Zalogowany użytkownik
        S-->>R: Session data
        R->>P: UI zalogowanego
        Note over P: Avatar, UserMenu, Nawigacja
        
        U->>P: Kliknięcie Rozpocznij
        P->>R: Nawigacja do /questionnaire
        R->>R: ProtectedRoute sprawdza sesję
        R->>P: Renderowanie QuestionnairePage
    end

    rect rgb(245, 245, 245)
        Note over U,DB: Operacje na danych użytkownika
        U->>P: Wypełnienie formularza
        P->>R: Zapisanie danych
        R->>DB: Zapytanie z JWT w nagłówku
        Note over DB: RLS automatycznie<br/>filtruje po auth.uid()
        DB-->>R: Dane użytkownika
        R->>P: Aktualizacja UI
    end
```

---

## Podsumowanie

### Kluczowe elementy architektury autentykacji

| Element | Odpowiedzialność |
|---------|------------------|
| **AuthContext** | Zarządzanie stanem sesji w aplikacji |
| **ProtectedRoute** | Ochrona tras wymagających autentykacji |
| **Supabase Auth** | Walidacja, generowanie tokenów, wysyłanie emaili |
| **RLS (Row Level Security)** | Automatyczne filtrowanie danych po auth.uid() |

### Tokeny JWT

| Token | Czas ważności | Przeznaczenie |
|-------|---------------|---------------|
| access_token | 1 godzina | Autoryzacja zapytań API |
| refresh_token | 7 dni | Odświeżanie access_token |

### Zdarzenia onAuthStateChange

| Zdarzenie | Opis |
|-----------|------|
| `SIGNED_IN` | Użytkownik zalogował się |
| `SIGNED_OUT` | Użytkownik wylogował się |
| `TOKEN_REFRESHED` | Token został odświeżony |
| `USER_UPDATED` | Dane użytkownika zaktualizowane |
| `PASSWORD_RECOVERY` | Kliknięto link resetowania hasła |

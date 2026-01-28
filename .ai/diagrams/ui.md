# Architektura UI - JobSwitch

Diagram przedstawia architekturę interfejsu użytkownika aplikacji JobSwitch wraz z modułem autentykacji.

<mermaid_diagram>

```mermaid
flowchart TD
    subgraph "Punkt wejścia"
        MAIN["main.tsx"]
        APP["App.tsx"]
    end

    subgraph "Providery aplikacji"
        QUERY["QueryClientProvider"]
        SUPA["SupabaseProvider"]
        AUTH["AuthProvider"]
        ROUTER["RouterProvider"]
    end

    subgraph "Layouty"
        APPLAYOUT["AppLayout"]
        AUTHLAYOUT["AuthLayout"]
        PROTECTED["ProtectedRoute"]
    end

    subgraph "Nawigacja"
        APPHEADER["AppHeader"]
        AUTHBUTTONS["AuthButtons"]
        USERMENU["UserMenu"]
    end

    subgraph "Strony publiczne"
        LANDING["LandingPage"]
        LOGIN["LoginPage"]
        REGISTER["RegisterPage"]
        FORGOT["ForgotPasswordPage"]
        RESET["ResetPasswordPage"]
        CONFIRM["EmailConfirmationPage"]
    end

    subgraph "Strony chronione"
        QUEST["QuestionnairePage"]
        UPLOAD["UploadCVPage"]
        RECOM["RecommendationsPage"]
        ROAD["RoadmapPage"]
        PROFILE["ProfilePage"]
    end

    MAIN --> APP
    APP --> QUERY
    QUERY --> SUPA
    SUPA --> AUTH
    AUTH --> ROUTER

    ROUTER --> APPLAYOUT
    ROUTER --> AUTHLAYOUT
    ROUTER --> PROTECTED

    APPLAYOUT --> APPHEADER
    APPHEADER --> AUTHBUTTONS
    APPHEADER --> USERMENU

    APPLAYOUT --> LANDING
    AUTHLAYOUT --> LOGIN
    AUTHLAYOUT --> REGISTER
    AUTHLAYOUT --> FORGOT
    AUTHLAYOUT --> RESET
    AUTHLAYOUT --> CONFIRM

    PROTECTED --> QUEST
    PROTECTED --> UPLOAD
    PROTECTED --> RECOM
    PROTECTED --> ROAD
    PROTECTED --> PROFILE
```

</mermaid_diagram>

---

## Komponenty stron

<mermaid_diagram>

```mermaid
flowchart TD
    subgraph "Landing Page"
        LP["LandingPage"]
        HERO["LandingHero"]
        STEPS["StepsPreview"]
    end

    subgraph "Komponenty autentykacji"
        AFC["AuthFormContainer"]
        LF["LoginForm"]
        RF["RegisterForm"]
        FPF["ForgotPasswordForm"]
        RPF["ResetPasswordForm"]
        PWD["PasswordField"]
        PSI["PasswordStrengthIndicator"]
    end

    subgraph "Questionnaire Page"
        QP["QuestionnairePage"]
        QSTEP["QuestionnaireStepper"]
        QCARD["QuestionCard"]
        OQCARD["OpenQuestionCard"]
        OPTSEL["OptionSelector"]
    end

    subgraph "Upload CV Page"
        UCP["UploadCVPage"]
        DROP["CVDropzone"]
        PREV["CVPreview"]
        WARN["UploadWarningBanner"]
    end

    subgraph "Recommendations Page"
        RCP["RecommendationsPage"]
        RCARD["RoleCard"]
        RCONF["RoleConfirmationDialog"]
        RBADGE["RecommendationBadge"]
    end

    subgraph "Roadmap Page"
        RMP["RoadmapPage"]
        RTREE["RoadmapTree"]
        RNODE["RoadmapNode"]
        RPROG["RoadmapProgressHeader"]
        TBRANCH["TaskBranch"]
        TPANEL["TaskDetailsPanel"]
        TSHEET["TaskDetailsSheet"]
        TDRAWER["StepTasksDrawer"]
    end

    subgraph "Profile Page"
        PP["ProfilePage"]
        PSEC["ProfileSection"]
        SRCARD["SelectedRoleCard"]
        QANS["QuestionnaireAnswers"]
        PSUM["ProgressSummary"]
    end

    LP --> HERO
    LP --> STEPS

    AFC --> PWD
    LF --> AFC
    RF --> AFC
    RF --> PSI
    FPF --> AFC
    RPF --> AFC
    RPF --> PSI

    QP --> QSTEP
    QSTEP --> QCARD
    QSTEP --> OQCARD
    QCARD --> OPTSEL

    UCP --> DROP
    UCP --> PREV
    UCP --> WARN

    RCP --> RCARD
    RCP --> RCONF
    RCARD --> RBADGE

    RMP --> RTREE
    RMP --> RPROG
    RTREE --> RNODE
    RNODE --> TBRANCH
    TBRANCH --> TPANEL
    RMP --> TDRAWER
    TDRAWER --> TSHEET

    PP --> PSEC
    PP --> SRCARD
    PP --> QANS
    PP --> PSUM
```

</mermaid_diagram>

---

## Przepływ użytkownika

<mermaid_diagram>

```mermaid
flowchart TD
    START((Start))
    
    subgraph "Faza autentykacji"
        CHECK{Zalogowany?}
        LANDPUB["Landing Page - widok publiczny"]
        LANDAUTH["Landing Page - widok zalogowanego"]
        LOGINP["Strona logowania"]
        REGP["Strona rejestracji"]
        FORGP["Odzyskiwanie hasła"]
    end

    subgraph "Faza zbierania danych"
        QUESTP["Wypełnienie kwestionariusza"]
        CVP["Upload CV"]
    end

    subgraph "Faza rekomendacji"
        GENREC["Generowanie rekomendacji AI"]
        VIEWREC["Przegląd 2 ról"]
        SELROLE["Wybór roli"]
        CONFROLE["Potwierdzenie wyboru"]
    end

    subgraph "Faza realizacji"
        VIEWROAD["Przeglądanie roadmapy"]
        MARKSTEP["Oznaczanie ukończonych kroków"]
        VIEWPROG["Śledzenie postępu"]
    end

    subgraph "Profil użytkownika"
        PROFVIEW["Przegląd profilu"]
        LOGOUT["Wylogowanie"]
    end

    START --> CHECK
    CHECK -->|Nie| LANDPUB
    CHECK -->|Tak| LANDAUTH
    
    LANDPUB --> LOGINP
    LANDPUB --> REGP
    LOGINP --> LANDAUTH
    REGP --> LOGINP
    LOGINP -.-> FORGP
    FORGP -.-> LOGINP

    LANDAUTH --> QUESTP
    QUESTP --> CVP
    CVP --> GENREC
    GENREC --> VIEWREC
    VIEWREC --> SELROLE
    SELROLE --> CONFROLE
    CONFROLE --> VIEWROAD

    VIEWROAD --> MARKSTEP
    MARKSTEP --> VIEWPROG
    VIEWPROG --> VIEWROAD

    LANDAUTH --> PROFVIEW
    VIEWROAD --> PROFVIEW
    PROFVIEW --> LOGOUT
    LOGOUT --> LANDPUB
```

</mermaid_diagram>

---

## Zarządzanie stanem aplikacji

<mermaid_diagram>

```mermaid
flowchart TD
    subgraph "Stan globalny"
        AUTHCTX["AuthContext"]
        TANSTACK["TanStack Query Cache"]
    end

    subgraph "Hooki autentykacji"
        USEAUTH["useAuth"]
    end

    subgraph "Hooki domenowe"
        USEPROF["useProfile"]
        USEQUEST["useQuestionnaire"]
        USECV["useCV"]
        USEREC["useRecommendation"]
        USEROAD["useRoadmap"]
        USEPROG["useProgress"]
        USEROLES["useRoles"]
    end

    subgraph "Warstwa API"
        PROFAPI["profiles.api"]
        QUESTAPI["questionnaire.api"]
        CVAPI["cv.api"]
        RECAPI["recommendation.api"]
        ROADAPI["roadmap.api"]
        PROGAPI["progress.api"]
        ROLESAPI["roles.api"]
    end

    subgraph "Backend - Supabase"
        SUPAAUTH["Supabase Auth"]
        SUPADB["Supabase Database"]
        SUPASTOR["Supabase Storage"]
        SUPAFUNC["Edge Functions"]
    end

    AUTHCTX --> USEAUTH
    TANSTACK --> USEPROF
    TANSTACK --> USEQUEST
    TANSTACK --> USECV
    TANSTACK --> USEREC
    TANSTACK --> USEROAD
    TANSTACK --> USEPROG
    TANSTACK --> USEROLES

    USEAUTH --> SUPAAUTH
    USEPROF --> PROFAPI --> SUPADB
    USEQUEST --> QUESTAPI --> SUPADB
    USECV --> CVAPI --> SUPASTOR
    USEREC --> RECAPI --> SUPAFUNC
    USEROAD --> ROADAPI --> SUPADB
    USEPROG --> PROGAPI --> SUPADB
    USEROLES --> ROLESAPI --> SUPADB
```

</mermaid_diagram>

---

## Komponenty wspólne i zależności

<mermaid_diagram>

```mermaid
flowchart TD
    subgraph "Komponenty wspólne"
        LOADING["LoadingSpinner"]
        AILOAD["AILoadingOverlay"]
        CONFIRMD["ConfirmDialog"]
        ERRALERT["ErrorAlert"]
    end

    subgraph "Komponenty wymagające aktualizacji"
        direction TB
        HEROMOD["LandingHero - nowe props isAuthenticated"]
        APPTSX["App.tsx - nowa struktura routera"]
        SUPACLIENT["supabase.client.ts - konfiguracja auth"]
    end

    subgraph "Nowe komponenty layoutu"
        APPLAYOUTNEW["AppLayout - główny layout"]
        AUTHLAYOUTNEW["AuthLayout - layout auth stron"]
        PROTECTEDNEW["ProtectedRoute - ochrona tras"]
        APPHEADERNEW["AppHeader - nawigacja"]
    end

    subgraph "Nowe komponenty auth"
        AUTHFORMNEW["AuthFormContainer"]
        LOGINNEW["LoginForm"]
        REGNEW["RegisterForm"]
        FORGOTNEW["ForgotPasswordForm"]
        RESETNEW["ResetPasswordForm"]
        PWDNEW["PasswordField"]
        PSINEW["PasswordStrengthIndicator"]
        UMNEW["UserMenu"]
    end

    APPLAYOUTNEW --> APPHEADERNEW
    APPHEADERNEW --> UMNEW
    
    AUTHLAYOUTNEW --> AUTHFORMNEW
    AUTHFORMNEW --> PWDNEW
    
    LOGINNEW --> AUTHFORMNEW
    REGNEW --> AUTHFORMNEW
    REGNEW --> PSINEW
    FORGOTNEW --> AUTHFORMNEW
    RESETNEW --> AUTHFORMNEW
    RESETNEW --> PSINEW

    HEROMOD -.->|wymaga| APPTSX
    APPTSX -.->|wymaga| SUPACLIENT
```

</mermaid_diagram>

---

## Struktura tras routera

<mermaid_diagram>

```mermaid
flowchart LR
    subgraph "Trasy publiczne"
        ROOT["/"]
    end

    subgraph "Trasy auth - tylko niezalogowani"
        LOGINR["/login"]
        REGR["/register"]
        FORGOTR["/forgot-password"]
        RESETR["/reset-password"]
        CONFIRMR["/confirm-email"]
    end

    subgraph "Trasy chronione - tylko zalogowani"
        QUESTR["/questionnaire"]
        UPLOADR["/upload-cv"]
        RECR["/recommendations"]
        ROADR["/roadmap"]
        PROFILER["/profile"]
    end

    ROOT --> LOGINR
    ROOT --> REGR
    LOGINR --> FORGOTR
    FORGOTR --> RESETR
    
    LOGINR -->|po zalogowaniu| QUESTR
    REGR -->|po rejestracji| LOGINR
    
    QUESTR --> UPLOADR
    UPLOADR --> RECR
    RECR --> ROADR
    ROADR --> PROFILER
```

</mermaid_diagram>

---

## Legenda

| Symbol | Znaczenie |
|--------|-----------|
| `[ ]` | Komponent / Strona |
| `{ }` | Decyzja / Warunek |
| `(( ))` | Punkt startu / końca |
| `-->` | Przepływ danych / nawigacja |
| `-.->` | Przepływ opcjonalny |
| Subgraph | Grupowanie funkcjonalne |

---

## Komponenty wymagające implementacji

### Priorytet krytyczny
- `AuthProvider` / `AuthContext`
- `useAuth` hook
- `ProtectedRoute`
- `LoginPage` + `LoginForm`
- `RegisterPage` + `RegisterForm`

### Priorytet wysoki
- `PasswordField`
- `AppHeader`
- `AuthFormContainer`
- `AppLayout`

### Priorytet średni
- `ForgotPasswordPage` + `ForgotPasswordForm`
- `ResetPasswordPage` + `ResetPasswordForm`
- `PasswordStrengthIndicator`
- `UserMenu`
- `AuthLayout`

---

## Komponenty wymagające modyfikacji

| Komponent | Zakres zmian |
|-----------|--------------|
| `App.tsx` | Nowa struktura routera, zamiana DevUserProvider na AuthProvider |
| `LandingPage` | Warunkowy render dla auth/non-auth |
| `LandingHero` | Nowe props (isAuthenticated), zmiana logiki CTA |
| `supabase.client.ts` | Dodanie konfiguracji auth |
| Wszystkie komponenty używające `useDevUser` | Migracja na `useAuth` |

# UI Architecture Plan - JobSwitch MVP

## 1. Przegląd architektury

### 1.1. Stack technologiczny UI
- **Framework**: React 19 z TypeScript 5
- **Bundler**: Vite
- **UI Library**: Material UI (MUI)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router z createBrowserRouter
- **Carousel**: Embla Carousel
- **Styling**: MUI sx prop w osobnych plikach `*.sx.ts`

### 1.2. Główne założenia
- Mobile-first approach z responsywnością
- Brak autentykacji w MVP (hardcoded dev user)
- Liniowy przepływ dla nowych użytkowników, swobodna nawigacja po wyborze roli
- Prosty, czysty design bez nadmiernej złożoności

---

## 2. Struktura nawigacji i routingu

### 2.1. Routes

| Ścieżka | Widok | Opis | Dostępność |
|---------|-------|------|------------|
| `/` | LandingPage | Strona startowa z CTA | Zawsze |
| `/questionnaire` | QuestionnairePage | Multi-step formularz preferencji | Po kliknięciu "Rozpocznij" |
| `/upload-cv` | UploadCVPage | Upload pliku CV (PDF) | Po ukończeniu kwestionariusza |
| `/recommendations` | RecommendationsPage | Wyświetlenie 2 ról AI | Po uploadzie CV i analizie AI |
| `/select-role` | SelectRolePage | Potwierdzenie wyboru roli | Po wyświetleniu rekomendacji |
| `/roadmap` | RoadmapPage | Główny widok drzewa roadmapy | Po wyborze roli |
| `/roadmap/step/:stepId` | StepDetailsPage | Szczegóły kroku (deep-link) | Po wyborze roli |
| `/profile` | ProfilePage | Podgląd profilu (read-only) | Po wyborze roli |

### 2.2. Nawigacja

**Przed wyborem roli:**
- Brak głównej nawigacji
- Stepper wizualny pokazujący postęp: Kwestionariusz → Upload CV → Rekomendacje → Wybór roli
- Możliwość cofania się między krokami (edycja możliwa)

**Po wyborze roli:**
- **Desktop**: Top navbar z logo, mini progress indicator, ikona profilu
- **Mobile**: Top navbar + bottom navigation (Roadmapa, Profil) lub hamburger menu
- Brak możliwości powrotu do poprzednich kroków (read-only w profilu)

---

## 3. Widoki i komponenty

### 3.1. Landing Page (`/`)

**Layout:**
- Nagłówek: "Znajdź swoją ścieżkę w IT"
- Podtytuł: "Odpowiedz na kilka pytań, prześlij CV, a my zaproponujemy Ci idealną rolę z planem rozwoju"
- Główny CTA: Button "Rozpocznij" (primary, duży)
- 3 ikony/bullet points: Kwestionariusz → Analiza AI → Roadmapa
- Brak nawigacji górnej (poza logo)

**Komponenty:**
- `LandingHero` - główna sekcja hero
- `StepsPreview` - wizualizacja 3 kroków procesu

### 3.2. Questionnaire Page (`/questionnaire`)

**Layout:**
- Stepper na górze pokazujący aktualny krok (1-5)
- Jedna karta z pytaniem i opcjami na ekran
- Animowane przejścia między krokami
- Przyciski: "Wstecz" / "Dalej" (lub "Zakończ" na ostatnim)

**Pytania i opcje:**

| Pole | Pytanie | Opcje |
|------|---------|-------|
| `work_style` | "Jak wolisz pracować?" | Samodzielnie (`independent`), W zespole (`collaborative`), Elastycznie (`mixed`) |
| `client_interaction` | "Jak często chcesz kontaktować się z klientami?" | Rzadko (`minimal`), Czasami (`moderate`), Często (`extensive`) |
| `aesthetic_focus` | "Jak ważna jest dla Ciebie estetyka i design?" | Mniej ważna (`low`), Umiarkowanie (`medium`), Bardzo ważna (`high`) |
| `teamwork_preference` | "Jaką rolę preferujesz w zespole?" | Praca indywidualna (`low`), Równowaga (`medium`), Intensywna współpraca (`high`) |
| `problem_solving_approach` | "Jak podchodzisz do rozwiązywania problemów?" | Analitycznie (`analytical`), Kreatywnie (`creative`), Praktycznie (`practical`) |

**Komponenty:**
- `QuestionnaireSteper` - stepper z krokami 1-5
- `QuestionCard` - karta z pytaniem
- `OptionSelector` - wizualne karty wyboru (MUI ToggleButtonGroup/Cards z ikonami)

### 3.3. Upload CV Page (`/upload-cv`)

**Layout:**
- Drag-and-drop zone na środku
- Informacje o limitach: "Maksymalnie 3MB, tylko PDF"
- Ostrzegawczy banner: "CV można przesłać tylko raz"
- Po uploadzie: podgląd nazwy pliku z ikoną statusu
- Button "Dalej" aktywny po udanym uploadzie

**Walidacja:**
- Max rozmiar: 3MB
- Format: tylko PDF
- Jednorazowy upload

**Komponenty:**
- `CVDropzone` - obszar drag-and-drop (react-dropzone)
- `CVPreview` - podgląd przesłanego pliku
- `UploadWarningBanner` - ostrzeżenie o jednorazowości

### 3.4. Recommendations Page (`/recommendations`)

**Layout:**
- Nagłówek: "Twoje rekomendowane ścieżki kariery"
- 2 karty ról obok siebie (desktop) / w stacku (mobile)
- Karta "Rekomendowana": grubsze obramowanie w kolorze primary
- Karta "Alternatywna": standardowe obramowanie
- Każda karta zawiera: badge typu, nazwa roli, uzasadnienie AI (4-6 zdań)
- Button "Wybierz tę rolę" na każdej karcie

**Komponenty:**
- `RoleCard` - karta roli z badge, tytułem, opisem, button
- `RecommendationBadge` - badge "Rekomendowane" / "Alternatywna"

### 3.5. Select Role Confirmation (Modal/Dialog)

**Layout:**
- Dialog potwierdzający po kliknięciu "Wybierz tę rolę"
- Treść: "Czy na pewno chcesz wybrać rolę [Nazwa roli]?"
- Ostrzeżenie: "Ten wybór jest ostateczny i nie będzie można go zmienić."
- Checkbox: "Rozumiem, że wybór jest ostateczny"
- Buttons: "Anuluj" / "Potwierdź wybór" (disabled bez checkboxa)

**Komponenty:**
- `RoleConfirmationDialog` - MUI Dialog z potwierdzeniem

### 3.6. AI Loading State

**Layout:**
- Pełnoekranowy overlay
- CircularProgress (indeterminate)
- Animowany tekst zmieniający się co 3-4 sekundy:
  - "Analizuję Twoje CV..."
  - "Dopasowuję role do Twoich preferencji..."
  - "Przygotowuję rekomendacje..."
  - "Już prawie gotowe..."
- Timeout: 60 sekund → error z opcją retry

**Komponenty:**
- `AILoadingOverlay` - pełnoekranowy loading z animowanym tekstem

### 3.7. Roadmap Page (`/roadmap`)

**Layout:**
- Sticky header z progress bar (CircularProgress + "X z Y kroków ukończonych")
- Główny obszar: drzewo roadmapy (pionowe, top-to-bottom)
- 10 głównych węzłów (kroków) połączonych linią
- Warianty jako gałęzie odchodzące poziomo od węzłów
- Desktop: split-view (drzewo 70% | panel szczegółów 30%)
- Mobile: pełnoekranowe drzewo, szczegóły w bottom sheet

**Wizualizacja drzewa:**
- Główna ścieżka: gruba linia pionowa
- Warianty: cieńsze gałęzie poziome
- Węzły ukończone: kolor success (#22C55E), ikona checkmark
- Węzły odblokowane: kolor primary, klikalne
- Węzły zablokowane: wyszarzone (opacity 0.4), ikona kłódki, linia przerywana
- Wariant rekomendowany (order_number=1): wyróżniony gwiazdką

**Logika odblokowywania:**
- Krok 1: zawsze odblokowany
- Kolejne kroki: odblokowane gdy poprzedni krok ma min. 1 ukończony wariant

**Komponenty:**
- `RoadmapTree` - główny komponent drzewa
- `RoadmapNode` - węzeł kroku
- `VariantBranch` - gałąź wariantu
- `RoadmapProgressHeader` - sticky header z progress
- `VariantDetailsPanel` - panel szczegółów (desktop)
- `VariantDetailsSheet` - bottom sheet (mobile)

### 3.8. Variant Details (Panel/Sheet)

**Layout:**
1. Header: Tytuł wariantu + badge "Rekomendowany" (jeśli order_number=1)
2. Opis: Pełny tekst description
3. Meta: Ikona zegara + "~X godzin" (estimated_hours)
4. Resources: Lista linków z ikonami typu (documentation, course, video)
5. Action: Button "Oznacz jako ukończony" / "Ukończono ✓"
6. Mobile footer: nawigacja poprzedni/następny wariant

**Komponenty:**
- `VariantHeader` - tytuł z badge
- `VariantDescription` - opis
- `VariantMeta` - czas realizacji
- `VariantResources` - lista linków
- `VariantActionButton` - przycisk ukończenia

### 3.9. Mobile Variant Carousel

**Layout:**
- Embla Carousel dla wariantów kroku
- Swipe gesture zmienia kartę
- Pagination dots (informacyjne, nie klikalne)
- Badge "1 z 3" w rogu karty
- Wskazówka swipe na pierwszym użyciu: "Przesuń aby zobaczyć więcej opcji"

**Komponenty:**
- `VariantCarousel` - wrapper Embla Carousel
- `VariantCarouselCard` - karta wariantu w carousel
- `CarouselPagination` - dots indicator
- `SwipeHint` - animowana wskazówka (znika po pierwszej interakcji)

### 3.10. Profile Page (`/profile`)

**Layout (read-only po wyborze roli):**
- Sekcja "Twoje odpowiedzi": lista pytanie-odpowiedź
- Sekcja "Wybrana rola": nazwa + skrócone uzasadnienie
- Sekcja "CV": nazwa pliku + data uploadu
- Sekcja "Postęp": progress percentage + link do roadmapy
- Komunikat: "Wybór roli jest ostateczny. Przeglądasz historyczne dane."

**Komponenty:**
- `ProfileSection` - sekcja z nagłówkiem
- `QuestionnaireAnswers` - lista odpowiedzi
- `SelectedRoleCard` - karta wybranej roli
- `CVInfo` - informacje o CV
- `ProgressSummary` - podsumowanie postępu

---

## 4. System designu

### 4.1. Paleta kolorów (MUI Theme)

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#0D9488', // Teal - rozwój, technologia
      light: '#14B8A6',
      dark: '#0F766E',
    },
    secondary: {
      main: '#6366F1', // Indigo - akcent, CTA
      light: '#818CF8',
      dark: '#4F46E5',
    },
    success: {
      main: '#22C55E', // Green - ukończone kroki
    },
    error: {
      main: '#EF4444', // Red - błędy
    },
    warning: {
      main: '#F59E0B', // Amber - ostrzeżenia
    },
    grey: {
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
  },
});
```

### 4.2. Typografia

- Użyj domyślnej typografii MUI (Roboto)
- Nagłówki: font-weight 600-700
- Body: font-weight 400
- Jednostki: rem

### 4.3. Spacing

- Używaj MUI Stack z gap zamiast margins
- Bazowa jednostka: 8px (MUI default)
- Spacing w rem

### 4.4. Komponenty stanów

**Loading:**
- `CircularProgress` dla isPending, isLoading
- Skeleton dla ładowania list/kart

**Error:**
- `Alert` severity="error" z komunikatem
- `Snackbar` dla transient errors
- Dedykowane komunikaty dla kodów błędów API

**Empty:**
- Ilustracja + tekst + CTA

---

## 5. Responsywność

### 5.1. Breakpoints (MUI default)

- xs: 0px
- sm: 600px
- md: 900px
- lg: 1200px
- xl: 1536px

### 5.2. Layout per breakpoint

| Widok | Mobile (xs-sm) | Tablet (md) | Desktop (lg+) |
|-------|----------------|-------------|---------------|
| Questionnaire | Full-screen card | Centered card 60% | Centered card 50% |
| Recommendations | Stack vertical | 2 columns | 2 columns centered |
| Roadmap | Vertical timeline + bottom sheet | Tree + side panel | Tree 70% + panel 30% |
| Variant selection | Carousel | Carousel | Horizontal branches |

---

## 6. Zarządzanie stanem

### 6.1. TanStack Query

**Query Keys:**
- `['profile']` - profil użytkownika
- `['profile', 'status']` - status analizy CV
- `['roles']` - lista ról
- `['roadmap', roleId]` - roadmapa dla roli
- `['progress', userId]` - postęp użytkownika

**Stale Time:**
- Roles, Roadmap: 1 godzina (dane statyczne)
- Profile: 5 minut
- Progress: 1 minuta

**Mutations z optimistic updates:**
- Oznaczanie wariantu jako ukończony
- Zapisywanie odpowiedzi kwestionariusza
- Wybór roli

### 6.2. Local State

- Stan UI (modal open, active step, etc.)
- Formularz kwestionariusza (przed zapisem)
- Carousel position

### 6.3. Dev User Context

```typescript
// Dla MVP bez auth
const DEV_USER_ID = 'hardcoded-dev-user-id-from-db';

const DevUserContext = createContext<{ userId: string }>({ userId: DEV_USER_ID });

// Użycie w komponentach
const { userId } = useContext(DevUserContext);
```

---

## 7. Przepływ użytkownika (User Flow)

```
┌─────────────────┐
│   Landing Page  │
│   [Rozpocznij]  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Kwestionariusz │ ◄── 5 kroków, można cofać
│    (5 pytań)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Upload CV     │ ◄── Max 3MB, tylko PDF, jednorazowo
│   (PDF only)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI Processing  │ ◄── Full-screen loader, 10-60s
│   (loading...)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Rekomendacje   │ ◄── 2 karty: Rekomendowana + Alternatywna
│  (2 role IT)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Wybór roli     │ ◄── Dialog potwierdzający, checkbox
│  (ostateczny)   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│              ROADMAPA                    │
│  ┌─────┐                                │
│  │  1  │ ── Wariant A ── Wariant B      │
│  └──┬──┘                                │
│     │                                   │
│  ┌──┴──┐                                │
│  │  2  │ ── Wariant A ── Wariant B ── C │
│  └──┬──┘                                │
│     │                                   │
│    ...  (10 kroków)                     │
│                                         │
│  [Progress: X% ukończono]               │
└─────────────────────────────────────────┘
```

---

## 8. Obsługa błędów

### 8.1. Mapowanie kodów błędów na komunikaty

| Kod błędu | Komunikat UI |
|-----------|-------------|
| `QUESTIONNAIRE_INCOMPLETE` | "Uzupełnij wszystkie odpowiedzi w kwestionariuszu" |
| `CV_NOT_UPLOADED` | "Prześlij CV aby kontynuować" |
| `CV_ALREADY_UPLOADED` | "CV zostało już przesłane. Kontakt z supportem w razie problemów." |
| `RECOMMENDATIONS_EXIST` | "Rekomendacje zostały już wygenerowane" |
| `ROLE_ALREADY_SELECTED` | "Rola została już wybrana. Wybór jest ostateczny." |
| `AI_SERVICE_ERROR` | "Wystąpił problem z analizą. Spróbuj ponownie za chwilę." |
| `CV_PARSE_ERROR` | "Nie udało się odczytać CV. Upewnij się, że plik PDF jest poprawny." |
| `413 Payload Too Large` | "Plik jest za duży. Maksymalny rozmiar to 3MB." |
| `Network Error` | "Brak połączenia z internetem. Sprawdź połączenie i spróbuj ponownie." |

### 8.2. Feedback wizualny

- **Toast/Snackbar**: Błędy transient (sieć, timeout)
- **Alert inline**: Błędy walidacji formularza
- **Full-screen error**: Krytyczne błędy (AI failure)

---

## 9. Feedback użytkownika

### 9.1. Oznaczenie wariantu jako ukończony

1. **Optimistic update**: węzeł zmienia kolor na success, checkmark z animacją
2. **Progress update**: CircularProgress animuje się do nowej wartości
3. **Toast**: "Krok ukończony!" z opcją "Cofnij" (5 sekund)
4. **Odblokowanie**: następny krok staje się aktywny (jeśli był zablokowany)
5. **Error recovery**: przywróć poprzedni stan + error toast z retry

### 9.2. Animacje

- Przejścia między krokami kwestionariusza (fade/slide)
- Zmiana stanu węzła w drzewie (scale + color transition)
- Progress bar update (smooth transition)
- Carousel swipe (native feel)

---

## 10. Struktura plików komponentów

```
src/
├── components/
│   ├── common/
│   │   ├── LoadingSpinner/
│   │   ├── ErrorAlert/
│   │   └── ConfirmDialog/
│   ├── landing/
│   │   ├── LandingHero/
│   │   └── StepsPreview/
│   ├── questionnaire/
│   │   ├── QuestionnaireStepper/
│   │   ├── QuestionCard/
│   │   └── OptionSelector/
│   ├── cv-upload/
│   │   ├── CVDropzone/
│   │   ├── CVPreview/
│   │   └── UploadWarningBanner/
│   ├── recommendations/
│   │   ├── RoleCard/
│   │   ├── RecommendationBadge/
│   │   └── RoleConfirmationDialog/
│   ├── roadmap/
│   │   ├── RoadmapTree/
│   │   ├── RoadmapNode/
│   │   ├── VariantBranch/
│   │   ├── RoadmapProgressHeader/
│   │   ├── VariantDetailsPanel/
│   │   ├── VariantDetailsSheet/
│   │   └── VariantCarousel/
│   └── profile/
│       ├── ProfileSection/
│       ├── QuestionnaireAnswers/
│       └── ProgressSummary/
├── pages/
│   ├── LandingPage/
│   ├── QuestionnairePage/
│   ├── UploadCVPage/
│   ├── RecommendationsPage/
│   ├── RoadmapPage/
│   └── ProfilePage/
├── hooks/
│   ├── useProfile.ts
│   ├── useQuestionnaire.ts
│   ├── useCV.ts
│   ├── useRecommendation.ts
│   ├── useRoadmap.ts
│   └── useProgress.ts
├── context/
│   └── DevUserContext.tsx
└── theme/
    └── theme.ts
```

---

## 11. Priorytety implementacji MVP

### Faza 1: Core Flow
1. Theme i podstawowe komponenty (Loading, Error)
2. Landing Page
3. Questionnaire (5 kroków)
4. Upload CV
5. AI Loading state

### Faza 2: Recommendations & Selection
6. Recommendations display (2 karty)
7. Role selection dialog
8. Profile page (read-only)

### Faza 3: Roadmap
9. Roadmap tree (basic visualization)
10. Variant details (panel/sheet)
11. Progress tracking
12. Variant carousel (mobile)

### Faza 4: Polish
13. Animacje i transitions
14. Error handling refinement
15. Accessibility audit
16. Responsive testing

---

## 12. Uwagi końcowe

- **Brak auth w MVP**: używaj hardcoded dev user ID z bazy danych
- **Keep it simple**: bez zoom/pan w drzewie, podstawowe animacje
- **Mobile-first**: priorytet dla doświadczenia mobilnego
- **Optimistic updates**: dla płynnego UX przy oznaczaniu postępu
- **Read-only po wyborze**: profil i historyczne dane bez możliwości edycji

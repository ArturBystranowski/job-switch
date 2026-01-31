# CI/CD Setup - JobSwitch

## Architektura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PULL REQUEST                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   GitHub Actions (CI)              Netlify                                  │
│   ┌──────────────────┐             ┌──────────────────┐                     │
│   │ install → lint   │             │ Preview Deploy   │                     │
│   │ → unit tests     │             │ (branch preview) │                     │
│   │ → e2e tests      │             └──────────────────┘                     │
│   │   (równolegle)   │                                                      │
│   └──────────────────┘                                                      │
│                                                                              │
│   Supabase: TESTOWY                Supabase: TESTOWY (preview)              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼ merge do main
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PUSH TO MAIN                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Netlify (automatycznie)                                                   │
│   ┌──────────────────────────────────────┐                                  │
│   │ npm run build → Deploy Production    │                                  │
│   └──────────────────────────────────────┘                                  │
│                                                                              │
│   Supabase: PRODUKCYJNY                                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Pipeline Flow

```
install → lint → [unit-tests, e2e-tests] (równolegle)
                         ↓
              Netlify Preview Deploy (PR)
                         ↓
                    merge do main
                         ↓
              Netlify Production Deploy
```

---

## CZĘŚĆ 1: Konfiguracja Supabase

### 1.1 Projekt TESTOWY

1. Wejdź na [supabase.com](https://supabase.com) → **New Project**
2. Nazwa: `jobswitch-test`
3. Po utworzeniu zapisz z **Settings → API**:
   - `Project URL` → `https://xxx-test.supabase.co`
   - `anon public key` → `eyJ...`
   - `service_role secret key` → `eyJ...`

4. Zmigruj schemat i zdeployuj Edge Function:

```powershell
# Zlinkuj projekt testowy
npx supabase link --project-ref <project-id-from-url>

# Wyślij schemat bazy danych
npx supabase db push

# Zdeployuj Edge Function
npx supabase functions deploy generate-recommendation

# Ustaw sekret OPENROUTER dla Edge Function
npx supabase secrets set OPENROUTER_API_KEY=<twój-klucz-openrouter>
```

5. Utwórz testowego użytkownika:
   - W Supabase Dashboard → **Authentication → Users → Add user**
   - Email: `test@example.com`
   - Password: `TestPassword123!`
   - Zapisz UUID użytkownika (opcjonalnie)

### 1.2 Projekt PRODUKCYJNY

1. Wejdź na [supabase.com](https://supabase.com) → **New Project**
2. Nazwa: `jobswitch-prod`
3. Po utworzeniu zapisz z **Settings → API**:
   - `Project URL` → `https://yyy-prod.supabase.co`
   - `anon public key` → `eyJ...`

4. Zmigruj schemat i zdeployuj Edge Function:

```powershell
# Zlinkuj projekt produkcyjny
npx supabase link --project-ref <project-id-prod>

# Wyślij schemat bazy danych
npx supabase db push

# Zdeployuj Edge Function
npx supabase functions deploy generate-recommendation

# Ustaw sekret OPENROUTER dla Edge Function
npx supabase secrets set OPENROUTER_API_KEY=<twój-klucz-openrouter>
```

---

## CZĘŚĆ 2: Konfiguracja GitHub

### 2.1 Dodaj Secrets

1. Wejdź do repozytorium na GitHub
2. **Settings → Secrets and variables → Actions**
3. Kliknij **New repository secret** i dodaj:

| Secret Name                 | Wartość                        | Opis                                        |
| --------------------------- | ------------------------------ | ------------------------------------------- |
| `VITE_SUPABASE_URL`         | `https://xxx-test.supabase.co` | URL projektu **TESTOWEGO**                  |
| `VITE_SUPABASE_ANON_KEY`    | `eyJ...`                       | Anon key projektu **TESTOWEGO**             |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...`                       | Service role key **TESTOWEGO** (do cleanup) |
| `E2E_USERNAME`              | `test@example.com`             | Email testowego użytkownika                 |
| `E2E_PASSWORD`              | `TestPassword123!`             | Hasło testowego użytkownika                 |
| `E2E_USERNAME_ID`           | `uuid...`                      | UUID użytkownika (opcjonalnie)              |

### 2.2 Weryfikacja

Po dodaniu secretów, w zakładce **Settings → Secrets and variables → Actions** powinieneś widzieć:

```
Repository secrets (6)
├── E2E_PASSWORD
├── E2E_USERNAME
├── E2E_USERNAME_ID
├── SUPABASE_SERVICE_ROLE_KEY
├── VITE_SUPABASE_ANON_KEY
└── VITE_SUPABASE_URL
```

---

## CZĘŚĆ 3: Konfiguracja Netlify

### 3.1 Połącz repozytorium

1. Wejdź na [app.netlify.com](https://app.netlify.com)
2. **Add new site → Import an existing project**
3. Wybierz **GitHub** i autoryzuj dostęp
4. Znajdź i wybierz repozytorium `job-switch`

### 3.2 Konfiguracja buildu

W kroku konfiguracji ustaw:

| Pole                  | Wartość         |
| --------------------- | --------------- |
| **Branch to deploy**  | `main`          |
| **Build command**     | `npm run build` |
| **Publish directory** | `dist`          |

> Uwaga: Plik `netlify.toml` w repozytorium nadpisze te ustawienia, ale dobrze je ustawić dla pewności.

### 3.3 Dodaj Environment Variables

1. Po utworzeniu site'a wejdź w **Site settings**
2. **Environment variables → Add a variable**
3. Dodaj zmienne **PRODUKCYJNE**:

| Key                      | Value                           |
| ------------------------ | ------------------------------- |
| `VITE_SUPABASE_URL`      | `https://yyy-prod.supabase.co`  |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` (produkcyjny anon key) |

### 3.4 Włącz Deploy Previews

1. **Site settings → Build & deploy → Continuous deployment**
2. Upewnij się że **Deploy Previews** są włączone
3. Każdy PR automatycznie dostanie preview URL

---

## CZĘŚĆ 4: Pliki w repozytorium

### 4.1 `.github/workflows/ci.yml`

Plik już istnieje. Zawiera:

- Job `install` - instalacja i cache dependencies
- Job `lint` - sprawdzenie ESLint
- Job `unit-tests` - testy jednostkowe Vitest
- Job `e2e-tests` - testy E2E Playwright (na TESTOWYM Supabase)

### 4.2 `netlify.toml`

Plik już istnieje. Zawiera:

- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect (wszystkie ścieżki → `index.html`)
- Security headers

---

## CZĘŚĆ 5: Testowanie pipeline

### 5.1 Pierwszy commit

```powershell
git add .github/workflows/ci.yml netlify.toml .ai/ci-cd-setup.md
git commit -m "Add CI/CD pipeline with GitHub Actions and Netlify"
git push origin main
```

### 5.2 Testowy Pull Request

```powershell
# Utwórz nowy branch
git checkout -b test/ci-pipeline

# Zrób małą zmianę (np. dodaj komentarz)
echo "// CI test" >> src/main.tsx

# Commit i push
git commit -am "Test CI pipeline"
git push -u origin test/ci-pipeline
```

3. Na GitHubie utwórz Pull Request do `main`
4. Obserwuj:
   - GitHub Actions → CI powinno się uruchomić
   - Netlify → Deploy Preview powinien się utworzyć

### 5.3 Weryfikacja

Po utworzeniu PR sprawdź:

**GitHub:**

- W zakładce **Checks** powinny być widoczne joby: Install, Lint, Unit Tests, E2E Tests
- Wszystkie powinny przejść na zielono

**Netlify:**

- W komentarzu PR powinien pojawić się link do Deploy Preview
- Preview powinien działać (używa TESTOWYCH zmiennych z Netlify lub domyślnych)

---

## Podsumowanie

### Gdzie co ustawić

| Miejsce              | Zmienne            | Projekt Supabase | Cel              |
| -------------------- | ------------------ | ---------------- | ---------------- |
| **GitHub Secrets**   | 6 zmiennych        | TESTOWY          | CI (lint, testy) |
| **Netlify Env Vars** | 2 zmienne          | PRODUKCYJNY      | Build & Deploy   |
| **Supabase Secrets** | OPENROUTER_API_KEY | Oba projekty     | Edge Functions   |

### Flow

1. **PR utworzony** → GitHub Actions (CI) + Netlify Preview Deploy
2. **CI przechodzi** → Można mergować
3. **Merge do main** → Netlify Production Deploy (automatycznie)

### Pliki

```
job-switch/
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions CI workflow
├── netlify.toml            # Konfiguracja Netlify
└── .ai/
    └── ci-cd-setup.md      # Ta instrukcja
```

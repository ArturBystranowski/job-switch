# Schemat Bazy Danych - JobSwitch MVP

## Przegląd

Schemat bazy danych dla aplikacji JobSwitch zbudowany na PostgreSQL (Supabase). Architektura składa się z 5 tabel zoptymalizowanych pod kątem prostoty i wydajności MVP. Wykorzystuje wbudowane mechanizmy Supabase Auth (`auth.users`) oraz Row Level Security (RLS) dla bezpieczeństwa danych użytkownika.

### Filozofia projektowa

- **KISS principle**: Tylko niezbędne elementy dla MVP
- **Minimal complexity**: 5 tabel, zero over-engineering
- **JSONB dla read-only**: Dane generowane raz przez AI
- **Relacyjne dla operacyjnych**: Dane wymagające JOINów i trackingu
- **Supabase-native**: Best practices platformy

---

## 1. Tabele

### 1.1. `profiles`

Rozszerzenie tabeli `auth.users` z Supabase Auth. Relacja 1:1 przechowująca dane biznesowe użytkownika.

| Kolumna                  | Typ          | Ograniczenia                          | Opis                                                    |
| ------------------------ | ------------ | ------------------------------------- | ------------------------------------------------------- |
| `id`                     | `UUID`       | `PRIMARY KEY`, `REFERENCES auth.users ON DELETE CASCADE` | ID użytkownika z tabeli auth.users             |
| `questionnaire_responses` | `JSONB`     | `NOT NULL`                            | Odpowiedzi z formularza preferencji użytkownika        |
| `cv_uploaded_at`         | `TIMESTAMPTZ` | `NULL`                               | Timestamp uploadu CV (NULL = brak CV)                   |
| `ai_recommendations`     | `JSONB`      | `NULL`                                | 2 rekomendacje AI (role + uzasadnienia)                |
| `selected_role_id`       | `INTEGER`    | `NULL`, `REFERENCES roles(id) ON DELETE SET NULL` | Wybrana rola przez użytkownika (ostateczna)   |
| `created_at`             | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()`             | Data utworzenia profilu                                 |

#### Struktura JSONB dla `questionnaire_responses`:

```json
{
  "work_style": "independent",
  "client_interaction": "minimal",
  "aesthetic_focus": "high",
  "teamwork_preference": "medium",
  "problem_solving_approach": "analytical"
}
```

#### Struktura JSONB dla `ai_recommendations`:

```json
{
  "recommendations": [
    {
      "role_id": 1,
      "role_name": "Frontend Developer",
      "justification": "Na podstawie Twojego CV i preferencji..."
    },
    {
      "role_id": 2,
      "role_name": "UX/UI Designer",
      "justification": "Twoje doświadczenie wskazuje..."
    }
  ],
  "generated_at": "2025-11-16T12:00:00Z"
}
```

---

### 1.2. `roles`

Słownik ról IT. Predefiniowane rekordy zarządzane przez admina lub migracje.

| Kolumna       | Typ      | Ograniczenia                | Opis                                      |
| ------------- | -------- | --------------------------- | ----------------------------------------- |
| `id`          | `SERIAL` | `PRIMARY KEY`               | Unikalny identyfikator roli               |
| `name`        | `TEXT`   | `NOT NULL UNIQUE`           | Nazwa roli (np. "Frontend Developer")     |
| `description` | `TEXT`   | `NOT NULL`                  | Opis roli (2-3 zdania)                    |
| `created_at`  | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Data utworzenia rekordu                   |

**Uwaga**: Avatary ról przechowywane jako static assets w `/public/avatars/` na frontendzie, mapowane po `role.id`.

---

### 1.3. `roadmap_steps`

10 kroków development path dla każdej roli. Bezpośrednia relacja do `roles` (bez pośredniej tabeli `roadmaps`).

| Kolumna        | Typ      | Ograniczenia                                      | Opis                                           |
| -------------- | -------- | ------------------------------------------------- | ---------------------------------------------- |
| `id`           | `SERIAL` | `PRIMARY KEY`                                     | Unikalny identyfikator kroku                   |
| `role_id`      | `INTEGER` | `NOT NULL`, `REFERENCES roles(id) ON DELETE CASCADE` | Rola do której należy krok                  |
| `order_number` | `INTEGER` | `NOT NULL`, `CHECK (order_number BETWEEN 1 AND 10)` | Numer kroku w sekwencji (1-10)              |
| `title`        | `TEXT`   | `NOT NULL`                                        | Tytuł kroku (np. "Podstawy HTML/CSS")          |
| `description`  | `TEXT`   | `NOT NULL`                                        | Opis kroku (3-5 zdań)                          |
| `created_at`   | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()`                     | Data utworzenia rekordu                        |

**Constraints**:
- `UNIQUE(role_id, order_number)` - każda rola ma dokładnie 10 unikalnych kroków

---

### 1.4. `step_variants`

1-3 warianty realizacji każdego kroku roadmapy.

| Kolumna          | Typ      | Ograniczenia                                               | Opis                                                 |
| ---------------- | -------- | ---------------------------------------------------------- | ---------------------------------------------------- |
| `id`             | `SERIAL` | `PRIMARY KEY`                                              | Unikalny identyfikator wariantu                      |
| `step_id`        | `INTEGER` | `NOT NULL`, `REFERENCES roadmap_steps(id) ON DELETE CASCADE` | Krok do którego należy wariant                    |
| `order_number`   | `INTEGER` | `NOT NULL`, `CHECK (order_number BETWEEN 1 AND 3)`        | Numer wariantu (1-3)                                 |
| `title`          | `TEXT`   | `NOT NULL`                                                 | Tytuł wariantu (np. "Kurs video")                    |
| `description`    | `TEXT`   | `NOT NULL`                                                 | Opis wariantu (2-3 zdania)                           |
| `estimated_hours` | `INTEGER` | `NULL`                                                    | Szacowany czas realizacji w godzinach                |
| `resources`      | `JSONB`  | `NULL`                                                     | Linki i materiały do nauki                           |
| `created_at`     | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()`                              | Data utworzenia rekordu                              |

**Constraints**:
- `UNIQUE(step_id, order_number)` - każdy krok ma unikalne numery wariantów

#### Struktura JSONB dla `resources`:

```json
{
  "links": [
    {
      "title": "MDN Web Docs - HTML",
      "url": "https://developer.mozilla.org/en-US/docs/Web/HTML",
      "type": "documentation"
    },
    {
      "title": "FreeCodeCamp - Responsive Web Design",
      "url": "https://www.freecodecamp.org/learn/responsive-web-design/",
      "type": "course"
    }
  ]
}
```

---

### 1.5. `user_step_progress`

Tracking ukończonych wariantów przez użytkownika. Umożliwia śledzenie postępu w roadmapie.

| Kolumna          | Typ       | Ograniczenia                                               | Opis                                      |
| ---------------- | --------- | ---------------------------------------------------------- | ----------------------------------------- |
| `id`             | `SERIAL`  | `PRIMARY KEY`                                              | Unikalny identyfikator rekordu            |
| `user_id`        | `UUID`    | `NOT NULL`, `REFERENCES profiles(id) ON DELETE CASCADE`    | Użytkownik który ukończył wariant         |
| `step_variant_id` | `INTEGER` | `NOT NULL`, `REFERENCES step_variants(id) ON DELETE CASCADE` | Ukończony wariant                      |
| `completed_at`   | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()`                               | Data i czas ukończenia wariantu           |

**Constraints**:
- `UNIQUE(user_id, step_variant_id)` - użytkownik nie może ukończyć tego samego wariantu dwa razy

---

## 2. Relacje

### Diagram relacji

```
auth.users (Supabase)
    ↓ 1:1
profiles
    ↓ 1:many
user_step_progress
    ↓ many:1
step_variants
    ↓ many:1
roadmap_steps
    ↓ many:1
roles
```

### Szczegółowy opis relacji

| Tabela źródłowa       | Relacja  | Tabela docelowa    | Opis                                                   |
| --------------------- | -------- | ------------------ | ------------------------------------------------------ |
| `auth.users`          | 1:1      | `profiles`         | Każdy użytkownik ma dokładnie jeden profil             |
| `profiles`            | many:1   | `roles`            | Wielu użytkowników może wybrać tę samą rolę            |
| `roles`               | 1:many   | `roadmap_steps`    | Każda rola ma dokładnie 10 kroków                      |
| `roadmap_steps`       | 1:many   | `step_variants`    | Każdy krok ma 1-3 warianty                             |
| `profiles`            | 1:many   | `user_step_progress` | Użytkownik może ukończyć wiele wariantów             |
| `step_variants`       | 1:many   | `user_step_progress` | Wariant może być ukończony przez wielu użytkowników  |

---

## 3. Indeksy

### 3.1. Indeksy GIN (JSONB)

```sql
CREATE INDEX idx_profiles_questionnaire_responses 
ON profiles USING GIN (questionnaire_responses);

CREATE INDEX idx_profiles_ai_recommendations 
ON profiles USING GIN (ai_recommendations);

CREATE INDEX idx_step_variants_resources 
ON step_variants USING GIN (resources);
```

**Uzasadnienie**: Indeksy GIN umożliwiają efektywne zapytania do kolumn JSONB (np. filtrowanie po wartościach w questionnaire).

---

### 3.2. Indeksy B-tree (Foreign Keys i sortowanie)

```sql
-- Foreign keys dla wydajności JOINów
CREATE INDEX idx_profiles_selected_role_id 
ON profiles(selected_role_id);

CREATE INDEX idx_roadmap_steps_role_id 
ON roadmap_steps(role_id);

CREATE INDEX idx_step_variants_step_id 
ON step_variants(step_id);

CREATE INDEX idx_user_step_progress_user_id 
ON user_step_progress(user_id);

CREATE INDEX idx_user_step_progress_step_variant_id 
ON user_step_progress(step_variant_id);

-- Indeksy dla często używanych operacji sortowania
CREATE INDEX idx_roadmap_steps_role_order 
ON roadmap_steps(role_id, order_number);

CREATE INDEX idx_step_variants_step_order 
ON step_variants(step_id, order_number);
```

**Uzasadnienie**: 
- Indeksy FK przyspieszają JOINy
- Composite index `(role_id, order_number)` optymalizuje query dla wyświetlania roadmapy
- Composite index `(step_id, order_number)` optymalizuje query dla wariantów kroku

---

## 4. Row Level Security (RLS)

### 4.1. Tabela `profiles`

```sql
-- Włącz RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Użytkownik widzi tylko własny profil
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Policy: Użytkownik może aktualizować własny profil
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Policy: Auto-create profilu przy rejestracji (trigger)
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);
```

---

### 4.2. Tabela `roles`

```sql
-- Włącz RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Policy: Wszyscy zalogowani użytkownicy mogą czytać role
CREATE POLICY "Authenticated users can view roles" 
ON roles FOR SELECT 
TO authenticated 
USING (true);

-- Policy: Tylko service_role może modyfikować role
-- (domyślnie brak policy dla INSERT/UPDATE/DELETE = tylko service_role)
```

---

### 4.3. Tabela `roadmap_steps`

```sql
-- Włącz RLS
ALTER TABLE roadmap_steps ENABLE ROW LEVEL SECURITY;

-- Policy: Wszyscy zalogowani użytkownicy mogą czytać kroki
CREATE POLICY "Authenticated users can view roadmap steps" 
ON roadmap_steps FOR SELECT 
TO authenticated 
USING (true);

-- Policy: Tylko service_role może modyfikować kroki
```

---

### 4.4. Tabela `step_variants`

```sql
-- Włącz RLS
ALTER TABLE step_variants ENABLE ROW LEVEL SECURITY;

-- Policy: Wszyscy zalogowani użytkownicy mogą czytać warianty
CREATE POLICY "Authenticated users can view step variants" 
ON step_variants FOR SELECT 
TO authenticated 
USING (true);

-- Policy: Tylko service_role może modyfikować warianty
```

---

### 4.5. Tabela `user_step_progress`

```sql
-- Włącz RLS
ALTER TABLE user_step_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Użytkownik widzi tylko własny progres
CREATE POLICY "Users can view own progress" 
ON user_step_progress FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Użytkownik może dodawać własny progres
CREATE POLICY "Users can insert own progress" 
ON user_step_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Użytkownik może usuwać własny progres (opcjonalnie)
CREATE POLICY "Users can delete own progress" 
ON user_step_progress FOR DELETE 
USING (auth.uid() = user_id);
```

---

## 5. Triggery

### 5.1. Auto-create profilu przy rejestracji

```sql
-- Function: Tworzenie profilu po rejestracji użytkownika
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, questionnaire_responses, created_at)
  VALUES (
    NEW.id,
    '{}'::jsonb,  -- Pusty obiekt JSONB jako placeholder
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Wywołanie po INSERT do auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Uzasadnienie**: Automatyczne tworzenie rekordu w `profiles` po rejestracji użytkownika zapewnia spójność danych i upraszcza logikę aplikacji.

---

## 6. Typowe Queries

### 6.1. Pobranie profilu użytkownika z wybraną rolą

```sql
SELECT 
  p.id,
  p.questionnaire_responses,
  p.cv_uploaded_at,
  p.ai_recommendations,
  p.selected_role_id,
  r.name AS role_name,
  r.description AS role_description
FROM profiles p
LEFT JOIN roles r ON p.selected_role_id = r.id
WHERE p.id = auth.uid();
```

---

### 6.2. Pobranie roadmapy dla wybranej roli

```sql
SELECT 
  rs.id AS step_id,
  rs.order_number AS step_order,
  rs.title AS step_title,
  rs.description AS step_description,
  sv.id AS variant_id,
  sv.order_number AS variant_order,
  sv.title AS variant_title,
  sv.description AS variant_description,
  sv.estimated_hours,
  sv.resources
FROM roadmap_steps rs
LEFT JOIN step_variants sv ON rs.id = sv.step_id
WHERE rs.role_id = $1
ORDER BY rs.order_number, sv.order_number;
```

---

### 6.3. Pobranie postępu użytkownika dla roadmapy

```sql
SELECT 
  usp.step_variant_id,
  usp.completed_at,
  sv.step_id,
  rs.order_number AS step_order
FROM user_step_progress usp
JOIN step_variants sv ON usp.step_variant_id = sv.id
JOIN roadmap_steps rs ON sv.step_id = rs.id
WHERE usp.user_id = auth.uid()
ORDER BY usp.completed_at DESC;
```

---

### 6.4. Obliczanie progresu użytkownika (% ukończenia)

```sql
-- Całkowita liczba wariantów dla wybranej roli
WITH total_variants AS (
  SELECT COUNT(sv.id) AS total
  FROM step_variants sv
  JOIN roadmap_steps rs ON sv.step_id = rs.id
  WHERE rs.role_id = (
    SELECT selected_role_id FROM profiles WHERE id = auth.uid()
  )
),
-- Liczba ukończonych wariantów
completed_variants AS (
  SELECT COUNT(usp.id) AS completed
  FROM user_step_progress usp
  JOIN step_variants sv ON usp.step_variant_id = sv.id
  JOIN roadmap_steps rs ON sv.step_id = rs.id
  WHERE usp.user_id = auth.uid()
    AND rs.role_id = (
      SELECT selected_role_id FROM profiles WHERE id = auth.uid()
    )
)
SELECT 
  tv.total,
  cv.completed,
  ROUND((cv.completed::DECIMAL / tv.total) * 100, 2) AS progress_percentage
FROM total_variants tv, completed_variants cv;
```

**Uwaga**: W MVP to query może być wykonywane na frontendzie dla uproszczenia.

---

### 6.5. Oznaczanie wariantu jako ukończonego

```sql
INSERT INTO user_step_progress (user_id, step_variant_id, completed_at)
VALUES (auth.uid(), $1, NOW())
ON CONFLICT (user_id, step_variant_id) DO NOTHING;
```

**Uwaga**: `ON CONFLICT DO NOTHING` zapobiega duplikatom (użytkownik nie może ukończyć wariantu dwa razy).

---

## 7. Notatki projektowe

### 7.1. Decyzje kluczowe

1. **Wykorzystanie `auth.users`**: Nie duplikujemy danych autentykacji, tylko rozszerzamy przez `profiles` z relacją 1:1.

2. **JSONB dla danych read-only**: `questionnaire_responses`, `ai_recommendations`, `resources` są generowane raz i nie edytowane, więc JSONB jest wystarczające.

3. **Brak tabeli `roadmaps`**: Roadmapy są przypisane bezpośrednio do ról (każda rola = 1 roadmapa w MVP), więc pośrednia tabela jest zbędna.

4. **Brak kolumny `cv_file_path`**: Wystarczy timestamp `cv_uploaded_at`. Dostęp do pliku w Storage przez naming convention (np. `{user_id}/cv.pdf`).

5. **Brak kolumny `updated_at`**: Profil użytkownika jest wypełniany sekwencyjnie bez późniejszych edycji w MVP.

6. **Avatary jako static assets**: Grafiki ról w `/public/avatars/{role_id}.png` zamiast w bazie lub Storage.

7. **Progres obliczany na frontendzie**: Brak denormalizacji (kolumna `progress_percentage` w `profiles`). Kalkulacja on-demand z `user_step_progress`.

8. **Predefiniowane roadmapy**: Steps i variants są globalne (nie per użytkownik), dodawane ręcznie lub przez seed migration.

---

### 7.2. Walidacja danych

#### Poziom bazy danych:
- `CHECK` constraints dla `order_number`
- `UNIQUE` constraints dla zapobiegania duplikatom
- `NOT NULL` constraints dla wymaganych pól
- `FOREIGN KEY` constraints dla integralności relacji

#### Poziom aplikacji (frontend + Edge Functions):
- Walidacja struktury JSONB przed zapisem
- Walidacja rozmiaru pliku CV (max 1 MB)
- Walidacja formatu pliku CV (PDF/DOCX)
- Walidacja kompletności formularza przed generowaniem rekomendacji

---

### 7.3. Migracje (przykładowe seed data)

#### Role (przykładowe):
```sql
INSERT INTO roles (name, description) VALUES
('Frontend Developer', 'Twórz interaktywne interfejsy użytkownika używając HTML, CSS, JavaScript i nowoczesnych frameworków jak React.'),
('Backend Developer', 'Buduj solidne API i logikę serwerową z użyciem Node.js, Python lub Java.'),
('DevOps Engineer', 'Automatyzuj procesy CI/CD, zarządzaj infrastrukturą i monitoruj aplikacje w chmurze.'),
('Data Analyst', 'Analizuj dane, twórz raporty i wizualizacje, wspieraj decyzje biznesowe.'),
('UX/UI Designer', 'Projektuj intuicyjne interfejsy i doświadczenia użytkownika z dbałością o estetykę.');
```

#### Roadmap Steps (przykładowe dla Frontend Developer):
```sql
INSERT INTO roadmap_steps (role_id, order_number, title, description) VALUES
(1, 1, 'Podstawy HTML i CSS', 'Naucz się struktury dokumentów HTML oraz stylowania za pomocą CSS. Zrozum box model, flexbox i grid.'),
(1, 2, 'JavaScript - fundamenty', 'Opanuj podstawy JavaScript: zmienne, funkcje, pętle, obiekty i manipulację DOM.'),
(1, 3, 'Responsive Web Design', 'Poznaj media queries, mobile-first approach i tworzenie responsywnych layoutów.'),
(1, 4, 'Git i kontrola wersji', 'Naucz się podstaw Git: commit, branch, merge, pull request. Załóż konto na GitHub.'),
(1, 5, 'JavaScript ES6+', 'Poznaj nowoczesne funkcje JS: arrow functions, destructuring, async/await, modules.'),
(1, 6, 'React - wprowadzenie', 'Zacznij pracę z React: komponenty, props, state, hooks (useState, useEffect).'),
(1, 7, 'React - zaawansowane', 'Context API, custom hooks, React Router, zarządzanie stanem (Redux lub Zustand).'),
(1, 8, 'TypeScript', 'Dodaj statyczne typowanie do swoich projektów. Poznaj interfaces, types, generics.'),
(1, 9, 'Testing', 'Naucz się testować kod: Vitest, React Testing Library, testy jednostkowe i integracyjne.'),
(1, 10, 'Portfolio i deployment', 'Zbuduj portfolio z 3-5 projektami. Wdroż aplikacje na Vercel/Netlify. Przygotuj CV.');
```

---

### 7.4. Bezpieczeństwo

1. **RLS policies**: Każdy użytkownik ma dostęp tylko do własnych danych w `profiles` i `user_step_progress`.

2. **Service role**: Tylko backend (service_role key) może modyfikować tabele słownikowe (`roles`, `roadmap_steps`, `step_variants`).

3. **JSONB validation**: Struktura JSONB jest walidowana na poziomie aplikacji (Edge Functions) przed zapisem.

4. **File upload**: CV są przechowywane w Supabase Storage z politykami RLS (użytkownik ma dostęp tylko do własnego CV).

5. **API keys**: OpenRouter API key jest przechowywany jako environment variable i używany tylko w Edge Functions (nie jest wystawiany do frontendu).

---

### 7.5. Skalowalność

#### Dla MVP (100-1000 użytkowników):
- ✅ Obecna struktura jest wystarczająca
- ✅ Proste queries bez heavy JOINów
- ✅ JSONB dla niewielkich dokumentów (< 1KB)

#### Przyszłe optymalizacje (gdy potrzebne):
- **Partycjonowanie**: `user_step_progress` po `user_id` (przy milionach rekordów)
- **Materialized views**: Dla analityki i raportowania
- **Caching**: Redis lub Supabase Edge dla często używanych queries
- **Read replicas**: Dla raportowania bez obciążania primary DB
- **Archiwizacja**: Soft delete dla `profiles` z kolumną `deleted_at`

---

### 7.6. Maintenance

#### Regularne zadania:
- **Backup**: Automatyczne snapshoty Supabase (codziennie)
- **Monitoring**: Śledzenie slow queries przez Supabase Dashboard
- **Index maintenance**: REINDEX przy znacznym wzroście danych
- **VACUUM**: Automatyczne przez PostgreSQL, ale warto monitorować

#### Migracje:
- Użyj Supabase CLI lub Dashboard do zarządzania migracjami
- Numeracja: `001_initial_schema.sql`, `002_add_indexes.sql`, etc.
- Zawsze testuj migracje na staging przed production

---

## 8. Podsumowanie

Schemat bazy danych JobSwitch MVP to:

- **5 tabel**: `profiles`, `roles`, `roadmap_steps`, `step_variants`, `user_step_progress`
- **Minimalna complexity**: Tylko niezbędne elementy
- **JSONB + relacyjne**: Hybrid approach dla optymalnej elastyczności
- **RLS native**: Bezpieczeństwo out of the box
- **Supabase best practices**: Wykorzystanie wbudowanych mechanizmów platformy
- **Skalowalne**: Gotowe na wzrost z prostymi ścieżkami optymalizacji

Schemat jest gotowy do implementacji jako migration SQL dla Supabase.



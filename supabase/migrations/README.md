# JobSwitch Database Migrations

Folder zawiera migracje SQL dla projektu JobSwitch MVP, kompatybilne z Supabase CLI.

## Struktura Migracji

Migracje są wykonywane sekwencyjnie według timestamp w nazwie pliku:

1. **20251116120000_create_initial_schema.sql**
   - Tworzy 5 głównych tabel: `profiles`, `roles`, `roadmap_steps`, `step_variants`, `user_step_progress`
   - Definiuje relacje i constraints (UNIQUE, CHECK, FK)
   - **Uwaga**: RLS nie jest jeszcze włączone (włączane w migracji 3)

2. **20251116120100_create_indexes.sql**
   - Indeksy GIN dla kolumn JSONB (`questionnaire_responses`, `ai_recommendations`, `resources`)
   - Indeksy B-tree dla foreign keys
   - Composite indexes dla optymalizacji queries z sortowaniem (`role_id + order_number`)

3. **20251116120200_create_rls_policies.sql**
   - **Włącza RLS dla wszystkich tabel**
   - Granularne RLS policies dla każdej tabeli
   - Profile: użytkownik widzi tylko własne dane
   - Role/Steps/Variants: publiczny odczyt dla authenticated i anon
   - Progress: użytkownik zarządza tylko własnym postępem

4. **20251116120300_create_profile_trigger.sql**
   - Funkcja `handle_new_user()` z `SECURITY DEFINER`
   - Trigger `on_auth_user_created` auto-tworzy profil po rejestracji

5. **20251116120400_seed_roles_and_roadmap.sql**
   - 5 ról IT (Frontend, Backend, DevOps, Data Analyst, UX/UI Designer)
   - 10 kroków roadmapy dla Frontend Developer
   - Przykładowe query do weryfikacji seed data

## Uruchamianie Migracji

### Wymagania
- Supabase CLI zainstalowane lokalnie
- Połączenie z projektem Supabase

### Komendy

```powershell
# Inicjalizacja projektu Supabase (jeśli jeszcze nie zrobione)
supabase init

# Link do projektu Supabase
supabase link --project-ref <your-project-ref>

# Uruchomienie wszystkich pending migracji
supabase db push

# Lub migracja konkretnego pliku (dla testów)
supabase db push --file supabase/migrations/20251116120000_create_initial_schema.sql
```

### Weryfikacja

Po wykonaniu migracji, sprawdź w Supabase Dashboard:
- **Table Editor**: 5 tabel powinno być widocznych
- **SQL Editor**: Uruchom query do weryfikacji seed data:

```sql
-- Sprawdź role
select * from public.roles order by id;

-- Sprawdź roadmap dla Frontend Developer
select 
  rs.order_number,
  rs.title,
  r.name as role_name
from public.roadmap_steps rs
join public.roles r on rs.role_id = r.id
where r.name = 'Frontend Developer'
order by rs.order_number;
```

## Schemat Bazy Danych

### Tabele

- **profiles**: Rozszerzenie `auth.users` (1:1), zawiera dane biznesowe użytkownika
- **roles**: Słownik ról IT (predefiniowane)
- **roadmap_steps**: 10 kroków dla każdej roli
- **step_variants**: 1-3 warianty realizacji każdego kroku
- **user_step_progress**: Tracking ukończonych wariantów przez użytkownika

### Relacje

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

## Bezpieczeństwo

- **RLS enabled**: Wszystkie tabele mają włączone Row Level Security
- **Granularne policies**: Osobne policies dla SELECT/INSERT/UPDATE/DELETE
- **Auth-based**: Wykorzystanie `auth.uid()` do izolacji danych użytkownika
- **Service role only**: Słowniki (roles, steps, variants) modyfikowalne tylko przez admina

## Struktura JSONB

### profiles.questionnaire_responses
```json
{
  "work_style": "independent",
  "client_interaction": "minimal",
  "aesthetic_focus": "high",
  "teamwork_preference": "medium",
  "problem_solving_approach": "analytical"
}
```

### profiles.ai_recommendations
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

### step_variants.resources
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

## Troubleshooting

### Błąd: "relation already exists"
Jeśli tabele już istnieją, usuń je ręcznie lub zresetuj bazę:
```powershell
supabase db reset
```

### Błąd: "permission denied for schema auth"
Trigger na `auth.users` wymaga uprawnień. Upewnij się, że używasz `service_role` key lub wykonujesz migrację przez Supabase CLI.

### Błąd przy RLS policies
Jeśli policy już istnieje, usuń ją przed ponownym utworzeniem:
```sql
drop policy "policy_name" on public.table_name;
```

## Kolejne kroki

Po wykonaniu migracji:
1. Dodaj seed data dla pozostałych ról (Backend, DevOps, etc.)
2. Dodaj `step_variants` dla kroków roadmapy
3. Skonfiguruj Storage bucket dla CV (`user-cvs`)
4. Skonfiguruj Edge Functions dla AI recommendations


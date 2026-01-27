# JobSwitch Database Migrations

Folder zawiera migracje SQL dla projektu JobSwitch MVP, kompatybilne z Supabase CLI.

## Struktura Migracji

Migracje są wykonywane sekwencyjnie według timestamp w nazwie pliku:

1. **20251116120000_schema.sql** - Kompletny schemat bazy danych
   - 7 tabel: `profiles`, `roles`, `roadmap_steps`, `step_tasks`, `user_step_progress`, `questionnaire_questions`, `questionnaire_options`
   - Wszystkie indeksy (GIN dla JSONB, B-tree dla FK, composite dla sortowania)
   - RLS enabled + wszystkie policies
   - Trigger `on_auth_user_created` do auto-tworzenia profili

2. **20251116120100_storage.sql** - Storage buckets
   - Bucket `cv` - prywatny, PDF only, 3MB limit
   - Bucket `role-avatars` - publiczny, obrazki only, 1MB limit
   - Storage policies dla obu bucketów

3. **20251116120200_seed_data.sql** - Dane produkcyjne
   - 5 ról IT z `image_url`
   - 5 pytań ankietowych + 15 opcji odpowiedzi
   - Frontend Developer: 10 kroków + 44 zadania
   - UX/UI Designer: 8 kroków + 8 zadań

4. **20251116120300_seed_dev_user.sql** - Dane developerskie (DEV ONLY)
   - Test user: `dev@test.local` / `devpassword123`
   - UUID: `00000000-0000-0000-0000-000000000001`
   - Anon policies dla testowania bez auth
   - **Pominąć na produkcji!**

## Pliki pomocnicze

- **verify_schema.sql** - Skrypt weryfikacyjny do uruchomienia po migracjach
- **README.md** - Ten plik

## Uruchamianie Migracji

### Wymagania
- Supabase CLI zainstalowane lokalnie
- Połączenie z projektem Supabase

### Komendy

```powershell
# Link do projektu Supabase
supabase link --project-ref <your-project-ref>

# Uruchomienie wszystkich pending migracji
supabase db push

# Reset bazy (usuwa wszystko i uruchamia migracje od nowa)
supabase db reset
```

### Weryfikacja

Po wykonaniu migracji uruchom `verify_schema.sql` w Supabase SQL Editor.

```sql
-- Szybka weryfikacja
select * from public.roles order by id;
select count(*) from public.roadmap_steps;
select count(*) from public.step_tasks;
```

## Schemat Bazy Danych

### Tabele główne

| Tabela | Opis |
|--------|------|
| `profiles` | Rozszerzenie `auth.users` (1:1), dane użytkownika |
| `roles` | Słownik ról IT (5 ról) |
| `roadmap_steps` | Kroki roadmapy (max 10 na rolę) |
| `step_tasks` | Zadania (max 5 na krok) |
| `user_step_progress` | Tracking ukończonych zadań |
| `questionnaire_questions` | Pytania ankietowe |
| `questionnaire_options` | Opcje odpowiedzi |

### Relacje

```
auth.users (Supabase)
    ↓ 1:1
profiles
    ↓ 1:many
user_step_progress
    ↓ many:1
step_tasks ← (step_id) ← roadmap_steps ← (role_id) ← roles

questionnaire_questions
    ↓ 1:many
questionnaire_options
```

### Storage Buckets

| Bucket | Public | Limit | Typy plików |
|--------|--------|-------|-------------|
| `cv` | ❌ | 3MB | PDF |
| `role-avatars` | ✅ | 1MB | PNG, JPEG, WebP |

## Bezpieczeństwo

- **RLS enabled**: Wszystkie tabele mają Row Level Security
- **Granularne policies**: SELECT/INSERT/UPDATE/DELETE per role
- **Auth-based**: `auth.uid()` do izolacji danych użytkownika
- **Service role only**: Słowniki modyfikowalne tylko przez admina

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
      "justification": "Na podstawie Twojego CV..."
    }
  ],
  "generated_at": "2025-11-16T12:00:00Z"
}
```

## Troubleshooting

### Błąd: "relation already exists"
```powershell
supabase db reset
```

### Błąd: "permission denied for schema auth"
Trigger wymaga uprawnień - używaj Supabase CLI lub service_role key.

### Błąd przy RLS policies
```sql
drop policy "policy_name" on public.table_name;
```

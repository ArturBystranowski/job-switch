# API Endpoint Implementation Plan: List All Roles

## 1. Przegląd punktu końcowego

Endpoint `GET /rest/v1/roles` służy do pobierania listy wszystkich dostępnych ról IT w systemie JobSwitch. Jest to endpoint tylko do odczytu, wykorzystujący bezpośrednie zapytania do Supabase. Role są predefiniowanymi danymi słownikowymi, które służą użytkownikom do wyboru ścieżki kariery.

**Charakterystyka:**
- Operacja read-only (bez mutacji danych)
- Dane statyczne (predefiniowane role IT)
- **Brak wymagania autentykacji** - RLS pozwala `anon` users na SELECT
- Obsługa przez Supabase RLS (Row Level Security)

---

## 2. Szczegóły żądania

### Metoda HTTP
`GET`

### Struktura URL
```
/rest/v1/roles
```

### Nagłówki (Headers)
| Nagłówek | Wymagany | Opis |
|----------|----------|------|
| `apikey` | Tak | Supabase anon key (dodawany automatycznie przez klienta) |
| `Authorization` | **Nie** | Opcjonalny - endpoint działa bez autentykacji |

### Parametry zapytania (Query Parameters)
| Parametr | Wymagany | Domyślna wartość | Opis |
|----------|----------|------------------|------|
| `select` | Nie | `*` | Pola do zwrócenia (np. `id,name,description`) |
| `order` | Nie | - | Porządek sortowania (np. `name.asc`, `id.desc`) |

### Request Body
Brak - endpoint GET nie przyjmuje body.

---

## 3. Wykorzystywane typy

### Istniejące typy z `src/types/types.ts`

```typescript
// Entity type (bezpośrednie mapowanie tabeli)
export type RoleEntity = Tables<'roles'>;

// DTO dla pełnej odpowiedzi API
export type RoleDTO = Pick<RoleEntity, 'id' | 'name' | 'description' | 'created_at'>;

// DTO dla lżejszych payloadów (bez timestampów)
export type RoleListItemDTO = Pick<RoleEntity, 'id' | 'name' | 'description'>;
```

### Nowe typy do implementacji

```typescript
// Parametry zapytania dla listy ról
export interface ListRolesParams {
  select?: string;
  order?: 'name.asc' | 'name.desc' | 'id.asc' | 'id.desc';
}

// Typ odpowiedzi serwisu
export type ListRolesResponse = RoleDTO[];
```

---

## 4. Szczegóły odpowiedzi

### Sukces (200 OK)

```json
[
  {
    "id": 1,
    "name": "Frontend Developer",
    "description": "Build interactive user interfaces using HTML, CSS, JavaScript and modern frameworks like React.",
    "created_at": "2025-01-01T00:00:00Z"
  },
  {
    "id": 2,
    "name": "Backend Developer",
    "description": "Build robust APIs and server logic using Node.js, Python or Java.",
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```

### Kody statusu

| Kod | Opis |
|-----|------|
| `200 OK` | Role pobrane pomyślnie |
| `500 Internal Server Error` | Błąd serwera Supabase |

---

## 5. Przepływ danych

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│  1. Komponent wywołuje hook useRoles()                          │
│  2. React Query zarządza cache i stan ładowania                 │
│  3. rolesApi.listRoles() wykonuje zapytanie                     │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE CLIENT                            │
├─────────────────────────────────────────────────────────────────┤
│  4. supabase.from('roles').select('*').order(...)               │
│  5. Wysłanie zapytania do Supabase REST API (bez JWT)           │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE BACKEND                           │
├─────────────────────────────────────────────────────────────────┤
│  6. Sprawdzenie RLS policy (SELECT dla anon - dozwolone)        │
│  7. Wykonanie zapytania PostgreSQL                              │
│  8. Zwrócenie danych jako JSON array                            │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│  9. React Query cachuje odpowiedź (staleTime/gcTime)            │
│  10. Komponent renderuje listę ról                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Względy bezpieczeństwa

### Autentykacja
- **NIE WYMAGANA** dla tego endpointu
- RLS policy pozwala użytkownikom `anon` na SELECT z tabeli `roles`

### Autoryzacja (RLS Policy)
```sql
-- Polityka dla tabeli roles (już zdefiniowana w migracji)
-- Pozwala anonimowym użytkownikom na odczyt
CREATE POLICY "anonymous users can view all roles" 
ON public.roles 
FOR SELECT 
TO anon 
USING (true);
```

### Ochrona danych
- Tabela `roles` zawiera tylko dane publiczne (słownikowe)
- Brak wrażliwych informacji użytkowników
- Brak możliwości modyfikacji przez użytkowników (tylko service_role)

---

## 7. Obsługa błędów

### Scenariusze błędów

| Scenariusz | Kod HTTP | Obsługa |
|------------|----------|---------|
| Błąd sieci | - | Wyświetlenie komunikatu, retry |
| Błąd serwera | 500 | Wyświetlenie komunikatu, retry |
| Timeout | - | Wyświetlenie komunikatu, retry |

### Strategia obsługi w React Query

```typescript
const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: rolesApi.listRoles,
    staleTime: 1000 * 60 * 60, // 1 godzina - dane statyczne
    gcTime: 1000 * 60 * 60 * 24, // 24 godziny
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
```

---

## 8. Rozważania dotyczące wydajności

### Cachowanie

| Strategia | Wartość | Uzasadnienie |
|-----------|---------|--------------|
| `staleTime` | 60 minut | Dane ról rzadko się zmieniają |
| `gcTime` | 24 godziny | Długi czas przechowywania w pamięci |
| `refetchOnWindowFocus` | false | Niepotrzebne dla danych statycznych |
| `refetchOnMount` | false | Używaj cache jeśli dostępny |

### Rozmiar odpowiedzi
- Szacowana liczba ról: 6-10 (MVP)
- Szacowany rozmiar odpowiedzi: ~1-2 KB
- Brak potrzeby paginacji

---

## 9. Etapy wdrożenia

### Krok 1: Utworzenie struktury folderów

```
src/
├── api/
│   ├── index.ts           # Eksport wszystkich API modułów
│   └── roles.api.ts       # API module dla ról
├── hooks/
│   ├── index.ts           # Eksport wszystkich hooków
│   └── useRoles.ts        # React Query hook dla ról
└── types/
    └── types.ts           # (istniejący) Dodanie nowych typów
```

### Krok 2: Dodanie typów dla parametrów zapytania

W pliku `src/types/types.ts` dodaj:

```typescript
// ============================================================================
// Roles Query Types
// ============================================================================

/**
 * Query parameters for listing roles
 * Used with GET /rest/v1/roles
 */
export interface ListRolesParams {
  /** Fields to return (Supabase select syntax) */
  select?: string;
  /** Sort order (e.g., 'name.asc', 'id.desc') */
  order?: 'name.asc' | 'name.desc' | 'id.asc' | 'id.desc';
}
```

### Krok 3: Implementacja API module

Utwórz plik `src/api/roles.api.ts`:

```typescript
import { supabaseClient } from '@/db/supabase.client';
import type { RoleDTO, ListRolesParams } from '@/types';

/**
 * Roles API module
 * Handles all role-related API operations
 * Note: No authentication required - roles are public data
 */
export const rolesApi = {
  /**
   * Fetch all available IT roles
   * @param params - Optional query parameters
   * @returns Promise<RoleDTO[]> - Array of roles
   */
  async listRoles(params?: ListRolesParams): Promise<RoleDTO[]> {
    let query = supabaseClient
      .from('roles')
      .select(params?.select ?? '*');

    if (params?.order) {
      const [column, direction] = params.order.split('.') as [string, 'asc' | 'desc'];
      query = query.order(column, { ascending: direction === 'asc' });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data as RoleDTO[];
  },
};
```

### Krok 4: Implementacja React Query hook

Utwórz plik `src/hooks/useRoles.ts`:

```typescript
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { rolesApi } from '@/api/roles.api';
import type { RoleDTO, ListRolesParams } from '@/types';

/** Query key for roles */
export const ROLES_QUERY_KEY = ['roles'] as const;

/**
 * Hook to fetch all available IT roles
 * Uses React Query for caching and state management
 * No authentication required - roles are public data
 */
export const useRoles = (
  params?: ListRolesParams,
  options?: Omit<UseQueryOptions<RoleDTO[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [...ROLES_QUERY_KEY, params],
    queryFn: () => rolesApi.listRoles(params),
    staleTime: 1000 * 60 * 60, // 1 hour - roles are static data
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 3,
    ...options,
  });
};
```

### Krok 5: Utworzenie plików eksportujących (barrel exports)

Utwórz `src/api/index.ts`:

```typescript
export { rolesApi } from './roles.api';
```

Utwórz `src/hooks/index.ts`:

```typescript
export { useRoles, ROLES_QUERY_KEY } from './useRoles';
```

### Krok 6: Przykład użycia w komponencie

```typescript
import { useRoles } from '@/hooks';
import { CircularProgress, Alert, List, ListItem, ListItemText, Stack } from '@mui/material';

export const RolesList = () => {
  const { data: roles, isLoading, error } = useRoles({ order: 'name.asc' });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">Failed to load roles: {error.message}</Alert>;
  }

  return (
    <List>
      {roles?.map((role) => (
        <ListItem key={role.id}>
          <ListItemText 
            primary={role.name} 
            secondary={role.description} 
          />
        </ListItem>
      ))}
    </List>
  );
};
```

---

## 10. Testowanie (Development)

### Default Test User

Dla testowania endpointów wymagających kontekstu użytkownika (profiles, user_progress) dodano migrację z default userem:

**UUID testowego użytkownika:** `00000000-0000-0000-0000-000000000001`

Migracja: `supabase/migrations/20251116120500_seed_dev_user.sql`

### Uruchomienie migracji

```powershell
# Zastosuj migrację lokalnie
npx supabase db push

# Lub dla zdalnej bazy
npx supabase db push --linked
```

### Testowanie endpointu roles (curl/PowerShell)

```powershell
# Pobierz wszystkie role (bez auth)
$headers = @{
    "apikey" = $env:VITE_SUPABASE_ANON_KEY
}
Invoke-RestMethod -Uri "$env:VITE_SUPABASE_URL/rest/v1/roles" -Headers $headers

# Z sortowaniem
Invoke-RestMethod -Uri "$env:VITE_SUPABASE_URL/rest/v1/roles?order=name.asc" -Headers $headers

# Tylko wybrane pola
Invoke-RestMethod -Uri "$env:VITE_SUPABASE_URL/rest/v1/roles?select=id,name" -Headers $headers
```

---

## 11. Checklist implementacji

- [ ] Zastosować migrację `20251116120500_seed_dev_user.sql`
- [ ] Dodać typy `ListRolesParams` do `src/types/types.ts`
- [ ] Utworzyć folder `src/api/`
- [ ] Utworzyć `src/api/roles.api.ts` z funkcją `listRoles`
- [ ] Utworzyć `src/api/index.ts` (barrel export)
- [ ] Utworzyć folder `src/hooks/`
- [ ] Utworzyć `src/hooks/useRoles.ts` z hookiem `useRoles`
- [ ] Utworzyć `src/hooks/index.ts` (barrel export)
- [ ] Zweryfikować konfigurację React Query w aplikacji
- [ ] Przetestować endpoint (curl/PowerShell)
- [ ] Zweryfikować czy linter nie zgłasza błędów

---

## 12. Uwagi dodatkowe

### Zależności
- `@tanstack/react-query` - do zarządzania stanem i cache
- `@supabase/supabase-js` - klient Supabase (już zainstalowany)

### Zgodność z RLS
Endpoint korzysta z istniejącej polityki RLS zdefiniowanej w migracji `20251116120200_create_rls_policies.sql`:
```sql
-- Anon users mogą czytać role bez autentykacji
CREATE POLICY "anonymous users can view all roles" 
ON public.roles FOR SELECT TO anon USING (true);
```

### Przyszłe rozszerzenia
- Dodanie endpointu `GET /rest/v1/roles?id=eq.{role_id}` dla pojedynczej roli
- Dodanie autentykacji gdy będzie potrzebna
- Cachowanie ról w localStorage dla offline support

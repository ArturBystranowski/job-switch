🛠️ **Tech Stack JobSwitch**

## **Frontend**

| Technologia           | Rola / Zastosowanie                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------ |
| **React 19**          | Framework do budowy interaktywnych komponentów i widoków.                                  |
| **Vite**              | Szybki bundler i dev server dla React; umożliwia szybkie hot reload i build.               |
| **TypeScript 5**      | Statyczne typowanie kodu, lepsza autokompletacja w IDE, zwiększa bezpieczeństwo kodu.      |
| **Material UI (MUI)** | Biblioteka gotowych komponentów UI, stylowanie, responsywność, łatwe tworzenie interfejsu. |

---

## **Backend / Baza Danych**

| Technologia                 | Rola / Zastosowanie                                                                                  |
| --------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Supabase**                | Kompleksowy backend-as-a-service: baza danych PostgreSQL, uwierzytelnianie, storage, CRUD, realtime. |
| **Supabase Auth**           | Rejestracja, logowanie, JWT, bezpieczne uwierzytelnianie użytkowników.                               |
| **Supabase Storage**        | Przechowywanie CV użytkowników (PDF/DOCX, max 1 MB).                                                 |
| **Supabase Edge Functions** | Backend logic dla AI (analiza CV, generowanie ról i roadmap), zamiast FastAPI.                       |

---

## **AI / Generowanie rekomendacji**

| Technologia                 | Rola / Zastosowanie                                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **OpenRouter.ai**           | Integracja z modelami AI (OpenAI, Anthropic, Google itp.) w celu generowania rekomendacji i roadmap.             |
| **Supabase Edge Functions** | Bezpieczne pośrednictwo między frontendem a OpenRouter (ukrycie API key, walidacja danych, generowanie wyników). |

---

## **CI/CD i Hosting**

| Technologia                               | Rola / Zastosowanie                                                                     |
| ----------------------------------------- | --------------------------------------------------------------------------------------- |
| **GitHub Actions**                        | Automatyzacja buildów, testów jednostkowych i E2E, pipeline CI/CD.                      |
| **DigitalOcean (Droplet / App Platform)** | Hosting aplikacji React + Edge Functions; środowisko produkcyjne dla MVP.               |
| **Environment Variables**                 | Przechowywanie sekretów (Supabase URL, anon key, service role key, OpenRouter API key). |

---

## **Testy**

| Technologia               | Zastosowanie                                                                            |
| ------------------------- | --------------------------------------------------------------------------------------- |
| **Vitest**                | Testy jednostkowe dla komponentów i logiki.                                             |
| **React Testing Library** | Testowanie interaktywności komponentów React.                                           |
| **1 test E2E**            | Minimalny test przepływu użytkownika (rejestracja → upload CV → wybór roli → roadmapa). |

---

## **Podsumowanie architektury MVP**

```
Frontend (React + TypeScript + Material UI + Vite)
        ↓
Supabase Auth / DB / Storage
        ↓
Supabase Edge Functions (AI via OpenRouter)
        ↓
OpenRouter.ai (generowanie rekomendacji i roadmap)
```

- Cały backend realizowany przez **Supabase + Edge Functions**.
- Material UI zapewnia gotowe, spójne komponenty UI i responsywność.
- Vite zapewnia szybkie dev experience i produkcyjny build.

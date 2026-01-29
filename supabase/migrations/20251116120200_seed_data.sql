-- ============================================================================
-- Migration: Seed Data for JobSwitch MVP
-- Created: 2025-11-16 12:02:00 UTC
-- Updated: 2026-01-27
-- Description: Inserts production seed data:
--              - 6 IT roles with image URLs (including Project Manager)
--              - 10 Questionnaire questions and options
--              - Complete roadmaps (8-11 steps) and tasks (3-5 per step) for all roles, including final "Praca z AI" step
-- ============================================================================

-- ============================================================================
-- SECTION 1: IT ROLES (6 roles)
-- ============================================================================

INSERT INTO public.roles (name, description) VALUES
('Frontend Developer', 'Twórz interaktywne interfejsy użytkownika używając HTML, CSS, JavaScript i nowoczesnych frameworków jak React. Zajmij się tym, co użytkownicy widzą i z czym wchodzą w interakcję.'),
('Backend Developer', 'Buduj solidne API i logikę serwerową z użyciem Node.js, Python lub Java. Odpowiadaj za przetwarzanie danych, bezpieczeństwo i integracje z bazami danych.'),
('DevOps Engineer', 'Automatyzuj procesy CI/CD, zarządzaj infrastrukturą w chmurze (AWS, Azure, GCP) i monitoruj aplikacje. Łącz development z operations dla płynnych wdrożeń.'),
('Data Analyst', 'Analizuj dane, twórz raporty i wizualizacje, wspieraj decyzje biznesowe. Używaj SQL, Python, Excel i narzędzi BI jak Tableau lub Power BI.'),
('UX/UI Designer', 'Projektuj intuicyjne interfejsy i doświadczenia użytkownika z dbałością o estetykę. Twórz wireframes, prototypy i design systemy w Figma lub Adobe XD.'),
('Project Manager', 'Zarządzaj projektami IT, koordynuj zespoły i pilnuj terminów. Używaj metodyk Agile/Scrum, prowadź spotkania, zarządzaj backlogiem i komunikuj się ze stakeholderami.');

-- ============================================================================
-- SECTION 2: QUESTIONNAIRE QUESTIONS (10 questions)
-- ============================================================================

INSERT INTO public.questionnaire_questions (field_name, question_text, question_order) VALUES
  ('work_style', 'Jak wolisz pracować?', 1),
  ('client_interaction', 'Ile kontaktu z klientem/użytkownikiem końcowym Ci odpowiada?', 2),
  ('aesthetic_focus', 'Jak ważna jest dla Ciebie warstwa wizualna produktu?', 3),
  ('teamwork_preference', 'Jak oceniasz swoją preferencję do pracy zespołowej?', 4),
  ('problem_solving_approach', 'Jak podchodzisz do rozwiązywania problemów?', 5),
  ('leadership_preference', 'Jak czujesz się w roli lidera lub koordynatora?', 6),
  ('technical_depth', 'Jak głęboko chcesz wchodzić w techniczne szczegóły?', 7),
  ('data_vs_design', 'Co bardziej Cię fascynuje?', 8),
  ('coding_interest', 'Jak widzisz swoją przyszłość w kodowaniu?', 9),
  ('uncertainty_handling', 'Jak reagujesz na zmieniające się wymagania i niepewność?', 10);

-- ============================================================================
-- SECTION 3: QUESTIONNAIRE OPTIONS
-- ============================================================================

-- Options for work_style
INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'independent', 'Samodzielnie, w swoim tempie', 1
FROM public.questionnaire_questions WHERE field_name = 'work_style';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'collaborative', 'W zespole, z częstą komunikacją', 2
FROM public.questionnaire_questions WHERE field_name = 'work_style';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'mixed', 'Elastycznie - zależnie od zadania', 3
FROM public.questionnaire_questions WHERE field_name = 'work_style';

-- Options for client_interaction
INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'minimal', 'Minimum - wolę skupić się na kodzie', 1
FROM public.questionnaire_questions WHERE field_name = 'client_interaction';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'moderate', 'Umiarkowany - czasem rozmowy są OK', 2
FROM public.questionnaire_questions WHERE field_name = 'client_interaction';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'extensive', 'Dużo - lubię rozumieć potrzeby użytkowników', 3
FROM public.questionnaire_questions WHERE field_name = 'client_interaction';

-- Options for aesthetic_focus
INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'low', 'Mało - liczy się funkcjonalność', 1
FROM public.questionnaire_questions WHERE field_name = 'aesthetic_focus';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'medium', 'Średnio - ważne, ale nie priorytet', 2
FROM public.questionnaire_questions WHERE field_name = 'aesthetic_focus';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'high', 'Bardzo - design i UX są kluczowe', 3
FROM public.questionnaire_questions WHERE field_name = 'aesthetic_focus';

-- Options for teamwork_preference
INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'low', 'Wolę pracować samodzielnie', 1
FROM public.questionnaire_questions WHERE field_name = 'teamwork_preference';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'medium', 'Zespół OK, ale potrzebuję czasu na fokus', 2
FROM public.questionnaire_questions WHERE field_name = 'teamwork_preference';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'high', 'Uwielbiam współpracę i burze mózgów', 3
FROM public.questionnaire_questions WHERE field_name = 'teamwork_preference';

-- Options for problem_solving_approach
INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'analytical', 'Analitycznie - rozkładam na części, szukam wzorców', 1
FROM public.questionnaire_questions WHERE field_name = 'problem_solving_approach';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'creative', 'Kreatywnie - szukam niestandardowych rozwiązań', 2
FROM public.questionnaire_questions WHERE field_name = 'problem_solving_approach';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'practical', 'Praktycznie - najprostsze rozwiązanie które działa', 3
FROM public.questionnaire_questions WHERE field_name = 'problem_solving_approach';

-- Options for leadership_preference (NEW)
INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'executor', 'Wolę być wykonawcą - realizuję zadania, nie chcę zarządzać', 1
FROM public.questionnaire_questions WHERE field_name = 'leadership_preference';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'situational', 'Mogę koordynować gdy trzeba, ale nie szukam tego aktywnie', 2
FROM public.questionnaire_questions WHERE field_name = 'leadership_preference';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'natural_leader', 'Naturalnie przejmuję inicjatywę i organizuję pracę innych', 3
FROM public.questionnaire_questions WHERE field_name = 'leadership_preference';

-- Options for technical_depth (NEW)
INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'deep', 'Chcę być ekspertem technicznym, rozumieć każdy szczegół', 1
FROM public.questionnaire_questions WHERE field_name = 'technical_depth';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'general', 'Wystarczy mi rozumienie technologii na poziomie koncepcyjnym', 2
FROM public.questionnaire_questions WHERE field_name = 'technical_depth';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'process_focused', 'Wolę skupić się na procesach i ludziach niż na technologii', 3
FROM public.questionnaire_questions WHERE field_name = 'technical_depth';

-- Options for data_vs_design (NEW)
INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'data', 'Analiza danych, szukanie wzorców, wyciąganie wniosków', 1
FROM public.questionnaire_questions WHERE field_name = 'data_vs_design';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'design', 'Tworzenie interfejsów, estetyka, doświadczenia użytkownika', 2
FROM public.questionnaire_questions WHERE field_name = 'data_vs_design';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'coordination', 'Organizacja pracy, koordynacja zespołu, planowanie', 3
FROM public.questionnaire_questions WHERE field_name = 'data_vs_design';

-- Options for coding_interest (NEW)
INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'daily_coding', 'Chcę programować na co dzień - to moje główne zajęcie', 1
FROM public.questionnaire_questions WHERE field_name = 'coding_interest';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'scripting', 'Mogę skryptować i automatyzować, ale nie full-time coding', 2
FROM public.questionnaire_questions WHERE field_name = 'coding_interest';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'no_coding', 'Wolę nie kodować - skupiam się na innych aspektach', 3
FROM public.questionnaire_questions WHERE field_name = 'coding_interest';

-- Options for uncertainty_handling (NEW)
INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'stability', 'Wolę jasne specyfikacje i stabilność - zmiany mnie stresują', 1
FROM public.questionnaire_questions WHERE field_name = 'uncertainty_handling';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'adaptable', 'Adaptuję się, ale potrzebuję ogólnego kierunku', 2
FROM public.questionnaire_questions WHERE field_name = 'uncertainty_handling';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'thrives_in_chaos', 'Świetnie odnajduję się w chaosie i zmianach', 3
FROM public.questionnaire_questions WHERE field_name = 'uncertainty_handling';

-- ============================================================================
-- SECTION 4: FRONTEND DEVELOPER ROADMAP
-- ============================================================================

DO $$
DECLARE
  frontend_role_id integer;
BEGIN
  SELECT id INTO frontend_role_id FROM public.roles WHERE name = 'Frontend Developer';
  
  INSERT INTO public.roadmap_steps (role_id, order_number, title, description) VALUES
  (frontend_role_id, 1, 'Podstawy HTML i CSS', 'Naucz się struktury dokumentów HTML oraz stylowania za pomocą CSS. Zrozum box model, flexbox i grid. Twórz responsywne layouty i poznaj podstawowe selektory CSS. To fundamenty każdego frontendu.'),
  (frontend_role_id, 2, 'JavaScript - fundamenty', 'Opanuj podstawy JavaScript: zmienne, funkcje, pętle, obiekty i manipulację DOM. Naucz się obsługi zdarzeń (events) i asynchroniczności (callbacks). JS to serce interaktywności w przeglądarce.'),
  (frontend_role_id, 3, 'Responsive Web Design', 'Poznaj media queries, mobile-first approach i tworzenie responsywnych layoutów. Naucz się optymalizować strony pod różne rozmiary ekranów. Twoja aplikacja musi działać na telefonie, tablecie i desktopie.'),
  (frontend_role_id, 4, 'Git i kontrola wersji', 'Naucz się podstaw Git: commit, branch, merge, pull request. Załóż konto na GitHub i stwórz pierwsze repozytorium. Git to absolutna podstawa pracy w zespole i zarządzania kodem.'),
  (frontend_role_id, 5, 'JavaScript ES6+', 'Poznaj nowoczesne funkcje JS: arrow functions, destructuring, spread operator, promises, async/await, modules. ES6+ to standard współczesnego JavaScript i podstawa frameworków jak React.'),
  (frontend_role_id, 6, 'React - wprowadzenie', 'Zacznij pracę z React: komponenty funkcyjne, props, state, hooks (useState, useEffect). Zrozum virtual DOM i jednokierunkowy przepływ danych. React to najpopularniejszy framework frontendowy.'),
  (frontend_role_id, 7, 'React - zaawansowane', 'Poznaj Context API, custom hooks, React Router dla nawigacji, zarządzanie stanem (Redux, Zustand lub Jotai). Naucz się optymalizacji wydajności i code splitting. Zbuduj kompletną aplikację SPA.'),
  (frontend_role_id, 8, 'TypeScript', 'Dodaj statyczne typowanie do swoich projektów. Poznaj interfaces, types, generics, type guards. TypeScript eliminuje wiele błędów na etapie developmentu i ułatwia pracę w zespole.'),
  (frontend_role_id, 9, 'Testing', 'Naucz się testować kod: Vitest dla testów jednostkowych, React Testing Library dla komponentów, podstawy testów integracyjnych. Testy to pewność, że Twój kod działa poprawnie.'),
  (frontend_role_id, 10, 'Portfolio i deployment', 'Zbuduj portfolio z 3-5 projektami pokazującymi Twoje umiejętności. Wdroż aplikacje na Vercel lub Netlify. Przygotuj profesjonalne CV i profil LinkedIn. Gotowy do aplikowania na pierwszą pracę!'),
  (frontend_role_id, 11, 'Praca z AI', 'Opanuj pracę ze sztuczną inteligencją w codziennym developmentcie: prompt engineering, narzędzia AI do pisania i refaktoryzacji kodu (Cursor, Claude Code), skuteczne podpowiedzi i code review z AI. AI nie zastąpi programisty, ale znacząco przyspieszy i ułatwi pracę.');
END $$;

-- ============================================================================
-- SECTION 5: FRONTEND DEVELOPER TASKS
-- ============================================================================

DO $$
DECLARE
  step1_id integer;
  step2_id integer;
  step3_id integer;
  step4_id integer;
  step5_id integer;
  step6_id integer;
  step7_id integer;
  step8_id integer;
  step9_id integer;
  step10_id integer;
  step11_id integer;
  frontend_role_id integer;
BEGIN
  SELECT id INTO frontend_role_id FROM public.roles WHERE name = 'Frontend Developer';
  
  SELECT id INTO step1_id FROM public.roadmap_steps WHERE role_id = frontend_role_id AND order_number = 1;
  SELECT id INTO step2_id FROM public.roadmap_steps WHERE role_id = frontend_role_id AND order_number = 2;
  SELECT id INTO step3_id FROM public.roadmap_steps WHERE role_id = frontend_role_id AND order_number = 3;
  SELECT id INTO step4_id FROM public.roadmap_steps WHERE role_id = frontend_role_id AND order_number = 4;
  SELECT id INTO step5_id FROM public.roadmap_steps WHERE role_id = frontend_role_id AND order_number = 5;
  SELECT id INTO step6_id FROM public.roadmap_steps WHERE role_id = frontend_role_id AND order_number = 6;
  SELECT id INTO step7_id FROM public.roadmap_steps WHERE role_id = frontend_role_id AND order_number = 7;
  SELECT id INTO step8_id FROM public.roadmap_steps WHERE role_id = frontend_role_id AND order_number = 8;
  SELECT id INTO step9_id FROM public.roadmap_steps WHERE role_id = frontend_role_id AND order_number = 9;
  SELECT id INTO step10_id FROM public.roadmap_steps WHERE role_id = frontend_role_id AND order_number = 10;
  SELECT id INTO step11_id FROM public.roadmap_steps WHERE role_id = frontend_role_id AND order_number = 11;

  -- Step 1: Podstawy HTML i CSS (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step1_id, 1, 'Struktura dokumentu HTML', 'Poznaj podstawowe tagi HTML: html, head, body, div, span, p, h1-h6. Stwórz prostą stronę z nagłówkami i paragrafami.', 4),
  (step1_id, 2, 'Formularze i linki', 'Naucz się tworzyć formularze (input, button, form) oraz linki i obrazki. Zbuduj stronę z formularzem kontaktowym.', 4),
  (step1_id, 3, 'CSS Box Model i selektory', 'Zrozum box model (margin, padding, border). Poznaj selektory CSS: klasy, ID, selektory potomków. Ostyluj swoją stronę HTML.', 6),
  (step1_id, 4, 'Flexbox i Grid', 'Opanuj layouty z Flexbox (justify-content, align-items) i CSS Grid. Stwórz responsywny layout strony z nawigacją i sekcjami.', 8);

  -- Step 2: JavaScript - fundamenty (5 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step2_id, 1, 'Zmienne i typy danych', 'Poznaj let, const, var. Zrozum typy: string, number, boolean, null, undefined. Ćwicz konwersje typów i operatory.', 4),
  (step2_id, 2, 'Funkcje i pętle', 'Naucz się deklarować funkcje, używać parametrów i return. Opanuj pętle for, while, forEach. Rozwiąż 5 zadań algorytmicznych.', 6),
  (step2_id, 3, 'Obiekty i tablice', 'Pracuj z obiektami i tablicami. Poznaj metody: map, filter, reduce, find. Zbuduj prostą listę zadań w pamięci.', 6),
  (step2_id, 4, 'Manipulacja DOM', 'Naucz się querySelector, createElement, appendChild, innerHTML. Zmodyfikuj stronę HTML dynamicznie za pomocą JS.', 6),
  (step2_id, 5, 'Obsługa zdarzeń', 'Poznaj addEventListener, event object, event bubbling. Dodaj interaktywność do swojej strony: kliknięcia, hover, submit formularza.', 4);

  -- Step 3: Responsive Web Design (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step3_id, 1, 'Media queries', 'Naucz się pisać media queries dla różnych breakpointów. Zrozum min-width vs max-width i mobile-first approach.', 4),
  (step3_id, 2, 'Responsywne obrazki', 'Poznaj srcset, sizes, picture element. Optymalizuj obrazki pod różne rozdzielczości i formaty (WebP).', 4),
  (step3_id, 3, 'Responsywna typografia', 'Używaj jednostek względnych (rem, em, vw). Implementuj fluid typography i skalowanie tekstu.', 3),
  (step3_id, 4, 'Projekt responsywnej strony', 'Zbuduj kompletną responsywną stronę landing page działającą na mobile, tablet i desktop. Przetestuj na różnych urządzeniach.', 8);

  -- Step 4: Git i kontrola wersji (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step4_id, 1, 'Podstawy Git', 'Zainstaluj Git, skonfiguruj user.name i user.email. Poznaj git init, git status, git add, git commit. Stwórz pierwsze repozytorium.', 3),
  (step4_id, 2, 'Praca z branchami', 'Naucz się git branch, git checkout, git merge. Zrozum flow: feature branch -> merge to main. Rozwiąż prosty konflikt merge.', 4),
  (step4_id, 3, 'GitHub i remote', 'Załóż konto na GitHub. Naucz się git push, git pull, git clone. Opublikuj swój projekt na GitHub.', 3),
  (step4_id, 4, 'Pull Requests i współpraca', 'Stwórz Pull Request na GitHub. Poznaj code review, komentarze, approve. Zforkuj cudzy projekt i zaproponuj zmianę.', 4);

  -- Step 5: JavaScript ES6+ (5 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step5_id, 1, 'Arrow functions i destructuring', 'Opanuj składnię arrow functions. Poznaj destructuring obiektów i tablic. Przepisz stary kod na nową składnię.', 4),
  (step5_id, 2, 'Spread i rest operator', 'Naucz się spread operator (...) do kopiowania obiektów/tablic. Poznaj rest parameters w funkcjach.', 3),
  (step5_id, 3, 'Promises', 'Zrozum asynchroniczność w JS. Poznaj Promise, then, catch, finally. Napisz funkcję pobierającą dane z API.', 6),
  (step5_id, 4, 'Async/await', 'Opanuj async/await jako syntactic sugar dla Promises. Obsłuż błędy z try/catch. Przepisz kod z then/catch na async/await.', 4),
  (step5_id, 5, 'ES Modules', 'Poznaj import/export. Zorganizuj kod w moduły. Zrozum różnicę między named i default exports.', 3);

  -- Step 6: React - wprowadzenie (5 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step6_id, 1, 'Środowisko i pierwszy komponent', 'Stwórz projekt z Vite + React. Poznaj strukturę projektu, JSX, pierwszy komponent funkcyjny. Uruchom dev server.', 4),
  (step6_id, 2, 'Props i kompozycja', 'Naucz się przekazywać dane przez props. Zbuduj komponenty wielokrotnego użytku. Poznaj children i kompozycję.', 5),
  (step6_id, 3, 'useState Hook', 'Opanuj useState do zarządzania stanem lokalnym. Zbuduj licznik, toggle, prosty formularz z kontrolowanymi inputami.', 5),
  (step6_id, 4, 'useEffect Hook', 'Poznaj useEffect do side effects. Zrozum dependency array. Pobierz dane z API przy montowaniu komponentu.', 6),
  (step6_id, 5, 'Listy i warunkowe renderowanie', 'Renderuj listy z key prop. Implementuj warunkowe renderowanie (&&, ternary). Zbuduj listę produktów z filtrowaniem.', 5);

  -- Step 7: React - zaawansowane (5 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step7_id, 1, 'React Router', 'Dodaj routing do aplikacji. Poznaj BrowserRouter, Routes, Route, Link, useNavigate. Stwórz nawigację między stronami.', 6),
  (step7_id, 2, 'Context API', 'Zrozum prop drilling problem. Implementuj Context dla globalnego stanu (theme, user). Użyj useContext hook.', 5),
  (step7_id, 3, 'Custom Hooks', 'Wydziel logikę do custom hooks (useFetch, useLocalStorage). Zrozum zasady tworzenia hooks i ich reużywalność.', 5),
  (step7_id, 4, 'Zarządzanie stanem', 'Poznaj bibliotekę do stanu globalnego (Zustand lub Redux Toolkit). Zaimplementuj store dla swojej aplikacji.', 8),
  (step7_id, 5, 'Pełna aplikacja SPA', 'Zbuduj kompletną aplikację: routing, global state, API calls, formularze. Np. aplikacja do zarządzania zadaniami lub notatkami.', 12);

  -- Step 8: TypeScript (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step8_id, 1, 'Podstawowe typy', 'Poznaj string, number, boolean, array, object types. Skonfiguruj TypeScript w projekcie React (tsconfig).', 4),
  (step8_id, 2, 'Interfejsy i typy', 'Naucz się definiować interface i type. Zrozum różnice między nimi. Typuj props komponentów React.', 5),
  (step8_id, 3, 'Generics', 'Poznaj generics dla reużywalnych typów. Typuj funkcje, hooki, komponenty z generics. Np. useState<T>.', 6),
  (step8_id, 4, 'TypeScript w praktyce', 'Przepisz istniejący projekt JS na TypeScript. Napraw błędy typów. Poznaj utility types (Partial, Pick, Omit).', 8);

  -- Step 9: Testing (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step9_id, 1, 'Vitest - setup i podstawy', 'Skonfiguruj Vitest w projekcie. Napisz pierwsze testy jednostkowe dla funkcji pomocniczych. Poznaj describe, it, expect.', 4),
  (step9_id, 2, 'React Testing Library', 'Zainstaluj RTL. Testuj komponenty: render, screen, fireEvent, userEvent. Napisz testy dla 3 komponentów.', 6),
  (step9_id, 3, 'Mockowanie', 'Poznaj vi.mock, vi.fn, vi.spyOn. Mockuj API calls i moduły. Testuj komponenty z zewnętrznymi zależnościami.', 5),
  (step9_id, 4, 'Testy integracyjne', 'Napisz testy integracyjne dla flow użytkownika. Testuj formularze, nawigację, interakcje między komponentami.', 6);

  -- Step 10: Portfolio i deployment (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step10_id, 1, 'Projekty portfolio', 'Wybierz 3-5 najlepszych projektów. Dopracuj kod, dodaj README z opisem i screenshotami. Upewnij się, że działają.', 8),
  (step10_id, 2, 'Deployment na Vercel/Netlify', 'Wdroż projekty na Vercel lub Netlify. Skonfiguruj domenę, zmienne środowiskowe. Sprawdź wydajność i SEO.', 4),
  (step10_id, 3, 'CV i LinkedIn', 'Przygotuj profesjonalne CV (1 strona). Zaktualizuj profil LinkedIn z projektami i umiejętnościami. Napisz bio.', 6),
  (step10_id, 4, 'Strona portfolio', 'Zbuduj osobistą stronę portfolio prezentującą projekty, umiejętności i kontakt. Wdroż ją online.', 10);

  -- Step 11: Praca z AI (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step11_id, 1, 'Prompt engineering', 'Naucz się pisać skuteczne prompty: kontekst, instrukcje krok po kroku, przykłady. Użyj AI do generowania komponentów, testów i dokumentacji.', 5),
  (step11_id, 2, 'Praca z Cursor', 'Zainstaluj i skonfiguruj Cursor. Opanuj AI autocomplete, edycję w edytorze (Cmd+K), chat z kodem. Przyspiesz codzienną pracę z React/TypeScript.', 5),
  (step11_id, 3, 'Claude Code i AI-assisted coding', 'Poznaj Claude Code (lub podobne narzędzia) do generowania i refaktoryzacji kodu. Naucz się weryfikować sugestie AI i integrować je z workflow.', 5);

  RAISE NOTICE 'Successfully inserted tasks for Frontend Developer steps';
END $$;

-- ============================================================================
-- SECTION 6: UX/UI DESIGNER ROADMAP
-- ============================================================================

DO $$
DECLARE
  uxui_role_id integer;
BEGIN
  SELECT id INTO uxui_role_id FROM public.roles WHERE name = 'UX/UI Designer';
  
  IF uxui_role_id IS NULL THEN
    RAISE EXCEPTION 'UX/UI Designer role not found';
  END IF;

  INSERT INTO public.roadmap_steps (role_id, order_number, title, description) VALUES
  (uxui_role_id, 1, 'Fundamenty UX: myślenie projektowe i użytkownik', 
   'Poznaj Design Thinking, Human-Centered Design i podstawy psychologii poznawczej (percepcja, obciążenie poznawcze). Opanuj heurystyki Nielsena i zasady accessibility (WCAG). UX to nie estetyka, lecz rozwiązywanie problemów użytkownika. Bez zrozumienia, jak ludzie myślą i podejmują decyzje, projektowanie UI staje się jedynie dekoracją. To fundament całej profesji.'),
  
  (uxui_role_id, 2, 'Research UX i analiza problemu', 
   'Naucz się prowadzić wywiady z użytkownikami, tworzyć ankiety, persony i user journeys. Poznaj jobs-to-be-done i analizę konkurencji. Opanuj syntezę insightów. Dobry projekt zaczyna się od właściwego problemu, nie od ekranu w Figmie. Research umożliwia podejmowanie decyzji opartych na danych, a nie intuicji — co jest szczególnie cenione u osób przebranżawiających się.'),
  
  (uxui_role_id, 3, 'Architektura informacji i projektowanie interakcji', 
   'Poznaj Information Architecture, user flows i task flows. Twórz mapy nawigacji i wireframy low-fidelity. Opanuj zasady projektowania interakcji. To etap, w którym chaos wymagań zamienia się w logiczny system. Użytkownik powinien intuicyjnie wiedzieć, co zrobić dalej — a to osiąga się strukturą, nie kolorem przycisku.'),
  
  (uxui_role_id, 4, 'UI Design i systemy wizualne', 
   'Opanuj typografię, kolor, spacing, layout i gridy. Naucz się tworzyć design systems, komponenty i style guides. Poznaj zaawansowane funkcje Figma i FigJam. UI jest interfejsem między użytkownikiem a funkcją. Dobrze zaprojektowany UI redukuje błędy, przyspiesza zadania i buduje zaufanie do produktu. Systemowe myślenie pozwala skalować projekty i współpracować z zespołami.'),
  
  (uxui_role_id, 5, 'Prototypowanie i testy użyteczności', 
   'Twórz prototypy high-fidelity. Prowadź testy użyteczności — moderowane i niemoderowane. Analizuj zachowania użytkowników i iteruj projekty. UX to proces iteracyjny. Testy pozwalają wcześnie wykrywać błędy, zanim trafią do developmentu, oszczędzając czas i pieniądze. Projektant, który testuje, projektuje odpowiedzialnie.'),
  
  (uxui_role_id, 6, 'Współpraca z developerami i rozumienie technologii', 
   'Poznaj podstawy HTML/CSS i pojęcia frontendowe. Naucz się efektywnego handoffu (design → dev) i tworzenia dokumentacji projektowej. Zrozum ograniczenia techniczne. Projektant, który rozumie realia wdrożeniowe, tworzy projekty wykonalne, a nie tylko atrakcyjne wizualnie. To znacząco zwiększa Twoją wartość w zespole produktowym.'),
  
  (uxui_role_id, 7, 'AI w pracy UI/UX Designera', 
   'Poznaj generatywne AI do ideacji (koncepty flow, microcopy, warianty UI), AI do researchu i syntezy insightów oraz AI do testów (symulacje użytkowników). Opanuj narzędzia AI w Figmie i prompt engineering pod UX. AI nie zastąpi projektanta, ale zastąpi projektanta, który nie używa AI. Świadome wykorzystanie AI zwiększa produktywność i pozwala skupić się na strategicznym myśleniu.'),
  
  (uxui_role_id, 8, 'Portfolio, case studies i pozycjonowanie zawodowe', 
   'Zbuduj portfolio UX z case studies end-to-end. Opanuj storytelling projektowy i prezentację decyzji. Rozwijaj personal branding i przygotuj się do rozmów rekrutacyjnych. Rekruter nie zatrudnia narzędzia, lecz sposób myślenia. Dobrze opisane case study pokazuje, że rozumiesz proces, potrafisz podejmować decyzje i wyciągać wnioski — nawet jeśli wcześniej pracowałeś w innej branży.'),
  
  (uxui_role_id, 9, 'Praca z AI w designie', 
   'Opanuj narzędzia AI i codzienny workflow z AI w UX/UI: prompt engineering pod design, Cursor i pluginy AI w Figmie, Claude/ChatGPT do microcopy, flow i wariantów UI. AI nie zastąpi projektanta, ale znacząco przyspieszy iteracje i jakość deliverables.');

  RAISE NOTICE 'Successfully inserted 9 roadmap steps for UX/UI Designer (role_id=%)', uxui_role_id;
END $$;

-- ============================================================================
-- SECTION 7: UX/UI DESIGNER TASKS (3-4 tasks per step)
-- ============================================================================

DO $$
DECLARE
  step1_id integer;
  step2_id integer;
  step3_id integer;
  step4_id integer;
  step5_id integer;
  step6_id integer;
  step7_id integer;
  step8_id integer;
  step9_id integer;
  uxui_role_id integer;
BEGIN
  SELECT id INTO uxui_role_id FROM public.roles WHERE name = 'UX/UI Designer';
  
  SELECT id INTO step1_id FROM public.roadmap_steps WHERE role_id = uxui_role_id AND order_number = 1;
  SELECT id INTO step2_id FROM public.roadmap_steps WHERE role_id = uxui_role_id AND order_number = 2;
  SELECT id INTO step3_id FROM public.roadmap_steps WHERE role_id = uxui_role_id AND order_number = 3;
  SELECT id INTO step4_id FROM public.roadmap_steps WHERE role_id = uxui_role_id AND order_number = 4;
  SELECT id INTO step5_id FROM public.roadmap_steps WHERE role_id = uxui_role_id AND order_number = 5;
  SELECT id INTO step6_id FROM public.roadmap_steps WHERE role_id = uxui_role_id AND order_number = 6;
  SELECT id INTO step7_id FROM public.roadmap_steps WHERE role_id = uxui_role_id AND order_number = 7;
  SELECT id INTO step8_id FROM public.roadmap_steps WHERE role_id = uxui_role_id AND order_number = 8;
  SELECT id INTO step9_id FROM public.roadmap_steps WHERE role_id = uxui_role_id AND order_number = 9;

  -- Step 1: Fundamenty UX (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step1_id, 1, 'Design Thinking i Human-Centered Design', 'Poznaj 5 etapów Design Thinking (Empathize, Define, Ideate, Prototype, Test). Przeanalizuj case study projektu HCD.', 6),
  (step1_id, 2, 'Psychologia poznawcza dla UX', 'Zrozum percepcję, obciążenie poznawcze, prawa Gestalt. Naucz się jak ludzie przetwarzają informacje wizualne.', 5),
  (step1_id, 3, 'Heurystyki Nielsena', 'Opanuj 10 heurystyk użyteczności. Przeprowadź ewaluację heurystyczną istniejącej aplikacji.', 4),
  (step1_id, 4, 'Dostępność (WCAG)', 'Poznaj wytyczne WCAG 2.1. Naucz się projektować dla osób z niepełnosprawnościami. Przetestuj stronę pod kątem a11y.', 5);

  -- Step 2: Research UX (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step2_id, 1, 'Wywiady z użytkownikami', 'Naucz się prowadzić wywiady pogłębione. Przygotuj scenariusz, przeprowadź 3 wywiady, przeanalizuj wyniki.', 8),
  (step2_id, 2, 'Persony i user journeys', 'Stwórz 2-3 persony na podstawie researchu. Zmapuj user journey dla głównego flow aplikacji.', 6),
  (step2_id, 3, 'Jobs-to-be-done', 'Poznaj framework JTBD. Zdefiniuj jobs dla swojego projektu. Zrozum motywacje użytkowników.', 4),
  (step2_id, 4, 'Analiza konkurencji', 'Przeprowadź analizę 3-5 konkurentów. Zidentyfikuj best practices i luki rynkowe.', 5);

  -- Step 3: Architektura informacji (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step3_id, 1, 'Information Architecture', 'Poznaj zasady IA. Stwórz card sorting, tree testing. Zaprojektuj strukturę nawigacji.', 6),
  (step3_id, 2, 'User flows i task flows', 'Naucz się różnicy między user flow a task flow. Stwórz diagramy dla kluczowych scenariuszy.', 5),
  (step3_id, 3, 'Wireframy low-fidelity', 'Szkicuj wireframy na papierze i w narzędziu. Stwórz wireframy dla 5 kluczowych ekranów.', 6);

  -- Step 4: UI Design (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step4_id, 1, 'Typografia i kolor', 'Poznaj zasady doboru fontów, hierarchii typograficznej. Opanuj teorię koloru i tworzenie palet.', 6),
  (step4_id, 2, 'Spacing, layout i gridy', 'Naucz się systemów spacingowych (8pt grid). Opanuj layouty responsywne i gridy w Figmie.', 5),
  (step4_id, 3, 'Design System basics', 'Stwórz podstawowy design system: tokeny, komponenty bazowe, dokumentację. Użyj Figma Variables.', 8),
  (step4_id, 4, 'Figma zaawansowane', 'Opanuj Auto Layout, Components, Variants, Interactive Components. Stwórz bibliotekę komponentów.', 6);

  -- Step 5: Prototypowanie i testy (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step5_id, 1, 'Prototypy high-fidelity', 'Stwórz klikalny prototyp w Figmie. Dodaj interakcje, animacje, realistic content.', 8),
  (step5_id, 2, 'Testy użyteczności moderowane', 'Przygotuj scenariusz testu. Przeprowadź 5 testów moderowanych. Nagraj i przeanalizuj.', 10),
  (step5_id, 3, 'Testy niemoderowane', 'Poznaj narzędzia jak Maze, UserTesting. Przeprowadź test niemoderowany, przeanalizuj metryki.', 5),
  (step5_id, 4, 'Iteracja projektu', 'Na podstawie wyników testów wprowadź poprawki. Dokumentuj decyzje projektowe.', 4);

  -- Step 6: Współpraca z devami (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step6_id, 1, 'Podstawy HTML/CSS', 'Poznaj strukturę HTML, podstawy CSS. Zrozum jak działają flexbox, grid, responsywność.', 8),
  (step6_id, 2, 'Handoff design-dev', 'Naucz się przygotowywać projekty do wdrożenia. Poznaj Figma Dev Mode, specyfikacje, eksport assets.', 5),
  (step6_id, 3, 'Dokumentacja projektowa', 'Stwórz dokumentację komponentów, stanów, edge cases. Naucz się pisać design specs.', 4);

  -- Step 7: AI w UX Design (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step7_id, 1, 'AI do ideacji', 'Używaj ChatGPT/Claude do brainstormingu, generowania microcopy, wariantów UI. Poznaj prompt engineering.', 5),
  (step7_id, 2, 'AI do researchu', 'Wykorzystaj AI do analizy transkryptów wywiadów, syntezy insightów, generowania person.', 4),
  (step7_id, 3, 'AI tools w Figmie', 'Poznaj pluginy AI: Magician, Diagram, AI-powered design tools. Zoptymalizuj swój workflow.', 4);

  -- Step 8: Portfolio i kariera (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step8_id, 1, 'Case study end-to-end', 'Stwórz 2-3 kompletne case studies. Pokaż proces od researchu do wdrożenia.', 12),
  (step8_id, 2, 'Storytelling projektowy', 'Naucz się prezentować decyzje projektowe. Przygotuj prezentację case study w 10 minut.', 5),
  (step8_id, 3, 'Portfolio online', 'Zbuduj portfolio na Behance, Dribbble lub własnej stronie. Zadbaj o SEO i responsywność.', 6),
  (step8_id, 4, 'Rozmowy rekrutacyjne', 'Przygotuj się do rozmów: design challenge, pytania behawioralne, prezentacja portfolio.', 4);

  -- Step 9: Praca z AI w designie (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step9_id, 1, 'Prompt engineering dla UX', 'Naucz się pisać prompty pod design: kontekst użytkownika, wymagania, format odpowiedzi. Generuj microcopy, warianty UI i opisy flow.', 5),
  (step9_id, 2, 'Praca z Cursor i pluginy AI w Figmie', 'Zainstaluj Cursor do prototypów w kodzie (HTML/CSS). Opanuj pluginy AI w Figmie (Magician, Diagram) do generowania komponentów i wariantów.', 5),
  (step9_id, 3, 'Claude/ChatGPT do microcopy i flow', 'Używaj Claude lub ChatGPT do generowania copy, user stories, acceptance criteria i opisu user flow. Integruj AI w codzienny workflow projektowy.', 4);

  RAISE NOTICE 'Successfully inserted tasks for UX/UI Designer steps';
END $$;

-- ============================================================================
-- SECTION 8: BACKEND DEVELOPER ROADMAP
-- ============================================================================

DO $$
DECLARE
  backend_role_id integer;
BEGIN
  SELECT id INTO backend_role_id FROM public.roles WHERE name = 'Backend Developer';
  
  INSERT INTO public.roadmap_steps (role_id, order_number, title, description) VALUES
  (backend_role_id, 1, 'Podstawy programowania', 'Wybierz język (Python, Node.js lub Java). Opanuj zmienne, typy danych, pętle, funkcje, struktury danych. Zrozum paradygmat obiektowy (klasy, dziedziczenie). To fundament każdego backendu.'),
  (backend_role_id, 2, 'Bazy danych SQL', 'Poznaj relacyjne bazy danych (PostgreSQL/MySQL). Opanuj SQL: SELECT, JOIN, agregacje, indeksy. Naucz się projektować schematy, normalizację i relacje między tabelami.'),
  (backend_role_id, 3, 'API REST i HTTP', 'Zrozum protokół HTTP, metody, statusy, nagłówki. Poznaj architekturę REST. Zbuduj pierwsze API z endpointami CRUD używając frameworka (Express/FastAPI/Spring).'),
  (backend_role_id, 4, 'Git i kontrola wersji', 'Opanuj Git: commit, branch, merge, rebase. Naucz się pracy z GitHub/GitLab: pull requests, code review. Git to podstawa współpracy w zespole.'),
  (backend_role_id, 5, 'Autentykacja i bezpieczeństwo', 'Implementuj autentykację (JWT, OAuth2, sessions). Poznaj podstawy bezpieczeństwa: SQL injection, XSS, CORS, HTTPS. Zabezpiecz swoje API.'),
  (backend_role_id, 6, 'ORM i wzorce projektowe', 'Poznaj ORM (Prisma/SQLAlchemy/Hibernate). Opanuj wzorce: Repository, MVC, Dependency Injection. Pisz czysty, testowalny kod.'),
  (backend_role_id, 7, 'Testowanie', 'Naucz się testować backend: testy jednostkowe, integracyjne, E2E. Poznaj mocking, fixtures, TDD. Testy to pewność, że Twój kod działa.'),
  (backend_role_id, 8, 'Portfolio i deployment', 'Zbuduj 2-3 projekty backendowe. Wdróż je (Railway, Render, AWS). Przygotuj CV i GitHub showcasing Twoje umiejętności.'),
  (backend_role_id, 9, 'Praca z AI', 'Opanuj pracę z AI w backendzie: prompt engineering dla API i kodu, Cursor i GitHub Copilot do pisania i refaktoryzacji, AI do debugowania i code review. AI nie zastąpi programisty, ale znacząco przyspieszy development i jakość kodu.');
END $$;

-- ============================================================================
-- SECTION 9: BACKEND DEVELOPER TASKS
-- ============================================================================

DO $$
DECLARE
  step1_id integer;
  step2_id integer;
  step3_id integer;
  step4_id integer;
  step5_id integer;
  step6_id integer;
  step7_id integer;
  step8_id integer;
  step9_id integer;
  backend_role_id integer;
BEGIN
  SELECT id INTO backend_role_id FROM public.roles WHERE name = 'Backend Developer';
  
  SELECT id INTO step1_id FROM public.roadmap_steps WHERE role_id = backend_role_id AND order_number = 1;
  SELECT id INTO step2_id FROM public.roadmap_steps WHERE role_id = backend_role_id AND order_number = 2;
  SELECT id INTO step3_id FROM public.roadmap_steps WHERE role_id = backend_role_id AND order_number = 3;
  SELECT id INTO step4_id FROM public.roadmap_steps WHERE role_id = backend_role_id AND order_number = 4;
  SELECT id INTO step5_id FROM public.roadmap_steps WHERE role_id = backend_role_id AND order_number = 5;
  SELECT id INTO step6_id FROM public.roadmap_steps WHERE role_id = backend_role_id AND order_number = 6;
  SELECT id INTO step7_id FROM public.roadmap_steps WHERE role_id = backend_role_id AND order_number = 7;
  SELECT id INTO step8_id FROM public.roadmap_steps WHERE role_id = backend_role_id AND order_number = 8;
  SELECT id INTO step9_id FROM public.roadmap_steps WHERE role_id = backend_role_id AND order_number = 9;

  -- Step 1: Podstawy programowania (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step1_id, 1, 'Zmienne, typy i operatory', 'Poznaj typy danych w wybranym języku. Ćwicz operacje na stringach, liczbach, tablicach.', 6),
  (step1_id, 2, 'Funkcje i pętle', 'Opanuj definiowanie funkcji, parametry, return. Naucz się pętli for, while. Rozwiąż 10 zadań algorytmicznych.', 8),
  (step1_id, 3, 'Struktury danych', 'Poznaj listy, słowniki/mapy, zbiory. Zrozum kiedy której użyć. Zaimplementuj prosty projekt.', 6),
  (step1_id, 4, 'Programowanie obiektowe', 'Naucz się klas, obiektów, dziedziczenia, enkapsulacji. Stwórz hierarchię klas dla prostego systemu.', 8);

  -- Step 2: Bazy danych SQL (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step2_id, 1, 'Podstawy SQL', 'Zainstaluj PostgreSQL. Naucz się SELECT, WHERE, ORDER BY, LIMIT. Przećwicz na przykładowej bazie.', 6),
  (step2_id, 2, 'JOIN i agregacje', 'Opanuj INNER/LEFT/RIGHT JOIN. Poznaj GROUP BY, COUNT, SUM, AVG. Napisz 10 złożonych zapytań.', 6),
  (step2_id, 3, 'Projektowanie schematów', 'Naucz się normalizacji (1NF-3NF). Zaprojektuj schemat dla aplikacji e-commerce. Stwórz diagram ERD.', 5),
  (step2_id, 4, 'Indeksy i wydajność', 'Poznaj indeksy, EXPLAIN ANALYZE. Zoptymalizuj wolne zapytania. Zrozum trade-offy indeksowania.', 4);

  -- Step 3: API REST i HTTP (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step3_id, 1, 'Protokół HTTP', 'Zrozum metody (GET, POST, PUT, DELETE), statusy (2xx, 4xx, 5xx), nagłówki. Użyj Postman/Insomnia.', 4),
  (step3_id, 2, 'Framework webowy', 'Wybierz framework (Express/FastAPI/Spring). Stwórz pierwszy serwer, routing, middleware.', 6),
  (step3_id, 3, 'CRUD API', 'Zbuduj kompletne API dla zasobu (np. users). Implementuj Create, Read, Update, Delete.', 8),
  (step3_id, 4, 'Walidacja i obsługa błędów', 'Dodaj walidację danych wejściowych. Implementuj spójną obsługę błędów i kody statusów.', 4);

  -- Step 4: Git i kontrola wersji (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step4_id, 1, 'Podstawy Git', 'Opanuj git init, add, commit, log, diff. Stwórz repozytorium dla swojego projektu.', 4),
  (step4_id, 2, 'Branching i merging', 'Naucz się git branch, checkout, merge. Zrozum Git Flow. Rozwiąż konflikt merge.', 5),
  (step4_id, 3, 'GitHub i współpraca', 'Opublikuj projekt na GitHub. Stwórz Pull Request, przeprowadź code review. Poznaj Issues i Projects.', 4);

  -- Step 5: Autentykacja i bezpieczeństwo (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step5_id, 1, 'JWT autentykacja', 'Zaimplementuj logowanie z JWT. Poznaj access i refresh tokens. Zabezpiecz endpointy.', 8),
  (step5_id, 2, 'OAuth2 i social login', 'Dodaj logowanie przez Google/GitHub. Zrozum flow OAuth2: authorization code grant.', 6),
  (step5_id, 3, 'Bezpieczeństwo API', 'Poznaj SQL injection, XSS, CSRF. Implementuj ochronę: parametryzowane zapytania, sanityzacja.', 5),
  (step5_id, 4, 'HTTPS i CORS', 'Skonfiguruj CORS dla swojego API. Zrozum certyfikaty SSL. Wdróż HTTPS.', 3);

  -- Step 6: ORM i wzorce (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step6_id, 1, 'ORM basics', 'Zainstaluj ORM (Prisma/SQLAlchemy). Zdefiniuj modele, relacje. Wykonaj migracje.', 6),
  (step6_id, 2, 'Wzorzec Repository', 'Oddziel logikę dostępu do danych. Stwórz warstwę repository dla swojego projektu.', 5),
  (step6_id, 3, 'Dependency Injection', 'Poznaj DI i IoC. Zrefaktoruj kod aby był testowalny. Użyj kontenera DI.', 5);

  -- Step 7: Testowanie (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step7_id, 1, 'Testy jednostkowe', 'Skonfiguruj framework testowy. Napisz testy dla funkcji pomocniczych i serwisów.', 6),
  (step7_id, 2, 'Testy integracyjne API', 'Testuj endpointy API. Użyj test database. Mockuj zewnętrzne serwisy.', 6),
  (step7_id, 3, 'TDD w praktyce', 'Zaimplementuj nową funkcjonalność używając TDD: test first, then code, then refactor.', 5);

  -- Step 8: Portfolio i deployment (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step8_id, 1, 'Projekty portfolio', 'Zbuduj 2-3 projekty: REST API, aplikacja z autentykacją, integracja z zewnętrznym API.', 15),
  (step8_id, 2, 'Deployment', 'Wdróż projekty na Railway/Render/AWS. Skonfiguruj zmienne środowiskowe, bazy produkcyjne.', 6),
  (step8_id, 3, 'CV i GitHub', 'Przygotuj CV backendowca. Dopracuj GitHub: README, dokumentacja API, czysta historia commitów.', 4);

  -- Step 9: Praca z AI (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step9_id, 1, 'Prompt engineering dla API i kodu', 'Naucz się pisać prompty pod backend: kontekst projektu, specyfikacja endpointów, wzorce. Generuj kod API, testy i dokumentację.', 5),
  (step9_id, 2, 'Praca z Cursor i GitHub Copilot', 'Zainstaluj Cursor lub GitHub Copilot. Opanuj AI autocomplete, generowanie funkcji i refaktoryzację. Przyspiesz pisanie serwisów i testów.', 5),
  (step9_id, 3, 'AI do debugowania i code review', 'Używaj ChatGPT/Claude do analizy błędów, wyjaśnień stack trace i sugestii poprawy. Wykorzystaj AI do code review i optymalizacji zapytań.', 4);

  RAISE NOTICE 'Successfully inserted tasks for Backend Developer steps';
END $$;

-- ============================================================================
-- SECTION 10: DEVOPS ENGINEER ROADMAP
-- ============================================================================

DO $$
DECLARE
  devops_role_id integer;
BEGIN
  SELECT id INTO devops_role_id FROM public.roles WHERE name = 'DevOps Engineer';
  
  INSERT INTO public.roadmap_steps (role_id, order_number, title, description) VALUES
  (devops_role_id, 1, 'Linux i linia poleceń', 'Opanuj podstawy Linuxa: nawigacja, uprawnienia, procesy, pakiety. Naucz się Bash scripting. Linux to fundament DevOps - większość serwerów to Linux.'),
  (devops_role_id, 2, 'Git i kontrola wersji', 'Poznaj Git na poziomie zaawansowanym: rebase, cherry-pick, hooks. Zrozum strategie branchowania (GitFlow, trunk-based). Zarządzaj repozytoriami.'),
  (devops_role_id, 3, 'Konteneryzacja z Docker', 'Naucz się Docker: obrazy, kontenery, Dockerfile, docker-compose. Konteneryzuj aplikację. Docker to standard pakowania aplikacji w DevOps.'),
  (devops_role_id, 4, 'CI/CD Pipelines', 'Zbuduj pipeline CI/CD (GitHub Actions/GitLab CI/Jenkins). Automatyzuj: build, test, lint, deploy. CI/CD to serce DevOps.'),
  (devops_role_id, 5, 'Chmura (AWS/Azure/GCP)', 'Poznaj podstawy wybranej chmury: compute, storage, networking, IAM. Wdróż aplikację w chmurze. Zrozum model odpowiedzialności.'),
  (devops_role_id, 6, 'Infrastructure as Code', 'Opanuj Terraform lub Pulumi. Definiuj infrastrukturę jako kod. Zarządzaj stanem, modułami. IaC to reproducibility i version control dla infry.'),
  (devops_role_id, 7, 'Monitoring i observability', 'Skonfiguruj monitoring (Prometheus, Grafana) i logging (ELK/Loki). Ustaw alerty. Zrozum metryki, logi, traces.'),
  (devops_role_id, 8, 'Portfolio i certyfikacje', 'Zbuduj projekty DevOps, udokumentuj na GitHub. Rozważ certyfikację (AWS SAA, CKA). Przygotuj się do rozmów.'),
  (devops_role_id, 9, 'Praca z AI w DevOps', 'Opanuj AI w DevOps: prompt engineering dla infrastruktury i skryptów, Cursor i AI w terminalu, AI do analizy logów, dokumentacji i automatyzacji. AI nie zastąpi inżyniera, ale znacząco przyspieszy codzienne zadania.');
END $$;

-- ============================================================================
-- SECTION 11: DEVOPS ENGINEER TASKS
-- ============================================================================

DO $$
DECLARE
  step1_id integer;
  step2_id integer;
  step3_id integer;
  step4_id integer;
  step5_id integer;
  step6_id integer;
  step7_id integer;
  step8_id integer;
  step9_id integer;
  devops_role_id integer;
BEGIN
  SELECT id INTO devops_role_id FROM public.roles WHERE name = 'DevOps Engineer';
  
  SELECT id INTO step1_id FROM public.roadmap_steps WHERE role_id = devops_role_id AND order_number = 1;
  SELECT id INTO step2_id FROM public.roadmap_steps WHERE role_id = devops_role_id AND order_number = 2;
  SELECT id INTO step3_id FROM public.roadmap_steps WHERE role_id = devops_role_id AND order_number = 3;
  SELECT id INTO step4_id FROM public.roadmap_steps WHERE role_id = devops_role_id AND order_number = 4;
  SELECT id INTO step5_id FROM public.roadmap_steps WHERE role_id = devops_role_id AND order_number = 5;
  SELECT id INTO step6_id FROM public.roadmap_steps WHERE role_id = devops_role_id AND order_number = 6;
  SELECT id INTO step7_id FROM public.roadmap_steps WHERE role_id = devops_role_id AND order_number = 7;
  SELECT id INTO step8_id FROM public.roadmap_steps WHERE role_id = devops_role_id AND order_number = 8;
  SELECT id INTO step9_id FROM public.roadmap_steps WHERE role_id = devops_role_id AND order_number = 9;

  -- Step 1: Linux (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step1_id, 1, 'Nawigacja i pliki', 'Opanuj cd, ls, cp, mv, rm, find, grep. Zrozum strukturę katalogów Linux. Pracuj na VM lub WSL.', 5),
  (step1_id, 2, 'Uprawnienia i użytkownicy', 'Poznaj chmod, chown, sudo. Zrozum model uprawnień rwx. Zarządzaj użytkownikami i grupami.', 4),
  (step1_id, 3, 'Procesy i pakiety', 'Naucz się ps, top, kill, systemctl. Zarządzaj pakietami (apt/yum). Konfiguruj serwisy.', 5),
  (step1_id, 4, 'Bash scripting', 'Pisz skrypty Bash: zmienne, pętle, warunki, funkcje. Zautomatyzuj rutynowe zadania.', 6);

  -- Step 2: Git zaawansowany (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step2_id, 1, 'Rebase i historia', 'Opanuj git rebase, interactive rebase, cherry-pick. Naucz się utrzymywać czystą historię.', 5),
  (step2_id, 2, 'Git hooks', 'Skonfiguruj pre-commit, pre-push hooks. Automatyzuj linting i testy przed commitem.', 3),
  (step2_id, 3, 'Strategie branchowania', 'Poznaj GitFlow, GitHub Flow, trunk-based development. Wybierz strategię dla projektu.', 3);

  -- Step 3: Docker (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step3_id, 1, 'Podstawy Docker', 'Zainstaluj Docker. Poznaj docker run, pull, images, containers. Uruchom pierwszy kontener.', 4),
  (step3_id, 2, 'Dockerfile', 'Naucz się pisać Dockerfile: FROM, RUN, COPY, CMD, ENTRYPOINT. Zbuduj obraz swojej aplikacji.', 5),
  (step3_id, 3, 'Docker Compose', 'Opanuj docker-compose.yml. Orkiestruj wielokontenerową aplikację (app + db + cache).', 5),
  (step3_id, 4, 'Best practices', 'Poznaj multi-stage builds, .dockerignore, security scanning. Zoptymalizuj rozmiar obrazu.', 4);

  -- Step 4: CI/CD (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step4_id, 1, 'GitHub Actions basics', 'Stwórz pierwszy workflow. Poznaj triggers, jobs, steps, actions. Uruchom testy automatycznie.', 5),
  (step4_id, 2, 'Build i test pipeline', 'Zbuduj pipeline: checkout -> install -> lint -> test -> build. Użyj cache dla dependencies.', 5),
  (step4_id, 3, 'Deployment automation', 'Dodaj deployment do pipeline. Wdrażaj na staging/production. Użyj secrets dla credentials.', 6),
  (step4_id, 4, 'Pipeline best practices', 'Poznaj matrix builds, conditional jobs, artifacts. Zoptymalizuj czas wykonania pipeline.', 4);

  -- Step 5: Cloud (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step5_id, 1, 'Podstawy AWS/Azure/GCP', 'Załóż konto free tier. Poznaj konsolę, regiony, podstawowe serwisy. Zrozum billing.', 4),
  (step5_id, 2, 'Compute i networking', 'Uruchom VM (EC2/VM/Compute Engine). Skonfiguruj VPC, subnets, security groups.', 6),
  (step5_id, 3, 'Storage i bazy', 'Poznaj object storage (S3), managed databases (RDS). Skonfiguruj backup i replikację.', 5),
  (step5_id, 4, 'IAM i bezpieczeństwo', 'Skonfiguruj IAM: users, roles, policies. Zrozum principle of least privilege.', 4);

  -- Step 6: IaC (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step6_id, 1, 'Terraform basics', 'Zainstaluj Terraform. Poznaj providers, resources, state. Stwórz pierwszą infrastrukturę.', 6),
  (step6_id, 2, 'Moduły i zmienne', 'Organizuj kod w moduły. Używaj zmiennych i outputs. DRY w infrastrukturze.', 5),
  (step6_id, 3, 'State management', 'Skonfiguruj remote state (S3 + DynamoDB). Poznaj state locking i workspaces.', 4);

  -- Step 7: Monitoring (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step7_id, 1, 'Prometheus i Grafana', 'Zainstaluj Prometheus. Zbieraj metryki aplikacji. Stwórz dashboard w Grafanie.', 6),
  (step7_id, 2, 'Logging', 'Skonfiguruj centralne logowanie (ELK/Loki). Parsuj logi, twórz filtry i alerty.', 5),
  (step7_id, 3, 'Alerting', 'Ustaw alerty dla krytycznych metryk. Skonfiguruj notyfikacje (Slack, email, PagerDuty).', 4);

  -- Step 8: Portfolio i certyfikacje (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step8_id, 1, 'Projekty DevOps', 'Zbuduj kompletny projekt: IaC + CI/CD + monitoring. Udokumentuj na GitHub z README.', 15),
  (step8_id, 2, 'Certyfikacja', 'Przygotuj się do AWS SAA lub CKA. Przerabiaj materiały, rozwiązuj practice exams.', 20),
  (step8_id, 3, 'CV i rozmowy', 'Przygotuj CV DevOps. Poznaj typowe pytania rekrutacyjne. Przećwicz whiteboard scenarios.', 5);

  -- Step 9: Praca z AI w DevOps (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step9_id, 1, 'Prompt engineering dla infrastruktury i skryptów', 'Naucz się pisać prompty pod DevOps: Terraform, Dockerfile, skrypty Bash/YAML. Generuj konfiguracje, dokumentację i playbooki.', 5),
  (step9_id, 2, 'Praca z Cursor i AI w terminalu', 'Zainstaluj Cursor. Opanuj AI do pisania skryptów, pipeline YAML i komend. Używaj AI do analizy logów i troubleshootingu.', 5),
  (step9_id, 3, 'AI do analizy logów i dokumentacji', 'Wykorzystaj ChatGPT/Claude do analizy stack trace, logów błędów i dokumentacji. Generuj runbooki i opisy incydentów.', 4);

  RAISE NOTICE 'Successfully inserted tasks for DevOps Engineer steps';
END $$;

-- ============================================================================
-- SECTION 12: DATA ANALYST ROADMAP
-- ============================================================================

DO $$
DECLARE
  data_role_id integer;
BEGIN
  SELECT id INTO data_role_id FROM public.roles WHERE name = 'Data Analyst';
  
  INSERT INTO public.roadmap_steps (role_id, order_number, title, description) VALUES
  (data_role_id, 1, 'Excel i arkusze kalkulacyjne', 'Opanuj Excel na poziomie zaawansowanym: formuły, tabele przestawne, VLOOKUP/XLOOKUP, wykresy. Excel to wciąż podstawowe narzędzie analityka w wielu firmach.'),
  (data_role_id, 2, 'SQL - fundament analizy danych', 'Naucz się SQL: SELECT, JOIN, agregacje, podzapytania, window functions. SQL to język każdego analityka - dane są w bazach.'),
  (data_role_id, 3, 'Python dla analizy danych', 'Poznaj Python z pandas, numpy, matplotlib. Naucz się wczytywać, czyścić i analizować dane. Python to game-changer w analizie.'),
  (data_role_id, 4, 'Wizualizacja danych', 'Opanuj narzędzia BI: Tableau, Power BI lub Metabase. Twórz interaktywne dashboardy. Naucz się data storytelling.'),
  (data_role_id, 5, 'Statystyka i analiza', 'Poznaj podstawy statystyki: rozkłady, testy hipotez, korelacje, regresja. Statystyka to fundament świadomej analizy.'),
  (data_role_id, 6, 'ETL i data pipelines', 'Naucz się procesować dane: ekstrakcja, transformacja, ładowanie. Poznaj podstawy data engineering i automatyzacji.'),
  (data_role_id, 7, 'Business Intelligence', 'Zrozum metryki biznesowe, KPI, reporting. Naucz się komunikować wyniki do stakeholderów. Łącz dane z biznesem.'),
  (data_role_id, 8, 'Portfolio i kariera', 'Zbuduj portfolio projektów analitycznych. Opublikuj na GitHub/Kaggle. Przygotuj CV i profil LinkedIn.'),
  (data_role_id, 9, 'Praca z AI w analizie danych', 'Opanuj AI w analizie: prompt engineering dla danych i raportów, ChatGPT/Copilot do eksploracji i SQL, narzędzia AI do wizualizacji i data storytelling. AI nie zastąpi analityka, ale znacząco przyspieszy pracę z danymi.');
END $$;

-- ============================================================================
-- SECTION 13: DATA ANALYST TASKS
-- ============================================================================

DO $$
DECLARE
  step1_id integer;
  step2_id integer;
  step3_id integer;
  step4_id integer;
  step5_id integer;
  step6_id integer;
  step7_id integer;
  step8_id integer;
  step9_id integer;
  data_role_id integer;
BEGIN
  SELECT id INTO data_role_id FROM public.roles WHERE name = 'Data Analyst';
  
  SELECT id INTO step1_id FROM public.roadmap_steps WHERE role_id = data_role_id AND order_number = 1;
  SELECT id INTO step2_id FROM public.roadmap_steps WHERE role_id = data_role_id AND order_number = 2;
  SELECT id INTO step3_id FROM public.roadmap_steps WHERE role_id = data_role_id AND order_number = 3;
  SELECT id INTO step4_id FROM public.roadmap_steps WHERE role_id = data_role_id AND order_number = 4;
  SELECT id INTO step5_id FROM public.roadmap_steps WHERE role_id = data_role_id AND order_number = 5;
  SELECT id INTO step6_id FROM public.roadmap_steps WHERE role_id = data_role_id AND order_number = 6;
  SELECT id INTO step7_id FROM public.roadmap_steps WHERE role_id = data_role_id AND order_number = 7;
  SELECT id INTO step8_id FROM public.roadmap_steps WHERE role_id = data_role_id AND order_number = 8;
  SELECT id INTO step9_id FROM public.roadmap_steps WHERE role_id = data_role_id AND order_number = 9;

  -- Step 1: Excel (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step1_id, 1, 'Formuły zaawansowane', 'Opanuj IF, SUMIF, COUNTIF, VLOOKUP, XLOOKUP, INDEX/MATCH. Rozwiąż 10 praktycznych zadań.', 6),
  (step1_id, 2, 'Tabele przestawne', 'Naucz się tworzyć pivot tables, grupować dane, filtrować. Stwórz raport z analizą sprzedaży.', 5),
  (step1_id, 3, 'Wykresy i wizualizacja', 'Poznaj typy wykresów, formatowanie, best practices. Stwórz dashboard w Excelu.', 4),
  (step1_id, 4, 'Power Query', 'Naucz się importować i transformować dane. Automatyzuj przygotowanie danych.', 5);

  -- Step 2: SQL (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step2_id, 1, 'SELECT i filtrowanie', 'Opanuj SELECT, WHERE, ORDER BY, DISTINCT, LIMIT. Przećwicz na przykładowej bazie.', 5),
  (step2_id, 2, 'JOIN i relacje', 'Naucz się INNER, LEFT, RIGHT, FULL JOIN. Łącz dane z wielu tabel. Rozwiąż 15 zadań.', 6),
  (step2_id, 3, 'Agregacje i grupowanie', 'Opanuj GROUP BY, HAVING, COUNT, SUM, AVG, MIN, MAX. Twórz raporty agregujące.', 5),
  (step2_id, 4, 'Window functions', 'Poznaj ROW_NUMBER, RANK, LAG, LEAD, running totals. Zaawansowane analizy w SQL.', 6);

  -- Step 3: Python (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step3_id, 1, 'Podstawy Python', 'Zainstaluj Python i Jupyter. Poznaj zmienne, pętle, funkcje. Zrozum podstawową składnię.', 6),
  (step3_id, 2, 'Pandas - wczytywanie danych', 'Naucz się pd.read_csv, read_excel. Poznaj DataFrame, Series. Eksploruj dane z .head(), .info(), .describe().', 5),
  (step3_id, 3, 'Pandas - transformacje', 'Opanuj filtering, groupby, merge, pivot. Czyść dane: dropna, fillna, astype.', 8),
  (step3_id, 4, 'Matplotlib i wizualizacja', 'Twórz wykresy: line, bar, scatter, histogram. Poznaj też seaborn dla statystycznych wizualizacji.', 5);

  -- Step 4: BI Tools (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step4_id, 1, 'Podstawy Tableau/Power BI', 'Zainstaluj narzędzie. Połącz z danymi. Poznaj interfejs, dimensions, measures.', 5),
  (step4_id, 2, 'Dashboardy interaktywne', 'Stwórz dashboard z filtrami, drill-down, interaktywnymi wykresami. Opublikuj online.', 8),
  (step4_id, 3, 'Data storytelling', 'Naucz się opowiadać historię danymi. Projektuj dashboardy dla odbiorcy. Prezentuj insights.', 5);

  -- Step 5: Statystyka (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step5_id, 1, 'Statystyka opisowa', 'Poznaj średnią, medianę, odchylenie standardowe, kwartyle. Opisz rozkład danych.', 5),
  (step5_id, 2, 'Rozkłady prawdopodobieństwa', 'Zrozum rozkład normalny, binomialny. Naucz się je rozpoznawać i interpretować.', 4),
  (step5_id, 3, 'Testy hipotez', 'Poznaj p-value, t-test, chi-square. Przeprowadź test A/B na przykładowych danych.', 6),
  (step5_id, 4, 'Korelacja i regresja', 'Oblicz korelację, zbuduj prostą regresję liniową. Interpretuj wyniki.', 5);

  -- Step 6: ETL (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step6_id, 1, 'Ekstrakcja danych', 'Pobieraj dane z różnych źródeł: API, bazy, pliki. Użyj Python requests, SQLAlchemy.', 5),
  (step6_id, 2, 'Transformacja', 'Czyść, normalizuj, agreguj dane. Twórz pipeline transformacji w Pandas.', 6),
  (step6_id, 3, 'Automatyzacja', 'Zautomatyzuj proces ETL. Użyj cron/scheduler. Zapisuj wyniki do bazy/pliku.', 5);

  -- Step 7: Business Intelligence (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step7_id, 1, 'Metryki biznesowe', 'Poznaj KPI: revenue, churn, CAC, LTV, conversion rate. Zrozum co mierzą i dlaczego.', 4),
  (step7_id, 2, 'Reporting', 'Stwórz regularny raport biznesowy. Zautomatyzuj generowanie. Dostosuj do odbiorcy.', 6),
  (step7_id, 3, 'Komunikacja z biznesem', 'Naucz się prezentować wyniki. Pisz executive summary. Rekomenduj działania.', 4);

  -- Step 8: Portfolio (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step8_id, 1, 'Projekty analityczne', 'Zbuduj 3 projekty: analiza eksploracyjna, dashboard, raport z rekomendacjami.', 15),
  (step8_id, 2, 'GitHub i Kaggle', 'Opublikuj projekty na GitHub z README. Weź udział w konkursie Kaggle.', 6),
  (step8_id, 3, 'CV i LinkedIn', 'Przygotuj CV analityka. Zaktualizuj LinkedIn z projektami. Napisz o swoich umiejętnościach.', 4);

  -- Step 9: Praca z AI w analizie danych (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step9_id, 1, 'Prompt engineering dla danych i raportów', 'Naucz się pisać prompty pod analizę: kontekst biznesowy, wymagania raportu, format wyników. Generuj opisy, wnioski i rekomendacje.', 5),
  (step9_id, 2, 'ChatGPT/Copilot do eksploracji i SQL', 'Używaj AI do generowania zapytań SQL, eksploracji danych i wyjaśnień metryk. Opanuj Copilot w Excelu/Notebookach do szybszej analizy.', 5),
  (step9_id, 3, 'Narzędzia AI do wizualizacji i storytellingu', 'Wykorzystaj AI do sugestii wykresów, opisu insightów i data storytelling. Integruj AI w codzienny workflow raportowania.', 4);

  RAISE NOTICE 'Successfully inserted tasks for Data Analyst steps';
END $$;

-- ============================================================================
-- SECTION 14: PROJECT MANAGER ROADMAP
-- ============================================================================

DO $$
DECLARE
  pm_role_id integer;
BEGIN
  SELECT id INTO pm_role_id FROM public.roles WHERE name = 'Project Manager';
  
  INSERT INTO public.roadmap_steps (role_id, order_number, title, description) VALUES
  (pm_role_id, 1, 'Podstawy zarządzania projektami', 'Poznaj cykl życia projektu, trójkąt ograniczeń (scope, time, cost), role w projekcie IT. Zrozum różnicę między project managerem a product ownerem. To fundament profesji.'),
  (pm_role_id, 2, 'Metodyki Agile i Scrum', 'Opanuj framework Scrum: role (SM, PO, Dev Team), wydarzenia (Sprint, Daily, Review, Retro), artefakty. Poznaj Kanban jako alternatywę. Agile to standard w IT.'),
  (pm_role_id, 3, 'Planowanie i estymacja', 'Naucz się tworzyć WBS, estymować zadania (story points, t-shirt sizing), planować sprinty i release. Poznaj Planning Poker i techniki dekompozycji.'),
  (pm_role_id, 4, 'Narzędzia PM', 'Opanuj Jira, Trello lub Asana. Poznaj Confluence/Notion do dokumentacji. Twórz roadmapy i śledź metryki. Narzędzia to Twój warsztat pracy.'),
  (pm_role_id, 5, 'Komunikacja i stakeholder management', 'Rozwiń umiejętności prowadzenia spotkań, prezentacji i raportowania. Zarządzaj oczekiwaniami i buduj relacje ze stakeholderami.'),
  (pm_role_id, 6, 'Zarządzanie ryzykiem', 'Identyfikuj, oceniaj i mitiguj ryzyka. Prowadź rejestr ryzyk. Opanuj eskalację i rozwiązywanie konfliktów w zespole.'),
  (pm_role_id, 7, 'Metryki i continuous improvement', 'Poznaj velocity, burndown charts, lead time, cycle time. Prowadź retrospektywy i wdrażaj usprawnienia procesów.'),
  (pm_role_id, 8, 'Certyfikacje i kariera', 'Przygotuj się do PSM I lub PMI-ACP. Zbuduj portfolio projektów. Przygotuj CV i profil LinkedIn jako PM.'),
  (pm_role_id, 9, 'Praca z AI w zarządzaniu projektami', 'Opanuj AI w pracy PM: prompt engineering do raportów i stand-upów, AI do backlogu i planowania, narzędzia AI do komunikacji i dokumentacji. AI nie zastąpi project managera, ale znacząco przyspieszy administrację i reporting.');
END $$;

-- ============================================================================
-- SECTION 15: PROJECT MANAGER TASKS
-- ============================================================================

DO $$
DECLARE
  step1_id integer;
  step2_id integer;
  step3_id integer;
  step4_id integer;
  step5_id integer;
  step6_id integer;
  step7_id integer;
  step8_id integer;
  step9_id integer;
  pm_role_id integer;
BEGIN
  SELECT id INTO pm_role_id FROM public.roles WHERE name = 'Project Manager';
  
  SELECT id INTO step1_id FROM public.roadmap_steps WHERE role_id = pm_role_id AND order_number = 1;
  SELECT id INTO step2_id FROM public.roadmap_steps WHERE role_id = pm_role_id AND order_number = 2;
  SELECT id INTO step3_id FROM public.roadmap_steps WHERE role_id = pm_role_id AND order_number = 3;
  SELECT id INTO step4_id FROM public.roadmap_steps WHERE role_id = pm_role_id AND order_number = 4;
  SELECT id INTO step5_id FROM public.roadmap_steps WHERE role_id = pm_role_id AND order_number = 5;
  SELECT id INTO step6_id FROM public.roadmap_steps WHERE role_id = pm_role_id AND order_number = 6;
  SELECT id INTO step7_id FROM public.roadmap_steps WHERE role_id = pm_role_id AND order_number = 7;
  SELECT id INTO step8_id FROM public.roadmap_steps WHERE role_id = pm_role_id AND order_number = 8;
  SELECT id INTO step9_id FROM public.roadmap_steps WHERE role_id = pm_role_id AND order_number = 9;

  -- Step 1: Podstawy PM (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step1_id, 1, 'Cykl życia projektu', 'Poznaj fazy: inicjacja, planowanie, realizacja, monitorowanie, zamknięcie. Przeanalizuj case study projektu IT.', 4),
  (step1_id, 2, 'Trójkąt ograniczeń', 'Zrozum zależności między zakresem, czasem i kosztami. Symuluj scenariusze zmian w projekcie.', 3),
  (step1_id, 3, 'Role w projekcie IT', 'Poznaj odpowiedzialności PM, PO, SM, Dev Teamu, stakeholderów. Stwórz macierz RACI.', 4),
  (step1_id, 4, 'PM vs PO vs SM', 'Zrozum różnice między rolami. Kiedy potrzebujesz PM, kiedy SM, kiedy PO? Przeanalizuj scenariusze.', 3);

  -- Step 2: Agile i Scrum (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step2_id, 1, 'Framework Scrum', 'Poznaj role, wydarzenia, artefakty Scrum. Przeczytaj Scrum Guide. Zrozum empiryzm.', 5),
  (step2_id, 2, 'Sprint events', 'Naucz się prowadzić Planning, Daily, Review, Retrospective. Przećwicz facylitację.', 6),
  (step2_id, 3, 'Product Backlog', 'Naucz się pisać user stories, acceptance criteria. Poznaj INVEST. Priorytetyzuj backlog.', 5),
  (step2_id, 4, 'Kanban basics', 'Poznaj tablicę Kanban, WIP limits, flow metrics. Porównaj z Scrum. Kiedy co stosować?', 4);

  -- Step 3: Planowanie (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step3_id, 1, 'Work Breakdown Structure', 'Naucz się tworzyć WBS. Rozbij projekt na deliverables i work packages. Stwórz WBS dla przykładowego projektu.', 4),
  (step3_id, 2, 'Estymacja zadań', 'Poznaj story points, t-shirt sizing, Planning Poker. Przeprowadź sesję estymacji.', 4),
  (step3_id, 3, 'Sprint Planning', 'Naucz się planować sprint: capacity, commitment, sprint goal. Zaplanuj przykładowy sprint.', 4),
  (step3_id, 4, 'Release planning', 'Twórz roadmapę produktu. Planuj release z uwzględnieniem dependencies i ryzyk.', 5);

  -- Step 4: Narzędzia PM (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step4_id, 1, 'Jira/Trello/Asana', 'Wybierz narzędzie. Stwórz projekt, backlog, sprint board. Skonfiguruj workflow.', 6),
  (step4_id, 2, 'Dokumentacja', 'Poznaj Confluence/Notion. Stwórz przestrzeń projektu, szablony dokumentów, wiki.', 4),
  (step4_id, 3, 'Roadmapy i raportowanie', 'Twórz roadmapy produktu. Generuj raporty sprintów. Śledź velocity i burndown.', 5);

  -- Step 5: Komunikacja (4 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step5_id, 1, 'Prowadzenie spotkań', 'Naucz się facylitacji. Przygotowuj agendę, prowadź dyskusję, spisuj action items.', 4),
  (step5_id, 2, 'Prezentacje i demo', 'Przygotuj prezentację statusu projektu. Poprowadź Sprint Review z interesariuszami.', 4),
  (step5_id, 3, 'Stakeholder management', 'Zidentyfikuj stakeholderów. Stwórz plan komunikacji. Zarządzaj oczekiwaniami.', 5),
  (step5_id, 4, 'Komunikacja asynchroniczna', 'Pisz jasne emaile i wiadomości. Dokumentuj decyzje. Utrzymuj transparentność.', 3);

  -- Step 6: Zarządzanie ryzykiem (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step6_id, 1, 'Identyfikacja ryzyk', 'Przeprowadź sesję identyfikacji ryzyk. Użyj technik: brainstorming, SWOT, lessons learned.', 4),
  (step6_id, 2, 'Ocena i mitigacja', 'Oceń prawdopodobieństwo i wpływ. Stwórz rejestr ryzyk. Zaplanuj działania mitigujące.', 5),
  (step6_id, 3, 'Rozwiązywanie konfliktów', 'Poznaj techniki rozwiązywania konfliktów w zespole. Przećwicz eskalację problemów.', 4);

  -- Step 7: Metryki (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step7_id, 1, 'Velocity i burndown', 'Oblicz velocity zespołu. Stwórz burndown chart. Interpretuj trendy i anomalie.', 4),
  (step7_id, 2, 'Lead time i cycle time', 'Zmierz czas od pomysłu do wdrożenia. Zidentyfikuj wąskie gardła w procesie.', 4),
  (step7_id, 3, 'Retrospektywy', 'Naucz się prowadzić retro. Poznaj formaty: Start/Stop/Continue, 4Ls, Sailboat. Wdrażaj usprawnienia.', 5);

  -- Step 8: Certyfikacje i kariera (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step8_id, 1, 'Przygotowanie do PSM I', 'Przerabiaj materiały Scrum.org. Rozwiązuj practice exams. Zrozum Scrum Guide dogłębnie.', 15),
  (step8_id, 2, 'Portfolio PM', 'Udokumentuj projekty, które prowadziłeś. Opisz swoje role, decyzje, wyniki.', 6),
  (step8_id, 3, 'CV i LinkedIn PM', 'Przygotuj CV Project Managera. Zaktualizuj LinkedIn. Podkreśl umiejętności miękkie i twarde.', 4);

  -- Step 9: Praca z AI w zarządzaniu projektami (3 tasks)
  INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours) VALUES
  (step9_id, 1, 'Prompt engineering dla PM', 'Naucz się pisać prompty pod raporty, stand-upy i dokumentację: kontekst projektu, format, odbiorca. Generuj status updates i executive summary.', 5),
  (step9_id, 2, 'AI do raportów i stand-upów', 'Używaj ChatGPT/Claude do draftów raportów, podsumowań spotkań i action items. Automatyzuj powtarzalne treści bez gubienia kontekstu.', 5),
  (step9_id, 3, 'Narzędzia AI do backlogu i planowania', 'Poznaj AI w Jira/Notion do priorytetyzacji, rozbijania user stories i szacowania. Wykorzystaj AI do komunikacji z zespołem i stakeholderami.', 4);

  RAISE NOTICE 'Successfully inserted tasks for Project Manager steps';
END $$;

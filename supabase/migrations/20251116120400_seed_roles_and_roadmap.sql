-- ============================================================================
-- Migration: Seed Data - Roles and Roadmap Steps
-- Created: 2025-11-16 12:04:00 UTC
-- Description: Inserts initial data for IT roles and complete roadmap for Frontend Developer
--              - 5 IT roles (Frontend, Backend, DevOps, Data Analyst, UX/UI Designer)
--              - 10 roadmap steps for Frontend Developer role
--              - Step variants for each roadmap step (to be added in future migrations)
-- Tables Affected: roles, roadmap_steps
-- Notes: This seed data provides the foundation for MVP. Additional roles and steps
--        can be added via future migrations or admin panel
-- ============================================================================

-- ============================================================================
-- Seed Data: IT Roles
-- Description: 5 core IT roles for MVP with descriptions
-- ============================================================================

insert into public.roles (name, description) values
('Frontend Developer', 'Twórz interaktywne interfejsy użytkownika używając HTML, CSS, JavaScript i nowoczesnych frameworków jak React. Zajmij się tym, co użytkownicy widzą i z czym wchodzą w interakcję.'),
('Backend Developer', 'Buduj solidne API i logikę serwerową z użyciem Node.js, Python lub Java. Odpowiadaj za przetwarzanie danych, bezpieczeństwo i integracje z bazami danych.'),
('DevOps Engineer', 'Automatyzuj procesy CI/CD, zarządzaj infrastrukturą w chmurze (AWS, Azure, GCP) i monitoruj aplikacje. Łącz development z operations dla płynnych wdrożeń.'),
('Data Analyst', 'Analizuj dane, twórz raporty i wizualizacje, wspieraj decyzje biznesowe. Używaj SQL, Python, Excel i narzędzi BI jak Tableau lub Power BI.'),
('UX/UI Designer', 'Projektuj intuicyjne interfejsy i doświadczenia użytkownika z dbałością o estetykę. Twórz wireframes, prototypy i design systemy w Figma lub Adobe XD.');

-- ============================================================================
-- Seed Data: Roadmap Steps for Frontend Developer
-- Description: 10-step learning path from basics to portfolio deployment
-- ============================================================================

-- Note: Frontend Developer has id=1 based on insertion order above
-- If role IDs change in future, this section should be updated accordingly

insert into public.roadmap_steps (role_id, order_number, title, description) values
(1, 1, 'Podstawy HTML i CSS', 'Naucz się struktury dokumentów HTML oraz stylowania za pomocą CSS. Zrozum box model, flexbox i grid. Twórz responsywne layouty i poznaj podstawowe selektory CSS. To fundamenty każdego frontendu.'),
(1, 2, 'JavaScript - fundamenty', 'Opanuj podstawy JavaScript: zmienne, funkcje, pętle, obiekty i manipulację DOM. Naucz się obsługi zdarzeń (events) i asynchroniczności (callbacks). JS to serce interaktywności w przeglądarce.'),
(1, 3, 'Responsive Web Design', 'Poznaj media queries, mobile-first approach i tworzenie responsywnych layoutów. Naucz się optymalizować strony pod różne rozmiary ekranów. Twoja aplikacja musi działać na telefonie, tablecie i desktopie.'),
(1, 4, 'Git i kontrola wersji', 'Naucz się podstaw Git: commit, branch, merge, pull request. Załóż konto na GitHub i stwórz pierwsze repozytorium. Git to absolutna podstawa pracy w zespole i zarządzania kodem.'),
(1, 5, 'JavaScript ES6+', 'Poznaj nowoczesne funkcje JS: arrow functions, destructuring, spread operator, promises, async/await, modules. ES6+ to standard współczesnego JavaScript i podstawa frameworków jak React.'),
(1, 6, 'React - wprowadzenie', 'Zacznij pracę z React: komponenty funkcyjne, props, state, hooks (useState, useEffect). Zrozum virtual DOM i jednokierunkowy przepływ danych. React to najpopularniejszy framework frontendowy.'),
(1, 7, 'React - zaawansowane', 'Poznaj Context API, custom hooks, React Router dla nawigacji, zarządzanie stanem (Redux, Zustand lub Jotai). Naucz się optymalizacji wydajności i code splitting. Zbuduj kompletną aplikację SPA.'),
(1, 8, 'TypeScript', 'Dodaj statyczne typowanie do swoich projektów. Poznaj interfaces, types, generics, type guards. TypeScript eliminuje wiele błędów na etapie developmentu i ułatwia pracę w zespole.'),
(1, 9, 'Testing', 'Naucz się testować kod: Vitest dla testów jednostkowych, React Testing Library dla komponentów, podstawy testów integracyjnych. Testy to pewność, że Twój kod działa poprawnie.'),
(1, 10, 'Portfolio i deployment', 'Zbuduj portfolio z 3-5 projektami pokazującymi Twoje umiejętności. Wdroż aplikacje na Vercel lub Netlify. Przygotuj profesjonalne CV i profil LinkedIn. Gotowy do aplikowania na pierwszą pracę!');

-- ============================================================================
-- Verification Queries (commented out - for manual testing only)
-- ============================================================================

-- Uncomment these queries to verify seed data after migration

-- -- Verify all roles were inserted
-- select * from public.roles order by id;

-- -- Verify roadmap steps for Frontend Developer
-- select 
--   rs.order_number,
--   rs.title,
--   r.name as role_name
-- from public.roadmap_steps rs
-- join public.roles r on rs.role_id = r.id
-- where r.name = 'Frontend Developer'
-- order by rs.order_number;

-- -- Count steps per role (should be 10 for Frontend Developer, 0 for others)
-- select 
--   r.name,
--   count(rs.id) as step_count
-- from public.roles r
-- left join public.roadmap_steps rs on r.id = rs.role_id
-- group by r.name
-- order by r.name;


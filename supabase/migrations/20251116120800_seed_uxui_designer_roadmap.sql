-- ============================================================================
-- Migration: Seed Data - UX/UI Designer Roadmap
-- Created: 2025-11-16 12:08:00 UTC
-- Description: Inserts roadmap steps for UX/UI Designer role (8 steps)
-- Tables Affected: roadmap_steps
-- Notes: UX/UI Designer is role_id=5 based on seed order in 20251116120400
-- ============================================================================

-- Get the role_id for UX/UI Designer dynamically
DO $$
DECLARE
  uxui_role_id integer;
BEGIN
  SELECT id INTO uxui_role_id FROM public.roles WHERE name = 'UX/UI Designer';
  
  IF uxui_role_id IS NULL THEN
    RAISE EXCEPTION 'UX/UI Designer role not found';
  END IF;

  -- Insert 8 roadmap steps for UX/UI Designer
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
   'Zbuduj portfolio UX z case studies end-to-end. Opanuj storytelling projektowy i prezentację decyzji. Rozwijaj personal branding i przygotuj się do rozmów rekrutacyjnych. Rekruter nie zatrudnia narzędzia, lecz sposób myślenia. Dobrze opisane case study pokazuje, że rozumiesz proces, potrafisz podejmować decyzje i wyciągać wnioski — nawet jeśli wcześniej pracowałeś w innej branży.');

  RAISE NOTICE 'Successfully inserted 8 roadmap steps for UX/UI Designer (role_id=%)', uxui_role_id;
END $$;

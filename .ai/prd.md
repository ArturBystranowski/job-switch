# Dokument wymagań produktu (PRD) - JobSwitch

## 1. Przegląd produktu

JobSwitch to aplikacja webowa, która na podstawie analizy CV oraz formularza użytkownika generuje dwie najlepiej dopasowane ścieżki kariery IT wraz z krótkimi, spójnymi uzasadnieniami. Użytkownik wybiera jedną z ról, po czym otrzymuje roadmapę składającą się z 10 kroków oraz maksymalnie 3 wariantów na krok. Celem aplikacji jest umożliwienie osobom zmieniającym karierę podjęcia trafnej decyzji i zapewnienie jasnej drogi rozwoju.

Aplikacja jest realizowana jako MVP z prostą architekturą: backend (FastAPI + CRUD), frontend (React). Analiza CV jest wykonywana raz, bez OCR, przy limicie 1 MB dla pliku. Wszystkie roadmapy i uzasadnienia są generowane przez AI, a następnie ręcznie weryfikowane.

## 2. Problem użytkownika

Osoby rozważające wejście do branży IT często nie wiedzą, która rola najlepiej pasuje do ich predyspozycji, doświadczeń i preferencji. Przeglądanie informacji online i testów kompetencji jest czasochłonne, a wyniki często są niespójne lub niepraktyczne. Brakuje narzędzia, które:

- bierze pod uwagę realne doświadczenie z CV,
- ocenia predyspozycje miękkie i sposób pracy,
- generuje tylko najbardziej trafne opcje (bez nadmiaru),
- prowadzi użytkownika krok po kroku po wybranej ścieżce rozwoju.

JobSwitch rozwiązuje ten problem poprzez proste, szybkie i precyzyjne rekomendacje oparte o heurystyki oraz klarowną roadmapę działań.

## 3. Wymagania funkcjonalne

### 3.1. Funkcjonalności główne

1. Rejestracja i logowanie użytkownika (email + hasło).
2. Formularz użytkownika (pytania dot. preferencji, umiejętności miękkich, trybu pracy).
3. Jednorazowy upload CV (PDF/DOCX, max 1 MB).
4. Analiza CV i formularza przez AI:
   - heurystyki oparte na doświadczeniu zawodowym,
   - formularz ważniejszy w ocenie miękkich kompetencji.
5. Generowanie dwóch ról IT oraz uzasadnień (4–6 zdań, stały szablon).
6. Prezentacja dwóch rekomendacji użytkownikowi.
7. Ostateczny wybór jednej roli (bez cofania w MVP).
8. Renderowanie roadmapy:
   - 10 kroków na rolę, do 3 wariantów na krok,
   - drzewo kroków z wyróżnieniem aktywnych/nieaktywnych wariantów.
9. Oznaczanie kroków jako ukończone oraz obliczanie progresu.
10. Przechowywanie danych użytkownika, wyboru roli i progresu.

### 3.2. Funkcjonalności wspierające

1. Backend CRUD: role, roadmapy, profile użytkowników, progres.
2. Minimalne testy: testy jednostkowe + 1 test E2E.
3. Ręczna walidacja wygenerowanych roadmap.
4. API do analizy CV bez OCR.

## 4. Granice produktu

### 4.1. Zakres MVP

- Brak możliwości ponownej analizy CV.
- Brak edycji wyboru roli po zatwierdzeniu.
- Brak dashboardu analitycznego (KPI mierzone po stronie backendu lub zewnętrznym narzędziem).
- Brak udostępniania roadmapy innym użytkownikom.
- Brak możliwości aktualizacji CV lub progresu AI w MVP.
- Brak cache dla analizy CV.
- Brak edytora CV.

### 4.2. Poza zakresem MVP

- Zaawansowane modele predykcji kariery.
- Dynamiczne aktualizowanie kroków roadmap przez system.
- Integracje z platformami edukacyjnymi.
- Personalizowane ścieżki na podstawie historii aktywności.
- Wsparcie dla plików graficznych lub OCR.
- System gamifikacji.

## 5. Historyjki użytkowników

### US-001

Tytuł: Rejestracja użytkownika  
Opis: Jako użytkownik chcę utworzyć konto, aby móc zapisać moje dane i uzyskać dostęp do rekomendacji kariery.  
Kryteria akceptacji:

- Można utworzyć konto za pomocą email + hasło.
- System odrzuca niepoprawny email i słabe hasło.
- Dane zapisywane są w bazie.

### US-002

Tytuł: Logowanie  
Opis: Jako użytkownik chcę zalogować się do aplikacji, aby uzyskać dostęp do mojego profilu i roadmapy.  
Kryteria akceptacji:

- Logowanie wymaga poprawnych danych.
- Przy błędnych danych pojawia się komunikat.
- Po logowaniu widoczny jest dashboard użytkownika.

### US-003

Tytuł: Wypełnienie formularza preferencji  
Opis: Jako użytkownik chcę uzupełnić formularz, aby AI mogła ocenić moje kompetencje miękkie i preferencje zawodowe.  
Kryteria akceptacji:

- Formularz zawiera pytania o sposób pracy, kontakt z klientem, estetykę, teamwork itp.
- Formularz musi zostać wypełniony przed analizą CV.
- Dane są zapisywane w backendzie.

### US-004

Tytuł: Upload CV  
Opis: Jako użytkownik chcę przesłać CV, aby system mógł przeanalizować moje doświadczenie.  
Kryteria akceptacji:

- System akceptuje PDF/DOCX do 1 MB.
- Nie akceptuje plików większych lub nieobsługiwanych.
- CV można wgrać tylko raz.

### US-005

Tytuł: Generowanie rekomendacji  
Opis: Jako użytkownik chcę otrzymać dwie najlepiej dopasowane role, aby ocenić swoje możliwości w IT.  
Kryteria akceptacji:

- AI analizuje formularz i CV zgodnie z heurystykami.
- AI generuje 2 role + uzasadnienia (4–6 zdań).
- Uzasadnienia korzystają ze spójnego szablonu.

### US-006

Tytuł: Przegląd rekomendacji  
Opis: Jako użytkownik chcę zobaczyć dwie propozycje ról IT, aby móc wybrać jedną ścieżkę.  
Kryteria akceptacji:

- Wyświetlane są 2 karty z rolami i uzasadnieniem.
- Informacja o braku możliwości zmiany po wyborze.

### US-007

Tytuł: Wybór roli  
Opis: Jako użytkownik chcę wybrać jedną rolę, aby rozpocząć roadmapę.  
Kryteria akceptacji:

- Wybór musi zostać potwierdzony popupem.
- Po potwierdzeniu rola staje się ostateczna.

### US-008

Tytuł: Wyświetlanie roadmapy  
Opis: Jako użytkownik chcę widzieć szczegółową roadmapę 10 kroków, aby wiedzieć, jak rozwijać się w wybranej roli.  
Kryteria akceptacji:

- Każdy krok ma do 3 wariantów.
- Widok roadmapy jest drzewiasty.
- Warianty nieaktywne są wyszarzone.

### US-009

Tytuł: Oznaczanie kroków jako ukończonych  
Opis: Jako użytkownik chcę zaznaczać zrealizowane kroki, aby śledzić swój postęp.  
Kryteria akceptacji:

- Można oznaczyć krok lub wariant jako ukończony.
- Progress bar aktualizuje się automatycznie.

### US-010

Tytuł: Przechowywanie postępu  
Opis: Jako użytkownik chcę, aby moje dane i progres były zapisywane na serwerze.  
Kryteria akceptacji:

- System zapisuje stan każdego kroku.
- Dane pozostają po wylogowaniu.

### US-011

Tytuł: Bezpieczne uwierzytelnianie  
Opis: Jako użytkownik chcę mieć pewność, że moje dane są bezpieczne.  
Kryteria akceptacji:

- Hasła są hashowane.
- API wymaga JWT lub podobnego mechanizmu.
- Niedozwolone żądania są odrzucane.

### US-012

Tytuł: Obsługa błędów  
Opis: Jako użytkownik chcę jasne komunikaty błędów, aby wiedzieć, co zrobić w problematycznych sytuacjach.  
Kryteria akceptacji:

- System informuje o błędach uploadu CV.
- System wyświetla błędy sieci/AI w zrozumiały sposób.

## 6. Metryki sukcesu

1. Procent użytkowników, którzy wygenerują rekomendację po rejestracji.
2. Procent użytkowników, którzy dokonają wyboru jednej z dwóch ról.
3. Procent użytkowników, którzy ukończą minimum 20% roadmapy w ciągu 14 dni.

Dodatkowe wskaźniki pomocnicze:

- Średni czas od rejestracji do wyboru roli.
- Średnia liczba ukończonych kroków w pierwszym tygodniu.
- Odsetek użytkowników, którzy porzucają proces przed uploadem CV.

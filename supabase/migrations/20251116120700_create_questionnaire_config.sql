-- ============================================================================
-- Migration: Create Questionnaire Configuration Tables
-- Created: 2025-11-16 12:07:00 UTC
-- Description: Stores questionnaire questions and their predefined answer options
-- ============================================================================

-- ============================================================================
-- Create questionnaire_questions table
-- ============================================================================

CREATE TABLE public.questionnaire_questions (
  id SERIAL PRIMARY KEY,
  field_name TEXT NOT NULL UNIQUE,
  question_text TEXT NOT NULL,
  question_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Create questionnaire_options table
-- ============================================================================

CREATE TABLE public.questionnaire_options (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL REFERENCES public.questionnaire_questions(id) ON DELETE CASCADE,
  option_value TEXT NOT NULL,
  option_label TEXT NOT NULL,
  option_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(question_id, option_value)
);

-- ============================================================================
-- Create indexes
-- ============================================================================

CREATE INDEX idx_questionnaire_questions_order ON public.questionnaire_questions(question_order);
CREATE INDEX idx_questionnaire_questions_active ON public.questionnaire_questions(is_active);
CREATE INDEX idx_questionnaire_options_question ON public.questionnaire_options(question_id);
CREATE INDEX idx_questionnaire_options_order ON public.questionnaire_options(option_order);

-- ============================================================================
-- RLS Policies (read-only for all authenticated users)
-- ============================================================================

ALTER TABLE public.questionnaire_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_options ENABLE ROW LEVEL SECURITY;

-- Questions are readable by all authenticated users
CREATE POLICY "questionnaire_questions_select_authenticated"
  ON public.questionnaire_questions
  FOR SELECT
  TO authenticated
  USING (true);

-- Options are readable by all authenticated users
CREATE POLICY "questionnaire_options_select_authenticated"
  ON public.questionnaire_options
  FOR SELECT
  TO authenticated
  USING (true);

-- Development: Allow anon to read questions
CREATE POLICY "questionnaire_questions_select_anon_dev"
  ON public.questionnaire_questions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "questionnaire_options_select_anon_dev"
  ON public.questionnaire_options
  FOR SELECT
  TO anon
  USING (true);

-- ============================================================================
-- Seed questionnaire data
-- ============================================================================

-- Insert questions
INSERT INTO public.questionnaire_questions (field_name, question_text, question_order) VALUES
  ('work_style', 'Jak wolisz pracować?', 1),
  ('client_interaction', 'Ile kontaktu z klientem/użytkownikiem końcowym Ci odpowiada?', 2),
  ('aesthetic_focus', 'Jak ważna jest dla Ciebie warstwa wizualna produktu?', 3),
  ('teamwork_preference', 'Jak oceniasz swoją preferencję do pracy zespołowej?', 4),
  ('problem_solving_approach', 'Jak podchodzisz do rozwiązywania problemów?', 5);

-- Insert options for work_style
INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'independent', 'Samodzielnie, w swoim tempie', 1
FROM public.questionnaire_questions WHERE field_name = 'work_style';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'collaborative', 'W zespole, z częstą komunikacją', 2
FROM public.questionnaire_questions WHERE field_name = 'work_style';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'mixed', 'Elastycznie - zależnie od zadania', 3
FROM public.questionnaire_questions WHERE field_name = 'work_style';

-- Insert options for client_interaction
INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'minimal', 'Minimum - wolę skupić się na kodzie', 1
FROM public.questionnaire_questions WHERE field_name = 'client_interaction';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'moderate', 'Umiarkowany - czasem rozmowy są OK', 2
FROM public.questionnaire_questions WHERE field_name = 'client_interaction';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'extensive', 'Dużo - lubię rozumieć potrzeby użytkowników', 3
FROM public.questionnaire_questions WHERE field_name = 'client_interaction';

-- Insert options for aesthetic_focus
INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'low', 'Mało - liczy się funkcjonalność', 1
FROM public.questionnaire_questions WHERE field_name = 'aesthetic_focus';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'medium', 'Średnio - ważne, ale nie priorytet', 2
FROM public.questionnaire_questions WHERE field_name = 'aesthetic_focus';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'high', 'Bardzo - design i UX są kluczowe', 3
FROM public.questionnaire_questions WHERE field_name = 'aesthetic_focus';

-- Insert options for teamwork_preference
INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'low', 'Wolę pracować samodzielnie', 1
FROM public.questionnaire_questions WHERE field_name = 'teamwork_preference';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'medium', 'Zespół OK, ale potrzebuję czasu na fokus', 2
FROM public.questionnaire_questions WHERE field_name = 'teamwork_preference';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'high', 'Uwielbiam współpracę i burze mózgów', 3
FROM public.questionnaire_questions WHERE field_name = 'teamwork_preference';

-- Insert options for problem_solving_approach
INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'analytical', 'Analitycznie - rozkładam na części, szukam wzorców', 1
FROM public.questionnaire_questions WHERE field_name = 'problem_solving_approach';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'creative', 'Kreatywnie - szukam niestandardowych rozwiązań', 2
FROM public.questionnaire_questions WHERE field_name = 'problem_solving_approach';

INSERT INTO public.questionnaire_options (question_id, option_value, option_label, option_order)
SELECT id, 'practical', 'Praktycznie - najprostsze rozwiązanie które działa', 3
FROM public.questionnaire_questions WHERE field_name = 'problem_solving_approach';

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE public.questionnaire_questions IS 'Questionnaire questions configuration';
COMMENT ON TABLE public.questionnaire_options IS 'Predefined answer options for questionnaire questions';
COMMENT ON COLUMN public.questionnaire_questions.field_name IS 'Field name used in questionnaire_responses JSON';
COMMENT ON COLUMN public.questionnaire_questions.question_order IS 'Display order of questions';
COMMENT ON COLUMN public.questionnaire_options.option_value IS 'Value stored in database';
COMMENT ON COLUMN public.questionnaire_options.option_label IS 'Human-readable label shown to user';

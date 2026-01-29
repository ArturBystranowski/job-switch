-- ============================================================================
-- Migration: Complete Schema for JobSwitch MVP
-- Created: 2025-11-16 12:00:00 UTC
-- Description: Creates complete database schema including:
--              - Core tables (roles, profiles, roadmap_steps, step_tasks, user_step_progress)
--              - Questionnaire tables (questionnaire_questions, questionnaire_options)
--              - All indexes (GIN for JSONB, B-tree for FKs and sorting)
--              - Row Level Security policies
--              - Profile auto-creation trigger
-- ============================================================================

-- ============================================================================
-- SECTION 1: CORE TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Table: roles
-- Description: Dictionary of IT roles (admin-managed, predefined via seeds)
-- ----------------------------------------------------------------------------
CREATE TABLE public.roles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.roles IS 'Dictionary of IT roles with descriptions. Managed by admin/migrations.';
COMMENT ON COLUMN public.roles.id IS 'Unique role identifier';
COMMENT ON COLUMN public.roles.name IS 'Role name (e.g., "Frontend Developer")';
COMMENT ON COLUMN public.roles.description IS 'Role description (2-3 sentences)';

-- ----------------------------------------------------------------------------
-- Table: profiles
-- Description: Extends auth.users with business data (1:1 relationship)
-- ----------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  questionnaire_responses JSONB NOT NULL DEFAULT '{}'::jsonb,
  cv_uploaded_at TIMESTAMPTZ,
  ai_recommendations JSONB,
  selected_role_id INTEGER REFERENCES public.roles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'User business profiles extending auth.users. Contains questionnaire responses, AI recommendations, and role selection.';
COMMENT ON COLUMN public.profiles.id IS 'User ID from auth.users (1:1 relationship)';
COMMENT ON COLUMN public.profiles.questionnaire_responses IS 'User preferences from onboarding questionnaire (JSONB structure)';
COMMENT ON COLUMN public.profiles.cv_uploaded_at IS 'Timestamp of CV upload. NULL means no CV uploaded yet.';
COMMENT ON COLUMN public.profiles.ai_recommendations IS 'AI-generated role recommendations (2 roles with justifications)';
COMMENT ON COLUMN public.profiles.selected_role_id IS 'User-selected final role for their learning path';

-- ----------------------------------------------------------------------------
-- Table: roadmap_steps
-- Description: 10 development steps for each role
-- ----------------------------------------------------------------------------
CREATE TABLE public.roadmap_steps (
  id SERIAL PRIMARY KEY,
  role_id INTEGER NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  order_number INTEGER NOT NULL CHECK (order_number >= 1 AND order_number <= 15),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(role_id, order_number)
);

COMMENT ON TABLE public.roadmap_steps IS 'Development roadmap steps for each role. Each role has up to 15 sequential steps.';
COMMENT ON COLUMN public.roadmap_steps.id IS 'Unique step identifier';
COMMENT ON COLUMN public.roadmap_steps.role_id IS 'Role to which this step belongs';
COMMENT ON COLUMN public.roadmap_steps.order_number IS 'Step sequence number (1-15)';
COMMENT ON COLUMN public.roadmap_steps.title IS 'Step title (e.g., "HTML/CSS Basics")';
COMMENT ON COLUMN public.roadmap_steps.description IS 'Step description (3-5 sentences)';

-- ----------------------------------------------------------------------------
-- Table: step_tasks
-- Description: 3-5 mandatory tasks for each roadmap step
-- ----------------------------------------------------------------------------
CREATE TABLE public.step_tasks (
  id SERIAL PRIMARY KEY,
  step_id INTEGER NOT NULL REFERENCES public.roadmap_steps(id) ON DELETE CASCADE,
  order_number INTEGER NOT NULL CHECK (order_number BETWEEN 1 AND 5),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  estimated_hours INTEGER,
  resources JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(step_id, order_number)
);

COMMENT ON TABLE public.step_tasks IS 'Mandatory tasks for roadmap steps. Each step has 3-5 tasks. All tasks must be completed to unlock next step.';
COMMENT ON COLUMN public.step_tasks.id IS 'Unique task identifier';
COMMENT ON COLUMN public.step_tasks.step_id IS 'Step to which this task belongs';
COMMENT ON COLUMN public.step_tasks.order_number IS 'Task sequence number (1-5)';
COMMENT ON COLUMN public.step_tasks.title IS 'Task title (e.g., "Complete HTML basics")';
COMMENT ON COLUMN public.step_tasks.description IS 'Task description (2-3 sentences)';
COMMENT ON COLUMN public.step_tasks.estimated_hours IS 'Estimated time to complete in hours';
COMMENT ON COLUMN public.step_tasks.resources IS 'Learning resources (links, materials) in JSONB format';

-- ----------------------------------------------------------------------------
-- Table: user_step_progress
-- Description: Tracks user completion of step tasks
-- ----------------------------------------------------------------------------
CREATE TABLE public.user_step_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  step_task_id INTEGER NOT NULL REFERENCES public.step_tasks(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, step_task_id)
);

COMMENT ON TABLE public.user_step_progress IS 'Tracks completed step tasks by users. Each task can be completed only once per user.';
COMMENT ON COLUMN public.user_step_progress.id IS 'Unique progress record identifier';
COMMENT ON COLUMN public.user_step_progress.user_id IS 'User who completed the task';
COMMENT ON COLUMN public.user_step_progress.step_task_id IS 'Completed task';
COMMENT ON COLUMN public.user_step_progress.completed_at IS 'Completion timestamp';

-- ============================================================================
-- SECTION 2: QUESTIONNAIRE TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Table: questionnaire_questions
-- ----------------------------------------------------------------------------
CREATE TABLE public.questionnaire_questions (
  id SERIAL PRIMARY KEY,
  field_name TEXT NOT NULL UNIQUE,
  question_text TEXT NOT NULL,
  question_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.questionnaire_questions IS 'Questionnaire questions configuration';
COMMENT ON COLUMN public.questionnaire_questions.field_name IS 'Field name used in questionnaire_responses JSON';
COMMENT ON COLUMN public.questionnaire_questions.question_order IS 'Display order of questions';

-- ----------------------------------------------------------------------------
-- Table: questionnaire_options
-- ----------------------------------------------------------------------------
CREATE TABLE public.questionnaire_options (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL REFERENCES public.questionnaire_questions(id) ON DELETE CASCADE,
  option_value TEXT NOT NULL,
  option_label TEXT NOT NULL,
  option_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(question_id, option_value)
);

COMMENT ON TABLE public.questionnaire_options IS 'Predefined answer options for questionnaire questions';
COMMENT ON COLUMN public.questionnaire_options.option_value IS 'Value stored in database';
COMMENT ON COLUMN public.questionnaire_options.option_label IS 'Human-readable label shown to user';

-- ============================================================================
-- SECTION 3: INDEXES
-- ============================================================================

-- GIN Indexes for JSONB columns
CREATE INDEX idx_profiles_questionnaire_responses ON public.profiles USING gin (questionnaire_responses);
CREATE INDEX idx_profiles_ai_recommendations ON public.profiles USING gin (ai_recommendations);
CREATE INDEX idx_step_tasks_resources ON public.step_tasks USING gin (resources);

COMMENT ON INDEX public.idx_profiles_questionnaire_responses IS 'GIN index for efficient JSONB queries on questionnaire responses';
COMMENT ON INDEX public.idx_profiles_ai_recommendations IS 'GIN index for efficient JSONB queries on AI recommendations';
COMMENT ON INDEX public.idx_step_tasks_resources IS 'GIN index for efficient JSONB queries on step task resources';

-- B-tree Indexes for Foreign Keys
CREATE INDEX idx_profiles_selected_role_id ON public.profiles(selected_role_id);
CREATE INDEX idx_roadmap_steps_role_id ON public.roadmap_steps(role_id);
CREATE INDEX idx_step_tasks_step_id ON public.step_tasks(step_id);
CREATE INDEX idx_user_step_progress_user_id ON public.user_step_progress(user_id);
CREATE INDEX idx_user_step_progress_step_task_id ON public.user_step_progress(step_task_id);

COMMENT ON INDEX public.idx_profiles_selected_role_id IS 'B-tree index for optimizing JOIN with roles table';
COMMENT ON INDEX public.idx_roadmap_steps_role_id IS 'B-tree index for optimizing queries by role_id';
COMMENT ON INDEX public.idx_step_tasks_step_id IS 'B-tree index for optimizing queries by step_id';
COMMENT ON INDEX public.idx_user_step_progress_user_id IS 'B-tree index for optimizing queries by user_id';
COMMENT ON INDEX public.idx_user_step_progress_step_task_id IS 'B-tree index for optimizing queries by step_task_id';

-- Composite B-tree Indexes for Sorting Operations
CREATE INDEX idx_roadmap_steps_role_order ON public.roadmap_steps(role_id, order_number);
CREATE INDEX idx_step_tasks_step_order ON public.step_tasks(step_id, order_number);

COMMENT ON INDEX public.idx_roadmap_steps_role_order IS 'Composite index for optimizing roadmap retrieval with proper ordering';
COMMENT ON INDEX public.idx_step_tasks_step_order IS 'Composite index for optimizing task retrieval with proper ordering';

-- Questionnaire indexes
CREATE INDEX idx_questionnaire_questions_order ON public.questionnaire_questions(question_order);
CREATE INDEX idx_questionnaire_questions_active ON public.questionnaire_questions(is_active);
CREATE INDEX idx_questionnaire_options_question ON public.questionnaire_options(question_id);
CREATE INDEX idx_questionnaire_options_order ON public.questionnaire_options(option_order);

-- ============================================================================
-- SECTION 4: ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.step_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_step_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_options ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- RLS Policies for: profiles
-- ----------------------------------------------------------------------------
CREATE POLICY "authenticated users can view own profile" 
ON public.profiles FOR SELECT TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "authenticated users can insert own profile" 
ON public.profiles FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = id);

CREATE POLICY "authenticated users can update own profile" 
ON public.profiles FOR UPDATE TO authenticated 
USING (auth.uid() = id);

COMMENT ON POLICY "authenticated users can view own profile" ON public.profiles IS 'Users can only SELECT their own profile record using auth.uid()';
COMMENT ON POLICY "authenticated users can insert own profile" ON public.profiles IS 'Users can only INSERT their own profile record (auth.uid() must match id)';
COMMENT ON POLICY "authenticated users can update own profile" ON public.profiles IS 'Users can only UPDATE their own profile record using auth.uid()';

-- ----------------------------------------------------------------------------
-- RLS Policies for: roles
-- ----------------------------------------------------------------------------
CREATE POLICY "authenticated users can view all roles" 
ON public.roles FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "anonymous users can view all roles" 
ON public.roles FOR SELECT TO anon 
USING (true);

COMMENT ON POLICY "authenticated users can view all roles" ON public.roles IS 'All authenticated users can SELECT roles for selection purposes';
COMMENT ON POLICY "anonymous users can view all roles" ON public.roles IS 'Anonymous users can SELECT roles for preview purposes';

-- ----------------------------------------------------------------------------
-- RLS Policies for: roadmap_steps
-- ----------------------------------------------------------------------------
CREATE POLICY "authenticated users can view all roadmap steps" 
ON public.roadmap_steps FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "anonymous users can view all roadmap steps" 
ON public.roadmap_steps FOR SELECT TO anon 
USING (true);

COMMENT ON POLICY "authenticated users can view all roadmap steps" ON public.roadmap_steps IS 'All authenticated users can SELECT roadmap steps to view learning paths';
COMMENT ON POLICY "anonymous users can view all roadmap steps" ON public.roadmap_steps IS 'Anonymous users can SELECT roadmap steps for preview purposes';

-- ----------------------------------------------------------------------------
-- RLS Policies for: step_tasks
-- ----------------------------------------------------------------------------
CREATE POLICY "authenticated users can view all step tasks" 
ON public.step_tasks FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "anonymous users can view all step tasks" 
ON public.step_tasks FOR SELECT TO anon 
USING (true);

COMMENT ON POLICY "authenticated users can view all step tasks" ON public.step_tasks IS 'All authenticated users can SELECT step tasks to view learning requirements';
COMMENT ON POLICY "anonymous users can view all step tasks" ON public.step_tasks IS 'Anonymous users can SELECT step tasks for preview purposes';

-- ----------------------------------------------------------------------------
-- RLS Policies for: user_step_progress
-- ----------------------------------------------------------------------------
CREATE POLICY "authenticated users can view own progress" 
ON public.user_step_progress FOR SELECT TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "authenticated users can insert own progress" 
ON public.user_step_progress FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "authenticated users can delete own progress" 
ON public.user_step_progress FOR DELETE TO authenticated 
USING (auth.uid() = user_id);

COMMENT ON POLICY "authenticated users can view own progress" ON public.user_step_progress IS 'Users can only SELECT their own progress records using auth.uid()';
COMMENT ON POLICY "authenticated users can insert own progress" ON public.user_step_progress IS 'Users can only INSERT progress records for themselves (auth.uid() must match user_id)';
COMMENT ON POLICY "authenticated users can delete own progress" ON public.user_step_progress IS 'Users can only DELETE their own progress records using auth.uid()';

-- ----------------------------------------------------------------------------
-- RLS Policies for: questionnaire tables
-- ----------------------------------------------------------------------------
CREATE POLICY "questionnaire_questions_select_authenticated"
ON public.questionnaire_questions FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "questionnaire_options_select_authenticated"
ON public.questionnaire_options FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "questionnaire_questions_select_anon_dev"
ON public.questionnaire_questions FOR SELECT TO anon 
USING (true);

CREATE POLICY "questionnaire_options_select_anon_dev"
ON public.questionnaire_options FOR SELECT TO anon 
USING (true);

-- ============================================================================
-- SECTION 5: TRIGGER FOR AUTO-CREATING PROFILES
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, questionnaire_responses, created_at)
  VALUES (
    new.id,
    '{}'::jsonb,
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_new_user() IS 'Trigger function to auto-create profile record after user registration. Uses SECURITY DEFINER to bypass RLS.';

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- Migration: Initial Schema for JobSwitch MVP
-- Created: 2025-11-16 12:00:00 UTC
-- Description: Creates core database schema with 5 tables:
--              - profiles (user business data extension)
--              - roles (IT role dictionary)
--              - roadmap_steps (10 development steps per role)
--              - step_variants (1-3 learning variants per step)
--              - user_step_progress (completion tracking)
-- Tables Affected: profiles, roles, roadmap_steps, step_variants, user_step_progress
-- Notes: Uses JSONB for read-only AI-generated data, relational structure for operational data
--        RLS is enabled in separate migration (20251116120200_create_rls_policies.sql)
-- ============================================================================

-- ============================================================================
-- Table: roles
-- Description: Dictionary of IT roles (admin-managed, predefines via seeds)
-- ============================================================================
create table public.roles (
  id serial primary key,
  name text not null unique,
  description text not null,
  created_at timestamptz not null default now()
);

comment on table public.roles is 'Dictionary of IT roles with descriptions. Managed by admin/migrations.';
comment on column public.roles.id is 'Unique role identifier';
comment on column public.roles.name is 'Role name (e.g., "Frontend Developer")';
comment on column public.roles.description is 'Role description (2-3 sentences)';

-- ============================================================================
-- Table: profiles
-- Description: Extends auth.users with business data (1:1 relationship)
-- ============================================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  questionnaire_responses jsonb not null default '{}'::jsonb,
  cv_uploaded_at timestamptz,
  ai_recommendations jsonb,
  selected_role_id integer references public.roles(id) on delete set null,
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'User business profiles extending auth.users. Contains questionnaire responses, AI recommendations, and role selection.';
comment on column public.profiles.id is 'User ID from auth.users (1:1 relationship)';
comment on column public.profiles.questionnaire_responses is 'User preferences from onboarding questionnaire (JSONB structure)';
comment on column public.profiles.cv_uploaded_at is 'Timestamp of CV upload. NULL means no CV uploaded yet.';
comment on column public.profiles.ai_recommendations is 'AI-generated role recommendations (2 roles with justifications)';
comment on column public.profiles.selected_role_id is 'User-selected final role for their learning path';

-- ============================================================================
-- Table: roadmap_steps
-- Description: 10 development steps for each role (direct relationship to roles)
-- ============================================================================
create table public.roadmap_steps (
  id serial primary key,
  role_id integer not null references public.roles(id) on delete cascade,
  order_number integer not null check (order_number between 1 and 10),
  title text not null,
  description text not null,
  created_at timestamptz not null default now(),
  -- Ensure each role has unique step order numbers (1-10)
  unique(role_id, order_number)
);

comment on table public.roadmap_steps is 'Development roadmap steps for each role. Each role has exactly 10 sequential steps.';
comment on column public.roadmap_steps.id is 'Unique step identifier';
comment on column public.roadmap_steps.role_id is 'Role to which this step belongs';
comment on column public.roadmap_steps.order_number is 'Step sequence number (1-10)';
comment on column public.roadmap_steps.title is 'Step title (e.g., "HTML/CSS Basics")';
comment on column public.roadmap_steps.description is 'Step description (3-5 sentences)';

-- ============================================================================
-- Table: step_variants
-- Description: 1-3 learning variants for each roadmap step
-- ============================================================================
create table public.step_variants (
  id serial primary key,
  step_id integer not null references public.roadmap_steps(id) on delete cascade,
  order_number integer not null check (order_number between 1 and 3),
  title text not null,
  description text not null,
  estimated_hours integer,
  resources jsonb,
  created_at timestamptz not null default now(),
  -- Ensure each step has unique variant order numbers (1-3)
  unique(step_id, order_number)
);

comment on table public.step_variants is 'Learning variants for roadmap steps. Each step can have 1-3 different approaches.';
comment on column public.step_variants.id is 'Unique variant identifier';
comment on column public.step_variants.step_id is 'Step to which this variant belongs';
comment on column public.step_variants.order_number is 'Variant sequence number (1-3)';
comment on column public.step_variants.title is 'Variant title (e.g., "Video Course")';
comment on column public.step_variants.description is 'Variant description (2-3 sentences)';
comment on column public.step_variants.estimated_hours is 'Estimated time to complete in hours';
comment on column public.step_variants.resources is 'Learning resources (links, materials) in JSONB format';

-- ============================================================================
-- Table: user_step_progress
-- Description: Tracks user completion of step variants
-- ============================================================================
create table public.user_step_progress (
  id serial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  step_variant_id integer not null references public.step_variants(id) on delete cascade,
  completed_at timestamptz not null default now(),
  -- Prevent duplicate completions: user can complete each variant only once
  unique(user_id, step_variant_id)
);

comment on table public.user_step_progress is 'Tracks completed step variants by users. Each variant can be completed only once per user.';
comment on column public.user_step_progress.id is 'Unique progress record identifier';
comment on column public.user_step_progress.user_id is 'User who completed the variant';
comment on column public.user_step_progress.step_variant_id is 'Completed variant';
comment on column public.user_step_progress.completed_at is 'Completion timestamp';


-- ============================================================================
-- Migration: Create Indexes for Performance Optimization
-- Created: 2025-11-16 12:01:00 UTC
-- Description: Creates GIN indexes for JSONB columns and B-tree indexes
--              for foreign keys and frequently sorted columns
-- Tables Affected: profiles, roadmap_steps, step_variants, user_step_progress
-- Notes: GIN indexes enable efficient JSONB queries, composite indexes optimize roadmap retrieval
-- ============================================================================

-- ============================================================================
-- GIN Indexes for JSONB columns
-- Purpose: Enable efficient queries on JSONB data (e.g., filtering by questionnaire responses)
-- ============================================================================

-- Index for questionnaire_responses in profiles
-- Enables queries like: WHERE questionnaire_responses @> '{"work_style": "independent"}'
create index idx_profiles_questionnaire_responses 
on public.profiles using gin (questionnaire_responses);

comment on index public.idx_profiles_questionnaire_responses is 'GIN index for efficient JSONB queries on questionnaire responses';

-- Index for ai_recommendations in profiles
-- Enables queries on AI recommendation structure
create index idx_profiles_ai_recommendations 
on public.profiles using gin (ai_recommendations);

comment on index public.idx_profiles_ai_recommendations is 'GIN index for efficient JSONB queries on AI recommendations';

-- Index for resources in step_variants
-- Enables queries on learning resources and links
create index idx_step_variants_resources 
on public.step_variants using gin (resources);

comment on index public.idx_step_variants_resources is 'GIN index for efficient JSONB queries on step variant resources';

-- ============================================================================
-- B-tree Indexes for Foreign Keys
-- Purpose: Optimize JOIN operations and foreign key lookups
-- ============================================================================

-- Index for selected_role_id in profiles
-- Optimizes JOIN between profiles and roles
create index idx_profiles_selected_role_id 
on public.profiles(selected_role_id);

comment on index public.idx_profiles_selected_role_id is 'B-tree index for optimizing JOIN with roles table';

-- Index for role_id in roadmap_steps
-- Optimizes queries for steps belonging to a specific role
create index idx_roadmap_steps_role_id 
on public.roadmap_steps(role_id);

comment on index public.idx_roadmap_steps_role_id is 'B-tree index for optimizing queries by role_id';

-- Index for step_id in step_variants
-- Optimizes queries for variants belonging to a specific step
create index idx_step_variants_step_id 
on public.step_variants(step_id);

comment on index public.idx_step_variants_step_id is 'B-tree index for optimizing queries by step_id';

-- Index for user_id in user_step_progress
-- Optimizes queries for progress records of a specific user
create index idx_user_step_progress_user_id 
on public.user_step_progress(user_id);

comment on index public.idx_user_step_progress_user_id is 'B-tree index for optimizing queries by user_id';

-- Index for step_variant_id in user_step_progress
-- Optimizes queries for users who completed a specific variant
create index idx_user_step_progress_step_variant_id 
on public.user_step_progress(step_variant_id);

comment on index public.idx_user_step_progress_step_variant_id is 'B-tree index for optimizing queries by step_variant_id';

-- ============================================================================
-- Composite B-tree Indexes for Sorting Operations
-- Purpose: Optimize queries that filter by foreign key and sort by order_number
-- ============================================================================

-- Composite index for roadmap_steps (role_id, order_number)
-- Optimizes queries like: SELECT * FROM roadmap_steps WHERE role_id = $1 ORDER BY order_number
-- This is the most common query pattern for displaying roadmaps
create index idx_roadmap_steps_role_order 
on public.roadmap_steps(role_id, order_number);

comment on index public.idx_roadmap_steps_role_order is 'Composite index for optimizing roadmap retrieval with proper ordering';

-- Composite index for step_variants (step_id, order_number)
-- Optimizes queries like: SELECT * FROM step_variants WHERE step_id = $1 ORDER BY order_number
-- This is the most common query pattern for displaying step variants
create index idx_step_variants_step_order 
on public.step_variants(step_id, order_number);

comment on index public.idx_step_variants_step_order is 'Composite index for optimizing variant retrieval with proper ordering';


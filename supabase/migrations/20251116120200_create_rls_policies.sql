-- ============================================================================
-- Migration: Row Level Security Policies
-- Created: 2025-11-16 12:02:00 UTC
-- Description: Enables RLS and creates policies for all tables ensuring proper data access control
--              - Enables RLS on all 5 tables
--              - profiles: users access only their own data
--              - roles, roadmap_steps, step_variants: public read for authenticated users
--              - user_step_progress: users access only their own progress
-- Tables Affected: profiles, roles, roadmap_steps, step_variants, user_step_progress
-- Notes: Granular policies per operation (select/insert/update/delete) and role (anon/authenticated)
--        Service role bypasses RLS for admin operations
-- ============================================================================

-- ============================================================================
-- Enable RLS on all tables
-- Note: RLS is enabled first, then policies are created to define access rules
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.roadmap_steps enable row level security;
alter table public.step_variants enable row level security;
alter table public.user_step_progress enable row level security;

-- ============================================================================
-- RLS Policies for: profiles
-- Access Pattern: Users can only view and modify their own profile data
-- ============================================================================

-- Policy: Authenticated users can view their own profile
-- Rationale: Profile data is private and should only be visible to the profile owner
create policy "authenticated users can view own profile" 
on public.profiles 
for select 
to authenticated 
using (auth.uid() = id);

comment on policy "authenticated users can view own profile" on public.profiles is 'Users can only SELECT their own profile record using auth.uid()';

-- Policy: Authenticated users can insert their own profile
-- Rationale: Allows profile creation during onboarding (typically via trigger)
create policy "authenticated users can insert own profile" 
on public.profiles 
for insert 
to authenticated 
with check (auth.uid() = id);

comment on policy "authenticated users can insert own profile" on public.profiles is 'Users can only INSERT their own profile record (auth.uid() must match id)';

-- Policy: Authenticated users can update their own profile
-- Rationale: Users need to update questionnaire responses, CV status, role selection
create policy "authenticated users can update own profile" 
on public.profiles 
for update 
to authenticated 
using (auth.uid() = id);

comment on policy "authenticated users can update own profile" on public.profiles is 'Users can only UPDATE their own profile record using auth.uid()';

-- ============================================================================
-- RLS Policies for: roles
-- Access Pattern: Public read access for authenticated users, admin-only modifications
-- ============================================================================

-- Policy: Authenticated users can view all roles
-- Rationale: Role selection requires viewing available roles during onboarding
create policy "authenticated users can view all roles" 
on public.roles 
for select 
to authenticated 
using (true);

comment on policy "authenticated users can view all roles" on public.roles is 'All authenticated users can SELECT roles for selection purposes';

-- Policy: Anonymous users can view all roles
-- Rationale: Allows viewing roles on public landing pages without authentication
create policy "anonymous users can view all roles" 
on public.roles 
for select 
to anon 
using (true);

comment on policy "anonymous users can view all roles" on public.roles is 'Anonymous users can SELECT roles for preview purposes';

-- Note: No INSERT/UPDATE/DELETE policies - only service_role can modify roles
-- This ensures role dictionary is managed exclusively by admins via migrations or admin panel

-- ============================================================================
-- RLS Policies for: roadmap_steps
-- Access Pattern: Public read access for authenticated users, admin-only modifications
-- ============================================================================

-- Policy: Authenticated users can view all roadmap steps
-- Rationale: Users need to view roadmap steps for their selected role
create policy "authenticated users can view all roadmap steps" 
on public.roadmap_steps 
for select 
to authenticated 
using (true);

comment on policy "authenticated users can view all roadmap steps" on public.roadmap_steps is 'All authenticated users can SELECT roadmap steps to view learning paths';

-- Policy: Anonymous users can view all roadmap steps
-- Rationale: Allows previewing roadmap content on public pages
create policy "anonymous users can view all roadmap steps" 
on public.roadmap_steps 
for select 
to anon 
using (true);

comment on policy "anonymous users can view all roadmap steps" on public.roadmap_steps is 'Anonymous users can SELECT roadmap steps for preview purposes';

-- Note: No INSERT/UPDATE/DELETE policies - only service_role can modify steps
-- This ensures roadmap content is managed exclusively by admins

-- ============================================================================
-- RLS Policies for: step_variants
-- Access Pattern: Public read access for authenticated users, admin-only modifications
-- ============================================================================

-- Policy: Authenticated users can view all step variants
-- Rationale: Users need to view available learning variants for roadmap steps
create policy "authenticated users can view all step variants" 
on public.step_variants 
for select 
to authenticated 
using (true);

comment on policy "authenticated users can view all step variants" on public.step_variants is 'All authenticated users can SELECT step variants to choose learning approaches';

-- Policy: Anonymous users can view all step variants
-- Rationale: Allows previewing learning options on public pages
create policy "anonymous users can view all step variants" 
on public.step_variants 
for select 
to anon 
using (true);

comment on policy "anonymous users can view all step variants" on public.step_variants is 'Anonymous users can SELECT step variants for preview purposes';

-- Note: No INSERT/UPDATE/DELETE policies - only service_role can modify variants
-- This ensures learning content is managed exclusively by admins

-- ============================================================================
-- RLS Policies for: user_step_progress
-- Access Pattern: Users can only view and manage their own progress records
-- ============================================================================

-- Policy: Authenticated users can view their own progress
-- Rationale: Progress tracking is private and should only be visible to the user
create policy "authenticated users can view own progress" 
on public.user_step_progress 
for select 
to authenticated 
using (auth.uid() = user_id);

comment on policy "authenticated users can view own progress" on public.user_step_progress is 'Users can only SELECT their own progress records using auth.uid()';

-- Policy: Authenticated users can insert their own progress
-- Rationale: Users need to mark variants as completed during learning
create policy "authenticated users can insert own progress" 
on public.user_step_progress 
for insert 
to authenticated 
with check (auth.uid() = user_id);

comment on policy "authenticated users can insert own progress" on public.user_step_progress is 'Users can only INSERT progress records for themselves (auth.uid() must match user_id)';

-- Policy: Authenticated users can delete their own progress
-- Rationale: Users may want to unmark a variant as completed (e.g., for review)
create policy "authenticated users can delete own progress" 
on public.user_step_progress 
for delete 
to authenticated 
using (auth.uid() = user_id);

comment on policy "authenticated users can delete own progress" on public.user_step_progress is 'Users can only DELETE their own progress records using auth.uid()';

-- Note: No UPDATE policy - progress records are immutable (completed_at should not change)
-- If user wants to "uncomplete" a variant, they should DELETE the record instead


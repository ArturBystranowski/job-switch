-- ============================================================================
-- Migration: Auto-Create Profile Trigger
-- Created: 2025-11-16 12:03:00 UTC
-- Description: Creates trigger function and trigger to automatically create
--              a profile record when a new user registers via auth.users
-- Tables Affected: profiles, auth.users (trigger only)
-- Notes: Uses SECURITY DEFINER to allow trigger to bypass RLS when creating profile
--        Initializes questionnaire_responses as empty JSONB object
-- ============================================================================

-- ============================================================================
-- Function: handle_new_user
-- Purpose: Automatically create a profile record when a user registers
-- Trigger Event: AFTER INSERT on auth.users
-- Security: SECURITY DEFINER allows bypassing RLS for profile creation
-- ============================================================================

-- Create function to handle new user registration
-- This function is called automatically when a new user is inserted into auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Insert a new profile record for the newly registered user
  -- questionnaire_responses is initialized as empty JSONB object (user will fill it during onboarding)
  -- cv_uploaded_at is NULL (user hasn't uploaded CV yet)
  -- ai_recommendations is NULL (will be generated after CV upload and questionnaire completion)
  -- selected_role_id is NULL (user will select role after viewing AI recommendations)
  insert into public.profiles (id, questionnaire_responses, created_at)
  values (
    new.id,                    -- User ID from auth.users
    '{}'::jsonb,               -- Empty JSONB object as placeholder for questionnaire
    now()                      -- Profile creation timestamp
  );
  
  return new;
end;
$$ language plpgsql security definer;

comment on function public.handle_new_user() is 'Trigger function to auto-create profile record after user registration. Uses SECURITY DEFINER to bypass RLS.';

-- ============================================================================
-- Trigger: on_auth_user_created
-- Purpose: Execute handle_new_user() after each user registration
-- Timing: AFTER INSERT to ensure auth.users record exists before creating profile
-- ============================================================================

-- Create trigger to execute function on new user creation
-- This trigger fires AFTER INSERT to auth.users to ensure referential integrity
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

comment on trigger on_auth_user_created on auth.users is 'Automatically creates profile record for newly registered users';


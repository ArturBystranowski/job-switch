-- ============================================================================
-- Migration: Seed Development Test User
-- Created: 2025-11-16 12:05:00 UTC
-- Description: Creates a default test user for development and testing purposes
--              This allows testing API endpoints without authentication
-- Tables Affected: auth.users, profiles
-- Notes: THIS IS FOR DEVELOPMENT ONLY - Remove or disable in production
--        Uses a fixed UUID for consistent testing across environments
-- ============================================================================

-- ============================================================================
-- Default Test User Configuration
-- ============================================================================
-- Fixed UUID for default test user (use this in your API calls during development)
-- UUID: 00000000-0000-0000-0000-000000000001

-- ============================================================================
-- Insert Test User into auth.users
-- Note: We need to create the user in auth.users first due to FK constraint
-- ============================================================================

INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'dev@test.local',
  crypt('devpassword123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Insert Default Test Profile
-- Note: Profile will be created by the trigger, but we update with test data
-- ============================================================================

-- Update test user profile with questionnaire data (profile created by trigger)
UPDATE public.profiles SET
  questionnaire_responses = '{
    "work_style": "independent",
    "client_interaction": "minimal",
    "aesthetic_focus": "high",
    "teamwork_preference": "medium",
    "problem_solving_approach": "analytical"
  }'::jsonb
WHERE id = '00000000-0000-0000-0000-000000000001'::uuid;

-- ============================================================================
-- Development Helper: Temporarily disable RLS for testing (OPTIONAL)
-- Uncomment below lines if you need to test without RLS restrictions
-- WARNING: Never use this in production!
-- ============================================================================

-- For local development, you can also run these manually in SQL editor:
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.user_step_progress DISABLE ROW LEVEL SECURITY;

-- To re-enable:
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.user_step_progress ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Add anon policies for development testing (profiles table)
-- This allows reading/writing profiles without authentication during dev
-- ============================================================================

-- Allow anon users to view the test profile (for development)
CREATE POLICY "anon can view test profile for dev" 
ON public.profiles 
FOR SELECT 
TO anon 
USING (id = '00000000-0000-0000-0000-000000000001'::uuid);

-- Allow anon users to update the test profile (for development)
CREATE POLICY "anon can update test profile for dev" 
ON public.profiles 
FOR UPDATE 
TO anon 
USING (id = '00000000-0000-0000-0000-000000000001'::uuid);

-- ============================================================================
-- Add anon policies for user_step_progress (for development testing)
-- ============================================================================

-- Allow anon users to view test user's progress
CREATE POLICY "anon can view test user progress for dev" 
ON public.user_step_progress 
FOR SELECT 
TO anon 
USING (user_id = '00000000-0000-0000-0000-000000000001'::uuid);

-- Allow anon users to insert test user's progress
CREATE POLICY "anon can insert test user progress for dev" 
ON public.user_step_progress 
FOR INSERT 
TO anon 
WITH CHECK (user_id = '00000000-0000-0000-0000-000000000001'::uuid);

-- Allow anon users to delete test user's progress
CREATE POLICY "anon can delete test user progress for dev" 
ON public.user_step_progress 
FOR DELETE 
TO anon 
USING (user_id = '00000000-0000-0000-0000-000000000001'::uuid);

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON POLICY "anon can view test profile for dev" ON public.profiles IS 
  'DEV ONLY: Allows anonymous access to test profile for development testing';

COMMENT ON POLICY "anon can update test profile for dev" ON public.profiles IS 
  'DEV ONLY: Allows anonymous updates to test profile for development testing';

COMMENT ON POLICY "anon can view test user progress for dev" ON public.user_step_progress IS 
  'DEV ONLY: Allows anonymous access to test user progress for development testing';

COMMENT ON POLICY "anon can insert test user progress for dev" ON public.user_step_progress IS 
  'DEV ONLY: Allows anonymous insert of test user progress for development testing';

COMMENT ON POLICY "anon can delete test user progress for dev" ON public.user_step_progress IS 
  'DEV ONLY: Allows anonymous delete of test user progress for development testing';

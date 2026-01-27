-- ============================================================================
-- Migration: Seed Development Test User
-- Created: 2025-11-16 12:03:00 UTC
-- Description: Creates a default test user for development and testing purposes
-- Notes: THIS IS FOR DEVELOPMENT ONLY - Remove or disable in production
--        Uses a fixed UUID for consistent testing across environments
-- ============================================================================

-- ============================================================================
-- Default Test User Configuration
-- Fixed UUID: 00000000-0000-0000-0000-000000000001
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
-- Update Test User Profile (created by trigger)
-- ============================================================================

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
-- Development Policies for Test User (anon access)
-- ============================================================================

-- Profiles policies for test user
CREATE POLICY "anon can view test profile for dev" 
ON public.profiles FOR SELECT TO anon 
USING (id = '00000000-0000-0000-0000-000000000001'::uuid);

CREATE POLICY "anon can update test profile for dev" 
ON public.profiles FOR UPDATE TO anon 
USING (id = '00000000-0000-0000-0000-000000000001'::uuid);

COMMENT ON POLICY "anon can view test profile for dev" ON public.profiles IS 
  'DEV ONLY: Allows anonymous access to test profile for development testing';

COMMENT ON POLICY "anon can update test profile for dev" ON public.profiles IS 
  'DEV ONLY: Allows anonymous updates to test profile for development testing';

-- User progress policies for test user
CREATE POLICY "anon can view test user progress for dev" 
ON public.user_step_progress FOR SELECT TO anon 
USING (user_id = '00000000-0000-0000-0000-000000000001'::uuid);

CREATE POLICY "anon can insert test user progress for dev" 
ON public.user_step_progress FOR INSERT TO anon 
WITH CHECK (user_id = '00000000-0000-0000-0000-000000000001'::uuid);

CREATE POLICY "anon can delete test user progress for dev" 
ON public.user_step_progress FOR DELETE TO anon 
USING (user_id = '00000000-0000-0000-0000-000000000001'::uuid);

COMMENT ON POLICY "anon can view test user progress for dev" ON public.user_step_progress IS 
  'DEV ONLY: Allows anonymous access to test user progress for development testing';

COMMENT ON POLICY "anon can insert test user progress for dev" ON public.user_step_progress IS 
  'DEV ONLY: Allows anonymous insert of test user progress for development testing';

COMMENT ON POLICY "anon can delete test user progress for dev" ON public.user_step_progress IS 
  'DEV ONLY: Allows anonymous delete of test user progress for development testing';

-- ============================================================================
-- CV Storage Policies for Test User (anon access)
-- ============================================================================

CREATE POLICY "anon can upload test user cv for dev"
ON storage.objects FOR INSERT TO anon
WITH CHECK (
  bucket_id = 'cv' AND
  (storage.foldername(name))[1] = '00000000-0000-0000-0000-000000000001'
);

CREATE POLICY "anon can view test user cv for dev"
ON storage.objects FOR SELECT TO anon
USING (
  bucket_id = 'cv' AND
  (storage.foldername(name))[1] = '00000000-0000-0000-0000-000000000001'
);

CREATE POLICY "anon can delete test user cv for dev"
ON storage.objects FOR DELETE TO anon
USING (
  bucket_id = 'cv' AND
  (storage.foldername(name))[1] = '00000000-0000-0000-0000-000000000001'
);

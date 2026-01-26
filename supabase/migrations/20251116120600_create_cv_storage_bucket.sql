-- ============================================================================
-- Migration: Create CV Storage Bucket
-- Created: 2025-11-16 12:06:00 UTC
-- Description: Creates storage bucket for CV files with appropriate policies
-- Notes: 
--   - Only PDF files allowed
--   - Max file size: 3MB (enforced in application code)
--   - Users can only access their own CV files
-- ============================================================================

-- ============================================================================
-- Create CV Storage Bucket
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cv',
  'cv',
  false,  -- Private bucket
  3145728,  -- 3MB in bytes
  ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Storage Policies for CV Bucket
-- ============================================================================

-- Policy: Users can upload their own CV
CREATE POLICY "users can upload own cv"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'cv' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can view their own CV
CREATE POLICY "users can view own cv"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'cv' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own CV (for future use if needed)
CREATE POLICY "users can delete own cv"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'cv' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- Development Policies for Test User
-- ============================================================================

-- Allow anon to upload CV for test user (development only)
CREATE POLICY "anon can upload test user cv for dev"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'cv' AND
  (storage.foldername(name))[1] = '00000000-0000-0000-0000-000000000001'
);

-- Allow anon to view test user CV (development only)
CREATE POLICY "anon can view test user cv for dev"
ON storage.objects
FOR SELECT
TO anon
USING (
  bucket_id = 'cv' AND
  (storage.foldername(name))[1] = '00000000-0000-0000-0000-000000000001'
);

-- Allow anon to delete test user CV (development only)
CREATE POLICY "anon can delete test user cv for dev"
ON storage.objects
FOR DELETE
TO anon
USING (
  bucket_id = 'cv' AND
  (storage.foldername(name))[1] = '00000000-0000-0000-0000-000000000001'
);

-- Note: Comments on storage policies omitted due to ownership restrictions

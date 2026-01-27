-- ============================================================================
-- Migration: Storage Buckets Configuration
-- Created: 2025-11-16 12:01:00 UTC
-- Description: Creates storage buckets for:
--              - CV files (private, PDF only, 3MB limit)
-- Note: Role avatars are served from public/avatars/ (static assets)
-- ============================================================================

-- ============================================================================
-- SECTION 1: CV STORAGE BUCKET
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

-- Storage Policies for CV Bucket
CREATE POLICY "users can upload own cv"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'cv' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "users can view own cv"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'cv' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "users can delete own cv"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'cv' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

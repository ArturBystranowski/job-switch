-- ============================================================================
-- Migration: Seed Data - UX/UI Designer Step Variants
-- Created: 2025-11-16 12:09:00 UTC
-- Description: Adds one variant per roadmap step for UX/UI Designer
-- Tables Affected: step_variants
-- ============================================================================

DO $$
DECLARE
  step_record RECORD;
BEGIN
  -- Add one variant for each UX/UI Designer step
  FOR step_record IN 
    SELECT rs.id, rs.title, rs.description
    FROM public.roadmap_steps rs
    JOIN public.roles r ON rs.role_id = r.id
    WHERE r.name = 'UX/UI Designer'
    ORDER BY rs.order_number
  LOOP
    INSERT INTO public.step_variants (step_id, order_number, title, description, estimated_hours)
    VALUES (
      step_record.id,
      1,
      step_record.title,
      step_record.description,
      NULL
    );
  END LOOP;

  RAISE NOTICE 'Successfully inserted variants for UX/UI Designer steps';
END $$;

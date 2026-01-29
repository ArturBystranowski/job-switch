-- ============================================================================
-- Verification Script for JobSwitch Database Schema
-- Purpose: Validate that all migrations were applied correctly
-- Usage: Run this script in Supabase SQL Editor after applying all migrations
-- ============================================================================

-- ============================================================================
-- 1. Verify Tables Existence
-- ============================================================================

SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'profiles', 'roles', 'roadmap_steps', 'step_tasks', 'user_step_progress',
    'questionnaire_questions', 'questionnaire_options'
  )
ORDER BY table_name;

-- Expected: 7 rows showing all tables as 'BASE TABLE'

-- ============================================================================
-- 2. Verify RLS is Enabled
-- ============================================================================

SELECT 
  schemaname,
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles', 'roles', 'roadmap_steps', 'step_tasks', 'user_step_progress',
    'questionnaire_questions', 'questionnaire_options'
  )
ORDER BY tablename;

-- Expected: All tables should have rls_enabled = true

-- ============================================================================
-- 3. Verify RLS Policies Count
-- ============================================================================

SELECT 
  schemaname,
  tablename,
  count(*) AS policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles', 'roles', 'roadmap_steps', 'step_tasks', 'user_step_progress',
    'questionnaire_questions', 'questionnaire_options'
  )
GROUP BY schemaname, tablename
ORDER BY tablename;

-- Expected policy counts (without dev user):
-- profiles: 3 (select, insert, update for authenticated)
-- roles: 2 (select for authenticated, select for anon)
-- roadmap_steps: 2 (select for authenticated, select for anon)
-- step_tasks: 2 (select for authenticated, select for anon)
-- user_step_progress: 3 (select, insert, delete for authenticated)
-- questionnaire_questions: 2 (select for authenticated, select for anon)
-- questionnaire_options: 2 (select for authenticated, select for anon)

-- With dev user (seed_dev_user migration):
-- profiles: 5 (+2 anon policies for test user)
-- user_step_progress: 6 (+3 anon policies for test user)

-- ============================================================================
-- 4. Verify Indexes
-- ============================================================================

SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles', 'roles', 'roadmap_steps', 'step_tasks', 'user_step_progress',
    'questionnaire_questions', 'questionnaire_options'
  )
ORDER BY tablename, indexname;

-- Expected: Multiple indexes including GIN indexes for JSONB columns

-- ============================================================================
-- 5. Verify Foreign Keys
-- ============================================================================

SELECT
  tc.table_name AS from_table,
  kcu.column_name AS from_column,
  ccu.table_name AS to_table,
  ccu.column_name AS to_column,
  rc.update_rule,
  rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN (
    'profiles', 'roadmap_steps', 'step_tasks', 'user_step_progress',
    'questionnaire_options'
  )
ORDER BY tc.table_name;

-- Expected foreign keys:
-- profiles.id -> auth.users(id) ON DELETE CASCADE
-- profiles.selected_role_id -> roles(id) ON DELETE SET NULL
-- roadmap_steps.role_id -> roles(id) ON DELETE CASCADE
-- step_tasks.step_id -> roadmap_steps(id) ON DELETE CASCADE
-- user_step_progress.user_id -> profiles(id) ON DELETE CASCADE
-- user_step_progress.step_task_id -> step_tasks(id) ON DELETE CASCADE
-- questionnaire_options.question_id -> questionnaire_questions(id) ON DELETE CASCADE

-- ============================================================================
-- 6. Verify Triggers
-- ============================================================================

SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_timing,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'auth'
  AND trigger_name = 'on_auth_user_created';

-- Expected: 1 trigger on auth.users table, AFTER INSERT

-- ============================================================================
-- 7. Verify Storage Buckets
-- ============================================================================

SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id IN ('cv', 'role-avatars')
ORDER BY id;

-- Expected: 2 buckets
-- cv: private, 3MB limit, PDF only
-- role-avatars: public, 1MB limit, PNG/JPEG/WebP

-- ============================================================================
-- 8. Verify Seed Data - Roles
-- ============================================================================

SELECT 
  id,
  name,
  image_url,
  substring(description, 1, 50) || '...' AS description_preview,
  created_at
FROM public.roles
ORDER BY id;

-- Expected: 5 roles with image_url:
-- 1. Frontend Developer (frontend_dev.png)
-- 2. Backend Developer (backend_dev.png)
-- 3. DevOps Engineer (devops.png)
-- 4. Data Analyst (data_analyst.png)
-- 5. UX/UI Designer (ux-ui_designer.png)

-- ============================================================================
-- 9. Verify Seed Data - Questionnaire
-- ============================================================================

SELECT 
  q.id,
  q.field_name,
  q.question_text,
  q.question_order,
  count(o.id) AS option_count
FROM public.questionnaire_questions q
LEFT JOIN public.questionnaire_options o ON q.id = o.question_id
GROUP BY q.id, q.field_name, q.question_text, q.question_order
ORDER BY q.question_order;

-- Expected: 5 questions, each with 3 options

-- ============================================================================
-- 10. Verify Seed Data - Roadmap Steps
-- ============================================================================

SELECT 
  r.name AS role_name,
  count(rs.id) AS step_count
FROM public.roles r
LEFT JOIN public.roadmap_steps rs ON r.id = rs.role_id
GROUP BY r.name
ORDER BY r.name;

-- Expected:
-- Frontend Developer: 10 steps
-- UX/UI Designer: 8 steps
-- Others: 0 steps

-- ============================================================================
-- 11. Verify Seed Data - Tasks per Step
-- ============================================================================

SELECT 
  r.name AS role_name,
  rs.order_number AS step_num,
  rs.title AS step_title,
  count(st.id) AS task_count
FROM public.roles r
JOIN public.roadmap_steps rs ON r.id = rs.role_id
LEFT JOIN public.step_tasks st ON rs.id = st.step_id
GROUP BY r.name, rs.order_number, rs.title
ORDER BY r.name, rs.order_number;

-- Expected:
-- Frontend Developer: 4-5 tasks per step (total 44 tasks)
-- UX/UI Designer: 1 task per step (total 8 tasks)

-- ============================================================================
-- 12. Verify UNIQUE Constraints
-- ============================================================================

SELECT
  tc.table_name,
  tc.constraint_name,
  string_agg(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) AS columns
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'UNIQUE'
  AND tc.table_schema = 'public'
  AND tc.table_name IN (
    'roles', 'roadmap_steps', 'step_tasks', 'user_step_progress',
    'questionnaire_questions', 'questionnaire_options'
  )
GROUP BY tc.table_name, tc.constraint_name
ORDER BY tc.table_name;

-- Expected unique constraints:
-- roles: name
-- roadmap_steps: (role_id, order_number)
-- step_tasks: (step_id, order_number)
-- user_step_progress: (user_id, step_task_id)
-- questionnaire_questions: field_name
-- questionnaire_options: (question_id, option_value)

-- ============================================================================
-- 13. Verify CHECK Constraints
-- ============================================================================

SELECT
  tc.table_name,
  tc.constraint_name,
  cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc 
  ON tc.constraint_name = cc.constraint_name
WHERE tc.constraint_type = 'CHECK'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('roadmap_steps', 'step_tasks')
ORDER BY tc.table_name;

-- Expected check constraints:
-- roadmap_steps: order_number BETWEEN 1 AND 15
-- step_tasks: order_number BETWEEN 1 AND 5

-- ============================================================================
-- Summary Report
-- ============================================================================

SELECT 
  'Tables' AS category,
  count(*) AS actual,
  7 AS expected,
  CASE WHEN count(*) = 7 THEN '✓ PASS' ELSE '✗ FAIL' END AS status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'profiles', 'roles', 'roadmap_steps', 'step_tasks', 'user_step_progress',
    'questionnaire_questions', 'questionnaire_options'
  )

UNION ALL

SELECT 
  'Roles (seed data)' AS category,
  count(*) AS actual,
  5 AS expected,
  CASE WHEN count(*) = 5 THEN '✓ PASS' ELSE '✗ FAIL' END AS status
FROM public.roles

UNION ALL

SELECT 
  'Questions (seed data)' AS category,
  count(*) AS actual,
  5 AS expected,
  CASE WHEN count(*) = 5 THEN '✓ PASS' ELSE '✗ FAIL' END AS status
FROM public.questionnaire_questions

UNION ALL

SELECT 
  'Options (seed data)' AS category,
  count(*) AS actual,
  15 AS expected,
  CASE WHEN count(*) = 15 THEN '✓ PASS' ELSE '✗ FAIL' END AS status
FROM public.questionnaire_options

UNION ALL

SELECT 
  'Frontend Dev Steps' AS category,
  count(*) AS actual,
  10 AS expected,
  CASE WHEN count(*) = 10 THEN '✓ PASS' ELSE '✗ FAIL' END AS status
FROM public.roadmap_steps rs
JOIN public.roles r ON rs.role_id = r.id
WHERE r.name = 'Frontend Developer'

UNION ALL

SELECT 
  'Frontend Dev Tasks' AS category,
  count(*) AS actual,
  44 AS expected,
  CASE WHEN count(*) = 44 THEN '✓ PASS' ELSE '✗ FAIL' END AS status
FROM public.step_tasks st
JOIN public.roadmap_steps rs ON st.step_id = rs.id
JOIN public.roles r ON rs.role_id = r.id
WHERE r.name = 'Frontend Developer'

UNION ALL

SELECT 
  'UX/UI Designer Steps' AS category,
  count(*) AS actual,
  8 AS expected,
  CASE WHEN count(*) = 8 THEN '✓ PASS' ELSE '✗ FAIL' END AS status
FROM public.roadmap_steps rs
JOIN public.roles r ON rs.role_id = r.id
WHERE r.name = 'UX/UI Designer'

UNION ALL

SELECT 
  'Storage Buckets' AS category,
  count(*) AS actual,
  2 AS expected,
  CASE WHEN count(*) = 2 THEN '✓ PASS' ELSE '✗ FAIL' END AS status
FROM storage.buckets
WHERE id IN ('cv', 'role-avatars')

UNION ALL

SELECT 
  'Triggers' AS category,
  count(*) AS actual,
  1 AS expected,
  CASE WHEN count(*) = 1 THEN '✓ PASS' ELSE '✗ FAIL' END AS status
FROM information_schema.triggers
WHERE trigger_schema = 'auth'
  AND trigger_name = 'on_auth_user_created';

-- Expected: All rows should show '✓ PASS'

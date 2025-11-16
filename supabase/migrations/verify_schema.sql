-- ============================================================================
-- Verification Script for JobSwitch Database Schema
-- Purpose: Validate that all migrations were applied correctly
-- Usage: Run this script in Supabase SQL Editor after applying all migrations
-- ============================================================================

-- ============================================================================
-- 1. Verify Tables Existence
-- ============================================================================

select 
  table_name,
  table_type
from information_schema.tables
where table_schema = 'public'
  and table_name in ('profiles', 'roles', 'roadmap_steps', 'step_variants', 'user_step_progress')
order by table_name;

-- Expected: 5 rows showing all tables as 'BASE TABLE'

-- ============================================================================
-- 2. Verify RLS is Enabled
-- ============================================================================

select 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
from pg_tables
where schemaname = 'public'
  and tablename in ('profiles', 'roles', 'roadmap_steps', 'step_variants', 'user_step_progress')
order by tablename;

-- Expected: All tables should have rls_enabled = true

-- ============================================================================
-- 3. Verify RLS Policies Count
-- ============================================================================

select 
  schemaname,
  tablename,
  count(*) as policy_count
from pg_policies
where schemaname = 'public'
  and tablename in ('profiles', 'roles', 'roadmap_steps', 'step_variants', 'user_step_progress')
group by schemaname, tablename
order by tablename;

-- Expected policy counts:
-- profiles: 3 (select, insert, update)
-- roles: 2 (select for authenticated, select for anon)
-- roadmap_steps: 2 (select for authenticated, select for anon)
-- step_variants: 2 (select for authenticated, select for anon)
-- user_step_progress: 3 (select, insert, delete)

-- ============================================================================
-- 4. Verify Indexes
-- ============================================================================

select 
  schemaname,
  tablename,
  indexname,
  indexdef
from pg_indexes
where schemaname = 'public'
  and tablename in ('profiles', 'roles', 'roadmap_steps', 'step_variants', 'user_step_progress')
order by tablename, indexname;

-- Expected: Multiple indexes including GIN indexes for JSONB columns

-- ============================================================================
-- 5. Verify Foreign Keys
-- ============================================================================

select
  tc.table_name as from_table,
  kcu.column_name as from_column,
  ccu.table_name as to_table,
  ccu.column_name as to_column,
  rc.update_rule,
  rc.delete_rule
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu 
  on tc.constraint_name = kcu.constraint_name
join information_schema.constraint_column_usage ccu 
  on ccu.constraint_name = tc.constraint_name
join information_schema.referential_constraints rc
  on rc.constraint_name = tc.constraint_name
where tc.constraint_type = 'FOREIGN KEY'
  and tc.table_schema = 'public'
  and tc.table_name in ('profiles', 'roadmap_steps', 'step_variants', 'user_step_progress')
order by tc.table_name;

-- Expected foreign keys:
-- profiles.id -> auth.users(id) ON DELETE CASCADE
-- profiles.selected_role_id -> roles(id) ON DELETE SET NULL
-- roadmap_steps.role_id -> roles(id) ON DELETE CASCADE
-- step_variants.step_id -> roadmap_steps(id) ON DELETE CASCADE
-- user_step_progress.user_id -> profiles(id) ON DELETE CASCADE
-- user_step_progress.step_variant_id -> step_variants(id) ON DELETE CASCADE

-- ============================================================================
-- 6. Verify Triggers
-- ============================================================================

select 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_timing,
  action_statement
from information_schema.triggers
where trigger_schema = 'auth'
  and trigger_name = 'on_auth_user_created';

-- Expected: 1 trigger on auth.users table, AFTER INSERT

-- ============================================================================
-- 7. Verify Seed Data - Roles
-- ============================================================================

select 
  id,
  name,
  substring(description, 1, 50) || '...' as description_preview,
  created_at
from public.roles
order by id;

-- Expected: 5 roles (Frontend Developer, Backend Developer, DevOps Engineer, Data Analyst, UX/UI Designer)

-- ============================================================================
-- 8. Verify Seed Data - Roadmap Steps for Frontend Developer
-- ============================================================================

select 
  rs.order_number,
  rs.title,
  substring(rs.description, 1, 50) || '...' as description_preview,
  r.name as role_name
from public.roadmap_steps rs
join public.roles r on rs.role_id = r.id
where r.name = 'Frontend Developer'
order by rs.order_number;

-- Expected: 10 steps ordered from 1 to 10

-- ============================================================================
-- 9. Verify Step Count per Role
-- ============================================================================

select 
  r.name as role_name,
  count(rs.id) as step_count
from public.roles r
left join public.roadmap_steps rs on r.id = rs.role_id
group by r.name
order by r.name;

-- Expected: Frontend Developer has 10 steps, others have 0

-- ============================================================================
-- 10. Verify UNIQUE Constraints
-- ============================================================================

select
  tc.table_name,
  tc.constraint_name,
  string_agg(kcu.column_name, ', ' order by kcu.ordinal_position) as columns
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu 
  on tc.constraint_name = kcu.constraint_name
where tc.constraint_type = 'UNIQUE'
  and tc.table_schema = 'public'
  and tc.table_name in ('roles', 'roadmap_steps', 'step_variants', 'user_step_progress')
group by tc.table_name, tc.constraint_name
order by tc.table_name;

-- Expected unique constraints:
-- roles: name
-- roadmap_steps: (role_id, order_number)
-- step_variants: (step_id, order_number)
-- user_step_progress: (user_id, step_variant_id)

-- ============================================================================
-- 11. Verify CHECK Constraints
-- ============================================================================

select
  tc.table_name,
  tc.constraint_name,
  cc.check_clause
from information_schema.table_constraints tc
join information_schema.check_constraints cc 
  on tc.constraint_name = cc.constraint_name
where tc.constraint_type = 'CHECK'
  and tc.table_schema = 'public'
  and tc.table_name in ('roadmap_steps', 'step_variants')
order by tc.table_name;

-- Expected check constraints:
-- roadmap_steps: order_number BETWEEN 1 AND 10
-- step_variants: order_number BETWEEN 1 AND 3

-- ============================================================================
-- 12. Verify JSONB Columns Structure (Sample)
-- ============================================================================

-- This will only work if there's at least one profile with data
-- Uncomment after creating test users

-- select 
--   id,
--   jsonb_pretty(questionnaire_responses) as questionnaire_sample,
--   jsonb_pretty(ai_recommendations) as ai_recommendations_sample
-- from public.profiles
-- where questionnaire_responses is not null
-- limit 1;

-- ============================================================================
-- Summary Report
-- ============================================================================

select 
  'Tables' as category,
  count(*) as actual,
  5 as expected,
  case when count(*) = 5 then '✓ PASS' else '✗ FAIL' end as status
from information_schema.tables
where table_schema = 'public'
  and table_name in ('profiles', 'roles', 'roadmap_steps', 'step_variants', 'user_step_progress')

union all

select 
  'RLS Policies' as category,
  count(*) as actual,
  12 as expected,
  case when count(*) = 12 then '✓ PASS' else '✗ FAIL' end as status
from pg_policies
where schemaname = 'public'
  and tablename in ('profiles', 'roles', 'roadmap_steps', 'step_variants', 'user_step_progress')

union all

select 
  'Roles (seed data)' as category,
  count(*) as actual,
  5 as expected,
  case when count(*) = 5 then '✓ PASS' else '✗ FAIL' end as status
from public.roles

union all

select 
  'Roadmap Steps (seed data)' as category,
  count(*) as actual,
  10 as expected,
  case when count(*) = 10 then '✓ PASS' else '✗ FAIL' end as status
from public.roadmap_steps
where role_id = 1

union all

select 
  'Triggers' as category,
  count(*) as actual,
  1 as expected,
  case when count(*) = 1 then '✓ PASS' else '✗ FAIL' end as status
from information_schema.triggers
where trigger_schema = 'auth'
  and trigger_name = 'on_auth_user_created';

-- Expected: All rows should show '✓ PASS'


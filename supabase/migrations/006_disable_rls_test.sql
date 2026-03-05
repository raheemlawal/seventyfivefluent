-- WARNING: This migration DISABLES RLS for testing purposes only
-- DO NOT use this in production! This removes all security protections.
-- 
-- This is a temporary test to see if RLS is causing the 406 errors.
-- After testing, you should re-enable RLS by running:
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- Disable RLS on profiles and daily_logs
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs DISABLE ROW LEVEL SECURITY;

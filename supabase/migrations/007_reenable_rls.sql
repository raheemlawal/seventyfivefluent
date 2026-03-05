-- Re-enable RLS after testing
-- Run this migration to restore security after testing with RLS disabled

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

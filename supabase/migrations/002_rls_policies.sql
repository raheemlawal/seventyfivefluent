-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Public profiles can be viewed by anyone (for future leaderboard use)
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (is_public = true);

-- Daily logs policies
-- Users can view their own daily logs
CREATE POLICY "Users can view own daily logs"
  ON daily_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own daily logs
CREATE POLICY "Users can insert own daily logs"
  ON daily_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own daily logs
CREATE POLICY "Users can update own daily logs"
  ON daily_logs FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own daily logs
CREATE POLICY "Users can delete own daily logs"
  ON daily_logs FOR DELETE
  USING (auth.uid() = user_id);


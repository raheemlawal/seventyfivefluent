-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  primary_language TEXT NOT NULL,
  target_languages TEXT[] NOT NULL DEFAULT '{}',
  start_date DATE NOT NULL,
  is_public BOOLEAN DEFAULT false,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_completed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create daily_logs table
CREATE TABLE IF NOT EXISTS daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  study_minutes INTEGER DEFAULT 0,
  reading_pages INTEGER DEFAULT 0,
  speaking_done BOOLEAN DEFAULT false,
  media_done BOOLEAN DEFAULT false,
  media_title TEXT,
  media_url TEXT,
  journal_entry TEXT,
  immersion_done BOOLEAN DEFAULT false,
  immersion_note TEXT,
  study_log_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, log_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_id ON daily_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_log_date ON daily_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON daily_logs(user_id, log_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_logs_updated_at
  BEFORE UPDATE ON daily_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- Function to calculate streak stats for a user
CREATE OR REPLACE FUNCTION calculate_streak_stats(p_user_id UUID)
RETURNS TABLE (
  current_streak INTEGER,
  longest_streak INTEGER,
  total_completed INTEGER
) AS $$
DECLARE
  v_current_streak INTEGER := 0;
  v_longest_streak INTEGER := 0;
  v_total_completed INTEGER := 0;
  v_temp_streak INTEGER := 0;
  v_prev_date DATE;
  v_log_date DATE;
  v_completed BOOLEAN;
  v_timezone TEXT;
BEGIN
  -- Get user's timezone
  SELECT timezone INTO v_timezone FROM profiles WHERE id = p_user_id;
  IF v_timezone IS NULL THEN
    v_timezone := 'UTC';
  END IF;

  -- Calculate completion for each day
  -- A day is complete if:
  -- - study_minutes >= 60
  -- - reading_pages >= 5
  -- - speaking_done = true
  -- - media_done = true
  -- - immersion_done = true
  -- - journal_entry IS NOT NULL AND journal_entry != ''
  -- - study_log_note IS NOT NULL AND study_log_note != ''

  -- Get all logs ordered by date descending
  FOR v_log_date, v_completed IN
    SELECT 
      log_date,
      (
        study_minutes >= 60 AND
        reading_pages >= 5 AND
        speaking_done = true AND
        media_done = true AND
        immersion_done = true AND
        journal_entry IS NOT NULL AND journal_entry != '' AND
        study_log_note IS NOT NULL AND study_log_note != ''
      ) as completed
    FROM daily_logs
    WHERE user_id = p_user_id
    ORDER BY log_date DESC
  LOOP
    IF v_completed THEN
      v_total_completed := v_total_completed + 1;
      
      -- Check if this continues the streak
      IF v_prev_date IS NULL THEN
        -- First completed day, start streak
        v_temp_streak := 1;
        v_current_streak := 1;
      ELSIF v_log_date = v_prev_date - INTERVAL '1 day' THEN
        -- Consecutive day, continue streak
        v_temp_streak := v_temp_streak + 1;
        v_current_streak := v_temp_streak;
      ELSE
        -- Gap found, streak broken
        -- If we haven't set current_streak yet, this is the start
        IF v_current_streak = 0 THEN
          v_current_streak := 1;
        END IF;
        v_temp_streak := 1;
      END IF;
      
      -- Track longest streak
      IF v_temp_streak > v_longest_streak THEN
        v_longest_streak := v_temp_streak;
      END IF;
      
      v_prev_date := v_log_date;
    ELSE
      -- Day not completed
      -- If this is before the most recent completed day, we've passed the current streak
      IF v_prev_date IS NOT NULL AND v_log_date < v_prev_date THEN
        -- We've already counted the current streak, exit
        EXIT;
      END IF;
      -- Reset temp streak for incomplete days
      v_temp_streak := 0;
    END IF;
  END LOOP;

  RETURN QUERY SELECT v_current_streak, v_longest_streak, v_total_completed;
END;
$$ LANGUAGE plpgsql;

-- Function to update streak stats in profiles
CREATE OR REPLACE FUNCTION update_streak_stats()
RETURNS TRIGGER AS $$
DECLARE
  v_stats RECORD;
  v_user_id UUID;
BEGIN
  -- Determine which user_id to update
  IF TG_OP = 'DELETE' THEN
    v_user_id := OLD.user_id;
  ELSE
    v_user_id := NEW.user_id;
  END IF;

  -- Calculate new stats
  SELECT * INTO v_stats FROM calculate_streak_stats(v_user_id);

  -- Update profiles table
  UPDATE profiles
  SET 
    current_streak = v_stats.current_streak,
    longest_streak = v_stats.longest_streak,
    total_completed = v_stats.total_completed,
    updated_at = NOW()
  WHERE id = v_user_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update streak stats after daily_logs changes
CREATE TRIGGER trigger_update_streak_stats
  AFTER INSERT OR UPDATE OR DELETE ON daily_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_streak_stats();


-- Username availability check (bypasses RLS so we can see if any profile has the username)
-- Run this in Supabase SQL Editor if not using migrations, or it runs automatically with: supabase db push
CREATE OR REPLACE FUNCTION check_username_available(p_username TEXT, p_exclude_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Returns TRUE if username is available, FALSE if taken
  RETURN NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE username = p_username
    AND (p_exclude_user_id IS NULL OR id != p_exclude_user_id)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION check_username_available(TEXT, UUID) TO authenticated;

-- ============================================================
-- Username availability check - run in Supabase SQL Editor
-- ============================================================
-- Copy and paste this entire file into: Supabase Dashboard > SQL Editor > New query
-- Then click "Run"
-- ============================================================

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

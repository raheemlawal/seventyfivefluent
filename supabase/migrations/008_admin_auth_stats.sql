-- Create function to get auth user statistics (admin only)
CREATE OR REPLACE FUNCTION get_auth_user_stats()
RETURNS TABLE (
  total_auth_users BIGINT,
  confirmed_users BIGINT,
  unconfirmed_users BIGINT,
  users_with_profiles BIGINT
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM auth.users)::BIGINT as total_auth_users,
    (SELECT COUNT(*) FROM auth.users WHERE email_confirmed_at IS NOT NULL)::BIGINT as confirmed_users,
    (SELECT COUNT(*) FROM auth.users WHERE email_confirmed_at IS NULL)::BIGINT as unconfirmed_users,
    (SELECT COUNT(*) FROM profiles)::BIGINT as users_with_profiles;
END;
$$;

-- Grant execute permission to authenticated users (function checks admin status internally)
GRANT EXECUTE ON FUNCTION get_auth_user_stats() TO authenticated;

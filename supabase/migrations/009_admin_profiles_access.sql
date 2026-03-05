-- Add RLS policy to allow admins to view all profiles
-- This is needed for the admin dashboard to see all user data
-- Uses is_admin() function (SECURITY DEFINER) to avoid circular RLS dependency

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO public
  USING (is_admin(auth.uid()));

-- Add RLS policy to allow admins to view all daily logs
-- This is needed for the admin dashboard analytics
-- Uses is_admin() function (SECURITY DEFINER) to avoid circular RLS dependency

CREATE POLICY "Admins can view all daily logs"
  ON daily_logs FOR SELECT
  TO public
  USING (is_admin(auth.uid()));

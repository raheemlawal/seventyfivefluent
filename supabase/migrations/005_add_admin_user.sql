-- Add admin user to admin_users table
-- 
-- IMPORTANT: Before running this migration, you must first create the user in Supabase Auth:
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Click "Add user" → "Create new user"
-- 3. Email: admin@75fluent.com
-- 4. Password: admin123
-- 5. Auto Confirm User: ON
-- 6. Click "Create user"
--
-- Then run this migration to add the user to the admin_users table.

-- Insert admin user into admin_users table
-- This will only work if the user exists in auth.users
INSERT INTO admin_users (id, email)
SELECT id, email
FROM auth.users
WHERE email = 'admin@75fluent.com'
ON CONFLICT (id) DO NOTHING;

-- Verify the admin user was added
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_users WHERE email = 'admin@75fluent.com') THEN
    RAISE NOTICE 'Admin user successfully added to admin_users table';
  ELSE
    RAISE WARNING 'Admin user not found. Make sure the user exists in auth.users first.';
  END IF;
END $$;

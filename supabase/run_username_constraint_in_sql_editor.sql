-- ============================================================
-- Username format enforcement (new accounts only) - run in Supabase SQL Editor
-- ============================================================
-- Copy and paste this into: Supabase Dashboard > SQL Editor > New query
-- Then click "Run"
--
-- Enforces for NEW accounts: 3-20 characters, letters/numbers/underscores/hyphens only
-- NOT VALID = existing profiles are left as-is; only future INSERTs/UPDATEs are validated
-- ============================================================

ALTER TABLE profiles
ADD CONSTRAINT profiles_username_format
CHECK (username ~ '^[a-zA-Z0-9_-]{3,20}$') NOT VALID;

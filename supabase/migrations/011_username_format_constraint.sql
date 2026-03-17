-- Enforce username format for NEW accounts only: 3-20 chars, letters/numbers/underscores/hyphens
-- NOT VALID = skip validation of existing rows; only applies to future INSERTs and UPDATEs
ALTER TABLE profiles
ADD CONSTRAINT profiles_username_format
CHECK (username ~ '^[a-zA-Z0-9_-]{3,20}$') NOT VALID;

-- Remove authentication columns from profiles table
ALTER TABLE profiles
DROP COLUMN IF EXISTS password,
DROP COLUMN IF EXISTS auth_method,
DROP COLUMN IF EXISTS last_login;

-- Add a comment to the table
COMMENT ON TABLE profiles IS 'Stores user profile information, linked to auth.users via id';

-- First, remove records from dependent tables that reference non-existent profiles
DELETE FROM medical_reports
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM messages
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM calls
WHERE caller_id NOT IN (SELECT id FROM auth.users)
   OR receiver_id NOT IN (SELECT id FROM auth.users);

DELETE FROM call_signals
WHERE from_user NOT IN (SELECT id FROM auth.users)
   OR to_user NOT IN (SELECT id FROM auth.users);

-- Now remove profiles that don't have matching auth.users
DELETE FROM profiles
WHERE id NOT IN (SELECT id FROM auth.users);

-- Finally add the foreign key constraint
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_id_fkey,
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE; 
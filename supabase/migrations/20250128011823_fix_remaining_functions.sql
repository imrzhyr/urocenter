-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS public.gen_random_uuid();
DROP FUNCTION IF EXISTS public.set_user_context();

-- Create a secure wrapper for gen_random_uuid
CREATE OR REPLACE FUNCTION public.gen_random_uuid()
RETURNS uuid
LANGUAGE sql
SECURITY INVOKER
SET search_path = pg_catalog, pg_temp
AS $$
  SELECT pg_catalog.gen_random_uuid();
$$;

-- Implement set_user_context with proper security settings
CREATE OR REPLACE FUNCTION public.set_user_context()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
  _user_id uuid;
  _user_role text;
BEGIN
  -- Get the current user's ID from auth.uid()
  _user_id := auth.uid();
  
  -- Get the user's role from profiles
  SELECT role INTO _user_role
  FROM public.profiles
  WHERE id = _user_id;

  -- Set session variables
  PERFORM set_config('app.current_user_id', _user_id::text, false);
  PERFORM set_config('app.user_role', COALESCE(_user_role, 'patient'), false);
END;
$$;

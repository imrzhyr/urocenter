-- Drop the existing function
DROP FUNCTION IF EXISTS public.set_user_context();

-- Create a more secure version of set_user_context
CREATE OR REPLACE FUNCTION public.set_user_context()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO pg_catalog, public, pg_temp
SET role TO postgres
AS $$
DECLARE
  _user_id uuid;
  _user_role text;
BEGIN
  -- Get the current user's ID from auth.uid()
  _user_id := auth.uid();
  
  -- Get the user's role from profiles using fully qualified names
  SELECT p.role INTO STRICT _user_role
  FROM public.profiles p
  WHERE p.id = _user_id;

  -- Set session variables using fully qualified function names
  PERFORM pg_catalog.set_config('app.current_user_id', _user_id::text, false);
  PERFORM pg_catalog.set_config('app.user_role', COALESCE(_user_role, 'patient'), false);
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    PERFORM pg_catalog.set_config('app.current_user_id', _user_id::text, false);
    PERFORM pg_catalog.set_config('app.user_role', 'patient', false);
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error setting user context: %', SQLERRM;
END;
$$;

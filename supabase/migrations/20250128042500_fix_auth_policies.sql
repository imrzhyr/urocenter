-- First drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their messages" ON public.messages;
DROP POLICY IF EXISTS "Users can create messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update their messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view their calls" ON public.calls;
DROP POLICY IF EXISTS "Users can create calls" ON public.calls;
DROP POLICY IF EXISTS "Users can update their calls" ON public.calls;
DROP POLICY IF EXISTS "Users can view their call signals" ON public.call_signals;
DROP POLICY IF EXISTS "Users can create call signals" ON public.call_signals;
DROP POLICY IF EXISTS "Users can view their medical reports" ON public.medical_reports;
DROP POLICY IF EXISTS "Users can create medical reports" ON public.medical_reports;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_reports ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow new users to create their profile
CREATE POLICY "Users can create their profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow users to read their own messages
CREATE POLICY "Users can view their messages"
ON public.messages FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Allow users to create messages
CREATE POLICY "Users can create messages"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Allow users to update their own messages
CREATE POLICY "Users can update their messages"
ON public.messages FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Allow users to read their own calls
CREATE POLICY "Users can view their calls"
ON public.calls FOR SELECT
TO authenticated
USING (caller_id = auth.uid() OR receiver_id = auth.uid());

-- Allow users to create calls
CREATE POLICY "Users can create calls"
ON public.calls FOR INSERT
TO authenticated
WITH CHECK (caller_id = auth.uid());

-- Allow users to update their own calls
CREATE POLICY "Users can update their calls"
ON public.calls FOR UPDATE
TO authenticated
USING (caller_id = auth.uid() OR receiver_id = auth.uid())
WITH CHECK (caller_id = auth.uid() OR receiver_id = auth.uid());

-- Allow users to read signals for their calls
CREATE POLICY "Users can view their call signals"
ON public.call_signals FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.calls
    WHERE calls.id = call_signals.call_id
    AND (calls.caller_id = auth.uid() OR calls.receiver_id = auth.uid())
  )
);

-- Allow users to create signals
CREATE POLICY "Users can create call signals"
ON public.call_signals FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.calls
    WHERE calls.id = call_signals.call_id
    AND (calls.caller_id = auth.uid() OR calls.receiver_id = auth.uid())
  )
);

-- Allow users to read their own medical reports
CREATE POLICY "Users can view their medical reports"
ON public.medical_reports FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Allow users to create medical reports
CREATE POLICY "Users can create medical reports"
ON public.medical_reports FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Fix function search paths to address security warnings
ALTER FUNCTION public.gen_random_uuid() SET search_path = pg_catalog, pg_temp;
ALTER FUNCTION public.set_user_context() SET search_path = pg_catalog, public, pg_temp;
ALTER FUNCTION public.check_rls_status() SET search_path = pg_catalog, public, pg_temp;
ALTER FUNCTION public.check_rls_policies() SET search_path = pg_catalog, public, pg_temp;
ALTER FUNCTION public.verify_rls() SET search_path = pg_catalog, public, pg_temp;
ALTER FUNCTION public.get_admin_stats() SET search_path = pg_catalog, public, pg_temp; 

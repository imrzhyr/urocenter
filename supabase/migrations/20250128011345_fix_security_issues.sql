-- Drop existing views
DROP VIEW IF EXISTS public.rls_status;
DROP VIEW IF EXISTS public.rls_policies;

-- Create admin check function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Recreate views with security_invoker and admin check
CREATE OR REPLACE VIEW public.rls_status WITH (security_invoker = true) AS
SELECT schemaname, tablename, rowsecurity as hasrls
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'messages', 'calls', 'call_signals', 'medical_reports')
AND public.is_admin();

CREATE OR REPLACE VIEW public.rls_policies WITH (security_invoker = true) AS
SELECT 
    n.nspname as schema_name,
    t.relname as table_name,
    p.polname as policy_name,
    p.polcmd as command,
    pg_get_expr(p.polqual, p.polrelid, true) as policy_expression
FROM pg_policy p
JOIN pg_class t ON t.oid = p.polrelid
JOIN pg_namespace n ON n.oid = t.relnamespace
WHERE n.nspname = 'public'
AND t.relname IN ('profiles', 'messages', 'calls', 'call_signals', 'medical_reports')
AND public.is_admin();

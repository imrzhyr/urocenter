-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_reports ENABLE ROW LEVEL SECURITY;

-- Create a view to check RLS status with admin-only access
CREATE OR REPLACE VIEW public.rls_status WITH (security_invoker = true) AS
SELECT schemaname, tablename, rowsecurity as hasrls
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'messages', 'calls', 'call_signals', 'medical_reports');

-- Create RLS policy for rls_status view
CREATE POLICY admin_rls_status ON public.rls_status
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create a view to check RLS policies with admin-only access
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
AND t.relname IN ('profiles', 'messages', 'calls', 'call_signals', 'medical_reports');

-- Create RLS policy for rls_policies view
CREATE POLICY admin_rls_policies ON public.rls_policies
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
); 
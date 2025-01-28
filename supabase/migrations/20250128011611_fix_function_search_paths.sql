-- Fix set_user_context function
CREATE OR REPLACE FUNCTION public.set_user_context()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
BEGIN
  -- Your existing function logic here
END;
$$;

-- Fix check_rls_status function
CREATE OR REPLACE FUNCTION public.check_rls_status()
RETURNS TABLE(schemaname text, tablename text, hasrls boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
BEGIN
  RETURN QUERY
  SELECT t.schemaname::text, t.tablename::text, t.rowsecurity
  FROM pg_tables t
  WHERE t.schemaname = 'public'
  AND t.tablename IN ('profiles', 'messages', 'calls', 'call_signals', 'medical_reports');
END;
$$;

-- Fix check_rls_policies function
CREATE OR REPLACE FUNCTION public.check_rls_policies()
RETURNS TABLE(
  schema_name text,
  table_name text,
  policy_name text,
  command text,
  policy_expression text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.nspname::text as schema_name,
    t.relname::text as table_name,
    p.polname::text as policy_name,
    p.polcmd::text as command,
    pg_get_expr(p.polqual, p.polrelid, true)::text as policy_expression
  FROM pg_policy p
  JOIN pg_class t ON t.oid = p.polrelid
  JOIN pg_namespace n ON n.oid = t.relnamespace
  WHERE n.nspname = 'public'
  AND t.relname IN ('profiles', 'messages', 'calls', 'call_signals', 'medical_reports');
END;
$$;

-- Fix verify_rls function
CREATE OR REPLACE FUNCTION public.verify_rls()
RETURNS TABLE (
    table_name text,
    rls_enabled boolean,
    policies_count bigint,
    policies text[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.tablename::text,
        t.rowsecurity,
        COUNT(p.polname)::bigint,
        CASE 
            WHEN COUNT(p.polname) > 0 THEN array_agg(p.polname)
            ELSE NULL::text[]
        END
    FROM pg_tables t
    LEFT JOIN pg_class c ON t.tablename = c.relname AND t.schemaname = c.relnamespace::regnamespace::text
    LEFT JOIN pg_policy p ON c.oid = p.polrelid
    WHERE t.schemaname = 'public'
    AND t.tablename IN ('profiles', 'messages', 'calls', 'call_signals', 'medical_reports')
    GROUP BY t.tablename, t.rowsecurity;
END;
$$;

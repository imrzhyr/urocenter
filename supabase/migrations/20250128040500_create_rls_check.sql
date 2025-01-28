-- Create function to check RLS status
CREATE OR REPLACE FUNCTION check_rls_status()
RETURNS TABLE(schemaname text, tablename text, hasrls boolean) AS $$
BEGIN
  RETURN QUERY
  SELECT t.schemaname::text, t.tablename::text, t.hasrls
  FROM pg_tables t
  WHERE t.schemaname = 'public'
  AND t.tablename IN ('profiles', 'messages', 'calls', 'call_signals', 'medical_reports');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check RLS policies
CREATE OR REPLACE FUNCTION check_rls_policies()
RETURNS TABLE(
  schema_name text,
  table_name text,
  policy_name text,
  command text,
  policy_expression text
) AS $$
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
  AND t.relname IN ('profiles', 'messages', 'calls', 'call_signals', 'medical_reports')
  ORDER BY n.nspname, t.relname, p.polname;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
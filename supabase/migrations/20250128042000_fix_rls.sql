-- Step 1: Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_reports ENABLE ROW LEVEL SECURITY;

-- Step 2: Create helper functions to verify RLS status
CREATE OR REPLACE FUNCTION public.verify_rls()
RETURNS TABLE (
    table_name text,
    rls_enabled boolean,
    policies_count bigint,
    policies text[]
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Verify the changes
SELECT * FROM public.verify_rls(); 
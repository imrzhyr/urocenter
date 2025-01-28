# Supabase Assistant Guide

## Connection and Project Setup

1. **Project Linking**
```bash
supabase link --project-ref <project-ref>
```
- Always run this first if connection issues occur
- Project ref can be found in the Supabase dashboard URL

2. **Database Migrations**
```bash
# Create new migration
supabase migration new <migration_name>

# Apply migrations
supabase db push --include-all  # For all pending migrations
supabase db push               # For latest migration only
```

## Common Migration Patterns

### 1. RLS (Row Level Security)

```sql
-- Enable RLS
ALTER TABLE public.table_name ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies
CREATE POLICY "policy_name" ON public.table_name
  FOR operation  -- SELECT, INSERT, UPDATE, DELETE, ALL
  TO authenticated
  USING (auth.uid() = user_id)  -- For SELECT, DELETE
  WITH CHECK (auth.uid() = user_id);  -- For INSERT, UPDATE
```

### 2. Function Security Best Practices

```sql
CREATE OR REPLACE FUNCTION public.function_name()
RETURNS return_type
LANGUAGE plpgsql  -- or sql for simple functions
SECURITY DEFINER  -- or INVOKER depending on needs
SET search_path TO pg_catalog, public, pg_temp  -- Always set this
SET role TO postgres  -- For elevated privileges when needed
AS $$
BEGIN
  -- Use fully qualified names: public.table_name, pg_catalog.function_name
  -- Handle exceptions explicitly
  -- Use STRICT for SELECT INTO when appropriate
END;
$$;
```

### 3. View Security

```sql
-- Create secure views
CREATE OR REPLACE VIEW public.view_name 
WITH (security_invoker = true)  -- Always use this
AS SELECT ...;

-- For admin-only views, include security check in the view itself
SELECT ... 
FROM ...
WHERE (
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

## Common Issues and Solutions

1. **Search Path Warnings**
   - Always use `SET search_path TO pg_catalog, public, pg_temp`
   - Use fully qualified names for functions and tables

2. **Function Security**
   - Use `SECURITY DEFINER` for functions that need elevated privileges
   - Use `SECURITY INVOKER` for functions that should run as the calling user
   - Always set search_path
   - Use explicit schema qualification

3. **RLS Policies**
   - Drop existing policies before recreating
   - Handle both USING and WITH CHECK clauses
   - Consider admin bypass policies when needed

4. **Migration Order**
   - Handle dependencies first (foreign keys, referenced tables)
   - Drop objects before recreating
   - Enable RLS after creating policies

## Testing Changes

1. **RLS Testing**
```sql
-- Check RLS status
SELECT * FROM public.verify_rls();

-- Test as different users
SET LOCAL ROLE authenticated;
SET LOCAL auth.uid TO 'user-uuid';
```

2. **Function Testing**
```sql
-- Test function execution
SELECT public.function_name();

-- Check search path
SHOW search_path;
```

## Security Checklist

- [ ] RLS enabled on all tables
- [ ] Appropriate policies for each operation
- [ ] Functions have fixed search paths
- [ ] Views use security_invoker
- [ ] Admin access properly restricted
- [ ] Foreign key constraints properly set
- [ ] Error handling in place
- [ ] Proper schema qualification used 
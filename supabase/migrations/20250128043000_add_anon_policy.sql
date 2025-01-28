-- Allow unauthenticated users to create profiles during sign-up
CREATE POLICY "Allow anon profile creation"
ON public.profiles FOR INSERT
TO anon
WITH CHECK (true);

-- Allow profile lookup by phone during sign-in
CREATE POLICY "Allow phone lookup"
ON public.profiles FOR SELECT
TO anon
USING (true); 
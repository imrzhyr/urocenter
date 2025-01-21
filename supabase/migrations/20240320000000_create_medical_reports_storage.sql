-- Drop existing policies
drop policy if exists "Public Access" on storage.objects;

-- Enable public access for the bucket
update storage.buckets
set public = true
where id = 'medical_reports';

-- Create a new permissive policy
create policy "Allow all operations"
on storage.objects for all
using ( true )
with check ( true );

-- Disable RLS
alter table storage.objects disable row level security; 
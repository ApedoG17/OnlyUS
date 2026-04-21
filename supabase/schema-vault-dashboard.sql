-- 1. Create the vault_media table
CREATE TABLE public.vault_media (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    connection_id uuid NOT NULL,
    uploader_id uuid NOT NULL,
    image_url text NOT NULL,
    is_locked boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the activity_logs table
CREATE TABLE public.activity_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    connection_id uuid NOT NULL,
    user_id uuid NOT NULL,
    user_name text NOT NULL,
    action text NOT NULL,
    type text NOT NULL, -- e.g., 'mood_change', 'vault_drop', 'urgent_ping'
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Add mood columns to connections table (if they don't exist)
ALTER TABLE public.connections ADD COLUMN IF NOT EXISTS host_mood text DEFAULT 'connected';
ALTER TABLE public.connections ADD COLUMN IF NOT EXISTS guest_mood text DEFAULT 'connected';

-- 4. Enable Realtime for the new tables
alter publication supabase_realtime add table public.vault_media;
alter publication supabase_realtime add table public.activity_logs;

-- 5. Set up RLS (Row Level Security) - allow anything for now for the prototype
ALTER TABLE public.vault_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read access vault_media" ON public.vault_media FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access vault_media" ON public.vault_media FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access vault_media" ON public.vault_media FOR UPDATE USING (true);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read access activity_logs" ON public.activity_logs FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access activity_logs" ON public.activity_logs FOR INSERT WITH CHECK (true);

-- 6. Setup Supabase Storage for the Vault
insert into storage.buckets (id, name, public) values ('vault', 'vault', true) on conflict do nothing;
create policy "Allow public read access on vault" on storage.objects for select using ( bucket_id = 'vault' );
create policy "Allow public insert access on vault" on storage.objects for insert with check ( bucket_id = 'vault' );

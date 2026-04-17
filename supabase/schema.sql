-- Create the connections table
CREATE TABLE public.connections (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    invite_code text NOT NULL UNIQUE,
    host_id uuid NOT NULL,
    guest_id uuid,
    status text NOT NULL DEFAULT 'waiting', -- waiting, detected, locked
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Realtime for the connections table
alter publication supabase_realtime add table public.connections;

-- Set up RLS (Row Level Security) - allow anything for now for the prototype
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read access" ON public.connections FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access" ON public.connections FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access" ON public.connections FOR UPDATE USING (true);

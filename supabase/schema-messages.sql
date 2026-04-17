-- Add the messages table
CREATE TABLE public.messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    connection_id uuid NOT NULL REFERENCES public.connections(id) ON DELETE CASCADE,
    sender_id uuid NOT NULL,
    text text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Realtime
alter publication supabase_realtime add table public.messages;

-- RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read access messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access messages" ON public.messages FOR INSERT WITH CHECK (true);

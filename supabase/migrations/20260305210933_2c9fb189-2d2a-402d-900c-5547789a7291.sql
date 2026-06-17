ALTER TABLE public.whatsapp_sessions
  ADD COLUMN IF NOT EXISTS label_name text,
  ADD COLUMN IF NOT EXISTS label_color text DEFAULT '#22c55e';
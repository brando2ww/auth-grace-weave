ALTER TABLE public.whatsapp_sessions
  ADD COLUMN profile_name text,
  ADD COLUMN profile_picture_url text,
  ADD COLUMN owner_phone text;
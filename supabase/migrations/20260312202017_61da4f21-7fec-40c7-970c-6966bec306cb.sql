CREATE TABLE public.lid_phone_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lid text NOT NULL,
  phone text NOT NULL,
  contact_name text,
  session_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lid)
);

ALTER TABLE public.lid_phone_mappings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lid mappings" ON public.lid_phone_mappings
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Service role full access" ON public.lid_phone_mappings
  FOR ALL TO service_role USING (true) WITH CHECK (true);
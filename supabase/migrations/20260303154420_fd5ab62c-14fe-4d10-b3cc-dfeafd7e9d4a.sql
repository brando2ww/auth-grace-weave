CREATE TABLE public.contatos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  nome text NOT NULL,
  email text,
  telefone text,
  codigo_pais text DEFAULT '+55',
  grupo text,
  etiquetas text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contatos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own contatos" ON public.contatos FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own contatos" ON public.contatos FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own contatos" ON public.contatos FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete own contatos" ON public.contatos FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TRIGGER update_contatos_updated_at BEFORE UPDATE ON public.contatos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
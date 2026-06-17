CREATE TABLE public.etiquetas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL,
  cor text NOT NULL DEFAULT '#6B7280',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, nome)
);

ALTER TABLE public.etiquetas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own etiquetas" ON public.etiquetas FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own etiquetas" ON public.etiquetas FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own etiquetas" ON public.etiquetas FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete own etiquetas" ON public.etiquetas FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TRIGGER update_etiquetas_updated_at BEFORE UPDATE ON public.etiquetas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
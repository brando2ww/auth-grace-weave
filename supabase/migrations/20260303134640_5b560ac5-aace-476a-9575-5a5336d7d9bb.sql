
CREATE TABLE public.departamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT DEFAULT '',
  ativo BOOLEAN NOT NULL DEFAULT true,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.departamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own departamentos"
  ON public.departamentos FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all departamentos"
  ON public.departamentos FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own departamentos"
  ON public.departamentos FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own departamentos"
  ON public.departamentos FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own departamentos"
  ON public.departamentos FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_departamentos_updated_at
  BEFORE UPDATE ON public.departamentos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

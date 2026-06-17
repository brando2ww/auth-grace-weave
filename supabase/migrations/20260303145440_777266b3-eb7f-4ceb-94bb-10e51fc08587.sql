
CREATE TABLE public.integracoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo text NOT NULL,
  config jsonb NOT NULL DEFAULT '{}',
  ativo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, tipo)
);

ALTER TABLE public.integracoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own integracoes"
ON public.integracoes FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own integracoes"
ON public.integracoes FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own integracoes"
ON public.integracoes FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own integracoes"
ON public.integracoes FOR DELETE
USING (user_id = auth.uid());

CREATE TRIGGER update_integracoes_updated_at
BEFORE UPDATE ON public.integracoes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

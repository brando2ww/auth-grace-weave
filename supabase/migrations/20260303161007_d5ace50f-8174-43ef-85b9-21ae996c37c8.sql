
-- Add whatsapp_numero to departamentos
ALTER TABLE public.departamentos ADD COLUMN whatsapp_numero text;

-- Create campanhas table
CREATE TABLE public.campanhas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  nome text NOT NULL,
  departamento_id uuid REFERENCES public.departamentos(id),
  destinatarios_contatos uuid[],
  destinatarios_etiquetas text[],
  destinatarios_grupos text[],
  conteudos jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'rascunho',
  agendada_para timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.campanhas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own campanhas" ON public.campanhas FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own campanhas" ON public.campanhas FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own campanhas" ON public.campanhas FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete own campanhas" ON public.campanhas FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TRIGGER update_campanhas_updated_at BEFORE UPDATE ON public.campanhas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

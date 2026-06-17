
-- Create atendentes table
CREATE TABLE public.atendentes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.atendentes ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own atendentes"
ON public.atendentes FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all atendentes"
ON public.atendentes FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert own atendentes"
ON public.atendentes FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own atendentes"
ON public.atendentes FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own atendentes"
ON public.atendentes FOR DELETE
USING (user_id = auth.uid());

-- Updated_at trigger
CREATE TRIGGER update_atendentes_updated_at
BEFORE UPDATE ON public.atendentes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create join table for atendente-departamento relationship
CREATE TABLE public.atendente_departamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  atendente_id UUID NOT NULL REFERENCES public.atendentes(id) ON DELETE CASCADE,
  departamento_id UUID NOT NULL REFERENCES public.departamentos(id) ON DELETE CASCADE,
  UNIQUE(atendente_id, departamento_id)
);

-- Enable RLS
ALTER TABLE public.atendente_departamentos ENABLE ROW LEVEL SECURITY;

-- RLS policies for join table (based on atendente ownership)
CREATE POLICY "Users can view own atendente_departamentos"
ON public.atendente_departamentos FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.atendentes
    WHERE atendentes.id = atendente_departamentos.atendente_id
    AND atendentes.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all atendente_departamentos"
ON public.atendente_departamentos FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert own atendente_departamentos"
ON public.atendente_departamentos FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.atendentes
    WHERE atendentes.id = atendente_departamentos.atendente_id
    AND atendentes.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own atendente_departamentos"
ON public.atendente_departamentos FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.atendentes
    WHERE atendentes.id = atendente_departamentos.atendente_id
    AND atendentes.user_id = auth.uid()
  )
);

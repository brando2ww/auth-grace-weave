
-- Novas roles
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'owner';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'vendedor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'operacional';

-- Tabela de permissões granulares
CREATE TABLE public.user_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  permission text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, permission)
);

ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own permissions"
  ON public.user_permissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Função segura para checar permissão
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_permissions
    WHERE user_id = _user_id AND permission = _permission
  )
$$;

-- Tabela de features por plano
CREATE TABLE public.plan_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan text NOT NULL,
  feature text NOT NULL,
  UNIQUE (plan, feature)
);

ALTER TABLE public.plan_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view plan features"
  ON public.plan_features FOR SELECT
  TO authenticated
  USING (true);

-- Seed: features por plano
INSERT INTO public.plan_features (plan, feature) VALUES
  ('essencial', 'marketplace.integration'),
  ('essencial', 'estoque.basic'),
  ('essencial', 'leads.basic'),
  ('profissional', 'marketplace.integration'),
  ('profissional', 'estoque.basic'),
  ('profissional', 'leads.basic'),
  ('profissional', 'crm.full'),
  ('profissional', 'leads.advanced'),
  ('profissional', 'agenda'),
  ('profissional', 'reports.advanced'),
  ('avancado', 'marketplace.integration'),
  ('avancado', 'estoque.basic'),
  ('avancado', 'leads.basic'),
  ('avancado', 'crm.full'),
  ('avancado', 'leads.advanced'),
  ('avancado', 'agenda'),
  ('avancado', 'reports.advanced'),
  ('avancado', 'automacao'),
  ('avancado', 'alerts.smart'),
  ('enterprise', 'marketplace.integration'),
  ('enterprise', 'estoque.basic'),
  ('enterprise', 'leads.basic'),
  ('enterprise', 'crm.full'),
  ('enterprise', 'leads.advanced'),
  ('enterprise', 'agenda'),
  ('enterprise', 'reports.advanced'),
  ('enterprise', 'automacao'),
  ('enterprise', 'alerts.smart'),
  ('enterprise', 'multi.stores'),
  ('enterprise', 'multi.teams'),
  ('enterprise', 'custom.integrations');

-- Função para checar feature do plano
CREATE OR REPLACE FUNCTION public.plan_allows(_user_id uuid, _feature text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.plan_features pf
    JOIN public.profiles p ON p.subscription_plan = pf.plan
    WHERE p.id = _user_id AND pf.feature = _feature
  )
$$;

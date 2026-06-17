
-- 1. Enum de roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- 2. Tabela de roles (separada, segura)
CREATE TABLE public.user_roles (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role      public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- 3. RLS habilitado
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Função segura para verificar role (SECURITY DEFINER evita RLS recursivo)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 5. Policy: apenas admins veem a tabela de roles
CREATE POLICY "Admins can view user_roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

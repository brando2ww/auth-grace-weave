
-- Add is_default column
ALTER TABLE public.departamentos ADD COLUMN is_default boolean NOT NULL DEFAULT false;

-- Mark "Atendimento" as default
UPDATE public.departamentos SET is_default = true WHERE id = '24eadb3e-69e7-4f23-a9f6-335db0689839';

-- Prevent deletion of default departments
CREATE OR REPLACE FUNCTION public.prevent_delete_default_departamento()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.is_default THEN
    RAISE EXCEPTION 'Não é permitido excluir o departamento padrão.';
  END IF;
  RETURN OLD;
END;
$$;

CREATE TRIGGER prevent_delete_default_departamento
BEFORE DELETE ON public.departamentos
FOR EACH ROW
EXECUTE FUNCTION public.prevent_delete_default_departamento();

-- Prevent deactivating default departments
CREATE OR REPLACE FUNCTION public.prevent_deactivate_default_departamento()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.is_default AND NEW.ativo = false THEN
    RAISE EXCEPTION 'Não é permitido desativar o departamento padrão.';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_deactivate_default_departamento
BEFORE UPDATE ON public.departamentos
FOR EACH ROW
EXECUTE FUNCTION public.prevent_deactivate_default_departamento();

-- Update handle_new_user_atendente to auto-link new users to default department
CREATE OR REPLACE FUNCTION public.handle_new_user_atendente()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_atendente_id uuid;
  default_dep_id uuid;
BEGIN
  INSERT INTO public.atendentes (nome, email, user_id)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    NEW.email,
    NEW.id
  )
  RETURNING id INTO new_atendente_id;

  SELECT id INTO default_dep_id FROM public.departamentos WHERE is_default = true LIMIT 1;

  IF default_dep_id IS NOT NULL THEN
    INSERT INTO public.atendente_departamentos (atendente_id, departamento_id)
    VALUES (new_atendente_id, default_dep_id);
  END IF;

  RETURN NEW;
END;
$$;

-- Link admin to default department
INSERT INTO public.atendente_departamentos (atendente_id, departamento_id)
VALUES ('eaee0584-5691-442d-990d-16e8b368d229', '24eadb3e-69e7-4f23-a9f6-335db0689839')
ON CONFLICT DO NOTHING;

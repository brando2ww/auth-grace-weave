
CREATE OR REPLACE FUNCTION public.handle_new_user_atendente()
RETURNS trigger AS $$
DECLARE
  new_atendente_id uuid;
  new_dep_id uuid;
BEGIN
  -- Cria atendente
  INSERT INTO public.atendentes (nome, email, user_id)
  VALUES (COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'), NEW.email, NEW.id)
  RETURNING id INTO new_atendente_id;

  -- Cria departamento "Atendimento" próprio do usuário
  INSERT INTO public.departamentos (nome, descricao, user_id, is_default)
  VALUES ('Atendimento', '', NEW.id, true)
  RETURNING id INTO new_dep_id;

  -- Vincula atendente ao seu departamento
  INSERT INTO public.atendente_departamentos (atendente_id, departamento_id)
  VALUES (new_atendente_id, new_dep_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';

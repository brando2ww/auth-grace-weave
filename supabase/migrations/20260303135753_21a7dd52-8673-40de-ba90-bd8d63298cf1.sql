
CREATE OR REPLACE FUNCTION public.handle_new_user_atendente()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.atendentes (nome, email, user_id)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    NEW.email,
    NEW.id
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_atendente
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_atendente();

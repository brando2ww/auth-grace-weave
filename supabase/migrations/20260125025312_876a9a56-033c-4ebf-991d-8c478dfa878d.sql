-- Adicionar campos de onboarding e documento na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_step text DEFAULT 'payment',
ADD COLUMN IF NOT EXISTS guarantee_ends_at timestamptz,
ADD COLUMN IF NOT EXISTS document text,
ADD COLUMN IF NOT EXISTS document_type text;

-- Criar função para auto-criar profile quando usuário se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    first_name,
    phone,
    document,
    document_type,
    subscription_plan,
    subscription_status,
    onboarding_step,
    onboarding_completed
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'document',
    NEW.raw_user_meta_data->>'document_type',
    NEW.raw_user_meta_data->>'plan',
    'pending_payment',
    'payment',
    false
  );
  RETURN NEW;
END;
$$;

-- Criar trigger que executa após inserção de novo usuário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
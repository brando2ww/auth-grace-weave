
-- Add CRM columns to contatos table
ALTER TABLE public.contatos
  ADD COLUMN IF NOT EXISTS telefone_secundario text,
  ADD COLUMN IF NOT EXISTS data_nascimento date,
  ADD COLUMN IF NOT EXISTS cpf_cnpj text,
  ADD COLUMN IF NOT EXISTS empresa text,
  ADD COLUMN IF NOT EXISTS cargo text,
  ADD COLUMN IF NOT EXISTS tipo_contato text,
  ADD COLUMN IF NOT EXISTS origem_contato text,
  ADD COLUMN IF NOT EXISTS status_funil text DEFAULT 'novo',
  ADD COLUMN IF NOT EXISTS responsavel_id uuid,
  ADD COLUMN IF NOT EXISTS ultima_compra date,
  ADD COLUMN IF NOT EXISTS total_gasto numeric(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS numero_pedidos integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS produto_servico text,
  ADD COLUMN IF NOT EXISTS data_renovacao date,
  ADD COLUMN IF NOT EXISTS ultimo_contato timestamp with time zone,
  ADD COLUMN IF NOT EXISTS proximo_followup timestamp with time zone,
  ADD COLUMN IF NOT EXISTS canal_preferido text,
  ADD COLUMN IF NOT EXISTS observacoes text,
  ADD COLUMN IF NOT EXISTS cep text,
  ADD COLUMN IF NOT EXISTS rua text,
  ADD COLUMN IF NOT EXISTS numero_endereco text,
  ADD COLUMN IF NOT EXISTS complemento text,
  ADD COLUMN IF NOT EXISTS bairro text,
  ADD COLUMN IF NOT EXISTS cidade text,
  ADD COLUMN IF NOT EXISTS estado text,
  ADD COLUMN IF NOT EXISTS pais text DEFAULT 'Brasil',
  ADD COLUMN IF NOT EXISTS documentos_ativados boolean DEFAULT false;

-- Create contato_documentos table
CREATE TABLE IF NOT EXISTS public.contato_documentos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contato_id uuid NOT NULL REFERENCES public.contatos(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  tipo_documento text NOT NULL,
  nome_arquivo text NOT NULL,
  arquivo_url text NOT NULL,
  data_envio timestamp with time zone NOT NULL DEFAULT now(),
  observacoes text,
  data_validade date,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.contato_documentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own contato_documentos" ON public.contato_documentos
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own contato_documentos" ON public.contato_documentos
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own contato_documentos" ON public.contato_documentos
  FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete own contato_documentos" ON public.contato_documentos
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Create contato_timeline table
CREATE TABLE IF NOT EXISTS public.contato_timeline (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contato_id uuid NOT NULL REFERENCES public.contatos(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  tipo_evento text NOT NULL,
  descricao text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.contato_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own contato_timeline" ON public.contato_timeline
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own contato_timeline" ON public.contato_timeline
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own contato_timeline" ON public.contato_timeline
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Create private storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('contato-documentos', 'contato-documentos', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "Users can upload contato documents" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'contato-documentos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can view own contato documents" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'contato-documentos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can delete own contato documents" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'contato-documentos' AND (storage.foldername(name))[1] = auth.uid()::text);

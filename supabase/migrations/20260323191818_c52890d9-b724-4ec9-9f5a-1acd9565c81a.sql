
-- 1. user_roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 2. departamentos
CREATE TABLE public.departamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome text NOT NULL,
  descricao text,
  ativo boolean DEFAULT true,
  whatsapp_numero text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.departamentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own departamentos" ON public.departamentos FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3. atendentes
CREATE TABLE public.atendentes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome text NOT NULL,
  email text NOT NULL,
  telefone text,
  codigo_pais text DEFAULT '+55',
  ativo boolean DEFAULT true,
  is_admin boolean DEFAULT false,
  avatar_url text,
  mensagem_finalizacao text,
  descricao text,
  config_ia jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.atendentes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own atendentes" ON public.atendentes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. atendente_departamentos
CREATE TABLE public.atendente_departamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  atendente_id uuid REFERENCES public.atendentes(id) ON DELETE CASCADE NOT NULL,
  departamento_id uuid REFERENCES public.departamentos(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (atendente_id, departamento_id)
);
ALTER TABLE public.atendente_departamentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own atendente_departamentos" ON public.atendente_departamentos FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.atendentes a WHERE a.id = atendente_id AND a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.atendentes a WHERE a.id = atendente_id AND a.user_id = auth.uid()));

-- 5. contatos
CREATE TABLE public.contatos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome text NOT NULL,
  email text,
  telefone text,
  codigo_pais text DEFAULT '+55',
  telefone_secundario text,
  data_nascimento date,
  cpf_cnpj text,
  empresa text,
  cargo text,
  tipo_contato text,
  origem_contato text,
  status_funil text DEFAULT 'novo',
  grupo text,
  etiquetas text[],
  produto_servico text,
  ultima_compra date,
  total_gasto numeric DEFAULT 0,
  numero_pedidos integer DEFAULT 0,
  data_renovacao date,
  proximo_followup date,
  canal_preferido text,
  observacoes text,
  cep text,
  rua text,
  numero_endereco text,
  complemento text,
  bairro text,
  cidade text,
  estado text,
  pais text DEFAULT 'Brasil',
  documentos_ativados boolean DEFAULT false,
  profile_picture_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.contatos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own contatos" ON public.contatos FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6. etiquetas
CREATE TABLE public.etiquetas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome text NOT NULL,
  cor text NOT NULL DEFAULT '#6B7280',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.etiquetas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own etiquetas" ON public.etiquetas FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 7. campanhas
CREATE TABLE public.campanhas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome text NOT NULL,
  departamento_id uuid REFERENCES public.departamentos(id) ON DELETE SET NULL,
  destinatarios_contatos text[],
  destinatarios_etiquetas text[],
  destinatarios_grupos text[],
  conteudos jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'rascunho',
  agendada_para timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.campanhas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own campanhas" ON public.campanhas FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 8. whatsapp_sessions
CREATE TABLE public.whatsapp_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  connection_name text NOT NULL,
  status text DEFAULT 'disconnected',
  instance_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.whatsapp_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own whatsapp_sessions" ON public.whatsapp_sessions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 9. chat_pins
CREATE TABLE public.chat_pins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  chat_jid text NOT NULL,
  session_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, chat_jid, session_name)
);
ALTER TABLE public.chat_pins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own chat_pins" ON public.chat_pins FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 10. configuracoes
CREATE TABLE public.configuracoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  mensagem_feedback text,
  mensagem_finalizacao text,
  enviar_protocolo boolean DEFAULT true,
  enviar_notificacao_transferencia boolean DEFAULT true,
  assinar_fila boolean DEFAULT true,
  assinar_fila_minutos integer DEFAULT 5,
  avaliacao_atendimento boolean DEFAULT true,
  exibir_nome_atendente boolean DEFAULT true,
  ativar_horario_atendimento boolean DEFAULT true,
  esconder_grupos_whatsapp boolean DEFAULT true,
  exibir_conversas_robo boolean DEFAULT true,
  coletar_mensagens_celular boolean DEFAULT false,
  habilitar_transcricao_ia boolean DEFAULT true,
  permitir_optout boolean DEFAULT true,
  mensagem_optout text,
  ativar_rodizio boolean DEFAULT true,
  incluir_admins_rodizio boolean DEFAULT false,
  selecionar_atendentes_rodizio boolean DEFAULT false,
  modo_rodizio text DEFAULT 'sequencial',
  horarios jsonb,
  enviar_fora_horario boolean DEFAULT true,
  fora_horario_minutos integer DEFAULT 0,
  mensagem_fora_horario text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own configuracoes" ON public.configuracoes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 11. integracoes
CREATE TABLE public.integracoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tipo text NOT NULL,
  config jsonb DEFAULT '{}'::jsonb,
  ativo boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, tipo)
);
ALTER TABLE public.integracoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own integracoes" ON public.integracoes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 12. contato_documentos
CREATE TABLE public.contato_documentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contato_id uuid REFERENCES public.contatos(id) ON DELETE CASCADE NOT NULL,
  nome text NOT NULL,
  url text NOT NULL,
  tipo text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.contato_documentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own contato_documentos" ON public.contato_documentos FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.contatos c WHERE c.id = contato_id AND c.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.contatos c WHERE c.id = contato_id AND c.user_id = auth.uid()));

-- updated_at triggers
CREATE TRIGGER update_departamentos_updated_at BEFORE UPDATE ON public.departamentos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_atendentes_updated_at BEFORE UPDATE ON public.atendentes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contatos_updated_at BEFORE UPDATE ON public.contatos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_etiquetas_updated_at BEFORE UPDATE ON public.etiquetas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_campanhas_updated_at BEFORE UPDATE ON public.campanhas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_whatsapp_sessions_updated_at BEFORE UPDATE ON public.whatsapp_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON public.configuracoes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_integracoes_updated_at BEFORE UPDATE ON public.integracoes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

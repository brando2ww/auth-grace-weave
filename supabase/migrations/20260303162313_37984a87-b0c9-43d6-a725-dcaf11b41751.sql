
CREATE TABLE public.configuracoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  mensagem_feedback text DEFAULT '',
  mensagem_finalizacao text DEFAULT '',
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
  mensagem_optout text DEFAULT '',
  ativar_rodizio boolean DEFAULT true,
  incluir_admins_rodizio boolean DEFAULT false,
  selecionar_atendentes_rodizio boolean DEFAULT false,
  modo_rodizio text DEFAULT 'sequencial',
  horarios jsonb DEFAULT '[]'::jsonb,
  enviar_fora_horario boolean DEFAULT true,
  fora_horario_minutos integer DEFAULT 0,
  mensagem_fora_horario text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own configuracoes"
ON public.configuracoes FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own configuracoes"
ON public.configuracoes FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own configuracoes"
ON public.configuracoes FOR UPDATE
USING (user_id = auth.uid());

CREATE TRIGGER update_configuracoes_updated_at
BEFORE UPDATE ON public.configuracoes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

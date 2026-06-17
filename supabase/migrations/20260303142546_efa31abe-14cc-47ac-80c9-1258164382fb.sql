ALTER TABLE public.atendentes
ADD COLUMN IF NOT EXISTS mensagem_finalizacao TEXT,
ADD COLUMN IF NOT EXISTS descricao TEXT;
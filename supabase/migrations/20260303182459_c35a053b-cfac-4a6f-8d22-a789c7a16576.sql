
CREATE TABLE public.whatsapp_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  connection_name text NOT NULL,
  status text NOT NULL DEFAULT 'disconnected',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.whatsapp_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own whatsapp_sessions"
ON public.whatsapp_sessions FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own whatsapp_sessions"
ON public.whatsapp_sessions FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own whatsapp_sessions"
ON public.whatsapp_sessions FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own whatsapp_sessions"
ON public.whatsapp_sessions FOR DELETE
USING (user_id = auth.uid());

CREATE TRIGGER update_whatsapp_sessions_updated_at
BEFORE UPDATE ON public.whatsapp_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

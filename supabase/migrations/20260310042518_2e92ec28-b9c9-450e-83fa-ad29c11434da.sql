CREATE TABLE public.chat_pins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  chat_jid text NOT NULL,
  session_name text NOT NULL,
  pinned_at timestamptz DEFAULT now(),
  UNIQUE (user_id, chat_jid, session_name)
);
ALTER TABLE public.chat_pins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own pins" ON public.chat_pins
  FOR ALL TO authenticated USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Table: messages (full message history)
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_name text NOT NULL,
  chat_jid text NOT NULL,
  message_id text NOT NULL,
  from_me boolean NOT NULL DEFAULT false,
  content text,
  message_type text DEFAULT 'text',
  timestamp bigint NOT NULL,
  raw_data jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(session_name, message_id)
);

CREATE INDEX idx_messages_chat ON public.messages(user_id, session_name, chat_jid, timestamp DESC);
CREATE INDEX idx_messages_timestamp ON public.messages(timestamp DESC);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own messages" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Service role will insert via webhook, so also allow anon for the edge function
CREATE POLICY "Service can insert messages" ON public.messages
  FOR INSERT TO anon
  WITH CHECK (true);

-- Table: chat_last_messages (optimized sidebar list)
CREATE TABLE public.chat_last_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_name text NOT NULL,
  chat_jid text NOT NULL,
  contact_name text,
  profile_picture_url text,
  last_message text,
  last_message_timestamp bigint NOT NULL DEFAULT 0,
  unread_count int DEFAULT 0,
  is_group boolean DEFAULT false,
  label_name text,
  label_color text DEFAULT '#6B7280',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, session_name, chat_jid)
);

CREATE INDEX idx_chat_last_messages_user ON public.chat_last_messages(user_id, last_message_timestamp DESC);

ALTER TABLE public.chat_last_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chat_last_messages" ON public.chat_last_messages
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own chat_last_messages" ON public.chat_last_messages
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service can manage chat_last_messages" ON public.chat_last_messages
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service can manage messages" ON public.messages
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

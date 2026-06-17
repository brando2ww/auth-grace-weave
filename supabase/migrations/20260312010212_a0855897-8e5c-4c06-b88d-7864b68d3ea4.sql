
-- Remove overly permissive anon policies - webhook will use service_role key instead
DROP POLICY "Service can insert messages" ON public.messages;
DROP POLICY "Service can manage messages" ON public.messages;
DROP POLICY "Service can manage chat_last_messages" ON public.chat_last_messages;

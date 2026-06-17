DELETE FROM public.chat_last_messages WHERE chat_jid LIKE '%@lid';
DELETE FROM public.messages WHERE chat_jid LIKE '%@lid';
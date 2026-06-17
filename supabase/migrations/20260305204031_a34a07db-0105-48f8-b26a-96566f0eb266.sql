ALTER TABLE public.whatsapp_sessions 
  ADD COLUMN departamento_id uuid REFERENCES public.departamentos(id) ON DELETE SET NULL;
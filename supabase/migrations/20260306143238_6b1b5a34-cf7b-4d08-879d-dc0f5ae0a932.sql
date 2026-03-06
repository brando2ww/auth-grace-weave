INSERT INTO storage.buckets (id, name, public) VALUES ('vehicle-photos', 'vehicle-photos', true);

CREATE POLICY "Authenticated users can upload vehicle photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'vehicle-photos');

CREATE POLICY "Anyone can view vehicle photos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'vehicle-photos');

CREATE POLICY "Authenticated users can delete own vehicle photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'vehicle-photos');
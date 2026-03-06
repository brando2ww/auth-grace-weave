

## Plano: Upload de Fotos com Supabase Storage

Substituir os campos de URL de fotos por um componente de upload real, seguindo o design da imagem de referência (drag & drop + upload por URL + progress bar).

### 1. Criar bucket no Supabase Storage

Migration SQL para criar bucket `vehicle-photos` (público) com RLS policies permitindo upload/leitura por usuários autenticados.

```sql
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
```

### 2. Novo componente: `src/components/VehiclePhotoUpload.tsx`

Componente inspirado no design da imagem de referência:
- **Área de drag & drop** com borda tracejada, ícone de upload, texto "Selecione fotos ou arraste aqui"
- **Campo "Upload por URL"** com input + botão Upload (como na imagem)
- **Barra de progresso** durante upload com percentual
- **Preview das fotos** com miniatura e botão X para remover
- **Foto principal**: a primeira foto enviada é marcada como principal (foto1), com opção de reordenar
- Upload via `supabase.storage.from('vehicle-photos').upload()`
- Retorna array de URLs públicas das fotos

### 3. Atualizar `src/pages/EntradaVeiculo.tsx`

- Substituir os campos "Fotos (URL)" e "Foto Principal (URL)" pelo novo componente `VehiclePhotoUpload`
- O state `fotos` passa a ser um array de URLs retornadas pelo storage
- O state `foto1` é automaticamente a primeira foto do array

### Arquivos alterados
- `src/components/VehiclePhotoUpload.tsx` (novo)
- `src/pages/EntradaVeiculo.tsx` (atualizado)
- Migration SQL para bucket + RLS


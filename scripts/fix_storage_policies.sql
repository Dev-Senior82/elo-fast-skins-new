-- ============================================
-- CORRIGIR UPLOAD DE IMAGENS
-- Políticas RLS para bucket 'profiles'
-- ============================================

-- 1. PERMITIR UPLOAD (qualquer usuário logado)
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profiles');

-- 2. PERMITIR LEITURA PÚBLICA (qualquer um pode ver)
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profiles');

-- 3. PERMITIR ATUALIZAÇÃO (dono do arquivo)
CREATE POLICY "Allow authenticated updates"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'profiles');

-- 4. PERMITIR DELETE (dono do arquivo)
CREATE POLICY "Allow authenticated deletes"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'profiles');

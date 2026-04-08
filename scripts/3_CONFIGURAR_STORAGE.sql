-- ============================================
-- PASSO 3: POLÍTICAS DE STORAGE
-- IMPORTANTE: O bucket "profiles" deve estar criado e PÚBLICO!
-- ============================================

-- Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Public read for profiles bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated insert for profiles bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update for profiles bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete for profiles bucket" ON storage.objects;

-- Criar políticas corretas
CREATE POLICY "Public read for profiles bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profiles');

CREATE POLICY "Authenticated insert for profiles bucket"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'profiles');

CREATE POLICY "Authenticated update for profiles bucket"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'profiles');

CREATE POLICY "Authenticated delete for profiles bucket"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'profiles');

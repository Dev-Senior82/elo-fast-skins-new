-- ============================================
-- SCRIPT MASTER - COPIE E COLE TUDO DE UMA VEZ
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- ============================================
-- PARTE 1: CRIAR TABELAS DE PERFIS E CHAT
-- ============================================

CREATE TABLE IF NOT EXISTS client_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  age INTEGER,
  whatsapp TEXT,
  discord TEXT,
  current_elo TEXT,
  preferred_lane TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS booster_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booster_id TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  age INTEGER,
  whatsapp TEXT,
  discord TEXT,
  current_elo TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  sender_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_client_profiles_client_id ON client_profiles(client_id);
CREATE INDEX IF NOT EXISTS idx_booster_profiles_booster_id ON booster_profiles(booster_id);
CREATE INDEX IF NOT EXISTS idx_chat_files_order_id ON chat_files(order_id);
CREATE INDEX IF NOT EXISTS idx_chat_files_created ON chat_files(created_at DESC);

-- ============================================
-- PARTE 2: ADICIONAR CAMPO is_admin
-- ============================================

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'boosters' AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE boosters ADD COLUMN is_admin BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Marcar usuários admin
UPDATE boosters SET is_admin = true WHERE LOWER(login) IN ('admin', 'administrator');

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_boosters_is_admin ON boosters(is_admin);

-- ============================================
-- PARTE 3: POLÍTICAS DE STORAGE (BUCKET profiles)
-- ============================================

-- IMPORTANTE: Antes de rodar esta parte, certifique-se que o bucket 'profiles' existe!
-- Vá em Storage > Create Bucket > Nome: "profiles" > Public: SIM

-- Remover políticas antigas se existirem (evita erro de duplicação)
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Uploads" ON storage.objects;

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

-- ============================================
-- CONCLUÍDO!
-- ============================================
-- ✅ Tabelas criadas: client_profiles, booster_profiles, chat_files
-- ✅ Campo is_admin adicionado na tabela boosters
-- ✅ Políticas de Storage configuradas para upload de imagens
-- 
-- PRÓXIMO PASSO:
-- 1. Vá em Storage no Supabase
-- 2. Crie um bucket chamado "profiles" se ainda não existir
-- 3. Marque como PÚBLICO
-- ============================================

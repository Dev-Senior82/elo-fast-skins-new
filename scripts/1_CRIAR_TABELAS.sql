-- ============================================
-- PASSO 1: CRIAR TABELAS DE PERFIS E CHAT
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

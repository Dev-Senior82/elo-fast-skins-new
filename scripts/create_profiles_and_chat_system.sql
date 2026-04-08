-- ============================================
-- SISTEMA DE PERFIS E CHAT AVANÇADO
-- Script completo para Supabase
-- ============================================

-- 1. TABELA DE PERFIS DOS CLIENTES
CREATE TABLE IF NOT EXISTS client_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id VARCHAR(255) UNIQUE NOT NULL,
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

-- 2. TABELA DE PERFIS DOS BOOSTERS
CREATE TABLE IF NOT EXISTS booster_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booster_id VARCHAR(255) UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  age INTEGER,
  whatsapp TEXT,
  discord TEXT,
  current_elo TEXT,
  bio TEXT CHECK (LENGTH(bio) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE ARQUIVOS DO CHAT
CREATE TABLE IF NOT EXISTS chat_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id VARCHAR(255) NOT NULL,
  sender_id VARCHAR(255) NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('client', 'booster', 'admin')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ADICIONAR CAMPOS NA TABELA messages (se não existirem)
DO $$ 
BEGIN
    -- Adicionar sender_name
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'messages' AND column_name = 'sender_name'
    ) THEN
        ALTER TABLE messages ADD COLUMN sender_name TEXT;
    END IF;
    
    -- Adicionar message_type (text ou file)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'messages' AND column_name = 'message_type'
    ) THEN
        ALTER TABLE messages ADD COLUMN message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'file'));
    END IF;
    
    -- Adicionar file_url
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'messages' AND column_name = 'file_url'
    ) THEN
        ALTER TABLE messages ADD COLUMN file_url TEXT;
    END IF;
END $$;

-- 5. ADICIONAR CAMPO is_private NA TABELA orders
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'is_private'
    ) THEN
        ALTER TABLE orders ADD COLUMN is_private BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Atualizar pedidos aceitos como privados
UPDATE orders SET is_private = true WHERE status IN ('accepted', 'in_progress', 'completed');

-- 6. CRIAR ÍNDICES
CREATE INDEX IF NOT EXISTS idx_client_profiles_client_id ON client_profiles(client_id);
CREATE INDEX IF NOT EXISTS idx_booster_profiles_booster_id ON booster_profiles(booster_id);
CREATE INDEX IF NOT EXISTS idx_chat_files_order_id ON chat_files(order_id);
CREATE INDEX IF NOT EXISTS idx_chat_files_created ON chat_files(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_name ON messages(sender_name);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(message_type);

-- 7. FUNÇÃO PARA ATUALIZAR updated_at
CREATE OR REPLACE FUNCTION update_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para client_profiles
DROP TRIGGER IF EXISTS trigger_update_client_profile_timestamp ON client_profiles;
CREATE TRIGGER trigger_update_client_profile_timestamp
    BEFORE UPDATE ON client_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_profile_timestamp();

-- Triggers para booster_profiles
DROP TRIGGER IF EXISTS trigger_update_booster_profile_timestamp ON booster_profiles;
CREATE TRIGGER trigger_update_booster_profile_timestamp
    BEFORE UPDATE ON booster_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_profile_timestamp();

-- ============================================
-- CONCLUÍDO! Tabelas criadas com sucesso.
-- ============================================

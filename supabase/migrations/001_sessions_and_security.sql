-- Criar tabela de sessões de boosters
CREATE TABLE IF NOT EXISTS booster_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booster_id UUID NOT NULL REFERENCES boosters(id) ON DELETE CASCADE,
  session_token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(booster_id)
);

-- Criar tabela de sessões de clientes
CREATE TABLE IF NOT EXISTS client_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  session_token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(client_id)
);

-- Adicionar coluna accepted_by_booster_id na tabela orders (se não existir)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS accepted_by_booster_id UUID REFERENCES boosters(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS accepted_by_booster_name VARCHAR(255);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_booster_sessions_token ON booster_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_booster_sessions_booster ON booster_sessions(booster_id);
CREATE INDEX IF NOT EXISTS idx_client_sessions_token ON client_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_client_sessions_client ON client_sessions(client_id);
CREATE INDEX IF NOT EXISTS idx_notifications_booster ON notifications(booster_id);

-- Adicionar coluna type em notifications (se não existir)
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'general';

-- Habilitar RLS (Row Level Security) para segurança
ALTER TABLE booster_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_sessions ENABLE ROW LEVEL SECURITY;

-- Policies de segurança para booster_sessions
CREATE POLICY "Boosters can only see their own sessions" ON booster_sessions
  FOR SELECT USING (auth.uid()::text = booster_id::text);

CREATE POLICY "Boosters can only insert their own sessions" ON booster_sessions
  FOR INSERT WITH CHECK (auth.uid()::text = booster_id::text);

CREATE POLICY "Boosters can only delete their own sessions" ON booster_sessions
  FOR DELETE USING (auth.uid()::text = booster_id::text);

-- Policies de segurança para client_sessions
CREATE POLICY "Clients can only see their own sessions" ON client_sessions
  FOR SELECT USING (auth.uid()::text = client_id::text);

CREATE POLICY "Clients can only insert their own sessions" ON client_sessions
  FOR INSERT WITH CHECK (auth.uid()::text = client_id::text);

CREATE POLICY "Clients can only delete their own sessions" ON client_sessions
  FOR DELETE USING (auth.uid()::text = client_id::text);

-- Função para limpar sessões expiradas automaticamente
CREATE OR REPLACE FUNCTION clean_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM booster_sessions WHERE expires_at < NOW();
  DELETE FROM client_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Trigger para limpar sessões expiradas periodicamente (opcional)
-- Pode ser configurado via cron job externo ou Supabase scheduled functions

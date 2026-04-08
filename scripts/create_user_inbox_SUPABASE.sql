-- ============================================
-- CRIAR TABELA: user_inbox
-- Script 100% compatível com Supabase
-- ============================================

-- Criar tabela
CREATE TABLE IF NOT EXISTS user_inbox (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  link_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_user_inbox_user_id ON user_inbox(user_id);
CREATE INDEX IF NOT EXISTS idx_user_inbox_read ON user_inbox(is_read);
CREATE INDEX IF NOT EXISTS idx_user_inbox_created ON user_inbox(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_inbox_user_unread ON user_inbox(user_id, is_read, created_at DESC);

-- Inserir mensagens de exemplo (substitua 'booster123' por um ID real)
INSERT INTO user_inbox (user_id, title, content, link_url, is_read) VALUES
  ('booster123', 'Novo Pedido Disponível', 'Um novo pedido de boost foi criado e está aguardando aceite.', '/booster-dashboard', false),
  ('booster123', 'Pedido Concluído', 'Parabéns! Você concluiu um pedido com sucesso. Pagamento será processado em breve.', '/booster-dashboard', true),
  ('booster123', 'Atualização do Sistema', 'Nova funcionalidade disponível: agora você pode ver estatísticas detalhadas dos seus boosts.', NULL, false);

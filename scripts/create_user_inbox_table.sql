-- ============================================
-- TABELA: user_inbox
-- Sistema de mensagens/alertas para boosters
-- SEM websocket, SEM palavras bloqueadas
-- ============================================

CREATE TABLE IF NOT EXISTS user_inbox (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  link_url VARCHAR(500) DEFAULT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_inbox_user_id ON user_inbox(user_id);
CREATE INDEX IF NOT EXISTS idx_user_inbox_read ON user_inbox(is_read);
CREATE INDEX IF NOT EXISTS idx_user_inbox_created ON user_inbox(created_at DESC);

-- Índice composto para queries otimizadas
CREATE INDEX IF NOT EXISTS idx_user_inbox_user_unread 
  ON user_inbox(user_id, is_read, created_at DESC);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_user_inbox_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar timestamp
DROP TRIGGER IF EXISTS trigger_update_user_inbox_timestamp ON user_inbox;
CREATE TRIGGER trigger_update_user_inbox_timestamp
    BEFORE UPDATE ON user_inbox
    FOR EACH ROW
    EXECUTE FUNCTION update_user_inbox_timestamp();

-- ============================================
-- INSERIR MENSAGENS DE TESTE
-- ============================================

-- Substitua 'BOOSTER_ID_AQUI' pelo ID real de um booster para testar
-- Exemplo de mensagens:

INSERT INTO user_inbox (user_id, title, content, link_url, is_read) VALUES
  ('booster123', 'Novo Pedido Disponível', 'Um novo pedido de boost foi criado e está aguardando aceite.', '/booster-dashboard', false),
  ('booster123', 'Pedido Concluído', 'Parabéns! Você concluiu um pedido com sucesso. Pagamento será processado em breve.', '/booster-dashboard', true),
  ('booster123', 'Atualização do Sistema', 'Nova funcionalidade disponível: agora você pode ver estatísticas detalhadas dos seus boosts.', NULL, false)
ON CONFLICT DO NOTHING;

-- ============================================
-- QUERY PARA BUSCAR MENSAGENS (exemplo)
-- ============================================

-- Buscar mensagens não lidas de um usuário:
-- SELECT * FROM user_inbox 
-- WHERE user_id = 'BOOSTER_ID' 
-- AND is_read = false 
-- ORDER BY created_at DESC;

-- Marcar como lida:
-- UPDATE user_inbox 
-- SET is_read = true 
-- WHERE id = 'MESSAGE_ID';

-- Deletar mensagem:
-- DELETE FROM user_inbox 
-- WHERE id = 'MESSAGE_ID';

-- ============================================
-- LIMPEZA AUTOMÁTICA (OPCIONAL)
-- ============================================

-- Deletar mensagens lidas com mais de 30 dias:
-- DELETE FROM user_inbox 
-- WHERE is_read = true 
-- AND created_at < NOW() - INTERVAL '30 days';

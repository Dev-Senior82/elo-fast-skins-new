-- =====================================================
-- DATABASE SCHEMA IMPROVEMENTS
-- Adiciona campos necessários para as novas funcionalidades
-- =====================================================

-- 1. Adicionar campos para reserva de pedido e timer de 3 horas
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS reserved_for_booster_id TEXT,
ADD COLUMN IF NOT EXISTS reservation_expires_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS accepted_by_booster_id TEXT;

-- 2. Adicionar índice para melhorar performance de queries
CREATE INDEX IF NOT EXISTS idx_orders_reserved_booster ON orders(reserved_for_booster_id);
CREATE INDEX IF NOT EXISTS idx_orders_accepted_booster ON orders(accepted_by_booster_id);
CREATE INDEX IF NOT EXISTS idx_orders_reservation_expires ON orders(reservation_expires_at);

-- 3. Adicionar campos para notificações privadas (se não existirem)
ALTER TABLE notifications
ADD COLUMN IF NOT EXISTS user_id TEXT,
ADD COLUMN IF NOT EXISTS user_type TEXT CHECK (user_type IN ('booster', 'client'));

-- 4. Migrar notificações existentes (booster_id → user_id)
UPDATE notifications 
SET user_id = booster_id, user_type = 'booster'
WHERE user_id IS NULL AND booster_id IS NOT NULL;

-- 5. Criar índice para notificações
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, user_type);

-- 6. Adicionar campo de campeão principal aos boosters
ALTER TABLE boosters
ADD COLUMN IF NOT EXISTS main_champion TEXT DEFAULT 'Talon';

-- 7. Atualizar campeões dos boosters existentes
UPDATE boosters SET main_champion = 'Talon' WHERE name = 'Talon';
UPDATE boosters SET main_champion = 'Zed' WHERE name = 'Zed';
UPDATE boosters SET main_champion = 'Yasuo' WHERE name = 'Yasuo';
UPDATE boosters SET main_champion = 'Lee Sin' WHERE name = 'Lee Sin';
UPDATE boosters SET main_champion = 'Riven' WHERE name = 'Riven';
UPDATE boosters SET main_champion = 'Katarina' WHERE name = 'Katarina';
UPDATE boosters SET main_champion = 'Viego' WHERE name = 'Viego';

-- 8. Comentários para documentação
COMMENT ON COLUMN orders.reserved_for_booster_id IS 'ID do booster para quem o pedido foi reservado (3h)';
COMMENT ON COLUMN orders.reservation_expires_at IS 'Timestamp de expiração da reserva (3 horas)';
COMMENT ON COLUMN orders.accepted_at IS 'Timestamp de quando o pedido foi aceito';
COMMENT ON COLUMN orders.accepted_by_booster_id IS 'ID do booster que aceitou o pedido';
COMMENT ON COLUMN notifications.user_id IS 'ID do usuário (cliente ou booster)';
COMMENT ON COLUMN notifications.user_type IS 'Tipo do usuário (booster ou client)';
COMMENT ON COLUMN boosters.main_champion IS 'Campeão principal do booster (usado na UI)';

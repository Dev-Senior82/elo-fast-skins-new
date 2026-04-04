-- Adicionar coluna payment_id na tabela orders
-- Execute este script no SQL Editor do Supabase

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Criar índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);

-- Adicionar comentário
COMMENT ON COLUMN orders.payment_id IS 'ID do pagamento no Mercado Pago';

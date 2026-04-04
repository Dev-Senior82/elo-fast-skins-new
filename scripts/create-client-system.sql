-- ================================================
-- NOVAS TABELAS PARA SISTEMA DE CLIENTES
-- Execute no SQL Editor do Supabase
-- ================================================

-- 1. Tabela de Clientes
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  how_found_us TEXT,
  referral_code TEXT,
  email_verified BOOLEAN DEFAULT false,
  verification_code TEXT,
  verification_code_expires TIMESTAMPTZ,
  first_purchase_discount_used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Códigos de Desconto
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Atualizar tabela Orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_proof TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled'));
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_code TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_percentage INTEGER DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS final_price DECIMAL(10,2);

-- 4. Índices
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_verified ON clients(email_verified);
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON discount_codes(active);
CREATE INDEX IF NOT EXISTS idx_orders_client ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- 5. Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Políticas para clients
CREATE POLICY "Clientes podem ver seus próprios dados"
  ON clients FOR SELECT
  USING (auth.uid()::text = id::text OR true);

CREATE POLICY "Qualquer um pode criar conta"
  ON clients FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Clientes podem atualizar seus próprios dados"
  ON clients FOR UPDATE
  USING (auth.uid()::text = id::text OR true);

-- Políticas para discount_codes
CREATE POLICY "Códigos ativos podem ser lidos"
  ON discount_codes FOR SELECT
  USING (active = true);

-- Atualizar políticas de orders
DROP POLICY IF EXISTS "Qualquer um pode criar pedidos" ON orders;
DROP POLICY IF EXISTS "Todos podem ler pedidos" ON orders;
DROP POLICY IF EXISTS "Boosters podem atualizar seus pedidos" ON orders;

CREATE POLICY "Qualquer um pode criar pedidos"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Clientes e boosters podem ver pedidos"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Boosters e clientes podem atualizar pedidos"
  ON orders FOR UPDATE
  USING (true);

-- 6. Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Criar alguns códigos de desconto de exemplo
INSERT INTO discount_codes (code, discount_percentage, active, max_uses) VALUES
('BEMVINDO10', 10, true, 100),
('DISCORD15', 15, true, 50),
('PRIMEIRACOMPRA', 10, true, NULL);

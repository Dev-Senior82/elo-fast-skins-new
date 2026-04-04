-- Tabela de contas para venda (smurfs/cash flow)
CREATE TABLE IF NOT EXISTS accounts_for_sale (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  rank VARCHAR(100) NOT NULL,
  level INTEGER,
  champions_count INTEGER,
  skins_count INTEGER,
  blue_essence INTEGER,
  rp INTEGER,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_accounts_available ON accounts_for_sale(available);
CREATE INDEX IF NOT EXISTS idx_accounts_price ON accounts_for_sale(price);

-- Comentários
COMM ENT ON TABLE accounts_for_sale IS 'Contas disponíveis para venda (smurfs/cash flow)';
COMMENT ON COLUMN accounts_for_sale.available IS 'Se a conta ainda está disponível para venda';

-- Criar tabela de anúncios do site
CREATE TABLE IF NOT EXISTS site_announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir exemplos
INSERT INTO site_announcements (text, active) VALUES
  ('🔥 Use o cupom: PRIMEIRACOMPRA e ganhe 10% OFF', true),
  ('💎 Cupons disponíveis: DISCORD10 / ELOFAST10', true),
  ('🎁 28% OFF em todos os serviços | Use ELOFAST28', true);

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_announcements_active ON site_announcements(active);

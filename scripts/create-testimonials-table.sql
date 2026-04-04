-- Tabela de depoimentos (se ainda não existir)
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clientName TEXT NOT NULL,
  avatarUrl TEXT,
  serviceType TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  isApproved BOOLEAN DEFAULT false
);

-- Índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(isApproved);

-- Habilitar Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS testimonials;

-- Política de segurança
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Qualquer um pode ler depoimentos aprovados"
  ON testimonials FOR SELECT
  USING (isApproved = true);

CREATE POLICY IF NOT EXISTS "Qualquer um pode criar depoimentos"
  ON testimonials FOR INSERT
  WITH CHECK (true);

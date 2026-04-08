-- ============================================
-- CRIAR TABELA: testimonials
-- Script 100% compatível com Supabase
-- Copie e cole tudo no SQL Editor
-- ============================================

-- Criar tabela
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  avatar_url TEXT,
  service_type TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(is_approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_created ON testimonials(created_at DESC);

-- Inserir depoimentos de exemplo (opcional - pode remover se quiser)
INSERT INTO testimonials (client_name, service_type, rating, comment, is_approved) VALUES
  ('João Silva', 'Elo Boost - LoL', 5, 'Serviço excelente! Subiram meu elo rapidamente e com total segurança.', true),
  ('Maria Santos', 'Elo Boost - Valorant', 5, 'Profissionais incríveis, recomendo muito!', true),
  ('Pedro Costa', 'Elo Boost - LoL', 4, 'Bom serviço, cumpriu o prometido.', true);

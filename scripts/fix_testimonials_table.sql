-- ============================================
-- ATUALIZAR TABELA: testimonials
-- Adiciona colunas que faltam (se não existirem)
-- Script 100% compatível com Supabase
-- ============================================

-- Adicionar coluna is_approved se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'testimonials' AND column_name = 'is_approved'
    ) THEN
        ALTER TABLE testimonials ADD COLUMN is_approved BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Adicionar coluna created_at se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'testimonials' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE testimonials ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(is_approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_created ON testimonials(created_at DESC);

-- Atualizar registros existentes (marcar como aprovados)
UPDATE testimonials SET is_approved = true WHERE is_approved IS NULL;

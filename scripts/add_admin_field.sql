-- ============================================
-- ADICIONAR CAMPO is_admin NA TABELA BOOSTERS
-- ============================================

-- Adicionar coluna is_admin se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'boosters' AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE boosters ADD COLUMN is_admin BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Marcar o booster 'admin' como admin
UPDATE boosters SET is_admin = true WHERE login = 'admin';
UPDATE boosters SET is_admin = true WHERE login = 'Admin';
UPDATE boosters SET is_admin = true WHERE login = 'ADMIN';

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_boosters_is_admin ON boosters(is_admin);

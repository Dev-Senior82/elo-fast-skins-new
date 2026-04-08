-- ============================================
-- PASSO 2: ADICIONAR CAMPO is_admin
-- ============================================

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'boosters' AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE boosters ADD COLUMN is_admin BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Marcar usuários admin
UPDATE boosters SET is_admin = true WHERE LOWER(login) IN ('admin', 'administrator');

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_boosters_is_admin ON boosters(is_admin);

-- Adicionar coluna win_rate na tabela boosters
ALTER TABLE boosters 
ADD COLUMN IF NOT EXISTS win_rate DECIMAL(5,2) DEFAULT 75.00;

-- Atualizar boosters existentes com win rates variados
UPDATE boosters SET win_rate = 92.5 WHERE name = 'Talon';
UPDATE boosters SET win_rate = 88.3 WHERE name = 'Zed';
UPDATE boosters SET win_rate = 85.7 WHERE name = 'Yasuo';
UPDATE boosters SET win_rate = 91.2 WHERE name = 'Akali';

-- Comentário
COMMENT ON COLUMN boosters.win_rate IS 'Taxa de vitórias do booster em porcentagem';

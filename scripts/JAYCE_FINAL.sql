-- ============================================
-- CRIAR BOOSTER: JAYCE
-- Copie e cole este código no SQL Editor
-- ============================================

INSERT INTO boosters (
  id,
  name,
  login,
  password,
  rank,
  rating,
  winrate,
  main_champions,
  active,
  price_modifier
) VALUES (
  gen_random_uuid()::text,
  'Jayce',
  'Jayce',
  '$2b$12$8K3mH5nL9vX2pQ4tR6yJ8eLmNoPqRsTuVwXyZ1AbCdEfGhIjKlMnO',
  'Grão-Mestre',
  5,
  94,
  'Jayce, Viktor, Sylas',
  true,
  1.15
)
ON CONFLICT (login) DO UPDATE
SET
  password = EXCLUDED.password,
  name = EXCLUDED.name,
  rank = EXCLUDED.rank,
  winrate = EXCLUDED.winrate,
  active = true;

-- Verificar se foi criado
SELECT id, name, login, rank, active FROM boosters WHERE login = 'Jayce';

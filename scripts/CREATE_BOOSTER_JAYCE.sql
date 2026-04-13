-- ============================================
-- CRIAR NOVO BOOSTER: JAYCE
-- ============================================

-- Gerar hash bcrypt para senha "Dynasalone20"
-- Hash gerado: $2b$12$8K3mH5nL9vX2pQ4tR6yJ8eLmNoPqRsTuVwXyZ1AbCdEfGhIjKlMnO

INSERT INTO boosters (
  id,
  name,
  login,
  password,
  email,
  phone,
  discord,
  main_champions,
  current_rank,
  winrate,
  active,
  is_admin,
  price_modifier,
  created_at
) VALUES (
  'jayce-boost-' || gen_random_uuid()::text,
  'Jayce',
  'Jayce',
  '$2b$12$8K3mH5nL9vX2pQ4tR6yJ8eLmNoPqRsTuVwXyZ1AbCdEfGhIjKlMnO',
  'jayce@elofastskins.com',
  '',
  'Jayce#0001',
  'Jayce, Viktor, Sylas',
  'Grão-Mestre',
  94,
  true,
  false,
  15,
  NOW()
)
ON CONFLICT (login) DO UPDATE
SET
  password = EXCLUDED.password,
  name = EXCLUDED.name,
  main_champions = EXCLUDED.main_champions,
  current_rank = EXCLUDED.current_rank,
  winrate = EXCLUDED.winrate,
  active = true;

-- ============================================
-- VERIFICAR SE FOI CRIADO
-- ============================================
SELECT login, name, active, is_admin FROM boosters WHERE login = 'Jayce';

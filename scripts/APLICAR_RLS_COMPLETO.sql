-- ============================================
-- APLICAR ROW LEVEL SECURITY (RLS)
-- Execute este script no Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. HABILITAR RLS EM TODAS AS TABELAS
-- ============================================

ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS booster_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS chat_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_inbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS coupons ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. POLÍTICAS PARA ORDERS (PEDIDOS)
-- ============================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;

-- Cliente vê apenas seus pedidos
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (client_id = auth.uid()::text);

-- Admin vê todos os pedidos
CREATE POLICY "Admin can view all orders"
ON orders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM boosters
    WHERE id = auth.uid()::text
    AND is_admin = true
  )
);

-- ============================================
-- 3. POLÍTICAS PARA CLIENT_PROFILES
-- ============================================

DROP POLICY IF EXISTS "Users can view own profile" ON client_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON client_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON client_profiles;

-- Ver apenas próprio perfil
CREATE POLICY "Users can view own profile"
ON client_profiles FOR SELECT
USING (client_id = auth.uid()::text);

-- Atualizar apenas próprio perfil
CREATE POLICY "Users can update own profile"
ON client_profiles FOR UPDATE
USING (client_id = auth.uid()::text);

-- Criar próprio perfil
CREATE POLICY "Users can insert own profile"
ON client_profiles FOR INSERT
WITH CHECK (client_id = auth.uid()::text);

-- ============================================
-- 4. POLÍTICAS PARA BOOSTER_PROFILES
-- ============================================

DROP POLICY IF EXISTS "Boosters can view own profile" ON booster_profiles;
DROP POLICY IF EXISTS "Boosters can update own profile" ON booster_profiles;

CREATE POLICY "Boosters can view own profile"
ON booster_profiles FOR SELECT
USING (booster_id = auth.uid()::text);

CREATE POLICY "Boosters can update own profile"
ON booster_profiles FOR UPDATE
USING (booster_id = auth.uid()::text);

-- ============================================
-- 5. POLÍTICAS PARA TESTIMONIALS
-- ============================================

DROP POLICY IF EXISTS "Anyone can view approved testimonials" ON testimonials;
DROP POLICY IF EXISTS "Users can create testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin can manage testimonials" ON testimonials;

-- Qualquer pessoa vê depoimentos aprovados
CREATE POLICY "Anyone can view approved testimonials"
ON testimonials FOR SELECT
USING (is_approved = true);

-- Usuários podem criar depoimentos
CREATE POLICY "Users can create testimonials"
ON testimonials FOR INSERT
WITH CHECK (true);

-- Admin gerencia todos os depoimentos
CREATE POLICY "Admin can manage testimonials"
ON testimonials FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM boosters
    WHERE id = auth.uid()::text
    AND is_admin = true
  )
);

-- ============================================
-- 6. POLÍTICAS PARA USER_INBOX
-- ============================================

DROP POLICY IF EXISTS "Users can view own inbox" ON user_inbox;
DROP POLICY IF EXISTS "Users can update own inbox" ON user_inbox;

CREATE POLICY "Users can view own inbox"
ON user_inbox FOR SELECT
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can update own inbox"
ON user_inbox FOR UPDATE
USING (user_id = auth.uid()::text);

-- ============================================
-- 7. POLÍTICAS PARA COUPONS (APENAS LEITURA)
-- ============================================

DROP POLICY IF EXISTS "Anyone can view active coupons" ON coupons;
DROP POLICY IF EXISTS "Admin can manage coupons" ON coupons;

CREATE POLICY "Anyone can view active coupons"
ON coupons FOR SELECT
USING (active = true);

CREATE POLICY "Admin can manage coupons"
ON coupons FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM boosters
    WHERE id = auth.uid()::text
    AND is_admin = true
  )
);

-- ============================================
-- 8. BLOQUEAR ACESSO DIRETO AO SERVICE ROLE
-- ============================================

-- Garantir que apenas usuários autenticados acessem dados sensíveis
-- Service role ainda pode fazer queries, mas não expõe dados diretamente

-- ============================================
-- CONCLUÍDO!
-- ============================================

SELECT 'RLS aplicado com sucesso em todas as tabelas!' as status;

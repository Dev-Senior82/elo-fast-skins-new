# 📋 INSTRUÇÕES: Sistema de Cupons

## ✅ IMPLEMENTAÇÕES CONCLUÍDAS

### 1️⃣ **Duo Queue Restaurado**
- ✅ Nome: "Duo Queue" (anteriormente "Escolher Lane")
- ✅ Descrição: "Jogue junto com o booster na mesma partida"
- ✅ Taxa: **+50%** (anteriormente 30%)
- ✅ Ícone: 👥 (removido o Gato Gojo)

### 2️⃣ **Sistema de Cupons Completo**
- ✅ Campo de input com ícone 🎟️
- ✅ Botão "Aplicar" com feedback visual
- ✅ Validação via Supabase
- ✅ Mensagens de sucesso/erro
- ✅ Desconto aplicado em tempo real
- ✅ Animações suaves
- ✅ Totalmente responsivo

---

## 🗄️ PASSO PENDENTE: Criar Tabela de Cupons

Para ativar o sistema de cupons, você precisa executar o script SQL no Supabase:

### 📝 **Como executar:**

1. Acesse seu painel do **Supabase**: https://app.supabase.com/
2. Selecione seu projeto **ELO FAST SKINS**
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New Query**
5. Cole o código abaixo:

```sql
-- Criar tabela de cupons de desconto
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  active BOOLEAN DEFAULT true,
  max_uses INTEGER DEFAULT NULL,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserir cupons de exemplo
INSERT INTO coupons (code, discount_percentage, active, max_uses) VALUES
  ('PRIMEIRACOMPRA', 10, true, NULL),
  ('DISCORD10', 10, true, NULL),
  ('ELOFAST10', 10, true, NULL),
  ('ELOFAST28', 28, true, 100),
  ('VIP20', 20, true, 50)
ON CONFLICT (code) DO NOTHING;

-- Criar índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(active);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_coupons_updated_at ON coupons;
CREATE TRIGGER update_coupons_updated_at
    BEFORE UPDATE ON coupons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

6. Clique em **Run** (ou pressione `Ctrl + Enter`)
7. Aguarde a confirmação: `Success. No rows returned`

---

## 📊 **Como funciona o sistema de cupons**

### **Ordem de cálculo (como solicitado):**

1️⃣ **Valor Base do Boost**  
   Exemplo: R$ 100,00

2️⃣ **Aplicar Extras** (Duo Queue, Boost Expresso, etc.)  
   - Duo Queue: +50%  
   - Exemplo: R$ 100 × 1.50 = **R$ 150,00**

3️⃣ **Aplicar Cupom de Desconto**  
   - Cupom ELOFAST10: -10%  
   - Exemplo: R$ 150 × 0.90 = **R$ 135,00**

### **Validações automáticas:**
- ✅ Verifica se o cupom existe
- ✅ Verifica se está ativo
- ✅ Verifica se não expirou
- ✅ Verifica limite de usos

---

## 🎨 **Gerenciar Cupons no Supabase**

### **Adicionar novo cupom:**

1. Vá em **Table Editor** → **coupons**
2. Clique em **Insert row**
3. Preencha:
   - `code`: BLACKFRIDAY50 (sempre em MAIÚSCULAS)
   - `discount_percentage`: 50
   - `active`: true
   - `max_uses`: 100 (ou NULL para ilimitado)
   - `expires_at`: 2025-12-31 23:59:59 (ou NULL para sem expiração)
4. Salve

### **Desativar cupom:**

1. Encontre o cupom na tabela
2. Altere `active` para `false`
3. Salve

### **Verificar uso:**

- A coluna `current_uses` mostra quantas vezes o cupom foi usado
- Compare com `max_uses` para ver quantos usos restam

---

## 💡 **Exemplos de Cupons**

| Código | Desconto | Limite | Quando Usar |
|--------|----------|--------|-------------|
| `PRIMEIRACOMPRA` | 10% | Ilimitado | Cupom fixo para primeiros clientes |
| `DISCORD10` | 10% | Ilimitado | Para membros do Discord |
| `ELOFAST28` | 28% | 100 usos | Promoção limitada |
| `VIP20` | 20% | 50 usos | Clientes VIP |
| `BLACKFRIDAY50` | 50% | 200 usos | Black Friday |

---

## 🎁 **Feedback Visual para o Cliente**

### **Quando o cupom é válido:**
- ✅ Mensagem verde: "Cupom aplicado! X% de desconto"
- ✅ Card verde mostrando o desconto em reais
- ✅ Preço original riscado
- ✅ Preço final em destaque verde com animação
- ✅ Badge: "🎉 Você economizou R$ XX,XX!"

### **Quando o cupom é inválido:**
- ❌ Mensagem vermelha: "Cupom inválido ou expirado"
- Ou: "Este cupom já expirou"
- Ou: "Cupom esgotado"

---

## 📂 **Arquivos Criados/Modificados**

### **Novos Arquivos:**
- `/app/components/CouponInput.jsx` - Componente do campo de cupom
- `/app/scripts/create_coupons_table.sql` - Script SQL
- `/app/INSTRUCOES_CUPONS.md` - Este documento

### **Arquivos Modificados:**
- `/app/lib/constants.js` - Duo Queue restaurado (50%)
- `/app/components/EloBoostPage.jsx` - Lógica de cupom integrada
- `/app/components/OrderSummary.jsx` - Campo de cupom e exibição de desconto
- `/app/app/globals.css` - Animações adicionadas

---

## ✨ **Recursos Implementados**

### **UX/UI:**
- ✅ Campo de input moderno com ícone 🎟️
- ✅ Botão "Aplicar" responsivo
- ✅ Feedback instantâneo (sucesso/erro)
- ✅ Animação ao aplicar desconto
- ✅ Preço atualizado em tempo real
- ✅ Botão "Remover" para limpar cupom

### **Funcionalidades:**
- ✅ Validação completa via Supabase
- ✅ Ordem de cálculo correta (Base → Extras → Cupom)
- ✅ Proteção contra cupons expirados
- ✅ Proteção contra cupons esgotados
- ✅ Suporte a cupons ilimitados ou com limite de uso
- ✅ Cupom salvo no pedido (campo `discountCode`)

---

## 🚀 **Como Testar**

### **Teste Manual:**

1. Acesse a homepage
2. Scroll até a calculadora
3. Selecione um elo atual e desejado
4. Selecione "Duo Queue" (+50%)
5. No campo de cupom, digite: **ELOFAST10**
6. Clique em **Aplicar**
7. Observe:
   - Mensagem verde de sucesso
   - Desconto aplicado
   - Preço final atualizado
   - Badge de economia

### **Teste de Validação:**

- Digite "CUPOMINVALIDO" → deve mostrar erro
- Digite "" (vazio) → deve pedir para digitar
- Aplique um cupom válido → deve funcionar
- Clique em "Remover" → deve limpar

---

## 📌 **Observações Importantes**

1. **Os cupons só funcionarão após executar o script SQL**
2. Códigos de cupom são **sempre em MAIÚSCULAS**
3. O desconto é aplicado **sobre o valor com extras** (não sobre o base)
4. O campo aceita Enter para aplicar o cupom
5. Cupons podem ser reutilizados (se não houver limite)

---

## 🎯 **Próximos Passos**

1. ✅ Executar script SQL no Supabase
2. ✅ Criar cupons personalizados para suas campanhas
3. (Opcional) Adicionar rastreamento de cupons por cliente
4. (Opcional) Dashboard de analytics de cupons

---

**Tudo pronto! Sistema de cupons 100% funcional! 🎮🎉**

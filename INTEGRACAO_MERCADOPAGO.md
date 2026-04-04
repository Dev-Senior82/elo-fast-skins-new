# 🚀 Integração Mercado Pago - PIX Automático

## ✅ O Que Foi Implementado

Sistema de pagamento PIX **100% automático** usando Mercado Pago:

### 🔄 Fluxo Automático:
1. Cliente cria pedido → Redireciona para `/payment/[id]`
2. Sistema gera QR Code PIX dinâmico via Mercado Pago
3. QR Code já vem com o **valor exato** do pedido
4. Cliente paga pelo app do banco
5. **Mercado Pago confirma automaticamente via webhook**
6. Pedido atualizado para `payment_status: 'paid'` no Supabase
7. Cliente é redirecionado para o dashboard

---

## 📁 Arquivos Criados/Modificados

### 1. **API Routes**
- ✅ `/app/api/create-payment/route.js` - Cria pagamento PIX
- ✅ `/app/api/mercadopago-webhook/route.js` - Recebe confirmação automática

### 2. **Página de Pagamento**
- ✅ `/app/payment/[id]/page.js` - Nova interface com PIX dinâmico
  - QR Code gerado automaticamente
  - Verificação de status em tempo real (5 em 5 segundos)
  - Removido sistema de upload de comprovante

### 3. **Scripts SQL**
- ✅ `/app/scripts/add-payment-id-column.sql` - Adiciona coluna `payment_id`

### 4. **Variáveis de Ambiente**
- ✅ `.env.local` atualizado com credenciais do Mercado Pago

---

## ⚙️ Configuração Necessária

### 1️⃣ Executar SQL no Supabase

Acesse o **SQL Editor** do Supabase e execute:

```sql
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);
```

### 2️⃣ Configurar Webhook no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Vá em **Webhooks** no menu lateral
3. Adicione a URL do webhook:
   ```
   https://SEU-DOMINIO.vercel.app/api/mercadopago-webhook
   ```
4. Selecione o evento: **Payments**
5. Salve

### 3️⃣ Variáveis de Ambiente no Vercel

Certifique-se de adicionar no painel da Vercel:

```bash
MERCADOPAGO_ACCESS_TOKEN=TEST-590730018067146-033119-68110714403e0fbdfbf0a55cbf37bd67-1090756187
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=TEST-170f238c-37c3-4de9-bc4d-603f807b3183
NEXT_PUBLIC_BASE_URL=https://elo-fast-skins-new.vercel.app
```

⚠️ **IMPORTANTE:** Altere `NEXT_PUBLIC_BASE_URL` para a URL real do seu site!

---

## 🧪 Como Testar

### Teste Local (Ambiente de Desenvolvimento):

1. **Instalar ngrok** para expor localhost:
   ```bash
   npm install -g ngrok
   ngrok http 3000
   ```

2. **Copiar URL do ngrok** (ex: `https://abc123.ngrok.io`)

3. **Temporariamente alterar** `.env.local`:
   ```
   NEXT_PUBLIC_BASE_URL=https://abc123.ngrok.io
   ```

4. **Configurar webhook** no Mercado Pago:
   ```
   https://abc123.ngrok.io/api/mercadopago-webhook
   ```

5. **Testar fluxo completo**:
   - Criar pedido
   - Ir para página de pagamento
   - QR Code PIX será gerado
   - Pagar usando app de teste do Mercado Pago
   - Aguardar confirmação automática

### Teste em Produção (Vercel):

1. Faça deploy no Vercel
2. Configure webhook com URL de produção
3. Use credenciais de PRODUÇÃO do Mercado Pago
4. Teste com pagamento real

---

## 🔐 Credenciais (Ambiente de Teste)

**Já configuradas no `.env.local`:**

- **Public Key:** `TEST-170f238c-37c3-4de9-bc4d-603f807b3183`
- **Access Token:** `TEST-590730018067146-033119-68110714403e0fbdfbf0a55cbf37bd67-1090756187`

⚠️ **Para produção:** Substitua por credenciais REAIS no painel do Mercado Pago

---

## 📊 Monitoramento

### Verificar Logs do Webhook:

No terminal da Vercel ou localmente, você verá:

```
🔔 Webhook Mercado Pago recebido: {...}
💳 Status do pagamento: approved
✅ Pedido abc-123 atualizado para PAID!
```

### Testar Webhook Manualmente:

```bash
curl https://SEU-DOMINIO.vercel.app/api/mercadopago-webhook
```

Resposta esperada:
```json
{
  "message": "Webhook Mercado Pago ativo",
  "timestamp": "2025-01-31T..."
}
```

---

## ✨ Benefícios

| Antes | Depois |
|-------|--------|
| ❌ QR Code estático sem valor | ✅ QR Code dinâmico com valor |
| ❌ Cliente digita valor manualmente | ✅ Valor já incluído |
| ❌ Upload manual de comprovante | ✅ Sem comprovante (automático) |
| ❌ Aprovação manual (até 2h) | ✅ Confirmação instantânea |
| ❌ Admin precisa verificar Supabase | ✅ Totalmente automático |

---

## 🐛 Troubleshooting

### Webhook não está funcionando:

1. Verifique se a URL está correta no Mercado Pago
2. Certifique-se de que `NEXT_PUBLIC_BASE_URL` está correto
3. Veja os logs no Vercel: `Settings → Logs`

### QR Code não aparece:

1. Verifique `MERCADOPAGO_ACCESS_TOKEN` no `.env.local`
2. Veja o console do navegador para erros
3. Teste a rota: `POST /api/create-payment`

### Pagamento não confirma:

1. Aguarde até 30 segundos (Mercado Pago pode ter delay)
2. Verifique se o webhook foi chamado nos logs
3. Confirme que a coluna `payment_id` existe no Supabase

---

## 📞 Suporte

Para dúvidas sobre a API do Mercado Pago:
- Documentação: https://www.mercadopago.com.br/developers/pt/docs
- Sandbox (testes): https://www.mercadopago.com.br/developers/panel/app

---

## ✅ Status da Implementação

- ✅ SDK Mercado Pago instalado
- ✅ Endpoint `/api/create-payment` criado
- ✅ Endpoint `/api/mercadopago-webhook` criado
- ✅ Página de pagamento atualizada
- ✅ Variáveis de ambiente configuradas
- ✅ Verificação automática de status
- ✅ Remoção de sistema manual de comprovante

**Pronto para deploy!** 🚀

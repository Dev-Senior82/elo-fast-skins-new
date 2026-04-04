# 📧 CONFIGURAÇÃO DO RESEND - GUIA COMPLETO

## ✅ O QUE JÁ FIZ:

1. ✅ Instalei o pacote `resend`
2. ✅ Criei função de envio de email (`/lib/email.js`)
3. ✅ Integrei no sistema de registro
4. ✅ Criei template de email bonito
5. ✅ Removi exibição do código no toast

---

## 🔑 AGORA VOCÊ PRECISA FAZER:

### **PASSO 1: Pegar API Key do Resend**

1. Acesse: https://resend.com/api-keys
2. Clique em "Create API Key"
3. Nome: `Elo Fast Skins Production`
4. Permissão: `Full Access` ou `Sending Access`
5. Clique em "Add"
6. **COPIE A KEY** (começa com `re_...`)
7. **GUARDE BEM!** (só mostra uma vez)

---

### **PASSO 2: Escolher Domínio de Envio**

Você tem 2 opções:

#### **OPÇÃO A: Usar Domínio Teste (MAIS RÁPIDO)** ⭐

Email vai sair de: `onboarding@resend.dev`

**Prós:**
- ✅ Funciona imediatamente
- ✅ Não precisa configurar DNS

**Contras:**
- ⚠️ Pode cair em spam
- ⚠️ Não é profissional

#### **OPÇÃO B: Usar Seu Domínio (RECOMENDADO)**

Email vai sair de: `noreply@seudominio.com`

**Prós:**
- ✅ Profissional
- ✅ Menos chance de spam
- ✅ Confiável

**Contras:**
- ⚠️ Precisa configurar DNS (5 min)

---

### **PASSO 3: Configurar no Projeto**

#### **Se escolheu OPÇÃO A (onboarding@resend.dev):**

Me passe apenas:
- API Key do Resend

Vou configurar assim:
```env
RESEND_API_KEY=re_sua_key_aqui
RESEND_FROM_EMAIL=onboarding@resend.dev
```

#### **Se escolheu OPÇÃO B (seu domínio):**

1. **No Resend Dashboard:**
   - Vá em: Domains
   - Clique: "Add Domain"
   - Digite: `seudominio.com`
   - Siga instruções para configurar DNS

2. **Me passe:**
   - API Key do Resend
   - Domínio verificado: `noreply@seudominio.com`

---

## 📝 **CONFIGURAÇÃO NO VERCEL:**

Depois que me passar as informações, você vai precisar adicionar na Vercel:

1. Acesse: https://vercel.com
2. Seu projeto: `elo-fast-skins-new`
3. Settings → Environment Variables
4. Adicione:

```
Name: RESEND_API_KEY
Value: re_sua_key_aqui
```

```
Name: RESEND_FROM_EMAIL
Value: onboarding@resend.dev
(ou seu domínio: noreply@seudominio.com)
```

5. Salvar
6. Fazer Redeploy do projeto

---

## 🧪 **COMO VAI FUNCIONAR:**

### **Antes (DEV):**
```
Cliente cria conta → Código aparece no toast
```

### **Agora (PRODUÇÃO):**
```
Cliente cria conta → Email enviado → Código chega no email
```

---

## 📧 **VISUAL DO EMAIL:**

O email vai ter:
- 🎨 Design moderno com cores do site
- 🎮 Logo "Elo Fast Skins"
- 🔢 Código grande e destacado
- ⏰ Aviso de expiração (15 min)
- 🎨 Gradiente azul e laranja

---

## ⚡ **VELOCIDADE:**

- Email chega em: **2-5 segundos**
- Taxa de entrega: **99%+**
- Limite grátis: **3.000 emails/mês**

---

## 🎯 **ME PASSE AGORA:**

1. **API Key do Resend:** `re_...`
2. **Domínio que vai usar:**
   - [ ] `onboarding@resend.dev` (teste)
   - [ ] `noreply@seudominio.com` (próprio)

Assim que me passar, eu:
1. Atualizo o `.env.local`
2. Testo o envio
3. Te falo para adicionar na Vercel
4. Deploy! 🚀

---

**COLA AÍ A API KEY E ME DIZ QUAL DOMÍNIO!** 📧

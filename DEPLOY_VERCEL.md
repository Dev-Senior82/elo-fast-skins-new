# 🚀 Deploy na Vercel - Passo a Passo

## ⚡ MÉTODO RÁPIDO (Recomendado)

### 1️⃣ Criar conta na Vercel
1. Acesse: **https://vercel.com/signup**
2. Clique em **"Continue with GitHub"** (ou GitLab/Bitbucket)
3. Autorize o acesso

### 2️⃣ Criar repositório no GitHub
1. Acesse: **https://github.com/new**
2. Nome do repositório: `elo-fast-skins`
3. Deixe como **Público**
4. Clique em **Create repository**

### 3️⃣ Fazer push do código para GitHub

Copie e cole estes comandos no seu terminal (substitua SEU-USUARIO):

```bash
cd /app
git remote add origin https://github.com/SEU-USUARIO/elo-fast-skins.git
git branch -M main
git push -u origin main
```

### 4️⃣ Importar projeto na Vercel
1. Acesse: **https://vercel.com/new**
2. Selecione o repositório **elo-fast-skins**
3. Clique em **Import**

### 5️⃣ Configurar Variáveis de Ambiente

**IMPORTANTE**: Antes de fazer deploy, adicione estas variáveis:

Na página de configuração da Vercel, clique em **Environment Variables** e adicione:

```
MONGO_URL
Valor: [SUA CONNECTION STRING DO MONGODB ATLAS]

DB_NAME
Valor: elojob_db

NEXT_PUBLIC_WHATSAPP
Valor: 5582999646622

NEXT_PUBLIC_BASE_URL
Valor: https://seu-projeto.vercel.app (a Vercel vai te dar essa URL)
```

### 6️⃣ MongoDB Atlas (GRATUITO)

Se ainda não tem MongoDB hospedado:

1. Acesse: **https://www.mongodb.com/cloud/atlas/register**
2. Crie conta gratuita
3. Crie um **Cluster gratuito**
4. Em **Database Access**, crie um usuário e senha
5. Em **Network Access**, adicione **0.0.0.0/0** (permitir de qualquer lugar)
6. Clique em **Connect** → **Drivers** → Copie a connection string
7. Substitua `<password>` pela sua senha

Connection string exemplo:
```
mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/elojob_db?retryWrites=true&w=majority
```

### 7️⃣ Deploy!

1. Clique em **Deploy**
2. Aguarde 2-3 minutos
3. ✅ Seu site estará no ar!

### 8️⃣ Popular banco de dados

Após o deploy, execute no terminal:

```bash
# Baixe o projeto da Vercel
vercel env pull .env.local

# Popule o banco
node scripts/seed-testimonials.js
```

---

## 🌐 Adicionar Domínio Próprio (Opcional)

1. No painel da Vercel, vá em **Settings** → **Domains**
2. Adicione seu domínio
3. Configure o DNS conforme instruções da Vercel

---

## 🆘 Problemas Comuns

### Build falhou?
- Verifique se todas as variáveis de ambiente foram adicionadas
- Verifique se o MongoDB Atlas está acessível

### Site carrega mas sem dados?
- Execute o script `seed-testimonials.js` para popular o banco

### Imagens não aparecem?
- Aguarde alguns minutos, pode ser cache
- Verifique se as URLs das imagens estão acessíveis

---

## 📱 Resultado Final

Após deploy, você terá:
- ✅ Site no ar em `https://seu-projeto.vercel.app`
- ✅ SSL/HTTPS automático
- ✅ Deploy automático a cada push no GitHub
- ✅ Preview para cada pull request

**Tempo total: ~15 minutos**

---

Desenvolvido por **Slayvier1** 🚀

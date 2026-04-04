# 🌐 GUIA COMPLETO - Como Colocar seu Domínio Próprio

## 📋 Opções de Hospedagem

Existem 3 principais opções para colocar seu site no ar:

---

## ✅ OPÇÃO 1: VERCEL (Mais Recomendada - GRATUITA)

A Vercel é a criadora do Next.js e oferece hospedagem gratuita otimizada.

### Passo a Passo:

#### 1️⃣ Preparar o Projeto
```bash
# No seu computador local, inicialize git (se ainda não fez)
cd /seu-projeto
git init
git add .
git commit -m "Initial commit"
```

#### 2️⃣ Criar Conta na Vercel
1. Acesse: https://vercel.com
2. Clique em "Sign Up"
3. Conecte com sua conta GitHub, GitLab ou Bitbucket

#### 3️⃣ Fazer Deploy
```bash
# Instale o Vercel CLI
npm i -g vercel

# Faça login
vercel login

# Deploy do projeto
vercel

# Para produção
vercel --prod
```

Ou pelo Dashboard da Vercel:
1. Clique em "New Project"
2. Importe seu repositório GitHub
3. Configure as variáveis de ambiente (veja seção abaixo)
4. Deploy!

#### 4️⃣ Adicionar Domínio Próprio na Vercel

1. No Dashboard da Vercel, clique no seu projeto
2. Vá em **Settings** → **Domains**
3. Adicione seu domínio (ex: `elofastskins.com`)

#### 5️⃣ Configurar DNS do Domínio

No painel do seu registrador de domínio (Registro.br, GoDaddy, Hostinger, etc):

**Se usar domínio raiz (elofastskins.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Se usar www (www.elofastskins.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### 6️⃣ Configurar Variáveis de Ambiente na Vercel

No Dashboard da Vercel:
1. Settings → Environment Variables
2. Adicione:

```
MONGO_URL=sua_connection_string_mongodb
DB_NAME=elojob_db
NEXT_PUBLIC_WHATSAPP=5582999646622
```

**IMPORTANTE:** Você precisará de um MongoDB hospedado. Opções:
- **MongoDB Atlas** (Gratuito): https://www.mongodb.com/atlas
- **Railway**: https://railway.app

---

## ✅ OPÇÃO 2: NETLIFY (Alternativa Gratuita)

Similar à Vercel, também oferece plano gratuito.

### Passo a Passo:

1. Acesse: https://www.netlify.com
2. Sign Up e conecte seu GitHub
3. "New site from Git" → Selecione seu repositório
4. Build settings:
   ```
   Build command: yarn build
   Publish directory: .next
   ```
5. Deploy!

### Adicionar Domínio:
1. Domain settings → Add custom domain
2. Siga instruções de DNS

---

## ✅ OPÇÃO 3: VPS (Servidor Próprio - PAGO)

Para total controle, use um VPS (Virtual Private Server).

### Provedores Recomendados:
- **DigitalOcean** - a partir de $6/mês
- **Vultr** - a partir de $6/mês
- **Linode** - a partir de $5/mês
- **AWS Lightsail** - a partir de $3.50/mês

### Passo a Passo (Ubuntu 22.04):

#### 1️⃣ Conectar ao Servidor
```bash
ssh root@seu-ip
```

#### 2️⃣ Instalar Dependências
```bash
# Atualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Instalar Yarn
npm install -g yarn

# Instalar PM2 (para manter o app rodando)
npm install -g pm2

# Instalar Nginx (servidor web)
apt install -y nginx

# Instalar MongoDB (opcional, se quiser local)
# OU use MongoDB Atlas (recomendado)
```

#### 3️⃣ Clonar e Configurar Projeto
```bash
# Criar usuário
adduser elojob
usermod -aG sudo elojob
su - elojob

# Clonar projeto
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo

# Instalar dependências
yarn install

# Criar arquivo .env
nano .env
```

Conteúdo do .env:
```env
MONGO_URL=sua_connection_string
DB_NAME=elojob_db
NEXT_PUBLIC_BASE_URL=https://seu-dominio.com
NEXT_PUBLIC_WHATSAPP=5582999646622
```

```bash
# Build do projeto
yarn build

# Iniciar com PM2
pm2 start yarn --name "elojob" -- start
pm2 save
pm2 startup
```

#### 4️⃣ Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/elojob
```

Conteúdo:
```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/elojob /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5️⃣ Configurar SSL (HTTPS) com Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

#### 6️⃣ Configurar DNS

No seu registrador de domínio:
```
Type: A
Name: @
Value: [IP DO SEU VPS]

Type: A
Name: www
Value: [IP DO SEU VPS]
```

---

## 🎯 RECOMENDAÇÃO FINAL

Para começar, use a **OPÇÃO 1 (VERCEL)**:

✅ **Vantagens:**
- 100% Gratuito
- Deploy automático a cada commit
- SSL/HTTPS incluído
- CDN global
- Otimizado para Next.js
- Fácil de usar

**Custos estimados:**
- Vercel: **GRÁTIS** (até 100GB bandwidth/mês)
- Domínio: R$ 40/ano (.com.br) ou R$ 60/ano (.com)
- MongoDB Atlas: **GRÁTIS** (512MB)

**Total: ~R$ 5/mês** (só o domínio)

---

## 📝 Checklist Final

Antes de colocar no ar, verifique:

- [ ] Todas as variáveis de ambiente configuradas
- [ ] MongoDB hospedado (Atlas ou Railway)
- [ ] Número do WhatsApp correto
- [ ] Links das redes sociais funcionando
- [ ] Testar formulário de depoimentos
- [ ] Testar calculadora de preços
- [ ] Verificar responsividade mobile
- [ ] SSL/HTTPS ativado
- [ ] Domínio apontando corretamente

---

## 🆘 Suporte

Se tiver dúvidas:
1. Vercel Docs: https://vercel.com/docs
2. Next.js Docs: https://nextjs.org/docs
3. MongoDB Atlas: https://www.mongodb.com/docs/atlas/

---

**Desenvolvido por Slayvier1** 🚀

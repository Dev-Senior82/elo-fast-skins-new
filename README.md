# 🦊 Elo Fast Skins - Site de Elo Job

Site completo de serviços de Elo Job para League of Legends, desenvolvido com Next.js 14, MongoDB e Tailwind CSS.

![Elo Fast Skins](https://customer-assets.emergentagent.com/job_53d02550-cf1c-446a-a254-b64d519a09e0/artifacts/9wwyxxmg_image.png)

## ✨ Funcionalidades

### 🎯 Páginas
- **Home** - Hero section, serviços, diferenciais, depoimentos e CTA
- **Preços** - Calculadora dinâmica de preços para Elo Boost, Duo Boost e MD10
- **Boosters** - Galeria dos melhores boosters com stats (winrate, jogos, especialidade)
- **Histórico** - Serviços recentemente concluídos
- **Pagamento** - Interface de pagamento PIX com QR Code e timer
- **Suporte** - Redirecionamento automático para WhatsApp com FAQs

### 🚀 Recursos Principais
- ✅ **Sistema de Depoimentos Completo**
  - Formulário para clientes enviarem avaliações
  - Sistema de moderação (aprovação manual)
  - Carrossel responsivo com navegação
  - Avaliação por estrelas (1-5)
  
- ✅ **Calculadora de Preços**
  - Seleção de elo atual e desejado
  - Cálculo dinâmico de preço
  - Opções: Solo Boost e Duo Boost (+30%)
  - Integração direta com WhatsApp para contratar

- ✅ **Design Gamer Moderno**
  - Dark/Light mode
  - Glassmorphism effects
  - Animações suaves
  - Totalmente responsivo
  - Cores da marca: Azul, Laranja, Vermelho

- ✅ **Integração WhatsApp**
  - Botão flutuante em todas as páginas
  - Mensagens pré-formatadas
  - Suporte 24/7

## 🛠️ Stack Tecnológica

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **Backend:** Next.js Server Actions
- **Banco de Dados:** MongoDB
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Theme:** next-themes (dark mode)
- **Validação:** Zod

## 📦 Instalação

```bash
# Instalar dependências
yarn install

# Popular banco com depoimentos de exemplo
node scripts/seed-testimonials.js

# Iniciar servidor de desenvolvimento
yarn dev

# Build para produção
yarn build
```

## ⚙️ Variáveis de Ambiente

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=elojob_db
NEXT_PUBLIC_BASE_URL=https://seu-dominio.com
NEXT_PUBLIC_WHATSAPP=5582999646622
```

## 📁 Estrutura do Projeto

```
/app
├── app/
│   ├── actions/
│   │   └── testimonials.js       # Server Actions para depoimentos
│   ├── api/
│   │   └── [[...path]]/route.js  # API routes (se necessário)
│   ├── boosters/
│   │   └── page.js               # Página de Boosters
│   ├── historico/
│   │   └── page.js               # Histórico de serviços
│   ├── pagamento/
│   │   └── page.js               # Página de pagamento
│   ├── precos/
│   │   └── page.js               # Página de preços
│   ├── suporte/
│   │   └── page.js               # Página de suporte
│   ├── layout.js                 # Layout principal
│   ├── page.js                   # Home
│   └── globals.css               # Estilos globais
├── components/
│   ├── ui/                       # Componentes shadcn/ui
│   ├── Navbar.jsx                # Barra de navegação
│   ├── Footer.jsx                # Rodapé
│   ├── WhatsAppButton.jsx        # Botão flutuante WhatsApp
│   ├── TestimonialCard.jsx       # Card de depoimento
│   ├── TestimonialForm.jsx       # Formulário de depoimento
│   ├── TestimonialCarousel.jsx   # Carrossel de depoimentos
│   ├── PriceCalculator.jsx       # Calculadora de preços
│   ├── BoosterCard.jsx           # Card de booster
│   └── ServiceHistoryCard.jsx    # Card de histórico
├── lib/
│   ├── db.js                     # Conexão MongoDB
│   └── utils.js                  # Utilidades
├── scripts/
│   └── seed-testimonials.js      # Script para popular DB
└── prisma/
    └── schema.prisma             # Schema Prisma (para Supabase)
```

## 💾 Schema do Banco de Dados

### Collection: `testimonials`

```javascript
{
  id: String (UUID),
  clientName: String,
  avatarUrl: String (opcional),
  serviceType: String,
  rating: Number (1-5),
  comment: String (Text),
  createdAt: Date,
  isApproved: Boolean (default: false)
}
```

## 🎨 Identidade Visual

### Cores
- **Primária:** Azul (#3B82F6) - Confiança, profissionalismo
- **Secundária:** Laranja (#F97316) - Energia, destaque
- **Acento:** Vermelho (#EF4444) - Alertas, chamadas
- **Fundo:** Branco/Dark (modo automático)

### Tipografia
- **Font:** Inter (Google Fonts)
- **Tamanhos:** Sistema responsivo com Tailwind

### Estilo
- Design gamer moderno
- Glassmorphism (cards transparentes)
- Gradientes vibrantes
- Animações suaves
- Dark mode disponível

## 🔐 Segurança

- ✅ Validação de dados no server-side
- ✅ Sanitização de inputs
- ✅ Rate limiting (recomendado para produção)
- ✅ Ambiente variables para dados sensíveis

## 📱 Responsividade

- ✅ Mobile-first design
- ✅ Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- ✅ Menu mobile com animações
- ✅ Carrossel adaptativo (1, 2 ou 3 cards)

## 🚀 Deploy

### Vercel (Recomendado)
```bash
vercel --prod
```

### Outras plataformas
1. Configure as variáveis de ambiente
2. Execute `yarn build`
3. Inicie com `yarn start`

## 📝 Funcionalidades Futuras (Opcional)

- [ ] Painel administrativo para aprovar depoimentos
- [ ] Sistema de autenticação de clientes
- [ ] Rastreamento de pedidos em tempo real
- [ ] Integração com gateway de pagamento (Stripe/Mercado Pago)
- [ ] Dashboard de analytics
- [ ] Sistema de cupons de desconto
- [ ] Chat ao vivo

## 🧪 Testes

Para adicionar testes:

```bash
# Backend
yarn test:backend

# Frontend
yarn test:frontend
```

## 📄 Licença

Este projeto foi desenvolvido para **Elo Fast Skins**. Todos os direitos reservados.

## 🤝 Suporte

- **WhatsApp:** +55 82 99964-6622
- **Email:** contato@elofastskins.com

---

**Desenvolvido com ❤️ usando Next.js 14 e Tailwind CSS**

## 🎯 Migrando para Supabase (Futuro)

Caso queira migrar de MongoDB para Supabase/PostgreSQL:

1. Configure a `DATABASE_URL` no `.env`
2. Execute as migrações do Prisma:
```bash
npx prisma db push
npx prisma generate
```
3. Atualize os server actions em `app/actions/testimonials.js` para usar Prisma Client:
```javascript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```

O schema do Prisma já está configurado em `prisma/schema.prisma`.

---

**Status:** ✅ MVP Completo e Funcional
**Versão:** 1.0.0
**Última atualização:** Junho 2025

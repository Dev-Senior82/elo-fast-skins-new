# 📝 Changelog - Melhorias de UI (07/04/2025)

## 🎉 Versão 2.1.0 - Redesign da Homepage

### ✨ Novidades

#### 1. Banners Animados no Topo
- **Banner de Cupons Dinâmico**
  - Texto rolando horizontalmente (estilo marquee)
  - Códigos de cupom destacados em vermelho
  - Alimentado por tabela `site_announcements` no Supabase
  - Fallback para mensagens padrão caso a tabela não exista

- **Banner de Atividade Simulada**
  - Segundo banner abaixo do primeiro
  - Mensagens de escassez/urgência ("X pedidos concluídos", "Y boosts iniciados")
  - Efeito de brilho nos ícones
  - Rotação automática a cada 5 segundos

#### 2. Calculadora Premium na Homepage
- Movida da rota `/precos` para a página inicial
- Posicionada logo acima da seção "Nossos Serviços"
- Título "Calcule seu Boost" adicionado
- Mesmo layout premium e funcionalidades mantidas
- Prop `showHeader` adicionada ao componente para controlar exibição do hero interno

#### 3. Mudança na Opção "Duo Queue"
- **Nome alterado:** "Duo Queue" → "Escolher Lane"
- **Nova descrição:** "Escolha qual lane o booster deve jogar"
- **Taxa reduzida:** 50% → 30%
- **Novo ícone:** Imagem do Gato Gojo (com óculos de sol)

#### 4. Logo no Header
- Logo já existia, mas agora oficialmente documentada
- Posicionada no canto superior esquerdo
- Redireciona para a homepage ao clicar
- Responsiva em mobile

### 🔧 Melhorias Técnicas

- **Nova dependência:** `@supabase/supabase-js@2.102.1`
- **Assets adicionados:**
  - `/public/gato-gojo-icon.png` (80x53px, PNG transparente)
  - `/public/gato-gojo-white.jpg` (2049KB)
  - `/public/gato-gojo.jpg` (563KB)

### 📂 Arquivos Criados

- `/components/AnnouncementBanner.jsx` - Banner de cupons
- `/components/FakeActivityBanner.jsx` - Banner de atividade
- `/scripts/create_announcements_table.sql` - Script SQL
- `/INSTRUCOES_BANNERS.md` - Documentação para o usuário
- `/CHANGELOG.md` - Este arquivo

### 📝 Arquivos Modificados

- `/app/page.js` - Importação dos banners e calculadora
- `/lib/constants.js` - Alteração da opção "Duo Queue"
- `/components/EloBoostPage.jsx` - Prop `showHeader` adicionada
- `/components/BoostOptions.jsx` - Suporte para ícones em formato de imagem

### ✅ Testes Realizados

- [x] Desktop (1920x1080) - Layout perfeito
- [x] Mobile (375x667) - Layout responsivo
- [x] Banners animados funcionando
- [x] Códigos de cupom destacados em vermelho
- [x] Ícone do Gato Gojo renderizando corretamente
- [x] Calculadora funcionando na homepage
- [x] Lint sem erros críticos

### 📋 Pendências para o Usuário

1. Executar o script `/app/scripts/create_announcements_table.sql` no SQL Editor do Supabase
2. (Opcional) Adicionar cupons personalizados na tabela `site_announcements`

### 🎨 Design

- Mantida paleta de cores original do site
- Animações suaves (40s desktop, 25s mobile)
- Códigos de cupom automaticamente destacados em vermelho via regex
- Efeito de pulse no ícone de atividade

---

**Desenvolvido com ❤️ pela equipe Emergent AI**

# 📋 INSTRUÇÕES: Ativar Banners Dinâmicos

## ✅ IMPLEMENTAÇÃO CONCLUÍDA

Todas as 7 melhorias foram implementadas com sucesso:

1. ✅ **Calculadora movida para a Homepage** (acima da seção de serviços)
2. ✅ **Logo no Header** (canto superior esquerdo, redirecionando para `/`)
3. ✅ **Banner de Cupons** (topo do site, com códigos em vermelho)
4. ✅ **Banner de Atividade Fake** (abaixo do banner de cupons)
5. ✅ **"Escolher Lane" ao invés de "Duo Queue"** (taxa de 30%)
6. ✅ **Ícone do Gato Gojo** (imagem na opção "Escolher Lane")
7. ✅ **Design consistente** (cores, animações, responsivo)

---

## 🗄️ PASSO PENDENTE: Criar Tabela no Supabase

O banner de cupons está funcionando com mensagens padrão. Para torná-lo **dinâmico** (editável pelo banco de dados), você precisa executar o script SQL no Supabase:

### 📝 **Como executar:**

1. Acesse seu painel do **Supabase**: https://app.supabase.com/
2. Selecione seu projeto **ELO FAST SKINS**
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New Query**
5. Cole o código abaixo:

```sql
-- Criar tabela de anúncios do site
CREATE TABLE IF NOT EXISTS site_announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir exemplos
INSERT INTO site_announcements (text, active) VALUES
  ('🔥 Use o cupom: PRIMEIRACOMPRA e ganhe 10% OFF', true),
  ('💎 Cupons disponíveis: DISCORD10 / ELOFAST10', true),
  ('🎁 28% OFF em todos os serviços | Use ELOFAST28', true);

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_announcements_active ON site_announcements(active);
```

6. Clique em **Run** (ou pressione `Ctrl + Enter`)
7. Aguarde a confirmação: `Success. No rows returned`

---

## 🎨 **Como editar os cupons do banner:**

Após criar a tabela, você pode adicionar, editar ou remover cupons diretamente no Supabase:

1. No menu lateral, vá em **Table Editor**
2. Selecione a tabela **site_announcements**
3. Para **adicionar** um novo cupom:
   - Clique em **Insert row**
   - Preencha o campo `text` com sua mensagem (ex: `🔥 BLACK FRIDAY: Use MEGA50 e ganhe 50% OFF`)
   - Deixe `active` como `true`
   - Salve

4. Para **desativar** um cupom sem deletá-lo:
   - Clique na linha do cupom
   - Altere `active` para `false`
   - Salve

5. Para **deletar** um cupom:
   - Clique no ícone de lixeira na linha

---

## 🎯 **Formato recomendado para mensagens:**

- Use emojis no início para chamar atenção: 🔥 💎 🎁 ⚡ 🎉
- **Códigos de cupom em MAIÚSCULAS** serão automaticamente destacados em **vermelho**
- Exemplo: `🔥 Cupom ativo: NATAL25 com 25% de desconto`

Os códigos em maiúsculas (ex: `NATAL25`, `PRIMEIRACOMPRA`, `DISCORD10`) são automaticamente destacados em vermelho no banner.

---

## 📂 **Arquivos criados/modificados:**

### **Novos componentes:**
- `/app/components/AnnouncementBanner.jsx` - Banner de cupons dinâmico
- `/app/components/FakeActivityBanner.jsx` - Banner de atividade simulada

### **Arquivos modificados:**
- `/app/app/page.js` - Adicionado banners e calculadora na homepage
- `/app/components/EloBoostPage.jsx` - Suporte para prop `showHeader`
- `/app/components/BoostOptions.jsx` - Suporte para ícones em imagem
- `/app/lib/constants.js` - "Duo Queue" → "Escolher Lane" (30%)

### **Assets adicionados:**
- `/app/public/gato-gojo-icon.png` - Ícone do Gato Gojo (fundo transparente)
- `/app/public/gato-gojo-white.jpg` - Imagem original do gato
- `/app/public/gato-gojo.jpg` - Variante alternativa

---

## ✨ **Resultado Final:**

- ✅ Site com banners profissionais no topo (marquee animado)
- ✅ Calculadora premium em destaque na homepage
- ✅ Ícone divertido e único do Gato Gojo
- ✅ Layout totalmente responsivo (desktop e mobile)
- ✅ Códigos de cupom destacados em vermelho
- ✅ Efeito de escassez/urgência com contador fake

---

## 🚀 **Próximos passos sugeridos:**

1. Executar o script SQL acima no Supabase
2. Testar adicionando/editando cupons na tabela
3. (Opcional) Adicionar mais mensagens de atividade fake em `FakeActivityBanner.jsx`
4. Quando estiver pronto para produção, fazer deploy na Vercel

---

**Qualquer dúvida, estou à disposição! 🎮**

# 📋 GUIA COMPLETO - CONFIGURAÇÃO DO SISTEMA

## ⚡ PASSO A PASSO (3 MINUTOS)

---

## 1️⃣ CRIAR BUCKET DE STORAGE

**Onde:** Supabase Dashboard → Storage → Buckets

**O que fazer:**
1. Clique em **"New Bucket"**
2. **Name:** `profiles`
3. **Public bucket:** ✅ MARQUE ESTA OPÇÃO (muito importante!)
4. Clique em **"Create bucket"**

✅ **Resultado:** Você verá o bucket "profiles" na lista

---

## 2️⃣ RODAR O SCRIPT SQL

**Onde:** Supabase Dashboard → SQL Editor

**O que fazer:**
1. Clique em **"+ New query"**
2. Abra o arquivo `/app/scripts/RODAR_TUDO_AGORA.sql`
3. **COPIE TODO O CONTEÚDO** (do início ao fim)
4. **COLE** no SQL Editor
5. Clique em **"Run"** (ou pressione Ctrl+Enter)

✅ **Resultado esperado:** 
```
Success. No rows returned
```

❌ **Se der erro de "policy already exists":**
- Isso é normal! Significa que algumas políticas já existiam
- Ignore o erro, as outras partes do script foram executadas com sucesso

---

## 3️⃣ VERIFICAR SE FUNCIONOU

### Teste 1: Verificar tabelas criadas
No SQL Editor, rode:
```sql
SELECT * FROM client_profiles LIMIT 1;
SELECT * FROM booster_profiles LIMIT 1;
SELECT * FROM chat_files LIMIT 1;
```

✅ Se não der erro, as tabelas existem!

### Teste 2: Verificar campo is_admin
```sql
SELECT login, is_admin FROM boosters WHERE LOWER(login) = 'admin';
```

✅ Deve retornar `is_admin = true`

### Teste 3: Testar upload de imagem
1. Faça login como **Cliente** no site
2. Vá em **"Meu Perfil"** (ou `/client-profile`)
3. Clique em **"Trocar Foto"**
4. Selecione uma imagem pequena (menos de 2MB)
5. Clique em **"Salvar Perfil"**

✅ Se a foto aparecer, o Storage está funcionando!

### Teste 4: Tema Dark Admin
1. Faça login como **Admin/Booster** com a conta admin
2. A tela deve ficar **vermelha e preta automaticamente**
3. Abra o console do navegador (F12) e procure por:
   ```
   ✅ Admin theme activated!
   ```

---

## 🆘 PROBLEMAS COMUNS

### ❌ "Erro ao enviar foto"
**Solução:**
1. Confirme que o bucket "profiles" existe em Storage
2. Confirme que o bucket está marcado como **PUBLIC**
3. Rode novamente a PARTE 3 do script SQL (políticas de storage)

### ❌ "Tema Admin não ativa"
**Solução:**
1. Verifique se o campo `is_admin` existe:
   ```sql
   SELECT login, is_admin FROM boosters LIMIT 5;
   ```
2. Se não existir, rode a PARTE 2 do script novamente
3. Limpe o cache do navegador (Ctrl+Shift+Del)
4. Faça logout e login novamente

### ❌ "Table already exists"
**Isso é BOM!** Significa que a tabela já foi criada antes. Ignore este erro.

---

## ✅ CHECKLIST FINAL

Marque cada item após confirmar:

- [ ] Bucket "profiles" criado e PUBLIC
- [ ] Script SQL executado sem erros críticos
- [ ] Tabelas `client_profiles` e `booster_profiles` existem
- [ ] Campo `is_admin` existe na tabela `boosters`
- [ ] Upload de foto de perfil funciona
- [ ] Tema Dark Admin ativa ao logar como admin

---

## 🚀 APÓS COMPLETAR O CHECKLIST

Me avise que concluiu e estarei pronto para implementar:
- ✨ Sistema de busca de perfis
- 📁 Upload de arquivos no chat
- 🕐 Data/hora nas mensagens
- 🔒 Chats privados

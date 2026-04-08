# 🚀 INSTRUÇÕES SIMPLES - COPIAR E COLAR

## ✅ BUCKET JÁ CRIADO (VOCÊ JÁ FEZ!)
- Bucket "profiles" criado e PÚBLICO ✓

---

## 📋 OPÇÃO 1: RODAR TUDO DE UMA VEZ

**Arquivo:** `/app/scripts/RODAR_TUDO_AGORA.sql`

1. Abra o arquivo `/app/scripts/RODAR_TUDO_AGORA.sql`
2. Copie TODO o conteúdo
3. Cole no SQL Editor do Supabase
4. Clique em **RUN**

---

## 📋 OPÇÃO 2: RODAR EM 3 PASSOS (RECOMENDADO SE DER ERRO)

### **PASSO 1: Criar Tabelas**
📄 Arquivo: `/app/scripts/1_CRIAR_TABELAS.sql`
- Cria as tabelas `client_profiles`, `booster_profiles`, `chat_files`
- Copia → Cola → RUN

### **PASSO 2: Adicionar Campo Admin**
📄 Arquivo: `/app/scripts/2_ADICIONAR_CAMPO_ADMIN.sql`
- Adiciona coluna `is_admin` na tabela `boosters`
- Copia → Cola → RUN

### **PASSO 3: Configurar Storage**
📄 Arquivo: `/app/scripts/3_CONFIGURAR_STORAGE.sql`
- Configura permissões do bucket "profiles"
- Copia → Cola → RUN

---

## ✅ COMO SABER SE FUNCIONOU?

### Teste rápido no SQL Editor:
```sql
-- Verificar tabelas
SELECT * FROM client_profiles LIMIT 1;
SELECT * FROM booster_profiles LIMIT 1;

-- Verificar campo is_admin
SELECT login, is_admin FROM boosters WHERE LOWER(login) = 'admin';
```

Se não der erro, **está tudo certo!**

---

## 🎯 PRÓXIMO PASSO

Depois de rodar os scripts, teste:
1. **Upload de foto**: Vá em `/client-profile` e tente trocar foto
2. **Tema Admin**: Faça login como admin e veja se fica vermelho/preto

**Me avise o resultado!** 🚀

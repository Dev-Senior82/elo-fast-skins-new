# 🔐 Credenciais do Sistema - Elo Fast Skins

## 👨‍💼 Administrador
- **Login:** admin
- **Senha:** admin123
- **Acesso:** Painel completo com todos os pedidos e gerenciamento de boosters
- **URL:** /booster-login (será redirecionado para /admin-dashboard)

---

## 🎮 Boosters Cadastrados

### Grão-Mestre
1. **Talon**
   - Login: talon
   - Senha: talon123
   - Rank: Grão-Mestre
   - Rating: ⭐⭐⭐⭐⭐
   - Multiplicador: +15%

2. **Shadow**
   - Login: shadow
   - Senha: shadow123
   - Rank: Grão-Mestre
   - Rating: ⭐⭐⭐⭐⭐
   - Multiplicador: +10%

### Mestre
3. **Katarina**
   - Login: katarina
   - Senha: katarina123
   - Rank: Mestre
   - Rating: ⭐⭐⭐⭐⭐
   - Multiplicador: +5%

4. **Yasuo**
   - Login: yasuo
   - Senha: yasuo123
   - Rank: Mestre
   - Rating: ⭐⭐⭐⭐
   - Multiplicador: 0%

### Diamante I
5. **Zed**
   - Login: zed
   - Senha: zed123
   - Rank: Diamante I
   - Rating: ⭐⭐⭐⭐
   - Multiplicador: 0%

6. **Lee Sin**
   - Login: leesin
   - Senha: leesin123
   - Rank: Diamante I
   - Rating: ⭐⭐⭐⭐
   - Multiplicador: 0%

### Diamante II
7. **Akali**
   - Login: akali
   - Senha: akali123
   - Rank: Diamante II
   - Rating: ⭐⭐⭐⭐
   - Multiplicador: -5%

8. **Vayne**
   - Login: vayne
   - Senha: vayne123
   - Rank: Diamante II
   - Rating: ⭐⭐⭐
   - Multiplicador: -5%

### Diamante III
9. **Thresh**
   - Login: thresh
   - Senha: thresh123
   - Rank: Diamante III
   - Rating: ⭐⭐⭐
   - Multiplicador: -10%

10. **Draven**
    - Login: draven
    - Senha: draven123
    - Rank: Diamante III
    - Rating: ⭐⭐⭐
    - Multiplicador: -10%

---

## 🌐 Supabase
- **URL:** https://iiabbhzcpgxvdidwrzdx.supabase.co
- **Anon Key:** (já configurada no .env.local)
- **Service Role Key:** (já configurada no .env.local)

---

## 📱 Fluxo do Sistema

### Cliente
1. Acessa `/precos`
2. Preenche nome, elo atual, elo desejado
3. Escolhe tipo de serviço (Solo/Duo)
4. Seleciona um booster
5. Clica em "Solicitar Boost"
6. É redirecionado para o chat do pedido

### Booster
1. Acessa `/booster-login`
2. Faz login com credenciais
3. É redirecionado para `/booster-dashboard`
4. Vê notificações de novos pedidos (sino no topo)
5. Pode aceitar pedidos, conversar no chat e marcar como concluído

### Admin
1. Acessa `/booster-login` com credenciais de admin
2. É redirecionado para `/admin-dashboard`
3. Vê TODOS os pedidos de TODOS os boosters
4. Tem controle total do sistema

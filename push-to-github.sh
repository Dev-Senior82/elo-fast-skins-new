#!/bin/bash

# Script para fazer push do código para o GitHub
# Execute este script no seu terminal após baixar o código

echo "🚀 Iniciando push para GitHub..."

# Configurar Git (substitua com seus dados)
git config --global user.email "seu-email@exemplo.com"
git config --global user.name "Seu Nome"

# Adicionar remote
git remote add origin https://github.com/Dev-Senior82/elo-fast-skins-new.git

# Adicionar arquivos
git add .

# Commit
git commit -m "feat: Sistema completo Elo Fast Skins com Supabase

✨ Funcionalidades:
- Sistema de login (boosters e admin)
- Dashboard booster e admin
- Chat em tempo real
- Notificações
- Sistema de pedidos
- Calculadora com escolha de booster
- 10 boosters + 1 admin cadastrados
- Design preservado"

# Push para GitHub
git branch -M main
git push -u origin main --force

echo "✅ Código enviado para GitHub com sucesso!"

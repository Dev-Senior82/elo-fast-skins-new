// Script para aplicar as melhorias no banco de dados
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function applyDatabaseImprovements() {
  console.log('🚀 Aplicando melhorias no banco de dados...\n')

  try {
    // 1. Atualizar campeões dos boosters existentes
    console.log('1️⃣ Atualizando campeões dos boosters...')
    const champions = [
      { name: 'Talon', champion: 'Talon' },
      { name: 'Zed', champion: 'Zed' },
      { name: 'Yasuo', champion: 'Yasuo' },
      { name: 'Lee Sin', champion: 'Lee Sin' },
      { name: 'Riven', champion: 'Riven' },
      { name: 'Katarina', champion: 'Katarina' },
    ]

    for (const { name, champion } of champions) {
      const { error } = await supabase
        .from('boosters')
        .update({ main_champion: champion })
        .eq('name', name)
      
      if (error) {
        console.log(`   ⚠️  Booster ${name}: ${error.message}`)
      } else {
        console.log(`   ✅ Booster ${name} → ${champion}`)
      }
    }

    // 2. Migrar notificações existentes (se necessário)
    console.log('\n2️⃣ Verificando notificações...')
    const { data: notifications, error: notifError } = await supabase
      .from('notifications')
      .select('id, booster_id, user_id')
      .limit(5)

    if (notifError) {
      console.log(`   ⚠️  ${notifError.message}`)
    } else {
      console.log(`   ✅ ${notifications.length} notificações encontradas`)
      
      // Migrar notificações sem user_id
      const toMigrate = notifications.filter(n => !n.user_id && n.booster_id)
      if (toMigrate.length > 0) {
        console.log(`   🔄 Migrando ${toMigrate.length} notificações...`)
        for (const notif of toMigrate) {
          await supabase
            .from('notifications')
            .update({
              user_id: notif.booster_id,
              user_type: 'booster'
            })
            .eq('id', notif.id)
        }
        console.log('   ✅ Notificações migradas!')
      }
    }

    // 3. Verificar estrutura de pedidos
    console.log('\n3️⃣ Verificando estrutura de pedidos...')
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, status, booster_id')
      .limit(1)

    if (ordersError) {
      console.log(`   ⚠️  ${ordersError.message}`)
    } else {
      console.log('   ✅ Tabela de pedidos OK')
    }

    console.log('\n✨ Melhorias aplicadas com sucesso!')
    console.log('\n⚠️  IMPORTANTE: Os campos novos (reserved_for_booster_id, etc) precisam')
    console.log('   ser adicionados manualmente no Supabase Dashboard → SQL Editor')
    console.log('   Execute o arquivo: /app/scripts/db_improvements.sql\n')

  } catch (error) {
    console.error('❌ Erro:', error.message)
    process.exit(1)
  }
}

applyDatabaseImprovements()

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function updateBoosters() {
  try {
    // Deletar todos os boosters antigos (exceto admin)
    await supabase
      .from('boosters')
      .delete()
      .neq('login', 'admin')

    // Novos boosters
    const newBoosters = [
      { name: 'Talon', rank: 'Grão-Mestre', rating: 5, login: 'talon', password: '$2a$10$dummy', price_modifier: 1.10, win_rate: 92.5, active: true, is_admin: false },
      { name: 'Jayce', rank: 'Diamante I', rating: 4, login: 'jayce', password: '$2a$10$dummy', price_modifier: 1.10, win_rate: 87.8, active: true, is_admin: false },
      { name: 'Qiyana', rank: 'Grão-Mestre', rating: 5, login: 'qiyana', password: '$2a$10$dummy', price_modifier: 1.10, win_rate: 90.2, active: true, is_admin: false },
      { name: 'Sett', rank: 'Mestre', rating: 4, login: 'sett', password: '$2a$10$dummy', price_modifier: 1.10, win_rate: 89.1, active: true, is_admin: false },
      { name: 'Katarina', rank: 'Mestre', rating: 5, login: 'katarina', password: '$2a$10$dummy', price_modifier: 1.10, win_rate: 91.5, active: true, is_admin: false },
      { name: 'Lulu', rank: 'Grão-Mestre', rating: 5, login: 'lulu', password: '$2a$10$dummy', price_modifier: 1.10, win_rate: 88.9, active: true, is_admin: false },
    ]

    for (const booster of newBoosters) {
      const { error } = await supabase.from('boosters').insert([booster])
      if (error) {
        console.error('Erro ao inserir', booster.name, ':', error)
      } else {
        console.log('✅', booster.name, '- Win Rate:', booster.win_rate + '%', '- Modificador: +10%')
      }
    }

    console.log('\n✅ Boosters atualizados com sucesso!')
    console.log('Total: 6 boosters, todos com +10%')
  } catch (error) {
    console.error('Erro:', error)
  }
}

updateBoosters()

const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function fixFinal() {
  // Criar Katarina correta
  const password = await bcrypt.hash('katarina123', 10)
  
  const { error } = await supabase
    .from('boosters')
    .insert([{
      name: 'Katarina',
      rank: 'Mestre',
      rating: 5,
      login: 'katarina_new',
      password: password,
      price_modifier: 1.10,
      win_rate: 91.5,
      active: true,
      is_admin: false
    }])
  
  if (error) {
    console.log('Katarina já existe ou erro:', error.message)
  } else {
    console.log('✅ Katarina criada!')
  }
  
  // Listar finais
  const { data } = await supabase
    .from('boosters')
    .select('name, win_rate, active')
    .eq('active', true)
    .neq('name', 'Admin')
    .order('name')
  
  console.log('\n🎮 BOOSTERS FINAIS:')
  data?.forEach(b => console.log('   ✅', b.name, '- WR:', b.win_rate + '%'))
}

fixFinal()

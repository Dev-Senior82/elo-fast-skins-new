import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'
import * as dotenv from 'dotenv'

// Carrega variáveis de ambiente do .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente não encontradas!')
  console.error('Certifique-se de ter o arquivo .env.local configurado')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const boosters = [
  {
    id: uuidv4(),
    name: 'Talon',
    rank: 'Grão-Mestre',
    rating: 5,
    login: 'talon',
    password: 'talon123',
    price_modifier: 1.15,
    active: true,
    is_admin: false,
  },
  {
    id: uuidv4(),
    name: 'Shadow',
    rank: 'Grão-Mestre',
    rating: 5,
    login: 'shadow',
    password: 'shadow123',
    price_modifier: 1.10,
    active: true,
    is_admin: false,
  },
  {
    id: uuidv4(),
    name: 'Katarina',
    rank: 'Mestre',
    rating: 5,
    login: 'katarina',
    password: 'katarina123',
    price_modifier: 1.05,
    active: true,
    is_admin: false,
  },
  {
    id: uuidv4(),
    name: 'Yasuo',
    rank: 'Mestre',
    rating: 4,
    login: 'yasuo',
    password: 'yasuo123',
    price_modifier: 1.00,
    active: true,
    is_admin: false,
  },
  {
    id: uuidv4(),
    name: 'Zed',
    rank: 'Diamante I',
    rating: 4,
    login: 'zed',
    password: 'zed123',
    price_modifier: 1.00,
    active: true,
    is_admin: false,
  },
  {
    id: uuidv4(),
    name: 'Lee Sin',
    rank: 'Diamante I',
    rating: 4,
    login: 'leesin',
    password: 'leesin123',
    price_modifier: 1.00,
    active: true,
    is_admin: false,
  },
  {
    id: uuidv4(),
    name: 'Akali',
    rank: 'Diamante II',
    rating: 4,
    login: 'akali',
    password: 'akali123',
    price_modifier: 0.95,
    active: true,
    is_admin: false,
  },
  {
    id: uuidv4(),
    name: 'Vayne',
    rank: 'Diamante II',
    rating: 3,
    login: 'vayne',
    password: 'vayne123',
    price_modifier: 0.95,
    active: true,
    is_admin: false,
  },
  {
    id: uuidv4(),
    name: 'Thresh',
    rank: 'Diamante III',
    rating: 3,
    login: 'thresh',
    password: 'thresh123',
    price_modifier: 0.90,
    active: true,
    is_admin: false,
  },
  {
    id: uuidv4(),
    name: 'Draven',
    rank: 'Diamante III',
    rating: 3,
    login: 'draven',
    password: 'draven123',
    price_modifier: 0.90,
    active: true,
    is_admin: false,
  },
]

// Admin
const admin = {
  id: uuidv4(),
  name: 'Admin',
  rank: 'Administrador',
  rating: 5,
  login: 'admin',
  password: 'admin123',
  price_modifier: 1.00,
  active: true,
  is_admin: true,
}

async function seedBoosters() {
  console.log('🌱 Iniciando seed de boosters...')

  try {
    // Inserir admin
    const { error: adminError } = await supabase
      .from('boosters')
      .insert([admin])

    if (adminError) {
      console.error('❌ Erro ao inserir admin:', adminError)
    } else {
      console.log('✅ Admin criado com sucesso!')
      console.log('   Login: admin')
      console.log('   Senha: admin123')
    }

    // Inserir boosters
    const { error: boostersError } = await supabase
      .from('boosters')
      .insert(boosters)

    if (boostersError) {
      console.error('❌ Erro ao inserir boosters:', boostersError)
    } else {
      console.log('✅ 10 boosters criados com sucesso!')
      console.log('\n📋 Lista de Boosters:')
      boosters.forEach((b, i) => {
        console.log(`   ${i + 1}. ${b.name} (${b.rank}) - Login: ${b.login} | Senha: ${b.password}`)
      })
    }

    console.log('\n✨ Seed concluído!')
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

seedBoosters()

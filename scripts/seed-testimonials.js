const { MongoClient } = require('mongodb')
const { v4: uuidv4 } = require('uuid')

const uri = process.env.MONGO_URL || 'mongodb://localhost:27017'
const dbName = process.env.DB_NAME || 'elojob_db'

const sampleTestimonials = [
  {
    id: uuidv4(),
    clientName: 'Carlos M.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    serviceType: 'Elo Boost - Prata II para Ouro IV',
    rating: 5,
    comment: 'Serviço incrível! Subiu meu elo em apenas 3 dias. Booster super profissional e educado. Recomendo demais!',
    createdAt: new Date(),
    isApproved: true,
  },
  {
    id: uuidv4(),
    clientName: 'Ana Silva',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    serviceType: 'Duo Boost - Ouro III para Platina IV',
    rating: 5,
    comment: 'Adorei jogar junto com o booster! Aprendi muito sobre macro game e rotação. Vale cada centavo!',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isApproved: true,
  },
  {
    id: uuidv4(),
    clientName: 'Pedro L.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro',
    serviceType: 'MD10 - Classificatórias',
    rating: 5,
    comment: 'Consegui começar em Ouro graças às MD10. Boosters muito habilidosos, fiquei impressionado!',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isApproved: true,
  },
  {
    id: uuidv4(),
    clientName: 'Juliana R.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juliana',
    serviceType: 'Elo Boost - Platina II para Esmeralda IV',
    rating: 5,
    comment: 'Finalmente consegui sair do inferno do platina! Serviço rápido e seguro. Muito obrigada!',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    isApproved: true,
  },
  {
    id: uuidv4(),
    clientName: 'Rafael K.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rafael',
    serviceType: 'Elo Boost - Bronze IV para Prata II',
    rating: 5,
    comment: 'Primeira vez contratando elo job e foi perfeito! Conta super segura, booster jogou offline. Top demais!',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    isApproved: true,
  },
  {
    id: uuidv4(),
    clientName: 'Lucas F.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas',
    serviceType: 'Duo Boost - Prata IV para Ouro II',
    rating: 4,
    comment: 'Muito bom! O booster me ensinou muita coisa. Só demoraram um pouco pra começar, mas no geral excelente.',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    isApproved: true,
  },
]

async function seedTestimonials() {
  let client

  try {
    console.log('🔌 Conectando ao MongoDB...')
    client = await MongoClient.connect(uri)
    const db = client.db(dbName)
    
    console.log('🗑️  Limpando depoimentos antigos...')
    await db.collection('testimonials').deleteMany({})
    
    console.log('📝 Inserindo depoimentos de exemplo...')
    const result = await db.collection('testimonials').insertMany(sampleTestimonials)
    
    console.log(`✅ ${result.insertedCount} depoimentos inseridos com sucesso!`)
    console.log('🎉 Seed concluído!')
  } catch (error) {
    console.error('❌ Erro ao popular banco:', error)
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
      console.log('👋 Conexão fechada')
    }
  }
}

seedTestimonials()

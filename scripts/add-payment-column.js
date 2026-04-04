const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function addPaymentIdColumn() {
  try {
    console.log('🔧 Adicionando coluna payment_id na tabela orders...')
    
    const { data, error } = await supabase.rpc('exec_sql', {
      query: `
        ALTER TABLE orders 
        ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255),
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        
        CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);
      `
    })

    if (error) {
      console.error('❌ Erro ao executar SQL:', error)
      
      // Tentar alternativa: verificar se a coluna já existe
      const { data: columns } = await supabase
        .from('orders')
        .select('*')
        .limit(1)
      
      if (columns && columns.length > 0) {
        console.log('📋 Colunas existentes na tabela orders:', Object.keys(columns[0]))
        
        if (Object.keys(columns[0]).includes('payment_id')) {
          console.log('✅ Coluna payment_id já existe!')
        } else {
          console.log('⚠️ Execute manualmente no SQL Editor do Supabase:')
          console.log(`
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);
          `)
        }
      }
    } else {
      console.log('✅ Coluna payment_id adicionada com sucesso!')
    }
  } catch (error) {
    console.error('❌ Erro:', error.message)
    console.log('\n⚠️ Execute manualmente no SQL Editor do Supabase:')
    console.log(`
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);
    `)
  }
}

addPaymentIdColumn()

import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { supabase } from '@/lib/supabase'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
})

export async function POST(request) {
  try {
    const body = await request.json()
    
    console.log('🔔 Webhook Mercado Pago recebido:', body)

    // Mercado Pago envia notificações de diferentes tipos
    if (body.type === 'payment' || body.action === 'payment.created' || body.action === 'payment.updated') {
      const paymentId = body.data?.id || body.id

      if (!paymentId) {
        console.log('❌ Payment ID não encontrado no webhook')
        return NextResponse.json({ received: true })
      }

      // Buscar detalhes do pagamento
      const payment = new Payment(client)
      const paymentData = await payment.get({ id: paymentId })

      console.log('💳 Status do pagamento:', paymentData.status)
      console.log('📦 Metadata:', paymentData.metadata)

      // Se o pagamento foi aprovado
      if (paymentData.status === 'approved') {
        const orderId = paymentData.metadata?.order_id

        if (!orderId) {
          console.log('❌ Order ID não encontrado nos metadata')
          return NextResponse.json({ received: true })
        }

        // Atualizar pedido no Supabase
        const { error } = await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            payment_id: paymentId.toString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId)

        if (error) {
          console.error('❌ Erro ao atualizar pedido no Supabase:', error)
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        console.log(`✅ Pedido ${orderId} atualizado para PAID!`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('❌ Erro no webhook:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Também aceitar GET para teste
export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook Mercado Pago ativo',
    timestamp: new Date().toISOString() 
  })
}

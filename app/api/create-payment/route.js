import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
})

export async function POST(request) {
  try {
    const { order_id, amount, payer_email, description } = await request.json()

    console.log('📥 Recebido:', { order_id, amount, payer_email, description })
    console.log('🔑 Access Token configurado:', process.env.MERCADOPAGO_ACCESS_TOKEN ? 'SIM' : 'NÃO')

    if (!order_id || !amount) {
      return NextResponse.json(
        { error: 'order_id e amount são obrigatórios' },
        { status: 400 }
      )
    }

    const payment = new Payment(client)

    // Construir body do pagamento
    const body = {
      transaction_amount: parseFloat(amount),
      description: description || `Pedido #${order_id}`,
      payment_method_id: 'pix',
      payer: {
        email: payer_email || 'slayvier1@gmail.com',
      },
      metadata: {
        order_id: order_id,
      },
    }

    // Adicionar notification_url apenas se a URL base estiver configurada (produção)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL
    if (baseUrl && !baseUrl.includes('seu-dominio') && !baseUrl.includes('localhost')) {
      body.notification_url = `${baseUrl}/api/mercadopago-webhook`
    }

    console.log('📦 Body da requisição MP:', JSON.stringify(body, null, 2))

    const result = await payment.create({ body })

    if (!result.point_of_interaction?.transaction_data) {
      throw new Error('Falha ao gerar QR Code PIX')
    }

    return NextResponse.json({
      success: true,
      payment_id: result.id,
      qr_code: result.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: result.point_of_interaction.transaction_data.qr_code_base64,
      ticket_url: result.point_of_interaction.transaction_data.ticket_url,
      status: result.status,
    })
  } catch (error) {
    console.error('❌ Erro ao criar pagamento:', error)
    console.error('Detalhes do erro:', JSON.stringify(error, null, 2))
    
    return NextResponse.json(
      { error: error.message || error.cause?.[0]?.message || 'Erro ao criar pagamento PIX' },
      { status: 500 }
    )
  }
}

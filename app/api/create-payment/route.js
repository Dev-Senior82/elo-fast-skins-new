import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
})

export async function POST(request) {
  try {
    const { order_id, amount, payer_email, description } = await request.json()

    if (!order_id || !amount) {
      return NextResponse.json(
        { error: 'order_id e amount são obrigatórios' },
        { status: 400 }
      )
    }

    // garante que o valor seja número
    const transactionAmount = parseFloat(amount)

    if (isNaN(transactionAmount)) {
      return NextResponse.json(
        { error: 'Valor de pagamento inválido' },
        { status: 400 }
      )
    }

    // valida email
    const email =
      payer_email && payer_email.includes('@')
        ? payer_email
        : 'cliente@elofastskins.com'

    const payment = new Payment(client)

    const body = {
      transaction_amount: transactionAmount,
      description: description || `Pedido #${order_id}`,
      payment_method_id: 'pix',

      payer: {
        email: email,
      },

      metadata: {
        order_id: order_id,
      },

      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercadopago-webhook`,
    }

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
    console.error('Erro ao criar pagamento:', error)

    return NextResponse.json(
      { error: error.message || 'Erro ao criar pagamento PIX' },
      { status: 500 }
    )
  }
}

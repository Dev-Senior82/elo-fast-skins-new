import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(to, verificationCode, userName) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: [to],
      subject: '🎮 Código de Verificação - Elo Fast Skins',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Código de Verificação</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 40px auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 20px; overflow: hidden; border: 1px solid rgba(59, 130, 246, 0.2);">
              <!-- Header -->
              <div style="background: linear-gradient(90deg, #3b82f6 0%, #f97316 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🎮 Elo Fast Skins</h1>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                <h2 style="color: #ffffff; margin-top: 0;">Olá, ${userName}! 👋</h2>
                <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
                  Obrigado por criar sua conta na <strong style="color: #3b82f6;">Elo Fast Skins</strong>!
                </p>
                <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
                  Use o código abaixo para verificar seu email e ativar sua conta:
                </p>
                
                <!-- Código de Verificação -->
                <div style="background: rgba(59, 130, 246, 0.1); border: 2px solid #3b82f6; border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center;">
                  <p style="color: #94a3b8; font-size: 14px; margin: 0 0 10px 0;">Seu código de verificação:</p>
                  <div style="font-size: 42px; font-weight: bold; color: #3b82f6; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                    ${verificationCode}
                  </div>
                  <p style="color: #64748b; font-size: 12px; margin: 10px 0 0 0;">
                    ⏰ Válido por 15 minutos
                  </p>
                </div>
                
                <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
                  Se você não criou uma conta na Elo Fast Skins, pode ignorar este email.
                </p>
              </div>
              
              <!-- Footer -->
              <div style="background: rgba(0, 0, 0, 0.3); padding: 20px 30px; border-top: 1px solid rgba(59, 130, 246, 0.1);">
                <p style="color: #64748b; font-size: 12px; margin: 0; text-align: center;">
                  © ${new Date().getFullYear()} Elo Fast Skins - Seu boost de confiança 🚀
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Erro ao enviar email:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return { success: false, error: error.message }
  }
}

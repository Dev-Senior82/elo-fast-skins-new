'use client'

import { useEffect } from 'react'
import { MessageCircle, Clock, Shield, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function SuportePage() {
  useEffect(() => {
    // Redireciona automaticamente após 3 segundos
    const timer = setTimeout(() => {
      const whatsappNumber = '5582999646622'
      const message = encodeURIComponent('Olá! Preciso de suporte.')
      window.location.href = `https://wa.me/${whatsappNumber}?text=${message}`
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleContactNow = () => {
    const whatsappNumber = '5582999646622'
    const message = encodeURIComponent('Olá! Preciso de suporte.')
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
  }

  return (
    <div className="container py-20">
      <div className="max-w-3xl mx-auto text-center space-y-12">
        <div>
          <div className="inline-block mb-6">
            <div className="h-24 w-24 mx-auto rounded-full bg-green-500/20 flex items-center justify-center animate-glow-pulse">
              <MessageCircle className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Suporte <span className="gamer-gradient bg-clip-text text-transparent">24/7</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Nossa equipe está pronta para te ajudar a qualquer momento!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleContactNow}
              className="bg-green-500 hover:bg-green-600 text-white font-bold text-lg"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Falar no WhatsApp
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Redirecionando automaticamente em 3 segundos...
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card border-primary-500/20">
            <CardContent className="p-6 text-center space-y-3">
              <div className="h-12 w-12 mx-auto rounded-full bg-primary-500/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary-500" />
              </div>
              <h3 className="font-bold">Disponível 24/7</h3>
              <p className="text-sm text-muted-foreground">
                Estamos online todos os dias, a qualquer hora
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-green-500/20">
            <CardContent className="p-6 text-center space-y-3">
              <div className="h-12 w-12 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                <Headphones className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-bold">Resposta Rápida</h3>
              <p className="text-sm text-muted-foreground">
                Tempo médio de resposta: 5 minutos
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-orange-500/20">
            <CardContent className="p-6 text-center space-y-3">
              <div className="h-12 w-12 mx-auto rounded-full bg-orange-500/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="font-bold">Suporte Especializado</h3>
              <p className="text-sm text-muted-foreground">
                Equipe treinada e experiente
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card">
          <CardContent className="p-8 space-y-4">
            <h2 className="text-2xl font-bold">Dúvidas Frequentes</h2>
            <div className="text-left space-y-4 text-sm">
              <div>
                <h4 className="font-bold mb-1">🔒 Minha conta é segura?</h4>
                <p className="text-muted-foreground">
                  Sim! Usamos VPN exclusiva e modo offline. Nenhum caso de ban em +5000 boosts.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-1">⏱️ Quanto tempo demora?</h4>
                <p className="text-muted-foreground">
                  Varia de 3 a 7 dias em média. Começamos em até 2h após confirmação do pagamento.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-1">💳 Quais formas de pagamento?</h4>
                <p className="text-muted-foreground">
                  PIX, cartão de crédito e criptomoedas. Todos com segurança garantida.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-1">🎯 Há garantia?</h4>
                <p className="text-muted-foreground">
                  Sim! Se você perder o elo em até 7 dias, fazemos novo boost gratuito.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
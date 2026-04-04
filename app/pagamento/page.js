'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { QrCode, Copy, Check, Clock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function PagamentoPage() {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutos em segundos

  // Chave PIX de exemplo (substitua pela real)
  const pixKey = '82999646622'
  const pixCode = '00020126580014BR.GOV.BCB.PIX013682999646622520400005303986540550.005802BR5925ELO FAST SKINS LTDA6009SAO PAULO62070503***63041D3D'

  // Timer countdown
  useState(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(pixCode)
    setCopied(true)
    toast({
      title: '✅ Código copiado!',
      description: 'Cole no app do seu banco para pagar.',
    })
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div className="container py-20">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Finalizar <span className="gamer-gradient bg-clip-text text-transparent">Pagamento</span>
          </h1>
          <p className="text-muted-foreground">
            Escaneie o QR Code ou copie o código PIX para finalizar seu pedido
          </p>
        </div>

        <Card className="glass-card border-orange-500/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pagamento via PIX</span>
              <div className="flex items-center gap-2 text-orange-500">
                <Clock className="h-5 w-5" />
                <span className="text-lg font-mono">{formatTime(timeLeft)}</span>
              </div>
            </CardTitle>
            <CardDescription>
              O QR Code expira em 15 minutos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Code Placeholder */}
            <div className="bg-white p-8 rounded-lg mx-auto w-fit">
              <div className="h-64 w-64 bg-gray-900 rounded-lg flex items-center justify-center">
                <QrCode className="h-32 w-32 text-white" />
              </div>
            </div>

            {/* Código PIX */}
            <div className="space-y-2">
              <Label htmlFor="pixCode">Código PIX (Pix Copia e Cola)</Label>
              <div className="flex gap-2">
                <Input
                  id="pixCode"
                  value={pixCode}
                  readOnly
                  className="font-mono text-xs bg-white/50 dark:bg-black/50"
                />
                <Button
                  onClick={handleCopyPixCode}
                  variant="outline"
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Detalhes do Pedido */}
            <div className="border-t border-border pt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Serviço:</span>
                <span className="font-medium">Elo Boost - Ouro I to Platina IV</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tipo:</span>
                <span className="font-medium">Solo Boost</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-border pt-3">
                <span>Total:</span>
                <span className="text-primary-500">R$ 120,00</span>
              </div>
            </div>

            {/* Instruções */}
            <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4 text-sm space-y-2">
              <h4 className="font-bold">Como pagar:</h4>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Abra o app do seu banco</li>
                <li>Escolha a opção PIX</li>
                <li>Escaneie o QR Code ou cole o código</li>
                <li>Confirme o pagamento</li>
                <li>Aguarde a confirmação (2-5 minutos)</li>
              </ol>
            </div>

            {/* Botão de Suporte */}
            <Button
              asChild
              variant="outline"
              className="w-full"
            >
              <a
                href={`https://wa.me/5582999646622?text=${encodeURIComponent('Preciso de ajuda com o pagamento.')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Precisa de ajuda? Fale conosco
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <h3 className="font-bold mb-3">🔒 Pagamento Seguro</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Após a confirmação do pagamento, você receberá um e-mail com as instruções 
              e nosso suporte entrará em contato via WhatsApp para iniciar seu boost.
            </p>
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <Check className="h-4 w-4" />
              <span>Início do boost em até 2 horas</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
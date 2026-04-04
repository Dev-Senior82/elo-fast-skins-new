'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Check, CreditCard, ArrowLeft, Loader2, QrCode } from 'lucide-react'
import { getOrderById } from '@/app/actions/orders'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [paymentData, setPaymentData] = useState(null)
  const [checkingPayment, setCheckingPayment] = useState(false)

  useEffect(() => {
    loadOrder()
  }, [params.id])

  useEffect(() => {
    if (order && !paymentData) {
      createPayment()
    }
  }, [order])

  // Verificar status do pagamento a cada 5 segundos
  useEffect(() => {
    if (!order || order.payment_status === 'paid') return

    const interval = setInterval(async () => {
      const result = await getOrderById(params.id)
      if (result.success && result.data.payment_status === 'paid') {
        toast({
          title: '✅ Pagamento confirmado!',
          description: 'Redirecionando para o dashboard...',
        })
        setTimeout(() => {
          router.push('/client-dashboard')
        }, 2000)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [order])

  const loadOrder = async () => {
    const result = await getOrderById(params.id)
    if (result.success) {
      setOrder(result.data)
      
      // Se já foi pago, redirecionar
      if (result.data.payment_status === 'paid') {
        toast({
          title: 'Pedido já pago!',
          description: 'Redirecionando...',
        })
        setTimeout(() => router.push('/client-dashboard'), 1500)
      }
    }
    setLoading(false)
  }

  const createPayment = async () => {
    try {
      setCheckingPayment(true)
      
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: order.id,
          amount: order.final_price || order.price,
          description: `${order.current_rank} → ${order.desired_rank}`,
          payer_email: 'slayvier1@gmail.com',
        }),
      })

      const data = await response.json()

      if (data.success) {
        setPaymentData(data)
        toast({
          title: '✅ PIX gerado com sucesso!',
          description: 'Escaneie o QR Code ou copie o código',
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Erro ao criar pagamento:', error)
      toast({
        title: 'Erro ao gerar PIX',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setCheckingPayment(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast({ title: '✅ Copiado para área de transferência!' })
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="container py-20 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-500" />
        <p>Carregando pedido...</p>
      </div>
    </div>
  )

  if (!order) return null

  return (
    <div className="container py-20">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/client-dashboard">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Link>
      </Button>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detalhes do Pedido */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Detalhes do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Serviço</p>
              <p className="font-medium">{order.current_rank} → {order.desired_rank}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tipo</p>
              <p className="font-medium">{order.service_type === 'duo' ? 'Duo Boost' : 'Solo Boost'}</p>
            </div>
            {order.booster_name && (
              <div>
                <p className="text-sm text-muted-foreground">Booster</p>
                <p className="font-medium">{order.booster_name}</p>
              </div>
            )}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Valor Total</p>
              <p className="text-4xl font-bold text-primary-500">
                R$ {parseFloat(order.final_price || order.price).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pagamento PIX */}
        <Card className="glass-card border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-500" />
              Pagamento PIX Automático
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {checkingPayment ? (
              <div className="text-center py-8">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary-500" />
                <p className="text-sm text-muted-foreground">Gerando QR Code PIX...</p>
              </div>
            ) : paymentData ? (
              <>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-sm space-y-2">
                  <p className="font-bold text-green-600 dark:text-green-400">✅ PIX gerado!</p>
                  <ul className="space-y-1 text-muted-foreground text-xs">
                    <li>• Escaneie o QR Code abaixo</li>
                    <li>• Ou copie o código PIX</li>
                    <li>• <strong>Valor: R$ {parseFloat(order.final_price || order.price).toFixed(2)}</strong></li>
                    <li>• Confirmação automática em segundos!</li>
                  </ul>
                </div>

                {/* QR Code Dinâmico */}
                <div className="bg-white p-6 rounded-lg">
                  <div className="flex items-center justify-center">
                    <img 
                      src={`data:image/png;base64,${paymentData.qr_code_base64}`}
                      alt="QR Code PIX" 
                      className="w-64 h-64"
                    />
                  </div>
                  <p className="text-center text-xs text-green-600 dark:text-green-400 mt-3 font-bold">
                    ✅ Valor incluído: R$ {parseFloat(order.final_price || order.price).toFixed(2)}
                  </p>
                </div>

                {/* Código PIX Copia e Cola */}
                <div className="space-y-2">
                  <Label>Código PIX (Copia e Cola)</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={paymentData.qr_code} 
                      readOnly 
                      className="font-mono text-xs bg-white/50"
                    />
                    <Button 
                      onClick={() => copyToClipboard(paymentData.qr_code)} 
                      variant="outline"
                      className="shrink-0"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ✅ Valor já incluído no código
                  </p>
                </div>

                {/* Status em tempo real */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    <p className="font-bold text-blue-600 dark:text-blue-400">
                      Aguardando pagamento...
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Verificando automaticamente a cada 5 segundos. Não feche esta página!
                  </p>
                </div>

                {/* Instruções */}
                <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4 text-sm space-y-2">
                  <h4 className="font-bold">📱 Como pagar:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground text-xs">
                    <li>Abra o app do seu banco</li>
                    <li>Escolha PIX → Ler QR Code</li>
                    <li>Escaneie o código acima (ou copie o código)</li>
                    <li>Confirme o valor e o pagamento</li>
                    <li>Pronto! A confirmação é automática ✨</li>
                  </ol>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <QrCode className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Gerando PIX...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Segurança */}
      <Card className="glass-card mt-6 max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-green-500/20 p-3 rounded-lg">
              <Check className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-bold mb-2">🔒 Pagamento 100% Seguro</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Processado pelo <strong>Mercado Pago</strong>. Confirmação automática e instantânea.
              </p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>✅ PIX gerado com o valor exato do pedido</p>
                <p>✅ Confirmação automática em segundos</p>
                <p>✅ Chat com booster liberado após pagamento</p>
                <p>✅ Sem necessidade de enviar comprovante</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

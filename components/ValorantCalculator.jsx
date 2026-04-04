'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Calculator, TrendingUp, Zap } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/lib/supabase'

const valorantRanks = [
  { value: 'ferro1', label: 'Ferro 1', price: 4 },
  { value: 'ferro2', label: 'Ferro 2', price: 5 },
  { value: 'ferro3', label: 'Ferro 3', price: 6 },
  { value: 'bronze1', label: 'Bronze 1', price: 4 },
  { value: 'bronze2', label: 'Bronze 2', price: 5 },
  { value: 'bronze3', label: 'Bronze 3', price: 6 },
  { value: 'prata1', label: 'Prata 1', price: 7 },
  { value: 'prata2', label: 'Prata 2', price: 8 },
  { value: 'prata3', label: 'Prata 3', price: 8 },
  { value: 'ouro1', label: 'Ouro 1', price: 12 },
  { value: 'ouro2', label: 'Ouro 2', price: 13 },
  { value: 'ouro3', label: 'Ouro 3', price: 15 },
  { value: 'platina1', label: 'Platina 1', price: 15 },
  { value: 'platina2', label: 'Platina 2', price: 17 },
  { value: 'platina3', label: 'Platina 3', price: 19 },
  { value: 'diamante1', label: 'Diamante 1', price: 28 },
  { value: 'diamante2', label: 'Diamante 2', price: 31 },
  { value: 'diamante3', label: 'Diamante 3', price: 34 },
  { value: 'ascendente1', label: 'Ascendente 1', price: 39 },
  { value: 'ascendente2', label: 'Ascendente 2', price: 43 },
  { value: 'ascendente3', label: 'Ascendente 3', price: 48 },
  { value: 'imortal1', label: 'Imortal 1', price: 64 },
  { value: 'imortal2', label: 'Imortal 2', price: 71 },
  { value: 'imortal3', label: 'Imortal 3', price: 78 },
]

export default function ValorantCalculator() {
  const [currentRank, setCurrentRank] = useState('')
  const [desiredRank, setDesiredRank] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientContact, setClientContact] = useState('')
  const [discountCode, setDiscountCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const storedUser = localStorage.getItem('client_user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setClientName(userData.name || '')
      setClientContact(userData.email || '')
    }
  }, [])

  const calculatePrice = () => {
    if (!currentRank || !desiredRank) return 0

    const currentIndex = valorantRanks.findIndex(r => r.value === currentRank)
    const desiredIndex = valorantRanks.findIndex(r => r.value === desiredRank)

    if (currentIndex === -1 || desiredIndex === -1 || desiredIndex <= currentIndex) {
      return 0
    }

    let total = 0
    for (let i = currentIndex; i < desiredIndex; i++) {
      total += valorantRanks[i].price
    }

    return total
  }

  const getDiscountPercentage = () => {
    let discount = 0
    
    if (user && !user.firstPurchaseDiscountUsed) {
      discount = 10
    }
    
    if (discountCode === 'MD5') {
      discount = Math.max(discount, 5)
    }
    
    return discount
  }

  const basePrice = calculatePrice()
  const discountPercent = getDiscountPercentage()
  const discountAmount = (basePrice * discountPercent) / 100
  const finalPrice = basePrice - discountAmount

  const handleSubmit = async () => {
    if (!currentRank || !desiredRank) {
      toast({
        title: 'Selecione os ranks',
        variant: 'destructive',
      })
      return
    }

    if (!clientName || !clientContact) {
      toast({
        title: 'Preencha seus dados',
        variant: 'destructive',
      })
      return
    }

    if (finalPrice <= 0) {
      toast({
        title: 'Preço inválido',
        description: 'O rank desejado deve ser maior que o atual',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const order = {
        id: uuidv4(),
        client_id: user?.id || null,
        client_name: clientName,
        client_contact: clientContact,
        game: 'Valorant',
        current_rank: valorantRanks.find(r => r.value === currentRank)?.label,
        desired_rank: valorantRanks.find(r => r.value === desiredRank)?.label,
        service_type: 'solo',
        original_price: basePrice,
        discount_code: discountCode || null,
        discount_percentage: discountPercent,
        price: basePrice,
        final_price: finalPrice,
        booster_id: null,
        booster_name: null,
        payment_status: 'pending',
        payment_proof: null,
        payment_id: null,
        status: 'pending',
        created_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('orders')
        .insert([order])
        .select()
        .single()

      if (error) throw error

      if (user && discountCode) {
        const updatedUser = { ...user, firstPurchaseDiscountUsed: true }
        localStorage.setItem('client_user', JSON.stringify(updatedUser))
      }

      toast({
        title: '✅ Pedido criado!',
        description: 'Redirecionando para pagamento...',
      })

      setTimeout(() => {
        router.push(`/payment/${data.id}`)
      }, 1500)
    } catch (error) {
      console.error('Erro:', error)
      toast({
        title: 'Erro ao criar pedido',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="glass-card border-red-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-red-500" />
          Calculadora Valorant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Elo Atual */}
        <div>
          <Label>Elo Atual</Label>
          <Select value={currentRank} onValueChange={setCurrentRank}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione seu elo atual" />
            </SelectTrigger>
            <SelectContent>
              {valorantRanks.map((rank) => (
                <SelectItem key={rank.value} value={rank.value}>
                  {rank.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Elo Desejado */}
        <div>
          <Label>Elo Desejado</Label>
          <Select value={desiredRank} onValueChange={setDesiredRank}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o elo desejado" />
            </SelectTrigger>
            <SelectContent>
              {valorantRanks.map((rank) => (
                <SelectItem key={rank.value} value={rank.value}>
                  {rank.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dados do Cliente */}
        <div className="space-y-3 pt-4 border-t">
          <div>
            <Label>Seu Nome</Label>
            <Input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Digite seu nome"
            />
          </div>

          <div>
            <Label>Contato (Email ou WhatsApp)</Label>
            <Input
              value={clientContact}
              onChange={(e) => setClientContact(e.target.value)}
              placeholder="seu@email.com ou (82) 99999-9999"
            />
          </div>

          <div>
            <Label>Código de Desconto (Opcional)</Label>
            <Input
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
              placeholder="MD5"
            />
          </div>
        </div>

        {/* Resumo */}
        {basePrice > 0 && (
          <div className="bg-primary-500/10 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Valor Base:</span>
              <span>R$ {basePrice.toFixed(2)}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Desconto ({discountPercent}%):</span>
                <span>- R$ {discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
              <span>Total:</span>
              <span className="text-red-500">R$ {finalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Informações */}
        <div className="bg-blue-500/10 rounded-lg p-4 space-y-2 text-sm">
          <p className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className="font-semibold">Entrega em até 7 dias</span>
          </p>
          <p className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-500" />
            <span className="font-semibold">Booster selecionado manualmente</span>
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading || !currentRank || !desiredRank || !clientName || !clientContact}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold"
        >
          {loading ? 'Criando Pedido...' : 'Continuar para Pagamento'}
        </Button>
      </CardContent>
    </Card>
  )
}

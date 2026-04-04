'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TrendingUp, Zap, Star, Gift, AlertCircle } from 'lucide-react'
import { getActiveBoosters } from '@/app/actions/boosters'
import { createOrder } from '@/app/actions/orders'
import { validateDiscountCode, incrementDiscountCodeUsage, markFirstPurchaseDiscountUsed } from '@/app/actions/clients'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

const eloTiers = [
  { value: 'ferro4', label: 'Ferro IV', solo: 5.31, duo: 7.44 },
  { value: 'ferro3', label: 'Ferro III', solo: 5.58, duo: 7.81 },
  { value: 'ferro2', label: 'Ferro II', solo: 5.85, duo: 8.20 },
  { value: 'ferro1', label: 'Ferro I', solo: 6.15, duo: 8.61 },
  { value: 'bronze4', label: 'Bronze IV', solo: 6.38, duo: 8.50 },
  { value: 'bronze3', label: 'Bronze III', solo: 6.70, duo: 8.93 },
  { value: 'bronze2', label: 'Bronze II', solo: 7.04, duo: 9.38 },
  { value: 'bronze1', label: 'Bronze I', solo: 7.39, duo: 9.84 },
  { value: 'prata4', label: 'Prata IV', solo: 7.44, duo: 9.56 },
  { value: 'prata3', label: 'Prata III', solo: 7.81, duo: 10.04 },
  { value: 'prata2', label: 'Prata II', solo: 8.20, duo: 10.54 },
  { value: 'prata1', label: 'Prata I', solo: 8.61, duo: 11.08 },
  { value: 'ouro4', label: 'Ouro IV', solo: 13.81, duo: 19.13 },
  { value: 'ouro3', label: 'Ouro III', solo: 14.50, duo: 20.09 },
  { value: 'ouro2', label: 'Ouro II', solo: 15.23, duo: 21.09 },
  { value: 'ouro1', label: 'Ouro I', solo: 15.99, duo: 22.14 },
  { value: 'platina4', label: 'Platina IV', solo: 21.25, duo: 29.75 },
  { value: 'platina3', label: 'Platina III', solo: 22.31, duo: 31.24 },
  { value: 'platina2', label: 'Platina II', solo: 23.43, duo: 32.80 },
  { value: 'platina1', label: 'Platina I', solo: 24.60, duo: 34.44 },
  { value: 'esmeralda4', label: 'Esmeralda IV', solo: 29.75, duo: 41.44 },
  { value: 'esmeralda3', label: 'Esmeralda III', solo: 31.24, duo: 43.51 },
  { value: 'esmeralda2', label: 'Esmeralda II', solo: 32.80, duo: 45.68 },
  { value: 'esmeralda1', label: 'Esmeralda I', solo: 34.44, duo: 47.96 },
  { value: 'diamante4', label: 'Diamante IV', solo: 37.19, duo: 52.06 },
  { value: 'diamante3', label: 'Diamante III', solo: 39.05, duo: 54.66 },
  { value: 'diamante2', label: 'Diamante II', solo: 41.00, duo: 57.40 },
  { value: 'diamante1', label: 'Diamante I', solo: 43.05, duo: 60.26 },
]

export default function PriceCalculatorNew() {
  const [currentElo, setCurrentElo] = useState('')
  const [desiredElo, setDesiredElo] = useState('')
  const [serviceType, setServiceType] = useState('solo')
  const [selectedBooster, setSelectedBooster] = useState(null)
  const [boosters, setBoosters] = useState([])
  const [discountCode, setDiscountCode] = useState('')
  const [validatedDiscount, setValidatedDiscount] = useState(null)
  const [validatingCode, setValidatingCode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    loadBoosters()
    const storedUser = localStorage.getItem('client_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const loadBoosters = async () => {
    const result = await getActiveBoosters()
    if (result.success) {
      setBoosters(result.data)
    }
  }

  const calculateBasePrice = () => {
    if (!currentElo || !desiredElo) return 0
    
    const currentIndex = eloTiers.findIndex(e => e.value === currentElo)
    const desiredIndex = eloTiers.findIndex(e => e.value === desiredElo)
    
    if (currentIndex === -1 || desiredIndex === -1 || desiredIndex <= currentIndex) return 0
    
    let totalPrice = 0
    for (let i = currentIndex; i < desiredIndex; i++) {
      totalPrice += serviceType === 'duo' ? eloTiers[i].duo : eloTiers[i].solo
    }
    
    return totalPrice
  }

  const calculatePriceWithBooster = () => {
    const basePrice = calculateBasePrice()
    if (!selectedBooster) return basePrice
    
    // Todos os boosters tem +10% fixo
    const modifier = 1.10
    
    return basePrice * modifier
  }

  const getDiscountPercentage = () => {
    let discount = 0
    
    // Desconto primeira compra
    if (user && !user.firstPurchaseDiscountUsed) {
      discount = 10
    }
    
    // Código de desconto (sobrescreve se for maior)
    if (validatedDiscount) {
      discount = Math.max(discount, validatedDiscount.discountPercentage)
    }
    
    return discount
  }

  const calculateFinalPrice = () => {
    const priceWithBooster = calculatePriceWithBooster()
    const discountPercentage = getDiscountPercentage()
    
    if (discountPercentage === 0) return priceWithBooster
    
    return priceWithBooster * (1 - discountPercentage / 100)
  }

  const originalPrice = calculatePriceWithBooster()
  const discountPercentage = getDiscountPercentage()
  const finalPrice = calculateFinalPrice()

  const handleValidateCode = async () => {
    if (!discountCode.trim()) return
    
    setValidatingCode(true)
    const result = await validateDiscountCode(discountCode)
    
    if (result.success) {
      setValidatedDiscount(result.data)
      toast({
        title: 'Código válido!',
        description: `${result.data.discountPercentage}% de desconto aplicado`,
      })
    } else {
      toast({
        title: 'Código inválido',
        description: result.error,
        variant: 'destructive',
      })
      setValidatedDiscount(null)
    }
    
    setValidatingCode(false)
  }

  const handleSubmit = async () => {
    // Validações
    if (!currentElo || !desiredElo) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Selecione o elo atual e desejado',
        variant: 'destructive',
      })
      return
    }

    if (!selectedBooster) {
      toast({
        title: 'Selecione um booster',
        description: 'Escolha o booster que fará seu serviço',
        variant: 'destructive',
      })
      return
    }

    // Se não estiver logado, redireciona para registro
    if (!user) {
      toast({
        title: 'Faça login',
        description: 'Você precisa ter uma conta para fazer pedidos',
      })
      router.push('/client-register')
      return
    }

    setLoading(true)

    // Criar pedido
    const orderData = {
      clientId: user.id,
      clientName: user.name,
      clientContact: user.phone,
      currentRank: eloTiers.find(e => e.value === currentElo)?.label,
      desiredRank: eloTiers.find(e => e.value === desiredElo)?.label,
      serviceType,
      originalPrice: originalPrice.toFixed(2),
      discountCode: validatedDiscount?.code || null,
      discountPercentage: discountPercentage,
      price: originalPrice.toFixed(2),
      finalPrice: finalPrice.toFixed(2),
      boosterId: selectedBooster.id,
      boosterName: selectedBooster.name,
    }

    const result = await createOrder(orderData)

    if (result.success) {
      // Marcar primeira compra como usada
      if (user && !user.firstPurchaseDiscountUsed && discountPercentage === 10) {
        await markFirstPurchaseDiscountUsed(user.id)
        const updatedUser = { ...user, firstPurchaseDiscountUsed: true }
        localStorage.setItem('client_user', JSON.stringify(updatedUser))
      }
      
      // Incrementar uso do código
      if (validatedDiscount) {
        await incrementDiscountCodeUsage(validatedDiscount.code)
      }

      toast({
        title: 'Pedido criado!',
        description: 'Redirecionando para pagamento...',
      })
      
      // Redirecionar para pagamento
      router.push(`/payment/${result.data.id}`)
    } else {
      toast({
        title: 'Erro',
        description: result.error,
        variant: 'destructive',
      })
    }

    setLoading(false)
  }

  return (
    <Card className="glass-card border-primary-500/20">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-orange-500" />
          Calculadora de Preço
        </CardTitle>
        <CardDescription>
          Calcule o preço do seu boost e escolha seu booster
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Aviso de Login */}
        {!user && (
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Você precisa ter uma conta!</p>
                  <p className="text-xs text-muted-foreground">
                    Para fazer um pedido, você precisa estar logado. Crie sua conta ou faça login.
                  </p>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href="/client-login">Fazer Login</Link>
                    </Button>
                    <Button asChild size="sm" className="bg-blue-500 hover:bg-blue-600">
                      <Link href="/client-register">Criar Conta</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Desconto Primeira Compra */}
        {user && !user.firstPurchaseDiscountUsed && (
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="p-4 text-center">
              <Gift className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="font-semibold text-green-500">🎁 Você tem 10% OFF na primeira compra!</p>
              <p className="text-xs text-muted-foreground mt-1">Desconto aplicado automaticamente</p>
            </CardContent>
          </Card>
        )}

        {/* Elo Atual */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Elo Atual</label>
          <Select value={currentElo} onValueChange={setCurrentElo}>
            <SelectTrigger className="bg-white/50 dark:bg-black/50">
              <SelectValue placeholder="Selecione seu elo atual" />
            </SelectTrigger>
            <SelectContent>
              {eloTiers.map((elo) => (
                <SelectItem key={elo.value} value={elo.value}>
                  {elo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Elo Desejado */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Elo Desejado</label>
          <Select value={desiredElo} onValueChange={setDesiredElo}>
            <SelectTrigger className="bg-white/50 dark:bg-black/50">
              <SelectValue placeholder="Selecione seu elo desejado" />
            </SelectTrigger>
            <SelectContent>
              {eloTiers.map((elo) => (
                <SelectItem key={elo.value} value={elo.value}>
                  {elo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tipo de Serviço */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de Serviço</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setServiceType('solo')}
              className={`p-4 rounded-lg border-2 transition-all ${
                serviceType === 'solo'
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <Zap className="h-6 w-6 mx-auto mb-2 text-primary-500" />
              <p className="font-bold">Solo Boost</p>
              <p className="text-xs text-muted-foreground">Preço padrão</p>
            </button>
            <button
              onClick={() => setServiceType('duo')}
              className={`p-4 rounded-lg border-2 transition-all ${
                serviceType === 'duo'
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-orange-500" />
              <p className="font-bold">Duo Boost</p>
              <p className="text-xs text-muted-foreground">+30% no preço</p>
            </button>
          </div>
        </div>

        {/* Seleção de Booster */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Star className="h-4 w-4 text-orange-500" />
            Escolha seu Booster
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {boosters.map((booster) => (
              <button
                key={booster.id}
                onClick={() => setSelectedBooster(booster)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedBooster?.id === booster.id
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-orange-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold">{booster.name}</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: booster.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-orange-500 text-orange-500" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{booster.rank}</p>
                {booster.price_modifier !== 1 && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    {booster.price_modifier > 1 ? '+' : ''}{((booster.price_modifier - 1) * 100).toFixed(0)}% no preço
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Código de Desconto */}
        <div className="space-y-2 border-t pt-4">
          <Label className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-orange-500" />
            Código de Desconto (Opcional)
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="Digite o código (ex: DISCORD15)"
              value={discountCode}
              onChange={(e) => {
                setDiscountCode(e.target.value.toUpperCase())
                setValidatedDiscount(null)
              }}
              className="bg-white/50 dark:bg-black/50 uppercase"
            />
            <Button
              onClick={handleValidateCode}
              disabled={!discountCode.trim() || validatingCode}
              variant="outline"
            >
              {validatingCode ? 'Validando...' : 'Aplicar'}
            </Button>
          </div>
          {validatedDiscount && (
            <p className="text-sm text-green-500">
              ✅ Código válido! {validatedDiscount.discountPercentage}% de desconto
            </p>
          )}
        </div>

        {/* Resumo de Preço */}
        {originalPrice > 0 && selectedBooster && (
          <div className="bg-gradient-to-r from-primary-500/10 to-orange-500/10 border border-primary-500/20 rounded-lg p-6 animate-slide-in">
            <div className="space-y-3">
              {discountPercentage > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Preço original:</span>
                  <span className="line-through">R$ {originalPrice.toFixed(2)}</span>
                </div>
              )}
              
              {discountPercentage > 0 && (
                <div className="flex justify-between text-sm text-green-500 font-semibold">
                  <span>Desconto ({discountPercentage}%):</span>
                  <span>- R$ {(originalPrice - finalPrice).toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-lg font-semibold">Preço Final:</span>
                <div className="text-right">
                  <p className="text-4xl font-bold gamer-gradient bg-clip-text text-transparent">
                    R$ {finalPrice.toFixed(2)}
                  </p>
                  {discountPercentage > 0 && (
                    <Badge className="mt-2 bg-green-500">
                      <Gift className="h-3 w-3 mr-1" />
                      Você economizou R$ {(originalPrice - finalPrice).toFixed(2)}!
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-4">
              <Badge variant="outline">
                {serviceType === 'duo' ? 'Duo Boost' : 'Solo Boost'}
              </Badge>
              <Badge variant="outline">
                Booster: {selectedBooster.name}
              </Badge>
            </div>
            
            <p className="text-xs text-center text-muted-foreground mt-3">
              ✅ Entrega em até 7 dias | 💬 Chat direto com o booster
            </p>
          </div>
        )}

        {/* Botão */}
        <Button
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg h-12"
          disabled={originalPrice === 0 || !selectedBooster || loading || !user}
          onClick={handleSubmit}
        >
          {loading ? 'Processando...' : user ? 'Fazer Pedido' : 'Faça Login para Continuar'}
        </Button>

        {!user && (
          <p className="text-center text-sm text-muted-foreground">
            Não tem conta?{' '}
            <Link href="/client-register" className="text-primary-500 hover:underline font-semibold">
              Criar conta grátis
            </Link>
          </p>
        )}
      </CardContent>
    </Card>
  )
}

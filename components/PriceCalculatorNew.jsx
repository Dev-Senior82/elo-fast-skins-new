'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TrendingUp, Zap, Star, Gift, AlertCircle, Minus, Plus, Sparkles } from 'lucide-react'
import { getActiveBoosters } from '@/app/actions/boosters'
import { createOrder } from '@/app/actions/orders'
import { validateDiscountCode, incrementDiscountCodeUsage, markFirstPurchaseDiscountUsed } from '@/app/actions/clients'
import { useToast } from '@/hooks/use-toast'
import { EXTRA_SERVICES } from '@/lib/constants'
import { Checkbox } from '@/components/ui/checkbox'
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
  // Novos elos por vitória
  { value: 'mestre', label: 'Mestre', perWin: 29.75 },
  { value: 'graomestre', label: 'Grão-Mestre', perWin: 42.50 },
  { value: 'challenger', label: 'Challenger', perWin: 59.50 },
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
  const [selectedExtras, setSelectedExtras] = useState([])
  const [winsCount, setWinsCount] = useState(3)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const storedUser = localStorage.getItem('client_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    loadBoosters()
  }, [])

  const loadBoosters = async () => {
    const result = await getActiveBoosters()
    if (result.success) {
      setBoosters(result.data)
    }
  }

  const isWinBasedElo = (eloValue) => {
    return ['mestre', 'graomestre', 'challenger'].includes(eloValue)
  }

  const calculatePrice = () => {
    if (!currentElo || !desiredElo) return 0

    const current = eloTiers.find(e => e.value === currentElo)
    const desired = eloTiers.find(e => e.value === desiredElo)

    if (!current || !desired) return 0

    let basePrice = 0

    if (isWinBasedElo(desiredElo)) {
      basePrice = (desired.perWin || 0) * winsCount
    } else {
      const currentIndex = eloTiers.indexOf(current)
      const desiredIndex = eloTiers.indexOf(desired)

      if (desiredIndex <= currentIndex) return 0

      for (let i = currentIndex; i < desiredIndex; i++) {
        const elo = eloTiers[i]
        if (serviceType === 'solo') {
          basePrice += elo.solo || 0
        } else {
          basePrice += elo.duo || 0
        }
      }
    }

    if (selectedBooster && selectedBooster.price_modifier) {
      basePrice *= (1 + selectedBooster.price_modifier / 100)
    }

    return basePrice
  }

  const calculateFinalPrice = () => {
    let price = calculatePrice()

    const extrasPercentage = EXTRA_SERVICES
      .filter(s => selectedExtras.includes(s.id))
      .reduce((sum, s) => sum + s.percentage, 0)

    price *= (1 + extrasPercentage / 100)

    if (validatedDiscount) {
      price *= (1 - validatedDiscount.percentage / 100)
    }

    if (user && !user.firstPurchaseDiscountUsed && !validatedDiscount) {
      price *= 0.9
    }

    return price
  }

  const handleValidateCode = async () => {
    if (!discountCode.trim()) return

    setValidatingCode(true)
    const result = await validateDiscountCode(discountCode)

    if (result.success) {
      setValidatedDiscount(result.data)
      toast({
        title: 'Código válido!',
        description: `Desconto de ${result.data.percentage}% aplicado.`,
      })
    } else {
      toast({
        title: 'Código inválido',
        description: result.error,
        variant: 'destructive',
      })
    }

    setValidatingCode(false)
  }

  const handleExtraToggle = (serviceId) => {
    if (selectedExtras.includes(serviceId)) {
      setSelectedExtras(selectedExtras.filter(id => id !== serviceId))
    } else {
      setSelectedExtras([...selectedExtras, serviceId])
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Login necessário',
        description: 'Faça login para fazer um pedido.',
        variant: 'destructive',
      })
      return
    }

    if (!currentElo || !desiredElo) {
      toast({
        title: 'Selecione os elos',
        description: 'Escolha seu elo atual e desejado.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    const basePrice = calculatePrice()
    const finalPrice = calculateFinalPrice()

    const orderData = {
      clientId: user.id,
      clientName: user.name,
      clientContact: user.phone || user.discord,
      currentRank: eloTiers.find(e => e.value === currentElo)?.label || currentElo,
      desiredRank: isWinBasedElo(desiredElo) 
        ? `${eloTiers.find(e => e.value === desiredElo)?.label} (${winsCount} vitórias)`
        : eloTiers.find(e => e.value === desiredElo)?.label,
      serviceType,
      originalPrice: basePrice.toFixed(2),
      price: basePrice.toFixed(2),
      finalPrice: finalPrice.toFixed(2),
      discountCode: validatedDiscount?.code || null,
      discountPercentage: validatedDiscount?.percentage || 0,
      boosterId: selectedBooster?.id || null,
      boosterName: selectedBooster?.name || null,
    }

    const result = await createOrder(orderData)

    if (result.success) {
      if (validatedDiscount) {
        await incrementDiscountCodeUsage(validatedDiscount.code)
      }

      if (user && !user.firstPurchaseDiscountUsed && !validatedDiscount) {
        await markFirstPurchaseDiscountUsed(user.id)
      }

      toast({
        title: 'Pedido criado!',
        description: 'Você será redirecionado para o pagamento.',
      })

      router.push(`/payment/${result.data.id}`)
    } else {
      toast({
        title: 'Erro ao criar pedido',
        description: result.error,
        variant: 'destructive',
      })
    }

    setLoading(false)
  }

  const price = calculatePrice()
  const finalPrice = calculateFinalPrice()

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
          <Label>Elo Atual</Label>
          <Select value={currentElo} onValueChange={setCurrentElo}>
            <SelectTrigger className="bg-white/50 dark:bg-black/50">
              <SelectValue placeholder="Selecione seu elo atual" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
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
          <Label>Elo Desejado</Label>
          <Select value={desiredElo} onValueChange={setDesiredElo}>
            <SelectTrigger className="bg-white/50 dark:bg-black/50">
              <SelectValue placeholder="Selecione seu elo desejado" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {eloTiers.map((elo) => (
                <SelectItem key={elo.value} value={elo.value}>
                  {elo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Seletor de Vitórias (para Mestre+) */}
        {desiredElo && isWinBasedElo(desiredElo) && (
          <Card className="p-4 glass-card border-orange-500/20">
            <Label className="mb-3 block text-center">Quantidade de Vitórias</Label>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setWinsCount(Math.max(1, winsCount - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="text-3xl font-bold text-primary-500 w-16 text-center">
                {winsCount}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setWinsCount(Math.min(20, winsCount + 1))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Tipo de Serviço */}
        {desiredElo && !isWinBasedElo(desiredElo) && (
          <div className="space-y-2">
            <Label>Tipo de Serviço</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={serviceType === 'solo' ? 'default' : 'outline'}
                onClick={() => setServiceType('solo')}
                className="w-full"
              >
                <Zap className="h-4 w-4 mr-2" />
                Solo
              </Button>
              <Button
                variant={serviceType === 'duo' ? 'default' : 'outline'}
                onClick={() => setServiceType('duo')}
                className="w-full"
              >
                <Star className="h-4 w-4 mr-2" />
                Duo
              </Button>
            </div>
          </div>
        )}

        {/* Serviços Extras */}
        {EXTRA_SERVICES.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <Label>Serviços Extras</Label>
            </div>
            <Card className="p-4 glass-card border-purple-500/20">
              <div className="space-y-3">
                {EXTRA_SERVICES.map((service) => {
                  const isSelected = selectedExtras.includes(service.id)
                  return (
                    <div
                      key={service.id}
                      onClick={() => handleExtraToggle(service.id)}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer hover:border-primary-500/50 ${
                        isSelected 
                          ? 'bg-primary-500/10 border-primary-500/50' 
                          : 'bg-muted/30 border-border/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleExtraToggle(service.id)}
                          className="pointer-events-none"
                        />
                        <span className="text-sm font-medium">{service.label}</span>
                      </div>
                      <Badge 
                        variant={isSelected ? 'default' : 'outline'}
                        className={isSelected ? 'bg-green-500' : ''}
                      >
                        +{service.percentage}%
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        )}

        {/* Seleção de Booster */}
        {boosters.length > 0 && (
          <div className="space-y-2">
            <Label>Escolha seu Booster (Opcional)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {boosters.map(booster => (
                <Button
                  key={booster.id}
                  variant={selectedBooster?.id === booster.id ? 'default' : 'outline'}
                  onClick={() => setSelectedBooster(booster)}
                  className="flex flex-col h-auto py-3"
                >
                  <span className="font-bold">{booster.name}</span>
                  <Badge variant="secondary" className="mt-1">
                    +{booster.price_modifier}%
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Código de Desconto */}
        <div className="space-y-2">
          <Label>Código de Desconto (Opcional)</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Digite o código"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              disabled={!!validatedDiscount}
            />
            <Button
              onClick={handleValidateCode}
              disabled={validatingCode || !!validatedDiscount}
            >
              {validatedDiscount ? 'Aplicado' : 'Validar'}
            </Button>
          </div>
          {validatedDiscount && (
            <p className="text-sm text-green-500">
              ✓ Desconto de {validatedDiscount.percentage}% aplicado
            </p>
          )}
        </div>

        {/* Resumo do Preço */}
        {price > 0 && (
          <Card className="bg-gradient-to-r from-primary-500/10 to-purple-500/10 border-primary-500/20">
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Preço Base:</span>
                <span className="font-semibold">R$ {price.toFixed(2)}</span>
              </div>
              
              {selectedExtras.length > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Serviços Extras:</span>
                  <span className="text-purple-500">
                    +{EXTRA_SERVICES
                      .filter(s => selectedExtras.includes(s.id))
                      .reduce((sum, s) => sum + s.percentage, 0)}%
                  </span>
                </div>
              )}

              {(validatedDiscount || (user && !user.firstPurchaseDiscountUsed)) && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Desconto:</span>
                  <span className="text-green-500">
                    -{validatedDiscount?.percentage || 10}%
                  </span>
                </div>
              )}

              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-lg font-bold">Total do Pedido:</span>
                <span className="text-3xl font-bold text-primary-500">
                  R$ {finalPrice.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botão de Fazer Pedido */}
        <Button
          onClick={handleSubmit}
          disabled={loading || !currentElo || !desiredElo || !user}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg h-12"
        >
          {loading ? 'Processando...' : 'Fazer Pedido'}
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

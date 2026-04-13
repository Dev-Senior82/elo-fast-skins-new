'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TrendingUp, Zap } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

const valorantRanks = [
  { value: 'ferro1', label: 'Ferro 1', price: 15, icon: '/emblems/valorant/iron.png' },
  { value: 'ferro2', label: 'Ferro 2', price: 16, icon: '/emblems/valorant/iron.png' },
  { value: 'ferro3', label: 'Ferro 3', price: 17, icon: '/emblems/valorant/iron.png' },
  { value: 'bronze1', label: 'Bronze 1', price: 18, icon: '/emblems/valorant/bronze.png' },
  { value: 'bronze2', label: 'Bronze 2', price: 19, icon: '/emblems/valorant/bronze.png' },
  { value: 'bronze3', label: 'Bronze 3', price: 20, icon: '/emblems/valorant/bronze.png' },
  { value: 'prata1', label: 'Prata 1', price: 22, icon: '/emblems/valorant/silver.png' },
  { value: 'prata2', label: 'Prata 2', price: 24, icon: '/emblems/valorant/silver.png' },
  { value: 'prata3', label: 'Prata 3', price: 26, icon: '/emblems/valorant/silver.png' },
  { value: 'ouro1', label: 'Ouro 1', price: 28, icon: '/emblems/valorant/gold.png' },
  { value: 'ouro2', label: 'Ouro 2', price: 30, icon: '/emblems/valorant/gold.png' },
  { value: 'ouro3', label: 'Ouro 3', price: 32, icon: '/emblems/valorant/gold.png' },
  { value: 'platina1', label: 'Platina 1', price: 35, icon: '/emblems/valorant/platinum.png' },
  { value: 'platina2', label: 'Platina 2', price: 38, icon: '/emblems/valorant/platinum.png' },
  { value: 'platina3', label: 'Platina 3', price: 41, icon: '/emblems/valorant/platinum.png' },
  { value: 'diamante1', label: 'Diamante 1', price: 45, icon: '/emblems/valorant/diamond.png' },
  { value: 'diamante2', label: 'Diamante 2', price: 49, icon: '/emblems/valorant/diamond.png' },
  { value: 'diamante3', label: 'Diamante 3', price: 53, icon: '/emblems/valorant/diamond.png' },
  { value: 'ascendente1', label: 'Ascendente 1', price: 58, icon: '/emblems/valorant/ascendant.png' },
  { value: 'ascendente2', label: 'Ascendente 2', price: 63, icon: '/emblems/valorant/ascendant.png' },
  { value: 'ascendente3', label: 'Ascendente 3', price: 68, icon: '/emblems/valorant/ascendant.png' },
  { value: 'imortal1', label: 'Imortal 1', price: 75, icon: '/emblems/valorant/immortal.png' },
  { value: 'imortal2', label: 'Imortal 2', price: 82, icon: '/emblems/valorant/immortal.png' },
  { value: 'imortal3', label: 'Imortal 3', price: 89, icon: '/emblems/valorant/immortal.png' },
  { value: 'radiante', label: 'Radiante', price: 99, icon: '/emblems/valorant/radiant.png' },
]

const valorantServices = [
  { id: 'aula', label: 'Aula com o Booster', percentage: 30, icon: '📚' },
  { id: 'stream', label: 'Partidas Transmitidas', percentage: 10, icon: '📹' },
  { id: 'agent', label: 'Escolher o Agent', percentage: 50, icon: '🎯' },
  { id: 'amigo', label: 'Convidar Amigo', percentage: 30, icon: '👥' },
]

export default function ValorantCalculatorPro() {
  const [currentRank, setCurrentRank] = useState('')
  const [desiredRank, setDesiredRank] = useState('')
  const [selectedExtras, setSelectedExtras] = useState([])
  const [discountCode, setDiscountCode] = useState('')

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

  const handleExtraToggle = (serviceId) => {
    setSelectedExtras(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const getExtrasPercentage = () => {
    return selectedExtras.reduce((sum, id) => {
      const service = valorantServices.find(s => s.id === id)
      return sum + (service?.percentage || 0)
    }, 0)
  }

  const basePrice = calculatePrice()
  const extrasPercentage = getExtrasPercentage()
  const extrasAmount = (basePrice * extrasPercentage) / 100
  const subtotal = basePrice + extrasAmount
  
  const discountPercent = discountCode.toUpperCase() === 'PRIMEIRACOMPRA' ? 10 : 0
  const discountAmount = (subtotal * discountPercent) / 100
  const finalPrice = subtotal - discountAmount

  const currentRankData = valorantRanks.find(r => r.value === currentRank)
  const desiredRankData = valorantRanks.find(r => r.value === desiredRank)

  // Agrupar ranks por tier
  const ranksByTier = [
    { name: 'Ferro', ranks: valorantRanks.filter(r => r.value.startsWith('ferro')) },
    { name: 'Bronze', ranks: valorantRanks.filter(r => r.value.startsWith('bronze')) },
    { name: 'Prata', ranks: valorantRanks.filter(r => r.value.startsWith('prata')) },
    { name: 'Ouro', ranks: valorantRanks.filter(r => r.value.startsWith('ouro')) },
    { name: 'Platina', ranks: valorantRanks.filter(r => r.value.startsWith('platina')) },
    { name: 'Diamante', ranks: valorantRanks.filter(r => r.value.startsWith('diamante')) },
    { name: 'Ascendente', ranks: valorantRanks.filter(r => r.value.startsWith('ascendente')) },
    { name: 'Imortal', ranks: valorantRanks.filter(r => r.value.startsWith('imortal')) },
    { name: 'Radiante', ranks: valorantRanks.filter(r => r.value === 'radiante') },
  ]

  return (
    <div className="space-y-8">
      <Card className="glass-card border-red-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-red-500" />
            Calculadora Valorant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Seleção de Elos - Grid Visual */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Elo Atual */}
            <div className="space-y-4">
              <Label className="text-lg font-bold">Elo Atual</Label>
              {currentRankData && (
                <div className="flex justify-center mb-4">
                  <img
                    src={currentRankData.icon}
                    alt={currentRankData.label}
                    className="w-32 h-32 object-contain"
                    onError={(e) => {
                      e.target.src = 'https://static.wikia.nocookie.net/valorant/images/8/8e/TX_CompetitiveTier_Large_3.png'
                    }}
                  />
                </div>
              )}
              <div className="grid grid-cols-3 gap-2">
                {ranksByTier.map((tier) => (
                  tier.ranks.map((rank) => (
                    <button
                      key={rank.value}
                      onClick={() => setCurrentRank(rank.value)}
                      className={`p-3 rounded-lg border-2 text-xs font-semibold transition-all ${
                        currentRank === rank.value
                          ? 'border-red-500 bg-red-500/20'
                          : 'border-border/40 hover:border-red-500/50'
                      }`}
                    >
                      {rank.label}
                    </button>
                  ))
                ))}
              </div>
            </div>

            {/* Elo Desejado */}
            <div className="space-y-4">
              <Label className="text-lg font-bold">Elo Desejado</Label>
              {desiredRankData && (
                <div className="flex justify-center mb-4">
                  <img
                    src={desiredRankData.icon}
                    alt={desiredRankData.label}
                    className="w-32 h-32 object-contain"
                    onError={(e) => {
                      e.target.src = 'https://static.wikia.nocookie.net/valorant/images/0/02/TX_CompetitiveTier_Large_27.png'
                    }}
                  />
                </div>
              )}
              <div className="grid grid-cols-3 gap-2">
                {ranksByTier.map((tier) => (
                  tier.ranks.map((rank) => (
                    <button
                      key={rank.value}
                      onClick={() => setDesiredRank(rank.value)}
                      className={`p-3 rounded-lg border-2 text-xs font-semibold transition-all ${
                        desiredRank === rank.value
                          ? 'border-red-500 bg-red-500/20'
                          : 'border-border/40 hover:border-red-500/50'
                      }`}
                    >
                      {rank.label}
                    </button>
                  ))
                ))}
              </div>
            </div>
          </div>

          {/* Opções de Boost */}
          <div className="space-y-3">
            <Label className="text-lg font-bold">Opções de Boost</Label>
            <div className="grid md:grid-cols-2 gap-3">
              {valorantServices.map((service) => {
                const isSelected = selectedExtras.includes(service.id)
                return (
                  <div
                    key={service.id}
                    onClick={() => handleExtraToggle(service.id)}
                    className={`
                      p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${isSelected
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-border/40 hover:border-red-500/50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleExtraToggle(service.id)}
                          className="pointer-events-none"
                        />
                        <span className="text-2xl">{service.icon}</span>
                        <span className="text-sm font-medium">{service.label}</span>
                      </div>
                      <Badge variant={isSelected ? 'default' : 'outline'} className={isSelected ? 'bg-red-500' : ''}>
                        +{service.percentage}%
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Cupom de Desconto */}
          <div className="space-y-2">
            <Label>Cupom de Desconto (Opcional)</Label>
            <Input
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Digite seu cupom (ex: PRIMEIRACOMPRA)"
              className="bg-white/50 dark:bg-black/50"
            />
            {discountPercent > 0 && (
              <p className="text-xs text-green-500">✓ Cupom aplicado: {discountPercent}% de desconto</p>
            )}
          </div>

          {/* Resumo do Pedido */}
          <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20">
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Preço Base:</span>
                <span className="font-bold">R$ {basePrice.toFixed(2)}</span>
              </div>

              {extrasPercentage > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Extras (+{extrasPercentage}%):</span>
                  <span className="font-bold text-orange-500">+ R$ {extrasAmount.toFixed(2)}</span>
                </div>
              )}

              {discountPercent > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Desconto (-{discountPercent}%):</span>
                  <span className="font-bold text-green-500">- R$ {discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="h-px bg-border/40" />

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-3xl font-bold text-red-500">
                  R$ {finalPrice.toFixed(2)}
                </span>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold text-lg py-6"
                disabled={!currentRank || !desiredRank || basePrice === 0}
              >
                Contratar Agora
                <TrendingUp className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

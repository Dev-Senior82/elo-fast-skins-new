'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TrendingUp, Zap } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'

const valorantRanks = [
  { value: 'ferro1', label: 'Ferro 1', price: 4, icon: 'https://static.wikia.nocookie.net/valorant/images/8/8e/TX_CompetitiveTier_Large_3.png' },
  { value: 'ferro2', label: 'Ferro 2', price: 5, icon: 'https://static.wikia.nocookie.net/valorant/images/0/09/TX_CompetitiveTier_Large_4.png' },
  { value: 'ferro3', label: 'Ferro 3', price: 6, icon: 'https://static.wikia.nocookie.net/valorant/images/a/a9/TX_CompetitiveTier_Large_5.png' },
  { value: 'bronze1', label: 'Bronze 1', price: 4, icon: 'https://static.wikia.nocookie.net/valorant/images/c/c7/TX_CompetitiveTier_Large_6.png' },
  { value: 'bronze2', label: 'Bronze 2', price: 5, icon: 'https://static.wikia.nocookie.net/valorant/images/e/e8/TX_CompetitiveTier_Large_7.png' },
  { value: 'bronze3', label: 'Bronze 3', price: 6, icon: 'https://static.wikia.nocookie.net/valorant/images/0/0e/TX_CompetitiveTier_Large_8.png' },
  { value: 'prata1', label: 'Prata 1', price: 7, icon: 'https://static.wikia.nocookie.net/valorant/images/3/36/TX_CompetitiveTier_Large_9.png' },
  { value: 'prata2', label: 'Prata 2', price: 8, icon: 'https://static.wikia.nocookie.net/valorant/images/e/ee/TX_CompetitiveTier_Large_10.png' },
  { value: 'prata3', label: 'Prata 3', price: 8, icon: 'https://static.wikia.nocookie.net/valorant/images/8/85/TX_CompetitiveTier_Large_11.png' },
  { value: 'ouro1', label: 'Ouro 1', price: 12, icon: 'https://static.wikia.nocookie.net/valorant/images/3/3f/TX_CompetitiveTier_Large_12.png' },
  { value: 'ouro2', label: 'Ouro 2', price: 13, icon: 'https://static.wikia.nocookie.net/valorant/images/7/7c/TX_CompetitiveTier_Large_13.png' },
  { value: 'ouro3', label: 'Ouro 3', price: 15, icon: 'https://static.wikia.nocookie.net/valorant/images/1/14/TX_CompetitiveTier_Large_14.png' },
  { value: 'platina1', label: 'Platina 1', price: 15, icon: 'https://static.wikia.nocookie.net/valorant/images/a/a4/TX_CompetitiveTier_Large_15.png' },
  { value: 'platina2', label: 'Platina 2', price: 17, icon: 'https://static.wikia.nocookie.net/valorant/images/3/3d/TX_CompetitiveTier_Large_16.png' },
  { value: 'platina3', label: 'Platina 3', price: 19, icon: 'https://static.wikia.nocookie.net/valorant/images/4/4b/TX_CompetitiveTier_Large_17.png' },
  { value: 'diamante1', label: 'Diamante 1', price: 28, icon: 'https://static.wikia.nocookie.net/valorant/images/8/82/TX_CompetitiveTier_Large_18.png' },
  { value: 'diamante2', label: 'Diamante 2', price: 31, icon: 'https://static.wikia.nocookie.net/valorant/images/d/de/TX_CompetitiveTier_Large_19.png' },
  { value: 'diamante3', label: 'Diamante 3', price: 34, icon: 'https://static.wikia.nocookie.net/valorant/images/e/e5/TX_CompetitiveTier_Large_20.png' },
  { value: 'ascendente1', label: 'Ascendente 1', price: 39, icon: 'https://static.wikia.nocookie.net/valorant/images/7/7c/TX_CompetitiveTier_Large_21.png' },
  { value: 'ascendente2', label: 'Ascendente 2', price: 43, icon: 'https://static.wikia.nocookie.net/valorant/images/3/35/TX_CompetitiveTier_Large_22.png' },
  { value: 'ascendente3', label: 'Ascendente 3', price: 48, icon: 'https://static.wikia.nocookie.net/valorant/images/b/b2/TX_CompetitiveTier_Large_23.png' },
  { value: 'imortal1', label: 'Imortal 1', price: 64, icon: 'https://static.wikia.nocookie.net/valorant/images/e/e0/TX_CompetitiveTier_Large_24.png' },
  { value: 'imortal2', label: 'Imortal 2', price: 71, icon: 'https://static.wikia.nocookie.net/valorant/images/3/37/TX_CompetitiveTier_Large_25.png' },
  { value: 'imortal3', label: 'Imortal 3', price: 78, icon: 'https://static.wikia.nocookie.net/valorant/images/c/c6/TX_CompetitiveTier_Large_26.png' },
  { value: 'radiante', label: 'Radiante', price: 99, icon: 'https://static.wikia.nocookie.net/valorant/images/0/02/TX_CompetitiveTier_Large_27.png' },
]

const valorantServices = [
  { id: 'aula', label: 'Aula com o Booster', percentage: 30, icon: '📚' },
  { id: 'stream', label: 'Partidas Transmitidas', percentage: 10, icon: '📹' },
  { id: 'agent', label: 'Escolher o Agent', percentage: 50, icon: '🎯' },
  { id: 'amigo', label: 'Convidar Amigo', percentage: 30, icon: '👥' },
]

export default function ValorantCalculatorNew() {
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
          {/* Elos Visual */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Rank Atual</Label>
              <Select value={currentRank} onValueChange={setCurrentRank}>
                <SelectTrigger className="bg-white/50 dark:bg-black/50">
                  <SelectValue placeholder="Selecione seu rank atual" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {valorantRanks.map((rank) => (
                    <SelectItem key={rank.value} value={rank.value}>
                      {rank.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {currentRankData && (
                <div className="flex justify-center">
                  <img
                    src={currentRankData.icon}
                    alt={currentRankData.label}
                    className="w-24 h-24 object-contain"
                  />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label>Rank Desejado</Label>
              <Select value={desiredRank} onValueChange={setDesiredRank}>
                <SelectTrigger className="bg-white/50 dark:bg-black/50">
                  <SelectValue placeholder="Selecione seu rank desejado" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {valorantRanks.map((rank) => (
                    <SelectItem key={rank.value} value={rank.value}>
                      {rank.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {desiredRankData && (
                <div className="flex justify-center">
                  <img
                    src={desiredRankData.icon}
                    alt={desiredRankData.label}
                    className="w-24 h-24 object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Opções de Boost */}
          <div className="space-y-3">
            <Label>Opções de Boost</Label>
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
                      <Badge variant={isSelected ? 'default' : 'outline'}>
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
              placeholder="Digite seu cupom"
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

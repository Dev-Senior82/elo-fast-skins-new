'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RANKS, BOOST_OPTIONS } from '@/lib/constants'
import { Minus, Plus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { createOrder } from '@/app/actions/orders'
import RankSelector from './RankSelector'
import BoostOptions from './BoostOptions'
import OrderSummary from './OrderSummary'

export default function EloBoostPage() {
  const [currentRank, setCurrentRank] = useState(null)
  const [currentDivision, setCurrentDivision] = useState(null)
  const [desiredRank, setDesiredRank] = useState(null)
  const [desiredDivision, setDesiredDivision] = useState(null)
  const [serviceType, setServiceType] = useState('solo')
  const [winsCount, setWinsCount] = useState(5)
  const [selectedOptions, setSelectedOptions] = useState([])
  const [user, setUser] = useState(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const storedUser = localStorage.getItem('client_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleCurrentRankSelect = (rank, division) => {
    setCurrentRank(rank)
    setCurrentDivision(division)
  }

  const handleDesiredRankSelect = (rank, division) => {
    setDesiredRank(rank)
    setDesiredDivision(division)
  }

  // Verificar se elo é por vitória
  const isWinBased = (rank) => {
    return rank && rank.divisions.length === 0
  }

  // NOVO CÁLCULO: Somar divisão por divisão
  const calculateBasePrice = () => {
    if (!currentRank || !desiredRank) return 0

    // Se desejado é por vitória (Mestre+)
    if (isWinBased(desiredRank)) {
      return desiredRank.pricePerWin * winsCount
    }

    // Verificar se ambos têm divisões selecionadas
    if (!currentDivision || !desiredDivision) return 0

    const currentRankIndex = RANKS.findIndex(r => r.tier === currentRank.tier)
    const desiredRankIndex = RANKS.findIndex(r => r.tier === desiredRank.tier)

    if (desiredRankIndex < currentRankIndex) return 0

    let total = 0
    const priceKey = serviceType === 'solo' ? 'solo' : 'duo'

    // Caso 1: Mesmo tier, diferentes divisões
    if (currentRankIndex === desiredRankIndex) {
      const currentDivIndex = currentRank.divisions.findIndex(d => d.division === currentDivision.division)
      const desiredDivIndex = desiredRank.divisions.findIndex(d => d.division === desiredDivision.division)

      if (desiredDivIndex <= currentDivIndex) return 0

      for (let i = currentDivIndex; i < desiredDivIndex; i++) {
        total += currentRank.divisions[i][priceKey]
      }
    }
    // Caso 2: Tiers diferentes
    else {
      // Somar divisões restantes do tier atual
      const currentDivIndex = currentRank.divisions.findIndex(d => d.division === currentDivision.division)
      for (let i = currentDivIndex; i < currentRank.divisions.length; i++) {
        total += currentRank.divisions[i][priceKey]
      }

      // Somar todos os tiers intermediários
      for (let i = currentRankIndex + 1; i < desiredRankIndex; i++) {
        const rank = RANKS[i]
        if (rank.divisions.length > 0) {
          rank.divisions.forEach(div => {
            total += div[priceKey]
          })
        }
      }

      // Somar divisões do tier desejado até a divisão desejada
      const desiredDivIndex = desiredRank.divisions.findIndex(d => d.division === desiredDivision.division)
      for (let i = 0; i < desiredDivIndex; i++) {
        total += desiredRank.divisions[i][priceKey]
      }
    }

    return total
  }

  // Calcular preço total com opções
  const calculateTotalPrice = () => {
    let price = calculateBasePrice()

    const optionsPercentage = selectedOptions.reduce((sum, opt) => sum + opt.percentage, 0)
    price *= (1 + optionsPercentage / 100)

    return price
  }

  const handleToggleOption = (option) => {
    if (selectedOptions.some(opt => opt.id === option.id)) {
      setSelectedOptions(selectedOptions.filter(opt => opt.id !== option.id))
    } else {
      setSelectedOptions([...selectedOptions, option])
    }
  }

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: 'Login Necessário',
        description: 'Faça login para comprar um boost.',
        variant: 'destructive',
      })
      router.push('/client-login')
      return
    }

    if (!currentRank || !desiredRank) {
      toast({
        title: 'Selecione os Elos',
        description: 'Por favor, selecione o elo atual e desejado.',
        variant: 'destructive',
      })
      return
    }

    if (!isWinBased(currentRank) && !currentDivision) {
      toast({
        title: 'Selecione a Divisão',
        description: 'Por favor, selecione a divisão atual.',
        variant: 'destructive',
      })
      return
    }

    if (!isWinBased(desiredRank) && !desiredDivision) {
      toast({
        title: 'Selecione a Divisão',
        description: 'Por favor, selecione a divisão desejada.',
        variant: 'destructive',
      })
      return
    }

    const basePrice = calculateBasePrice()
    const totalPrice = calculateTotalPrice()

    const orderData = {
      clientId: user.id,
      clientName: user.name,
      clientContact: user.phone || user.discord,
      currentRank: currentDivision?.label || currentRank.label,
      desiredRank: isWinBased(desiredRank) 
        ? `${desiredRank.label} (${winsCount} vitórias)` 
        : desiredDivision?.label || desiredRank.label,
      serviceType,
      originalPrice: basePrice.toFixed(2),
      price: basePrice.toFixed(2),
      finalPrice: totalPrice.toFixed(2),
      discountCode: null,
      discountPercentage: 0,
      boosterId: null,
      boosterName: null,
    }

    const result = await createOrder(orderData)

    if (result.success) {
      toast({
        title: 'Pedido Criado!',
        description: 'Redirecionando para o pagamento...',
      })
      router.push(`/payment/${result.data.id}`)
    } else {
      toast({
        title: 'Erro',
        description: result.error,
        variant: 'destructive',
      })
    }
  }

  const basePrice = calculateBasePrice()
  const totalPrice = calculateTotalPrice()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b border-purple-500/30">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-4">
            <Sparkles className="w-10 h-10 text-purple-400" />
            <h1 className="text-5xl font-black text-white tracking-tight">
              ELO BOOST LOL
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl">
            Serviço profissional de boost • Entrega rápida • 100% Seguro
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Selectors (70%) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Rank */}
            <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
              <RankSelector
                selectedRank={currentRank}
                selectedDivision={currentDivision}
                onRankSelect={handleCurrentRankSelect}
                label="1️⃣ Selecione seu Elo Atual"
              />
            </div>

            {/* Desired Rank */}
            <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
              <RankSelector
                selectedRank={desiredRank}
                selectedDivision={desiredDivision}
                onRankSelect={handleDesiredRankSelect}
                label="2️⃣ Selecione seu Elo Desejado"
              />
            </div>

            {/* Tipo de Serviço - SOLO/DUO */}
            {desiredRank && !isWinBased(desiredRank) && (
              <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-4">Tipo de Serviço</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setServiceType('solo')}
                    className={`
                      p-4 rounded-xl border-2 transition-all duration-300
                      ${serviceType === 'solo' 
                        ? 'bg-gradient-to-br from-purple-600/30 to-blue-600/30 border-purple-500 scale-105' 
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:scale-105'
                      }
                    `}
                  >
                    <div className="text-3xl mb-2">⚡</div>
                    <h4 className="text-white font-bold mb-1">Solo</h4>
                    <p className="text-xs text-slate-400">Booster joga sozinho</p>
                  </button>
                  <button
                    onClick={() => setServiceType('duo')}
                    className={`
                      p-4 rounded-xl border-2 transition-all duration-300
                      ${serviceType === 'duo' 
                        ? 'bg-gradient-to-br from-purple-600/30 to-blue-600/30 border-purple-500 scale-105' 
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:scale-105'
                      }
                    `}
                  >
                    <div className="text-3xl mb-2">👥</div>
                    <h4 className="text-white font-bold mb-1">Duo</h4>
                    <p className="text-xs text-slate-400">Jogue junto com o booster</p>
                  </button>
                </div>
              </div>
            )}

            {/* Wins Selector (for Master+) */}
            {desiredRank && isWinBased(desiredRank) && (
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border-2 border-purple-500/30 animate-fade-in">
                <h3 className="text-lg font-semibold text-white mb-6 text-center">
                  Selecione o Número de Vitórias
                </h3>
                <div className="flex items-center justify-center gap-6">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setWinsCount(Math.max(1, winsCount - 1))}
                    className="w-14 h-14 rounded-xl border-2 border-purple-500 bg-slate-800 hover:bg-purple-600/20"
                  >
                    <Minus className="w-6 h-6 text-white" />
                  </Button>

                  <div className="text-center">
                    <div className="text-6xl font-black text-white mb-2">
                      {winsCount}
                    </div>
                    <div className="text-sm text-slate-400">
                      Vitórias @ R$ {desiredRank.pricePerWin.toFixed(2)}/vitória
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setWinsCount(Math.min(20, winsCount + 1))}
                    className="w-14 h-14 rounded-xl border-2 border-purple-500 bg-slate-800 hover:bg-purple-600/20"
                  >
                    <Plus className="w-6 h-6 text-white" />
                  </Button>
                </div>
              </div>
            )}

            {/* Boost Options */}
            <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
              <BoostOptions
                selectedOptions={selectedOptions}
                onToggleOption={handleToggleOption}
              />
            </div>
          </div>

          {/* Right Side - Order Summary (30%) */}
          <div className="lg:col-span-1">
            <OrderSummary
              currentRank={currentDivision || currentRank}
              desiredRank={desiredDivision || desiredRank}
              basePrice={basePrice}
              selectedOptions={selectedOptions}
              totalPrice={totalPrice}
              onCheckout={handleCheckout}
              serviceType={serviceType}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

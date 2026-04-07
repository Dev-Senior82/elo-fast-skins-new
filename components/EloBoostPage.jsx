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
  const [desiredRank, setDesiredRank] = useState(null)
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

  // Verificar se elo é por vitória
  const isWinBased = (rank) => {
    return rank && !rank.divisions.length
  }

  // Calcular preço base
  const calculateBasePrice = () => {
    if (!currentRank || !desiredRank) return 0

    // Se desejado é por vitória (Master+)
    if (isWinBased(desiredRank)) {
      return desiredRank.pricePerWin * winsCount
    }

    // Cálculo normal por divisões
    const currentIndex = RANKS.findIndex(r => r.tier === currentRank.tier)
    const desiredIndex = RANKS.findIndex(r => r.tier === desiredRank.tier)

    if (desiredIndex <= currentIndex) return 0

    let total = 0
    for (let i = currentIndex; i < desiredIndex; i++) {
      const rank = RANKS[i]
      if (rank.pricePerDivision) {
        total += rank.pricePerDivision * rank.divisions.length
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
        title: 'Login Required',
        description: 'Please login to purchase a boost.',
        variant: 'destructive',
      })
      router.push('/client-login')
      return
    }

    if (!currentRank || !desiredRank) {
      toast({
        title: 'Select Ranks',
        description: 'Please select both current and desired ranks.',
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
      currentRank: currentRank.label,
      desiredRank: isWinBased(desiredRank) 
        ? `${desiredRank.label} (${winsCount} wins)` 
        : desiredRank.label,
      serviceType: 'solo',
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
        title: 'Order Created!',
        description: 'Redirecting to payment...',
      })
      router.push(`/payment/${result.data.id}`)
    } else {
      toast({
        title: 'Error',
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
              LOL ELO BOOST
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl">
            Professional boosting service • Fast delivery • 100% Safe
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
                onRankSelect={setCurrentRank}
                label="1️⃣ Select Your Current Rank"
              />
            </div>

            {/* Desired Rank */}
            <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
              <RankSelector
                selectedRank={desiredRank}
                onRankSelect={setDesiredRank}
                label="2️⃣ Select Your Desired Rank"
              />
            </div>

            {/* Wins Selector (for Master+) */}
            {desiredRank && isWinBased(desiredRank) && (
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border-2 border-purple-500/30 animate-fade-in">
                <h3 className="text-lg font-semibold text-white mb-6 text-center">
                  Select Number of Wins
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
                      Wins @ R$ {desiredRank.pricePerWin}/win
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
              currentRank={currentRank}
              desiredRank={desiredRank}
              basePrice={basePrice}
              selectedOptions={selectedOptions}
              totalPrice={totalPrice}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

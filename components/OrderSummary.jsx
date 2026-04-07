'use client'

import { ShoppingCart, TrendingUp, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OrderSummary({ 
  currentRank, 
  desiredRank, 
  basePrice, 
  selectedOptions,
  totalPrice,
  onCheckout 
}) {
  const optionsTotal = selectedOptions.reduce((sum, opt) => sum + opt.percentage, 0)

  return (
    <div className="sticky top-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border-2 border-purple-500/30 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
        <ShoppingCart className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Order Summary</h2>
      </div>

      {/* Ranks */}
      <div className="space-y-4">
        {/* Current Rank */}
        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
          <span className="text-sm text-slate-400">Current Rank</span>
          <span className="text-lg font-bold text-white">
            {currentRank?.label || '—'}
          </span>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <TrendingUp className="w-8 h-8 text-purple-400" />
        </div>

        {/* Desired Rank */}
        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
          <span className="text-sm text-slate-400">Desired Rank</span>
          <span className="text-lg font-bold text-green-400">
            {desiredRank?.label || '—'}
          </span>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-3 pt-4 border-t border-slate-700">
        {/* Base Price */}
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Base Price</span>
          <span className="text-white font-semibold">
            R$ {basePrice.toFixed(2)}
          </span>
        </div>

        {/* Options Applied */}
        {selectedOptions.length > 0 && (
          <>
            {selectedOptions.map((option) => (
              <div key={option.id} className="flex justify-between items-center text-sm">
                <span className="text-slate-400">{option.label}</span>
                <span className="text-purple-400">+{option.percentage}%</span>
              </div>
            ))}
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-slate-400">Options Total</span>
              <span className="text-purple-400">+{optionsTotal}%</span>
            </div>
          </>
        )}
      </div>

      {/* Total */}
      <div className="pt-4 border-t-2 border-purple-500/30">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-bold text-white">Total Price</span>
          <span className="text-3xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            R$ {totalPrice.toFixed(2)}
          </span>
        </div>

        {/* Checkout Button */}
        <Button
          onClick={onCheckout}
          disabled={!currentRank || !desiredRank}
          className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 
                     hover:from-green-600 hover:to-emerald-700 text-white rounded-xl
                     shadow-lg shadow-green-500/30 transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Award className="w-5 h-5 mr-2" />
          Purchase Boost
        </Button>

        {/* Trust Badge */}
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">
            🔒 Secure Payment • Instant Delivery
          </p>
        </div>
      </div>
    </div>
  )
}

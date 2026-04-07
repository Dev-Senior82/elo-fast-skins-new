'use client'

import { ShoppingCart, TrendingUp, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CouponInput from './CouponInput'

export default function OrderSummary({ 
  currentRank, 
  desiredRank, 
  basePrice, 
  selectedOptions,
  totalPrice,
  finalPrice,
  appliedCoupon,
  onCouponApplied,
  serviceType,
  onCheckout 
}) {
  const optionsTotal = selectedOptions.reduce((sum, opt) => sum + opt.percentage, 0)
  const hasDiscount = appliedCoupon && appliedCoupon.discount > 0

  return (
    <div className="sticky top-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border-2 border-purple-500/30 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
        <ShoppingCart className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Resumo do Pedido</h2>
      </div>

      {/* Ranks */}
      <div className="space-y-4">
        {/* Current Rank */}
        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
          <span className="text-sm text-slate-400">Elo Atual</span>
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
          <span className="text-sm text-slate-400">Elo Desejado</span>
          <span className="text-lg font-bold text-green-400">
            {desiredRank?.label || '—'}
          </span>
        </div>

        {/* Service Type */}
        {serviceType && (
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <span className="text-sm text-slate-400">Tipo de Serviço</span>
            <span className="text-md font-semibold text-blue-400">
              {serviceType === 'solo' ? 'Solo' : 'Duo'}
            </span>
          </div>
        )}
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-3 pt-4 border-t border-slate-700">
        {/* Base Price */}
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Preço Base</span>
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
              <span className="text-slate-400">Total de Extras</span>
              <span className="text-purple-400">+{optionsTotal}%</span>
            </div>
          </>
        )}
      </div>

      {/* Cupom de Desconto */}
      <div className="pt-4 border-t border-slate-700">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Cupom de Desconto</h3>
        <CouponInput 
          onCouponApplied={onCouponApplied}
          totalBeforeDiscount={totalPrice}
        />
      </div>

      {/* Total */}
      <div className="pt-4 border-t-2 border-purple-500/30">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-bold text-white">
            {hasDiscount ? 'Subtotal' : 'Preço Total'}
          </span>
          <span className={`
            text-3xl font-black 
            ${hasDiscount 
              ? 'line-through text-slate-500 text-xl' 
              : 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'
            }
          `}>
            R$ {totalPrice.toFixed(2)}
          </span>
        </div>

        {/* Preço final com desconto */}
        {hasDiscount && (
          <div className="flex justify-between items-center mb-6 animate-fade-in">
            <span className="text-lg font-bold text-green-400">Preço Final</span>
            <span className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent animate-pulse-slow">
              R$ {finalPrice.toFixed(2)}
            </span>
          </div>
        )}

        {hasDiscount && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg animate-scale-in">
            <p className="text-center text-sm font-bold text-green-400">
              🎉 Você economizou R$ {(totalPrice - finalPrice).toFixed(2)}!
            </p>
          </div>
        )}

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
          Comprar Boost
        </Button>

        {/* Trust Badge */}
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">
            🔒 Pagamento Seguro • Entrega Instantânea
          </p>
        </div>
      </div>
    </div>
  )
}

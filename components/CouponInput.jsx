'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Tag, Check, X } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function CouponInput({ onCouponApplied, totalBeforeDiscount }) {
  const [couponCode, setCouponCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setMessage({ type: 'error', text: 'Digite um cupom' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      // Buscar cupom no Supabase
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('active', true)
        .single()

      if (error || !data) {
        setMessage({ type: 'error', text: 'Cupom inválido ou expirado' })
        setLoading(false)
        return
      }

      // Verificar se expirou
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        setMessage({ type: 'error', text: 'Este cupom já expirou' })
        setLoading(false)
        return
      }

      // Verificar limite de usos
      if (data.max_uses && data.current_uses >= data.max_uses) {
        setMessage({ type: 'error', text: 'Cupom esgotado' })
        setLoading(false)
        return
      }

      // Cupom válido!
      setAppliedCoupon(data)
      setMessage({ 
        type: 'success', 
        text: `✅ Cupom aplicado! ${data.discount_percentage}% de desconto` 
      })
      
      // Notificar componente pai
      onCouponApplied({
        code: data.code,
        discount: data.discount_percentage
      })

      setLoading(false)
    } catch (err) {
      console.error('Erro ao validar cupom:', err)
      setMessage({ type: 'error', text: 'Erro ao validar cupom. Tente novamente.' })
      setLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setMessage({ type: '', text: '' })
    onCouponApplied(null)
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Digite seu cupom"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
            disabled={loading || appliedCoupon}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500"
          />
        </div>
        
        {appliedCoupon ? (
          <Button
            onClick={handleRemoveCoupon}
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            <X className="w-4 h-4 mr-1" />
            Remover
          </Button>
        ) : (
          <Button
            onClick={handleApplyCoupon}
            disabled={loading || !couponCode.trim()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Validando...
              </>
            ) : (
              'Aplicar'
            )}
          </Button>
        )}
      </div>

      {/* Mensagem de feedback */}
      {message.text && (
        <div 
          className={`
            px-4 py-2 rounded-lg text-sm font-medium animate-fade-in
            ${message.type === 'success' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }
          `}
        >
          {message.text}
        </div>
      )}

      {/* Cupom aplicado - mostrar desconto */}
      {appliedCoupon && (
        <div className="flex items-center justify-between px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg animate-scale-in">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-sm font-bold text-green-400">
                Cupom: {appliedCoupon.code}
              </p>
              <p className="text-xs text-green-300">
                {appliedCoupon.discount_percentage}% de desconto aplicado
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-400">
              - R$ {((totalBeforeDiscount * appliedCoupon.discount_percentage) / 100).toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-orange-500/20 relative">
      <div className="container py-3 flex items-center justify-center relative">
        {/* Texto centralizado */}
        <p className="text-center text-sm md:text-base font-medium">
          <span className="text-slate-200">🔥 Use o cupom: </span>
          <span className="text-red-500 font-bold">PRIMEIRACOMPRA</span>
          <span className="text-slate-200"> e ganhe 10% OFF</span>
        </p>

        {/* Botão fechar */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-800/50 rounded-full transition-colors group"
          aria-label="Fechar banner"
        >
          <X className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
        </button>
      </div>
    </div>
  )
}

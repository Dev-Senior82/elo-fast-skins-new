'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(true)

  return (
    <Link
      href="https://wa.me/5582999646622"
      target="_blank"
      className="fixed bottom-6 right-6 z-50 group"
      onMouseEnter={() => setShowTooltip(true)}
    >
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-2 animate-bounce">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
            Alguma dúvida?
            <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-green-500"></div>
          </div>
        </div>
      )}
      
      {/* Botão WhatsApp */}
      <div className="bg-green-500 hover:bg-green-600 text-white rounded-full p-5 shadow-2xl transition-all hover:scale-110 flex items-center justify-center">
        <MessageCircle className="h-10 w-10" />
      </div>
      
      {/* Pulse effect */}
      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
    </Link>
  )
}

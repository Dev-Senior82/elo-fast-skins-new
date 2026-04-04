'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

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
      
      {/* Botão WhatsApp com sua imagem */}
      <div className="relative hover:scale-110 transition-all">
        <Image
          src="https://customer-assets.emergentagent.com/job_league-boost-hub/artifacts/oomvayjf_bot%C3%A3o%20de%20whats%20app.png"
          alt="WhatsApp"
          width={80}
          height={80}
          className="drop-shadow-2xl"
        />
      </div>
      
      {/* Pulse effect */}
      <div className="absolute inset-0 bg-green-500/30 rounded-full animate-ping"></div>
    </Link>
  )
}

'use client'

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import Image from 'next/image'

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)

  const handleWhatsAppClick = () => {
    const phoneNumber = '5582999646622' // Número real do WhatsApp
    const message = encodeURIComponent('Olá! Tenho uma dúvida sobre os serviços de boost.')
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  return (
    <>
      {/* Botão flutuante */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative"
          aria-label="Chat de ajuda"
        >
          {/* Raposa animada - MAIOR E COM DESTAQUE */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-2 hover:rotate-3">
            <Image
              src="/raposa-mascote.png"
              alt="Raposa Mascote"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
            
            {/* Glow effect ao redor da raposa */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 via-red-500/20 to-yellow-500/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
          </div>

          {/* Balão "Alguma dúvida?" - ESTILIZADO */}
          {!isOpen && (
            <div className="absolute bottom-full right-0 mb-4 px-6 py-3 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 text-white rounded-2xl shadow-2xl border-2 border-orange-300/50 whitespace-nowrap animate-bounce-smooth hover:animate-jump transform hover:scale-105 transition-all duration-300 cursor-pointer group-hover:animate-jump">
              <span className="text-base font-bold drop-shadow-lg">
                ✨ Alguma dúvida?
              </span>
              
              {/* Seta do balão estilizada */}
              <div className="absolute top-full right-8 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-orange-600"></div>
              
              {/* Brilho interno */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl pointer-events-none"></div>
              
              {/* Partículas de brilho */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping opacity-75"></div>
              <div className="absolute -top-2 right-4 w-2 h-2 bg-orange-200 rounded-full animate-pulse"></div>
            </div>
          )}
        </button>

        {/* Menu de opções */}
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-4 w-72 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border-2 border-orange-500/30 overflow-hidden animate-scale-in backdrop-blur-xl">
            {/* Header com gradiente */}
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 p-5 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <div className="flex items-center justify-between relative z-10">
                <h3 className="font-bold text-lg drop-shadow-lg">Como podemos ajudar?</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-all hover:rotate-90 duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Opções */}
            <div className="p-5 space-y-3">
              <button
                onClick={handleWhatsAppClick}
                className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-green-500/20 border-2 border-green-500/30 hover:border-green-500/50 transition-all group backdrop-blur-sm hover:scale-105 duration-300"
              >
                <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                  <MessageCircle className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-sm text-white">
                    Falar no WhatsApp
                  </p>
                  <p className="text-xs text-slate-400">
                    Resposta rápida ⚡
                  </p>
                </div>
              </button>

              <a
                href="/suporte"
                className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-blue-500/20 border-2 border-blue-500/30 hover:border-blue-500/50 transition-all group backdrop-blur-sm hover:scale-105 duration-300"
              >
                <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <MessageCircle className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-sm text-white">
                    Central de Ajuda
                  </p>
                  <p className="text-xs text-slate-400">
                    FAQ e guias 📚
                  </p>
                </div>
              </a>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes bounce-smooth {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-bounce-smooth {
          animation: bounce-smooth 2s ease-in-out infinite;
        }

        @keyframes jump {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-15px) scale(1.05);
          }
        }

        .animate-jump {
          animation: jump 0.6s ease-in-out;
        }

        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </>
  )
}

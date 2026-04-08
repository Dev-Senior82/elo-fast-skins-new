'use client'

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import Image from 'next/image'

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)

  const handleWhatsAppClick = () => {
    const phoneNumber = '5511999999999' // Substitua pelo número real
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
          {/* Raposa animada */}
          <div className="relative w-20 h-20 md:w-24 md:h-24 cursor-pointer transition-transform hover:scale-110">
            <Image
              src="/raposa-mascote.png"
              alt="Raposa Mascote"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>

          {/* Balão "Alguma dúvida?" */}
          {!isOpen && (
            <div className="absolute bottom-full right-0 mb-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 whitespace-nowrap animate-bounce-slow">
              <span className="text-sm font-medium">Alguma dúvida?</span>
              {/* Seta do balão */}
              <div className="absolute top-full right-4 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white dark:border-t-slate-800"></div>
            </div>
          )}
        </button>

        {/* Menu de opções */}
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-4 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Como podemos ajudar?</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Opções */}
            <div className="p-4 space-y-3">
              <button
                onClick={handleWhatsAppClick}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-green-500/10 border border-green-500/20 transition-colors group"
              >
                <MessageCircle className="w-5 h-5 text-green-500" />
                <div className="text-left">
                  <p className="font-medium text-sm text-slate-900 dark:text-white">
                    Falar no WhatsApp
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Resposta rápida
                  </p>
                </div>
              </button>

              <a
                href="/suporte"
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500/10 border border-blue-500/20 transition-colors group"
              >
                <MessageCircle className="w-5 h-5 text-blue-500" />
                <div className="text-left">
                  <p className="font-medium text-sm text-slate-900 dark:text-white">
                    Central de Ajuda
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    FAQ e guias
                  </p>
                </div>
              </a>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  )
}

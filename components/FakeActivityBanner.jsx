'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'

const FAKE_ACTIVITIES = [
  '✔ 5 pedidos concluídos nas últimas 3 horas',
  '✔ 3 boosts iniciados agora',
  '✔ 2 novos clientes compraram boost',
  '✔ 7 serviços concluídos hoje',
  '✔ 4 boosters online trabalhando agora',
  '✔ 6 clientes satisfeitos hoje',
]

export default function FakeActivityBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % FAKE_ACTIVITIES.length)
        setIsVisible(true)
      }, 300)
    }, 5000) // Trocar a cada 5 segundos

    return () => clearInterval(interval)
  }, [])

  // Triplicar para efeito marquee contínuo
  const displayActivities = [...FAKE_ACTIVITIES, ...FAKE_ACTIVITIES, ...FAKE_ACTIVITIES]

  return (
    <div className="bg-gradient-to-r from-green-950/30 via-emerald-950/30 to-green-950/30 border-b border-green-500/20 overflow-hidden">
      <div className="activity-ticker py-2">
        <div className="activity-track">
          {displayActivities.map((activity, index) => (
            <span
              key={index}
              className="activity-item mx-12 text-sm font-medium whitespace-nowrap flex items-center gap-2"
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500/20 border border-green-500/40">
                <Check className="w-3 h-3 text-green-400" />
              </span>
              <span className="text-green-100">{activity.replace('✔ ', '')}</span>
              <span className="activity-glow">✨</span>
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .activity-ticker {
          position: relative;
          width: 100%;
        }

        .activity-track {
          display: flex;
          animation: scroll-activity 50s linear infinite;
          will-change: transform;
        }

        @keyframes scroll-activity {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .activity-item {
          display: inline-flex;
        }

        .activity-glow {
          animation: glow-pulse 2s ease-in-out infinite;
        }

        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @media (max-width: 768px) {
          .activity-track {
            animation-duration: 30s;
          }
        }
      `}</style>
    </div>
  )
}

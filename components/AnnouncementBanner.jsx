'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Criar cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState([])

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  async function fetchAnnouncements() {
    try {
      const { data, error } = await supabase
        .from('site_announcements')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar anúncios:', error)
        // Fallback para anúncios padrão
        setAnnouncements([
          { id: 1, text: '🔥 Use o cupom: PRIMEIRACOMPRA e ganhe 10% OFF' },
          { id: 2, text: '💎 Cupons disponíveis: DISCORD10 / ELOFAST10' },
        ])
      } else if (data && data.length > 0) {
        setAnnouncements(data)
      } else {
        // Anúncios padrão se não houver nenhum no banco
        setAnnouncements([
          { id: 1, text: '🔥 Use o cupom: PRIMEIRACOMPRA e ganhe 10% OFF' },
          { id: 2, text: '💎 Cupons disponíveis: DISCORD10 / ELOFAST10' },
        ])
      }
    } catch (err) {
      console.error('Erro:', err)
      setAnnouncements([
        { id: 1, text: '🔥 Use o cupom: PRIMEIRACOMPRA e ganhe 10% OFF' },
      ])
    }
  }

  // Duplicar anúncios para efeito seamless
  const displayAnnouncements = [...announcements, ...announcements, ...announcements]

  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-orange-500/20 overflow-hidden">
      <div className="announcement-ticker py-2">
        <div className="announcement-track">
          {displayAnnouncements.map((announcement, index) => (
            <span
              key={`${announcement.id}-${index}`}
              className="announcement-item mx-8 text-sm font-medium whitespace-nowrap"
            >
              {announcement.text.split(/(\b[A-Z0-9]{4,}\b)/).map((part, i) => {
                // Destacar códigos de cupom em vermelho
                if (/^[A-Z0-9]{4,}$/.test(part)) {
                  return (
                    <span key={i} className="text-red-500 font-bold">
                      {part}
                    </span>
                  )
                }
                return <span key={i} className="text-slate-200">{part}</span>
              })}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .announcement-ticker {
          position: relative;
          width: 100%;
        }

        .announcement-track {
          display: flex;
          animation: scroll-left 40s linear infinite;
          will-change: transform;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .announcement-item {
          display: inline-block;
        }

        @media (max-width: 768px) {
          .announcement-track {
            animation-duration: 25s;
          }
        }
      `}</style>
    </div>
  )
}

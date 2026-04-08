'use client'

import { useEffect, useState } from 'react'

export default function AdminTheme() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdmin = () => {
      const boosterUser = localStorage.getItem('booster_user')
      if (boosterUser) {
        const user = JSON.parse(boosterUser)
        setIsAdmin(user.is_admin === true)
      } else {
        setIsAdmin(false)
      }
    }

    checkAdmin()
    window.addEventListener('auth-change', checkAdmin)
    
    return () => window.removeEventListener('auth-change', checkAdmin)
  }, [])

  if (!isAdmin) return null

  return (
    <style jsx global>{`
      /* TEMA DARK EXCLUSIVO PARA ADMIN */
      
      /* Fundo principal */
      body.admin-theme {
        background: linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a0000 100%) !important;
      }

      /* Cards e containers */
      .admin-theme .glass-card,
      .admin-theme [class*="card"],
      .admin-theme [class*="Card"] {
        background: linear-gradient(135deg, rgba(20, 0, 0, 0.9) 0%, rgba(40, 0, 0, 0.8) 100%) !important;
        border: 2px solid rgba(220, 38, 38, 0.4) !important;
        box-shadow: 0 0 30px rgba(220, 38, 38, 0.2) !important;
      }

      /* Navbar */
      .admin-theme nav,
      .admin-theme .navbar {
        background: linear-gradient(90deg, #0a0000 0%, #1a0000 50%, #0a0000 100%) !important;
        border-bottom: 2px solid rgba(220, 38, 38, 0.5) !important;
        box-shadow: 0 4px 20px rgba(220, 38, 38, 0.3) !important;
      }

      /* Botões */
      .admin-theme button:not(.admin-theme button[variant="ghost"]),
      .admin-theme .btn {
        background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%) !important;
        border: 1px solid rgba(220, 38, 38, 0.6) !important;
        color: white !important;
        box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4) !important;
      }

      .admin-theme button:hover,
      .admin-theme .btn:hover {
        background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%) !important;
        box-shadow: 0 6px 25px rgba(220, 38, 38, 0.6) !important;
        transform: translateY(-2px);
      }

      /* Inputs */
      .admin-theme input,
      .admin-theme textarea,
      .admin-theme select {
        background: rgba(10, 0, 0, 0.6) !important;
        border: 1px solid rgba(220, 38, 38, 0.4) !important;
        color: white !important;
      }

      .admin-theme input:focus,
      .admin-theme textarea:focus,
      .admin-theme select:focus {
        border-color: rgba(220, 38, 38, 0.8) !important;
        box-shadow: 0 0 15px rgba(220, 38, 38, 0.3) !important;
      }

      /* Textos */
      .admin-theme h1,
      .admin-theme h2,
      .admin-theme h3,
      .admin-theme h4,
      .admin-theme h5,
      .admin-theme h6 {
        color: #fca5a5 !important;
        text-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
      }

      .admin-theme p,
      .admin-theme span,
      .admin-theme div {
        color: #e5e5e5 !important;
      }

      /* Tabelas */
      .admin-theme table {
        border: 2px solid rgba(220, 38, 38, 0.3) !important;
      }

      .admin-theme th {
        background: rgba(220, 38, 38, 0.2) !important;
        color: #fca5a5 !important;
        border-bottom: 2px solid rgba(220, 38, 38, 0.5) !important;
      }

      .admin-theme td {
        border-bottom: 1px solid rgba(220, 38, 38, 0.2) !important;
      }

      .admin-theme tr:hover {
        background: rgba(220, 38, 38, 0.1) !important;
      }

      /* Scrollbar */
      .admin-theme ::-webkit-scrollbar {
        width: 12px;
        background: #0a0000;
      }

      .admin-theme ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #dc2626 0%, #991b1b 100%);
        border-radius: 6px;
        border: 2px solid #0a0000;
      }

      .admin-theme ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #ef4444 0%, #b91c1c 100%);
      }

      /* Badges e Tags */
      .admin-theme .badge,
      .admin-theme [class*="badge"] {
        background: rgba(220, 38, 38, 0.3) !important;
        color: #fca5a5 !important;
        border: 1px solid rgba(220, 38, 38, 0.5) !important;
      }

      /* Dividers */
      .admin-theme hr,
      .admin-theme .divider {
        border-color: rgba(220, 38, 38, 0.3) !important;
      }

      /* Glow effect em elementos importantes */
      .admin-theme .important,
      .admin-theme [class*="primary"] {
        box-shadow: 0 0 20px rgba(220, 38, 38, 0.4) !important;
      }

      /* Animação de pulso para elementos críticos */
      @keyframes admin-pulse {
        0%, 100% {
          box-shadow: 0 0 20px rgba(220, 38, 38, 0.4);
        }
        50% {
          box-shadow: 0 0 40px rgba(220, 38, 38, 0.8);
        }
      }

      .admin-theme .pulse {
        animation: admin-pulse 2s ease-in-out infinite;
      }
    `}</style>
  )
}

// Hook para aplicar classe admin-theme no body
export function useAdminTheme() {
  useEffect(() => {
    const checkAdmin = () => {
      const boosterUser = localStorage.getItem('booster_user')
      if (boosterUser) {
        const user = JSON.parse(boosterUser)
        if (user.is_admin) {
          document.body.classList.add('admin-theme')
        } else {
          document.body.classList.remove('admin-theme')
        }
      } else {
        document.body.classList.remove('admin-theme')
      }
    }

    checkAdmin()
    window.addEventListener('auth-change', checkAdmin)
    
    return () => {
      window.removeEventListener('auth-change', checkAdmin)
      document.body.classList.remove('admin-theme')
    }
  }, [])
}

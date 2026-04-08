'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Moon, Sun, User, LogOut, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import UserInbox from '@/components/UserInbox'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [clientUser, setClientUser] = useState(null)
  const [boosterUser, setBoosterUser] = useState(null)
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    // Verificar se cliente está logado
    const storedClient = localStorage.getItem('client_user')
    if (storedClient) {
      setClientUser(JSON.parse(storedClient))
    }
    
    // Verificar se booster está logado
    const storedBooster = localStorage.getItem('booster_user')
    if (storedBooster) {
      setBoosterUser(JSON.parse(storedBooster))
    }

    // NOVO: Listener para detectar mudanças no localStorage (login/logout)
    const handleStorageChange = () => {
      const client = localStorage.getItem('client_user')
      const booster = localStorage.getItem('booster_user')
      
      setClientUser(client ? JSON.parse(client) : null)
      setBoosterUser(booster ? JSON.parse(booster) : null)
    }

    // Listener de storage para quando outra aba faz login/logout
    window.addEventListener('storage', handleStorageChange)

    // Listener customizado para mudanças na mesma aba
    window.addEventListener('auth-change', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('auth-change', handleStorageChange)
    }
  }, [])

  const handleClientLogout = () => {
    localStorage.removeItem('client_user')
    setClientUser(null)
    router.push('/')
  }
  
  const handleBoosterLogout = () => {
    localStorage.removeItem('booster_user')
    setBoosterUser(null)
    router.push('/')
  }

  const navItems = [
    { label: 'Início', href: '/' },
    { label: 'Boosters', href: '/boosters' },
    { label: 'Contas', href: '/contas' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Discord', href: 'https://discord.gg/DMcHkNwKHb', external: true },
    { label: 'Suporte', href: '/suporte' },
  ]

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/40 glass-card electric-navbar">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="font-bold text-2xl gamer-gradient bg-clip-text text-transparent">
            ELO FAST SKINS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.slice(0, 3).map((item) => (
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium transition-colors hover:text-primary-500"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary-500"
              >
                {item.label}
              </Link>
            )
          ))}
          
          <UserInbox />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Ícones dos Jogos */}
          <Link href="/precos" className="hover:opacity-80 transition-opacity" title="League of Legends">
            <Avatar className="h-10 w-10 border-2 border-blue-500 hover:border-blue-400 transition-all cursor-pointer">
              <AvatarImage 
                src="https://customer-assets.emergentagent.com/job_league-boost-hub/artifacts/judztdm9_league%20of%20legends.png" 
                alt="League of Legends" 
              />
            </Avatar>
          </Link>

          <Link href="/valorant" className="hover:opacity-80 transition-opacity" title="Valorant">
            <Avatar className="h-10 w-10 border-2 border-red-500 hover:border-red-400 transition-all cursor-pointer">
              <AvatarImage 
                src="https://customer-assets.emergentagent.com/job_league-boost-hub/artifacts/pq1wvtfz_valorant.png" 
                alt="Valorant" 
              />
            </Avatar>
          </Link>

          {/* Cliente Logado ou Botão de Login */}
          {clientUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-blue-500/50 hover:bg-blue-500/10 gap-2">
                  <User className="h-4 w-4" />
                  {clientUser.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/client-dashboard" className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/client-profile" className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleClientLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              variant="outline"
              className="border-blue-500/50 hover:bg-blue-500/10"
            >
              <Link href="/client-login">Login Cliente</Link>
            </Button>
          )}

          {/* Booster - Ícone ou Dropdown se logado */}
          {boosterUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 hover:bg-primary-500/10">
                  <Avatar className="h-8 w-8 border-2 border-primary-500">
                    <AvatarImage 
                      src="https://customer-assets.emergentagent.com/job_league-boost-hub/artifacts/vbhm79qm_ee238998055501954e9adec926d18dfd.jpg" 
                      alt={boosterUser.name} 
                    />
                    <AvatarFallback className="bg-gradient-to-br from-primary-500 to-orange-500 text-white text-xs">
                      {boosterUser.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:inline">{boosterUser.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Painel Booster</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={boosterUser.is_admin ? "/admin-dashboard" : "/booster-dashboard"} className="cursor-pointer">
                    <Shield className="h-4 w-4 mr-2" />
                    {boosterUser.is_admin ? "Admin" : "Dashboard"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/booster-profile" className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleBoosterLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/booster-login" className="hover:opacity-80 transition-opacity">
              <Avatar className="h-10 w-10 border-2 border-primary-500 hover:border-orange-500 transition-all cursor-pointer">
                <AvatarImage 
                  src="https://customer-assets.emergentagent.com/job_league-boost-hub/artifacts/vbhm79qm_ee238998055501954e9adec926d18dfd.jpg" 
                  alt="Login Booster" 
                />
                <AvatarFallback className="bg-gradient-to-br from-primary-500 to-orange-500 text-white text-xs">
                  🛡️
                </AvatarFallback>
              </Avatar>
            </Link>
          )}

          <Button
            asChild
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold"
          >
            <Link href="/precos">Contratar Agora</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border/40 glass-card">
          <div className="container py-4 space-y-3">
            {navItems.map((item) => (
              item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm font-medium transition-colors hover:text-primary-500 hover:bg-primary-500/10 rounded-lg"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm font-medium transition-colors hover:text-primary-500 hover:bg-primary-500/10 rounded-lg"
                >
                  {item.label}
                </Link>
              )
            ))}
            
            {/* Cliente Logado ou Login */}
            {clientUser ? (
              <>
                <Link
                  href="/client-dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm font-medium transition-colors hover:text-primary-500 hover:bg-primary-500/10 rounded-lg"
                >
                  <User className="h-4 w-4 inline mr-2" />
                  {clientUser.name}
                </Link>
                <button
                  onClick={() => {
                    handleClientLogout()
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-500/10 rounded-lg"
                >
                  <LogOut className="h-4 w-4 inline mr-2" />
                  Sair
                </button>
              </>
            ) : (
              <Button
                asChild
                variant="outline"
                className="w-full border-blue-500/50 hover:bg-blue-500/10"
              >
                <Link href="/client-login" onClick={() => setIsOpen(false)}>
                  Login Cliente
                </Link>
              </Button>
            )}
            
            {/* Booster - Logado ou Login */}
            {boosterUser ? (
              <>
                <Link
                  href={boosterUser.is_admin ? "/admin-dashboard" : "/booster-dashboard"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-primary-500/10 rounded-lg transition-colors"
                >
                  <Avatar className="h-8 w-8 border-2 border-primary-500">
                    <AvatarImage 
                      src="https://customer-assets.emergentagent.com/job_league-boost-hub/artifacts/vbhm79qm_ee238998055501954e9adec926d18dfd.jpg" 
                      alt={boosterUser.name} 
                    />
                    <AvatarFallback className="bg-gradient-to-br from-primary-500 to-orange-500 text-white text-xs">
                      {boosterUser.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{boosterUser.name}</span>
                </Link>
                <button
                  onClick={() => {
                    handleBoosterLogout()
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-500/10 rounded-lg"
                >
                  <LogOut className="h-4 w-4 inline mr-2" />
                  Sair (Booster)
                </button>
              </>
            ) : (
              <Link 
                href="/booster-login" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-primary-500/10 rounded-lg transition-colors"
              >
                <Avatar className="h-8 w-8 border-2 border-primary-500">
                  <AvatarImage 
                    src="https://customer-assets.emergentagent.com/job_league-boost-hub/artifacts/vbhm79qm_ee238998055501954e9adec926d18dfd.jpg" 
                    alt="Login Booster" 
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary-500 to-orange-500 text-white text-xs">
                    🛡️
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">Login Booster</span>
              </Link>
            )}
            
            <Button
              asChild
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold"
            >
              <Link href="/precos" onClick={() => setIsOpen(false)}>Contratar Agora</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
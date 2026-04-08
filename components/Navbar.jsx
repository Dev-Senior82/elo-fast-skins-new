'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Moon, Sun, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import UserInbox from '@/components/UserInbox'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [clientUser, setClientUser] = useState(null)
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    const storedClient = localStorage.getItem('client_user')
    if (storedClient) {
      setClientUser(JSON.parse(storedClient))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('client_user')
    setClientUser(null)
    router.push('/')
  }

  return (
    <nav className="sticky top-0 z-40 w-full border-b">
      <div className="flex items-center justify-between p-4">
        
        {/* Logo */}
        <Link href="/">
          <span className="font-bold text-xl">ELO FAST</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* UserInbox para boosters */}
          <UserInbox />

          {/* Tema */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5" />
            <Moon className="h-5 w-5" />
          </Button>

          {/* Usuário */}
          {clientUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>{clientUser.name}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/client-login">Login</Link>
          )}
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5" />
            <Moon className="h-5 w-5" />
          </Button>

          <Button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden p-4 border-t">
          {clientUser ? (
            <>
              <p className="mb-2">{clientUser.name}</p>
              <button
                onClick={handleLogout}
                className="text-red-500"
              >
                Sair
              </button>
            </>
          ) : (
            <Link href="/client-login">Login</Link>
          )}
        </div>
      )}
    </nav>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Inbox, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

// Cliente Supabase singleton (evita múltiplas instâncias)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default function UserInbox() {
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Verificar se é booster
    const storedBooster = localStorage.getItem('booster_user')
    if (!storedBooster) return

    const boosterData = JSON.parse(storedBooster)
    setUser(boosterData)

    // Carregar mensagens inicial
    fetchMessages(boosterData.id)

    // Polling simples a cada 15 segundos (sem websocket)
    const interval = setInterval(() => {
      fetchMessages(boosterData.id)
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const fetchMessages = async (boosterId) => {
    try {
      const { data, error } = await supabase
        .from('user_inbox')
        .select('*')
        .eq('user_id', boosterId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (!error && data) {
        setMessages(data)
      }
    } catch (err) {
      console.error('Erro ao buscar mensagens:', err)
    }
  }

  const handleMessageClick = async (message) => {
    // Marcar como lida
    if (!message.is_read) {
      try {
        await supabase
          .from('user_inbox')
          .update({ is_read: true })
          .eq('id', message.id)

        setMessages(prev => 
          prev.map(m => m.id === message.id ? { ...m, is_read: true } : m)
        )
      } catch (err) {
        console.error('Erro ao marcar como lida:', err)
      }
    }

    // Redirecionar se houver link
    if (message.link_url) {
      router.push(message.link_url)
    }
  }

  const handleDelete = async (e, messageId) => {
    e.stopPropagation()
    
    try {
      const { error } = await supabase
        .from('user_inbox')
        .delete()
        .eq('id', messageId)

      if (!error) {
        setMessages(prev => prev.filter(m => m.id !== messageId))
      }
    } catch (err) {
      console.error('Erro ao deletar:', err)
    }
  }

  if (!user) return null

  const unreadCount = messages.filter(m => !m.is_read).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Inbox className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2 font-semibold border-b">
          Mensagens {unreadCount > 0 && `(${unreadCount})`}
        </div>
        <ScrollArea className="h-[300px]">
          {messages.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Nenhuma mensagem
            </div>
          ) : (
            messages.map((message) => (
              <DropdownMenuItem
                key={message.id}
                onClick={() => handleMessageClick(message)}
                className={`cursor-pointer relative group ${
                  !message.is_read ? 'bg-blue-500/10' : ''
                }`}
              >
                <div className="flex flex-col gap-1 w-full pr-6">
                  <p className="text-sm font-medium">{message.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {message.content}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(message.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                  onClick={(e) => handleDelete(e, message.id)}
                >
                  <X className="h-3 w-3 text-red-500" />
                </Button>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

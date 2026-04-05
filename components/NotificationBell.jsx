'use client'

import { useEffect, useState } from 'react'
import { Bell, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getBoosterNotifications, markNotificationAsRead, deleteNotification, clearAllNotifications } from '@/app/actions/orders'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([])
  const [user, setUser] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const storedUser = localStorage.getItem('booster_user')
    if (!storedUser) return

    const userData = JSON.parse(storedUser)
    setUser(userData)
    loadNotifications(userData.id)

    // Subscrever a notificações em tempo real APENAS para este booster
    const channel = supabase
      .channel(`notifications-${userData.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `booster_id=eq.${userData.id}`,
        },
        (payload) => {
          // Verificar se a notificação é realmente para este booster
          if (payload.new.booster_id === userData.id) {
            setNotifications(prev => [payload.new, ...prev])
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `booster_id=eq.${userData.id}`,
        },
        (payload) => {
          setNotifications(prev => prev.filter(n => n.id !== payload.old.id))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const loadNotifications = async (boosterId) => {
    const result = await getBoosterNotifications(boosterId)
    if (result.success) {
      // Filtrar apenas notificações deste booster (segurança extra)
      setNotifications(result.data.filter(n => n.booster_id === boosterId))
    }
  }

  const handleNotificationClick = async (notification, e) => {
    // Não navegar se clicou no botão de deletar
    if (e.target.closest('.delete-btn')) return
    
    if (!notification.read) {
      await markNotificationAsRead(notification.id)
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      )
    }
    setIsOpen(false)
    router.push(`/order/${notification.order_id}`)
  }

  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation()
    e.preventDefault()
    
    const result = await deleteNotification(notificationId, user.id)
    if (result.success) {
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      toast({
        title: 'Notificação removida',
        description: 'A notificação foi removida com sucesso.',
      })
    }
  }

  const handleClearAll = async () => {
    const result = await clearAllNotifications(user.id)
    if (result.success) {
      setNotifications([])
      toast({
        title: 'Notificações limpas',
        description: 'Todas as notificações foram removidas.',
      })
    }
  }

  if (!user) return null

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-background/95 backdrop-blur-sm">
        <div className="p-2 font-semibold border-b flex items-center justify-between">
          <span>Notificações {unreadCount > 0 && `(${unreadCount})`}</span>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-muted-foreground hover:text-red-500"
              onClick={handleClearAll}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Limpar tudo
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Nenhuma notificação
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={(e) => handleNotificationClick(notification, e)}
                className={`cursor-pointer p-3 hover:bg-muted/50 border-b border-border/50 relative group ${
                  !notification.read ? 'bg-primary-500/10' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="delete-btn h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:text-red-500"
                    onClick={(e) => handleDeleteNotification(e, notification.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {!notification.read && (
                  <div className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary-500" />
                )}
              </div>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowLeft, Send, Lock, Shield } from 'lucide-react'
import { getOrderById, canAccessChat } from '@/app/actions/orders'
import { getOrderMessages, sendMessage } from '@/app/actions/messages'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function OrderChatPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [clientUser, setClientUser] = useState(null)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    // Verificar se é booster ou cliente
    const storedBooster = localStorage.getItem('booster_user')
    const storedClient = localStorage.getItem('client_user')
    
    if (storedBooster) {
      setUser(JSON.parse(storedBooster))
    }
    if (storedClient) {
      setClientUser(JSON.parse(storedClient))
    }

    loadOrder()
  }, [params.id])

  useEffect(() => {
    // Verificar acesso ao chat quando tiver os dados
    const checkAccess = async () => {
      if (!order) return
      
      // Admin sempre tem acesso
      if (user?.is_admin) {
        setHasAccess(true)
        loadMessages()
        setupRealtime()
        return
      }
      
      // Verificar se é o booster designado ou quem aceitou
      if (user) {
        const isDesignated = order.booster_id === user.id
        const isAccepted = order.accepted_by_booster_id === user.id
        
        if (isDesignated || isAccepted) {
          setHasAccess(true)
          loadMessages()
          setupRealtime()
          return
        }
      }
      
      // Verificar se é o cliente dono do pedido
      if (clientUser && order.client_id === clientUser.id) {
        setHasAccess(true)
        loadMessages()
        setupRealtime()
        return
      }
      
      setHasAccess(false)
    }

    checkAccess()
  }, [order, user, clientUser])

  const setupRealtime = () => {
    // Subscrever a mensagens em tempo real
    const channel = supabase
      .channel(`messages-${params.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `order_id=eq.${params.id}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const loadOrder = async () => {
    const result = await getOrderById(params.id)
    if (result.success) {
      setOrder(result.data)
    } else {
      toast({
        title: 'Erro',
        description: 'Pedido não encontrado',
        variant: 'destructive',
      })
      router.push('/')
    }
    setLoading(false)
  }

  const loadMessages = async () => {
    const result = await getOrderMessages(params.id)
    if (result.success) {
      setMessages(result.data)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !hasAccess) return

    const senderType = user ? 'booster' : 'client'
    const senderName = user ? user.name : (clientUser?.name || order.client_name)

    const messageData = {
      orderId: params.id,
      senderType,
      senderName,
      message: newMessage.trim(),
    }

    const result = await sendMessage(messageData)
    if (result.success) {
      setNewMessage('')
    } else {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a mensagem',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!order) return null

  // Página de acesso negado
  if (!hasAccess) {
    return (
      <div className="container py-20">
        <Card className="glass-card border-red-500/20 max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <Lock className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle className="text-2xl text-red-500">Acesso Restrito</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar este chat.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-500/10 p-4 rounded-lg text-center">
              <Shield className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                O chat deste pedido é privado entre o cliente e o booster designado.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="w-full"
            >
              <Link href={user ? (user.is_admin ? '/admin-dashboard' : '/booster-dashboard') : '/client-dashboard'}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-20">
      <Button
        asChild
        variant="ghost"
        className="mb-6"
      >
        <Link href={user ? (user.is_admin ? '/admin-dashboard' : '/booster-dashboard') : '/client-dashboard'}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do Pedido */}
        <div className="lg:col-span-1">
          <Card className="glass-card border-primary-500/20">
            <CardHeader>
              <CardTitle>Detalhes do Pedido</CardTitle>
              <CardDescription>#{order.id.slice(0, 8)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" data-protected>
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-semibold">{order.client_name}</p>
              </div>

              {order.booster_name && (
                <div>
                  <p className="text-sm text-muted-foreground">Booster Selecionado</p>
                  <p className="font-semibold">{order.booster_name}</p>
                </div>
              )}

              {order.accepted_by_booster_name && (
                <div>
                  <p className="text-sm text-muted-foreground">Aceito por</p>
                  <p className="font-semibold text-green-500">{order.accepted_by_booster_name}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground">Serviço</p>
                <p className="font-semibold">
                  {order.current_rank} → {order.desired_rank}
                </p>
                <Badge className="mt-2">
                  {order.service_type === 'duo' ? 'Duo Boost' : 'Solo Boost'}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Valor</p>
                <p className="text-2xl font-bold text-primary-500">
                  R$ {parseFloat(order.price).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                  {order.status === 'pending' && 'Pendente'}
                  {order.status === 'accepted' && 'Aceito'}
                  {order.status === 'completed' && 'Concluído'}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Data</p>
                <p className="text-sm">
                  {new Date(order.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat */}
        <div className="lg:col-span-2">
          <Card className="glass-card border-primary-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Chat Privado
                <Shield className="h-4 w-4 text-green-500" />
              </CardTitle>
              <CardDescription>
                Conversa segura entre cliente e booster
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4 mb-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    Nenhuma mensagem ainda. Inicie a conversa!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender_type === 'booster' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.sender_type === 'booster'
                              ? 'bg-primary-500 text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-xs font-semibold mb-1">{msg.sender_name}</p>
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-white/50 dark:bg-black/50"
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

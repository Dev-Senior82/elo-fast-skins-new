'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowLeft, Send } from 'lucide-react'
import { getOrderById } from '@/app/actions/orders'
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

  useEffect(() => {
    const storedUser = localStorage.getItem('booster_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    loadOrder()
    loadMessages()

    // Subscrever a mensagens em tempo real
    const channel = supabase
      .channel('messages')
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
  }, [params.id])

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
    if (!newMessage.trim()) return

    const messageData = {
      orderId: params.id,
      senderType: user ? 'booster' : 'client',
      senderName: user ? user.name : order.client_name,
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

  return (
    <div className="container py-20">
      <Button
        asChild
        variant="ghost"
        className="mb-6"
      >
        <Link href={user ? (user.is_admin ? '/admin-dashboard' : '/booster-dashboard') : '/'}>
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
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-semibold">{order.client_name}</p>
              </div>

              {order.booster_name && (
                <div>
                  <p className="text-sm text-muted-foreground">Booster</p>
                  <p className="font-semibold">{order.booster_name}</p>
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
              <CardTitle>Chat</CardTitle>
              <CardDescription>
                Converse sobre os detalhes do boost
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
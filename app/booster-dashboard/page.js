'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle2, Clock, Trophy, MessageSquare, LogOut, Timer, Lock } from 'lucide-react'
import { getAllOrders, acceptOrder, completeOrder, canBoosterAcceptOrder, getActiveOrdersCount } from '@/app/actions/boosters'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function BoosterDashboardPage() {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeOrdersCount, setActiveOrdersCount] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const storedUser = localStorage.getItem('booster_user')
    if (!storedUser) {
      router.push('/booster-login')
      return
    }

    const userData = JSON.parse(storedUser)
    setUser(userData)
    loadOrders(userData.id)
    
    // Atualizar a cada 30 segundos para manter timers atualizados
    const interval = setInterval(() => loadOrders(userData.id), 30000)
    return () => clearInterval(interval)
  }, [])

  const loadOrders = async (boosterId) => {
    // Carregar TODOS os pedidos
    const result = await getAllOrders()
    if (result.success) {
      setOrders(result.data)
    }
    
    // Carregar contagem de pedidos ativos do booster
    const countResult = await getActiveOrdersCount(boosterId)
    if (countResult.success) {
      setActiveOrdersCount(countResult.count)
    }
    
    setLoading(false)
  }

  const handleAcceptOrder = async (orderId) => {
    if (!user) return

    // Verificar se pode aceitar
    const canAccept = await canBoosterAcceptOrder(user.id, orderId)
    if (!canAccept.success) {
      toast({
        title: 'Não é possível aceitar',
        description: canAccept.error,
        variant: 'destructive',
      })
      return
    }

    const result = await acceptOrder(orderId, user.id)
    if (result.success) {
      toast({
        title: 'Pedido aceito!',
        description: 'O pedido foi aceito com sucesso.',
      })
      loadOrders(user.id)
    } else {
      toast({
        title: 'Erro',
        description: result.error,
        variant: 'destructive',
      })
    }
  }

  const handleCompleteOrder = async (orderId) => {
    const result = await completeOrder(orderId)
    if (result.success) {
      toast({
        title: 'Pedido concluído!',
        description: 'O pedido foi marcado como concluído.',
      })
      loadOrders(user.id)
    } else {
      toast({
        title: 'Erro',
        description: result.error,
        variant: 'destructive',
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('booster_user')
    window.dispatchEvent(new Event('auth-change'))
    router.push('/')
  }

  // Função para calcular tempo restante da reserva
  const getReservationTimeRemaining = (expiresAt) => {
    if (!expiresAt) return null
    
    const now = new Date()
    const expires = new Date(expiresAt)
    const diff = expires - now
    
    if (diff <= 0) return 'Expirado'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // Verificar se booster pode aceitar o pedido
  const canAcceptOrder = (order) => {
    if (!user) return { can: false, reason: 'Usuário não identificado' }
    
    // Pedido já aceito
    if (order.accepted_by_booster_id) {
      return { can: false, reason: 'Pedido já aceito' }
    }
    
    // Booster já tem 2 pedidos ativos
    if (activeOrdersCount >= 2) {
      return { can: false, reason: 'Você já possui o máximo de 2 pedidos ativos' }
    }
    
    // Verificar se está reservado
    if (order.reserved_for_booster_id) {
      const now = new Date()
      const expires = new Date(order.reservation_expires_at)
      
      // Reservado para outro booster e não expirou
      if (order.reserved_for_booster_id !== user.id && now < expires) {
        const timeRemaining = getReservationTimeRemaining(order.reservation_expires_at)
        return { can: false, reason: `Reservado. Disponível em ${timeRemaining}` }
      }
    }
    
    return { can: true, reason: '' }
  }

  // Verificar se booster pode ver o chat
  const canViewChat = (order) => {
    if (!user) return false
    
    // Apenas o booster que aceitou o pedido pode ver o chat
    return order.accepted_by_booster_id === user.id
  }

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!user) return null

  const pendingOrders = orders.filter(o => o.status === 'pending')
  const acceptedOrders = orders.filter(o => o.status === 'accepted' && o.accepted_by_booster_id === user.id)
  const completedOrders = orders.filter(o => o.status === 'completed' && o.accepted_by_booster_id === user.id)

  const OrderCard = ({ order, showActions }) => {
    const acceptCheck = canAcceptOrder(order)
    const timeRemaining = getReservationTimeRemaining(order.reservation_expires_at)
    const isReservedForMe = order.reserved_for_booster_id === user.id
    const chatAllowed = canViewChat(order)

    return (
      <Card className="glass-card border-primary-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{order.client_name}</CardTitle>
            <div className="flex gap-2">
              <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                {order.status === 'pending' && 'Pendente'}
                {order.status === 'accepted' && 'Aceito'}
                {order.status === 'completed' && 'Concluído'}
              </Badge>
              {isReservedForMe && timeRemaining && timeRemaining !== 'Expirado' && (
                <Badge className="bg-orange-500">
                  <Timer className="h-3 w-3 mr-1" />
                  {timeRemaining}
                </Badge>
              )}
            </div>
          </div>
          <CardDescription>
            {order.current_rank} → {order.desired_rank} | {order.service_type === 'duo' ? 'Duo' : 'Solo'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-2xl font-bold text-primary-500">
            R$ {parseFloat(order.final_price || order.price).toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">
            Criado em: {new Date(order.created_at).toLocaleDateString('pt-BR')}
          </div>
          
          {showActions && (
            <div className="flex gap-2">
              {order.status === 'pending' && (
                <Button
                  onClick={() => handleAcceptOrder(order.id)}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  disabled={!acceptCheck.can}
                  title={acceptCheck.reason}
                >
                  {acceptCheck.can ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Aceitar
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      {acceptCheck.reason.includes('Reservado') ? 'Reservado' : 'Bloqueado'}
                    </>
                  )}
                </Button>
              )}
              {order.status === 'accepted' && (
                <Button
                  onClick={() => handleCompleteOrder(order.id)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Concluir
                </Button>
              )}
              
              {/* Chat - apenas para o booster do pedido */}
              {chatAllowed ? (
                <Button
                  asChild
                  variant="outline"
                  className="flex-1"
                >
                  <Link href={`/order/${order.id}`}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled
                  title="Chat disponível apenas após aceitar o pedido"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Chat
                </Button>
              )}
            </div>
          )}
          
          {!acceptCheck.can && order.status === 'pending' && (
            <p className="text-xs text-muted-foreground text-center">
              {acceptCheck.reason}
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container py-20">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Olá, <span className="gamer-gradient bg-clip-text text-transparent">{user.name}</span>!
          </h1>
          <p className="text-muted-foreground">{user.rank}</p>
          <p className="text-sm text-orange-500 mt-1">
            Pedidos ativos: {activeOrdersCount}/2
          </p>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="border-red-500/50 hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass-card border-orange-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-500">{pendingOrders.length}</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-500" />
              Meus Aceitos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-500">{acceptedOrders.length}</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-green-500" />
              Concluídos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">{completedOrders.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pendentes ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="accepted">Meus Aceitos ({acceptedOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Concluídos ({completedOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {pendingOrders.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhum pedido pendente
              </CardContent>
            </Card>
          ) : (
            pendingOrders.map(order => <OrderCard key={order.id} order={order} showActions />)
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4 mt-6">
          {acceptedOrders.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhum pedido aceito
              </CardContent>
            </Card>
          ) : (
            acceptedOrders.map(order => <OrderCard key={order.id} order={order} showActions />)
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          {completedOrders.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhum pedido concluído
              </CardContent>
            </Card>
          ) : (
            completedOrders.map(order => <OrderCard key={order.id} order={order} showActions={false} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle2, Clock, Trophy, MessageSquare, LogOut, Lock, Timer, AlertCircle } from 'lucide-react'
import { getAllOrders, acceptOrder, completeOrder, verifyBoosterSession, countActiveBoosterOrders } from '@/app/actions/boosters'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import NotificationBell from '@/components/NotificationBell'

export default function BoosterDashboardPage() {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeOrdersCount, setActiveOrdersCount] = useState(0)
  const [currentTime, setCurrentTime] = useState(Date.now())
  const router = useRouter()
  const { toast } = useToast()

  // Atualizar tempo atual a cada segundo para cronômetro
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const checkSession = async () => {
      const storedUser = localStorage.getItem('booster_user')
      if (!storedUser) {
        router.push('/booster-login')
        return
      }

      const userData = JSON.parse(storedUser)
      
      // Se tem token de sessão, tentar verificar
      if (userData.session_token) {
        const sessionResult = await verifyBoosterSession(userData.id, userData.session_token)
        if (sessionResult.success) {
          // Atualizar dados do usuário
          localStorage.setItem('booster_user', JSON.stringify(sessionResult.data))
          setUser(sessionResult.data)
        } else {
          // Sessão expirou mas ainda tem dados, usar dados locais
          setUser(userData)
        }
      } else {
        // Sem token de sessão, usar dados locais
        setUser(userData)
      }
      
      loadOrders(userData.id)
      loadActiveOrdersCount(userData.id)
    }

    checkSession()
  }, [router])

  const loadOrders = async (boosterId) => {
    const result = await getAllOrders(boosterId, false)
    if (result.success) {
      setOrders(result.data)
    }
    setLoading(false)
  }

  const loadActiveOrdersCount = async (boosterId) => {
    const result = await countActiveBoosterOrders(boosterId)
    if (result.success) {
      setActiveOrdersCount(result.count)
    }
  }

  const handleAcceptOrder = async (orderId) => {
    if (activeOrdersCount >= 2) {
      toast({
        title: 'Limite atingido',
        description: 'Você já possui 2 pedidos em andamento. Conclua um pedido antes de aceitar outro.',
        variant: 'destructive',
      })
      return
    }

    const result = await acceptOrder(orderId, user.id, user.name)
    if (result.success) {
      toast({
        title: 'Pedido aceito!',
        description: 'O pedido foi aceito com sucesso.',
      })
      loadOrders(user.id)
      loadActiveOrdersCount(user.id)
    } else {
      toast({
        title: 'Erro',
        description: result.error,
        variant: 'destructive',
      })
    }
  }

  const handleCompleteOrder = async (orderId) => {
    const result = await completeOrder(orderId, user.id)
    if (result.success) {
      toast({
        title: 'Pedido concluído!',
        description: 'O pedido foi marcado como concluído.',
      })
      loadOrders(user.id)
      loadActiveOrdersCount(user.id)
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
    router.push('/')
  }

  // Função para formatar tempo restante
  const formatTimeRemaining = (ms) => {
    if (ms <= 0) return null
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // Verificar se o booster pode aceitar o pedido
  const canAcceptOrder = (order) => {
    if (!user) return false
    
    // Se não tem booster designado, qualquer um pode aceitar
    if (!order.booster_id) return true
    
    // Se é o booster designado, pode aceitar
    if (order.booster_id === user.id) return true
    
    // Se passou 3 horas, qualquer um pode aceitar
    const createdAt = new Date(order.created_at)
    const hoursElapsed = (currentTime - createdAt) / (1000 * 60 * 60)
    return hoursElapsed >= 3
  }

  // Verificar se o booster pode ver o chat
  const canAccessChat = (order) => {
    if (!user) return false
    
    // Se é o booster designado ou quem aceitou
    if (order.booster_id === user.id) return true
    if (order.accepted_by_booster_id === user.id) return true
    
    return false
  }

  // Calcular tempo restante para o pedido
  const getTimeRemaining = (order) => {
    if (!order.booster_id || order.booster_id === user?.id) return null
    
    const createdAt = new Date(order.created_at)
    const threeHoursMs = 3 * 60 * 60 * 1000
    const elapsed = currentTime - createdAt.getTime()
    const remaining = threeHoursMs - elapsed
    
    return remaining > 0 ? remaining : null
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
  const completedOrders = orders.filter(o => o.status === 'completed')

  const OrderCard = ({ order, showActions }) => {
    const timeRemaining = getTimeRemaining(order)
    const canAccept = canAcceptOrder(order)
    const canChat = canAccessChat(order)
    const isDesignated = order.booster_id === user.id
    const isMyOrder = order.accepted_by_booster_id === user.id

    return (
      <Card className={`glass-card ${isDesignated ? 'border-primary-500/50' : 'border-primary-500/20'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{order.client_name}</CardTitle>
              {isDesignated && (
                <Badge className="bg-primary-500/20 text-primary-500">
                  Para você
                </Badge>
              )}
            </div>
            <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
              {order.status === 'pending' && 'Pendente'}
              {order.status === 'accepted' && 'Aceito'}
              {order.status === 'completed' && 'Concluído'}
            </Badge>
          </div>
          <CardDescription>
            {order.current_rank} → {order.desired_rank} | {order.service_type === 'duo' ? 'Duo' : 'Solo'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-2xl font-bold text-primary-500">
            R$ {parseFloat(order.price).toFixed(2)}
          </div>
          
          {/* Cronômetro para pedidos reservados */}
          {order.status === 'pending' && timeRemaining && !isDesignated && (
            <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 p-2 rounded-lg">
              <Timer className="h-4 w-4" />
              <span className="text-sm font-mono">
                Reservado - Disponível em: {formatTimeRemaining(timeRemaining)}
              </span>
            </div>
          )}

          {/* Aviso de limite de pedidos */}
          {activeOrdersCount >= 2 && order.status === 'pending' && (
            <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-2 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Você já tem 2 pedidos ativos</span>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            Criado em: {new Date(order.created_at).toLocaleDateString('pt-BR')}
          </div>
          
          {showActions && (
            <div className="flex gap-2">
              {order.status === 'pending' && (
                <Button
                  onClick={() => handleAcceptOrder(order.id)}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  disabled={!canAccept || activeOrdersCount >= 2}
                >
                  {!canAccept ? (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Reservado
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Aceitar
                    </>
                  )}
                </Button>
              )}
              {order.status === 'accepted' && isMyOrder && (
                <Button
                  onClick={() => handleCompleteOrder(order.id)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Concluir
                </Button>
              )}
              
              {/* Chat só visível para booster designado/que aceitou */}
              {canChat ? (
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
                  className="flex-1 opacity-50"
                  disabled
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Chat Privado
                </Button>
              )}
            </div>
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
          {activeOrdersCount > 0 && (
            <p className="text-sm text-amber-500 mt-1">
              Pedidos ativos: {activeOrdersCount}/2
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell />
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-500/50 hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
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
                Nenhum pedido aceito por você
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

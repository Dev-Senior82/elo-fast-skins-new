'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle2, Clock, Trophy, MessageSquare, LogOut, Shield } from 'lucide-react'
import { getAllOrders, acceptOrder, completeOrder } from '@/app/actions/boosters'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const storedUser = localStorage.getItem('booster_user')
    if (!storedUser) {
      router.push('/booster-login')
      return
    }

    const userData = JSON.parse(storedUser)
    if (!userData.is_admin) {
      toast({
        title: 'Acesso negado',
        description: 'Você não tem permissão para acessar esta página.',
        variant: 'destructive',
      })
      router.push('/booster-dashboard')
      return
    }

    setUser(userData)
    loadOrders()
  }, [])

  const loadOrders = async () => {
    const result = await getAllOrders()
    if (result.success) {
      setOrders(result.data)
    }
    setLoading(false)
  }

  const handleAcceptOrder = async (orderId) => {
    const result = await acceptOrder(orderId)
    if (result.success) {
      toast({
        title: 'Pedido aceito!',
        description: 'O pedido foi aceito com sucesso.',
      })
      loadOrders()
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
      loadOrders()
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

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!user) return null

  const pendingOrders = orders.filter(o => o.status === 'pending')
  const acceptedOrders = orders.filter(o => o.status === 'accepted')
  const completedOrders = orders.filter(o => o.status === 'completed')

  const OrderCard = ({ order, showActions }) => (
    <Card className="glass-card border-primary-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{order.client_name}</CardTitle>
            {order.booster_name && (
              <p className="text-sm text-muted-foreground">Booster: {order.booster_name}</p>
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
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-primary-500">
              R$ {parseFloat(order.final_price || order.price).toFixed(2)}
            </div>
            {order.discount_code && (
              <div className="text-xs text-green-500 mt-1">
                Cupom: {order.discount_code} (-{order.discount_percentage}%)
              </div>
            )}
          </div>
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
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Aceitar
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
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="container py-20">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Shield className="h-8 w-8 text-orange-500" />
            Painel <span className="gamer-gradient bg-clip-text text-transparent">Administrativo</span>
          </h1>
          <p className="text-muted-foreground">Olá, {user.name}! Você tem acesso total ao sistema.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="border-cyan-500/50 hover:bg-cyan-500/10">
            <Link href="/admin-contas">
              Gerenciar Contas
            </Link>
          </Button>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="glass-card border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              Total de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-500">{orders.length}</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-orange-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-orange-500" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-500">{pendingOrders.length}</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
              Aceitos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-500">{acceptedOrders.length}</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4 text-green-500" />
              Concluídos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">{completedOrders.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todos ({orders.length})</TabsTrigger>
          <TabsTrigger value="pending">Pendentes ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="accepted">Aceitos ({acceptedOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Concluídos ({completedOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {orders.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhum pedido cadastrado
              </CardContent>
            </Card>
          ) : (
            orders.map(order => <OrderCard key={order.id} order={order} showActions />)
          )}
        </TabsContent>

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
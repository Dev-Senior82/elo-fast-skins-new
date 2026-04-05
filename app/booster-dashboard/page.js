'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle2, Clock, Trophy, MessageSquare, LogOut } from 'lucide-react'
import { getAllOrders, acceptOrder, completeOrder } from '@/app/actions/boosters'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function BoosterDashboardPage() {
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
    setUser(userData)
    loadOrders()
  }, [])

  const loadOrders = async () => {
    // Carregar TODOS os pedidos para que qualquer booster possa aceitar
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
          <CardTitle className="text-lg">{order.client_name}</CardTitle>
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
          <h1 className="text-3xl font-bold mb-2">
            Olá, <span className="gamer-gradient bg-clip-text text-transparent">{user.name}</span>!
          </h1>
          <p className="text-muted-foreground">{user.rank}</p>
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
              Aceitos
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
          <TabsTrigger value="accepted">Aceitos ({acceptedOrders.length})</TabsTrigger>
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
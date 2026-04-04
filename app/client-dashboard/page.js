'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShoppingBag, MessageSquare, User, LogOut, Gift } from 'lucide-react'
import { getClientOrders } from '@/app/actions/clients'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function ClientDashboardPage() {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const storedUser = localStorage.getItem('client_user')
    if (!storedUser) {
      router.push('/client-login')
      return
    }

    const userData = JSON.parse(storedUser)
    setUser(userData)
    loadOrders(userData.id)
  }, [])

  const loadOrders = async (clientId) => {
    const result = await getClientOrders(clientId)
    if (result.success) {
      setOrders(result.data)
    }
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('client_user')
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

  const pendingOrders = orders.filter(o => o.payment_status === 'pending')
  const paidOrders = orders.filter(o => o.payment_status === 'paid')
  const allOrders = orders

  const OrderCard = ({ order }) => (
    <Card className="glass-card border-primary-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{order.booster_name || 'Aguardando booster'}</CardTitle>
            <CardDescription>
              {order.current_rank} → {order.desired_rank}
            </CardDescription>
          </div>
          <div className="text-right">
            <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
              {order.payment_status === 'pending' && '💳 Aguardando Pagamento'}
              {order.payment_status === 'paid' && '✅ Pago'}
            </Badge>
            <Badge className="mt-2" variant="outline">
              {order.status === 'pending' && '⏳ Pendente'}
              {order.status === 'accepted' && '🎮 Em Andamento'}
              {order.status === 'completed' && '🏆 Concluído'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Valor</p>
            {order.discount_percentage > 0 && (
              <p className="text-sm line-through text-muted-foreground">
                R$ {parseFloat(order.original_price || order.price).toFixed(2)}
              </p>
            )}
            <p className="text-2xl font-bold text-primary-500">
              R$ {parseFloat(order.final_price || order.price).toFixed(2)}
            </p>
            {order.discount_percentage > 0 && (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/50">
                <Gift className="h-3 w-3 mr-1" />
                {order.discount_percentage}% OFF
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date(order.created_at).toLocaleDateString('pt-BR')}
          </div>
        </div>

        <div className="flex gap-2">
          {order.payment_status === 'pending' && (
            <Button
              asChild
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Link href={`/payment/${order.id}`}>
                💳 Pagar Agora
              </Link>
            </Button>
          )}
          {order.payment_status === 'paid' && (
            <Button
              asChild
              variant="outline"
              className="flex-1"
            >
              <Link href={`/order/${order.id}`}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Abrir Chat
              </Link>
            </Button>
          )}
        </div>
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
          <p className="text-muted-foreground">
            {user.email}
          </p>
          {!user.firstPurchaseDiscountUsed && (
            <Badge className="mt-2 bg-green-500/10 text-green-500 border-green-500/50">
              <Gift className="h-3 w-3 mr-1" />
              Você tem 10% OFF na primeira compra!
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            asChild
            variant="outline"
          >
            <Link href="/precos">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Novo Pedido
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass-card border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <ShoppingBag className="h-4 w-4 text-blue-500" />
              Total de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-500">{allOrders.length}</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-orange-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              💳 Aguardando Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-500">{pendingOrders.length}</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              ✅ Pagos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">{paidOrders.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todos ({allOrders.length})</TabsTrigger>
          <TabsTrigger value="pending">Aguardando Pag. ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="paid">Pagos ({paidOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {allOrders.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="py-12 text-center">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl font-semibold mb-2">Nenhum pedido ainda</p>
                <p className="text-muted-foreground mb-6">Faça seu primeiro pedido e comece a subir de elo!</p>
                <Button asChild className="bg-gradient-to-r from-orange-500 to-red-500">
                  <Link href="/precos">Fazer Primeiro Pedido</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            allOrders.map(order => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {pendingOrders.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhum pedido aguardando pagamento
              </CardContent>
            </Card>
          ) : (
            pendingOrders.map(order => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>

        <TabsContent value="paid" className="space-y-4 mt-6">
          {paidOrders.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhum pedido pago ainda
              </CardContent>
            </Card>
          ) : (
            paidOrders.map(order => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

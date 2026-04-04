'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Shield, Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ContasPage() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      const response = await fetch('/api/accounts')
      const result = await response.json()
      if (result.success) {
        setAccounts(result.data)
      }
    } catch (error) {
      console.error('Erro ao carregar contas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-20">
        <div className="text-center">
          <p className="text-muted-foreground">Carregando contas disponíveis...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Contas <span className="gamer-gradient bg-clip-text text-transparent">Premium</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Compre contas já ranqueadas com campeões, skins e BE. Entrega imediata!
        </p>
      </div>

      {/* Grid de Contas */}
      {accounts.length === 0 ? (
        <div className="text-center py-12">
          <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Nenhuma conta disponível no momento.</p>
          <p className="text-sm text-muted-foreground mt-2">Em breve teremos novidades!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <Card key={account.id} className="glass-card border-primary-500/20 hover:border-primary-500/50 transition-all">
              <CardHeader>
                {account.image_url && (
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={account.image_url}
                      alt={account.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary-500" />
                  {account.title}
                </CardTitle>
                <Badge variant="outline" className="w-fit mt-2">
                  {account.rank}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {account.description && (
                  <p className="text-sm text-muted-foreground">{account.description}</p>
                )}
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {account.level && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>Nível {account.level}</span>
                    </div>
                  )}
                  {account.champions_count && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span>{account.champions_count} Campeões</span>
                    </div>
                  )}
                  {account.skins_count && (
                    <div className="text-xs text-muted-foreground">
                      {account.skins_count} Skins
                    </div>
                  )}
                  {account.blue_essence && (
                    <div className="text-xs text-muted-foreground">
                      {account.blue_essence.toLocaleString()} BE
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-6 border-t">
                <div>
                  <p className="text-2xl font-bold text-primary-500">
                    R$ {account.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">Pagamento via PIX</p>
                </div>
                <Button
                  asChild
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white font-bold shadow-lg hover:shadow-cyan-500/50 transition-all hover:scale-105"
                >
                  <Link href={`https://wa.me/5582999646622?text=Olá! Quero comprar a conta: ${encodeURIComponent(account.title)}`} target="_blank">
                    Comprar Agora
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 text-center">
        <Card className="glass-card border-primary-500/20 max-w-2xl mx-auto">
          <CardContent className="p-8">
            <Shield className="h-12 w-12 mx-auto mb-4 text-primary-500" />
            <h3 className="text-2xl font-bold mb-2">Compra 100% Segura</h3>
            <p className="text-muted-foreground mb-4">
              Todas as contas são entregues imediatamente após confirmação do pagamento.
              Suporte 24/7 disponível!
            </p>
            <Button asChild variant="outline">
              <Link href="https://wa.me/5582999646622" target="_blank">
                Falar com Suporte
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

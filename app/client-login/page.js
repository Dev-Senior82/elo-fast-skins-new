'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { LogIn, Mail, Lock } from 'lucide-react'
import { loginClient } from '@/app/actions/clients'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function ClientLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await loginClient(email, password)

    if (result.success) {
      localStorage.setItem('client_user', JSON.stringify(result.data))
      
      toast({
        title: 'Login realizado!',
        description: `Bem-vindo de volta, ${result.data.name}!`,
      })

      router.push('/client-dashboard')
    } else {
      toast({
        title: 'Erro ao fazer login',
        description: result.error,
        variant: 'destructive',
      })
    }

    setLoading(false)
  }

  return (
    <div className="container py-20">
      <div className="max-w-md mx-auto">
        <Card className="glass-card border-primary-500/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary-500/20 flex items-center justify-center">
              <LogIn className="h-8 w-8 text-primary-500" />
            </div>
            <CardTitle className="text-2xl">Login Cliente</CardTitle>
            <CardDescription>
              Entre com suas credenciais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-white/50 dark:bg-black/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 bg-white/50 dark:bg-black/50"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white font-bold"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>

              <div className="text-center text-sm space-y-2">
                <p className="text-muted-foreground">
                  Não tem uma conta?{' '}
                  <Link href="/client-register" className="text-primary-500 hover:underline font-semibold">
                    Criar conta
                  </Link>
                </p>
                <Link href="/" className="text-muted-foreground hover:text-primary-500">
                  Voltar para o início
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

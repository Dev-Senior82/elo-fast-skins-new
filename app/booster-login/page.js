'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Shield, Lock } from 'lucide-react'
import { loginBooster, verifyBoosterSession } from '@/app/actions/boosters'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function BoosterLoginPage() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Verificar se já está logado ao carregar a página
  useEffect(() => {
    const checkExistingSession = async () => {
      const storedUser = localStorage.getItem('booster_user')
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          
          // Verificar se a sessão ainda é válida
          if (userData.session_token) {
            const sessionResult = await verifyBoosterSession(userData.id, userData.session_token)
            if (sessionResult.success) {
              // Sessão válida, redirecionar para dashboard
              localStorage.setItem('booster_user', JSON.stringify(sessionResult.data))
              if (sessionResult.data.is_admin) {
                router.push('/admin-dashboard')
              } else {
                router.push('/booster-dashboard')
              }
              return
            }
          }
          
          // Sessão inválida, limpar
          localStorage.removeItem('booster_user')
        } catch (error) {
          localStorage.removeItem('booster_user')
        }
      }
      setLoading(false)
    }

    checkExistingSession()
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await loginBooster(login, password)

    if (result.success) {
      // Salvar dados do usuário no localStorage com token de sessão
      localStorage.setItem('booster_user', JSON.stringify(result.data))
      
      toast({
        title: 'Login realizado!',
        description: `Bem-vindo, ${result.data.name}!`,
      })

      // Redirecionar para o dashboard apropriado
      if (result.data.is_admin) {
        router.push('/admin-dashboard')
      } else {
        router.push('/booster-dashboard')
      }
    } else {
      toast({
        title: 'Erro ao fazer login',
        description: result.error,
        variant: 'destructive',
      })
      setLoading(false)
    }
  }

  // Mostrar loading enquanto verifica sessão
  if (loading) {
    return (
      <div className="container py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Verificando sessão...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-20">
      <div className="max-w-md mx-auto">
        <Card className="glass-card border-primary-500/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary-500/20 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary-500" />
            </div>
            <CardTitle className="text-2xl">Login do Booster</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar o painel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login">Login</Label>
                <Input
                  id="login"
                  type="text"
                  placeholder="Seu login"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
                  className="bg-white/50 dark:bg-black/50"
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/50 dark:bg-black/50"
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white font-bold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Lock className="h-4 w-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Entrar
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary-500">
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

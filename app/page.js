import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Sparkles, Shield, Zap, TrendingUp, Users, Clock, Star, Lock, Headphones, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getApprovedTestimonials } from './actions/testimonials'
import AnnouncementBanner from '@/components/AnnouncementBanner'

// Lazy load componentes pesados
const TestimonialCarousel = dynamic(() => import('@/components/TestimonialCarousel'), {
  loading: () => <div className="h-64 bg-gray-800/50 animate-pulse rounded-xl" />
})
const TestimonialForm = dynamic(() => import('@/components/TestimonialForm'), {
  loading: () => <div className="h-48 bg-gray-800/50 animate-pulse rounded-xl" />
})
const EloBoostPage = dynamic(() => import('@/components/EloBoostPage'), {
  loading: () => <div className="h-96 bg-gray-800/50 animate-pulse rounded-xl" />
})

// Gerar número fixo de boosters online (evita re-render)
const boostersOnline = 7

export const revalidate = 60 // Cache por 60 segundos

export default async function HomePage() {
  const testimonialsResult = await getApprovedTestimonials()
  const testimonials = testimonialsResult.success ? testimonialsResult.data : []

  return (
    <div className="flex flex-col">
      {/* Banner no Topo */}
      <AnnouncementBanner />
      
      {/* Hero Section - Estilo EloDash com imagem de fundo */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Imagem de fundo do Pantheon */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://customer-assets.emergentagent.com/job_dashboard-150/artifacts/c2e92wvp_image.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Overlay escuro para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40 z-10" />
        
        <div className="container relative z-20 py-20 md:py-32">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left space-y-6">
              {/* Contador de Boosters Online */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/30">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-400 font-semibold text-sm">
                  {boostersOnline} BOOSTERS ONLINE
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
                <span className="text-white">ALCANCE O TOPO</span>
                <br />
                <span className="gamer-gradient bg-clip-text text-transparent">
                  QUE VOCÊ MERECE.
                </span>
              </h1>
              
              <p className="text-lg text-gray-300 max-w-xl">
                Plataforma premium para quem quer resultado com controle.
                <br />
                Boosters high elo verificados, privacidade e suporte de verdade.
              </p>
              
              {/* Stats estilo EloDash */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-orange-500">4.9</span>
                  <div className="flex items-center">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className={`h-4 w-4 ${i <= 4 ? 'fill-orange-500 text-orange-500' : 'fill-orange-500/50 text-orange-500/50'}`} />
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm">AVALIAÇÃO</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {['🎮', '⚔️', '🏆', '🔥'].map((emoji, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-sm border-2 border-black">
                        {emoji}
                      </div>
                    ))}
                  </div>
                  <span className="text-white font-bold">+2K</span>
                  <span className="text-gray-400 text-sm">CLIENTES</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-lg shadow-orange-500/30"
                >
                  <a href="#calculadora">
                    COMEÇAR AGORA
                    <Zap className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 font-semibold text-lg px-8 py-6 rounded-xl"
                >
                  <Link href="/boosters">
                    COMO FUNCIONA
                    <TrendingUp className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              {/* Badges de Garantia */}
              <div className="flex flex-wrap items-center gap-6 pt-8 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>CONTA PROTEGIDA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-blue-500" />
                  <span>PRIVACIDADE</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-purple-500" />
                  <span>SUPORTE ATIVO</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-orange-500" />
                  <span>ENTREGA RÁPIDA</span>
                </div>
              </div>
            </div>

            {/* Card lateral - PDF Ebook */}
            <div className="hidden lg:block flex-shrink-0 w-80">
              <Card className="glass-card border-orange-500/30 bg-black/50 backdrop-blur-xl">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-orange-400 text-sm font-semibold">
                    <Sparkles className="h-4 w-4" />
                    MATERIAL GRATUITO!
                  </div>
                  <h3 className="text-xl font-bold text-white">PDF MID LANER - SLAYVIER1</h3>
                  <p className="text-gray-400 text-sm">
                    Ebook <span className="text-orange-400 font-semibold">Challenger em 3 Passos</span> - Domine a mid lane e suba de elo!
                  </p>
                  <a 
                    href="https://customer-assets.emergentagent.com/job_dashboard-150/artifacts/5loo4vqd_Ebook%20Challenger%20em%203%20passos%20-%20MidLanner%20%281%29%20%281%29.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg transition-all"
                  >
                    BAIXAR GRÁTIS
                    <span>→</span>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Calculadora de Boost */}
      <section className="container py-12" id="calculadora">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Calcule seu <span className="gamer-gradient bg-clip-text text-transparent">Boost</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Use nossa calculadora premium e veja quanto custa alcançar o elo dos seus sonhos!
          </p>
        </div>
        <EloBoostPage showHeader={false} />
      </section>

      {/* Serviços */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nossos <span className="gamer-gradient bg-clip-text text-transparent">Serviços</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Escolha o serviço perfeito para você e comece a subir de elo hoje mesmo!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card border-primary-500/20 hover:border-primary-500/50 transition-all group">
            <CardContent className="p-8 text-center space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-primary-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-2xl font-bold">Elo Boost</h3>
              <p className="text-muted-foreground">
                Nossos boosters jogam na sua conta até o elo desejado com total segurança
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/precos">Ver Preços</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-orange-500/20 hover:border-orange-500/50 transition-all group">
            <CardContent className="p-8 text-center space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold">Duo Boost</h3>
              <p className="text-muted-foreground">
                Jogue junto com um booster profissional e aprenda enquanto sobe de elo
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/precos">Ver Preços</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-red-500/20 hover:border-red-500/50 transition-all group">
            <CardContent className="p-8 text-center space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold">MD5</h3>
              <p className="text-muted-foreground">
                Garanta suas partidas de classificação com os melhores profissionais
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/precos">Ver Preços</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Por que nos <span className="gamer-gradient bg-clip-text text-transparent">Escolher?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <div className="h-16 w-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
              <Shield className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold">100% Seguro</h3>
            <p className="text-muted-foreground">
              VPN exclusiva e modo offline garantem total segurança da sua conta
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="h-16 w-16 mx-auto rounded-full bg-primary-500/20 flex items-center justify-center">
              <Clock className="h-8 w-8 text-primary-500" />
            </div>
            <h3 className="text-xl font-bold">Entrega Rápida</h3>
            <p className="text-muted-foreground">
              Entrega garantida em até 7 dias úteis. Começamos em até 2 horas!
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="h-16 w-16 mx-auto rounded-full bg-orange-500/20 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold">Profissionais</h3>
            <p className="text-muted-foreground">
              Boosters Grão-Mestre+ com alta winrate e experiência comprovada
            </p>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            O que nossos <span className="gamer-gradient bg-clip-text text-transparent">Clientes</span> dizem
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Confira a experiência de quem já alcançou seus objetivos com a gente!
          </p>
        </div>

        <TestimonialCarousel testimonials={testimonials} />
      </section>

      {/* Formulário de Depoimento */}
      <section className="container py-20">
        <div className="max-w-2xl mx-auto">
          <TestimonialForm />
        </div>
      </section>

      {/* Área para Boosters */}
      <section className="container py-20">
        <Card className="glass-card border-primary-500/20 max-w-2xl mx-auto">
          <CardContent className="p-8 text-center space-y-6">
            <div className="h-16 w-16 mx-auto rounded-full bg-primary-500/20 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary-500" />
            </div>
            <h3 className="text-2xl font-bold">Você é um Booster?</h3>
            <p className="text-muted-foreground">
              Faça login para acessar seu painel e gerenciar seus pedidos
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white font-bold"
            >
              <Link href="/booster-login">Fazer Login como Booster</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* CTA Final */}
      <section className="container py-20">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 gamer-gradient opacity-90" />
          <div className="relative px-8 py-20 text-center text-white space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold">
              Pronto para subir de Elo?
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Junte-se a milhares de jogadores satisfeitos e alcance o elo dos seus sonhos hoje mesmo!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary-600 hover:bg-white/90 font-bold text-lg"
              >
                <Link href="/precos">Começar Agora</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Link href="/suporte">Falar com Suporte</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

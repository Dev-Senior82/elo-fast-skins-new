import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, Shield, Zap, TrendingUp, Users, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import TestimonialForm from '@/components/TestimonialForm'
import { getApprovedTestimonials } from './actions/testimonials'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const testimonialsResult = await getApprovedTestimonials()
  const testimonials = testimonialsResult.success ? testimonialsResult.data : []

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gamer-gradient opacity-10" />
        <div className="container relative py-20 md:py-32">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left space-y-6">
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-medium">
                  <Sparkles className="h-4 w-4" />
                  #1 em Elo Job no Brasil
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Alcance o Elo dos{' '}
                <span className="gamer-gradient bg-clip-text text-transparent">
                  Seus Sonhos
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                Boosters profissionais, segurança garantida e suporte 24/7. 
                Transforme seu jogo com os melhores do Brasil!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg"
                >
                  <Link href="/precos">Contratar Agora</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-500/50 hover:bg-primary-500/10"
                >
                  <Link href="/boosters">Conheça os Boosters</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-500">983+</p>
                  <p className="text-sm text-muted-foreground">Clientes</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-500">6 dias</p>
                  <p className="text-sm text-muted-foreground">Entrega</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-500">24/7</p>
                  <p className="text-sm text-muted-foreground">Suporte</p>
                </div>
              </div>
            </div>

            <div className="flex-1 flex justify-center items-center">
              <div className="relative">
                <video
                  src="https://customer-assets.emergentagent.com/job_league-boost-hub/artifacts/yt3mvasc_animation_running_slide_1529929f-7a71-4ff9-83ac-94396971c68c_75164d3f-527c-41fb-8b35-348dd86be3fb.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full max-w-xl drop-shadow-2xl"
                  style={{
                    filter: 'drop-shadow(0 0 40px rgba(255, 94, 77, 0.4))',
                    mixBlendMode: 'screen'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
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
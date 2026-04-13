import Link from 'next/link'
import { ArrowLeft, Sparkles, Shield, Zap, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import ValorantCalculatorPro from '@/components/ValorantCalculatorPro'

export default function ValorantPage() {
  return (
    <div className="container py-20">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Link>
      </Button>

      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-block mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Valorant Elo Job
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Suba de Elo no{' '}
          <span className="gamer-gradient bg-clip-text text-transparent">
            Valorant
          </span>
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Boosters profissionais, entrega em até 7 dias, pagamento via PIX com confirmação automática!
        </p>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 relative">
        {/* Calculadora */}
        <div className="lg:col-span-2">
          <ValorantCalculatorPro />
        </div>

        {/* Imagem da Jett */}
        <div className="hidden lg:flex items-center justify-center relative">
          <img 
            src="https://customer-assets.emergentagent.com/job_league-boost-hub/artifacts/oxdqn643_jett.png"
            alt="Jett - Valorant"
            className="w-full max-w-md h-auto"
            style={{ 
              filter: 'drop-shadow(0 0 40px rgba(255, 70, 85, 0.6))',
              transform: 'scale(1.1)'
            }}
          />
        </div>
      </div>

      {/* Tabela de Preços */}
      <Card className="glass-card mb-8">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Tabela de Preços</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { tier: 'Ferro', ranks: ['Ferro 1: R$ 4', 'Ferro 2: R$ 5', 'Ferro 3: R$ 6'] },
              { tier: 'Bronze', ranks: ['Bronze 1: R$ 4', 'Bronze 2: R$ 5', 'Bronze 3: R$ 6'] },
              { tier: 'Prata', ranks: ['Prata 1: R$ 7', 'Prata 2: R$ 8', 'Prata 3: R$ 8'] },
              { tier: 'Ouro', ranks: ['Ouro 1: R$ 12', 'Ouro 2: R$ 13', 'Ouro 3: R$ 15'] },
              { tier: 'Platina', ranks: ['Platina 1: R$ 15', 'Platina 2: R$ 17', 'Platina 3: R$ 19'] },
              { tier: 'Diamante', ranks: ['Diamante 1: R$ 28', 'Diamante 2: R$ 31', 'Diamante 3: R$ 34'] },
              { tier: 'Ascendente', ranks: ['Ascendente 1: R$ 39', 'Ascendente 2: R$ 43', 'Ascendente 3: R$ 48'] },
              { tier: 'Imortal', ranks: ['Imortal 1: R$ 64', 'Imortal 2: R$ 71', 'Imortal 3: R$ 78'] },
            ].map((group) => (
              <div key={group.tier} className="bg-primary-500/5 rounded-lg p-4">
                <h3 className="font-bold mb-2 text-red-500">{group.tier}</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {group.ranks.map((rank, i) => (
                    <li key={i}>{rank}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="glass-card">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-6">Perguntas Frequentes</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-2">Como funciona o Elo Job?</h3>
              <p className="text-sm text-muted-foreground">
                Você faz o pedido, paga via PIX, e nosso booster profissional entra na sua conta para subir o elo. Você acompanha tudo pelo chat!
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">É seguro?</h3>
              <p className="text-sm text-muted-foreground">
                Sim! Usamos VPN e técnicas para evitar detecção. Nenhum cliente foi banido até hoje.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Quanto tempo demora?</h3>
              <p className="text-sm text-muted-foreground">
                Em média 3-7 dias dependendo do número de elos. Boosters dedicados trabalham diariamente.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Posso escolher o booster?</h3>
              <p className="text-sm text-muted-foreground">
                O booster é selecionado manualmente pela nossa equipe baseado em disponibilidade e especialização.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

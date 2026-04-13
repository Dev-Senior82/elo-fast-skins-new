'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Trophy, TrendingUp, Zap } from 'lucide-react'
import Image from 'next/image'

export default function LiveBoostTracking() {
  const [progress, setProgress] = useState(67)
  const [wins, setWins] = useState(36)
  const [losses, setLosses] = useState(6)

  // Simular progresso em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 2
        return newProgress >= 100 ? 100 : newProgress
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const winRate = Math.round((wins / (wins + losses)) * 100)

  const recentMatches = [
    { champ: 'Irelia', kda: '16/3/10', result: 'win', lp: '+23', time: '3m' },
    { champ: 'Zed', kda: '12/4/9', result: 'win', lp: '+19', time: '28m' },
    { champ: 'Jinx', kda: '14/2/8', result: 'win', lp: '+24', time: '52m' },
  ]

  return (
    <section id="tracking" className="container py-20">
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30">
          🔴 ACOMPANHAMENTO AO VIVO
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Acompanhe seu boost em{' '}
          <span className="gamer-gradient bg-clip-text text-transparent">tempo real</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Cada partida, cada PDL, cada vitória — ao vivo no seu painel.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 text-center glass-card border-orange-500/20">
          <div className="text-4xl font-bold text-orange-500 mb-2">2.000+</div>
          <div className="text-sm text-muted-foreground">Pedidos Concluídos</div>
        </Card>
        <Card className="p-6 text-center glass-card border-primary-500/20">
          <div className="text-4xl font-bold text-primary-500 mb-2">80+</div>
          <div className="text-sm text-muted-foreground">Boosters Ativos</div>
        </Card>
        <Card className="p-6 text-center glass-card border-green-500/20">
          <div className="text-4xl font-bold text-green-500 mb-2">{winRate}%</div>
          <div className="text-sm text-muted-foreground">Win Rate Médio</div>
        </Card>
      </div>

      <Card className="glass-card border-primary-500/20 overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Pedido #38291 · Elo Boost · Solo</h3>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Em Andamento
              </Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src="https://lolg-cdn.porofessor.gg/img/s/league-icons-v3/160/7.png"
                  alt="Diamante"
                  width={64}
                  height={64}
                  className="rounded-lg"
                />
                <div>
                  <div className="text-sm text-muted-foreground">Rank Atual</div>
                  <div className="text-xl font-bold">Diamante IV</div>
                </div>
              </div>

              <TrendingUp className="h-6 w-6 text-orange-500 mx-auto my-4" />

              <div className="flex items-center gap-4">
                <Image
                  src="https://lolg-cdn.porofessor.gg/img/s/league-icons-v3/160/10.png"
                  alt="Challenger"
                  width={64}
                  height={64}
                  className="rounded-lg"
                />
                <div>
                  <div className="text-sm text-muted-foreground">Objetivo</div>
                  <div className="text-xl font-bold">Challenger</div>
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-bold">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="text-2xl font-bold text-green-400">{wins}V</div>
                    <div className="text-xs text-muted-foreground">Vitórias</div>
                  </div>
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="text-2xl font-bold text-red-400">{losses}D</div>
                    <div className="text-xs text-muted-foreground">Derrotas</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary-500/10 border border-primary-500/20">
                  <div className="text-sm text-muted-foreground mb-1">Win Rate</div>
                  <div className="text-3xl font-bold text-primary-500">{winRate}%</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              Partidas Recentes
            </h4>
            <div className="space-y-2">
              {recentMatches.map((match, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/20"
                >
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-bold">{match.champ}</div>
                      <div className="text-xs text-muted-foreground">{match.kda}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-400">{match.lp}</div>
                    <div className="text-xs text-muted-foreground">{match.time} atrás</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}

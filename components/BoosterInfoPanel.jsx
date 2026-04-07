'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Zap } from 'lucide-react'
import { BOOSTER_CHAMPIONS, generateBoosterStats } from '@/lib/constants'

export default function BoosterInfoPanel({ booster }) {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (booster) {
      // Gerar stats aleatórias quando booster mudar
      setStats(generateBoosterStats())
    }
  }, [booster])

  if (!booster || !stats) return null

  // Pegar campeão do booster (fallback para Talon se não existir)
  const champion = BOOSTER_CHAMPIONS[booster.name] || BOOSTER_CHAMPIONS['Talon']

  return (
    <Card className="glass-card border-primary-500/20 animate-slide-in">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-orange-500" />
          Info do Booster
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Imagem do Campeão com Hover Effect */}
        <div className="relative group">
          <div className="overflow-hidden rounded-lg border-2 border-primary-500/30">
            <img
              src={champion.image}
              alt={champion.name}
              className="w-full h-48 object-cover object-top transition-transform duration-300 ease-in-out group-hover:scale-110"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg pointer-events-none" />
          <div className="absolute bottom-2 left-2 right-2">
            <p className="text-white font-bold text-xl drop-shadow-lg">
              {champion.name}
            </p>
          </div>
        </div>

        {/* Stats do Booster */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-500/20">
            <span className="text-sm font-medium text-muted-foreground">BOOSTER:</span>
            <span className="font-bold text-primary-500">{booster.name.toUpperCase()}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <span className="text-sm font-medium text-muted-foreground">Jogos:</span>
            <span className="font-bold text-blue-500">{stats.games}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded-lg bg-green-500/10">
              <span className="text-sm font-medium text-muted-foreground">
                <Zap className="h-3 w-3 inline mr-1" />
                Win Rate Solo:
              </span>
              <Badge className="bg-green-500">{stats.soloWinRate}%</Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-orange-500/10">
              <span className="text-sm font-medium text-muted-foreground">
                <Trophy className="h-3 w-3 inline mr-1" />
                Win Rate Duo:
              </span>
              <Badge className="bg-orange-500">{stats.duoWinRate}%</Badge>
            </div>
          </div>
        </div>

        {/* Rating do Booster */}
        <div className="flex items-center justify-center gap-1 pt-2">
          {Array.from({ length: booster.rating }).map((_, i) => (
            <Trophy key={i} className="h-4 w-4 fill-orange-500 text-orange-500" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

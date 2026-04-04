'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Sword } from 'lucide-react'

export default function BoosterCard({ booster }) {
  const { name, avatar, winrate, specialty, rank, gamesPlayed } = booster

  return (
    <Card className="glass-card hover:scale-105 transition-all duration-300 border-orange-500/20 overflow-hidden group">
      <div className="h-32 gamer-gradient relative">
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-900">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-primary-500 to-orange-500 text-white">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <CardContent className="pt-16 pb-6 text-center space-y-4">
        <div>
          <h3 className="font-bold text-xl mb-1">{name}</h3>
          <Badge variant="outline" className="font-semibold">
            {rank}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <TrendingUp className="h-5 w-5 text-green-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {winrate}%
            </p>
            <p className="text-xs text-muted-foreground">Winrate</p>
          </div>
          
          <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-3">
            <Sword className="h-5 w-5 text-primary-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {gamesPlayed}
            </p>
            <p className="text-xs text-muted-foreground">Jogos</p>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
            Especialidade: {specialty}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
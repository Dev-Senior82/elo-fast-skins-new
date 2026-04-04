'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, TrendingUp } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function ServiceHistoryCard({ service }) {
  const { clientName, fromElo, toElo, completedAt, duration, boosterName } = service

  return (
    <Card className="glass-card hover:border-green-500/50 transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h4 className="font-bold text-lg">{clientName}</h4>
              <p className="text-xs text-muted-foreground">
                Concluído {formatDistanceToNow(new Date(completedAt), { addSuffix: true, locale: ptBR })}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400">
            Completo
          </Badge>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 text-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm font-bold">{fromElo}</p>
            <p className="text-xs text-muted-foreground">Início</p>
          </div>
          
          <TrendingUp className="h-6 w-6 text-orange-500" />
          
          <div className="flex-1 text-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm font-bold">{toElo}</p>
            <p className="text-xs text-muted-foreground">Final</p>
          </div>
        </div>

        <div className="flex justify-between text-sm text-muted-foreground pt-3 border-t border-border">
          <span>Booster: <span className="font-medium text-foreground">{boosterName}</span></span>
          <span>Duração: <span className="font-medium text-foreground">{duration}</span></span>
        </div>
      </CardContent>
    </Card>
  )
}
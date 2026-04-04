import ServiceHistoryCard from '@/components/ServiceHistoryCard'
import { History } from 'lucide-react'

export const metadata = {
  title: 'Histórico de Serviços - Elo Fast Skins',
  description: 'Confira os últimos serviços de elo boost concluídos com sucesso.',
}

const completedServices = [
  {
    clientName: 'xProwlerBR',
    fromElo: 'Prata II',
    toElo: 'Ouro IV',
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    duration: '3 dias',
    boosterName: 'FoxMaster',
  },
  {
    clientName: 'MidLaneQueen',
    fromElo: 'Ouro III',
    toElo: 'Platina IV',
    completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    duration: '5 dias',
    boosterName: 'BlazeFury',
  },
  {
    clientName: 'luska',
    fromElo: 'Bronze I',
    toElo: 'Prata IV',
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    duration: '2 dias',
    boosterName: 'ShadowNinja',
  },
  {
    clientName: 'settaodamassa',
    fromElo: 'Platina II',
    toElo: 'Esmeralda IV',
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    duration: '6 dias',
    boosterName: 'ThunderStrike',
  },
  {
    clientName: 'NoxiianTop',
    fromElo: 'Ferro IV',
    toElo: 'Bronze II',
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    duration: '2 dias',
    boosterName: 'PhoenixRise',
  },
  {
    clientName: 'caiozera',
    fromElo: 'Ouro I',
    toElo: 'Platina II',
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    duration: '4 dias',
    boosterName: 'IceDragon',
  },
  {
    clientName: 'Will',
    fromElo: 'Prata IV',
    toElo: 'Ouro II',
    completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    duration: '5 dias',
    boosterName: 'FoxMaster',
  },
  {
    clientName: 'SupGodBR',
    fromElo: 'Esmeralda III',
    toElo: 'Diamante IV',
    completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    duration: '8 dias',
    boosterName: 'BlazeFury',
  },
  {
    clientName: 'ZedMainzin',
    fromElo: 'Bronze III',
    toElo: 'Prata I',
    completedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    duration: '4 dias',
    boosterName: 'ShadowNinja',
  },
]

export default function HistoricoPage() {
  return (
    <div className="container py-20">
      <div className="text-center mb-12">
        <div className="inline-block mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm font-medium">
            <History className="h-4 w-4" />
            Serviços Recentes
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Histórico de <span className="gamer-gradient bg-clip-text text-transparent">Serviços</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Confira os últimos boosts concluídos com sucesso por nossa equipe
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {completedServices.map((service, index) => (
          <ServiceHistoryCard key={index} service={service} />
        ))}
      </div>

      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-8 glass-card p-8 rounded-2xl">
          <div>
            <p className="text-4xl font-bold text-primary-500">5000+</p>
            <p className="text-sm text-muted-foreground">Serviços Concluídos</p>
          </div>
          <div className="h-12 w-px bg-border" />
          <div>
            <p className="text-4xl font-bold text-green-500">98%</p>
            <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
          </div>
          <div className="h-12 w-px bg-border" />
          <div>
            <p className="text-4xl font-bold text-orange-500">4.9/5</p>
            <p className="text-sm text-muted-foreground">Avaliação Média</p>
          </div>
        </div>
      </div>
    </div>
  )
}
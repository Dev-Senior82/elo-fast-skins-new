import BoosterCard from '@/components/BoosterCard'
import { Trophy } from 'lucide-react'

export const metadata = {
  title: 'Nossos Boosters - Elo Fast Skins',
  description: 'Conheça os melhores boosters de League of Legends do Brasil.',
}

const boosters = [
  {
    name: 'BOOSTER TALON',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Talon_0.jpg',
    winrate: 89,
    specialty: 'Mid/Jungle',
    rank: 'Grão-Mestre',
    gamesPlayed: 387,
  },
  {
    name: 'BOOSTER KATARINA',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Katarina_0.jpg',
    winrate: 86,
    specialty: 'Mid',
    rank: 'Mestre',
    gamesPlayed: 412,
  },
  {
    name: 'BOOSTER NIDALEE',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Nidalee_0.jpg',
    winrate: 91,
    specialty: 'Jungle',
    rank: 'Desafiante',
    gamesPlayed: 456,
  },
  {
    name: 'BOOSTER AMBESSA',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ambessa_0.jpg',
    winrate: 90,
    specialty: 'Top',
    rank: 'Desafiante',
    gamesPlayed: 321,
  },
  {
    name: 'BOOSTER JAYCE',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jayce_0.jpg',
    winrate: 85,
    specialty: 'Top/Mid',
    rank: 'Mestre',
    gamesPlayed: 289,
  },
  {
    name: 'BOOSTER EKKO',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ekko_0.jpg',
    winrate: 92,
    specialty: 'Mid/Jungle',
    rank: 'Desafiante',
    gamesPlayed: 478,
  },
  {
    name: 'BOOSTER LULU',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lulu_0.jpg',
    winrate: 87,
    specialty: 'Support',
    rank: 'Mestre',
    gamesPlayed: 342,
  },
  {
    name: 'BOOSTER QIYANA',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Qiyana_0.jpg',
    winrate: 88,
    specialty: 'Mid/Jungle',
    rank: 'Grão-Mestre',
    gamesPlayed: 365,
  },
  {
    name: 'BOOSTER SYNDRA',
    avatar: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Syndra_0.jpg',
    winrate: 89,
    specialty: 'Mid',
    rank: 'Grão-Mestre',
    gamesPlayed: 401,
  },
]

export default function BoostersPage() {
  return (
    <div className="container py-20">
      <div className="text-center mb-12">
        <div className="inline-block mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-medium">
            <Trophy className="h-4 w-4" />
            Melhores da Semana
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Nossos <span className="gamer-gradient bg-clip-text text-transparent">Boosters</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Conheça os profissionais que vão te ajudar a alcançar seus objetivos no League of Legends
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {boosters.map((booster, index) => (
          <BoosterCard key={index} booster={booster} />
        ))}
      </div>

      <div className="mt-16 max-w-3xl mx-auto">
        <div className="glass-card p-8 rounded-2xl text-center space-y-4">
          <h2 className="text-2xl font-bold">Quer se tornar um Booster?</h2>
          <p className="text-muted-foreground">
            Estamos sempre em busca de jogadores talentosos para se juntar à nossa equipe.
            Se você é Diamante+ e tem alta winrate, entre em contato!
          </p>
          <a
            href={`https://wa.me/5582999646622?text=${encodeURIComponent('Olá! Gostaria de me candidatar para ser um Booster.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg transition-all"
          >
            Candidatar-se Agora
          </a>
        </div>
      </div>
    </div>
  )
}
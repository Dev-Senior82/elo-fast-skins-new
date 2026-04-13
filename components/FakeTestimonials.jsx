'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'gabezin',
    rank: 'Diamante II',
    service: 'Elo Boost',
    comment: 'Joga muuuito, carregou o time, serviço 100%',
    rating: 5,
    avatar: 'https://ddragon.leagueoflegends.com/cdn/16.7.1/img/profileicon/6895.png',
    booster: 'Qiyana'
  },
  {
    name: 'luska',
    rank: 'Platina IV',
    service: 'Duo Boost',
    comment: 'O cara é muito bom, aprendi demais jogando com ele',
    rating: 5,
    avatar: 'https://ddragon.leagueoflegends.com/cdn/16.7.1/img/profileicon/713.png',
    booster: 'Zed'
  },
  {
    name: 'guizera',
    rank: 'Esmeralda III',
    service: 'Vitórias',
    comment: 'Uso e recomendo, muito profissional',
    rating: 5,
    avatar: 'https://ddragon.leagueoflegends.com/cdn/16.7.1/img/profileicon/5945.png',
    booster: 'Akali'
  },
  {
    name: 'aartrox',
    rank: 'Ouro I',
    service: 'Elo Boost',
    comment: 'Gente boa e joga muito, recomendo demais',
    rating: 5,
    avatar: 'https://ddragon.leagueoflegends.com/cdn/16.7.1/img/profileicon/577.png',
    booster: 'Aatrox'
  },
  {
    name: 'mainsett',
    rank: 'Prata II',
    service: 'Duo Boost',
    comment: 'Esse cara de Sett é literalmente o melhor',
    rating: 5,
    avatar: 'https://ddragon.leagueoflegends.com/cdn/16.7.1/img/profileicon/608.png',
    booster: 'Sett'
  },
  {
    name: 'jhinzera',
    rank: 'Diamante I',
    service: 'Vitórias',
    comment: 'Excelente jogador, fez o trabalho com agilidade!',
    rating: 5,
    avatar: 'https://ddragon.leagueoflegends.com/cdn/16.7.1/img/profileicon/7120.png',
    booster: 'Jhin'
  },
]

export default function FakeTestimonials() {
  return (
    <section className="container py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Feedback{' '}
          <span className="gamer-gradient bg-clip-text text-transparent">Real.</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          4.9/5 · 2.000+ avaliações de clientes reais
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="glass-card border-primary-500/20 hover:border-primary-500/40 transition-all">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={testimonial.avatar} />
                  <AvatarFallback>{testimonial.name[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.rank} · {testimonial.service}</div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-orange-500 text-orange-500" />
                  ))}
                </div>
              </div>

              <p className="text-sm mb-4 italic">"{testimonial.comment}"</p>

              <div className="text-xs text-muted-foreground">
                Atendido por <span className="text-primary-500 font-semibold">Booster {testimonial.booster}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

import { Sparkles, Trophy } from 'lucide-react'
import PriceCalculatorNew from '@/components/PriceCalculatorNew'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata = {
  title: 'Preços - Elo Fast Skins',
  description: 'Confira nossos preços de Elo Boost, Duo Boost e MD10. Calcule seu boost personalizado.',
}

export default function PrecosPage() {
  return (
    <div className="container py-20">
      <div className="text-center mb-12">
        <div className="inline-block mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Preços Transparentes
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Nossos <span className="gamer-gradient bg-clip-text text-transparent">Preços</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Escolha o serviço ideal e calcule o preço do seu boost personalizado
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Calculadora */}
        <PriceCalculatorNew />

        {/* Tipos de Serviço */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card border-primary-500/20">
            <CardHeader>
              <CardTitle className="text-xl">Elo Boost</CardTitle>
              <CardDescription>Serviço clássico e rápido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold text-primary-500">Desde R$ 4,25</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✅ Entrega em até 7 dias</li>
                <li>✅ Modo offline</li>
                <li>✅ VPN exclusiva</li>
                <li>✅ Suporte 24/7</li>
                <li>✅ Garantia de elo</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card border-orange-500/20 relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500">
              Mais Popular
            </Badge>
            <CardHeader>
              <CardTitle className="text-xl">Duo Boost</CardTitle>
              <CardDescription>Jogue e aprenda junto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold text-orange-500">Desde R$ 5,95</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✅ Jogue com o booster</li>
                <li>✅ Aprenda estratégias</li>
                <li>✅ Melhore suas skills</li>
                <li>✅ Diversão garantida</li>
                <li>✅ Comunicação Discord</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card border-red-500/20">
            <CardHeader>
              <CardTitle className="text-xl">MD5</CardTitle>
              <CardDescription>Classificatórias</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold text-red-500">R$ 25,00</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✅ 5 partidas ranqueadas</li>
                <li>✅ Disponível em todos elos</li>
                <li>✅ Boosters experientes</li>
                <li>✅ Alta winrate</li>
                <li>✅ Garantia de qualidade</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Elos Mais Altos */}
        <Card className="glass-card border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Trophy className="h-6 w-6 text-purple-500" />
              Elos Mais Altos (por vitória)
            </CardTitle>
            <CardDescription>
              Valores especiais para elos avançados - Solo apenas (com desconto de 15%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">💎 Mestre</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">R$ 29,75</p>
                <p className="text-xs text-muted-foreground mt-1">por vitória</p>
              </div>
              <div className="text-center p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">🏆 Grão Mestre</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">R$ 42,50</p>
                <p className="text-xs text-muted-foreground mt-1">por vitória</p>
              </div>
              <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">⭐ Challenger</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">R$ 59,50</p>
                <p className="text-xs text-muted-foreground mt-1">por vitória</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vantagens Exclusivas */}
        <Card className="glass-card border-green-500/20">
          <CardHeader>
            <CardTitle className="text-2xl">⚡ Vantagens Exclusivas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✅</span>
                  <span>Suba de elo sem esforço</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✅</span>
                  <span>Serviço rápido e confiável</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✅</span>
                  <span>Jogue ao lado dos melhores jogadores do Brasil</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✅</span>
                  <span>Entrega garantida em até 7 dias úteis</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-4">
                <h4 className="font-bold text-orange-600 dark:text-orange-400 mb-3">🎁 Bônus Especial</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">🎓</span>
                    <span>Compras acima de R$ 100 ganham <strong>1 coach gratuito</strong> na lane de sua preferência</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">📺</span>
                    <span>Acesso às partidas ao vivo pelas nossas plataformas de transmissão</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>⚠️ Informações Importantes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-bold text-foreground mb-2">🛡️ Segurança</h4>
              <p>
                Todos os nossos boosters utilizam VPN exclusiva e jogam em modo offline para
                garantir total segurança da sua conta.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-2">⏱️ Tempo de Entrega</h4>
              <p>
                ✅ <strong>Entrega garantida em até 7 dias úteis.</strong> O tempo pode variar de acordo com o elo e quantidade de divisões.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-2">💳 Formas de Pagamento</h4>
              <p>
                Aceitamos PIX, cartão de crédito e criptomoedas. Pagamento 100% seguro.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-2">🎯 Garantia</h4>
              <p>
                Se você perder o elo conquistado em até 7 dias, fazemos o boost novamente
                gratuitamente.
              </p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">⚠️ Atenção Importante</h4>
              <ul className="space-y-2">
                <li>
                  <strong>Durante o boost, evite logar na conta</strong> para não comprometer o processo.
                </li>
                <li>
                  <strong>Não nos responsabilizamos</strong> por partidas jogadas pelo cliente durante o período do boost.
                </li>
              </ul>
            </div>
            <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4">
              <h4 className="font-bold text-primary-600 dark:text-primary-400 mb-2">👉 Informe no Pedido</h4>
              <p>
                Para melhor resultado, nos informe: <strong>seus horários disponíveis, campeões principais e lane de preferência.</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
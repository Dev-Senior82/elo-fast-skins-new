'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, ChevronUp, Search, MessageCircle } from 'lucide-react'

const faqs = [
  {
    category: 'Geral',
    questions: [
      {
        question: 'O que é Elo Job?',
        answer: 'Elo Job é um serviço onde jogadores profissionais (boosters) jogam em sua conta para elevar seu ranking no League of Legends.'
      },
      {
        question: 'É seguro?',
        answer: 'Sim! Nossos boosters são profissionais verificados. Recomendamos não jogar durante o boost para evitar problemas.'
      },
      {
        question: 'Quanto tempo demora?',
        answer: 'Geralmente entre 3-7 dias, dependendo do elo atual e desejado. Você pode acompanhar o progresso pelo chat.'
      }
    ]
  },
  {
    category: 'Pagamento',
    questions: [
      {
        question: 'Quais formas de pagamento?',
        answer: 'Aceitamos PIX! Após criar seu pedido, você receberá o QR Code e a chave PIX para pagamento.'
      },
      {
        question: 'Tenho desconto na primeira compra?',
        answer: 'Sim! Todo cliente novo tem 10% OFF na primeira compra automaticamente!'
      },
      {
        question: 'Como usar código de desconto?',
        answer: 'Na hora de calcular o preço, você pode inserir seu código de desconto no campo específico. Códigos são divulgados no nosso Discord!'
      }
    ]
  },
  {
    category: 'Conta e Pedidos',
    questions: [
      {
        question: 'Preciso criar uma conta?',
        answer: 'Sim! Criando uma conta você pode acompanhar todos os seus pedidos, acessar o histórico e conversar com o booster.'
      },
      {
        question: 'Como acompanho meu pedido?',
        answer: 'Entre no seu dashboard de cliente e veja todos os seus pedidos. Você pode abrir o chat com o booster a qualquer momento!'
      },
      {
        question: 'Posso escolher o booster?',
        answer: 'Sim! Na calculadora de preços, você pode escolher entre nossos boosters disponíveis. Cada um tem rank e avaliação.'
      }
    ]
  },
  {
    category: 'Serviço',
    questions: [
      {
        question: 'Diferença entre Solo e Duo?',
        answer: 'Solo: O booster joga sozinho na sua conta. Duo: Você joga junto com o booster (adicional de 30%).'
      },
      {
        question: 'Posso jogar durante o boost?',
        answer: 'Não é recomendado jogar Ranked durante o serviço. Você pode jogar ARAM ou Normal, mas avise o booster no chat.'
      },
      {
        question: 'E se eu perder elo durante o boost?',
        answer: 'Não se preocupe! O booster garante o elo contratado. Se houver derrotas, ele continua até atingir o objetivo.'
      }
    ]
  }
]

export default function FAQChatbot() {
  const [searchTerm, setSearchTerm] = useState('')
  const [openIndex, setOpenIndex] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('Todos')

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category =>
    selectedCategory === 'Todos' || category.category === selectedCategory
  ).filter(category => category.questions.length > 0)

  const categories = ['Todos', ...faqs.map(f => f.category)]

  return (
    <div className="space-y-6">
      <Card className="glass-card border-primary-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <MessageCircle className="h-6 w-6 text-primary-500" />
            Perguntas Frequentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Busque sua dúvida..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 dark:bg-black/50"
            />
          </div>

          {/* Categorias */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? 'bg-primary-500' : ''}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Perguntas */}
          <div className="space-y-2">
            {filteredFAQs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma pergunta encontrada. Entre em contato no WhatsApp!
              </p>
            ) : (
              filteredFAQs.map((category, catIndex) => (
                <div key={catIndex} className="space-y-2">
                  <h3 className="font-semibold text-lg mt-4 mb-2">{category.category}</h3>
                  {category.questions.map((faq, qIndex) => {
                    const globalIndex = `${catIndex}-${qIndex}`
                    const isOpen = openIndex === globalIndex
                    
                    return (
                      <Card
                        key={qIndex}
                        className="cursor-pointer hover:border-primary-500/50 transition-colors"
                        onClick={() => toggleQuestion(globalIndex)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-semibold text-primary-500">{faq.question}</p>
                              {isOpen && (
                                <p className="text-muted-foreground mt-2 text-sm">
                                  {faq.answer}
                                </p>
                              )}
                            </div>
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ))
            )}
          </div>

          {/* Contato */}
          <Card className="bg-primary-500/10 border-primary-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-sm mb-2">Não encontrou sua resposta?</p>
              <Button
                asChild
                className="bg-green-500 hover:bg-green-600"
              >
                <a
                  href="https://wa.me/5582999646622"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  💬 Falar no WhatsApp
                </a>
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

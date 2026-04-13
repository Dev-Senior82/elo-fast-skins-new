'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { MessageCircle } from 'lucide-react'

export default function LiveChatFake() {
  const [messages, setMessages] = useState([])
  const [typingBooster, setTypingBooster] = useState(false)
  const hasRunRef = useRef(false)

  const chatMessages = [
    { sender: 'booster', text: 'Acabei de iniciar seu serviço! 🎮', delay: 1000 },
    { sender: 'client', text: 'Show! Boa sorte!', delay: 2500 },
    { sender: 'booster', text: 'Acabei de ganhar a primeira partida 🔥', delay: 4500 },
    { sender: 'booster', text: 'Estamos quase no elo desejado!', delay: 6500 },
    { sender: 'client', text: 'Você joga muito! Obrigado 💪', delay: 8000 },
  ]

  useEffect(() => {
    // Prevenir duplicação no React Strict Mode
    if (hasRunRef.current) return
    hasRunRef.current = true

    chatMessages.forEach((msg, index) => {
      setTimeout(() => {
        if (msg.sender === 'booster') {
          setTypingBooster(true)
          setTimeout(() => {
            setTypingBooster(false)
            setMessages((prev) => [...prev, msg])
          }, 1500)
        } else {
          setMessages((prev) => [...prev, msg])
        }
      }, msg.delay)
    })
  }, [])

  return (
    <section className="container py-20">
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30">
          💬 CHAT AO VIVO
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Converse com seu{' '}
          <span className="gamer-gradient bg-clip-text text-transparent">Booster</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Acompanhe o progresso em tempo real e tire dúvidas diretamente com o profissional.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto glass-card border-primary-500/20 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-500/20 to-orange-500/20 p-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
            <span className="font-bold">Booster Qiyana</span>
            <Badge className="ml-auto bg-green-500/20 text-green-400 border-green-500/30 text-xs">
              Online
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 animate-in slide-in-from-bottom-2 ${msg.sender === 'client' ? 'flex-row-reverse' : ''}`}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={msg.sender === 'booster'
                    ? 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Qiyana_0.jpg'
                    : 'https://ddragon.leagueoflegends.com/cdn/16.7.1/img/profileicon/29.png'
                  }
                />
                <AvatarFallback>{msg.sender === 'booster' ? 'Q' : 'C'}</AvatarFallback>
              </Avatar>
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  msg.sender === 'booster'
                    ? 'bg-primary-500/20 border border-primary-500/30'
                    : 'bg-muted/50 border border-border/40'
                }`}
              >
                <div className="text-xs text-muted-foreground mb-1">
                  {msg.sender === 'booster' ? 'Booster Qiyana' : 'Você'}
                </div>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}

          {typingBooster && (
            <div className="flex gap-3 animate-in slide-in-from-bottom-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Qiyana_0.jpg" />
                <AvatarFallback>Q</AvatarFallback>
              </Avatar>
              <div className="max-w-xs p-3 rounded-lg bg-primary-500/20 border border-primary-500/30">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-primary-500 animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="h-2 w-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border/40 bg-muted/20">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            Conversa em tempo real com seu booster...
          </div>
        </div>
      </Card>
    </section>
  )
}

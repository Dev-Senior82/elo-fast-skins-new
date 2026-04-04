'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { submitTestimonial } from '@/app/actions/testimonials'
import { useToast } from '@/hooks/use-toast'

export default function TestimonialForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target)
    const data = {
      clientName: formData.get('clientName'),
      serviceType: formData.get('serviceType'),
      rating: rating,
      comment: formData.get('comment'),
      avatarUrl: formData.get('avatarUrl') || null,
    }

    const result = await submitTestimonial(data)

    if (result.success) {
      toast({
        title: '✅ Sucesso!',
        description: result.message,
      })
      e.target.reset()
      setRating(5)
    } else {
      toast({
        title: '❌ Erro',
        description: result.error,
        variant: 'destructive',
      })
    }

    setLoading(false)
  }

  return (
    <Card className="glass-card border-orange-500/20">
      <CardHeader>
        <CardTitle className="text-2xl gamer-gradient bg-clip-text text-transparent">
          Deixe seu Depoimento
        </CardTitle>
        <CardDescription>
          Compartilhe sua experiência com nossos serviços de Elo Boost
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Seu Nome *</Label>
            <Input
              id="clientName"
              name="clientName"
              placeholder="Digite seu nome ou nick"
              required
              className="bg-white/50 dark:bg-black/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceType">Serviço Utilizado *</Label>
            <Input
              id="serviceType"
              name="serviceType"
              placeholder="Ex: Elo Boost - Gold I to Platinum IV"
              required
              className="bg-white/50 dark:bg-black/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatarUrl">URL da Foto (opcional)</Label>
            <Input
              id="avatarUrl"
              name="avatarUrl"
              type="url"
              placeholder="https://exemplo.com/sua-foto.jpg"
              className="bg-white/50 dark:bg-black/50"
            />
          </div>

          <div className="space-y-2">
            <Label>Avaliação *</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-125"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-orange-500 text-orange-500'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Seu Depoimento *</Label>
            <Textarea
              id="comment"
              name="comment"
              placeholder="Conte como foi sua experiência..."
              required
              rows={4}
              className="bg-white/50 dark:bg-black/50"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold"
          >
            {loading ? 'Enviando...' : 'Enviar Depoimento'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
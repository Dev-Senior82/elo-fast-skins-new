'use client'

import { Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'

export default function TestimonialCard({ testimonial }) {
  const { clientName, avatarUrl, serviceType, rating, comment } = testimonial

  return (
    <Card className="glass-card hover:scale-105 transition-all duration-300 border-primary-500/20">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 border-2 border-orange-500">
            <AvatarImage src={avatarUrl} alt={clientName} />
            <AvatarFallback className="bg-gradient-to-br from-primary-500 to-orange-500 text-white">
              {clientName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-lg">{clientName}</h4>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < rating
                        ? 'fill-orange-500 text-orange-500'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-3">
              {serviceType}
            </p>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              {comment}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Zap, EyeOff, Users, Award } from 'lucide-react'
import { EXTRA_SERVICES } from '@/lib/constants'

const serviceIcons = {
  stream: Sparkles,
  priority: Zap,
  offline: EyeOff,
  duo: Users,
  highwr: Award,
}

export default function ExtraServicesCard({ selectedServices, onServicesChange }) {
  const handleToggle = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      onServicesChange(selectedServices.filter(id => id !== serviceId))
    } else {
      onServicesChange([...selectedServices, serviceId])
    }
  }

  return (
    <Card className="glass-card border-primary-500/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Serviços Extras
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {EXTRA_SERVICES.map((service) => {
          const Icon = serviceIcons[service.id]
          const isSelected = selectedServices.includes(service.id)
          
          return (
            <div
              key={service.id}
              onClick={() => handleToggle(service.id)}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer hover:border-primary-500/50 ${
                isSelected 
                  ? 'bg-primary-500/10 border-primary-500/50' 
                  : 'bg-muted/30 border-border/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleToggle(service.id)}
                  className="pointer-events-none"
                />
                <Icon className={`h-4 w-4 ${isSelected ? 'text-primary-500' : 'text-muted-foreground'}`} />
                <span className="text-sm font-medium">{service.label}</span>
              </div>
              <Badge 
                variant={isSelected ? 'default' : 'outline'}
                className={isSelected ? 'bg-green-500' : ''}
              >
                +{service.percentage}%
              </Badge>
            </div>
          )
        })}
        
        {selectedServices.length > 0 && (
          <div className="pt-2 text-center">
            <p className="text-xs text-muted-foreground">
              Total de extras: +{EXTRA_SERVICES
                .filter(s => selectedServices.includes(s.id))
                .reduce((sum, s) => sum + s.percentage, 0)}%
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

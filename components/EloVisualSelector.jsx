'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ELO_IMAGES, ELO_TIER_NAMES } from '@/lib/constants'

export default function EloVisualSelector({ 
  label, 
  selectedElo, 
  onEloChange, 
  eloTiers 
}) {
  const [selectedTier, setSelectedTier] = useState('')
  const [selectedDivision, setSelectedDivision] = useState('')

  // Extrair tiers únicos
  const uniqueTiers = [...new Set(eloTiers.map(elo => {
    const tier = elo.value.replace(/[0-9]/g, '')
    return tier
  }))]

  // Pegar divisões do tier selecionado
  const divisions = selectedTier 
    ? eloTiers.filter(elo => elo.value.startsWith(selectedTier))
    : []

  const handleTierSelect = (tier) => {
    setSelectedTier(tier)
    setSelectedDivision('')
    
    // Se for elo sem divisão (Mestre+), selecionar direto
    const elosWithoutDivision = ['mestre', 'graomestre', 'challenger']
    if (elosWithoutDivision.includes(tier)) {
      const eloData = eloTiers.find(e => e.value === tier)
      if (eloData) {
        onEloChange(eloData.value)
      }
    }
  }

  const handleDivisionSelect = (division) => {
    setSelectedDivision(division)
    onEloChange(division)
  }

  // Pegar imagem do tier atual
  const currentImage = selectedTier 
    ? ELO_IMAGES[selectedTier] || ELO_IMAGES.ferro
    : null

  const currentTierName = selectedTier 
    ? ELO_TIER_NAMES[selectedTier] || selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)
    : null

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">{label}</label>
      
      {/* Imagem Grande do Elo Selecionado */}
      {currentImage && (
        <div className="flex flex-col items-center space-y-2 animate-fade-in">
          <div className="relative">
            <img
              src={currentImage}
              alt={currentTierName}
              className="w-32 h-32 object-contain drop-shadow-glow animate-scale-in"
            />
          </div>
          <p className="text-lg font-bold text-primary-500">{currentTierName}</p>
        </div>
      )}

      {!selectedTier && (
        <p className="text-center text-sm text-muted-foreground py-4">
          Selecione seu elo e divisão atual
        </p>
      )}

      {/* Seleção de Tier */}
      <Card className="p-4 glass-card">
        <div className="grid grid-cols-5 gap-2">
          {uniqueTiers.map((tier) => (
            <Button
              key={tier}
              variant={selectedTier === tier ? 'default' : 'outline'}
              onClick={() => handleTierSelect(tier)}
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <img
                src={ELO_IMAGES[tier]}
                alt={tier}
                className="w-8 h-8 object-contain"
              />
              <span className="text-xs">
                {ELO_TIER_NAMES[tier] || tier.charAt(0).toUpperCase() + tier.slice(1)}
              </span>
            </Button>
          ))}
        </div>
      </Card>

      {/* Seleção de Divisão (se aplicável) */}
      {divisions.length > 0 && selectedTier && !['mestre', 'graomestre', 'challenger'].includes(selectedTier) && (
        <Card className="p-4 glass-card">
          <p className="text-sm font-medium mb-3 text-center">Selecione a Divisão</p>
          <div className="grid grid-cols-4 gap-2">
            {divisions.map((elo) => {
              const division = elo.label.split(' ')[1] // "Ferro IV" -> "IV"
              return (
                <Button
                  key={elo.value}
                  variant={selectedElo === elo.value ? 'default' : 'outline'}
                  onClick={() => handleDivisionSelect(elo.value)}
                  className="font-bold"
                >
                  {division}
                </Button>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}

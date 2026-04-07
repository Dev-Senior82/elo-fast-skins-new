'use client'

import { useState } from 'react'
import { RANKS, getRankIcon } from '@/lib/constants'
import { Check } from 'lucide-react'

export default function RankSelector({ selectedRank, selectedDivision, onRankSelect, label }) {
  const [hoveredTier, setHoveredTier] = useState(null)

  const handleTierClick = (rank) => {
    // Se não tem divisões, seleciona direto
    if (rank.divisions.length === 0) {
      onRankSelect(rank, null)
    } else {
      // Se tem divisões, seleciona o tier e aguarda seleção de divisão
      onRankSelect(rank, null)
    }
  }

  const handleDivisionClick = (rank, divisionData) => {
    onRankSelect(rank, divisionData)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">{label}</h3>
      
      {/* Grid de Elos */}
      <div className="grid grid-cols-5 gap-4">
        {RANKS.map((rank) => {
          const isTierSelected = selectedRank?.tier === rank.tier
          const isHovered = hoveredTier === rank.tier

          return (
            <button
              key={rank.tier}
              onClick={() => handleTierClick(rank)}
              onMouseEnter={() => setHoveredTier(rank.tier)}
              onMouseLeave={() => setHoveredTier(null)}
              className={`
                relative group
                flex flex-col items-center gap-3
                p-4 rounded-xl
                transition-all duration-300
                ${isTierSelected 
                  ? 'bg-gradient-to-br from-purple-600/30 to-blue-600/30 border-2 border-purple-500 scale-105' 
                  : 'bg-slate-800/50 border-2 border-slate-700 hover:border-slate-600'
                }
                ${isHovered && !isTierSelected ? 'scale-105 shadow-lg shadow-purple-500/20' : ''}
              `}
              style={{
                boxShadow: isTierSelected ? `0 0 30px ${rank.color}40` : 'none',
              }}
            >
              {/* Checkmark quando tier selecionado */}
              {isTierSelected && (
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 animate-scale-in">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Ícone do Elo */}
              <div className="relative">
                <img
                  src={getRankIcon(rank.tier)}
                  alt={rank.label}
                  className={`
                    w-16 h-16 object-contain
                    transition-all duration-300
                    ${isTierSelected || isHovered ? 'drop-shadow-glow-strong' : 'drop-shadow-glow'}
                  `}
                  style={{
                    filter: isTierSelected || isHovered 
                      ? `drop-shadow(0 0 12px ${rank.color})` 
                      : 'none',
                  }}
                />
              </div>

              {/* Nome do Elo */}
              <span 
                className={`
                  text-sm font-bold uppercase tracking-wider
                  transition-colors duration-300
                  ${isTierSelected ? 'text-white' : 'text-slate-400 group-hover:text-white'}
                `}
              >
                {rank.label}
              </span>

              {/* Divisões ou "Por Vitória" */}
              {rank.divisions.length > 0 ? (
                <span className="text-xs text-slate-500">
                  {rank.divisions.length} Divisões
                </span>
              ) : (
                <span className="text-xs text-purple-400 font-semibold">
                  Por Vitória
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Seletor de Divisão (se aplicável) */}
      {selectedRank && selectedRank.divisions.length > 0 && (
        <div className="flex justify-center gap-4 animate-fade-in">
          {selectedRank.divisions.map((divData) => {
            const isSelected = selectedDivision?.division === divData.division
            
            return (
              <button
                key={divData.division}
                onClick={() => handleDivisionClick(selectedRank, divData)}
                className={`
                  px-6 py-3 rounded-lg border-2 transition-all duration-200
                  text-white font-bold text-lg
                  ${isSelected 
                    ? 'bg-purple-600 border-purple-500 scale-110 shadow-lg shadow-purple-500/50' 
                    : 'bg-slate-800 border-purple-500/50 hover:bg-purple-600/20 hover:scale-105'
                  }
                `}
              >
                {divData.division}
              </button>
            )
          })}
        </div>
      )}

      {/* Mostrar rank selecionado completo */}
      {selectedRank && selectedDivision && (
        <div className="text-center">
          <p className="text-sm text-slate-400">Selecionado:</p>
          <p className="text-lg font-bold text-white">{selectedDivision.label}</p>
        </div>
      )}
    </div>
  )
}

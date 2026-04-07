'use client'

import { useState } from 'react'
import { RANKS, getRankIcon } from '@/lib/constants'
import { Check } from 'lucide-react'

export default function RankSelector({ selectedRank, onRankSelect, label }) {
  const [hoveredTier, setHoveredTier] = useState(null)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">{label}</h3>
      
      {/* Grid de Elos */}
      <div className="grid grid-cols-5 gap-4">
        {RANKS.map((rank) => {
          const isSelected = selectedRank?.tier === rank.tier
          const isHovered = hoveredTier === rank.tier

          return (
            <button
              key={rank.tier}
              onClick={() => onRankSelect(rank)}
              onMouseEnter={() => setHoveredTier(rank.tier)}
              onMouseLeave={() => setHoveredTier(null)}
              className={`
                relative group
                flex flex-col items-center gap-3
                p-4 rounded-xl
                transition-all duration-300
                ${isSelected 
                  ? 'bg-gradient-to-br from-purple-600/30 to-blue-600/30 border-2 border-purple-500 scale-105' 
                  : 'bg-slate-800/50 border-2 border-slate-700 hover:border-slate-600'
                }
                ${isHovered && !isSelected ? 'scale-105 shadow-lg shadow-purple-500/20' : ''}
              `}
              style={{
                boxShadow: isSelected ? `0 0 30px ${rank.color}40` : 'none',
              }}
            >
              {/* Checkmark quando selecionado */}
              {isSelected && (
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
                    ${isSelected || isHovered ? 'drop-shadow-glow-strong' : 'drop-shadow-glow'}
                  `}
                  style={{
                    filter: isSelected || isHovered 
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
                  ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-white'}
                `}
              >
                {rank.label}
              </span>

              {/* Divisões ou "Per Win" */}
              {rank.divisions.length > 0 ? (
                <span className="text-xs text-slate-500">
                  {rank.divisions.length} Divisions
                </span>
              ) : (
                <span className="text-xs text-purple-400 font-semibold">
                  Per Win
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Seletor de Divisão (se aplicável) */}
      {selectedRank && selectedRank.divisions.length > 0 && (
        <div className="flex justify-center gap-4 animate-fade-in">
          {selectedRank.divisions.map((division) => (
            <button
              key={division}
              className="px-6 py-3 rounded-lg bg-slate-800 border-2 border-purple-500 
                         hover:bg-purple-600/20 transition-all duration-200
                         text-white font-bold text-lg"
            >
              {division}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

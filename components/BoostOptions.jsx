'use client'

import { BOOST_OPTIONS } from '@/lib/constants'
import { Check } from 'lucide-react'

export default function BoostOptions({ selectedOptions, onToggleOption }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Opções de Boost</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {BOOST_OPTIONS.map((option) => {
          const isSelected = selectedOptions.some(opt => opt.id === option.id)

          return (
            <button
              key={option.id}
              onClick={() => onToggleOption(option)}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-300
                ${isSelected 
                  ? 'bg-gradient-to-br from-purple-600/30 to-blue-600/30 border-purple-500 scale-105' 
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:scale-105'
                }
              `}
            >
              {/* Checkmark */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 animate-scale-in">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Icon */}
              <div className="text-4xl mb-2">{option.icon}</div>

              {/* Label */}
              <h4 className="text-white font-bold mb-1">{option.label}</h4>

              {/* Description */}
              <p className="text-xs text-slate-400 mb-2">{option.description}</p>

              {/* Percentage Badge */}
              <div className={`
                inline-block px-3 py-1 rounded-full text-xs font-bold
                ${isSelected ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300'}
              `}>
                +{option.percentage}%
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

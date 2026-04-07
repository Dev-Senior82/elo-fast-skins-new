'use client'

import { getEloImage } from '@/lib/constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function EloSelect({ value, onValueChange, placeholder, eloTiers }) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="bg-white/50 dark:bg-black/50">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {eloTiers.map((elo) => (
          <SelectItem 
            key={elo.value} 
            value={elo.value}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <img
                src={getEloImage(elo.label)}
                alt={elo.label}
                className="w-8 h-8 object-contain"
              />
              <span>{elo.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

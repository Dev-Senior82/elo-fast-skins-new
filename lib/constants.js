// =====================================================
// BOOSTERS E CAMPEÕES CORRETOS
// =====================================================

export const BOOSTER_CHAMPIONS = {
  'Lulu': {
    name: 'Lulu',
    image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lulu_0.jpg',
    icon: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Lulu.png',
  },
  'Qiyana': {
    name: 'Qiyana',
    image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Qiyana_0.jpg',
    icon: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Qiyana.png',
  },
  'Talon': {
    name: 'Talon',
    image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Talon_0.jpg',
    icon: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Talon.png',
  },
  'Katarina': {
    name: 'Katarina',
    image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Katarina_0.jpg',
    icon: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Katarina.png',
  },
  'Sett': {
    name: 'Sett',
    image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Sett_0.jpg',
    icon: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Sett.png',
  },
  'Jayce': {
    name: 'Jayce',
    image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jayce_0.jpg',
    icon: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Jayce.png',
  },
}

// =====================================================
// ELOS COM ÍCONES OFICIAIS DO LEAGUE OF LEGENDS
// =====================================================

export const RANK_ICONS = {
  iron: 'https://lolg-cdn.porofessor.gg/img/s/league-icons-v3/160/1.png?v=1775164399',
  bronze: 'https://lolg-cdn.porofessor.gg/img/s/league-icons-v3/160/2.png?v=1775164399',
  silver: 'https://lolg-cdn.porofessor.gg/img/s/league-icons-v3/160/3.png?v=1775164399',
  gold: 'https://lolg-cdn.porofessor.gg/img/s/league-icons-v3/160/4.png?v=1775164399',
  platinum: 'https://lolg-cdn.porofessor.gg/img/s/league-icons-v3/160/5.png?v=1775164399',
  emerald: 'https://lolg-cdn.porofessor.gg/img/s/league-icons-v3/160/6.png?v=1775164399',
  diamond: 'https://lolg-cdn.porofessor.gg/img/s/league-icons-v3/160/7.png?v=1775164399',
  master: 'https://lolg-cdn.porofessor.gg/img/s/league-icons-v3/160/8.png?v=1775164399',
  grandmaster: 'https://lolg-cdn.porofessor.gg/img/s/league-icons-v3/160/9.png?v=1775164399',
  challenger: 'https://lolg-cdn.porofessor.gg/img/s/league-icons-v3/160/10.png?v=1775164399',
}

// =====================================================
// ESTRUTURA DE ELOS COM PREÇOS EXATOS POR DIVISÃO
// (Preços Solo já incluem +10%)
// =====================================================

export const RANKS = [
  {
    tier: 'iron',
    label: 'Ferro',
    divisions: [
      { division: 'IV', label: 'Ferro IV', solo: 4.68, duo: 5.95 },  // 4.25 + 10% = 4.68
      { division: 'III', label: 'Ferro III', solo: 4.91, duo: 6.25 }, // 4.46 + 10% = 4.91
      { division: 'II', label: 'Ferro II', solo: 5.15, duo: 6.56 },  // 4.68 + 10% = 5.15
      { division: 'I', label: 'Ferro I', solo: 5.41, duo: 6.89 },    // 4.92 + 10% = 5.41
    ],
    color: '#6B5B4F',
  },
  {
    tier: 'bronze',
    label: 'Bronze',
    divisions: [
      { division: 'IV', label: 'Bronze IV', solo: 5.61, duo: 6.80 },  // 5.10 + 10% = 5.61
      { division: 'III', label: 'Bronze III', solo: 5.90, duo: 7.14 }, // 5.36 + 10% = 5.90
      { division: 'II', label: 'Bronze II', solo: 6.19, duo: 7.50 },  // 5.63 + 10% = 6.19
      { division: 'I', label: 'Bronze I', solo: 6.50, duo: 7.87 },    // 5.91 + 10% = 6.50
    ],
    color: '#CD7F32',
  },
  {
    tier: 'silver',
    label: 'Prata',
    divisions: [
      { division: 'IV', label: 'Prata IV', solo: 6.55, duo: 7.65 },   // 5.95 + 10% = 6.55
      { division: 'III', label: 'Prata III', solo: 6.88, duo: 8.03 }, // 6.25 + 10% = 6.88
      { division: 'II', label: 'Prata II', solo: 7.22, duo: 8.43 },   // 6.56 + 10% = 7.22
      { division: 'I', label: 'Prata I', solo: 7.58, duo: 8.86 },     // 6.89 + 10% = 7.58
    ],
    color: '#C0C0C0',
  },
  {
    tier: 'gold',
    label: 'Ouro',
    divisions: [
      { division: 'IV', label: 'Ouro IV', solo: 12.16, duo: 15.30 },   // 11.05 + 10% = 12.16
      { division: 'III', label: 'Ouro III', solo: 12.76, duo: 16.07 }, // 11.60 + 10% = 12.76
      { division: 'II', label: 'Ouro II', solo: 13.40, duo: 16.87 },   // 12.18 + 10% = 13.40
      { division: 'I', label: 'Ouro I', solo: 14.07, duo: 17.71 },     // 12.79 + 10% = 14.07
    ],
    color: '#FFD700',
  },
  {
    tier: 'platinum',
    label: 'Platina',
    divisions: [
      { division: 'IV', label: 'Platina IV', solo: 18.70, duo: 23.80 },   // 17.00 + 10% = 18.70
      { division: 'III', label: 'Platina III', solo: 19.64, duo: 24.99 }, // 17.85 + 10% = 19.64
      { division: 'II', label: 'Platina II', solo: 20.61, duo: 26.24 },   // 18.74 + 10% = 20.61
      { division: 'I', label: 'Platina I', solo: 21.65, duo: 27.55 },     // 19.68 + 10% = 21.65
    ],
    color: '#00CED1',
  },
  {
    tier: 'emerald',
    label: 'Esmeralda',
    divisions: [
      { division: 'IV', label: 'Esmeralda IV', solo: 26.18, duo: 33.15 },   // 23.80 + 10% = 26.18
      { division: 'III', label: 'Esmeralda III', solo: 27.49, duo: 34.81 }, // 24.99 + 10% = 27.49
      { division: 'II', label: 'Esmeralda II', solo: 28.86, duo: 36.54 },   // 26.24 + 10% = 28.86
      { division: 'I', label: 'Esmeralda I', solo: 30.31, duo: 38.37 },     // 27.55 + 10% = 30.31
    ],
    color: '#50C878',
  },
  {
    tier: 'diamond',
    label: 'Diamante',
    divisions: [
      { division: 'IV', label: 'Diamante IV', solo: 32.73, duo: 41.65 },   // 29.75 + 10% = 32.73
      { division: 'III', label: 'Diamante III', solo: 34.36, duo: 43.73 }, // 31.24 + 10% = 34.36
      { division: 'II', label: 'Diamante II', solo: 36.08, duo: 45.92 },   // 32.80 + 10% = 36.08
      { division: 'I', label: 'Diamante I', solo: 37.88, duo: 48.21 },     // 34.44 + 10% = 37.88
    ],
    color: '#B9F2FF',
  },
  {
    tier: 'master',
    label: 'Mestre',
    divisions: [],
    color: '#9333EA',
    pricePerWin: 29.75,
  },
  {
    tier: 'grandmaster',
    label: 'Grão-Mestre',
    divisions: [],
    color: '#EF4444',
    pricePerWin: 42.50,
  },
  {
    tier: 'challenger',
    label: 'Desafiante',
    divisions: [],
    color: '#F59E0B',
    pricePerWin: 59.50,
  },
]

// =====================================================
// OPÇÕES DE BOOST (PORTUGUÊS)
// =====================================================

export const BOOST_OPTIONS = [
  {
    id: 'express',
    label: 'Boost Expresso',
    description: 'Boost prioritário e mais rápido',
    percentage: 30,
    icon: '⚡',
  },
  {
    id: 'lane',
    label: 'Escolher Lane',
    description: 'Escolha qual lane o booster deve jogar',
    percentage: 30,
    icon: '/gato-gojo-icon.png',
  },
  {
    id: 'stream',
    label: 'Streaming das Partidas',
    description: 'Assista suas partidas ao vivo',
    percentage: 20,
    icon: '📹',
  },
  {
    id: 'offline',
    label: 'Modo Offline',
    description: 'Booster joga invisível',
    percentage: 15,
    icon: '👻',
  },
]

// =====================================================
// CORES DO TEMA (GAMING PREMIUM)
// =====================================================

export const THEME_COLORS = {
  background: '#0f172a',
  card: '#1e293b',
  primary: '#7c3aed',
  highlight: '#38bdf8',
  success: '#22c55e',
  text: '#f8fafc',
  muted: '#64748b',
}

// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

export function getRankIcon(tier) {
  return RANK_ICONS[tier] || RANK_ICONS.iron
}

export function getRankColor(tier) {
  const rank = RANKS.find(r => r.tier === tier)
  return rank?.color || '#6B5B4F'
}

export function generateBoosterStats() {
  return {
    games: Math.floor(Math.random() * (900 - 300 + 1)) + 300,
    soloWinRate: Math.floor(Math.random() * (97 - 85 + 1)) + 85,
    duoWinRate: Math.floor(Math.random() * (92 - 80 + 1)) + 80,
  }
}

export function getOnlineBoostersCount() {
  return Math.floor(Math.random() * (7 - 3 + 1)) + 3
}

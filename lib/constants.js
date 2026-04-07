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
// ESTRUTURA DE ELOS
// =====================================================

export const RANKS = [
  {
    tier: 'iron',
    label: 'Iron',
    divisions: ['IV', 'III', 'II', 'I'],
    color: '#6B5B4F',
    pricePerDivision: 5.31,
  },
  {
    tier: 'bronze',
    label: 'Bronze',
    divisions: ['IV', 'III', 'II', 'I'],
    color: '#CD7F32',
    pricePerDivision: 6.38,
  },
  {
    tier: 'silver',
    label: 'Silver',
    divisions: ['IV', 'III', 'II', 'I'],
    color: '#C0C0C0',
    pricePerDivision: 7.44,
  },
  {
    tier: 'gold',
    label: 'Gold',
    divisions: ['IV', 'III', 'II', 'I'],
    color: '#FFD700',
    pricePerDivision: 13.81,
  },
  {
    tier: 'platinum',
    label: 'Platinum',
    divisions: ['IV', 'III', 'II', 'I'],
    color: '#00CED1',
    pricePerDivision: 21.25,
  },
  {
    tier: 'emerald',
    label: 'Emerald',
    divisions: ['IV', 'III', 'II', 'I'],
    color: '#50C878',
    pricePerDivision: 29.75,
  },
  {
    tier: 'diamond',
    label: 'Diamond',
    divisions: ['IV', 'III', 'II', 'I'],
    color: '#B9F2FF',
    pricePerDivision: 37.19,
  },
  {
    tier: 'master',
    label: 'Master',
    divisions: [],
    color: '#9333EA',
    pricePerWin: 29.75,
  },
  {
    tier: 'grandmaster',
    label: 'Grandmaster',
    divisions: [],
    color: '#EF4444',
    pricePerWin: 42.50,
  },
  {
    tier: 'challenger',
    label: 'Challenger',
    divisions: [],
    color: '#F59E0B',
    pricePerWin: 59.50,
  },
]

// =====================================================
// OPÇÕES DE BOOST
// =====================================================

export const BOOST_OPTIONS = [
  {
    id: 'express',
    label: 'Express Boost',
    description: 'Boost prioritário e mais rápido',
    percentage: 30,
    icon: '⚡',
  },
  {
    id: 'duo',
    label: 'Duo Queue',
    description: 'Jogue junto com o booster',
    percentage: 50,
    icon: '👥',
  },
  {
    id: 'stream',
    label: 'Streaming Games',
    description: 'Assista suas partidas ao vivo',
    percentage: 20,
    icon: '📹',
  },
  {
    id: 'offline',
    label: 'Offline Mode',
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

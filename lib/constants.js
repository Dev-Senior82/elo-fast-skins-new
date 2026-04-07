// =====================================================
// MAPA DE CAMPEÕES DOS BOOSTERS
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

// Imagens dos Elos (para a calculadora)
export const ELO_IMAGES = {
  ferro: 'https://lolg-cdn.porofessor.gg/img/s/league-icons-v3/160/1.png?v=1775164399',
  bronze: 'https://lolg-cdn.porofessor.gg/img/s/league-icons-v3/160/2.png?v=1775164399',
  prata: 'https://lolg-cdn.porofessor.gg/img/s/league-icons-v3/160/3.png?v=1775164399',
  ouro: 'https://lolg-cdn.porofessor.gg/img/s/league-icons-v3/160/4.png?v=1775164399',
  platina: 'https://lolg-cdn.porofessor.gg/img/s/league-icons-v3/160/5.png?v=1775164399',
  esmeralda: 'https://lolg-cdn.porofessor.gg/img/s/league-icons-v3/160/6.png?v=1775164399',
  diamante: 'https://lolg-cdn.porofessor.gg/img/s/league-icons-v3/160/7.png?v=1775164399',
  mestre: 'https://lolg-cdn.porofessor.gg/img/s/league-icons-v3/160/8.png?v=1775164399',
  'grão-mestre': 'https://lolg-cdn.porofessor.gg/img/s/league-icons-v3/160/9.png?v=1775164399',
  challenger: 'https://lolg-cdn.porofessor.gg/img/s/league-icons-v3/160/10.png?v=1775164399',
}

// Mapeamento de nomes de elos
export const ELO_TIER_NAMES = {
  ferro: 'Ferro',
  bronze: 'Bronze',
  prata: 'Prata',
  ouro: 'Ouro',
  platina: 'Platina',
  esmeralda: 'Esmeralda',
  diamante: 'Diamante',
  mestre: 'Mestre',
  'grão-mestre': 'Grão-Mestre',
  challenger: 'Challenger',
}

// Função helper para pegar imagem do elo
export function getEloImage(eloLabel) {
  const eloKey = eloLabel.toLowerCase().split(' ')[0] // "Ferro IV" -> "ferro"
  return ELO_IMAGES[eloKey] || ELO_IMAGES.ferro
}

// Função helper para pegar tier do elo (sem divisão)
export function getEloTier(eloValue) {
  // "ferro4" -> "ferro"
  const tier = eloValue.replace(/[0-9]/g, '')
  return tier
}

// Função para gerar stats aleatórias do booster
export function generateBoosterStats() {
  return {
    games: Math.floor(Math.random() * (900 - 300 + 1)) + 300, // 300-900
    soloWinRate: Math.floor(Math.random() * (97 - 85 + 1)) + 85, // 85-97%
    duoWinRate: Math.floor(Math.random() * (92 - 80 + 1)) + 80, // 80-92%
  }
}

// Função para gerar número aleatório de boosters online (3-7)
export function getOnlineBoostersCount() {
  return Math.floor(Math.random() * (7 - 3 + 1)) + 3
}

// Serviços extras disponíveis
export const EXTRA_SERVICES = [
  { id: 'stream', label: 'Stream do Boost', percentage: 25 },
  { id: 'priority', label: 'Prioridade no Boost', percentage: 20 },
  { id: 'offline', label: 'Jogar Offline', percentage: 15 },
  { id: 'duo', label: 'Duoq com Booster', percentage: 50 },
  { id: 'highwr', label: 'Booster High Winrate', percentage: 10 },
]

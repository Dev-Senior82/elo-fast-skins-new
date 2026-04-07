// =====================================================
// MAPA DE CAMPEÕES DOS BOOSTERS
// =====================================================

export const BOOSTER_CHAMPIONS = {
  'Talon': {
    name: 'Talon',
    image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Talon_0.jpg',
    icon: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Talon.png',
  },
  'Zed': {
    name: 'Zed',
    image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Zed_0.jpg',
    icon: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Zed.png',
  },
  'Yasuo': {
    name: 'Yasuo',
    image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg',
    icon: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Yasuo.png',
  },
  'Lee Sin': {
    name: 'Lee Sin',
    image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/LeeSin_0.jpg',
    icon: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/LeeSin.png',
  },
  'Riven': {
    name: 'Riven',
    image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Riven_0.jpg',
    icon: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Riven.png',
  },
  'Katarina': {
    name: 'Katarina',
    image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Katarina_0.jpg',
    icon: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Katarina.png',
  },
  'Viego': {
    name: 'Viego',
    image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Viego_0.jpg',
    icon: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Viego.png',
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

// Função helper para pegar imagem do elo
export function getEloImage(eloLabel) {
  const eloKey = eloLabel.toLowerCase().split(' ')[0] // "Ferro IV" -> "ferro"
  return ELO_IMAGES[eloKey] || ELO_IMAGES.ferro
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

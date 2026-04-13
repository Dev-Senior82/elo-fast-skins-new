import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Mail } from 'lucide-react'
import { SiDiscord, SiTwitch, SiKick } from 'react-icons/si'

export default function Footer() {
  return (
    <footer className="border-t border-border/40 glass-card mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="https://customer-assets.emergentagent.com/job_53d02550-cf1c-446a-a254-b64d519a09e0/artifacts/9wwyxxmg_image.png"
                alt="Elo Fast Skins"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="font-bold text-lg gamer-gradient bg-clip-text text-transparent">
                ELO FAST SKINS
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Os melhores serviços de Elo Job do Brasil. Segurança, rapidez e qualidade garantida.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary-500 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/precos" className="text-muted-foreground hover:text-primary-500 transition-colors">
                  Preços
                </Link>
              </li>
              <li>
                <Link href="/boosters" className="text-muted-foreground hover:text-primary-500 transition-colors">
                  Boosters
                </Link>
              </li>
              <li>
                <Link href="/historico" className="text-muted-foreground hover:text-primary-500 transition-colors">
                  Histórico
                </Link>
              </li>
            </ul>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="font-bold mb-4">Serviços</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Elo Boost</li>
              <li>Duo Boost</li>
              <li>MD10</li>
              <li>Coaching</li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="font-bold mb-4">Nossas Redes</h3>
            <div className="space-y-3">
              <a
                href="mailto:contato@elofastskins.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary-500 transition-colors"
              >
                <Mail className="h-4 w-4" />
                contato@elofastskins.com
              </a>
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="https://discord.gg/DMcHkNwKHb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 flex items-center justify-center transition-all hover:scale-110"
                  title="Discord"
                >
                  <SiDiscord className="h-5 w-5 text-indigo-400" />
                </a>
                <a
                  href="https://www.twitch.tv/malthynho"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-purple-500/10 hover:bg-purple-500/20 flex items-center justify-center transition-all hover:scale-110"
                  title="Twitch"
                >
                  <SiTwitch className="h-5 w-5 text-purple-400" />
                </a>
                <button
                  disabled
                  className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center opacity-50 cursor-not-allowed"
                  title="Kick (em breve)"
                >
                  <SiKick className="h-5 w-5 text-green-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Elo Fast Skins. Todos os direitos reservados.</p>
          <p className="mt-2 text-xs">
            Este site não é afiliado à Riot Games. League of Legends é uma marca registrada da Riot Games, Inc.
          </p>
          <p className="mt-3 text-xs">
            🎨 Desenvolvido por <span className="font-bold text-orange-500">Slayvier1</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
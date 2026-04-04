import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Mail } from 'lucide-react'
import { SiDiscord } from 'react-icons/si'
import { FaXTwitter } from 'react-icons/fa6'

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

          {/* Contato */}
          <div>
            <h3 className="font-bold mb-4">Contato</h3>
            <div className="space-y-3">
              <a
                href="mailto:contato@elofastskins.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary-500 transition-colors"
              >
                <Mail className="h-4 w-4" />
                contato@elofastskins.com
              </a>
              <div className="flex gap-3 pt-2">
                <a
                  href="https://discord.gg/akbFh3wJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-full bg-primary-500/10 hover:bg-primary-500/20 flex items-center justify-center transition-colors"
                  title="Discord"
                >
                  <SiDiscord className="h-4 w-4 text-primary-500" />
                </a>
                <a
                  href="https://www.instagram.com/welltin.st/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-full bg-orange-500/10 hover:bg-orange-500/20 flex items-center justify-center transition-colors"
                  title="Instagram"
                >
                  <Instagram className="h-4 w-4 text-orange-500" />
                </a>
                <a
                  href="https://x.com/Slayvier1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-full bg-gray-900/10 hover:bg-gray-900/20 dark:bg-white/10 dark:hover:bg-white/20 flex items-center justify-center transition-colors"
                  title="X (Twitter)"
                >
                  <FaXTwitter className="h-4 w-4 text-gray-900 dark:text-white" />
                </a>
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
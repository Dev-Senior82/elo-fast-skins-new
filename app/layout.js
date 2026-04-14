import { ThemeProvider } from 'next-themes'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Elo Job LoL | Duo Boost | Boost LoL | Coach LoL - Elo Fast',
  description:
    'Elo Job LoL barato, Duo Boost, Coach LoL e Boost LoL. Suba de elo rápido com boosters profissionais e segurança garantida.',
  keywords: [
    'elo job',
    'elo job lol',
    'duo boost',
    'duo job lol',
    'boost lol',
    'coach lol',
    'subir de elo',
    'elo job barato',
    'lol boost',
    'elo boost brasil'
  ],
  icons: {
    icon: '/favicon.png'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppButton />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

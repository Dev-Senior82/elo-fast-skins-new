import { ThemeProvider } from 'next-themes'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Elo Fast Skins - Serviços de Elo Job #1 do Brasil',
  description: 'Os melhores serviços de Elo Boost, Duo Boost e MD10 para League of Legends. Boosters profissionais, segurança garantida e preços justos.',
  keywords: 'elo job, elo boost, duo boost, league of legends, lol boost, md10',
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
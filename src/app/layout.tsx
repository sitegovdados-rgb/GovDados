import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'Painel Programa Cidade Integrada — Governo do Estado do RJ',
  description: 'Visualização de dados, indicadores, programas sociais e intervenções urbanísticas do Programa Cidade Integrada nos territórios do Rio de Janeiro.',
  keywords: 'Programa Cidade Integrada, PCI, Rio de Janeiro, políticas públicas, favelas, urbanismo social',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col" style={{ background: 'var(--pci-bg)' }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}

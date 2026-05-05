import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

export const metadata: Metadata = {
  title: 'GovDados — Indicadores de Políticas Públicas',
  description: 'Visualização de dados e indicadores do Programa Cidade Integrada e políticas públicas do Estado do Rio de Janeiro.',
  keywords: 'políticas públicas, indicadores, Rio de Janeiro, Cidade Integrada, dados abertos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

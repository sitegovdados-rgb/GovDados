import Link from 'next/link'
import DashboardEmbed from '@/components/DashboardEmbed'

export default function ManguinhosJacarezinhoPage() {
  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, var(--pci-navy) 0%, #1e3a8a 100%)', color: 'white', borderBottom: '3px solid var(--pci-cyan)' }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <Link href="/territorios" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Territórios</Link>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--pci-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Manguinhos e Jacarezinho</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            <span className="pci-tag-navy">Zona Norte</span>
            <span className="pci-tag-navy">Av. Brasil · Linha Férrea</span>
          </div>
          <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.1, marginBottom: 20 }}>
            Manguinhos e Jacarezinho
          </h1>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1rem', color: 'rgba(255,255,255,0.75)', maxWidth: 760, lineHeight: 1.85 }}>
            Território da Zona Norte do Rio de Janeiro, formado pelas favelas de Manguinhos e Jacarezinho, ao longo das linhas férreas e do entorno dos rios Salgado e Jacaré. O Jacarezinho apresenta uma das maiores densidades demográficas da cidade, e Manguinhos carrega a memória de sua formação — do ecossistema de manguezal ao adensamento urbano e industrial do século XX. O Programa Cidade Integrada atua no território com intervenções urbanísticas e sociais.
          </p>
        </div>
      </section>

      <div style={{ paddingTop: 48, paddingBottom: 16 }}>
        <div className="max-w-7xl mx-auto px-6" style={{ marginBottom: 24 }}>
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.6rem' }}>Programas Sociais</h2>
        </div>
        <DashboardEmbed tipo="social" />
      </div>

      <div style={{ paddingTop: 32, paddingBottom: 64 }}>
        <div className="max-w-7xl mx-auto px-6" style={{ marginBottom: 24 }}>
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.6rem' }}>Urbanismo</h2>
        </div>
        <DashboardEmbed tipo="urbanismo" />
      </div>
    </div>
  )
}

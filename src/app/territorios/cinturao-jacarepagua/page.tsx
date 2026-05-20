import Link from 'next/link'
import DashboardEmbed from '@/components/DashboardEmbed'

export default function CinturaoPage() {
  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, var(--pci-navy) 0%, #1e3a8a 100%)', color: 'white', borderBottom: '3px solid var(--pci-cyan)' }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <Link href="/territorios" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Territórios</Link>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--pci-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cinturão de Jacarepaguá</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            <span className="pci-tag-navy">XVI Região Administrativa</span>
            <span className="pci-tag-navy">Jacarepaguá · Zona Sudoeste</span>
            <span className="pci-tag-navy">ADPF 635 · STF</span>
          </div>
          <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.1, marginBottom: 20 }}>
            Cinturão de Jacarepaguá
          </h1>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1rem', color: 'rgba(255,255,255,0.75)', maxWidth: 760, lineHeight: 1.85 }}>
            O Cinturão de Jacarepaguá é um território da Zona Sudoeste da cidade do Rio de Janeiro, na Baixada de Jacarepaguá. Reúne comunidades como o Corredor do Itanhangá e Rio das Pedras, em uma área de intensa expansão urbana e elevada heterogeneidade socioespacial, marcada pela coexistência de espaços formais e informais. As ações do Programa Cidade Integrada neste território integram o Plano de Retomada de territórios no âmbito da ADPF 635 do Supremo Tribunal Federal.
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

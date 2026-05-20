import Link from 'next/link'
import DashboardTabs from '@/components/DashboardTabs'

export default function OutrosPage() {
  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, var(--pci-navy) 0%, #1e3a8a 100%)', color: 'white', borderBottom: '3px solid var(--pci-cyan)' }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <Link href="/territorios" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Territórios</Link>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--pci-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Outros — Atuações do PCI</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            <span className="pci-tag-navy">Diversas regiões · Rio de Janeiro</span>
          </div>
          <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.1, marginBottom: 20 }}>
            Outros — Atuações do PCI
          </h1>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1rem', color: 'rgba(255,255,255,0.75)', maxWidth: 760, lineHeight: 1.85 }}>
            Reúne projetos de arquitetura e urbanismo do Programa Cidade Integrada realizados fora dos territórios principais, em diversas regiões do Rio de Janeiro.
          </p>
        </div>
      </section>

      <DashboardTabs abas={['urbanismo']} />
    </div>
  )
}

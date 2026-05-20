import Link from 'next/link'
import DashboardTabs from '@/components/DashboardTabs'

export default function PPGPage() {
  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, var(--pci-navy) 0%, #1e3a8a 100%)', color: 'white', borderBottom: '3px solid var(--pci-cyan)' }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <Link href="/territorios" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Territórios</Link>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--pci-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pavão-Pavãozinho e Cantagalo</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            <span className="pci-tag-navy">Zona Sul</span>
            <span className="pci-tag-navy">Copacabana · Ipanema · Lagoa</span>
          </div>
          <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.1, marginBottom: 20 }}>
            Pavão-Pavãozinho<br />e Cantagalo
          </h1>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1rem', color: 'rgba(255,255,255,0.75)', maxWidth: 760, lineHeight: 1.85 }}>
            Território da Zona Sul do Rio de Janeiro, entre Copacabana, Ipanema e Lagoa, conhecido pelo apelido PPG. Distingue-se pela localização em área nobre da cidade, com proximidade de infraestrutura urbana consolidada e, ao mesmo tempo, intensa desigualdade interna. O Programa Cidade Integrada atua na requalificação de espaços e na oferta de serviços sociais à população local.
          </p>
        </div>
      </section>

      <DashboardTabs />
    </div>
  )
}

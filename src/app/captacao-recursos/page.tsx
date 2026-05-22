import Link from 'next/link'
import DashboardEmbed from '@/components/DashboardEmbed'
import { DASHBOARDS } from '@/config/dashboards'

export default function CaptacaoRecursosPage() {
  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, var(--pci-navy) 0%, #1e3a8a 100%)', color: 'white', borderBottom: '3px solid var(--pci-cyan)' }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <Link href="/" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Home</Link>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--pci-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Captação de Recursos</span>
          </div>
          <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.1, marginBottom: 20 }}>
            Captação de Recursos
          </h1>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1rem', color: 'rgba(255,255,255,0.75)', maxWidth: 760, lineHeight: 1.85 }}>
            Recursos captados e investimentos no Programa Cidade Integrada
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--pci-light)', borderTop: '1px solid var(--pci-border)', borderBottom: '1px solid var(--pci-border)' }}>
        <div style={{ paddingTop: 56, paddingBottom: 56 }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', marginBottom: 32 }}>
            <div className="pci-accent-line" />
            <div style={{ borderBottom: '1px solid var(--pci-border)' }}>
              <span style={{
                fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '1rem',
                padding: '16px 24px', display: 'inline-flex', alignItems: 'center', gap: 8,
                color: 'var(--pci-navy)', borderBottom: '3px solid var(--pci-cyan)',
                marginBottom: -1,
              }}>
                <span>💰</span>
                Captação de Recursos
              </span>
            </div>
            <div style={{ marginTop: 16 }}>
              <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.88rem', color: 'var(--pci-dim)', margin: 0 }}>
                Recursos captados e investimentos do Programa Cidade Integrada.
              </p>
            </div>
          </div>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
            <DashboardEmbed tipo="social" src={DASHBOARDS.captacao.captacaoRecursos} />
          </div>
        </div>
      </section>
    </div>
  )
}

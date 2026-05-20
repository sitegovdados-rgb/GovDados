import Link from 'next/link'
import DashboardTabs from '@/components/DashboardTabs'

export default function HomePage() {
  const territoriosList = [
    { nome: 'Cinturão de Jacarepaguá', slug: 'cinturao-jacarepagua', descricao: 'Território da Zona Sudoeste do Rio de Janeiro, na Baixada de Jacarepaguá, com intensa expansão urbana e elevada densidade demográfica.' },
    { nome: 'Pavão-Pavãozinho e Cantagalo', slug: 'ppg', descricao: 'Comunidades da Zona Sul do Rio de Janeiro, entre Copacabana, Ipanema e Lagoa.' },
    { nome: 'Manguinhos e Jacarezinho', slug: 'jacarezinho-manguinhos', descricao: 'Territórios da Zona Norte do Rio de Janeiro, ao longo das linhas férreas e da Avenida Brasil.' },
    { nome: 'Outros — Atuações do PCI', slug: 'outros', descricao: 'Projetos e intervenções do PCI fora dos territórios principais, em diversas regiões do Rio de Janeiro.' },
  ]

  return (
    <div>

      {/* ── HERO com territórios ─────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, var(--pci-navy) 0%, #1e3a8a 100%)', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(0,168,204,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 100, width: 240, height: 240, borderRadius: '50%', background: 'rgba(0,168,204,0.05)', pointerEvents: 'none' }} />

        <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
          <div className="max-w-2xl mb-10">
            <div style={{ marginBottom: 16 }}>
              <span className="pci-tag-navy">Governo do Estado do Rio de Janeiro</span>
            </div>
            <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: 16, marginTop: 12 }}>
              Painel do Programa<br />
              <span style={{ color: 'var(--pci-cyan)' }}>Cidade Integrada</span>
            </h1>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
              Dados, indicadores e intervenções do PCI nos territórios do Rio de Janeiro — transparência para gestores, pesquisadores e cidadãos.
            </p>
          </div>

          {/* Cards de territórios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
            {territoriosList.map((t) => (
              <div key={t.slug} className="hero-card" style={{
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.20)',
                borderRadius: 12,
                padding: '20px 22px',
                transition: 'background 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono', fontSize: '0.58rem',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    padding: '2px 8px', borderRadius: 4,
                    background: 'rgba(22,163,74,0.25)',
                    color: '#86efac',
                    border: '1px solid rgba(22,163,74,0.4)',
                  }}>
                    Ativo
                  </span>
                </div>
                <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '1rem', color: 'white', marginBottom: 8, lineHeight: 1.3 }}>
                  {t.nome}
                </h3>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: 16 }}>
                  {t.descricao}
                </p>
                <Link href={`/territorios/${t.slug}`} style={{
                  fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.78rem',
                  color: 'var(--pci-cyan)', display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>
                  {t.slug === 'outros' ? 'Ver atuações →' : 'Explorar território →'}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Métricas */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { n: '3', label: 'Territórios', sub: 'do Programa Cidade Integrada' },
                { n: '116', label: 'Serviços', sub: 'registrados nos territórios' },
                { n: '224mil+', label: 'Atendimentos', sub: 'em serviços pelo PCI' },
                { n: '231', label: 'Intervenções', sub: 'urbanísticas registradas' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '18px 24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                  <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '1.8rem', color: 'var(--pci-cyan)', lineHeight: 1, marginBottom: 4 }}>{item.n}</p>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.8rem', color: 'white', marginBottom: 2 }}>{item.label}</p>
                  <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DASHBOARDS COM ABAS ───────────────────────────────────────── */}
      <DashboardTabs />

      {/* ── CTA ──────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, var(--pci-navy) 0%, #1e3a8a 100%)', color: 'white', borderTop: '3px solid var(--pci-cyan)' }}>
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div>
              <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', lineHeight: 1.2, marginBottom: 12 }}>
                Acesse os dados completos<br />
                <span style={{ color: 'var(--pci-cyan)' }}>do Programa Cidade Integrada</span>
              </h2>
              <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', maxWidth: 480 }}>
                Painel de indicadores, programas sociais, intervenções urbanísticas e dados abertos.
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href="/territorios" className="pci-btn-white">Explorar Territórios</Link>
              <Link href="/dados" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.875rem', padding: '12px 24px', borderRadius: 8, background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                Dados Abertos
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

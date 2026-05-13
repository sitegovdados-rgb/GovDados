import Link from 'next/link'
import { getTerritorios, getSubTerritorios, getProgramasTerritorio, getIndicadores, getProgramasUrbanismo } from '@/lib/directus'

export const revalidate = 3600

export default async function HomePage() {
  let territorios: any[] = []
  let subTerritorios: any[] = []
  let programas: any[] = []
  let indicadores: any[] = []
  let urbanismo: any[] = []

  try {
    territorios    = await getTerritorios()
    subTerritorios = await getSubTerritorios('cinturao-jacarepagua')
    programas      = await getProgramasTerritorio()
    indicadores    = await getIndicadores()
    urbanismo      = await getProgramasUrbanismo()
  } catch (e) { console.error(e) }

  const totalBeneficiarios = programas.reduce((acc: number, p: any) => acc + (p.beneficiarios || 0), 0)

  const territoriosList = territorios.length > 0 ? territorios : [
    { nome: 'Cinturão de Jacarepaguá', slug: 'cinturao-jacarepagua', status: 'ativo', descricao: 'Conjunto de comunidades na Zona Oeste do Rio de Janeiro, composto por Gardênia Azul, Rio das Pedras e Corredor do Itanhangá.' },
    { nome: 'Manguinhos e Jacarezinho', slug: 'manguinhos-jacarezinho', status: 'em_breve', descricao: 'Territórios da Zona Norte do Rio de Janeiro, ao longo das linhas férreas e da Avenida Brasil.' },
    { nome: 'Pavão-Pavãozinho e Cantagalo', slug: 'ppg', status: 'em_breve', descricao: 'Comunidades da Zona Sul do Rio de Janeiro, entre Copacabana e Ipanema.' },
  ]

  return (
    <div>

      {/* ── HERO com territórios ─────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, var(--pci-navy) 0%, #1e3a8a 100%)', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(0,168,204,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 100, width: 240, height: 240, borderRadius: '50%', background: 'rgba(0,168,204,0.05)', pointerEvents: 'none' }} />

        <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">

          {/* Título */}
          <div className="max-w-2xl mb-10">
            <div style={{ marginBottom: 16 }}>
              <span className="pci-tag-navy">Governo do Estado do Rio de Janeiro</span>
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 8, lineHeight: 1.6 }}>
                Área do Plano de Retomada de Territórios no Âmbito da A.D.P.F. 635 do STF
              </p>
            </div>
            <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: 16, marginTop: 12 }}>
              Painel do Programa<br />
              <span style={{ color: 'var(--pci-cyan)' }}>Cidade Integrada</span>
            </h1>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
              Dados, indicadores e intervenções do PCI nos territórios do Rio de Janeiro — transparência para gestores, pesquisadores e cidadãos.
            </p>
          </div>

          {/* Cards de territórios dentro do hero */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            {territoriosList.map((t: any) => (
              <div key={t.slug} className="hero-card" style={{
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.20)',
                borderRadius: 12,
                padding: '20px 22px',
                opacity: t.status === 'em_breve' ? 0.7 : 1,
                transition: 'background 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono', fontSize: '0.58rem',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    padding: '2px 8px', borderRadius: 4,
                    background: t.status === 'ativo' ? 'rgba(22,163,74,0.25)' : 'rgba(255,255,255,0.1)',
                    color: t.status === 'ativo' ? '#86efac' : 'rgba(255,255,255,0.5)',
                    border: `1px solid ${t.status === 'ativo' ? 'rgba(22,163,74,0.4)' : 'rgba(255,255,255,0.15)'}`,
                  }}>
                    {t.status === 'ativo' ? 'Ativo' : 'Em breve'}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '1rem', color: 'white', marginBottom: 8, lineHeight: 1.3 }}>
                  {t.nome}
                </h3>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: 16 }}>
                  {t.descricao}
                </p>
                {t.status === 'ativo' ? (
                  <Link href={`/territorios/${t.slug}`} style={{
                    fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.78rem',
                    color: 'var(--pci-cyan)', display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}>
                    Explorar território →
                  </Link>
                ) : (
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Em desenvolvimento
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Métricas */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { n: indicadores.length || '18', label: 'Indicadores', sub: 'sociográficos mapeados' },
                { n: programas.length || '16', label: 'Programas', sub: 'sociais em andamento' },
                { n: subTerritorios.length || '3', label: 'Territórios', sub: 'no Cinturão de Jacarepaguá' },
                { n: totalBeneficiarios > 0 ? (totalBeneficiarios / 1000).toFixed(0) + 'mil+' : '44mil+', label: 'Beneficiários', sub: 'atendidos pelo PCI' },
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

      {/* ── O QUE É O PCI ────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="pci-accent-line" />
            <h2 className="pci-title" style={{ fontSize: '2rem', marginBottom: 16 }}>O que é o Programa Cidade Integrada</h2>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.95rem', color: 'var(--pci-dim)', lineHeight: 1.8, marginBottom: 16 }}>
              O <strong>Programa Cidade Integrada</strong> é uma iniciativa do Governo do Estado do Rio de Janeiro que visa a integração entre bairros formais e informais através de investimentos em infraestrutura, melhorias de espaços públicos e garantia de acessibilidade.
            </p>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.95rem', color: 'var(--pci-dim)', lineHeight: 1.8, marginBottom: 24 }}>
              O programa atua em territórios historicamente conflagrados no âmbito da <strong>ADPF 635 do STF</strong>, promovendo o novo ordenamento socioterritorial.
            </p>
            <Link href="/territorios" className="pci-btn">Ver Territórios</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '👥', label: 'Social', desc: 'Ações e serviços sociais para a população' },
              { icon: '💼', label: 'Econômico', desc: 'Geração de renda e inclusão produtiva' },
              { icon: '🏗️', label: 'Infraestrutura', desc: 'Urbanismo social e obras públicas' },
              { icon: '🛡️', label: 'Segurança', desc: 'Planejamento e combate ao crime' },
              { icon: '📊', label: 'Transparência', desc: 'Dados abertos e prestação de contas' },
              { icon: '🤝', label: 'Diálogo', desc: 'Governança e participação comunitária' },
            ].map((eixo, i) => (
              <div key={i} className="pci-card p-4">
                <span style={{ fontSize: '1.4rem', display: 'block', marginBottom: 8 }}>{eixo.icon}</span>
                <p style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.85rem', color: 'var(--pci-navy)', marginBottom: 4 }}>{eixo.label}</p>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.75rem', color: 'var(--pci-dim)', lineHeight: 1.5 }}>{eixo.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── URBANISMO ────────────────────────────────── */}
      <section style={{ background: 'var(--pci-light)', borderTop: '1px solid var(--pci-border)', borderBottom: '1px solid var(--pci-border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="pci-accent-line" />
              <h2 className="pci-title" style={{ fontSize: '2rem' }}>Urbanismo</h2>
              <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.88rem', color: 'var(--pci-dim)', marginTop: 4 }}>
                {urbanismo.filter((u: any) => u.status === 'Executado').length} obras executadas · {urbanismo.filter((u: any) => u.status === 'Planejado').length} planejadas
              </p>
            </div>
            <Link href="/urbanismo" style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.85rem', color: 'var(--pci-blue)', fontWeight: 600 }}>
              Ver todas →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {urbanismo.slice(0, 6).map((u: any) => (
              <div key={u.id} className="pci-card p-5" style={{ borderLeft: `4px solid ${u.status === 'Executado' ? 'var(--pci-green)' : 'var(--pci-cyan)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, gap: 8 }}>
                  <span className="pci-tag">{u.tipo}</span>
                  <span className={`badge ${u.status === 'Executado' ? 'badge-green' : 'badge-amber'}`}>{u.status}</span>
                </div>
                <h3 style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '0.88rem', color: 'var(--pci-text)', marginBottom: 4 }}>{u.titulo}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROGRAMAS SOCIAIS ────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="pci-accent-line" />
            <h2 className="pci-title" style={{ fontSize: '2rem' }}>Programas Sociais</h2>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.88rem', color: 'var(--pci-dim)', marginTop: 4 }}>
              Cinturão de Jacarepaguá · {programas.length} programas cadastrados
            </p>
          </div>
          <Link href="/programas" style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.85rem', color: 'var(--pci-blue)', fontWeight: 600 }}>
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programas.slice(0, 6).map((p: any) => (
            <div key={p.id} className="pci-card p-5">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 8 }}>
                <span className="pci-tag">{p.programa?.tipo}</span>
                <span className={`badge ${p.status === 'Em execução' ? 'badge-green' : p.status === 'Concluída' ? 'badge-blue' : 'badge-gray'}`}>
                  {p.status}
                </span>
              </div>
              <h3 style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '0.9rem', color: 'var(--pci-text)', marginBottom: 6, lineHeight: 1.4 }}>{p.programa?.titulo}</h3>
              <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: 'var(--pci-dim)', lineHeight: 1.5, marginBottom: 12 }}>
                {p.programa?.descricao?.substring(0, 100)}...
              </p>
              {p.beneficiarios && (
                <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '1.2rem', color: 'var(--pci-blue)' }}>
                  {p.beneficiarios.toLocaleString('pt-BR')}
                  <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 400, fontSize: '0.65rem', color: 'var(--pci-muted)', marginLeft: 4 }}>
                    {p.unidade_beneficiarios}
                  </span>
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

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
              <Link href="/painel" className="pci-btn-white">Painel de Dados</Link>
              <Link href="/dados" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.875rem', padding: '12px 24px', borderRadius: 8, background: 'rgba(255,255,255,0.1)', color: 'white', border: '2px solid rgba(255,255,255,0.25)', display: 'inline-block' }}>
                Dados Abertos
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

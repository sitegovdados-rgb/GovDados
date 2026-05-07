import Link from 'next/link'
import { getTerritorios, getSubTerritorios, getProgramasSociais, getIndicadores } from '@/lib/directus'

export const revalidate = 3600

export default async function HomePage() {
  let territorios: any[] = []
  let subTerritorios: any[] = []
  let programas: any[] = []
  let indicadores: any[] = []

  try {
    territorios   = await getTerritorios()
    subTerritorios = await getSubTerritorios('Cinturão de Jacarepaguá')
    programas     = await getProgramasSociais('Cinturão de Jacarepaguá')
    indicadores   = await getIndicadores('Cinturão de Jacarepaguá')
  } catch (e) { console.error(e) }

  const totalBeneficiarios = programas.reduce((acc: number, p: any) => acc + (p.beneficiarios || 0), 0)
  const territorioAtivo = territorios.find((t: any) => t.status === 'ativo')

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, var(--pci-navy) 0%, #1e3a8a 100%)', color: 'white', position: 'relative', overflow: 'hidden' }}>
        {/* Decoração geométrica */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(0,168,204,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, right: 100, width: 240, height: 240, borderRadius: '50%', background: 'rgba(0,168,204,0.06)', pointerEvents: 'none' }} />

        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="pci-tag-navy mb-6">Governo do Estado do Rio de Janeiro · ADPF 635 · STF</span>
            <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', lineHeight: 1.1, marginBottom: 20, marginTop: 16 }}>
              Painel do Programa<br />
              <span style={{ color: 'var(--pci-cyan)' }}>Cidade Integrada</span>
            </h1>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 32, maxWidth: 560 }}>
              Dados, indicadores e intervenções do PCI nos territórios do Rio de Janeiro — transparência para gestores, pesquisadores e cidadãos.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href="/territorios/cinturao-jacarepagua" className="pci-btn-white">
                Explorar Cinturão de Jacarepaguá
              </Link>
              <Link href="/painel" style={{
                fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.875rem',
                padding: '12px 24px', borderRadius: 8,
                background: 'rgba(255,255,255,0.1)', color: 'white',
                border: '2px solid rgba(255,255,255,0.25)',
                display: 'inline-block', transition: 'all 0.2s',
              }}>
                Ver Painel de Dados
              </Link>
            </div>
          </div>
        </div>

        {/* Métricas no rodapé do hero */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.15)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { n: indicadores.filter((i: any) => i.area_tematica === 'Dados Demográficos').length || '21', label: 'Indicadores', sub: 'sociográficos mapeados' },
                { n: programas.length || '16', label: 'Programas', sub: 'sociais em andamento' },
                { n: subTerritorios.length || '3', label: 'Territórios', sub: 'no Cinturão de Jacarepaguá' },
                { n: totalBeneficiarios > 0 ? (totalBeneficiarios / 1000).toFixed(0) + 'mil+' : '39mil+', label: 'Beneficiários', sub: 'atendidos pelo PCI' },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: '20px 24px',
                  borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                }}>
                  <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '1.8rem', color: 'var(--pci-cyan)', lineHeight: 1, marginBottom: 4 }}>
                    {item.n}
                  </p>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.8rem', color: 'white', marginBottom: 2 }}>{item.label}</p>
                  <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>{item.sub}</p>
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
              O programa atua em territórios historicamente conflagrados no âmbito da <strong>ADPF 635 do STF</strong>, com ações relacionadas ao Plano de Retomada de Territórios, promovendo o novo ordenamento socioterritorial.
            </p>
            <Link href="/territorios" className="pci-btn">Ver Territórios</Link>
          </div>

          {/* Eixos de atuação */}
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
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: 8 }}>{eixo.icon}</span>
                <p style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.85rem', color: 'var(--pci-navy)', marginBottom: 4 }}>{eixo.label}</p>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.75rem', color: 'var(--pci-dim)', lineHeight: 1.5 }}>{eixo.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TERRITÓRIOS ──────────────────────────────── */}
      <section style={{ background: 'var(--pci-light)', borderTop: '1px solid var(--pci-border)', borderBottom: '1px solid var(--pci-border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="pci-accent-line" />
              <h2 className="pci-title" style={{ fontSize: '2rem' }}>Territórios</h2>
            </div>
            <Link href="/territorios" style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.85rem', color: 'var(--pci-blue)', fontWeight: 600 }}>
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(territorios.length > 0 ? territorios : [
              { nome: 'Cinturão de Jacarepaguá', slug: 'cinturao-jacarepagua', status: 'ativo', descricao: 'Gardênia Azul, Rio das Pedras e Corredor do Itanhangá' },
              { nome: 'Manguinhos e Jacarezinho', slug: 'manguinhos-jacarezinho', status: 'em_breve', descricao: 'Território da Zona Norte do Rio de Janeiro' },
              { nome: 'Pavão-Pavãozinho e Cantagalo', slug: 'ppg', status: 'em_breve', descricao: 'Território da Zona Sul do Rio de Janeiro' },
            ]).map((t: any) => (
              <div key={t.slug} className="pci-card p-6" style={{ opacity: t.status === 'em_breve' ? 0.65 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <span className={`badge ${t.status === 'ativo' ? 'badge-green' : 'badge-gray'}`}>
                    {t.status === 'ativo' ? 'Ativo' : 'Em breve'}
                  </span>
                </div>
                <h3 className="pci-title" style={{ fontSize: '1.1rem', marginBottom: 8 }}>{t.nome}</h3>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.82rem', color: 'var(--pci-dim)', lineHeight: 1.6, marginBottom: 16 }}>
                  {t.descricao}
                </p>
                {t.status === 'ativo' ? (
                  <Link href={`/territorios/${t.slug}`} className="pci-btn" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                    Explorar território
                  </Link>
                ) : (
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--pci-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Em desenvolvimento
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROGRAMAS SOCIAIS (prévia) ────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="pci-accent-line" />
            <h2 className="pci-title" style={{ fontSize: '2rem' }}>Programas Sociais</h2>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.9rem', color: 'var(--pci-dim)', marginTop: 6 }}>
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
                <span className="pci-tag">{p.tipo}</span>
                <span className={`badge ${p.status === 'Em Andamento' ? 'badge-green' : p.status === 'Realizado' ? 'badge-blue' : 'badge-gray'}`}>
                  {p.status}
                </span>
              </div>
              <h3 style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '0.9rem', color: 'var(--pci-text)', marginBottom: 6, lineHeight: 1.4 }}>{p.titulo}</h3>
              <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: 'var(--pci-dim)', lineHeight: 1.5, marginBottom: 12 }}>
                {p.descricao?.substring(0, 100)}...
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
        <div className="max-w-7xl mx-auto px-6 py-16">
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

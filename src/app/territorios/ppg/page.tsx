import Link from 'next/link'
import { getTerritorio, getIndicadoresPorSlug, getProgramasPorSlug, getEquipamentosPorSlug, getUrbanismoPorSlug } from '@/lib/directus'

export const revalidate = 3600

export default async function PPGPage() {
  let territorio: any = null
  let indicadores: any[] = []
  let programas: any[] = []
  let equipamentos: any[] = []
  let urbanismo: any[] = []

  try {
    territorio  = await getTerritorio('ppg')
    indicadores = await getIndicadoresPorSlug('ppg')
    programas   = await getProgramasPorSlug('ppg')
    equipamentos = await getEquipamentosPorSlug('ppg')
    urbanismo   = await getUrbanismoPorSlug('ppg')
  } catch (e) { console.error(e) }

  const totalPop = indicadores
    .filter(i => (i.nome || '').toLowerCase().includes('populaç') || (i.nome || '').toLowerCase().includes('habitantes'))
    .reduce((acc: number, i: any) => acc + (Number(i.valor) || 0), 0)

  const tiposEquip = [...new Set(equipamentos.map((e: any) => e.tipo))].sort()

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, var(--pci-navy) 0%, #1e3a8a 100%)', color: 'white', borderBottom: '3px solid var(--pci-cyan)' }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <Link href="/territorios" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Territórios
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--pci-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Pavão-Pavãozinho e Cantagalo
            </span>
          </div>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 12, lineHeight: 1.6, maxWidth: 500 }}>
            Área do Plano de Retomada de Territórios no Âmbito da A.D.P.F. 635 do STF
          </p>
          <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.1, marginBottom: 12 }}>
            Pavão-Pavãozinho<br />e Cantagalo
          </h1>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1rem', color: 'rgba(255,255,255,0.65)', maxWidth: 600, lineHeight: 1.7, marginBottom: 20 }}>
            {territorio?.descricao || 'Comunidades da Zona Sul do Rio de Janeiro, situadas na divisa entre Copacabana e Ipanema, no maciço da Tijuca.'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span className="pci-tag-navy">Zona Sul</span>
            <span className="pci-tag-navy">Copacabana · Ipanema</span>
            <span className="pci-tag-navy">ADPF 635 · STF</span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { valor: totalPop > 0 ? totalPop.toLocaleString('pt-BR') : '—', label: 'Habitantes', sub: 'Censo IBGE 2022' },
                { valor: String(programas.length || '—'), label: 'Programas', sub: 'sociais mapeados' },
                { valor: String(urbanismo.length || '—'), label: 'Intervenções', sub: 'urbanísticas' },
                { valor: String(equipamentos.length || '—'), label: 'Equipamentos', sub: 'públicos' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '16px 24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                  <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '1.6rem', color: 'var(--pci-cyan)', lineHeight: 1 }}>{item.valor}</p>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.78rem', color: 'white', marginTop: 4 }}>{item.label}</p>
                  <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.55rem', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Indicadores */}
        {indicadores.length > 0 && (
          <section className="mb-14">
            <div className="pci-accent-line" />
            <h2 className="pci-title" style={{ fontSize: '1.8rem', marginBottom: 6 }}>Indicadores Sociográficos</h2>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.9rem', color: 'var(--pci-dim)', marginBottom: 24 }}>
              {indicadores.length} indicadores · Fonte: IBGE Censo 2022 / PCI
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {indicadores.slice(0, 8).map((ind: any, i: number) => (
                <div key={i} className="pci-card p-5 text-center">
                  <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '1.5rem', color: 'var(--pci-navy)' }}>
                    {Number(ind.valor).toLocaleString('pt-BR')}
                  </p>
                  <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 4 }}>
                    {ind.unidade}
                  </p>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: 'var(--pci-dim)', marginTop: 6 }}>{ind.nome}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Programas Sociais */}
        {programas.length > 0 && (
          <section className="mb-14">
            <div className="pci-accent-line" />
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
              <h2 className="pci-title" style={{ fontSize: '1.8rem' }}>Programas Sociais</h2>
              <Link href="/programas" style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.85rem', color: 'var(--pci-blue)', fontWeight: 600 }}>Ver todos →</Link>
            </div>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.9rem', color: 'var(--pci-dim)', marginBottom: 24 }}>
              {programas.filter((p: any) => p.status === 'Em execução').length} em execução · {programas.filter((p: any) => p.status === 'Concluída').length} concluídos
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {programas.map((p: any, i: number) => (
                <div key={i} className="pci-card p-5">
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                    <span className="pci-tag">{p.programa?.tipo || p.tipo}</span>
                    <span className={`badge ${p.status === 'Em execução' ? 'badge-green' : 'badge-blue'}`}>{p.status}</span>
                  </div>
                  <h3 style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '0.9rem', color: 'var(--pci-text)', marginBottom: 6 }}>{p.programa?.titulo || p.titulo}</h3>
                  {p.beneficiarios && (
                    <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '1.2rem', color: 'var(--pci-blue)', marginTop: 8 }}>
                      {p.beneficiarios.toLocaleString('pt-BR')}
                      <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 400, fontSize: '0.6rem', color: 'var(--pci-muted)', marginLeft: 6 }}>{p.unidade_beneficiarios}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Equipamentos */}
        {equipamentos.length > 0 && (
          <section className="mb-14">
            <div className="pci-accent-line" />
            <h2 className="pci-title" style={{ fontSize: '1.8rem', marginBottom: 6 }}>Equipamentos Públicos</h2>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.9rem', color: 'var(--pci-dim)', marginBottom: 24 }}>
              {equipamentos.length} equipamentos mapeados
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tiposEquip.map((tipo: any) => {
                const itens = equipamentos.filter((e: any) => e.tipo === tipo)
                return (
                  <div key={tipo} className="pci-card p-6">
                    <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '1rem', color: 'var(--pci-navy)', marginBottom: 4 }}>{tipo}</h3>
                    <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--pci-muted)', marginBottom: 16 }}>
                      {itens.length} equipamento{itens.length !== 1 ? 's' : ''}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {itens.map((eq: any) => (
                        <div key={eq.id} style={{ padding: '8px 12px', background: 'var(--pci-light)', borderRadius: 6, borderLeft: '3px solid var(--pci-cyan)' }}>
                          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.8rem', fontWeight: 500, color: 'var(--pci-text)', marginBottom: 2 }}>{eq.nome}</p>
                          {eq.endereco && <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-muted)' }}>{eq.endereco}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Urbanismo */}
        {urbanismo.length > 0 && (
          <section>
            <div className="pci-accent-line" />
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
              <h2 className="pci-title" style={{ fontSize: '1.8rem' }}>Intervenções Urbanísticas</h2>
              <Link href="/urbanismo" style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.85rem', color: 'var(--pci-blue)', fontWeight: 600 }}>Ver todas →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {urbanismo.map((u: any) => (
                <div key={u.id} className="pci-card p-5" style={{ borderLeft: `4px solid ${u.status === 'Executado' ? 'var(--pci-green)' : 'var(--pci-cyan)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                    <span className="pci-tag">{u.tipo}</span>
                    <span className={`badge ${u.status === 'Executado' ? 'badge-green' : 'badge-amber'}`}>{u.status}</span>
                  </div>
                  <h3 style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '0.9rem', color: 'var(--pci-text)' }}>{u.titulo}</h3>
                </div>
              ))}
            </div>
          </section>
        )}

        {programas.length === 0 && indicadores.length === 0 && equipamentos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--pci-muted)' }}>
            <p style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>Dados em preparação</p>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Os dados deste território serão publicados em breve.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

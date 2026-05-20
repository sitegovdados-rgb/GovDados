import Link from 'next/link'
import { getSubTerritorios, getIndicadores, getProgramasTerritorio, getProgramasUrbanismo, getEquipamentos } from '@/lib/directus'
import { DashboardPCI } from '@/components/DashboardPCI'

export const revalidate = 3600

export default async function CinturaoPage() {
  let subTerritorios: any[] = []
  let indicadores: any[] = []
  let programas: any[] = []
  let urbanismo: any[] = []
  let equipamentos: any[] = []

  try {
    subTerritorios = await getSubTerritorios('cinturao-jacarepagua')
    indicadores    = await getIndicadores()
    programas      = await getProgramasTerritorio()
    urbanismo      = await getProgramasUrbanismo()
    equipamentos   = await getEquipamentos()
  } catch (e) { console.error(e) }

  const indPopTotal = indicadores.filter((i: any) => i.nome?.includes('Gardênia Azul') || i.nome?.includes('Corredor') || i.nome?.includes('Rio das Pedras'))
  const totalPop = indPopTotal.filter((i: any) => i.nome?.startsWith('População estimada')).reduce((acc: number, i: any) => acc + (i.valor || 0), 0)

  const tiposEquip = [...new Set(equipamentos.map((e: any) => e.tipo))].sort()
  const urbanismoExecutado = urbanismo.filter((u: any) => u.status === 'Concluído')
  const urbanismoPlanejado = urbanismo.filter((u: any) => u.status === 'Não iniciado' || u.status === 'Em execução')

  return (
    <div>
      {/* Header do território */}
      <section style={{ background: 'linear-gradient(135deg, var(--pci-navy) 0%, #1e3a8a 100%)', color: 'white', borderBottom: '3px solid var(--pci-cyan)' }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Link href="/territorios" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Territórios
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--pci-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Cinturão de Jacarepaguá
            </span>
          </div>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 12, lineHeight: 1.6, maxWidth: 500 }}>
            Área do Plano de Retomada de Territórios no Âmbito da A.D.P.F. 635 do STF
          </p>
          <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.1, marginBottom: 12 }}>
            Cinturão de Jacarepaguá
          </h1>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1rem', color: 'rgba(255,255,255,0.65)', maxWidth: 600, lineHeight: 1.7, marginBottom: 20 }}>
            Conjunto de comunidades na Zona Sudoeste do Rio de Janeiro, composto por três áreas: Gardênia Azul, Rio das Pedras e Corredor do Itanhangá.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span className="pci-tag-navy">XVI Região Administrativa</span>
            <span className="pci-tag-navy">Jacarepaguá · Zona Sudoeste</span>
            <span className="pci-tag-navy">ADPF 635 · STF</span>
          </div>
        </div>

        {/* Métricas do território */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { valor: totalPop > 0 ? totalPop.toLocaleString('pt-BR') : '111.552', label: 'Habitantes', sub: 'Censo IBGE 2022' },
                { valor: String(subTerritorios.length || 3), label: 'Áreas', sub: 'Gardênia Azul · Rio das Pedras · Corredor Itanhangá' },
                { valor: String(programas.length || 16), label: 'Programas sociais', sub: 'em andamento e realizados' },
                { valor: String(urbanismo.length || 18), label: 'Intervenções', sub: 'urbanísticas mapeadas' },
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

        {/* Territórios */}

        {/* Mapa do Cinturão */}
        <section className="mb-14">
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.8rem', marginBottom: 8 }}>Mapa do Território</h2>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.9rem', color: 'var(--pci-dim)', marginBottom: 20 }}>
            Delimitação do Cinturão de Jacarepaguá e seus três territórios — Gardênia Azul, Rio das Pedras e Corredor do Itanhangá.
          </p>
          <div className="pci-card overflow-hidden">
            <img
              src="/api/imagem?id=12LPbsK9WKx05oHHvqpeQnw-mJGAm2A78"
              alt="Mapa do Cinturão de Jacarepaguá"
              style={{ width: '100%', display: 'block', maxHeight: 600, objectFit: 'contain', background: '#f0f4f8' }}
            />
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--pci-border)' }}>
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Programa Cidade Integrada · Cinturão de Jacarepaguá · Rio de Janeiro
              </p>
            </div>
          </div>
        </section>

        <section className="mb-14">
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.8rem', marginBottom: 6 }}>Áreas</h2>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.9rem', color: 'var(--pci-dim)', marginBottom: 24 }}>
            Cada área agrupa um conjunto de favelas com características geográficas e históricas próximas.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subTerritorios.map((st: any) => (
              <div key={st.slug} className="pci-card p-6">
                <h3 className="pci-title" style={{ fontSize: '1.1rem', marginBottom: 8 }}>{st.nome}</h3>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.82rem', color: 'var(--pci-dim)', lineHeight: 1.6, marginBottom: 16 }}>
                  {st.descricao?.substring(0, 150)}...
                </p>
                {st.historia && (
                  <details style={{ cursor: 'pointer' }}>
                    <summary style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--pci-blue)', marginBottom: 8 }}>
                      Ver histórico
                    </summary>
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.8rem', color: 'var(--pci-dim)', lineHeight: 1.7, marginTop: 8 }}>
                      {st.historia}
                    </p>
                  </details>
                )}
                <Link href={`/territorios/cinturao-jacarepagua/${st.slug}`}
                  style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.8rem', color: 'var(--pci-blue)', display: 'block', marginTop: 16 }}>
                  Ver área →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Equipamentos Públicos */}
        <section className="mb-14">
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.8rem', marginBottom: 6 }}>Equipamentos Públicos</h2>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.9rem', color: 'var(--pci-dim)', marginBottom: 24 }}>
            {equipamentos.length} equipamentos públicos mapeados · Fontes: SMS, SME, SMAS 2023
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
                        <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-muted)' }}>{eq.endereco} · {eq.subtipo}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Programas Sociais */}
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
            {programas.slice(0, 8).map((p: any) => (
              <div key={p.id} className="pci-card p-5">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                  <span className="pci-tag">{p.programa?.tipo}</span>
                  <span className={`badge ${p.status === 'Em execução' ? 'badge-green' : 'badge-blue'}`}>{p.status}</span>
                </div>
                <h3 style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '0.9rem', color: 'var(--pci-text)', marginBottom: 6 }}>{p.programa?.titulo}</h3>
                {p.beneficiarios && (
                  <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '1.3rem', color: 'var(--pci-blue)', marginTop: 8 }}>
                    {p.beneficiarios.toLocaleString('pt-BR')}
                    <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 400, fontSize: '0.6rem', color: 'var(--pci-muted)', marginLeft: 6 }}>{p.unidade_beneficiarios}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Urbanismo */}
        <section className="mb-14">
          <div className="pci-accent-line" />
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
            <h2 className="pci-title" style={{ fontSize: '1.8rem' }}>Intervenções Urbanísticas</h2>
            <Link href="/urbanismo" style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.85rem', color: 'var(--pci-blue)', fontWeight: 600 }}>Ver todas →</Link>
          </div>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.9rem', color: 'var(--pci-dim)', marginBottom: 24 }}>
            {urbanismoExecutado.length} executadas · {urbanismoPlanejado.length} planejadas
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {urbanismo.slice(0, 8).map((u: any) => (
              <div key={u.id} className="pci-card p-5" style={{ borderLeft: `4px solid ${u.status === 'Concluído' ? 'var(--pci-green)' : 'var(--pci-cyan)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                  <span className="pci-tag">{u.tipologia || u.tipo || '—'}</span>
                  <span className={`badge ${u.status === 'Concluído' ? 'badge-green' : u.status === 'Em execução' ? 'badge-blue' : 'badge-amber'}`}>{u.status}</span>
                </div>
                <h3 style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '0.9rem', color: 'var(--pci-text)', marginBottom: 6 }}>{u.titulo}</h3>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: 'var(--pci-dim)', lineHeight: 1.5 }}>{u.descricao}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Painel de Dados PCI */}
        <section>
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.8rem', marginBottom: 8 }}>Painel de Dados</h2>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.9rem', color: 'var(--pci-dim)', marginBottom: 24 }}>
            Programas sociais e intervenções urbanísticas do Cinturão de Jacarepaguá.
          </p>
          <DashboardPCI territorioInicial="Cinturão de Jacarepaguá" modoEmbutido />
        </section>
      </div>
    </div>
  )
}

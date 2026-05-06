import Link from 'next/link'
import { getIndicadores, getProgramas, getRegioes } from '@/lib/directus'
import { CONTEXTO_FAVELAS_BRASIL, DADOS_FAVELAS } from '@/lib/ibge'
import GraficoBarras from '@/components/charts/GraficoBarras'
import GraficoPizza from '@/components/charts/GraficoPizza'
import MapaTerritorios from '@/components/maps/MapaTerritorios'

export const revalidate = 3600

export default async function HomePage() {
  let indicadores: any[] = []
  let programas: any[] = []
  let regioes: any[] = []

  try {
    indicadores = await getIndicadores()
    programas   = await getProgramas()
    regioes     = await getRegioes()
  } catch (e) { console.error(e) }

  const totalPop = regioes.reduce((acc: number, r: any) => acc + (r.populacao || 0), 0)
  const totalInv = indicadores
    .filter((i: any) => i.nome?.includes('Investimento PCI'))
    .reduce((acc: number, i: any) => acc + (i.valor || 0), 0)

  const rankings = Object.entries(DADOS_FAVELAS)
    .filter(([, d]) => d.ranking_moradores_brasil || d.ranking_domicilios_brasil)

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ background: 'var(--paper)', borderBottom: '2px solid var(--ink)' }}>
        <div className="max-w-7xl mx-auto">

          {/* Linha superior com tag */}
          <div style={{ borderBottom: '1px solid var(--rule)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="t-tag">Programa Cidade Integrada · Estado do Rio de Janeiro</span>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.6rem', color: 'var(--dim)', letterSpacing: '0.08em' }}>
              2022–2025
            </span>
          </div>

          {/* Título principal */}
          <div style={{ padding: '48px 24px 0', borderBottom: '1px solid var(--rule)' }}>
            <h1 className="t-title" style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', marginBottom: 24, maxWidth: '80%' }}>
              DADOS QUE REVELAM<br />
              POLÍTICAS PÚBLICAS
            </h1>
            <div style={{ paddingBottom: 32, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              <Link href="/painel" className="t-btn">Abrir Painel de Dados</Link>
              <Link href="/territorios" className="t-btn-outline">Explorar Territórios</Link>
              <p style={{ fontFamily: 'IBM Plex Sans', fontSize: '0.85rem', color: 'var(--dim)', maxWidth: 400, marginLeft: 8 }}>
                Indicadores, programas sociais e dados territoriais visualizados para gestores, pesquisadores e cidadãos.
              </p>
            </div>
          </div>

          {/* Grid de números grandes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[
              { n: '01', valor: totalPop > 0 ? totalPop.toLocaleString('pt-BR') : '141.168', unidade: 'Habitantes', sub: 'nos territórios do PCI' },
              { n: '02', valor: String(regioes.length || 5), unidade: 'Territórios', sub: 'atendidos pelo programa' },
              { n: '03', valor: String(programas.length || 29), unidade: 'Programas', sub: 'sociais em andamento' },
              { n: '04', valor: totalInv > 0 ? 'R$' + Math.round(totalInv / 1000000) + 'M' : 'R$630M', unidade: 'Investimento', sub: 'total do PCI' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '28px 24px',
                borderRight: i < 3 ? '1px solid var(--rule)' : 'none',
                borderTop: '1px solid var(--rule)',
              }}>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.55rem', color: 'var(--rule)', letterSpacing: '0.08em', display: 'block', marginBottom: 12 }}>
                  {item.n}
                </span>
                <p className="t-number" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--ink)', marginBottom: 4 }}>
                  {item.valor}
                </p>
                <p style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--mid)', marginBottom: 4 }}>
                  {item.unidade}
                </p>
                <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.6rem', color: 'var(--dim)', letterSpacing: '0.04em' }}>
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RANKINGS ─────────────────────────────────────────── */}
      <section style={{ background: 'var(--ink)', borderBottom: '2px solid var(--ink)' }}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 32 }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(248,246,241,0.3)', whiteSpace: 'nowrap' }}>
              Censo IBGE 2022
            </span>
            {rankings.map(([nome, d]) => (
              <div key={nome} style={{ display: 'flex', alignItems: 'center', gap: 12, borderLeft: '1px solid rgba(248,246,241,0.15)', paddingLeft: 32 }}>
                <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '2.5rem', color: 'var(--paper)', lineHeight: 1 }}>
                  #{d.ranking_moradores_brasil || d.ranking_domicilios_brasil}
                </span>
                <div>
                  <p style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '0.95rem', textTransform: 'uppercase', color: 'var(--paper)', letterSpacing: '0.04em' }}>
                    {nome}
                  </p>
                  <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.55rem', color: 'rgba(248,246,241,0.4)', letterSpacing: '0.06em' }}>
                    {d.ranking_moradores_brasil ? 'maior favela por moradores' : 'maior favela por domicílios'} no Brasil
                  </p>
                </div>
              </div>
            ))}
            <Link href="/territorios" style={{ marginLeft: 'auto', fontFamily: 'IBM Plex Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(248,246,241,0.4)', textDecoration: 'underline', whiteSpace: 'nowrap' }}>
              Ver territórios →
            </Link>
          </div>
        </div>
      </section>

      {/* ── MAPA ─────────────────────────────────────────────── */}
      <section style={{ borderBottom: '1px solid var(--rule)' }}>
        <div className="max-w-7xl mx-auto">
          <div style={{ padding: '32px 24px 20px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <h2 className="t-title" style={{ fontSize: '2.5rem' }}>TERRITÓRIOS NO MAPA</h2>
            <Link href="/territorios" style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--dim)', textDecoration: 'underline' }}>
              Análise completa →
            </Link>
          </div>
          <div style={{ padding: '0 24px 32px' }}>
            <MapaTerritorios regioes={regioes} />
          </div>
        </div>
      </section>

      {/* ── GRÁFICOS ─────────────────────────────────────────── */}
      <section style={{ background: 'var(--mark)', borderBottom: '2px solid var(--ink)', borderTop: '2px solid var(--ink)' }}>
        <div className="max-w-7xl mx-auto">
          <div style={{ padding: '32px 24px 20px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <h2 className="t-title" style={{ fontSize: '2.5rem' }}>VISUALIZAÇÕES</h2>
            <Link href="/painel" style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--dim)', textDecoration: 'underline' }}>
              Painel completo →
            </Link>
          </div>
          <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="grid-cols-1 lg:grid-cols-2">
            <GraficoBarras regioes={regioes} />
            <GraficoPizza programas={programas} />
          </div>
        </div>
      </section>

      {/* ── CONTEXTO NACIONAL ────────────────────────────────── */}
      <section style={{ borderBottom: '1px solid var(--rule)' }}>
        <div className="max-w-7xl mx-auto">
          <div style={{ padding: '32px 24px 20px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <h2 className="t-title" style={{ fontSize: '2.5rem' }}>CONTEXTO NACIONAL</h2>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.6rem', color: 'var(--dim)', letterSpacing: '0.08em' }}>IBGE · Censo 2022</span>
          </div>

          {/* Números do Brasil */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid var(--rule)' }}>
            {[
              { valor: CONTEXTO_FAVELAS_BRASIL.total_favelas.toLocaleString('pt-BR'), label: 'Favelas', sub: 'mapeadas no Brasil' },
              { valor: (CONTEXTO_FAVELAS_BRASIL.total_moradores / 1000000).toFixed(1).replace('.', ',') + 'M', label: 'Moradores', sub: 'brasileiros em favelas' },
              { valor: CONTEXTO_FAVELAS_BRASIL.percentual_pop + '%', label: 'Da população', sub: 'brasileira em favelas' },
              { valor: String(CONTEXTO_FAVELAS_BRASIL.municipios), label: 'Municípios', sub: 'com favelas mapeadas' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '24px',
                borderRight: i < 3 ? '1px solid var(--rule)' : 'none',
              }}>
                <p className="t-number" style={{ fontSize: '2.8rem', marginBottom: 4 }}>{item.valor}</p>
                <p style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--mid)' }}>{item.label}</p>
                <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.55rem', color: 'var(--dim)', letterSpacing: '0.04em', marginTop: 2 }}>{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Cards dos territórios */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: '24px', gap: 0 }}>
            {Object.entries(DADOS_FAVELAS).map(([nome, d], i) => (
              <div key={nome} style={{
                padding: '20px',
                borderRight: i % 3 < 2 ? '1px solid var(--rule)' : 'none',
                borderBottom: i < 3 ? '1px solid var(--rule)' : 'none',
              }}>
                <p style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: 6 }}>{nome}</p>
                {d.destaque && (
                  <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.58rem', color: 'var(--dim)', letterSpacing: '0.04em', marginBottom: 8, lineHeight: 1.5 }}>
                    ↑ {d.destaque}
                  </p>
                )}
                {d.moradores > 0 && (
                  <div style={{ display: 'flex', gap: 16, marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--rule)' }}>
                    <div>
                      <p className="t-number" style={{ fontSize: '1.3rem' }}>{d.moradores.toLocaleString('pt-BR')}</p>
                      <p className="t-label">moradores</p>
                    </div>
                    {d.domicilios > 0 && (
                      <div>
                        <p className="t-number" style={{ fontSize: '1.3rem' }}>{d.domicilios.toLocaleString('pt-BR')}</p>
                        <p className="t-label">domicílios</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section style={{ background: 'var(--ink)' }}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
            <h2 className="t-title" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: 'var(--paper)' }}>
              EXPLORE OS DADOS<br />COMPLETOS
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href="/painel" style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '14px 28px', background: 'var(--paper)', color: 'var(--ink)', border: '2px solid var(--paper)', display: 'inline-block' }}>
                Painel de Dados
              </Link>
              <Link href="/programas" style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '14px 28px', background: 'transparent', color: 'var(--paper)', border: '2px solid rgba(248,246,241,0.3)', display: 'inline-block' }}>
                Programas Sociais
              </Link>
              <Link href="/dados" style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '14px 28px', background: 'transparent', color: 'var(--paper)', border: '2px solid rgba(248,246,241,0.3)', display: 'inline-block' }}>
                Dados Abertos
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

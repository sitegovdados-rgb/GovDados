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
  const totalInvestimento = indicadores
    .filter((i: any) => i.nome?.includes('Investimento PCI'))
    .reduce((acc: number, i: any) => acc + (i.valor || 0), 0)
  const totalBeneficiarios = programas.reduce((acc: number, p: any) => acc + (p.beneficiarios || 0), 0)

  // Ranking nacional de destaque
  const rankingDestaque = Object.entries(DADOS_FAVELAS)
    .filter(([, d]) => d.ranking_moradores_brasil || d.ranking_domicilios_brasil)
    .map(([nome, d]) => ({ nome, ...d }))

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-white border-b" style={{ borderColor: 'var(--gov-border)' }}>
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-0">

          {/* Tag + título */}
          <div className="max-w-3xl mb-10">
            <span className="area-tag mb-4">Programa Cidade Integrada · Estado do Rio de Janeiro</span>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-5" style={{ color: 'var(--gov-text)' }}>
              Dados que revelam<br />
              <span style={{ color: 'var(--gov-accent)' }}>políticas públicas</span>
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-xl" style={{ color: 'var(--gov-textDim)' }}>
              Indicadores, programas sociais e dados territoriais do Programa Cidade Integrada — visualizados para gestores, pesquisadores e cidadãos.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/painel" className="btn-primary">Ver Painel Completo</Link>
              <Link href="/territorios" className="btn-outline">Explorar Territórios</Link>
            </div>
          </div>

          {/* Números grandes em linha */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-t" style={{ borderColor: 'var(--gov-border)' }}>
            {[
              { valor: totalPop > 0 ? totalPop.toLocaleString('pt-BR') : '141.168', unidade: 'habitantes', label: 'nos territórios do PCI' },
              { valor: regioes.length || '5', unidade: 'territórios', label: 'atendidos pelo programa' },
              { valor: programas.length || '29', unidade: 'programas', label: 'sociais em andamento' },
              { valor: totalInvestimento > 0 ? 'R$ ' + (totalInvestimento / 1000000).toFixed(0) + ' mi' : 'R$ 630 mi', unidade: 'investidos', label: 'pelo Programa Cidade Integrada' },
            ].map((item, i) => (
              <div key={i} className="py-8 px-6 border-r last:border-r-0" style={{ borderColor: 'var(--gov-border)' }}>
                <p className="font-display text-4xl font-bold leading-none mb-1" style={{ color: 'var(--gov-accent)' }}>
                  {item.valor}
                </p>
                <p className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--gov-text)' }}>
                  {item.unidade}
                </p>
                <p className="text-xs" style={{ color: 'var(--gov-muted)' }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RANKINGS NACIONAIS ───────────────────────────────── */}
      <section style={{ background: 'var(--gov-accent)' }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-wrap items-center gap-6">
            <span className="font-mono text-xs uppercase tracking-widest text-white/70">
              Censo IBGE 2022 — Favelas e Comunidades Urbanas
            </span>
            {rankingDestaque.map((r) => (
              <div key={r.nome} className="flex items-center gap-3">
                <span className="font-display text-2xl font-bold text-white">
                  #{r.ranking_moradores_brasil || r.ranking_domicilios_brasil}
                </span>
                <div>
                  <p className="font-body font-semibold text-white text-sm leading-none">{r.nome}</p>
                  <p className="font-mono text-[10px] text-white/70">
                    {r.ranking_moradores_brasil ? 'maior por moradores' : 'maior por domicílios'} no Brasil
                  </p>
                </div>
              </div>
            ))}
            <Link href="/territorios" className="ml-auto font-mono text-xs text-white/80 hover:text-white underline whitespace-nowrap">
              Ver todos os territórios →
            </Link>
          </div>
        </div>
      </section>

      {/* ── MAPA ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--gov-text)' }}>
            Territórios no Mapa
          </h2>
          <div className="gov-line flex-1" />
          <Link href="/territorios" className="font-mono text-xs hover:underline" style={{ color: 'var(--gov-accent)' }}>
            Ver análise completa →
          </Link>
        </div>
        <MapaTerritorios regioes={regioes} />
      </section>

      {/* ── GRÁFICOS ─────────────────────────────────────────── */}
      <section className="bg-white border-y" style={{ borderColor: 'var(--gov-border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--gov-text)' }}>
              Visualizações de Dados
            </h2>
            <div className="gov-line flex-1" />
            <Link href="/painel" className="font-mono text-xs hover:underline" style={{ color: 'var(--gov-accent)' }}>
              Ver painel completo →
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GraficoBarras regioes={regioes} />
            <GraficoPizza programas={programas} />
          </div>
        </div>
      </section>

      {/* ── CONTEXTO NACIONAL ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--gov-text)' }}>
            Contexto Nacional
          </h2>
          <div className="gov-line flex-1" />
          <span className="font-mono text-xs" style={{ color: 'var(--gov-muted)' }}>IBGE 2022</span>
        </div>

        <div className="gov-card p-8 mb-6" style={{ background: 'var(--gov-light)', borderColor: 'var(--gov-accent)' }}>
          <p className="font-mono text-xs uppercase tracking-widest mb-6" style={{ color: 'var(--gov-muted)' }}>
            Favelas e Comunidades Urbanas no Brasil — Censo 2022
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { valor: CONTEXTO_FAVELAS_BRASIL.total_favelas.toLocaleString('pt-BR'), label: 'favelas mapeadas no Brasil' },
              { valor: (CONTEXTO_FAVELAS_BRASIL.total_moradores / 1000000).toFixed(1).replace('.', ',') + ' mi', label: 'brasileiros em favelas' },
              { valor: CONTEXTO_FAVELAS_BRASIL.percentual_pop + '%', label: 'da população brasileira' },
              { valor: CONTEXTO_FAVELAS_BRASIL.municipios.toString(), label: 'municípios com favelas' },
            ].map((item, i) => (
              <div key={i}>
                <p className="font-display text-3xl font-bold mb-1" style={{ color: 'var(--gov-accent)' }}>{item.valor}</p>
                <p className="text-sm" style={{ color: 'var(--gov-textDim)' }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cards de territórios com ranking */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(DADOS_FAVELAS).map(([nome, d]) => (
            <div key={nome} className="gov-card p-5">
              <h3 className="font-display font-semibold mb-2" style={{ color: 'var(--gov-text)' }}>{nome}</h3>
              {d.destaque && (
                <p className="font-mono text-xs mb-3 font-medium" style={{ color: 'var(--gov-accent)' }}>
                  🏆 {d.destaque}
                </p>
              )}
              <p className="text-sm" style={{ color: 'var(--gov-textDim)' }}>{d.contexto}</p>
              {d.moradores > 0 && (
                <div className="flex gap-4 mt-3 pt-3 border-t" style={{ borderColor: 'var(--gov-border)' }}>
                  <div>
                    <p className="font-display font-bold" style={{ color: 'var(--gov-accent)' }}>
                      {d.moradores.toLocaleString('pt-BR')}
                    </p>
                    <p className="font-mono text-[10px]" style={{ color: 'var(--gov-muted)' }}>moradores</p>
                  </div>
                  {d.domicilios > 0 && (
                    <div>
                      <p className="font-display font-bold" style={{ color: 'var(--gov-text)' }}>
                        {d.domicilios.toLocaleString('pt-BR')}
                      </p>
                      <p className="font-mono text-[10px]" style={{ color: 'var(--gov-muted)' }}>domicílios</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────── */}
      <section className="bg-white border-t" style={{ borderColor: 'var(--gov-border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display text-3xl font-bold mb-4" style={{ color: 'var(--gov-text)' }}>
            Explore os dados completos
          </h2>
          <p className="mb-8 max-w-lg mx-auto" style={{ color: 'var(--gov-textDim)' }}>
            Acesse o painel com todos os indicadores, programas sociais e comparações territoriais.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/painel" className="btn-primary">Abrir Painel de Dados</Link>
            <Link href="/programas" className="btn-outline">Ver Programas Sociais</Link>
            <Link href="/dados" className="btn-outline">Dados Abertos</Link>
          </div>
        </div>
      </section>

    </div>
  )
}

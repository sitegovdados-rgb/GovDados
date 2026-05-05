import Link from 'next/link'
import { getIndicadores, getRegioes } from '@/lib/directus'
import KpiCard from '@/components/ui/KpiCard'

export const revalidate = 3600

export default async function HomePage() {
  let indicadores: any[] = []
  let regioes: any[] = []

  try {
    indicadores = await getIndicadores()
    regioes = await getRegioes()
  } catch (e) {
    console.error('Erro ao buscar dados:', e)
  }

  // KPIs de destaque — populacao e investimento
  const kpisDestaque = indicadores
    .filter(i =>
      i.nome.includes('Investimento PCI') ||
      i.nome.includes('Refeições') ||
      i.nome.includes('Resíduos removidos')
    )
    .slice(0, 3)

  // KPIs demográficos
  const kpisDemograficos = indicadores
    .filter(i => i.area_tematica === 'Dados Demográficos' && i.nome.includes('População total'))
    .slice(0, 4)

  const totalPopulacao = kpisDemograficos.reduce((acc, i) => acc + (i.valor || 0), 0)

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gov-bg border-b border-gov-border">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gov-bg to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <span className="area-tag mb-6 inline-block">Programa Cidade Integrada · RJ</span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-gov-text leading-tight mb-6">
              Dados que revelam<br />
              <span className="text-gov-highlight">políticas públicas</span>
            </h1>
            <p className="text-gov-textDim text-lg leading-relaxed mb-10 max-w-xl">
              Indicadores, programas sociais e dados territoriais do Programa Cidade Integrada — visualizados para gestores, pesquisadores e cidadãos.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/painel"
                className="px-6 py-3 bg-gov-accent hover:bg-gov-accent/80 text-white font-body font-medium rounded transition-colors"
              >
                Ver Painel de Dados
              </Link>
              <Link
                href="/dados"
                className="px-6 py-3 border border-gov-border hover:border-gov-accent text-gov-textDim hover:text-gov-text rounded transition-colors font-body"
              >
                Acessar Dados Abertos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Números em destaque */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-display text-2xl font-bold text-gov-text">Visão Geral</h2>
          <div className="gov-line flex-1" />
          <span className="font-mono text-xs text-gov-muted">IBGE Censo 2022 · PCI 2025</span>
        </div>

        {/* Card de total */}
        <div className="gov-card p-8 mb-6 bg-gov-accent/5 border-gov-accent/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="font-mono text-xs text-gov-muted uppercase tracking-widest mb-2">População Total</p>
              <p className="font-display text-5xl font-bold text-gov-highlight">
                {totalPopulacao > 0 ? totalPopulacao.toLocaleString('pt-BR') : '141.168'}
              </p>
              <p className="text-gov-textDim text-sm mt-1">habitantes nos territórios do PCI</p>
            </div>
            <div>
              <p className="font-mono text-xs text-gov-muted uppercase tracking-widest mb-2">Territórios Atendidos</p>
              <p className="font-display text-5xl font-bold text-gov-text">
                {regioes.length || 5}
              </p>
              <p className="text-gov-textDim text-sm mt-1">comunidades do Rio de Janeiro</p>
            </div>
            <div>
              <p className="font-mono text-xs text-gov-muted uppercase tracking-widest mb-2">Programas Sociais</p>
              <p className="font-display text-5xl font-bold text-gov-text">29</p>
              <p className="text-gov-textDim text-sm mt-1">iniciativas ativas nos territórios</p>
            </div>
          </div>
        </div>

        {/* KPIs de investimento */}
        {kpisDestaque.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {kpisDestaque.map((kpi: any) => (
              <KpiCard
                key={kpi.id}
                titulo={kpi.nome}
                valor={kpi.valor}
                unidade={kpi.unidade}
                area={kpi.area_tematica}
                territorio={kpi.territorio}
                destaque
              />
            ))}
          </div>
        )}

        {/* KPIs demográficos */}
        {kpisDemograficos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpisDemograficos.map((kpi: any) => (
              <KpiCard
                key={kpi.id}
                titulo={kpi.nome.replace('População total — ', '')}
                valor={kpi.valor}
                unidade={kpi.unidade}
                area="Demográfico"
              />
            ))}
          </div>
        )}
      </section>

      {/* Territórios */}
      <section className="bg-gov-surface border-y border-gov-border">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-display text-2xl font-bold text-gov-text">Territórios</h2>
            <div className="gov-line flex-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {(regioes.length > 0 ? regioes : [
              { nome: 'Jacarezinho', populacao: 29766, densidade: 78130 },
              { nome: 'Manguinhos', populacao: 17249, densidade: 51823 },
              { nome: 'Corredor Itanhangá', populacao: 29165, densidade: 41685 },
              { nome: 'Rio das Pedras', populacao: 64988, densidade: 101427 },
              { nome: 'PPG', populacao: null, densidade: null },
            ]).map((r: any) => (
              <Link
                key={r.nome}
                href={`/territorios`}
                className="gov-card p-5 block group"
              >
                <p className="font-display font-semibold text-gov-text group-hover:text-gov-highlight transition-colors mb-3 text-sm">
                  {r.nome}
                </p>
                {r.populacao && (
                  <p className="font-mono text-xs text-gov-textDim">
                    {r.populacao.toLocaleString('pt-BR')} hab.
                  </p>
                )}
                {r.densidade && (
                  <p className="font-mono text-xs text-gov-muted">
                    {r.densidade.toLocaleString('pt-BR')} hab/km²
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="font-display text-3xl font-bold text-gov-text mb-4">
          Explore os dados completos
        </h2>
        <p className="text-gov-textDim mb-8 max-w-lg mx-auto">
          Acesse o painel interativo com filtros por território, área temática e período.
        </p>
        <Link
          href="/painel"
          className="inline-block px-8 py-4 bg-gov-accent hover:bg-gov-accent/80 text-white font-body font-medium rounded transition-colors"
        >
          Abrir Painel Completo →
        </Link>
      </section>

    </div>
  )
}

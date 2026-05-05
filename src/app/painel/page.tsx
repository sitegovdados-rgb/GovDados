import { getIndicadores, getProgramas, getRegioes } from '@/lib/directus'
import KpiCard from '@/components/ui/KpiCard'

export const revalidate = 3600

export default async function PainelPage() {
  let indicadores: any[] = []
  let programas: any[] = []
  let regioes: any[] = []

  try {
    indicadores = await getIndicadores()
    programas   = await getProgramas()
    regioes     = await getRegioes()
  } catch (e) {
    console.error(e)
  }

  const areas = [...new Set(indicadores.map((i: any) => i.area_tematica))].sort()

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-12">
        <span className="area-tag mb-3 inline-block">Painel Executivo</span>
        <h1 className="font-display text-4xl font-bold text-gov-text mb-3">
          Indicadores do Programa Cidade Integrada
        </h1>
        <p className="text-gov-textDim max-w-2xl">
          Dados extraídos dos relatórios oficiais do PCI, Censo IBGE 2022 e INEA.
          Atualizado em 2025.
        </p>
      </div>

      {/* Sumário */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Indicadores', valor: indicadores.length },
          { label: 'Programas', valor: programas.length },
          { label: 'Territórios', valor: regioes.length },
          { label: 'Áreas temáticas', valor: areas.length },
        ].map(s => (
          <div key={s.label} className="gov-card p-5 text-center">
            <p className="font-display text-3xl font-bold text-gov-highlight">{s.valor}</p>
            <p className="font-mono text-xs text-gov-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Indicadores por área */}
      {areas.map(area => {
        const grupo = indicadores.filter((i: any) => i.area_tematica === area)
        return (
          <section key={area} className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-display text-xl font-semibold text-gov-text">{area}</h2>
              <div className="gov-line flex-1" />
              <span className="font-mono text-xs text-gov-muted">{grupo.length} indicador{grupo.length !== 1 ? 'es' : ''}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {grupo.map((kpi: any) => (
                <KpiCard
                  key={kpi.id}
                  titulo={kpi.nome}
                  valor={kpi.valor}
                  unidade={kpi.unidade}
                  territorio={kpi.territorio}
                />
              ))}
            </div>
          </section>
        )
      })}

      {/* Programas sociais */}
      <section className="mt-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-display text-2xl font-bold text-gov-text">Programas Sociais</h2>
          <div className="gov-line flex-1" />
          <span className="font-mono text-xs text-gov-muted">{programas.length} programas</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programas.map((p: any) => (
            <div key={p.id} className="gov-card p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="area-tag">{p.area_tematica}</span>
                <span className="font-mono text-xs text-gov-muted">{p.periodo}</span>
              </div>
              <h3 className="font-body font-semibold text-gov-text mb-1">{p.titulo}</h3>
              <p className="text-gov-textDim text-sm mb-3">{p.descricao}</p>
              <div className="flex items-center gap-4">
                {p.beneficiarios && (
                  <span className="font-display font-bold text-gov-highlight text-lg">
                    {p.beneficiarios.toLocaleString('pt-BR')}
                    <span className="font-mono text-xs text-gov-muted ml-1">{p.unidade_beneficiarios}</span>
                  </span>
                )}
                <span className={`font-mono text-xs px-2 py-1 rounded ${
                  p.status === 'Ativo'
                    ? 'bg-green-900/30 text-green-400 border border-green-900'
                    : 'bg-gov-surface text-gov-muted border border-gov-border'
                }`}>
                  {p.status}
                </span>
              </div>
              {p.territorio && (
                <p className="font-mono text-xs text-gov-muted mt-2">📍 {p.territorio}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

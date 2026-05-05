import { getIndicadores, getProgramas, getRegioes } from '@/lib/directus'
import KpiCard from '@/components/ui/KpiCard'
import GraficoBarras from '@/components/charts/GraficoBarras'
import GraficoPizza from '@/components/charts/GraficoPizza'
import GraficoInvestimentos from '@/components/charts/GraficoInvestimentos'
import MapaTerritorios from '@/components/maps/MapaTerritorios'

export const revalidate = 3600

export default async function PainelPage() {
  let indicadores: any[] = []
  let programas: any[] = []
  let regioes: any[] = []
  try {
    indicadores = await getIndicadores()
    programas   = await getProgramas()
    regioes     = await getRegioes()
  } catch (e) { console.error(e) }

  const areasSet = new Set<string>(indicadores.map((i: any) => i.area_tematica as string))
  const areas = Array.from(areasSet).sort()

  const kpisDestaque = indicadores.filter((i: any) =>
    i.nome?.includes('Investimento PCI') ||
    i.nome?.includes('Refeições') ||
    i.nome?.includes('Resíduos') ||
    i.nome?.includes('Microcrédito')
  ).slice(0, 4)

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <span className="area-tag mb-3">Painel Executivo</span>
        <h1 className="font-display text-4xl font-bold mb-2" style={{ color: 'var(--gov-text)' }}>
          Indicadores do Programa Cidade Integrada
        </h1>
        <p style={{ color: 'var(--gov-textDim)' }}>
          Dados extraídos dos relatórios oficiais do PCI, Censo IBGE 2022 e INEA. Atualizado em 2025.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Indicadores',     valor: indicadores.length },
          { label: 'Programas',       valor: programas.length },
          { label: 'Áreas temáticas', valor: areas.length },
          { label: 'Territórios',     valor: regioes.length || 5 },
        ].map(s => (
          <div key={s.label} className="gov-card p-5 text-center">
            <p className="font-display text-3xl font-bold" style={{ color: 'var(--gov-accent)' }}>{s.valor}</p>
            <p className="font-mono text-xs mt-1" style={{ color: 'var(--gov-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {kpisDestaque.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {kpisDestaque.map((k: any) => (
            <KpiCard key={k.id} titulo={k.nome} valor={k.valor} unidade={k.unidade} area={k.area_tematica} territorio={k.territorio} destaque />
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--gov-text)' }}>Visualizações</h2>
        <div className="gov-line flex-1" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <GraficoBarras regioes={regioes} />
        <GraficoPizza programas={programas} />
      </div>

      <div className="mb-10">
        <GraficoInvestimentos />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--gov-text)' }}>Mapa</h2>
        <div className="gov-line flex-1" />
      </div>

      <div className="mb-12">
        <MapaTerritorios regioes={regioes} />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--gov-text)' }}>Todos os Indicadores</h2>
        <div className="gov-line flex-1" />
      </div>

      {areas.map((area: string) => {
        const grupo = indicadores.filter((i: any) => i.area_tematica === area)
        return (
          <section key={area} className="mb-10">
            <div className="flex items-center gap-4 mb-5">
              <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--gov-text)' }}>{area}</h3>
              <div className="gov-line flex-1" />
              <span className="font-mono text-xs" style={{ color: 'var(--gov-muted)' }}>{grupo.length}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {grupo.map((k: any) => (
                <KpiCard key={k.id} titulo={k.nome} valor={k.valor} unidade={k.unidade} territorio={k.territorio} />
              ))}
            </div>
          </section>
        )
      })}

      <div className="flex items-center gap-4 mb-6 mt-8">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--gov-text)' }}>Programas Sociais</h2>
        <div className="gov-line flex-1" />
        <span className="font-mono text-xs" style={{ color: 'var(--gov-muted)' }}>{programas.length} programas</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programas.map((p: any) => (
          <div key={p.id} className="gov-card p-5">
            <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
              <span className="area-tag">{p.area_tematica}</span>
              <span className="font-mono text-xs" style={{ color: 'var(--gov-muted)' }}>{p.periodo}</span>
            </div>
            <h3 className="font-body font-semibold mb-1" style={{ color: 'var(--gov-text)' }}>{p.titulo}</h3>
            <p className="text-sm mb-3" style={{ color: 'var(--gov-textDim)' }}>{p.descricao}</p>
            <div className="flex items-center gap-3 flex-wrap">
              {p.beneficiarios && (
                <span className="font-display font-bold text-xl" style={{ color: 'var(--gov-accent)' }}>
                  {p.beneficiarios.toLocaleString('pt-BR')}
                  <span className="font-mono text-xs ml-1" style={{ color: 'var(--gov-muted)' }}>{p.unidade_beneficiarios}</span>
                </span>
              )}
              <span className={`font-mono text-xs px-2 py-0.5 rounded border ${p.status === 'Ativo' ? 'text-green-700 bg-green-50 border-green-200' : 'border-gray-200 text-gray-500'}`}>
                {p.status}
              </span>
            </div>
            {p.territorio && <p className="font-mono text-xs mt-2" style={{ color: 'var(--gov-muted)' }}>📍 {p.territorio}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

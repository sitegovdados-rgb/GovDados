import { getIndicadores, getProgramas, getRegioes } from '@/lib/directus'

export const revalidate = 3600

export default async function DadosPage() {
  let indicadores: any[] = []
  let programas: any[]   = []
  let regioes: any[]     = []

  try {
    indicadores = await getIndicadores()
    programas   = await getProgramas()
    regioes     = await getRegioes()
  } catch (e) { console.error(e) }

  const datasets = [
    {
      titulo: 'Indicadores',
      descricao: 'KPIs e métricas dos territórios do PCI — dados demográficos, educação, saúde, saneamento e investimentos.',
      registros: indicadores.length,
      campos: ['nome', 'valor', 'unidade', 'area_tematica', 'territorio', 'fonte', 'ano'],
      endpoint: '/items/indicadores',
    },
    {
      titulo: 'Programas Sociais',
      descricao: 'Programas e projetos sociais ativos nos territórios, com número de beneficiários e área temática.',
      registros: programas.length,
      campos: ['titulo', 'area_tematica', 'territorio', 'beneficiarios', 'unidade_beneficiarios', 'periodo', 'status'],
      endpoint: '/items/programas',
    },
    {
      titulo: 'Regiões / Territórios',
      descricao: 'Perfil sociodemográfico dos territórios com população, área, densidade e coordenadas geográficas.',
      registros: regioes.length,
      campos: ['nome', 'populacao', 'area_km2', 'densidade', 'latitude', 'longitude'],
      endpoint: '/items/regioes',
    },
  ]

  const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <span className="area-tag mb-3 inline-block">Transparência</span>
        <h1 className="font-display text-4xl font-bold text-gov-text mb-3">Dados Abertos</h1>
        <p className="text-gov-textDim max-w-2xl">
          Acesse os dados diretamente via API REST. Todos os dados são públicos e podem ser
          utilizados livremente com atribuição da fonte.
        </p>
      </div>

      {/* API Base */}
      <div className="gov-card p-6 mb-10 bg-gov-accent/5 border-gov-accent/30">
        <p className="font-mono text-xs text-gov-muted mb-2">BASE DA API</p>
        <code className="font-mono text-gov-highlight text-sm break-all">{baseUrl}</code>
        <p className="text-gov-textDim text-sm mt-2">
          API REST gerada automaticamente pelo Directus. Consulte a{' '}
          <a href="https://docs.directus.io/reference/items" target="_blank" rel="noopener noreferrer"
             className="text-gov-highlight hover:underline">documentação do Directus</a> para filtros avançados.
        </p>
      </div>

      {/* Datasets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {datasets.map(d => (
          <div key={d.titulo} className="gov-card p-6 flex flex-col">
            <h2 className="font-display text-xl font-semibold text-gov-text mb-2">{d.titulo}</h2>
            <p className="text-gov-textDim text-sm mb-4 flex-1">{d.descricao}</p>
            <div className="space-y-3">
              <div>
                <p className="font-mono text-xs text-gov-muted mb-1">REGISTROS</p>
                <p className="font-display font-bold text-gov-highlight text-2xl">{d.registros}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-gov-muted mb-2">CAMPOS</p>
                <div className="flex flex-wrap gap-1">
                  {d.campos.map(c => (
                    <code key={c} className="font-mono text-[10px] text-gov-textDim bg-gov-bg px-1.5 py-0.5 rounded border border-gov-border">
                      {c}
                    </code>
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t border-gov-border">
                <p className="font-mono text-xs text-gov-muted mb-1">ENDPOINT</p>
                <a
                  href={`${baseUrl}${d.endpoint}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-gov-highlight hover:underline break-all"
                >
                  {d.endpoint}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Exemplos de uso */}
      <section>
        <div className="flex items-center gap-4 mb-6">
          <h2 className="font-display text-2xl font-bold text-gov-text">Exemplos de uso</h2>
          <div className="gov-line flex-1" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              titulo: 'Todos os indicadores',
              code: `GET ${baseUrl}/items/indicadores`,
            },
            {
              titulo: 'Filtrar por território',
              code: `GET ${baseUrl}/items/indicadores?filter[territorio][_eq]=Jacarezinho`,
            },
            {
              titulo: 'Filtrar por área temática',
              code: `GET ${baseUrl}/items/indicadores?filter[area_tematica][_eq]=Educação`,
            },
            {
              titulo: 'Programas ativos',
              code: `GET ${baseUrl}/items/programas?filter[status][_eq]=Ativo`,
            },
          ].map(ex => (
            <div key={ex.titulo} className="gov-card p-5">
              <p className="font-body font-medium text-gov-text text-sm mb-2">{ex.titulo}</p>
              <code className="block font-mono text-xs text-gov-highlight bg-gov-bg p-3 rounded border border-gov-border break-all">
                {ex.code}
              </code>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

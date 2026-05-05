import { getIndicadores, getProgramas, getRegioes } from '@/lib/directus'

export const revalidate = 3600

export default async function DadosPage() {
  let indicadores: any[] = []
  let programas: any[] = []
  let regioes: any[] = []
  try {
    indicadores = await getIndicadores()
    programas = await getProgramas()
    regioes = await getRegioes()
  } catch (e) { console.error(e) }

  const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-7e52.up.railway.app'

  const datasets = [
    { titulo: 'Indicadores', registros: indicadores.length, endpoint: '/items/indicadores', campos: ['nome','valor','unidade','area_tematica','territorio','fonte','ano'] },
    { titulo: 'Programas', registros: programas.length, endpoint: '/items/programas', campos: ['titulo','area_tematica','territorio','beneficiarios','periodo','status'] },
    { titulo: 'Regiões', registros: regioes.length, endpoint: '/items/regioes', campos: ['nome','populacao','area_km2','densidade','latitude','longitude'] },
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <span className="area-tag mb-3">Transparência</span>
        <h1 className="font-display text-4xl font-bold mb-2" style={{ color: 'var(--gov-text)' }}>Dados Abertos</h1>
        <p style={{ color: 'var(--gov-textDim)' }}>Acesse os dados diretamente via API REST. Todos os dados são públicos.</p>
      </div>

      <div className="gov-card p-6 mb-10" style={{ background: 'var(--gov-light)', borderColor: 'var(--gov-accent)' }}>
        <p className="font-mono text-xs mb-2" style={{ color: 'var(--gov-muted)' }}>BASE DA API</p>
        <code className="font-mono text-sm break-all" style={{ color: 'var(--gov-accent)' }}>{baseUrl}</code>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {datasets.map(d => (
          <div key={d.titulo} className="gov-card p-6 flex flex-col gap-4">
            <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--gov-text)' }}>{d.titulo}</h2>
            <div>
              <p className="font-mono text-xs mb-1" style={{ color: 'var(--gov-muted)' }}>REGISTROS</p>
              <p className="font-display font-bold text-2xl" style={{ color: 'var(--gov-accent)' }}>{d.registros}</p>
            </div>
            <div>
              <p className="font-mono text-xs mb-2" style={{ color: 'var(--gov-muted)' }}>CAMPOS</p>
              <div className="flex flex-wrap gap-1">
                {d.campos.map(c => (
                  <code key={c} className="font-mono text-[10px] px-1.5 py-0.5 rounded border" style={{ background: 'var(--gov-bg)', borderColor: 'var(--gov-border)', color: 'var(--gov-textDim)' }}>{c}</code>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t mt-auto" style={{ borderColor: 'var(--gov-border)' }}>
              <a href={`${baseUrl}${d.endpoint}`} target="_blank" rel="noopener noreferrer"
                className="font-mono text-xs break-all hover:underline" style={{ color: 'var(--gov-accent)' }}>
                {d.endpoint}
              </a>
            </div>
          </div>
        ))}
      </div>

      <section>
        <div className="flex items-center gap-4 mb-6">
          <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--gov-text)' }}>Exemplos de uso</h2>
          <div className="gov-line flex-1" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { titulo: 'Todos os indicadores', code: `GET ${baseUrl}/items/indicadores` },
            { titulo: 'Filtrar por território', code: `GET ${baseUrl}/items/indicadores?filter[territorio][_eq]=Jacarezinho` },
            { titulo: 'Filtrar por área temática', code: `GET ${baseUrl}/items/indicadores?filter[area_tematica][_eq]=Educação` },
            { titulo: 'Programas ativos', code: `GET ${baseUrl}/items/programas?filter[status][_eq]=Ativo` },
          ].map(ex => (
            <div key={ex.titulo} className="gov-card p-5">
              <p className="font-body font-medium text-sm mb-2" style={{ color: 'var(--gov-text)' }}>{ex.titulo}</p>
              <code className="block font-mono text-xs p-3 rounded border break-all" style={{ background: 'var(--gov-bg)', borderColor: 'var(--gov-border)', color: 'var(--gov-accent)' }}>{ex.code}</code>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

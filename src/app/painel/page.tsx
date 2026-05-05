import { getIndicadores, getProgramas } from '@/lib/directus'
import KpiCard from '@/components/ui/KpiCard'

export const revalidate = 3600

export default async function PainelPage() {
  let indicadores: any[] = []
  let programas: any[] = []
  try {
    indicadores = await getIndicadores()
    programas = await getProgramas()
  } catch (e) { console.error(e) }

  const areasSet = new Set<string>(indicadores.map((i: any) => i.area_tematica as string))
  const areas = Array.from(areasSet).sort()

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <span className="area-tag mb-3">Painel Executivo</span>
        <h1 className="font-display text-4xl font-bold mb-2" style={{ color: 'var(--gov-text)' }}>Indicadores</h1>
        <p style={{ color: 'var(--gov-textDim)' }}>Dados extraídos dos relatórios oficiais do PCI, Censo IBGE 2022 e INEA.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Indicadores',     valor: indicadores.length },
          { label: 'Programas',       valor: programas.length },
          { label: 'Áreas temáticas', valor: areas.length },
          { label: 'Territórios',     valor: 5 },
        ].map(s => (
          <div key={s.label} className="gov-card p-5 text-center">
            <p className="font-display text-3xl font-bold" style={{ color: 'var(--gov-accent)' }}>{s.valor}</p>
            <p className="font-mono text-xs mt-1" style={{ color: 'var(--gov-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {areas.map((area: string) => {
        const grupo = indicadores.filter((i: any) => i.area_tematica === area)
        return (
          <section key={area} className="mb-12">
            <div className="flex items-center gap-4 mb-5">
              <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--gov-text)' }}>{area}</h2>
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

      <section className="mt-16">
        <div className="flex items-center gap-4 mb-8">
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
      </section>
    </div>
  )
}

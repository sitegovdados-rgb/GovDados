import { getProgramas } from '@/lib/directus'

export const revalidate = 3600

export default async function ProgramasPage() {
  let programas: any[] = []
  try { programas = await getProgramas() } catch (e) { console.error(e) }

  const areasSet = new Set<string>(programas.map((p: any) => p.area_tematica as string))
  const areas = Array.from(areasSet).sort()

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <span className="area-tag mb-3">Programas e Projetos</span>
        <h1 className="font-display text-4xl font-bold mb-2" style={{ color: 'var(--gov-text)' }}>Programas Sociais</h1>
        <p style={{ color: 'var(--gov-textDim)' }}>Iniciativas do Programa Cidade Integrada nos territórios do Rio de Janeiro.</p>
      </div>
      {areas.map((area: string) => {
        const grupo = programas.filter((p: any) => p.area_tematica === area)
        return (
          <section key={area} className="mb-12">
            <div className="flex items-center gap-4 mb-5">
              <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--gov-text)' }}>{area}</h2>
              <div className="gov-line flex-1" />
              <span className="font-mono text-xs" style={{ color: 'var(--gov-muted)' }}>{grupo.length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {grupo.map((p: any) => (
                <div key={p.id} className="gov-card p-5 flex flex-col gap-3">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <span className="font-mono text-xs" style={{ color: 'var(--gov-muted)' }}>{p.periodo}</span>
                    <span className={`font-mono text-xs px-2 py-0.5 rounded border ${p.status === 'Ativo' ? 'text-green-700 bg-green-50 border-green-200' : 'border-gray-200 text-gray-500'}`}>{p.status}</span>
                  </div>
                  <h3 className="font-body font-semibold" style={{ color: 'var(--gov-text)' }}>{p.titulo}</h3>
                  <p className="text-sm flex-1" style={{ color: 'var(--gov-textDim)' }}>{p.descricao}</p>
                  {p.beneficiarios && (
                    <div className="pt-2 border-t" style={{ borderColor: 'var(--gov-border)' }}>
                      <span className="font-display font-bold text-xl" style={{ color: 'var(--gov-accent)' }}>
                        {p.beneficiarios.toLocaleString('pt-BR')}
                      </span>
                      <span className="font-mono text-xs ml-1" style={{ color: 'var(--gov-muted)' }}>{p.unidade_beneficiarios}</span>
                    </div>
                  )}
                  {p.territorio && <p className="font-mono text-xs" style={{ color: 'var(--gov-muted)' }}>📍 {p.territorio}</p>}
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

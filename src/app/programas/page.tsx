import { getProgramas } from '@/lib/directus'

export const revalidate = 3600

export default async function ProgramasPage() {
  let programas: any[] = []
  try { programas = await getProgramas() } catch (e) { console.error(e) }

  const areas = [...new Set(programas.map((p: any) => p.area_tematica))].sort()

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <span className="area-tag mb-3 inline-block">Programas e Projetos</span>
        <h1 className="font-display text-4xl font-bold text-gov-text mb-3">
          Programas Sociais
        </h1>
        <p className="text-gov-textDim max-w-2xl">
          Iniciativas do Programa Cidade Integrada nos territórios do Rio de Janeiro.
        </p>
      </div>

      {areas.map(area => {
        const grupo = programas.filter((p: any) => p.area_tematica === area)
        return (
          <section key={area} className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-display text-xl font-semibold text-gov-text">{area}</h2>
              <div className="gov-line flex-1" />
              <span className="font-mono text-xs text-gov-muted">{grupo.length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {grupo.map((p: any) => (
                <div key={p.id} className="gov-card p-5 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs text-gov-muted">{p.periodo}</span>
                    <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                      p.status === 'Ativo'
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-gov-surface text-gov-muted'
                    }`}>{p.status}</span>
                  </div>
                  <h3 className="font-body font-semibold text-gov-text">{p.titulo}</h3>
                  <p className="text-gov-textDim text-sm flex-1">{p.descricao}</p>
                  {p.beneficiarios && (
                    <div className="pt-2 border-t border-gov-border">
                      <span className="font-display font-bold text-gov-highlight">
                        {p.beneficiarios.toLocaleString('pt-BR')}
                      </span>
                      <span className="font-mono text-xs text-gov-muted ml-1">
                        {p.unidade_beneficiarios}
                      </span>
                    </div>
                  )}
                  {p.territorio && (
                    <p className="font-mono text-xs text-gov-muted">📍 {p.territorio}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

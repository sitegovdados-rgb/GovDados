import { getRegioes, getIndicadores } from '@/lib/directus'

export const revalidate = 3600

export default async function TerritoriosPage() {
  let regioes: any[] = []
  let indicadores: any[] = []
  try {
    regioes = await getRegioes()
    indicadores = await getIndicadores()
  } catch (e) { console.error(e) }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <span className="area-tag mb-3">Dados Territoriais</span>
        <h1 className="font-display text-4xl font-bold mb-2" style={{ color: 'var(--gov-text)' }}>Territórios</h1>
        <p style={{ color: 'var(--gov-textDim)' }}>Perfil sociodemográfico dos territórios atendidos pelo Programa Cidade Integrada. Dados do Censo IBGE 2022.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {regioes.map((r: any) => {
          const inds = indicadores.filter((i: any) => i.territorio?.includes(r.nome)).slice(0, 4)
          return (
            <div key={r.id} className="gov-card p-6">
              <div className="flex items-start justify-between mb-5 flex-wrap gap-2">
                <div>
                  <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--gov-text)' }}>{r.nome}</h2>
                  <p className="font-mono text-xs" style={{ color: 'var(--gov-muted)' }}>{r.municipio} · {r.estado}</p>
                </div>
                <span className="area-tag">Território PCI</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-5">
                {r.populacao > 0 && (
                  <div>
                    <p className="font-mono text-xs mb-1" style={{ color: 'var(--gov-muted)' }}>População</p>
                    <p className="font-display font-bold text-xl" style={{ color: 'var(--gov-accent)' }}>{r.populacao.toLocaleString('pt-BR')}</p>
                  </div>
                )}
                {r.densidade > 0 && (
                  <div>
                    <p className="font-mono text-xs mb-1" style={{ color: 'var(--gov-muted)' }}>Densidade</p>
                    <p className="font-display font-bold text-xl" style={{ color: 'var(--gov-text)' }}>{r.densidade.toLocaleString('pt-BR')}<span className="font-mono text-xs ml-1" style={{ color: 'var(--gov-muted)' }}>hab/km²</span></p>
                  </div>
                )}
                {r.area_km2 > 0 && (
                  <div>
                    <p className="font-mono text-xs mb-1" style={{ color: 'var(--gov-muted)' }}>Área</p>
                    <p className="font-display font-bold text-xl" style={{ color: 'var(--gov-text)' }}>{r.area_km2}<span className="font-mono text-xs ml-1" style={{ color: 'var(--gov-muted)' }}>km²</span></p>
                  </div>
                )}
              </div>
              {inds.length > 0 && (
                <>
                  <div className="gov-line mb-4" />
                  <div className="space-y-2">
                    {inds.map((i: any) => (
                      <div key={i.id} className="flex justify-between items-center gap-2">
                        <span className="text-xs truncate flex-1" style={{ color: 'var(--gov-textDim)' }}>{i.nome.replace(`— ${r.nome}`, '').trim()}</span>
                        <span className="font-mono text-xs whitespace-nowrap" style={{ color: 'var(--gov-accent)' }}>{typeof i.valor === 'number' ? i.valor.toLocaleString('pt-BR') : i.valor} {i.unidade}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

import { getRegioes, getIndicadores } from '@/lib/directus'

export const revalidate = 3600

export default async function TerritoriosPage() {
  let regioes: any[] = []
  let indicadores: any[] = []
  try {
    regioes     = await getRegioes()
    indicadores = await getIndicadores()
  } catch (e) { console.error(e) }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <span className="area-tag mb-3 inline-block">Dados Territoriais</span>
        <h1 className="font-display text-4xl font-bold text-gov-text mb-3">Territórios</h1>
        <p className="text-gov-textDim max-w-2xl">
          Perfil sociodemográfico dos territórios atendidos pelo Programa Cidade Integrada.
          Dados do Censo IBGE 2022.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {regioes.map((r: any) => {
          const indsTerritorios = indicadores.filter((i: any) =>
            i.territorio?.includes(r.nome)
          )

          return (
            <div key={r.id} className="gov-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-gov-text">{r.nome}</h2>
                  <p className="font-mono text-xs text-gov-muted">{r.municipio} · {r.estado}</p>
                </div>
                <span className="area-tag">Território PCI</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {r.populacao > 0 && (
                  <div>
                    <p className="font-mono text-xs text-gov-muted mb-1">População</p>
                    <p className="font-display font-bold text-gov-highlight text-xl">
                      {r.populacao.toLocaleString('pt-BR')}
                    </p>
                  </div>
                )}
                {r.densidade > 0 && (
                  <div>
                    <p className="font-mono text-xs text-gov-muted mb-1">Densidade</p>
                    <p className="font-display font-bold text-gov-text text-xl">
                      {r.densidade.toLocaleString('pt-BR')}
                      <span className="font-mono text-xs text-gov-muted ml-1">hab/km²</span>
                    </p>
                  </div>
                )}
                {r.area_km2 > 0 && (
                  <div>
                    <p className="font-mono text-xs text-gov-muted mb-1">Área</p>
                    <p className="font-display font-bold text-gov-text text-xl">
                      {r.area_km2} <span className="font-mono text-xs text-gov-muted">km²</span>
                    </p>
                  </div>
                )}
              </div>

              {indsTerritorios.length > 0 && (
                <>
                  <div className="gov-line mb-4" />
                  <p className="font-mono text-xs text-gov-muted mb-3">
                    INDICADORES ({indsTerritorios.length})
                  </p>
                  <div className="space-y-2">
                    {indsTerritorios.slice(0, 4).map((i: any) => (
                      <div key={i.id} className="flex justify-between items-center">
                        <span className="text-gov-textDim text-xs truncate flex-1 pr-2">{i.nome.replace(`— ${r.nome}`, '').trim()}</span>
                        <span className="font-mono text-xs text-gov-highlight whitespace-nowrap">
                          {typeof i.valor === 'number'
                            ? i.valor.toLocaleString('pt-BR')
                            : i.valor} {i.unidade}
                        </span>
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

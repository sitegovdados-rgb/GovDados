import { getRegioes, getIndicadores } from '@/lib/directus'
import { getPopulacaoContexto, getAlfabetizacaoContexto, CONTEXTO_NACIONAL, DADOS_FAVELAS, CONTEXTO_FAVELAS_BRASIL } from '@/lib/ibge'
import ComparacaoBar from '@/components/ui/ComparacaoBar'

export const revalidate = 3600

export default async function TerritoriosPage() {
  let regioes: any[] = []
  let indicadores: any[] = []
  let popContexto = CONTEXTO_NACIONAL.populacao
  let alfaContexto = CONTEXTO_NACIONAL.alfabetizacao

  try {
    regioes = await getRegioes()
    indicadores = await getIndicadores()
    const popAPI = await getPopulacaoContexto()
    const alfaAPI = await getAlfabetizacaoContexto()
    if (popAPI?.brasil) popContexto = popAPI as any
    if (alfaAPI?.brasil) alfaContexto = alfaAPI as any
  } catch (e) { console.error(e) }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-10">
        <span className="area-tag mb-3">Dados Territoriais</span>
        <h1 className="font-display text-4xl font-bold mb-2" style={{ color: 'var(--gov-text)' }}>
          Territórios
        </h1>
        <p style={{ color: 'var(--gov-textDim)' }}>
          Perfil sociodemográfico dos territórios do Programa Cidade Integrada com contexto nacional.
          Fontes: Censo IBGE 2022 · Favelas e Comunidades Urbanas 2024 · PCI 2025.
        </p>
      </div>

      {/* Contexto nacional de favelas */}
      <div className="gov-card p-6 mb-10" style={{ background: 'var(--gov-light)', borderColor: 'var(--gov-accent)' }}>
        <div className="flex items-center gap-3 mb-4">
          <span className="area-tag">Contexto Nacional</span>
          <span className="font-mono text-xs" style={{ color: 'var(--gov-muted)' }}>IBGE — Censo 2022 · Favelas e Comunidades Urbanas</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="font-display text-3xl font-bold" style={{ color: 'var(--gov-accent)' }}>
              {CONTEXTO_FAVELAS_BRASIL.total_favelas.toLocaleString('pt-BR')}
            </p>
            <p className="font-mono text-xs mt-1" style={{ color: 'var(--gov-muted)' }}>favelas e comunidades urbanas no Brasil</p>
          </div>
          <div>
            <p className="font-display text-3xl font-bold" style={{ color: 'var(--gov-text)' }}>
              {(CONTEXTO_FAVELAS_BRASIL.total_moradores / 1000000).toFixed(1).replace('.', ',')} mi
            </p>
            <p className="font-mono text-xs mt-1" style={{ color: 'var(--gov-muted)' }}>moradores em favelas no Brasil</p>
          </div>
          <div>
            <p className="font-display text-3xl font-bold" style={{ color: 'var(--gov-text)' }}>
              {CONTEXTO_FAVELAS_BRASIL.percentual_pop}%
            </p>
            <p className="font-mono text-xs mt-1" style={{ color: 'var(--gov-muted)' }}>da população brasileira em favelas</p>
          </div>
          <div>
            <p className="font-display text-3xl font-bold" style={{ color: 'var(--gov-text)' }}>
              {CONTEXTO_FAVELAS_BRASIL.municipios}
            </p>
            <p className="font-mono text-xs mt-1" style={{ color: 'var(--gov-muted)' }}>municípios com favelas mapeadas</p>
          </div>
        </div>
      </div>

      {/* Contexto do Rio de Janeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {[
          { label: 'Rio de Janeiro (município)', valor: popContexto.municipio_rj || CONTEXTO_NACIONAL.populacao.municipio_rj, icone: '🏙️' },
          { label: 'Rio de Janeiro (estado)',    valor: popContexto.estado_rj    || CONTEXTO_NACIONAL.populacao.estado_rj,    icone: '🗺️' },
          { label: 'Brasil',                    valor: popContexto.brasil        || CONTEXTO_NACIONAL.populacao.brasil,       icone: '🇧🇷' },
        ].map(c => (
          <div key={c.label} className="gov-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{c.icone}</span>
              <span className="font-mono text-xs" style={{ color: 'var(--gov-muted)' }}>{c.label}</span>
            </div>
            <p className="font-display text-2xl font-bold" style={{ color: 'var(--gov-text)' }}>
              {(c.valor || 0).toLocaleString('pt-BR')} hab.
            </p>
          </div>
        ))}
      </div>

      {/* Cards dos territórios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {regioes.map((r: any) => {
          const inds    = indicadores.filter((i: any) => i.territorio?.includes(r.nome))
          const indAlfa = inds.find((i: any) => i.nome?.includes('alfabetização'))
          const dadosFavela = DADOS_FAVELAS[r.nome]

          return (
            <div key={r.id} className="gov-card p-6">

              {/* Cabeçalho */}
              <div className="flex items-start justify-between mb-5 flex-wrap gap-2">
                <div>
                  <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--gov-text)' }}>{r.nome}</h2>
                  <p className="font-mono text-xs mt-1" style={{ color: 'var(--gov-muted)' }}>
                    {r.municipio} · {r.estado}
                  </p>
                </div>
                <span className="area-tag">Território PCI</span>
              </div>

              {/* Destaque de ranking nacional */}
              {dadosFavela?.destaque && (
                <div className="mb-5 px-4 py-3 rounded-lg border-l-4 text-sm font-medium"
                  style={{ background: '#eff6ff', borderColor: 'var(--gov-accent)', color: 'var(--gov-accent)' }}>
                  🏆 {dadosFavela.destaque}
                </div>
              )}

              {/* Contexto da comunidade */}
              {dadosFavela?.contexto && (
                <p className="text-sm mb-5" style={{ color: 'var(--gov-textDim)' }}>
                  {dadosFavela.contexto}
                </p>
              )}

              {/* KPIs primários */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {r.populacao > 0 && (
                  <div className="text-center p-3 rounded-lg" style={{ background: 'var(--gov-light)' }}>
                    <p className="font-mono text-[10px] mb-1" style={{ color: 'var(--gov-muted)' }}>População</p>
                    <p className="font-display font-bold text-base" style={{ color: 'var(--gov-accent)' }}>
                      {r.populacao.toLocaleString('pt-BR')}
                    </p>
                    <p className="font-mono text-[10px]" style={{ color: 'var(--gov-muted)' }}>hab.</p>
                  </div>
                )}
                {dadosFavela?.domicilios > 0 && (
                  <div className="text-center p-3 rounded-lg" style={{ background: 'var(--gov-light)' }}>
                    <p className="font-mono text-[10px] mb-1" style={{ color: 'var(--gov-muted)' }}>Domicílios</p>
                    <p className="font-display font-bold text-base" style={{ color: 'var(--gov-text)' }}>
                      {dadosFavela.domicilios.toLocaleString('pt-BR')}
                    </p>
                    <p className="font-mono text-[10px]" style={{ color: 'var(--gov-muted)' }}>unidades</p>
                  </div>
                )}
                {r.densidade > 0 && (
                  <div className="text-center p-3 rounded-lg" style={{ background: 'var(--gov-light)' }}>
                    <p className="font-mono text-[10px] mb-1" style={{ color: 'var(--gov-muted)' }}>Densidade</p>
                    <p className="font-display font-bold text-base" style={{ color: 'var(--gov-text)' }}>
                      {r.densidade.toLocaleString('pt-BR')}
                    </p>
                    <p className="font-mono text-[10px]" style={{ color: 'var(--gov-muted)' }}>hab/km²</p>
                  </div>
                )}
              </div>

              {/* Comparações */}
              <div className="space-y-5">
                {r.densidade > 0 && (
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--gov-muted)' }}>
                      Densidade — Comparação Nacional
                    </p>
                    <ComparacaoBar
                      valor={r.densidade}
                      unidade="hab/km²"
                      label={r.nome}
                      comparacoes={[
                        { label: 'Município do Rio', valor: CONTEXTO_NACIONAL.densidade.municipio_rj },
                        { label: 'Estado do RJ',     valor: CONTEXTO_NACIONAL.densidade.estado_rj },
                        { label: 'Brasil',           valor: CONTEXTO_NACIONAL.densidade.brasil },
                      ]}
                    />
                    {r.densidade > CONTEXTO_NACIONAL.densidade.municipio_rj && (
                      <p className="text-xs mt-2 font-medium" style={{ color: '#d97706' }}>
                        ⚠️ {Math.round(r.densidade / CONTEXTO_NACIONAL.densidade.municipio_rj)}x mais denso que a média do município do Rio
                      </p>
                    )}
                  </div>
                )}

                {indAlfa && (
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--gov-muted)' }}>
                      Alfabetização (15+ anos) — Comparação
                    </p>
                    <ComparacaoBar
                      valor={indAlfa.valor}
                      unidade="%"
                      label={r.nome}
                      comparacoes={[
                        { label: 'Município do Rio', valor: alfaContexto.municipio_rj || CONTEXTO_NACIONAL.alfabetizacao.municipio_rj },
                        { label: 'Estado do RJ',     valor: alfaContexto.estado_rj    || CONTEXTO_NACIONAL.alfabetizacao.estado_rj },
                        { label: 'Brasil',           valor: alfaContexto.brasil        || CONTEXTO_NACIONAL.alfabetizacao.brasil },
                      ]}
                      maior_e_melhor
                    />
                  </div>
                )}
              </div>

              {/* Ranking nacional */}
              {(dadosFavela?.ranking_moradores_brasil || dadosFavela?.ranking_domicilios_brasil) && (
                <>
                  <div className="gov-line my-5" />
                  <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--gov-muted)' }}>
                    Ranking Nacional — Censo 2022
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {dadosFavela?.ranking_moradores_brasil && (
                      <div className="p-3 rounded-lg text-center" style={{ background: 'var(--gov-light)' }}>
                        <p className="font-display text-2xl font-bold" style={{ color: 'var(--gov-accent)' }}>
                          #{dadosFavela.ranking_moradores_brasil}
                        </p>
                        <p className="font-mono text-[10px] mt-1" style={{ color: 'var(--gov-muted)' }}>maior por moradores no Brasil</p>
                      </div>
                    )}
                    {dadosFavela?.ranking_domicilios_brasil && (
                      <div className="p-3 rounded-lg text-center" style={{ background: 'var(--gov-light)' }}>
                        <p className="font-display text-2xl font-bold" style={{ color: 'var(--gov-accent)' }}>
                          #{dadosFavela.ranking_domicilios_brasil}
                        </p>
                        <p className="font-mono text-[10px] mt-1" style={{ color: 'var(--gov-muted)' }}>maior por domicílios no Brasil</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Outros indicadores */}
              {inds.filter((i: any) => !i.nome?.includes('alfabetização') && !i.nome?.includes('Densidade')).length > 0 && (
                <>
                  <div className="gov-line my-5" />
                  <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--gov-muted)' }}>
                    Outros Indicadores
                  </p>
                  <div className="space-y-2">
                    {inds
                      .filter((i: any) => !i.nome?.includes('alfabetização') && !i.nome?.includes('Densidade'))
                      .slice(0, 5)
                      .map((i: any) => (
                        <div key={i.id} className="flex justify-between items-center gap-2">
                          <span className="text-xs truncate flex-1" style={{ color: 'var(--gov-textDim)' }}>
                            {i.nome.replace(`— ${r.nome}`, '').trim()}
                          </span>
                          <span className="font-mono text-xs whitespace-nowrap font-semibold" style={{ color: 'var(--gov-accent)' }}>
                            {typeof i.valor === 'number' ? i.valor.toLocaleString('pt-BR') : i.valor} {i.unidade}
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

      {/* Nota metodológica */}
      <div className="mt-12 gov-card p-6" style={{ background: 'var(--gov-light)' }}>
        <h3 className="font-display font-semibold mb-3" style={{ color: 'var(--gov-text)' }}>Fontes e Metodologia</h3>
        <ul className="text-sm space-y-1" style={{ color: 'var(--gov-textDim)' }}>
          <li>• <strong>Dados territoriais:</strong> IBGE — Censo Demográfico 2022</li>
          <li>• <strong>Ranking nacional de favelas:</strong> IBGE — Favelas e Comunidades Urbanas (nov/2024) — substituiu a denominação "Aglomerados Subnormais"</li>
          <li>• <strong>Contexto nacional:</strong> API IBGE SIDRA — população e alfabetização do Brasil, estado e município do RJ</li>
          <li>• <strong>Programas sociais:</strong> Relatórios oficiais do Programa Cidade Integrada 2025</li>
          <li>• Densidade do Brasil: 23,8 hab/km² · Estado RJ: 365,2 hab/km² · Município RJ: 5.325 hab/km²</li>
        </ul>
      </div>

    </div>
  )
}

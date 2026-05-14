import Link from 'next/link'
import { getProgramasPorSlug, getEquipamentosPorSlug, getUrbanismoPorSlug } from '@/lib/directus'
import ManguinhosCharts from '@/components/ui/ManguinhosCharts'

export const revalidate = 3600

const CORES_EIXO: Record<string, string> = {
  'Social': '#2563a8', 'Econômico': '#d97706', 'Infraestrutura': '#0891b2',
  'Segurança': '#dc2626', 'Transparência': '#7c3aed', 'Diálogo': '#16a34a',
}

const DADOS_RACA = [
  { name: 'Jacarezinho', preta: 27, parda: 43 },
  { name: 'Manguinhos',  preta: 20, parda: 41 },
]

export default async function ManguinhosPage() {
  let programas: any[] = []
  let equipamentos: any[] = []
  let urbanismo: any[] = []

  try {
    programas    = await getProgramasPorSlug('manguinhos-jacarezinho')
    equipamentos = await getEquipamentosPorSlug('manguinhos-jacarezinho')
    urbanismo    = await getUrbanismoPorSlug('manguinhos-jacarezinho')
  } catch (e) { console.error(e) }

  const totalBenef = programas.reduce((acc: number, p: any) => acc + (p.beneficiarios || 0), 0)
  const tiposEquip = [...new Set(equipamentos.map((e: any) => e.tipo))].sort() as string[]

  const dadosEixo = Object.entries(
    programas.reduce((acc: Record<string, number>, p: any) => {
      const k = p.programa?.eixo || p.eixo || 'Social'
      acc[k] = (acc[k] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value: value as number }))

  const dadosStatus = Object.entries(
    programas.reduce((acc: Record<string, number>, p: any) => {
      const k = p.status || 'Não informado'
      acc[k] = (acc[k] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value: value as number }))

  const urbanismoExecutado = urbanismo.filter((u: any) => u.status === 'Concluído')
  const urbanismoAndamento = urbanismo.filter((u: any) => u.status === 'Em execução')
  const urbanismoFuturo    = urbanismo.filter((u: any) => u.status === 'Não iniciado' || u.status === 'Aguardando Aprovação')

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, var(--pci-navy) 0%, #1e3a8a 100%)', color: 'white', borderBottom: '3px solid var(--pci-cyan)' }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <Link href="/territorios" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Territórios</Link>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--pci-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Jacarezinho e Manguinhos</span>
          </div>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 12, lineHeight: 1.6, maxWidth: 500 }}>
            Área do Plano de Retomada de Territórios no Âmbito da A.D.P.F. 635 do STF
          </p>
          <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.1, marginBottom: 12 }}>
            Jacarezinho<br />e Manguinhos
          </h1>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1rem', color: 'rgba(255,255,255,0.65)', maxWidth: 620, lineHeight: 1.7, marginBottom: 20 }}>
            Territórios da Zona Norte do Rio de Janeiro, ao longo das linhas férreas e da Avenida Brasil. Jacarezinho e Manguinhos constituem dois dos maiores complexos de favelas do estado, com intensa atuação do PCI em saúde, educação e geração de renda.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span className="pci-tag-navy">Zona Norte</span>
            <span className="pci-tag-navy">Av. Brasil · Linha Férrea</span>
            <span className="pci-tag-navy">ADPF 635 · STF</span>
          </div>
        </div>

        {/* KPI bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { valor: '29.766', label: 'Jacarezinho', sub: 'habitantes · Censo 2022' },
                { valor: '78.130', label: 'hab/km²', sub: 'Jacarezinho · Maior densidade PCI' },
                { valor: '17.249', label: 'Manguinhos', sub: 'habitantes · Censo 2022' },
                { valor: String(programas.length || '—'), label: 'Programas', sub: 'sociais mapeados' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '16px 24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                  <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '1.6rem', color: i === 1 ? '#fca5a5' : 'var(--pci-cyan)', lineHeight: 1 }}>{item.valor}</p>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.78rem', color: 'white', marginTop: 4 }}>{item.label}</p>
                  <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.55rem', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Perfil Demográfico */}
        <section className="mb-14">
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.8rem', marginBottom: 6 }}>Perfil Demográfico</h2>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.9rem', color: 'var(--pci-dim)', marginBottom: 24 }}>
            Censo IBGE 2022 · Dados por comunidade
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="pci-card p-6 text-center">
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', color: 'var(--pci-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Jacarezinho — Habitantes</p>
              <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '2.2rem', color: 'var(--pci-navy)', lineHeight: 1 }}>29.766</p>
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', color: 'var(--pci-muted)', marginTop: 8 }}>Censo IBGE 2022</p>
            </div>
            <div className="pci-card p-6 text-center" style={{ borderTop: '3px solid #dc2626' }}>
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', color: 'var(--pci-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Densidade — Jacarezinho</p>
              <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '2.2rem', color: '#dc2626', lineHeight: 1 }}>78.130</p>
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', color: '#dc2626', marginTop: 8 }}>hab/km² · Maior entre todos os territórios PCI</p>
            </div>
            <div className="pci-card p-6 text-center">
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', color: 'var(--pci-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Manguinhos — Habitantes</p>
              <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '2.2rem', color: 'var(--pci-navy)', lineHeight: 1 }}>17.249</p>
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', color: 'var(--pci-muted)', marginTop: 8 }}>Censo IBGE 2022</p>
            </div>
          </div>
          <ManguinhosCharts dadosEixo={[]} dadosStatus={[]} dadosRaca={DADOS_RACA} />
        </section>

        {/* Contexto territorial */}
        <section className="mb-14">
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.8rem', marginBottom: 16 }}>Contexto Territorial</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="pci-card p-6">
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '1rem', color: 'var(--pci-navy)', marginBottom: 12 }}>Jacarezinho</h3>
              <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.88rem', color: 'var(--pci-dim)', lineHeight: 1.75 }}>
                Uma das maiores favelas do Rio de Janeiro, o Jacarezinho situa-se às margens da ferrovia e da Av. Brasil, na Zona Norte. Com 29.766 habitantes e densidade de 78.130 hab/km² — a mais alta entre todos os territórios do PCI —, concentra alta vulnerabilidade social e déficit expressivo em saneamento, habitação e equipamentos públicos. Cerca de 27% da população se declara preta (Censo 2022).
              </p>
            </div>
            <div className="pci-card p-6">
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '1rem', color: 'var(--pci-navy)', marginBottom: 12 }}>Manguinhos</h3>
              <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.88rem', color: 'var(--pci-dim)', lineHeight: 1.75 }}>
                Complexo de favelas no entorno da Fiocruz, Manguinhos abrange múltiplas comunidades com 17.249 habitantes (Censo 2022). Cerca de 20% da população se declara preta. A área passou por intervenções do PAC entre 2007–2015 e é atualmente alvo de programas do PCI voltados à geração de renda e cultura.
              </p>
            </div>
          </div>
        </section>

        {/* Programas Sociais */}
        {programas.length > 0 && (
          <section className="mb-14">
            <div className="pci-accent-line" />
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
              <h2 className="pci-title" style={{ fontSize: '1.8rem' }}>Programas Sociais</h2>
              <Link href="/programas" style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.85rem', color: 'var(--pci-blue)', fontWeight: 600 }}>Ver todos →</Link>
            </div>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.9rem', color: 'var(--pci-dim)', marginBottom: 24 }}>
              {programas.filter((p: any) => p.status === 'Em execução').length} em execução · {programas.filter((p: any) => p.status === 'Concluída').length} concluídos
            </p>
            <ManguinhosCharts dadosEixo={dadosEixo} dadosStatus={dadosStatus} />
            {totalBenef > 0 && (
              <div className="pci-card p-5 mb-8" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '2.5rem', color: 'var(--pci-cyan)', lineHeight: 1 }}>
                  {totalBenef.toLocaleString('pt-BR')}
                </p>
                <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 8 }}>
                  Beneficiários atendidos
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {programas.map((p: any, i: number) => {
                const eixo = p.programa?.eixo || p.eixo || 'Social'
                const cor = CORES_EIXO[eixo] || '#2563a8'
                return (
                  <div key={i} className="pci-card p-5" style={{ borderTop: `3px solid ${cor}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 4, background: cor + '18', color: cor, border: `1px solid ${cor}40` }}>{eixo}</span>
                      <span className={`badge ${p.status === 'Em execução' ? 'badge-green' : 'badge-blue'}`}>{p.status}</span>
                    </div>
                    <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.9rem', color: 'var(--pci-text)', marginBottom: 8, lineHeight: 1.35 }}>{p.programa?.titulo || p.titulo}</h3>
                    {p.programa?.descricao && (
                      <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: 'var(--pci-dim)', lineHeight: 1.5, marginBottom: 10 }}>
                        {p.programa.descricao.substring(0, 120)}…
                      </p>
                    )}
                    {p.beneficiarios && (
                      <div style={{ marginTop: 8 }}>
                        <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '1.4rem', color: cor, lineHeight: 1 }}>
                          {p.beneficiarios.toLocaleString('pt-BR')}
                        </p>
                        <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', color: 'var(--pci-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>{p.unidade_beneficiarios}</p>
                      </div>
                    )}
                    {p.periodo && (
                      <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', color: 'var(--pci-muted)', marginTop: 8 }}>Período: {p.periodo}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Equipamentos */}
        {equipamentos.length > 0 && (
          <section className="mb-14">
            <div className="pci-accent-line" />
            <h2 className="pci-title" style={{ fontSize: '1.8rem', marginBottom: 6 }}>Equipamentos Públicos</h2>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.9rem', color: 'var(--pci-dim)', marginBottom: 24 }}>
              {equipamentos.length} equipamentos mapeados
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tiposEquip.map((tipo: string) => {
                const itens = equipamentos.filter((e: any) => e.tipo === tipo)
                return (
                  <div key={tipo} className="pci-card p-6">
                    <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '1rem', color: 'var(--pci-navy)', marginBottom: 4 }}>{tipo}</h3>
                    <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--pci-muted)', marginBottom: 16 }}>
                      {itens.length} equipamento{itens.length !== 1 ? 's' : ''}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {itens.map((eq: any) => (
                        <div key={eq.id} style={{ padding: '8px 12px', background: 'var(--pci-light)', borderRadius: 6, borderLeft: '3px solid var(--pci-cyan)' }}>
                          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.8rem', fontWeight: 500, color: 'var(--pci-text)', marginBottom: 2 }}>{eq.nome}</p>
                          {eq.endereco && <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-muted)' }}>{eq.endereco}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Urbanismo — Executado */}
        {urbanismoExecutado.length > 0 && (
          <section className="mb-10">
            <div className="pci-accent-line" />
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
              <h2 className="pci-title" style={{ fontSize: '1.8rem' }}>Intervenções Urbanísticas</h2>
              <Link href="/urbanismo" style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.85rem', color: 'var(--pci-blue)', fontWeight: 600 }}>Ver todas →</Link>
            </div>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.9rem', color: 'var(--pci-dim)', marginBottom: 20 }}>
              {urbanismoExecutado.length} executadas · {urbanismoAndamento.length} em andamento · {urbanismoFuturo.length} planejadas
            </p>

            <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '1rem', color: 'var(--pci-navy)', marginBottom: 12 }}>Obras Executadas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {urbanismoExecutado.map((u: any) => (
                <div key={u.id} className="pci-card p-5" style={{ borderLeft: '4px solid var(--pci-green)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                    <span className="pci-tag">{u.tipologia || u.tipo || '—'}</span>
                    <span className="badge badge-green">{u.status}</span>
                  </div>
                  <h4 style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '0.9rem', color: 'var(--pci-text)' }}>{u.titulo}</h4>
                  {u.comunidade && <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', color: 'var(--pci-muted)', marginTop: 6 }}>{u.comunidade}</p>}
                </div>
              ))}
            </div>

            {urbanismoAndamento.length > 0 && (
              <>
                <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '1rem', color: 'var(--pci-navy)', marginBottom: 12 }}>Em Andamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {urbanismoAndamento.map((u: any) => (
                    <div key={u.id} className="pci-card p-5" style={{ borderLeft: '4px solid var(--pci-cyan)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                        <span className="pci-tag">{u.tipologia || u.tipo || '—'}</span>
                        <span className="badge badge-blue">{u.status}</span>
                      </div>
                      <h4 style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '0.9rem', color: 'var(--pci-text)' }}>{u.titulo}</h4>
                      {u.comunidade && <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', color: 'var(--pci-muted)', marginTop: 6 }}>{u.comunidade}</p>}
                    </div>
                  ))}
                </div>
              </>
            )}

            {urbanismoFuturo.length > 0 && (
              <>
                <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '1rem', color: 'var(--pci-navy)', marginBottom: 12 }}>Projetos Futuros</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {urbanismoFuturo.map((u: any) => (
                    <div key={u.id} className="pci-card p-5" style={{ borderLeft: '4px solid var(--pci-muted)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                        <span className="pci-tag">{u.tipologia || u.tipo || '—'}</span>
                        <span className="badge badge-amber">{u.status}</span>
                      </div>
                      <h4 style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '0.9rem', color: 'var(--pci-text)' }}>{u.titulo}</h4>
                      {u.comunidade && <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', color: 'var(--pci-muted)', marginTop: 6 }}>{u.comunidade}</p>}
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        {/* Fallback */}
        {programas.length === 0 && equipamentos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--pci-muted)' }}>
            <p style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>Dados em preparação</p>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Os dados deste território serão publicados em breve.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

import Link from 'next/link'
import { getProgramasSociais, getProgramasUrbanismo } from '@/lib/directus'

export const revalidate = 3600

export default async function OutrosPage() {
  let programas: any[] = []
  let urbanismo: any[] = []

  try {
    programas = await getProgramasSociais(7)
    urbanismo = await getProgramasUrbanismo(7)
  } catch (e) { console.error(e) }

  const eixos = [...new Set(programas.map((p: any) => p.eixo).filter(Boolean))].sort() as string[]
  const executados = urbanismo.filter((u: any) => u.status === 'Executado').length
  const planejados = urbanismo.filter((u: any) => u.status === 'Planejado').length

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, var(--pci-navy) 0%, #1e3a8a 100%)', color: 'white', borderBottom: '3px solid var(--pci-cyan)' }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Link href="/territorios" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Territórios
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--pci-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Outros — Atuações Pontuais
            </span>
          </div>
          <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.1, marginBottom: 12, marginTop: 12 }}>
            Outros —<br />
            <span style={{ color: 'var(--pci-cyan)' }}>Atuações Pontuais</span>
          </h1>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1rem', color: 'rgba(255,255,255,0.65)', maxWidth: 600, lineHeight: 1.7, marginBottom: 20 }}>
            Programas sociais e intervenções urbanísticas do Programa Cidade Integrada realizadas fora dos territórios principais — atuações em diversas regiões do Rio de Janeiro.
          </p>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { valor: String(programas.length), label: 'Programas', sub: 'no catálogo' },
                { valor: String(eixos.length), label: 'Eixos', sub: 'de atuação' },
                { valor: String(urbanismo.length), label: 'Intervenções', sub: 'urbanísticas' },
                { valor: String(executados), label: 'Executadas', sub: 'obras concluídas' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '16px 24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                  <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '1.6rem', color: 'var(--pci-cyan)', lineHeight: 1 }}>{item.valor}</p>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.78rem', color: 'white', marginTop: 4 }}>{item.label}</p>
                  <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.55rem', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Programas por eixo */}
        {programas.length > 0 && (
          <section className="mb-14">
            <div className="pci-accent-line" />
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
              <h2 className="pci-title" style={{ fontSize: '1.8rem' }}>Programas Sociais</h2>
              <Link href="/programas" style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.85rem', color: 'var(--pci-blue)', fontWeight: 600 }}>Ver catálogo completo →</Link>
            </div>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.9rem', color: 'var(--pci-dim)', marginBottom: 24 }}>
              {programas.length} programas · {eixos.length} eixos de atuação
            </p>
            {eixos.map(eixo => {
              const grupo = programas.filter((p: any) => p.eixo === eixo)
              return (
                <div key={eixo} className="mb-8">
                  <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '1rem', color: 'var(--pci-navy)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="pci-tag">{eixo}</span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--pci-muted)' }}>{grupo.length} programa{grupo.length !== 1 ? 's' : ''}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {grupo.map((p: any) => (
                      <div key={p.id} className="pci-card p-5">
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                          <span className="pci-tag">{p.tipo}</span>
                          <span className={`badge ${p.status === 'Em Andamento' || p.status === 'Em execução' ? 'badge-green' : p.status === 'Realizado' || p.status === 'Concluída' ? 'badge-blue' : 'badge-gray'}`}>
                            {p.status || '—'}
                          </span>
                        </div>
                        <h4 style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '0.88rem', color: 'var(--pci-text)', lineHeight: 1.4, marginBottom: 6 }}>{p.titulo}</h4>
                        {p.descricao && (
                          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.75rem', color: 'var(--pci-dim)', lineHeight: 1.5 }}>
                            {p.descricao.substring(0, 100)}{p.descricao.length > 100 ? '…' : ''}
                          </p>
                        )}
                        {p.beneficiarios && (
                          <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '1.1rem', color: 'var(--pci-blue)', marginTop: 8 }}>
                            {p.beneficiarios.toLocaleString('pt-BR')}
                            <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 400, fontSize: '0.58rem', color: 'var(--pci-muted)', marginLeft: 6 }}>{p.unidade_beneficiarios}</span>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </section>
        )}

        {/* Urbanismo */}
        {urbanismo.length > 0 && (
          <section>
            <div className="pci-accent-line" />
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
              <h2 className="pci-title" style={{ fontSize: '1.8rem' }}>Intervenções Urbanísticas</h2>
              <Link href="/urbanismo" style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.85rem', color: 'var(--pci-blue)', fontWeight: 600 }}>Ver todas →</Link>
            </div>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.9rem', color: 'var(--pci-dim)', marginBottom: 24 }}>
              {executados} executadas · {planejados} planejadas
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {urbanismo.map((u: any) => (
                <div key={u.id} className="pci-card p-5" style={{ borderLeft: `4px solid ${u.status === 'Executado' ? 'var(--pci-green)' : 'var(--pci-cyan)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                    <span className="pci-tag">{u.tipo}</span>
                    <span className={`badge ${u.status === 'Executado' ? 'badge-green' : 'badge-amber'}`}>{u.status}</span>
                  </div>
                  <h3 style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '0.9rem', color: 'var(--pci-text)', marginBottom: 4 }}>{u.titulo}</h3>
                  {u.descricao && (
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: 'var(--pci-dim)', lineHeight: 1.5 }}>{u.descricao}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {programas.length === 0 && urbanismo.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--pci-muted)' }}>
            <p style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>Nenhuma atuação cadastrada</p>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Os dados serão publicados em breve.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

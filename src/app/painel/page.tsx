import { getIndicadores, getProgramasSociais, getProgramasUrbanismo } from '@/lib/directus'

export const revalidate = 3600

export default async function PainelPage() {
  let indicadores: any[] = []
  let programas: any[] = []
  let urbanismo: any[] = []
  try {
    indicadores = await getIndicadores()
    programas   = await getProgramasSociais()
    urbanismo   = await getProgramasUrbanismo()
  } catch (e) { console.error(e) }

  const areasSet = new Set<string>(indicadores.map((i: any) => i.area_tematica as string))
  const areas = Array.from(areasSet).sort()

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="pci-accent-line" />
        <span className="pci-tag mb-3">Painel de Dados · PCI</span>
        <h1 className="pci-title" style={{ fontSize: '2.5rem', marginTop: 12, marginBottom: 8 }}>
          Painel de Indicadores
        </h1>
        <p style={{ fontFamily: 'Plus Jakarta Sans', color: 'var(--pci-dim)', maxWidth: 600, lineHeight: 1.7 }}>
          Dados sociográficos, demográficos e de impacto dos territórios do Programa Cidade Integrada.
          Fontes: IBGE Censo 2022 · PCI Relatórios 2025.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { valor: indicadores.length, label: 'Indicadores', sub: 'cadastrados' },
          { valor: programas.length,   label: 'Programas',   sub: 'sociais' },
          { valor: urbanismo.length,   label: 'Intervenções', sub: 'urbanísticas' },
          { valor: areas.length,       label: 'Áreas',        sub: 'temáticas' },
        ].map((s, i) => (
          <div key={i} className="pci-card p-5 text-center">
            <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '2rem', color: 'var(--pci-navy)' }}>{s.valor}</p>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.82rem', color: 'var(--pci-text)' }}>{s.label}</p>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', color: 'var(--pci-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {areas.map((area: string) => {
        const grupo = indicadores.filter((i: any) => i.area_tematica === area)
        return (
          <section key={area} className="mb-12">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--pci-border)' }}>
              <h2 className="pci-title" style={{ fontSize: '1.2rem' }}>{area}</h2>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-muted)', background: 'var(--pci-light)', padding: '2px 8px', borderRadius: 4 }}>{grupo.length}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {grupo.map((k: any) => (
                <div key={k.id} className="pci-card p-4" style={{ borderLeft: '3px solid var(--pci-cyan)' }}>
                  <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '1.6rem', color: 'var(--pci-navy)', lineHeight: 1, marginBottom: 4 }}>
                    {typeof k.valor === 'number' && k.valor > 999 ? k.valor.toLocaleString('pt-BR') : k.valor}
                    <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 400, fontSize: '0.6rem', color: 'var(--pci-muted)', marginLeft: 4 }}>{k.unidade}</span>
                  </p>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: 'var(--pci-dim)', lineHeight: 1.4, marginBottom: 6 }}>{k.nome}</p>
                  {k.territorio && (
                    <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.55rem', color: 'var(--pci-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {k.territorio}
                    </p>
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

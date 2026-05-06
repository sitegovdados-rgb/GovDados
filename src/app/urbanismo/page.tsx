import { getProgramasUrbanismo } from '@/lib/directus'

export const revalidate = 3600

export default async function UrbanismoPage() {
  let urbanismo: any[] = []
  try { urbanismo = await getProgramasUrbanismo() } catch (e) { console.error(e) }

  const executados = urbanismo.filter((u: any) => u.status === 'Executado')
  const planejados = urbanismo.filter((u: any) => u.status === 'Planejado')

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="pci-accent-line" />
        <span className="pci-tag mb-3">Eixo Infraestrutura · PCI</span>
        <h1 className="pci-title" style={{ fontSize: '2.5rem', marginTop: 12, marginBottom: 8 }}>Intervenções Urbanísticas</h1>
        <p style={{ fontFamily: 'Plus Jakarta Sans', color: 'var(--pci-dim)', maxWidth: 600, lineHeight: 1.7 }}>
          Projetos arquitetônicos e urbanísticos do Programa Cidade Integrada — obras executadas e planejadas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          { valor: urbanismo.length, label: 'Total de intervenções', cor: 'var(--pci-navy)' },
          { valor: executados.length, label: 'Executadas', cor: 'var(--pci-green)' },
          { valor: planejados.length, label: 'Planejadas', cor: 'var(--pci-cyan)' },
        ].map((s, i) => (
          <div key={i} className="pci-card p-6 text-center">
            <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '2rem', color: s.cor }}>{s.valor}</p>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.85rem', color: 'var(--pci-text)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {['Executado', 'Planejado'].map(status => {
        const grupo = urbanismo.filter((u: any) => u.status === status)
        if (grupo.length === 0) return null
        return (
          <section key={status} className="mb-12">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <h2 className="pci-title" style={{ fontSize: '1.4rem' }}>{status === 'Executado' ? '✅ Executados' : '🔵 Planejados'}</h2>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--pci-muted)' }}>{grupo.length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grupo.map((u: any) => (
                <div key={u.id} className="pci-card p-5" style={{ borderLeft: `4px solid ${status === 'Executado' ? 'var(--pci-green)' : 'var(--pci-cyan)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                    <span className="pci-tag">{u.tipo}</span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-muted)' }}>{u.periodo}</span>
                  </div>
                  <h3 style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '0.9rem', color: 'var(--pci-text)', marginBottom: 8 }}>{u.titulo}</h3>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.8rem', color: 'var(--pci-dim)', lineHeight: 1.6 }}>{u.descricao}</p>
                  {u.sub_territorio && (
                    <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-muted)', marginTop: 10 }}>📍 {u.sub_territorio}</p>
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

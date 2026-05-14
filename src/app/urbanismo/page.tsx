import { getProgramasUrbanismo } from '@/lib/directus'
import UrbanismoFiltrado from '@/components/ui/UrbanismoFiltrado'

export const revalidate = 3600

export default async function UrbanismoPage() {
  let urbanismo: any[] = []
  try { urbanismo = await getProgramasUrbanismo() } catch (e) { console.error(e) }

  const concluidos  = urbanismo.filter((u: any) => u.status === 'Concluído').length
  const emExecucao  = urbanismo.filter((u: any) => u.status === 'Em execução').length

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
          { valor: urbanismo.length, label: 'Total de projetos',  cor: 'var(--pci-navy)' },
          { valor: concluidos,       label: 'Concluídos',         cor: 'var(--pci-green)' },
          { valor: emExecucao,       label: 'Em execução',        cor: 'var(--pci-cyan)' },
        ].map((s, i) => (
          <div key={i} className="pci-card p-6 text-center">
            <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '2rem', color: s.cor }}>{s.valor}</p>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.85rem', color: 'var(--pci-text)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <UrbanismoFiltrado urbanismo={urbanismo} />
    </div>
  )
}

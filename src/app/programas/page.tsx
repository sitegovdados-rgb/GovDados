import { getProgramasSociais } from '@/lib/directus'
import ProgramasFiltrados from '@/components/ui/ProgramasFiltrados'

export const revalidate = 3600

export default async function ProgramasPage() {
  let programas: any[] = []
  try { programas = await getProgramasSociais() } catch (e) { console.error(e) }

  const total = programas.reduce((acc: number, p: any) => acc + (p.beneficiarios || 0), 0)

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="pci-accent-line" />
        <span className="pci-tag mb-3">Eixo Social · PCI</span>
        <h1 className="pci-title" style={{ fontSize: '2.5rem', marginTop: 12, marginBottom: 8 }}>Programas Sociais</h1>
        <p style={{ fontFamily: 'Plus Jakarta Sans', color: 'var(--pci-dim)', maxWidth: 600, lineHeight: 1.7 }}>
          Ações e serviços sociais do Programa Cidade Integrada nos territórios do Rio de Janeiro.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          { valor: programas.length, label: 'Programas', sub: 'cadastrados' },
          { valor: programas.filter((p: any) => p.status === 'Em execução').length, label: 'Em execução', sub: 'atualmente ativos' },
          { valor: total > 1000 ? (total / 1000).toFixed(0) + 'mil+' : String(total || '—'), label: 'Beneficiários', sub: 'atendidos' },
        ].map((s, i) => (
          <div key={i} className="pci-card p-6 text-center">
            <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '2rem', color: 'var(--pci-navy)' }}>{s.valor}</p>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.85rem', color: 'var(--pci-text)' }}>{s.label}</p>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <ProgramasFiltrados programas={programas} />
    </div>
  )
}

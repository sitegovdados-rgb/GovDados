import { getProgramas } from '@/lib/directus'
import ProgramasFiltrados from '@/components/ui/ProgramasFiltrados'

export const revalidate = 3600

export default async function ProgramasPage() {
  let programas: any[] = []
  try { programas = await getProgramas() } catch (e) { console.error(e) }

  const totalBeneficiarios = programas.reduce((acc: number, p: any) => acc + (p.beneficiarios || 0), 0)
  const areasUnicas = new Set(programas.map((p: any) => p.area_tematica)).size

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-10">
        <span className="area-tag mb-3">Programas e Projetos</span>
        <h1 className="font-display text-4xl font-bold mb-2" style={{ color: 'var(--gov-text)' }}>
          Programas Sociais
        </h1>
        <p className="max-w-2xl" style={{ color: 'var(--gov-textDim)' }}>
          Iniciativas do Programa Cidade Integrada nos territórios do Rio de Janeiro.
          Use os filtros para explorar por área temática, território e status.
        </p>
      </div>

      {/* KPIs de destaque */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="gov-card p-6" style={{ background: 'var(--gov-light)', borderColor: 'var(--gov-accent)' }}>
          <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--gov-muted)' }}>Total de Programas</p>
          <p className="font-display text-5xl font-bold" style={{ color: 'var(--gov-accent)' }}>{programas.length}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--gov-textDim)' }}>iniciativas ativas e encerradas</p>
        </div>
        <div className="gov-card p-6">
          <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--gov-muted)' }}>Beneficiários Totais</p>
          <p className="font-display text-5xl font-bold" style={{ color: 'var(--gov-text)' }}>
            {totalBeneficiarios > 0 ? (totalBeneficiarios / 1000).toFixed(1).replace('.', ',') + ' mil' : '—'}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--gov-textDim)' }}>participantes contabilizados</p>
        </div>
        <div className="gov-card p-6">
          <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--gov-muted)' }}>Áreas Temáticas</p>
          <p className="font-display text-5xl font-bold" style={{ color: 'var(--gov-text)' }}>{areasUnicas}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--gov-textDim)' }}>áreas de atuação do PCI</p>
        </div>
      </div>

      {/* Componente interativo com filtros */}
      <ProgramasFiltrados programas={programas} />

    </div>
  )
}

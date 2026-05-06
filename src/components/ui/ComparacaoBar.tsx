interface Props {
  valor: number
  unidade: string
  label: string
  comparacoes: { label: string; valor: number; cor?: string }[]
  maior_e_melhor?: boolean
}

function barWidth(valor: number, max: number): number {
  return Math.min(100, Math.round((valor / max) * 100))
}

const CORES = {
  territorio: '#1a56a0',
  municipio:  '#0ea5e9',
  estado:     '#6b7fa3',
  brasil:     '#94a3b8',
}

export default function ComparacaoBar({ valor, unidade, label, comparacoes, maior_e_melhor = true }: Props) {
  const todos = [{ label, valor, cor: CORES.territorio }, ...comparacoes]
  const max = Math.max(...todos.map(t => t.valor))

  return (
    <div className="space-y-3">
      {todos.map((item, i) => (
        <div key={i}>
          <div className="flex justify-between items-center mb-1">
            <span className="font-mono text-xs" style={{ color: i === 0 ? 'var(--gov-accent)' : 'var(--gov-muted)' }}>
              {item.label}
            </span>
            <span className="font-mono text-xs font-semibold" style={{ color: i === 0 ? 'var(--gov-accent)' : 'var(--gov-textDim)' }}>
              {typeof item.valor === 'number'
                ? item.valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 })
                : item.valor} {unidade}
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--gov-border)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${barWidth(item.valor, max)}%`,
                background: item.cor || (i === 0 ? CORES.territorio : i === 1 ? CORES.municipio : i === 2 ? CORES.estado : CORES.brasil),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

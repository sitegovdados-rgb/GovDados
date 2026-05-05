interface KpiCardProps {
  titulo: string
  valor: number | string
  unidade?: string
  area?: string
  territorio?: string
  destaque?: boolean
}

function fmt(v: number | string): string {
  if (typeof v === 'number') {
    if (v >= 1000000) return (v / 1000000).toFixed(1).replace('.', ',') + ' mi'
    if (v >= 1000) return v.toLocaleString('pt-BR')
    return String(v)
  }
  return v
}

export default function KpiCard({ titulo, valor, unidade, area, territorio, destaque }: KpiCardProps) {
  return (
    <div className="gov-card p-5 flex flex-col gap-3" style={destaque ? { borderColor: 'var(--gov-accent)', background: 'var(--gov-light)' } : {}}>
      <div className="flex items-start justify-between gap-2 flex-wrap">
        {area && <span className="area-tag">{area}</span>}
        {territorio && <span className="font-mono text-[10px]" style={{ color: 'var(--gov-muted)' }}>{territorio}</span>}
      </div>
      <div className="flex items-end gap-1">
        <span className="font-display font-bold leading-none text-3xl" style={{ color: destaque ? 'var(--gov-accent)' : 'var(--gov-text)' }}>
          {fmt(valor)}
        </span>
        {unidade && <span className="font-mono text-xs mb-0.5" style={{ color: 'var(--gov-muted)' }}>{unidade}</span>}
      </div>
      <p className="text-sm leading-snug" style={{ color: 'var(--gov-textDim)' }}>{titulo}</p>
    </div>
  )
}

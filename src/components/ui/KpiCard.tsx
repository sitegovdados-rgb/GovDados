interface KpiCardProps {
  titulo: string
  valor: string | number
  unidade?: string
  area?: string
  territorio?: string
  destaque?: boolean
}

function formatarValor(valor: string | number): string {
  if (typeof valor === 'number') {
    if (valor >= 1_000_000) return (valor / 1_000_000).toFixed(1).replace('.', ',') + ' mi'
    if (valor >= 1_000) return valor.toLocaleString('pt-BR')
    return String(valor)
  }
  return valor
}

export default function KpiCard({ titulo, valor, unidade, area, territorio, destaque }: KpiCardProps) {
  return (
    <div className={`gov-card p-6 flex flex-col gap-3 ${destaque ? 'border-gov-accent/50 bg-gov-accent/5' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        {area && <span className="area-tag">{area}</span>}
        {territorio && (
          <span className="font-mono text-[10px] text-gov-muted ml-auto whitespace-nowrap">{territorio}</span>
        )}
      </div>

      <div>
        <div className="flex items-end gap-2">
          <span className={`font-display font-bold leading-none ${destaque ? 'text-4xl text-gov-highlight' : 'text-3xl text-gov-text'}`}>
            {formatarValor(valor)}
          </span>
          {unidade && (
            <span className="font-mono text-xs text-gov-muted mb-1">{unidade}</span>
          )}
        </div>
      </div>

      <p className="text-sm text-gov-textDim leading-snug">{titulo}</p>

      <div className="gov-line mt-auto" />
    </div>
  )
}

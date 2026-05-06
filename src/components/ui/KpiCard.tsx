interface KpiCardProps {
  titulo: string
  valor: number | string
  unidade?: string
  area?: string
  territorio?: string
  destaque?: boolean
  index?: number
}

function fmt(v: number | string): string {
  if (typeof v === 'number') {
    if (v >= 1000000) return (v / 1000000).toFixed(1).replace('.', ',') + 'M'
    if (v >= 1000) return v.toLocaleString('pt-BR')
    return String(v)
  }
  return v
}

export default function KpiCard({ titulo, valor, unidade, area, territorio, destaque, index }: KpiCardProps) {
  return (
    <div style={{
      background: destaque ? 'var(--ink)' : 'white',
      border: destaque ? '2px solid var(--ink)' : '1px solid var(--rule)',
      borderLeft: destaque ? '2px solid var(--ink)' : '4px solid var(--ink)',
      padding: '20px 20px 16px',
      position: 'relative',
    }}>
      {/* Índice */}
      {index !== undefined && (
        <span style={{
          position: 'absolute', top: 12, right: 14,
          fontFamily: 'IBM Plex Mono', fontSize: '0.55rem',
          color: destaque ? 'rgba(248,246,241,0.3)' : 'var(--rule)',
          letterSpacing: '0.05em',
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>
      )}

      {/* Área */}
      {area && (
        <p style={{
          fontFamily: 'IBM Plex Mono', fontSize: '0.55rem',
          textTransform: 'uppercase', letterSpacing: '0.12em',
          color: destaque ? 'rgba(248,246,241,0.45)' : 'var(--dim)',
          marginBottom: 8,
        }}>{area}</p>
      )}

      {/* Valor */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 8 }}>
        <span style={{
          fontFamily: 'Barlow Condensed', fontWeight: 800,
          fontSize: '2.4rem', lineHeight: 0.9,
          color: destaque ? 'var(--paper)' : 'var(--ink)',
          letterSpacing: '-0.01em',
        }}>
          {fmt(valor)}
        </span>
        {unidade && (
          <span style={{
            fontFamily: 'IBM Plex Mono', fontSize: '0.6rem',
            color: destaque ? 'rgba(248,246,241,0.5)' : 'var(--dim)',
            marginBottom: 4, letterSpacing: '0.05em',
          }}>{unidade}</span>
        )}
      </div>

      {/* Título */}
      <p style={{
        fontFamily: 'IBM Plex Sans', fontSize: '0.78rem',
        color: destaque ? 'rgba(248,246,241,0.65)' : 'var(--mid)',
        lineHeight: 1.4,
        borderTop: `1px solid ${destaque ? 'rgba(248,246,241,0.12)' : 'var(--rule)'}`,
        paddingTop: 8, marginTop: 4,
      }}>{titulo}</p>

      {territorio && (
        <p style={{
          fontFamily: 'IBM Plex Mono', fontSize: '0.55rem',
          color: destaque ? 'rgba(248,246,241,0.3)' : 'var(--rule)',
          marginTop: 4, letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>{territorio}</p>
      )}
    </div>
  )
}

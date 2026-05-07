interface Secao {
  titulo: string
  conteudo: string
}

interface Props {
  secoes: Secao[]
  fonte?: string
}

export default function Diagnostico({ secoes, fonte }: Props) {
  return (
    <div className="pci-card p-6" style={{ borderLeft: '4px solid var(--pci-cyan)' }}>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '1rem', color: 'var(--pci-navy)', marginBottom: 4 }}>
          Diagnóstico Territorial
        </h3>
        {fonte && (
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {fonte}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {secoes.map((s, i) => (
          <div key={i} style={{ paddingTop: i > 0 ? 20 : 0, borderTop: i > 0 ? '1px solid var(--pci-border)' : 'none' }}>
            <p style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.82rem', color: 'var(--pci-blue)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              {s.titulo}
            </p>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.88rem', color: 'var(--pci-text)', lineHeight: 1.8 }}>
              {s.conteudo}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

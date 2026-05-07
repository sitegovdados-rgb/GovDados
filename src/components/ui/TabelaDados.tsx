interface Linha {
  label: string
  valor: string | number
  unidade?: string
  destaque?: boolean
}

interface Props {
  titulo: string
  fonte?: string
  linhas: Linha[]
}

export default function TabelaDados({ titulo, fonte, linhas }: Props) {
  return (
    <div className="pci-card overflow-hidden">
      <div style={{ padding: '16px 20px', borderBottom: '2px solid var(--pci-navy)', background: 'var(--pci-navy)' }}>
        <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>{titulo}</h3>
        {fonte && <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', color: 'rgba(255,255,255,0.5)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{fonte}</p>}
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {linhas.map((linha, i) => (
            <tr key={i} style={{ background: linha.destaque ? 'var(--pci-light)' : i % 2 === 0 ? 'white' : '#fafbfd', borderBottom: '1px solid var(--pci-border)' }}>
              <td style={{ padding: '10px 20px', fontFamily: 'Plus Jakarta Sans', fontSize: '0.82rem', color: 'var(--pci-dim)', width: '60%' }}>
                {linha.label}
              </td>
              <td style={{ padding: '10px 20px', fontFamily: 'Sora', fontWeight: linha.destaque ? 800 : 700, fontSize: linha.destaque ? '1.1rem' : '0.9rem', color: linha.destaque ? 'var(--pci-navy)' : 'var(--pci-text)', textAlign: 'right' }}>
                {typeof linha.valor === 'number' ? linha.valor.toLocaleString('pt-BR') : linha.valor}
                {linha.unidade && <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 400, fontSize: '0.65rem', color: 'var(--pci-muted)', marginLeft: 4 }}>{linha.unidade}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

import Link from 'next/link'

export const metadata = {
  title: 'Dashboard Social — Programa Cidade Integrada',
}

export default function DashboardSocialPage() {
  return (
    <div>
      {/* Barra de contexto */}
      <div style={{
        background: '#1a2a5e',
        borderBottom: '2px solid #00a8cc',
        padding: '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <Link href="/painel" style={{
            fontFamily: 'JetBrains Mono',
            fontSize: '0.62rem',
            color: 'rgba(255,255,255,0.45)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}>
            ← Voltar ao Painel
          </Link>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 3 }}>
              <h1 style={{
                fontFamily: 'Sora',
                fontWeight: 700,
                fontSize: '0.95rem',
                color: 'white',
                margin: 0,
                whiteSpace: 'nowrap',
              }}>
                Dashboard Social — Programa Cidade Integrada
              </h1>
              <span style={{
                fontFamily: 'JetBrains Mono',
                fontSize: '0.5rem',
                padding: '2px 8px',
                borderRadius: 4,
                background: 'rgba(0,168,204,0.15)',
                color: '#00a8cc',
                border: '1px solid rgba(0,168,204,0.35)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                whiteSpace: 'nowrap',
              }}>
                Looker Studio · PCI
              </span>
            </div>
            <p style={{
              fontFamily: 'JetBrains Mono',
              fontSize: '0.52rem',
              color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              margin: 0,
            }}>
              Atualizado em 14/05/2026 às 16:58
            </p>
          </div>
        </div>

        <a
          href="https://datastudio.google.com/reporting/c0ff2013-6c42-4bcc-bb71-1df790b00e00"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: '0.62rem',
            color: '#00a8cc',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '7px 14px',
            border: '1px solid rgba(0,168,204,0.4)',
            borderRadius: 6,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            background: 'rgba(0,168,204,0.08)',
          }}
        >
          Abrir em tela cheia →
        </a>
      </div>

      {/* Iframe sem padding lateral */}
      <iframe
        src="https://datastudio.google.com/embed/reporting/c0ff2013-6c42-4bcc-bb71-1df790b00e00/page/oeAvF"
        style={{
          display: 'block',
          width: '100%',
          height: '85vh',
          border: 'none',
        }}
        allowFullScreen
      />
    </div>
  )
}

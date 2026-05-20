'use client'

// URLs facilmente localizáveis — trocar aqui para atualizar em todo o site
const SRC_SOCIAL = 'https://datastudio.google.com/embed/reporting/c0ff2013-6c42-4bcc-bb71-1df790b00e00/page/oeAvF?params=%7B%22df1%22:%22%22%7D&navigation=hidden'
const SRC_URBANISMO = 'https://datastudio.google.com/embed/reporting/73b575cf-6aff-4988-a2bd-acdaca12c4b3/page/Wa7xF?params=%7B%22df1%22:%22%22%7D&navigation=hidden'

type Tipo = 'social' | 'urbanismo'

const CONFIGS: Record<Tipo, { src: string; paddingBottom: string; iframeHeight: number; mqPaddingBottom: string }> = {
  social: {
    src: SRC_SOCIAL,
    paddingBottom: '73.33%',
    iframeHeight: 916,
    mqPaddingBottom: '880px',
  },
  urbanismo: {
    src: SRC_URBANISMO,
    paddingBottom: '75%',
    iframeHeight: 936,
    mqPaddingBottom: '900px',
  },
}

export default function DashboardEmbed({ tipo, src }: { tipo: Tipo; src?: string }) {
  const cfg = CONFIGS[tipo]
  const cls = `db-embed-${tipo}`
  const finalSrc = src ?? cfg.src

  return (
    <>
      <style>{`
        .${cls} {
          position: relative;
          width: 100%;
          max-width: 1200px;
          height: 0;
          padding-bottom: ${cfg.paddingBottom};
          overflow: hidden;
          margin: 0 auto;
        }
        .${cls} iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 1200px;
          height: ${cfg.iframeHeight}px;
          border: 0;
          overflow: hidden;
          transform-origin: 0 0;
          transform: scale(calc(100vw / 1200));
        }
        @media (min-width: 1200px) {
          .${cls} {
            padding-bottom: ${cfg.mqPaddingBottom};
          }
          .${cls} iframe {
            width: 100%;
            transform: none;
          }
        }
      `}</style>
      <div className={cls}>
        <iframe
          src={finalSrc}
          scrolling="no"
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          title={tipo === 'social' ? 'Dashboard Programas Sociais' : 'Dashboard Urbanismo'}
        />
      </div>
    </>
  )
}

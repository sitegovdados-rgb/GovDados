import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', marginTop: '5rem' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div style={{ borderBottom: '1px solid rgba(248,246,241,0.12)', paddingBottom: '2rem', marginBottom: '2rem' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <p className="t-label mb-4" style={{ color: 'rgba(248,246,241,0.35)' }}>Sobre</p>
              <p style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '1.5rem', color: 'var(--paper)', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: 8 }}>GovDados</p>
              <p style={{ fontFamily: 'IBM Plex Sans', fontSize: '0.8rem', color: 'rgba(248,246,241,0.45)', lineHeight: 1.6 }}>
                Plataforma de visualização de indicadores e dados de políticas públicas do Estado do Rio de Janeiro.
              </p>
            </div>
            <div>
              <p className="t-label mb-4" style={{ color: 'rgba(248,246,241,0.35)' }}>Navegação</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { href: '/painel',      label: 'Painel Executivo' },
                  { href: '/programas',   label: 'Programas Sociais' },
                  { href: '/territorios', label: 'Territórios' },
                  { href: '/dados',       label: 'Dados Abertos' },
                ].map(l => (
                  <Link key={l.href} href={l.href}
                    style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(248,246,241,0.45)' }}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="t-label mb-4" style={{ color: 'rgba(248,246,241,0.35)' }}>Fontes</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {['IBGE — Censo 2022', 'Programa Cidade Integrada', 'INEA — Estado do RJ', 'Favelas e Comunidades Urbanas 2024'].map(f => (
                  <p key={f} style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.6rem', color: 'rgba(248,246,241,0.35)', letterSpacing: '0.05em' }}>{f}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.6rem', color: 'rgba(248,246,241,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            © {new Date().getFullYear()} GovDados — Dados públicos para decisões públicas
          </p>
          <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.6rem', color: 'rgba(248,246,241,0.2)', letterSpacing: '0.06em' }}>
            Directus · Next.js · Railway · Vercel
          </p>
        </div>
      </div>
    </footer>
  )
}

import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--pci-navy)', marginTop: '5rem', borderTop: '3px solid var(--pci-cyan)' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--pci-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Sora', fontSize: 11, fontWeight: 800, color: 'var(--pci-navy)' }}>PCI</span>
              </div>
              <span style={{ fontFamily: 'Sora', fontWeight: 700, color: 'white', fontSize: '1rem' }}>Programa Cidade Integrada</span>
            </div>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 380 }}>
              Iniciativa do Governo do Estado do Rio de Janeiro para integração entre bairros formais e informais através de investimentos em infraestrutura, urbanismo social e programas sociais.
            </p>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', marginTop: 16, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Secretaria de Estado de Desenvolvimento Social e Direitos Humanos
            </p>
          </div>
          <div>
            <p className="pci-label mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Navegação</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { href: '/territorios', label: 'Territórios' },
                { href: '/programas',   label: 'Programas Sociais' },
                { href: '/urbanismo',   label: 'Urbanismo' },
                { href: '/painel',      label: 'Painel de Dados' },
                { href: '/dados',       label: 'Dados Abertos' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', transition: 'color 0.15s' }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="pci-label mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Fontes de Dados</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['IBGE — Censo 2022', 'SABREN', 'IPP', 'PNAD', 'CADÚNICO', 'DATASUS', 'PCI — Relatórios 2025'].map(f => (
                <p key={f} style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>{f}</p>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 }}>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            © {new Date().getFullYear()} Programa Cidade Integrada · Governo do Estado do Rio de Janeiro
          </p>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.15)' }}>
            Directus · Next.js · Railway
          </p>
        </div>
      </div>
    </footer>
  )
}

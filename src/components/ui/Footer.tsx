import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-16" style={{ borderColor: 'var(--gov-border)' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--gov-accent)' }}>
                <span className="text-white font-mono text-xs font-bold">GD</span>
              </div>
              <span className="font-display font-bold" style={{ color: 'var(--gov-text)' }}>GovDados</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--gov-textDim)' }}>
              Plataforma de visualização de indicadores e dados de políticas públicas do Estado do Rio de Janeiro.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--gov-muted)' }}>Navegação</h4>
            <ul className="space-y-2">
              {[
                { href: '/painel',      label: 'Painel Executivo' },
                { href: '/programas',   label: 'Programas Sociais' },
                { href: '/territorios', label: 'Territórios' },
                { href: '/dados',       label: 'Dados Abertos' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:underline" style={{ color: 'var(--gov-textDim)' }}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--gov-muted)' }}>Fontes</h4>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--gov-textDim)' }}>
              <li>IBGE — Censo Demográfico 2022</li>
              <li>Programa Cidade Integrada</li>
              <li>INEA — Instituto Estadual do Ambiente</li>
              <li>Governo do Estado do RJ</li>
            </ul>
          </div>
        </div>
        <div className="gov-line mt-10 mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs" style={{ color: 'var(--gov-muted)' }}>
            © {new Date().getFullYear()} GovDados — Dados públicos para decisões públicas
          </p>
          <p className="font-mono text-xs" style={{ color: 'var(--gov-muted)' }}>
            Powered by Directus · Next.js · Railway
          </p>
        </div>
      </div>
    </footer>
  )
}

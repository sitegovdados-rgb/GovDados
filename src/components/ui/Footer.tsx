import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gov-border bg-gov-surface mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Identidade */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded bg-gov-accent flex items-center justify-center">
                <span className="text-white font-mono text-xs font-bold">GD</span>
              </div>
              <span className="font-display font-bold text-gov-text">GovDados</span>
            </div>
            <p className="text-gov-textDim text-sm leading-relaxed">
              Plataforma de visualização de indicadores e dados de políticas públicas do Estado do Rio de Janeiro.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-gov-textDim mb-4">Navegação</h4>
            <ul className="space-y-2">
              {[
                { href: '/painel',      label: 'Painel Executivo' },
                { href: '/programas',   label: 'Programas Sociais' },
                { href: '/territorios', label: 'Territórios' },
                { href: '/dados',       label: 'Dados Abertos' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gov-textDim hover:text-gov-highlight transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dados */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-gov-textDim mb-4">Fontes</h4>
            <ul className="space-y-2 text-sm text-gov-textDim">
              <li>IBGE — Censo Demográfico 2022</li>
              <li>Programa Cidade Integrada</li>
              <li>INEA — Instituto Estadual do Ambiente</li>
              <li>Governo do Estado do Rio de Janeiro</li>
            </ul>
          </div>
        </div>

        <div className="gov-line mt-10 mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-gov-muted">
            © {new Date().getFullYear()} GovDados — Dados públicos para decisões públicas
          </p>
          <p className="font-mono text-xs text-gov-muted">
            Powered by Directus · Next.js · Railway
          </p>
        </div>
      </div>
    </footer>
  )
}

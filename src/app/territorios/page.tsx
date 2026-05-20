import Link from 'next/link'

const TERRITORIOS = [
  {
    nome: 'Cinturão de Jacarepaguá',
    slug: 'cinturao-jacarepagua',
    tags: ['XVI Região Administrativa', 'Zona Sudoeste'],
    descricao: 'Território da Zona Sudoeste do Rio de Janeiro, na Baixada de Jacarepaguá, com intensa expansão urbana e elevada heterogeneidade socioespacial.',
  },
  {
    nome: 'Manguinhos e Jacarezinho',
    slug: 'jacarezinho-manguinhos',
    tags: ['Zona Norte', 'Av. Brasil · Linha Férrea'],
    descricao: 'Território da Zona Norte formado pelas favelas de Manguinhos e Jacarezinho, ao longo das linhas férreas e do entorno dos rios Salgado e Jacaré.',
  },
  {
    nome: 'Pavão-Pavãozinho e Cantagalo',
    slug: 'ppg',
    tags: ['Zona Sul', 'Copacabana · Ipanema · Lagoa'],
    descricao: 'Território da Zona Sul entre Copacabana, Ipanema e Lagoa, conhecido pelo apelido PPG, marcado pela proximidade com infraestrutura consolidada e intensa desigualdade interna.',
  },
  {
    nome: 'Outros — Atuações do PCI',
    slug: 'outros',
    tags: ['Diversas regiões'],
    descricao: 'Projetos de arquitetura e urbanismo do Programa Cidade Integrada realizados fora dos territórios principais, em diversas regiões do Rio de Janeiro.',
  },
]

export default function TerritoriosPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="pci-accent-line" />
        <span className="pci-tag mb-3">Territórios do PCI</span>
        <h1 className="pci-title" style={{ fontSize: '2.5rem', marginTop: 12, marginBottom: 8 }}>Territórios</h1>
        <p style={{ fontFamily: 'Plus Jakarta Sans', color: 'var(--pci-dim)', maxWidth: 600, lineHeight: 1.7 }}>
          O Programa Cidade Integrada atua em territórios historicamente conflagrados do Rio de Janeiro, promovendo integração urbana, inclusão social e transparência de dados.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {TERRITORIOS.map((t) => (
          <div key={t.slug} className="pci-card p-8">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="flex-1">
                <h2 className="pci-title" style={{ fontSize: '1.5rem', marginBottom: 10 }}>{t.nome}</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {t.tags.map((tag) => (
                    <span key={tag} className="pci-tag">{tag}</span>
                  ))}
                </div>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.9rem', color: 'var(--pci-dim)', lineHeight: 1.7 }}>
                  {t.descricao}
                </p>
              </div>
              <Link href={`/territorios/${t.slug}`} className="pci-btn" style={{ whiteSpace: 'nowrap' }}>
                {t.slug === 'outros' ? 'Ver atuações →' : 'Explorar território →'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

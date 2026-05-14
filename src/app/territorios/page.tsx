import Link from 'next/link'
import { getTerritorios, getSubTerritorios } from '@/lib/directus'

export const revalidate = 3600

function labelTipo(t: any): string {
  if (t.slug === 'outros') return 'Outros'
  return t.nivel === 2 ? 'Área' : 'Território'
}

function nomeDisplay(t: any): string {
  if (t.slug === 'outros') return 'Outros — Atuações do PCI'
  return t.nome
}

const SLUGS_ATIVOS = new Set(['cinturao-jacarepagua', 'ppg', 'jacarezinho-manguinhos', 'manguinhos-jacarezinho', 'outros'])

const SLUG_HREF: Record<string, string> = {
  'manguinhos-jacarezinho': 'jacarezinho-manguinhos',
}

export default async function TerritoriosPage() {
  let territorios: any[] = []
  let subTerritorios: any[] = []
  try {
    territorios    = await getTerritorios()
    subTerritorios = await getSubTerritorios('cinturao-jacarepagua')
  } catch (e) { console.error(e) }

  const fallback = [
    { nome: 'Cinturão de Jacarepaguá', slug: 'cinturao-jacarepagua', nivel: 1, status: 'ativo', descricao: 'Conjunto de comunidades na Zona Oeste do Rio de Janeiro.' },
    { nome: 'Pavão-Pavãozinho e Cantagalo', slug: 'ppg', nivel: 1, status: 'ativo', descricao: 'Comunidades da Zona Sul do Rio de Janeiro, entre Copacabana e Ipanema.' },
    { nome: 'Manguinhos e Jacarezinho', slug: 'jacarezinho-manguinhos', nivel: 1, status: 'ativo', descricao: 'Territórios da Zona Norte do Rio de Janeiro.' },
    { nome: 'Outros', slug: 'outros', nivel: 1, status: 'ativo', descricao: 'Atuações pontuais do PCI fora dos territórios principais.' },
  ]

  const lista = territorios.length > 0 ? territorios : fallback

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="pci-accent-line" />
        <span className="pci-tag mb-3">Territórios do PCI</span>
        <h1 className="pci-title" style={{ fontSize: '2.5rem', marginTop: 12, marginBottom: 8 }}>Territórios</h1>
        <p style={{ fontFamily: 'Plus Jakarta Sans', color: 'var(--pci-dim)', maxWidth: 600, lineHeight: 1.7 }}>
          O Programa Cidade Integrada atua em territórios historicamente conflagrados do Rio de Janeiro. O Cinturão de Jacarepaguá é composto por três áreas — Gardênia Azul, Rio das Pedras e Corredor do Itanhangá.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {lista.map((t: any) => (
          <div key={t.slug} className="pci-card p-8">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="flex-1">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                  <h2 className="pci-title" style={{ fontSize: '1.5rem' }}>{nomeDisplay(t)}</h2>
                  <span className="badge badge-green">Em desenvolvimento</span>
                  <span className="pci-tag">{labelTipo(t)}</span>
                </div>
                {t.descricao && (
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.9rem', color: 'var(--pci-dim)', lineHeight: 1.7, marginBottom: 12 }}>
                    {t.descricao}
                  </p>
                )}
                {t.historia && (
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.85rem', color: 'var(--pci-dim)', lineHeight: 1.7, maxWidth: 700 }}>
                    {t.historia.substring(0, 300)}…
                  </p>
                )}
                {t.slug === 'cinturao-jacarepagua' && subTerritorios.length > 0 && (
                  <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {subTerritorios.map((st: any) => (
                      <span key={st.slug} className="pci-tag">Área: {st.nome}</span>
                    ))}
                  </div>
                )}
              </div>
              {SLUGS_ATIVOS.has(t.slug) && (
                <Link href={`/territorios/${SLUG_HREF[t.slug] || t.slug}`} className="pci-btn" style={{ whiteSpace: 'nowrap' }}>
                  {t.slug === 'outros' ? 'Ver atuações →' : 'Explorar território →'}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

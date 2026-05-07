import Link from 'next/link'
import { getTerritorios, getSubTerritorios } from '@/lib/directus'

export const revalidate = 3600

export default async function TerritoriosPage() {
  let territorios: any[] = []
  let subTerritorios: any[] = []
  try {
    territorios   = await getTerritorios()
    subTerritorios = await getSubTerritorios('Cinturão de Jacarepaguá')
  } catch (e) { console.error(e) }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="pci-accent-line" />
        <span className="pci-tag mb-3">Territórios do PCI</span>
        <h1 className="pci-title" style={{ fontSize: '2.5rem', marginTop: 12, marginBottom: 8 }}>Territórios</h1>
        <p style={{ fontFamily: 'Plus Jakarta Sans', color: 'var(--pci-dim)', maxWidth: 600, lineHeight: 1.7 }}>
          O Programa Cidade Integrada atua em territórios historicamente conflagrados do Rio de Janeiro. Cada território é composto por territórios e favelas com características próprias.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {(territorios.length > 0 ? territorios : [
          { nome: 'Cinturão de Jacarepaguá', slug: 'cinturao-jacarepagua', status: 'ativo', historia: 'Conjunto de comunidades na Zona Oeste do Rio de Janeiro.', descricao: '' },
          { nome: 'Manguinhos e Jacarezinho', slug: 'manguinhos-jacarezinho', status: 'em_breve', historia: '', descricao: '' },
          { nome: 'Pavão-Pavãozinho e Cantagalo', slug: 'ppg', status: 'em_breve', historia: '', descricao: '' },
        ]).map((t: any) => (
          <div key={t.slug} className="pci-card p-8" style={{ opacity: t.status === 'em_breve' ? 0.6 : 1 }}>
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="flex-1">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <h2 className="pci-title" style={{ fontSize: '1.5rem' }}>{t.nome}</h2>
                  <span className={`badge ${t.status === 'ativo' ? 'badge-green' : 'badge-gray'}`}>
                    {t.status === 'ativo' ? 'Em desenvolvimento' : 'Em breve'}
                  </span>
                </div>
                {t.descricao && (
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.9rem', color: 'var(--pci-dim)', lineHeight: 1.7, marginBottom: 12 }}>
                    {t.descricao}
                  </p>
                )}
                {t.historia && (
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.85rem', color: 'var(--pci-dim)', lineHeight: 1.7, maxWidth: 700 }}>
                    {t.historia.substring(0, 300)}...
                  </p>
                )}

                {t.slug === 'cinturao-jacarepagua' && subTerritorios.length > 0 && (
                  <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {subTerritorios.map((st: any) => (
                      <span key={st.slug} className="pci-tag">{st.nome}</span>
                    ))}
                  </div>
                )}
              </div>

              {t.status === 'ativo' && (
                <Link href={`/territorios/${t.slug}`} className="pci-btn" style={{ whiteSpace: 'nowrap' }}>
                  Explorar território →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

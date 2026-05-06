import { getIndicadores, getProgramasSociais, getProgramasUrbanismo, getEquipamentos } from '@/lib/directus'

export const revalidate = 3600

export default async function DadosPage() {
  let indicadores: any[] = []
  let programas: any[] = []
  let urbanismo: any[] = []
  let equipamentos: any[] = []
  try {
    indicadores  = await getIndicadores()
    programas    = await getProgramasSociais()
    urbanismo    = await getProgramasUrbanismo()
    equipamentos = await getEquipamentos()
  } catch (e) { console.error(e) }

  const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-7e52.up.railway.app'

  const datasets = [
    { titulo: 'Indicadores', registros: indicadores.length, endpoint: '/items/indicadores', campos: ['nome','valor','unidade','area_tematica','territorio','fonte','ano'] },
    { titulo: 'Programas Sociais', registros: programas.length, endpoint: '/items/programas_sociais', campos: ['titulo','tipo','eixo','territorio','beneficiarios','status'] },
    { titulo: 'Intervenções Urbanísticas', registros: urbanismo.length, endpoint: '/items/programas_urbanismo', campos: ['titulo','tipo','territorio','sub_territorio','status','periodo'] },
    { titulo: 'Equipamentos Públicos', registros: equipamentos.length, endpoint: '/items/equipamentos', campos: ['nome','tipo','subtipo','territorio','endereco'] },
    { titulo: 'Territórios', registros: 3, endpoint: '/items/territorios', campos: ['nome','slug','descricao','historia','status'] },
    { titulo: 'Sub-territórios', registros: 3, endpoint: '/items/sub_territorios', campos: ['nome','slug','territorio','descricao','historia'] },
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="pci-accent-line" />
        <span className="pci-tag mb-3">Transparência · PCI</span>
        <h1 className="pci-title" style={{ fontSize: '2.5rem', marginTop: 12, marginBottom: 8 }}>Dados Abertos</h1>
        <p style={{ fontFamily: 'Plus Jakarta Sans', color: 'var(--pci-dim)', maxWidth: 600, lineHeight: 1.7 }}>
          Todos os dados do Painel PCI são públicos e acessíveis via API REST. Utilize livremente com atribuição da fonte.
        </p>
      </div>

      <div className="pci-card p-6 mb-10" style={{ borderLeft: '4px solid var(--pci-cyan)', background: 'var(--pci-light)' }}>
        <p className="pci-label mb-2">Base da API</p>
        <code style={{ fontFamily: 'JetBrains Mono', fontSize: '0.85rem', color: 'var(--pci-blue)', wordBreak: 'break-all' }}>{baseUrl}</code>
        <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.82rem', color: 'var(--pci-dim)', marginTop: 8 }}>
          API REST gerada pelo Directus. Consulte a documentação em{' '}
          <a href="https://docs.directus.io/reference/items" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--pci-blue)', fontWeight: 600 }}>docs.directus.io</a>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        {datasets.map(d => (
          <div key={d.titulo} className="pci-card p-5 flex flex-col gap-4">
            <div>
              <h2 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '1rem', color: 'var(--pci-text)', marginBottom: 4 }}>{d.titulo}</h2>
              <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '1.8rem', color: 'var(--pci-navy)' }}>{d.registros}</p>
              <p className="pci-label">registros</p>
            </div>
            <div>
              <p className="pci-label mb-2">Campos</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {d.campos.map(c => (
                  <code key={c} style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', padding: '2px 6px', borderRadius: 4, background: 'var(--pci-light)', color: 'var(--pci-dim)', border: '1px solid var(--pci-border)' }}>{c}</code>
                ))}
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--pci-border)', paddingTop: 12, marginTop: 'auto' }}>
              <a href={`${baseUrl}${d.endpoint}`} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--pci-blue)', wordBreak: 'break-all', textDecoration: 'underline' }}>
                {d.endpoint}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

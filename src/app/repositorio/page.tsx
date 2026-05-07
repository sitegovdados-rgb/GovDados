export const revalidate = 3600

const RELATORIOS = [
  {
    categoria: 'Programas Sociais',
    itens: [
      {
        titulo: 'Desenvolve Mulher (2022)',
        descricao: 'Relatório do programa de promoção de mobilidade social para mulheres em situação de vulnerabilidade. Dados de beneficiárias, perfil socioeconômico e resultados.',
        tipo: 'Relatório de Programa',
        ano: 2022,
        responsavel: 'Secretaria de Estado de Desenvolvimento Social e Direitos Humanos',
        status: 'Concluído',
        url: 'https://drive.google.com/file/d/1UXH-nw38bUT2N_ezGIMlBxJ0p6VNFNWP/view',
      },
      {
        titulo: 'Reabilita 60+',
        descricao: 'Relatório do programa de reabilitação física para idosos. Dados de atendimentos, perfil dos participantes por faixa etária, escolaridade e raça/cor.',
        tipo: 'Relatório de Programa',
        ano: 2025,
        responsavel: 'Secretaria de Estado de Juventude e Envelhecimento Saudável',
        status: 'Em Andamento',
        url: 'https://drive.google.com/file/d/1aTR8KScsTAaqAvl62vZa2qhe0B7halSe/view',
      },
    ],
  },
  {
    categoria: 'Levantamentos Territoriais',
    itens: [
      {
        titulo: 'Levantamento Social Prévio — Gardênia Azul',
        descricao: 'Diagnóstico socioeconômico do Complexo da Gardênia Azul com caracterização histórica, dados populacionais por comunidade e mapeamento de equipamentos públicos.',
        tipo: 'Levantamento Social',
        ano: 2025,
        responsavel: 'Secretaria de Estado da Casa Civil',
        status: 'Concluído',
        url: 'https://drive.google.com/file/d/1RVvrrIlmfUD2mXDD0JJGjWuUMfbt-4JY/view',
      },
    ],
  },
]

const STATUS_CORES: Record<string, string> = {
  'Concluído':    'badge-blue',
  'Em Andamento': 'badge-green',
}

export default function RepositorioPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      <div className="mb-10">
        <div className="pci-accent-line" />
        <span className="pci-tag mb-3">Documentos · PCI</span>
        <h1 className="pci-title" style={{ fontSize: '2.5rem', marginTop: 12, marginBottom: 8 }}>Repositório</h1>
        <p style={{ fontFamily: 'Plus Jakarta Sans', color: 'var(--pci-dim)', maxWidth: 600, lineHeight: 1.7 }}>
          Relatórios, levantamentos e documentos técnicos do Programa Cidade Integrada disponíveis para consulta e download.
        </p>
      </div>

      {RELATORIOS.map(grupo => (
        <section key={grupo.categoria} className="mb-12">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid var(--pci-navy)' }}>
            <h2 className="pci-title" style={{ fontSize: '1.3rem' }}>{grupo.categoria}</h2>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.62rem', color: 'var(--pci-muted)', background: 'var(--pci-light)', padding: '2px 8px', borderRadius: 4 }}>
              {grupo.itens.length} documento{grupo.itens.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {grupo.itens.map((item, i) => (
              <div key={i} className="pci-card p-6 flex flex-col gap-4">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <span className="pci-tag">{item.tipo}</span>
                  <span className={`badge ${STATUS_CORES[item.status] || 'badge-gray'}`}>{item.status}</span>
                </div>

                <div>
                  <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '1rem', color: 'var(--pci-navy)', marginBottom: 8, lineHeight: 1.3 }}>
                    {item.titulo}
                  </h3>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.82rem', color: 'var(--pci-dim)', lineHeight: 1.6 }}>
                    {item.descricao}
                  </p>
                </div>

                <div style={{ paddingTop: 12, borderTop: '1px solid var(--pci-border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {item.responsavel} · {item.ano}
                  </p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pci-btn"
                    style={{ fontSize: '0.78rem', padding: '10px 18px', alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    ↓ Baixar documento
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

    </div>
  )
}

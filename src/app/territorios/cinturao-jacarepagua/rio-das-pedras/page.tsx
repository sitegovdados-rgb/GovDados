import Link from 'next/link'
import { getFavelas, getIndicadores, getProgramasSociais, getEquipamentos } from '@/lib/directus'
import GaleriaMapa from '@/components/ui/GaleriaMapa'
import TabelaDados from '@/components/ui/TabelaDados'
import DiagnosticoIA from '@/components/ui/DiagnosticoIA'

export const revalidate = 3600

const SUB = 'Rio das Pedras'
const TERRITORIO = 'Cinturão de Jacarepaguá'

const MAPAS = [
  {
    titulo: 'Mapa de Infraestrutura',
    descricao: 'Projetos do PCI, terrenos destinados à educação, edifícios condenados, escolas, hospitais e ciclovias.',
    url: 'https://drive.google.com/uc?export=view&id=1Vu3mMhDPvJ-Zc255M-gxi26fH-spAOhs',
  },
  {
    titulo: 'Mapa de Mobilidade',
    descricao: 'Vias principais e secundárias, pontes, ciclovias existentes e projetadas, transporte hidroviário.',
    url: 'https://drive.google.com/uc?export=view&id=17f15svUWzETY1KWLsOkxtF8CIY_QSCB8',
  },
  {
    titulo: 'Mapa de Meio Ambiente',
    descricao: 'Proposta de intervenção, áreas de proteção de manguezais, hidrografia e zonas de conservação INEA.',
    url: 'https://drive.google.com/uc?export=view&id=1tRhyoHP5DEyetrYsZTY24dwpwatxublm',
  },
]

export default async function RiodasPedrasPage() {
  let indicadores: any[] = []
  let programas: any[] = []
  let equipamentos: any[] = []

  try {
    indicadores  = await getIndicadores(TERRITORIO)
    programas    = await getProgramasSociais(TERRITORIO)
    equipamentos = await getEquipamentos(TERRITORIO)
  } catch (e) { console.error(e) }

  const indRP = indicadores.filter((i: any) => i.nome?.includes('Rio das Pedras'))
  const equipRP = equipamentos.filter((e: any) => e.sub_territorio === SUB)

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, var(--pci-navy) 0%, #1e3a8a 100%)', color: 'white', borderBottom: '3px solid var(--pci-cyan)' }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <Link href="/territorios" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Territórios</Link>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>›</span>
            <Link href="/territorios/cinturao-jacarepagua" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cinturão de Jacarepaguá</Link>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>›</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Rio das Pedras</span>
          </div>
          <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.1, marginBottom: 10 }}>
            Rio das Pedras
          </h1>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.95rem', color: 'rgba(255,255,255,0.65)', maxWidth: 580, lineHeight: 1.7, marginBottom: 16 }}>
            Uma das maiores favelas do Brasil. 2ª maior por número de domicílios (Censo 2022). Maior território em população absoluta do Cinturão de Jacarepaguá.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span className="pci-tag-navy">64.988 habitantes</span>
            <span className="pci-tag-navy">33.112 domicílios</span>
            <span className="pci-tag-navy">#2 no Brasil por domicílios</span>
            <span className="pci-tag-navy">51.829 hab/km²</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-14">

        {/* Histórico */}
        <section>
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.6rem', marginBottom: 16 }}>Histórico</h2>
          <div className="pci-card p-6">
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.92rem', color: 'var(--pci-dim)', lineHeight: 1.85 }}>
              Rio das Pedras desenvolveu-se a partir dos <strong>anos 1970</strong> com a chegada intensa de migrantes nordestinos que ocuparam a área de forma espontânea, em terrenos da Zona Oeste ainda pouco urbanizados. Sua expansão acelerada ao longo das décadas seguintes resultou em uma das maiores favelas do Brasil em extensão territorial e número de moradores.
            </p>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.92rem', color: 'var(--pci-dim)', lineHeight: 1.85, marginTop: 12 }}>
              Nos anos 1990, Rio das Pedras tornou-se conhecida pela formação de uma das primeiras <strong>milícias</strong> do Rio de Janeiro — grupos armados compostos originalmente por policiais e ex-policiais que passaram a cobrar taxas de moradores e comerciantes em troca de "proteção", expulsando traficantes e assumindo o controle territorial. Esse fenômeno, que começou em Rio das Pedras, espalhou-se por toda a Zona Oeste e tornou-se objeto de diversas CPIs e investigações do poder público.
            </p>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.92rem', color: 'var(--pci-dim)', lineHeight: 1.85, marginTop: 12 }}>
              A comunidade abriga forte organização interna e vida cultural ativa. Em 2022, o Censo Demográfico confirmou Rio das Pedras como a <strong>2ª maior favela do Brasil por número de domicílios</strong>, com mais de 33 mil unidades habitacionais.
            </p>
          </div>
        </section>

        {/* Comunidades */}
        <section>
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.6rem', marginBottom: 20 }}>Comunidades</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { nome: 'Rio das Pedras', desc: 'Núcleo central da favela, origem histórica do território.' },
              { nome: 'A.M. e Amigos de Rio das Pedras', desc: 'Área de expansão com forte organização associativa.' },
              { nome: 'Barracão', desc: 'Área de ocupação consolidada próxima ao núcleo central.' },
              { nome: 'Estrada de Jacarepaguá nº 2.679', desc: 'Ocupação linear ao longo da Estrada de Jacarepaguá.' },
              { nome: 'Estrada do Sertão', desc: 'Área de expansão periférica do complexo.' },
            ].map((f, i) => (
              <div key={i} className="pci-card p-5" style={{ borderLeft: '4px solid var(--pci-cyan)' }}>
                <p style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '0.88rem', color: 'var(--pci-navy)', marginBottom: 6 }}>{f.nome}</p>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: 'var(--pci-dim)', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Dados */}
        <section>
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.6rem', marginBottom: 20 }}>Dados Sociográficos</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TabelaDados
              titulo="Caracterização Populacional"
              fonte="IBGE — Censo Demográfico 2022"
              linhas={[
                { label: 'População total', valor: 64988, unidade: 'habitantes', destaque: true },
                { label: 'Total de domicílios', valor: 33112, unidade: 'domicílios', destaque: true },
                { label: 'Média de moradores/domicílio', valor: '2,0' },
                { label: 'Densidade demográfica', valor: '51.829', unidade: 'hab/km²' },
                { label: 'Taxa de alfabetização', valor: '92,59%' },
                { label: 'Ranking nacional por domicílios', valor: '2ª maior favela do Brasil' },
              ]}
            />
            <TabelaDados
              titulo="Comparação com contexto nacional"
              fonte="IBGE — Censo Demográfico 2022"
              linhas={[
                { label: 'Densidade — Rio das Pedras', valor: '51.829', unidade: 'hab/km²', destaque: true },
                { label: 'Densidade — Município do Rio', valor: '5.325', unidade: 'hab/km²' },
                { label: 'Densidade — Estado do RJ', valor: '365', unidade: 'hab/km²' },
                { label: 'Densidade — Brasil', valor: '23,8', unidade: 'hab/km²' },
                { label: 'Rio das Pedras vs. Município', valor: '~10x mais denso', destaque: true },
              ]}
            />
          </div>
        </section>

        {/* Mapas */}
        <section>
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.6rem', marginBottom: 8 }}>Mapas Temáticos</h2>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.88rem', color: 'var(--pci-dim)', marginBottom: 20 }}>
            Mapas de camadas de Rio das Pedras · Programa Cidade Integrada
          </p>
          <GaleriaMapa mapas={MAPAS} />
        </section>

        {/* Obras planejadas */}
        <section>
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.6rem', marginBottom: 8 }}>Intervenções Planejadas pelo PCI</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { titulo: 'Complexo Multisserviços', desc: 'AME (Ambulatório Médico de Especialidades), SAMU e UPA 24h integrados.', tipo: 'Saúde' },
              { titulo: 'Mercado Produtor', desc: 'Espaço coberto para comercialização de produtos locais e fortalecimento da economia do território.', tipo: 'Econômico' },
              { titulo: 'CRJ — Centro de Tecnologia', desc: 'Qualificação em tecnologia para jovens e adultos do território.', tipo: 'Educação' },
              { titulo: 'Escola de Ensino Médio', desc: 'Construção de nova escola estadual para atender o déficit educacional do território.', tipo: 'Educação' },
              { titulo: 'Companhia Avançada PMERJ', desc: 'Base avançada da Polícia Militar para reforço da segurança pública.', tipo: 'Segurança' },
              { titulo: 'Praça do Pouso — Morro do Banco', desc: 'Nova praça pública com equipamentos de lazer e paisagismo.', tipo: 'Urbanismo' },
            ].map((o, i) => (
              <div key={i} className="pci-card p-5" style={{ borderLeft: '4px solid var(--pci-cyan)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="pci-tag">{o.tipo}</span>
                  <span className="badge badge-amber badge">Planejado</span>
                </div>
                <p style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '0.88rem', color: 'var(--pci-text)', marginBottom: 4 }}>{o.titulo}</p>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: 'var(--pci-dim)', lineHeight: 1.5 }}>{o.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Equipamentos */}
        {equipRP.length > 0 && (
          <section>
            <div className="pci-accent-line" />
            <h2 className="pci-title" style={{ fontSize: '1.6rem', marginBottom: 20 }}>Equipamentos Públicos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Educação', 'Saúde'].map(tipo => {
                const itens = equipRP.filter((e: any) => e.tipo === tipo)
                if (!itens.length) return null
                return (
                  <div key={tipo} className="pci-card overflow-hidden">
                    <div style={{ padding: '12px 20px', background: 'var(--pci-navy)' }}>
                      <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>{tipo}</h3>
                    </div>
                    {itens.map((e: any, i: number) => (
                      <div key={i} style={{ padding: '10px 20px', borderBottom: '1px solid var(--pci-border)', background: i % 2 === 0 ? 'white' : '#fafbfd' }}>
                        <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, fontSize: '0.82rem', color: 'var(--pci-text)' }}>{e.nome}</p>
                        <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-muted)', marginTop: 2 }}>{e.subtipo} · {e.endereco}</p>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Diagnóstico IA */}
        <section>
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.6rem', marginBottom: 20 }}>Diagnóstico Territorial</h2>
          <DiagnosticoIA
            subTerritorio={SUB}
            indicadores={indRP}
            programas={programas.slice(0, 8)}
            equipamentos={equipRP.slice(0, 8)}
          />
        </section>

      </div>
    </div>
  )
}

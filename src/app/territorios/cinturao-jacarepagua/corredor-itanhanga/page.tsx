import Link from 'next/link'
import { getFavelas, getIndicadores, getProgramasSociais, getEquipamentos } from '@/lib/directus'
import GaleriaMapa from '@/components/ui/GaleriaMapa'
import TabelaDados from '@/components/ui/TabelaDados'
import Diagnostico from '@/components/ui/Diagnostico'

export const revalidate = 3600

const SUB = 'Corredor do Itanhangá'
const TERRITORIO = 'Cinturão de Jacarepaguá'

const MAPAS = [
  {
    titulo: 'Mapa de Infraestrutura',
    descricao: 'Praças reformadas pelo PCI, escolas, hospitais, vias principais e transporte hidroviário.',
    url: 'https://lh3.googleusercontent.com/d/180RS5Uh51rAZJjfUW9t7NvEt9GFUztuT',
  },
  {
    titulo: 'Mapa de Mobilidade',
    descricao: 'Projetos do PCI, ciclovias existentes e projetadas, transporte BRT, metrô e hidroviário.',
    url: 'https://lh3.googleusercontent.com/d/1n1sNKwTxAZUM6Xa7ovPAy9cE4ieGsREg',
  },
  {
    titulo: 'Mapa de Meio Ambiente',
    descricao: 'Áreas de conservação, proteção de manguezais, hidrografia e zonas de amortecimento do Parque Nacional da Tijuca.',
    url: 'https://lh3.googleusercontent.com/d/1MNj7Wl55DD_qzeRxKSgsQbo6UuH-whtG',
  },
]

export default async function CorredorItanhangaPage() {
  let favelas: any[] = []
  let indicadores: any[] = []
  let programas: any[] = []
  let equipamentos: any[] = []

  try {
    favelas      = await getFavelas(SUB)
    indicadores  = await getIndicadores(TERRITORIO)
    programas    = await getProgramasSociais(TERRITORIO)
    equipamentos = await getEquipamentos(TERRITORIO)
  } catch (e) { console.error(e) }

  const indCI = indicadores.filter((i: any) =>
    i.nome?.includes('Corredor') || i.nome?.includes('Itanhangá')
  )

  const equipCI = equipamentos.filter((e: any) =>
    e.sub_territorio === SUB || e.sub_territorio?.includes('Itanhangá')
  )

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, var(--pci-navy) 0%, #1e3a8a 100%)', color: 'white', borderBottom: '3px solid var(--pci-cyan)' }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <Link href="/territorios" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Territórios</Link>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>›</span>
            <Link href="/territorios/cinturao-jacarepagua" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cinturão de Jacarepaguá</Link>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>›</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Corredor do Itanhangá</span>
          </div>
          <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.1, marginBottom: 10 }}>
            Corredor do Itanhangá
          </h1>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.95rem', color: 'rgba(255,255,255,0.65)', maxWidth: 580, lineHeight: 1.7, marginBottom: 16 }}>
            Território com 9 comunidades em área de transição entre a Barra da Tijuca e Jacarepaguá, marcado por rico histórico cultural e pela tragédia da Muzema em 2019.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span className="pci-tag-navy">29.165 habitantes</span>
            <span className="pci-tag-navy">13.347 domicílios</span>
            <span className="pci-tag-navy">9 comunidades</span>
            <span className="pci-tag-navy">Taxa alf. 96,08%</span>
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
              O processo de ocupação do Corredor do Itanhangá iniciou-se em <strong>1951</strong>, quando Muzema e Tijuquinha foram estabelecidas simultaneamente. A Muzema, cujo nome tem origem indígena relacionada a vocábulos africanos, foi ocupada originalmente como colônia de pescadores em áreas de palafitas sobre manguezal às margens da Lagoa de Marapendi.
            </p>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.92rem', color: 'var(--pci-dim)', lineHeight: 1.85, marginTop: 12 }}>
              A abertura de vias na década de 1970 acelerou a ocupação por migrantes nordestinos. O <strong>Morro do Banco</strong> foi ocupado por trabalhadores da Companhia Tijuca. Em <strong>abril de 2019</strong>, dois prédios construídos ilegalmente pela milícia desabaram na Muzema, matando 24 pessoas — um dos maiores desastres causados pela construção irregular no Rio de Janeiro, que deu visibilidade à gravidade da dominação miliciana no território.
            </p>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.92rem', color: 'var(--pci-dim)', lineHeight: 1.85, marginTop: 12 }}>
              O Morro do Banco abriga iniciativas culturais consolidadas, como o <strong>Projeto Eflorescer</strong> (balé clássico) e o <strong>Baalaka Social</strong>, que há décadas promovem arte e saúde mental na comunidade.
            </p>
          </div>
        </section>

        {/* Comunidades */}
        <section>
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.6rem', marginBottom: 20 }}>Comunidades</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { nome: 'Floresta da Barra da Tijuca (Morro do Banco)', destaque: 'Sede do Projeto Eflorescer e Baalaka Social' },
              { nome: 'Tijuquinha', destaque: 'Uma das primeiras ocupações do corredor' },
              { nome: 'Sítio do Pai João', destaque: 'Ant. "Péla Porca", formado por funcionários do Itanhangá Golf Club' },
              { nome: 'Vila da Paz', destaque: '' },
              { nome: 'Vila Santa Terezinha', destaque: 'Ocupação iniciada por migrantes de MG e Nordeste' },
              { nome: 'Muzema', destaque: '⚠️ Tragédia 2019: desabamento de prédios da milícia (24 mortos)' },
              { nome: 'Angu Duro', destaque: '' },
              { nome: 'Cambalacho', destaque: '' },
              { nome: 'Regata', destaque: '' },
            ].map((f, i) => (
              <div key={i} className="pci-card p-4" style={{ borderLeft: f.destaque?.includes('⚠️') ? '4px solid #dc2626' : '4px solid var(--pci-cyan)' }}>
                <p style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '0.82rem', color: 'var(--pci-navy)', marginBottom: 4 }}>{f.nome}</p>
                {f.destaque && <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.72rem', color: f.destaque.includes('⚠️') ? '#dc2626' : 'var(--pci-dim)', lineHeight: 1.4 }}>{f.destaque}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Dados sociográficos */}
        <section>
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.6rem', marginBottom: 20 }}>Dados Sociográficos</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TabelaDados
              titulo="Caracterização Populacional"
              fonte="IBGE — Censo Demográfico 2022"
              linhas={[
                { label: 'População estimada', valor: 29165, unidade: 'habitantes', destaque: true },
                { label: 'Total de domicílios', valor: 13347, unidade: 'domicílios' },
                { label: 'Média de moradores/domicílio', valor: '2,1', unidade: 'pessoas' },
                { label: 'Densidade demográfica', valor: '41.685', unidade: 'hab/km²', destaque: true },
                { label: 'Taxa de alfabetização', valor: '96,08%' },
                { label: 'População feminina', valor: '51,3%' },
              ]}
            />
            <TabelaDados
              titulo="Distribuição por Raça/Cor"
              fonte="IBGE — Censo Demográfico 2022"
              linhas={[
                { label: 'Pardos (masculino)', valor: '51,46%', destaque: true },
                { label: 'Brancos (masculino)', valor: '39,69%' },
                { label: 'Pretos (masculino)', valor: '11,68%' },
                { label: 'Pardas (feminino)', valor: '49,77%', destaque: true },
                { label: 'Brancas (feminino)', valor: '38,54%' },
                { label: 'Pretas (feminino)', valor: '11,40%' },
              ]}
            />
          </div>
        </section>

        {/* Mapas */}
        <section>
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.6rem', marginBottom: 8 }}>Mapas Temáticos</h2>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.88rem', color: 'var(--pci-dim)', marginBottom: 20 }}>
            Mapas de camadas do Corredor do Itanhangá · Programa Cidade Integrada
          </p>
          <GaleriaMapa mapas={MAPAS} />
        </section>

        {/* Obras executadas */}
        <section>
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.6rem', marginBottom: 8 }}>Intervenções Urbanísticas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { titulo: 'Praça da Floresta', local: 'Morro do Banco', status: 'Executado', desc: 'Requalificação com novos equipamentos de lazer e paisagismo' },
              { titulo: 'Praça da Ivete', local: 'Morro do Banco', status: 'Executado', desc: 'Nova pavimentação e mobiliário urbano' },
              { titulo: 'Praça da Área Verde', local: 'Morro do Banco', status: 'Executado', desc: 'Recuperação de área verde com equipamentos de convivência' },
              { titulo: 'Quadra Esportiva Sítio Pai João', local: 'Sítio Pai João', status: 'Executado', desc: 'Reforma e modernização da quadra comunitária' },
              { titulo: 'Ciclovia Rio das Pedras – Muzema', local: 'Rio das Pedras/Muzema', status: 'Executado', desc: '~900m de infraestrutura cicloviária conectando as comunidades' },
              { titulo: 'Praça Amizade', local: 'Vila da Paz', status: 'Executado', desc: 'Novo paisagismo e mobiliário urbano' },
              { titulo: 'Polo de Reciclagem', local: 'Corredor Itanhangá', status: 'Planejado', desc: 'Edificação de 2 pavimentos para processamento de resíduos sólidos' },
              { titulo: 'Praça e Deck – Barco-Táxi', local: 'Pedra do Itanhangá', status: 'Planejado', desc: 'Ampliação da mobilidade via modal aquaviário' },
            ].map((o, i) => (
              <div key={i} className="pci-card p-4" style={{ borderLeft: `4px solid ${o.status === 'Executado' ? 'var(--pci-green)' : 'var(--pci-cyan)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span className="pci-tag">{o.status}</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-muted)' }}>📍 {o.local}</span>
                </div>
                <p style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '0.88rem', color: 'var(--pci-text)', marginBottom: 4 }}>{o.titulo}</p>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: 'var(--pci-dim)' }}>{o.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Diagnóstico IA */}
        <section>
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.6rem', marginBottom: 20 }}>Diagnóstico Territorial</h2>
          <Diagnostico
            fonte="IBGE Censo 2022 · PCI Relatórios 2025"
            secoes={[
              {
                titulo: "Perfil Populacional",
                conteudo: "O Corredor do Itanhangá concentra 29.165 habitantes em 13.347 domicílios, com média de 2,1 pessoas por domicílio. A densidade de 41.685 hab/km² é a menor entre os territórios do Cinturão, o que não implica menor vulnerabilidade. A taxa de alfabetização de 96,08% é a mais elevada do Cinturão, refletindo histórico de maior organização comunitária e cobertura escolar. A composição étnico-racial é majoritariamente parda (cerca de 50%) com presença expressiva de população branca (38%)."
              },
              {
                titulo: "Vulnerabilidades Identificadas",
                conteudo: "A Muzema carrega o trauma do desabamento de 2019, que vitimou 24 moradores em edificações irregulares erguidas pela milícia — evidenciando o risco estrutural da construção informal sem fiscalização. A dependência de um único corredor viário (Estrada do Itanhangá) gera estrangulamento na mobilidade, com impacto direto no acesso a serviços e no tempo de deslocamento da população. A proximidade ao Parque Nacional da Tijuca e às lagoas costeiras cria zonas de restrição ambiental que limitam possibilidades de expansão e regularização."
              },
              {
                titulo: "Capacidades e Ativos",
                conteudo: "O território apresenta o maior índice de alfabetização do Cinturão e forte presença de iniciativas culturais consolidadas, como o Projeto Eflorescer e o Baalaka Social, ambos com mais de uma década de atuação no Morro do Banco. O PCI já entregou oito intervenções urbanísticas no território, incluindo praças, quadra esportiva e ciclovia de 900 metros conectando Muzema e Rio das Pedras. A Clínica da Família do Morro do Banco e o CMS Itanhangá garantem cobertura de atenção primária à saúde."
              },
              {
                titulo: "Recomendações Prioritárias",
                conteudo: "Implementar o Polo de Reciclagem planejado, priorizando a contratação de trabalhadores do próprio território para geração de renda local. Avançar na construção da Praça e Deck para o barco-táxi, ampliando a oferta modal e reduzindo a dependência do corredor viário terrestre. Desenvolver plano de regularização fundiária específico para as áreas afetadas pela atuação de milícias, garantindo segurança jurídica às famílias e prevenindo novas construções de risco."
              }
            ]}
          />
        </section>

      </div>
    </div>
  )
}

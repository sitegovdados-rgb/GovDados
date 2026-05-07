import Link from 'next/link'
import { getFavelas, getIndicadores, getProgramasSociais, getEquipamentos } from '@/lib/directus'
import GaleriaMapa from '@/components/ui/GaleriaMapa'
import TabelaDados from '@/components/ui/TabelaDados'
import Diagnostico from '@/components/ui/Diagnostico'

export const revalidate = 3600

const SUB = 'Gardênia Azul'
const TERRITORIO = 'Cinturão de Jacarepaguá'

// URLs das imagens do Drive (via Google Drive viewer público)
const MAPAS = [
  {
    titulo: 'Mapa de Limites Urbanos',
    descricao: 'Delimitação das 5 favelas do Complexo da Gardênia Azul e limites com bairros vizinhos.',
    url: 'https://lh3.googleusercontent.com/d/1PxIQEFyrWKdM927q_71zQMwLVWlWJetn',
  },
  {
    titulo: 'Mapa de Mobilidade Urbana',
    descricao: 'Linhas de ônibus, BRT, rede cicloviária e transporte hidroviário na região.',
    url: 'https://lh3.googleusercontent.com/d/16nQWnWmcVMtfi9Iv3_ueChCffNSVLWh6',
  },
  {
    titulo: 'Mapa de Infraestrutura e Meio Ambiente',
    descricao: 'Drenagem pluvial, corpos hídricos, áreas protegidas e suscetibilidade a inundações.',
    url: 'https://lh3.googleusercontent.com/d/1xAnMnqShITrh3-jwgzw9qDJY4QUFGmDm',
  },
  {
    titulo: 'Mapa de Equipamentos Públicos',
    descricao: 'Unidades educacionais, de saúde, praças, quadras e terrenos subutilizados.',
    url: 'https://lh3.googleusercontent.com/d/1UXH-nw38bUT2N_ezGIMlBxJ0p6VNFNWP',
  },
]

export default async function GardeniaAzulPage() {
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

  const indGardenia = indicadores.filter((i: any) =>
    i.nome?.includes('Gardênia') || i.nome?.includes('Canal do Anil') ||
    i.nome?.includes('Vila Nova') || i.nome?.includes('Novo Rio') ||
    i.nome?.includes('Avenida das Lagoas') || i.nome?.includes('Curipós')
  )

  const equip = equipamentos.filter((e: any) => e.sub_territorio === SUB || !e.sub_territorio)

  return (
    <div>
      {/* Header */}
      <section style={{ background: 'linear-gradient(135deg, var(--pci-navy) 0%, #1e3a8a 100%)', color: 'white', borderBottom: '3px solid var(--pci-cyan)' }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <Link href="/territorios" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Territórios</Link>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>›</span>
            <Link href="/territorios/cinturao-jacarepagua" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cinturão de Jacarepaguá</Link>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>›</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Gardênia Azul</span>
          </div>
          <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.1, marginBottom: 10 }}>
            Gardênia Azul
          </h1>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.95rem', color: 'rgba(255,255,255,0.65)', maxWidth: 580, lineHeight: 1.7, marginBottom: 16 }}>
            Território com 5 comunidades na Zona Sudoeste do Rio de Janeiro, inserido na Baixada de Jacarepaguá — XVI Região Administrativa.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span className="pci-tag-navy">17.399 habitantes</span>
            <span className="pci-tag-navy">7.109 domicílios</span>
            <span className="pci-tag-navy">5 comunidades</span>
            <span className="pci-tag-navy">Zona Sudoeste · Jacarepaguá</span>
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
              A origem da Gardênia Azul remonta ao período colonial, quando a área integrava grandes propriedades rurais com engenhos. O <strong>Engenho D'Água</strong>, do século XVII, foi parte da fazenda transferida ao Barão da Taquara em 1847. A transformação urbana mais significativa ocorreu a partir dos anos 1950, quando José Padilha Coimbra promoveu o loteamento das terras, nomeando-o com referências botânicas — daí o nome "Gardênia Azul".
            </p>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.92rem', color: 'var(--pci-dim)', lineHeight: 1.85, marginTop: 12 }}>
              Na década de 1990, o bairro passou por intenso crescimento populacional impulsionado pela expansão da Zona Oeste e pela chegada de populações de baixa renda, resultando na formação de sublocalidades com padrões distintos de ocupação. A proximidade de algumas favelas com os rios do Anil e do Arroio Fundo representa um dos principais riscos ambientais do território.
            </p>
          </div>
        </section>

        {/* Favelas */}
        <section>
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.6rem', marginBottom: 8 }}>Comunidades</h2>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.88rem', color: 'var(--pci-dim)', marginBottom: 20 }}>
            5 comunidades compõem o Complexo da Gardênia Azul
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { nome: 'Canal do Anil (Chico City)', pop: 6910, area: '172.192 m²', desc: 'Ocupação linear ao longo do Canal do Anil. Área em consolidação, com déficit significativo de saneamento e alta vulnerabilidade a alagamentos.' },
              { nome: 'Vila Nova Esperança', pop: 6936, area: '111.187 m²', desc: 'Maior comunidade em população. Surgiu nos anos 1990 por expansão urbana espontânea, sem planejamento, resultando em alta densidade.' },
              { nome: 'Novo Rio (A.M. Novo Rio de Jacarepaguá)', pop: 2049, area: '42.048 m²', desc: 'Frente de expansão urbana recente com autoconstrução progressiva, incluindo edificações multifamiliares.' },
              { nome: 'Avenida das Lagoas', pop: 1088, area: '23.558 m²', desc: 'Próxima às margens lagunares. Enfrenta déficits críticos em saneamento e drenagem devido à localização junto ao sistema lagunar.' },
              { nome: 'Estrada Curipós nº 310', pop: 416, area: '19.635 m²', desc: 'Núcleo em área de encosta com topografia irregular. Acessos estreitos e malha viária orgânica dificultam infraestrutura.' },
            ].map((f, i) => (
              <div key={i} className="pci-card p-5" style={{ borderLeft: '4px solid var(--pci-cyan)' }}>
                <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.88rem', color: 'var(--pci-navy)', marginBottom: 8 }}>{f.nome}</h3>
                <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
                  <div>
                    <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '1.2rem', color: 'var(--pci-blue)' }}>{f.pop.toLocaleString('pt-BR')}</p>
                    <p className="pci-label">habitantes</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.9rem', color: 'var(--pci-text)' }}>{f.area}</p>
                    <p className="pci-label">área</p>
                  </div>
                </div>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: 'var(--pci-dim)', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Dados sociográficos + gráfico */}
        <section>
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.6rem', marginBottom: 20 }}>Dados Sociográficos</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TabelaDados
              titulo="Caracterização Populacional"
              fonte="IBGE — Censo Demográfico 2022"
              linhas={[
                { label: 'População total (5 comunidades)', valor: 17399, unidade: 'habitantes', destaque: true },
                { label: 'Total de domicílios', valor: 7109, unidade: 'domicílios' },
                { label: 'Densidade demográfica', valor: '36.041,98', unidade: 'hab/km²', destaque: true },
                { label: 'Taxa de alfabetização', valor: '92,3%' },
                { label: 'Raça/cor predominante', valor: 'Parda (53,49%)' },
                { label: 'Raça/cor secundária', valor: 'Branca (27,87%)' },
              ]}
            />
            <TabelaDados
              titulo="Por Comunidade"
              fonte="IBGE — Censo Demográfico 2022"
              linhas={[
                { label: 'Canal do Anil (Chico City)', valor: 6910, unidade: 'hab.', destaque: true },
                { label: 'Vila Nova Esperança', valor: 6936, unidade: 'hab.', destaque: true },
                { label: 'Novo Rio', valor: 2049, unidade: 'hab.' },
                { label: 'Avenida das Lagoas', valor: 1088, unidade: 'hab.' },
                { label: 'Estrada Curipós nº 310', valor: 416, unidade: 'hab.' },
              ]}
            />
          </div>
        </section>

        {/* Mapas */}
        <section>
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.6rem', marginBottom: 8 }}>Mapas Temáticos</h2>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.88rem', color: 'var(--pci-dim)', marginBottom: 20 }}>
            Mapas de camadas do território · Programa Cidade Integrada
          </p>
          <GaleriaMapa mapas={MAPAS} />
        </section>

        {/* Equipamentos */}
        {equip.length > 0 && (
          <section>
            <div className="pci-accent-line" />
            <h2 className="pci-title" style={{ fontSize: '1.6rem', marginBottom: 8 }}>Equipamentos Públicos</h2>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.88rem', color: 'var(--pci-dim)', marginBottom: 20 }}>
              Equipamentos públicos próximos ao território
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { tipo: 'Educação', itens: [
                  { nome: 'Escola Municipal Azerbaijão Primário', end: 'Av. Tenente-Coronel Muniz de Aragão, 1151' },
                  { nome: 'Colégio Estadual Eduardo Mondlane', end: 'Rua Acapori, 495' },
                  { nome: 'E.M. Profª Helena Lopes Abranches', end: 'Rua Acapori, 495' },
                  { nome: 'EDI Maria Berenice Parente', end: 'Rua Maruja, s/nº' },
                  { nome: 'Creche Municipal Germinio de Souza Estrela', end: 'Rua Camposema, 495' },
                  { nome: 'EDI Professora Norma Andrade Nogueira', end: 'Av. Otávio Malta / Av. Canal do Anil, 1201' },
                ]},
                { tipo: 'Saúde', itens: [
                  { nome: 'Clínica da Família Padre José de Azevedo Tiúba', end: 'Rua Camposema, 29' },
                  { nome: 'UPA Cidade de Deus', end: 'Referência regional' },
                  { nome: 'UPA Barra da Tijuca', end: 'Referência regional' },
                  { nome: 'Hospital Municipal Lourenço Jorge', end: 'Barra da Tijuca' },
                ]},
              ].map((grupo) => (
                <div key={grupo.tipo} className="pci-card overflow-hidden">
                  <div style={{ padding: '12px 20px', background: 'var(--pci-navy)' }}>
                    <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>{grupo.tipo}</h3>
                  </div>
                  <div>
                    {grupo.itens.map((item, i) => (
                      <div key={i} style={{ padding: '10px 20px', borderBottom: '1px solid var(--pci-border)', background: i % 2 === 0 ? 'white' : '#fafbfd' }}>
                        <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, fontSize: '0.82rem', color: 'var(--pci-text)' }}>{item.nome}</p>
                        <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-muted)', marginTop: 2 }}>{item.end}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Diagnóstico IA */}
        <section>
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.6rem', marginBottom: 20 }}>Diagnóstico Territorial</h2>
          <Diagnostico
            fonte="IBGE Censo 2022 · PCI Relatórios 2025 · Levantamento Social Prévio"
            secoes={[
              {
                titulo: "Perfil Populacional",
                conteudo: "O Complexo da Gardênia Azul concentra 17.399 habitantes em 7.109 domicílios, distribuídos por cinco comunidades. A densidade demográfica de 36.041,98 hab/km² é expressiva, porém inferior às demais favelas do Cinturão. A composição étnico-racial é predominantemente parda (53,49%) e branca (27,87%). A taxa de alfabetização de 92,3% evidencia déficit educacional que demanda atenção, em especial para a população adulta."
              },
              {
                titulo: "Vulnerabilidades Identificadas",
                conteudo: "A proximidade de Canal do Anil e Avenida das Lagoas com o sistema hídrico — Canal do Anil e Arroio Fundo — expõe parcela significativa da população ao risco de alagamentos sazonais, agravados por déficits históricos de drenagem e saneamento. A fragmentação física entre as cinco comunidades dificulta a cobertura homogênea de serviços públicos e a conectividade interna do território. A frente de expansão em Novo Rio e Estrada Curipós concentra edificações autoconstruídas sem regularização urbanística."
              },
              {
                titulo: "Capacidades e Ativos",
                conteudo: "O território conta com cobertura de saúde pela Clínica da Família Padre José de Azevedo Tiúba e acesso ao sistema UPA regional. A rede escolar abrange todas as etapas do ensino básico, com seis unidades de educação infantil e fundamental no raio de atendimento. O Parque Linear da Avenida Isabel Domingues, entregue pelo PCI em 2023, representa significativo avanço na qualificação dos espaços públicos, com 14 mil m² revitalizados e 50 quiosques de geração de renda."
              }]}
          />
        </section>

      </div>
    </div>
  )
}

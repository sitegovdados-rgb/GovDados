'use client'

import { useMemo } from 'react'
import {
  TabGroup, TabList, Tab, TabPanels, TabPanel,
  Card, Grid, Metric, Text, Title, Flex,
  BadgeDelta, BarChart, DonutChart, Legend,
} from '@tremor/react'

// ─── tipos ────────────────────────────────────────────────────────────────────
interface Props {
  indicadores:  any[]
  programas:    any[]
  urbanismo:    any[]
  equipamentos: any[]
}

// ─── helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number | string | null | undefined): string {
  if (n == null || n === '') return '—'
  const num = typeof n === 'string'
    ? parseFloat(n.replace(/\./g, '').replace(',', '.'))
    : n
  if (isNaN(num)) return String(n)
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace('.', ',') + ' mi'
  if (num >= 1_000) return num.toLocaleString('pt-BR')
  return String(num)
}

function groupBy(arr: any[], key: string): Record<string, number> {
  return arr.reduce((acc, item) => {
    const k = item?.[key] || 'Não informado'
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}

function toChart(grouped: Record<string, number>, idx: string, cat: string) {
  return Object.entries(grouped)
    .map(([k, v]) => ({ [idx]: k, [cat]: v }))
    .sort((a: any, b: any) => b[cat] - a[cat])
}

// ─── paleta ───────────────────────────────────────────────────────────────────
const NAVY   = '#1a2a5e'
const BLUE   = '#2563a8'
const CYAN   = '#00a8cc'
const LIGHT  = '#e8f4fa'
const BG     = '#f5f7fc'
const BORDER = '#d4dff0'
const TEXT   = '#0f1d3d'
const DIM    = '#4a5f8a'
const MUTED  = '#8fa3c8'
const COLORS = ['cyan', 'blue', 'indigo', 'sky', 'teal', 'violet'] as any[]

// ─── subcomponentes ───────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, delta, deltaType }: {
  label: string; value: string | number; sub?: string
  delta?: string; deltaType?: any
}) {
  return (
    <Card decoration="top" decorationColor="cyan">
      <Text style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED }}>
        {label}
      </Text>
      <Metric style={{ fontFamily: 'Sora, sans-serif', color: NAVY, marginTop: 4 }}>{value}</Metric>
      <Flex justifyContent="start" className="mt-2 gap-2">
        {delta && deltaType && <BadgeDelta deltaType={deltaType} size="xs">{delta}</BadgeDelta>}
        {sub && <Text style={{ fontSize: '0.78rem', color: DIM }}>{sub}</Text>}
      </Flex>
    </Card>
  )
}

function SectionTitle({ title, count: c }: { title: string; count?: number }) {
  return (
    <Flex justifyContent="start" alignItems="center" className="gap-3 mb-5">
      <div style={{ width: 40, height: 4, background: CYAN, borderRadius: 2, flexShrink: 0 }} />
      <Title style={{ fontFamily: 'Sora, sans-serif', margin: 0 }}>{title}</Title>
      {c != null && (
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.62rem', background: LIGHT, color: BLUE, border: `1px solid ${BORDER}`, padding: '2px 8px', borderRadius: 4 }}>
          {c} itens
        </span>
      )}
    </Flex>
  )
}

function StatusBadge({ status }: { status: string }) {
  const s = (status || '').toLowerCase()
  let cls = 'badge badge-gray'
  if (/(ativ|andamento|concluíd|concluido)/.test(s)) cls = 'badge badge-green'
  else if (/(planejado|previsto)/.test(s)) cls = 'badge badge-blue'
  else if (/(suspenso|paralisado)/.test(s)) cls = 'badge badge-amber'
  return <span className={cls}>{status || '—'}</span>
}

function Tabela({ headers, rows }: { headers: string[]; rows: any[][] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Plus Jakarta Sans', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: NAVY }}>
            {headers.map(h => (
              <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: 'white', fontFamily: 'JetBrains Mono', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500, whiteSpace: 'nowrap' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'white' : BG, borderBottom: `1px solid ${BORDER}` }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '10px 16px', color: j === 0 ? TEXT : DIM, fontWeight: j === 0 ? 600 : 400, maxWidth: j === 0 ? 280 : undefined }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── aba população ────────────────────────────────────────────────────────────
function TabPopulacao({ indicadores }: { indicadores: any[] }) {
  const totalPop = indicadores
    .filter(i => /(populaç|populacao|habitantes|moradores)/i.test(i.nome || ''))
    .reduce((s, i) => s + (Number(i.valor) || 0), 0)

  const totalDom = indicadores
    .filter(i => /(domicílio|domicilio)/i.test(i.nome || ''))
    .reduce((s, i) => s + (Number(i.valor) || 0), 0)

  const areasData = useMemo(() =>
    toChart(groupBy(indicadores, 'area_tematica'), 'Área', 'Indicadores'), [indicadores])

  const terrData = useMemo(() => {
    const map: Record<string, { name: string; Habitantes: number }> = {}
    for (const ind of indicadores) {
      const t = ind.territorio || ind.sub_territorio || 'Geral'
      if (/(populaç|populacao|habitantes|moradores)/i.test(ind.nome || '')) {
        if (!map[t]) map[t] = { name: t.length > 22 ? t.slice(0, 20) + '…' : t, Habitantes: 0 }
        map[t].Habitantes = Math.max(map[t].Habitantes, Number(ind.valor) || 0)
      }
    }
    return Object.values(map)
  }, [indicadores])

  return (
    <div className="flex flex-col gap-8">
      <Grid numItemsSm={2} numItemsLg={4} className="gap-4">
        <KpiCard label="População total" value={totalPop > 0 ? fmt(totalPop) : fmt(indicadores.length)} sub="Censo IBGE 2022" />
        <KpiCard label="Domicílios" value={totalDom > 0 ? fmt(totalDom) : '—'} sub="Censo IBGE 2022" />
        <KpiCard label="Favelas / Comunidades" value="19" sub="Cinturão de Jacarepaguá" />
        <KpiCard label="Indicadores cadastrados" value={indicadores.length} sub="Todas as dimensões" />
      </Grid>

      <Grid numItemsSm={1} numItemsLg={2} className="gap-6">
        {terrData.length > 0 && (
          <Card>
            <SectionTitle title="Habitantes por território" />
            <BarChart data={terrData} index="name" categories={['Habitantes']} colors={['cyan']} valueFormatter={fmt} showLegend={false} showAnimation />
          </Card>
        )}
        {areasData.length > 0 && (
          <Card>
            <SectionTitle title="Indicadores por área temática" />
            <BarChart data={areasData} index="Área" categories={['Indicadores']} colors={['blue']} showLegend={false} showAnimation layout="vertical" />
          </Card>
        )}
      </Grid>

      {indicadores.length > 0 && (
        <Card>
          <SectionTitle title="Todos os indicadores" count={indicadores.length} />
          <Tabela
            headers={['Indicador', 'Território', 'Área Temática', 'Valor', 'Unidade']}
            rows={indicadores.map(ind => [
              ind.nome || '—',
              ind.territorio || ind.sub_territorio || '—',
              ind.area_tematica || '—',
              <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: NAVY }}>{fmt(ind.valor)}</span>,
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: MUTED }}>{ind.unidade || '—'}</span>,
            ])}
          />
        </Card>
      )}
    </div>
  )
}

// ─── aba programas ────────────────────────────────────────────────────────────
function TabProgramas({ programas }: { programas: any[] }) {
  const eixoData   = useMemo(() => toChart(groupBy(programas, 'eixo'), 'Eixo', 'Programas'), [programas])
  const statusData = useMemo(() => toChart(groupBy(programas, 'status'), 'name', 'Programas'), [programas])
  const terrData   = useMemo(() => toChart(groupBy(programas, 'territorio'), 'Território', 'Programas'), [programas])
  const ativos = programas.filter(p => /(ativ|andamento|execução)/i.test(p.status || '')).length

  return (
    <div className="flex flex-col gap-8">
      <Grid numItemsSm={2} numItemsLg={4} className="gap-4">
        <KpiCard label="Total de programas" value={programas.length} sub="Sociais cadastrados" />
        <KpiCard label="Ativos / Em andamento" value={ativos} delta={`${ativos} de ${programas.length}`} deltaType="increase" sub="Execução confirmada" />
        <KpiCard label="Eixos de atuação" value={eixoData.length} sub="Dimensões de intervenção" />
        <KpiCard label="Territórios cobertos" value={terrData.length} sub="Áreas com atuação" />
      </Grid>

      <Grid numItemsSm={1} numItemsLg={2} className="gap-6">
        {eixoData.length > 0 && (
          <Card>
            <SectionTitle title="Programas por eixo" />
            <BarChart data={eixoData} index="Eixo" categories={['Programas']} colors={['cyan']} showLegend={false} showAnimation layout="vertical" />
          </Card>
        )}
        {statusData.length > 0 && (
          <Card>
            <SectionTitle title="Distribuição por status" />
            <DonutChart data={statusData} category="Programas" index="name" colors={COLORS} showAnimation valueFormatter={(v) => `${v} programa${v !== 1 ? 's' : ''}`} />
            <Legend categories={statusData.map((d: any) => d.name)} colors={COLORS} className="mt-4" />
          </Card>
        )}
      </Grid>

      {terrData.length > 0 && (
        <Card>
          <SectionTitle title="Programas por território" />
          <BarChart data={terrData} index="Território" categories={['Programas']} colors={['blue']} showLegend={false} showAnimation />
        </Card>
      )}

      {programas.length > 0 && (
        <Card>
          <SectionTitle title="Lista de programas sociais" count={programas.length} />
          <Tabela
            headers={['Programa', 'Território', 'Eixo', 'Tipo', 'Status']}
            rows={programas.map(p => [p.titulo || p.nome || '—', p.territorio || '—', p.eixo || '—', p.tipo || '—', <StatusBadge status={p.status || ''} />])}
          />
        </Card>
      )}
    </div>
  )
}

// ─── aba urbanismo ────────────────────────────────────────────────────────────
function TabUrbanismo({ urbanismo }: { urbanismo: any[] }) {
  const tipoData   = useMemo(() => toChart(groupBy(urbanismo, 'tipo'), 'Tipo', 'Projetos'), [urbanismo])
  const statusData = useMemo(() => toChart(groupBy(urbanismo, 'status'), 'name', 'Projetos'), [urbanismo])
  const terrData   = useMemo(() => toChart(groupBy(urbanismo, 'territorio'), 'Território', 'Projetos'), [urbanismo])
  const concluidos = urbanismo.filter(u => /(concluíd|concluido)/i.test(u.status || '')).length
  const emObra     = urbanismo.filter(u => /(obra|andamento|execução)/i.test(u.status || '')).length

  return (
    <div className="flex flex-col gap-8">
      <Grid numItemsSm={2} numItemsLg={4} className="gap-4">
        <KpiCard label="Total de projetos" value={urbanismo.length} sub="Arquitetônicos e urbanísticos" />
        <KpiCard label="Concluídos" value={concluidos} delta="entregues" deltaType="increase" sub="Obras entregues" />
        <KpiCard label="Em execução" value={emObra} delta="em andamento" deltaType="moderateIncrease" sub="Obras em andamento" />
        <KpiCard label="Tipos de projeto" value={tipoData.length} sub="Categorias distintas" />
      </Grid>

      <Grid numItemsSm={1} numItemsLg={2} className="gap-6">
        {tipoData.length > 0 && (
          <Card>
            <SectionTitle title="Projetos por tipo" />
            <BarChart data={tipoData} index="Tipo" categories={['Projetos']} colors={['indigo']} showLegend={false} showAnimation layout="vertical" />
          </Card>
        )}
        {statusData.length > 0 && (
          <Card>
            <SectionTitle title="Distribuição por status" />
            <DonutChart data={statusData} category="Projetos" index="name" colors={COLORS} showAnimation valueFormatter={(v) => `${v} projeto${v !== 1 ? 's' : ''}`} />
            <Legend categories={statusData.map((d: any) => d.name)} colors={COLORS} className="mt-4" />
          </Card>
        )}
      </Grid>

      {terrData.length > 0 && (
        <Card>
          <SectionTitle title="Projetos por território" />
          <BarChart data={terrData} index="Território" categories={['Projetos']} colors={['sky']} showLegend={false} showAnimation />
        </Card>
      )}

      {urbanismo.length > 0 && (
        <Card>
          <SectionTitle title="Lista de intervenções" count={urbanismo.length} />
          <Tabela
            headers={['Projeto', 'Território', 'Tipo', 'Status']}
            rows={urbanismo.map(u => [u.titulo || u.nome || '—', u.territorio || '—', u.tipo || '—', <StatusBadge status={u.status || ''} />])}
          />
        </Card>
      )}
    </div>
  )
}

// ─── aba equipamentos ─────────────────────────────────────────────────────────
function TabEquipamentos({ equipamentos }: { equipamentos: any[] }) {
  const tipoData = useMemo(() => toChart(groupBy(equipamentos, 'tipo'), 'Tipo', 'Unidades'), [equipamentos])
  const terrData = useMemo(() => toChart(groupBy(equipamentos, 'territorio'), 'Território', 'Unidades'), [equipamentos])
  const saude    = equipamentos.filter(e => e.tipo === 'Saúde').length
  const educacao = equipamentos.filter(e => e.tipo === 'Educação').length
  const assist   = equipamentos.filter(e => e.tipo === 'Assistência Social').length

  return (
    <div className="flex flex-col gap-8">
      <Grid numItemsSm={2} numItemsLg={4} className="gap-4">
        <KpiCard label="Total de equipamentos" value={equipamentos.length} sub="Unidades cadastradas" />
        <KpiCard label="Saúde" value={saude || (tipoData[0] as any)?.Unidades || '—'} sub="UPAs, CAPSs, Clínicas" />
        <KpiCard label="Educação" value={educacao || (tipoData[1] as any)?.Unidades || '—'} sub="Escolas e CIEPs" />
        <KpiCard label="Assist. Social" value={assist || (tipoData[2] as any)?.Unidades || '—'} sub="CRAS, CREAS" />
      </Grid>

      <Grid numItemsSm={1} numItemsLg={2} className="gap-6">
        {tipoData.length > 0 && (
          <Card>
            <SectionTitle title="Equipamentos por tipo" />
            <DonutChart data={tipoData} category="Unidades" index="Tipo" colors={COLORS} showAnimation valueFormatter={(v) => `${v} unidade${v !== 1 ? 's' : ''}`} />
            <Legend categories={tipoData.map((d: any) => d.Tipo)} colors={COLORS} className="mt-4" />
          </Card>
        )}
        {terrData.length > 0 && (
          <Card>
            <SectionTitle title="Equipamentos por território" />
            <BarChart data={terrData} index="Território" categories={['Unidades']} colors={['teal']} showLegend={false} showAnimation />
          </Card>
        )}
      </Grid>

      {equipamentos.length > 0 && (
        <Card>
          <SectionTitle title="Lista de equipamentos públicos" count={equipamentos.length} />
          <Tabela
            headers={['Equipamento', 'Território', 'Tipo', 'Endereço']}
            rows={equipamentos.map(eq => [
              eq.nome || '—',
              eq.territorio || '—',
              <StatusBadge status={eq.tipo || ''} />,
              <span style={{ color: MUTED, fontSize: '0.8rem' }}>{eq.endereco || eq.endereço || '—'}</span>,
            ])}
          />
        </Card>
      )}
    </div>
  )
}

// ─── componente principal ──────────────────────────────────────────────────────
export default function PainelExecutivo(props: Props) {
  const { indicadores, programas, urbanismo, equipamentos } = props
  const vazio = !indicadores.length && !programas.length && !urbanismo.length && !equipamentos.length

  return (
    <div style={{ background: BG, minHeight: '60vh' }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        {vazio ? (
          <Card style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📊</div>
            <Title style={{ fontFamily: 'Sora', color: NAVY, marginBottom: 8 }}>Carregando dados…</Title>
            <Text style={{ color: MUTED }}>Os dados serão exibidos assim que a conexão com o Directus for estabelecida.</Text>
          </Card>
        ) : (
          <TabGroup>
            <TabList className="mb-8">
              {[
                { label: '👥  População',    n: indicadores.length },
                { label: '📋  Programas',    n: programas.length },
                { label: '🏗️  Urbanismo',   n: urbanismo.length },
                { label: '🏥  Equipamentos', n: equipamentos.length },
              ].map((tab, i) => (
                <Tab key={i} style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>
                  {tab.label}
                  <span style={{ marginLeft: 8, fontFamily: 'JetBrains Mono', fontSize: '0.6rem', background: LIGHT, color: BLUE, border: `1px solid ${BORDER}`, padding: '1px 6px', borderRadius: 3 }}>
                    {tab.n}
                  </span>
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              <TabPanel><TabPopulacao    indicadores={indicadores} /></TabPanel>
              <TabPanel><TabProgramas    programas={programas}     /></TabPanel>
              <TabPanel><TabUrbanismo    urbanismo={urbanismo}      /></TabPanel>
              <TabPanel><TabEquipamentos equipamentos={equipamentos}/></TabPanel>
            </TabPanels>
          </TabGroup>
        )}
      </div>

      <div style={{ borderTop: `1px solid ${BORDER}`, padding: '16px 24px', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', color: MUTED, letterSpacing: '0.06em' }}>
        FONTES: IBGE CENSO 2022 · PCI / SECC 2025 · SMS · SME · SMAS 2023 — PAINEL PROGRAMA CIDADE INTEGRADA
      </div>
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

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
  const num = typeof n === 'string' ? parseFloat(n.replace(/\./g, '').replace(',', '.')) : n
  if (isNaN(num)) return String(n)
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace('.', ',') + ' mi'
  if (num >= 1_000) return num.toLocaleString('pt-BR')
  return String(num)
}

function count(arr: any[], key: string, val: string) {
  return arr.filter(i => i?.[key] === val).length
}

function groupBy(arr: any[], key: string): Record<string, number> {
  return arr.reduce((acc, item) => {
    const k = item?.[key] || 'Não informado'
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}

// ─── paleta ────────────────────────────────────────────────────────────────────
const NAVY   = '#1a2a5e'
const BLUE   = '#2563a8'
const CYAN   = '#00a8cc'
const LIGHT  = '#e8f4fa'
const BG     = '#f5f7fc'
const BORDER = '#d4dff0'
const TEXT   = '#0f1d3d'
const DIM    = '#4a5f8a'
const MUTED  = '#8fa3c8'
const GREEN  = '#16a34a'
const AMBER  = '#d97706'

const CHART_COLORS = [CYAN, BLUE, NAVY, '#0e7490', '#0369a1', '#1d4ed8']

// ─── subcomponentes ────────────────────────────────────────────────────────────
function KPI({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="pci-card" style={{ padding: '20px 24px' }}>
      <div className="pci-label" style={{ marginBottom: 6 }}>{label}</div>
      <div className="pci-number" style={{ fontSize: '1.9rem', color: accent || NAVY }}>{value}</div>
      {sub && <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: DIM, marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const s = (status || '').toLowerCase()
  if (s.includes('ativo') || s.includes('concluído') || s.includes('concluido') || s.includes('em andamento'))
    return <span className="badge badge-green">{status}</span>
  if (s.includes('planejado') || s.includes('previsto'))
    return <span className="badge badge-blue">{status}</span>
  if (s.includes('suspenso') || s.includes('paralisado'))
    return <span className="badge badge-amber">{status}</span>
  return <span className="badge badge-gray">{status || '—'}</span>
}

function SectionTitle({ title, count: c }: { title: string; count?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <div className="pci-accent-line" style={{ marginBottom: 0 }} />
      <h2 className="pci-title" style={{ fontSize: '1.15rem', margin: 0 }}>{title}</h2>
      {c != null && (
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.65rem',
          background: LIGHT,
          color: BLUE,
          border: `1px solid ${BORDER}`,
          padding: '2px 8px',
          borderRadius: 4,
        }}>{c} itens</span>
      )}
    </div>
  )
}

// ─── aba 1: população ──────────────────────────────────────────────────────────
function TabPopulacao({ indicadores }: { indicadores: any[] }) {
  // agrupa por territorio para o gráfico
  const porTerritorio = useMemo(() => {
    const map: Record<string, { populacao: number; domicilios: number }> = {}
    for (const ind of indicadores) {
      const t = ind.territorio || ind.sub_territorio || 'Geral'
      if (!map[t]) map[t] = { populacao: 0, domicilios: 0 }
      const nome = (ind.nome || '').toLowerCase()
      const val = Number(ind.valor) || 0
      if (nome.includes('populaç') || nome.includes('populacao') || nome.includes('habitantes') || nome.includes('moradores'))
        map[t].populacao = Math.max(map[t].populacao, val)
      if (nome.includes('domicílio') || nome.includes('domicilio') || nome.includes('moradias') || nome.includes('residência'))
        map[t].domicilios = Math.max(map[t].domicilios, val)
    }
    return Object.entries(map).map(([name, v]) => ({ name: name.length > 22 ? name.slice(0, 20) + '…' : name, ...v }))
  }, [indicadores])

  // KPIs totais
  const totalPop  = indicadores.filter(i => {
    const n = (i.nome || '').toLowerCase()
    return n.includes('populaç') || n.includes('populacao') || n.includes('habitantes')
  }).reduce((s, i) => s + (Number(i.valor) || 0), 0)

  const totalDom  = indicadores.filter(i => {
    const n = (i.nome || '').toLowerCase()
    return n.includes('domicílio') || n.includes('domicilio')
  }).reduce((s, i) => s + (Number(i.valor) || 0), 0)

  const totalFav  = indicadores.filter(i => {
    const n = (i.nome || '').toLowerCase()
    return n.includes('favela') || n.includes('comunidade')
  }).reduce((s, i) => s + (Number(i.valor) || 0), 0)

  // áreas temáticas
  const areas = useMemo(() => groupBy(indicadores, 'area_tematica'), [indicadores])
  const areasChart = Object.entries(areas).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* KPIs */}
      <div>
        <SectionTitle title="Indicadores-chave" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          <KPI label="População total" value={totalPop > 0 ? fmt(totalPop) : fmt(indicadores.length)} sub="Censo IBGE 2022" accent={CYAN} />
          <KPI label="Domicílios" value={totalDom > 0 ? fmt(totalDom) : '—'} sub="Censo IBGE 2022" />
          <KPI label="Favelas / Comunidades" value={totalFav > 0 ? fmt(totalFav) : '19'} sub="Cinturão de Jacarepaguá" />
          <KPI label="Indicadores cadastrados" value={indicadores.length} sub="Todas as dimensões" />
        </div>
      </div>

      {/* Gráficos lado a lado */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
        {porTerritorio.length > 0 && (
          <div className="pci-card" style={{ padding: 24 }}>
            <SectionTitle title="População por território" />
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={porTerritorio} margin={{ top: 4, right: 8, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: DIM }} angle={-35} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: DIM }} tickFormatter={v => v >= 1000 ? (v/1000).toFixed(0)+'k' : v} />
                <Tooltip
                  contentStyle={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, border: `1px solid ${BORDER}` }}
                  formatter={(v: any) => [fmt(v), 'Habitantes']}
                />
                <Bar dataKey="populacao" fill={CYAN} radius={[4, 4, 0, 0]} name="Habitantes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {areasChart.length > 0 && (
          <div className="pci-card" style={{ padding: 24 }}>
            <SectionTitle title="Indicadores por área temática" />
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={areasChart} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: DIM }} />
                <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 10, fontFamily: 'Plus Jakarta Sans', fill: DIM }} />
                <Tooltip
                  contentStyle={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, border: `1px solid ${BORDER}` }}
                  formatter={(v: any) => [v, 'Indicadores']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {areasChart.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Tabela de indicadores */}
      {indicadores.length > 0 && (
        <div className="pci-card" style={{ padding: 24, overflowX: 'auto' }}>
          <SectionTitle title="Todos os indicadores" count={indicadores.length} />
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Plus Jakarta Sans', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: NAVY, color: 'white' }}>
                {['Indicador', 'Território', 'Área Temática', 'Valor', 'Unidade'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'JetBrains Mono', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {indicadores.map((ind, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'white' : BG, borderBottom: `1px solid ${BORDER}` }}>
                  <td style={{ padding: '10px 16px', color: TEXT }}>{ind.nome || '—'}</td>
                  <td style={{ padding: '10px 16px', color: DIM }}>{ind.territorio || ind.sub_territorio || '—'}</td>
                  <td style={{ padding: '10px 16px', color: DIM }}>{ind.area_tematica || '—'}</td>
                  <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono', fontWeight: 600, color: NAVY }}>{fmt(ind.valor)}</td>
                  <td style={{ padding: '10px 16px', color: MUTED, fontFamily: 'JetBrains Mono', fontSize: '0.75rem' }}>{ind.unidade || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── aba 2: programas ──────────────────────────────────────────────────────────
function TabProgramas({ programas }: { programas: any[] }) {
  const porEixo    = useMemo(() => groupBy(programas, 'eixo'), [programas])
  const porStatus  = useMemo(() => groupBy(programas, 'status'), [programas])
  const porTerr    = useMemo(() => groupBy(programas, 'territorio'), [programas])

  const eixoChart    = Object.entries(porEixo).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  const statusChart  = Object.entries(porStatus).map(([name, value]) => ({ name, value }))
  const terrChart    = Object.entries(porTerr).map(([name, value]) => ({ name: name.length > 20 ? name.slice(0, 18) + '…' : name, value })).sort((a, b) => b.value - a.value)

  const ativos = programas.filter(p => {
    const s = (p.status || '').toLowerCase()
    return s.includes('ativ') || s.includes('andamento') || s.includes('execução')
  }).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* KPIs */}
      <div>
        <SectionTitle title="Resumo dos programas sociais" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          <KPI label="Total de programas" value={programas.length} sub="Sociais cadastrados" accent={CYAN} />
          <KPI label="Ativos / Em andamento" value={ativos} sub="Execução confirmada" accent={GREEN} />
          <KPI label="Eixos de atuação" value={Object.keys(porEixo).length} sub="Dimensões de intervenção" />
          <KPI label="Territórios cobertos" value={Object.keys(porTerr).length} sub="Áreas de atuação" />
        </div>
      </div>

      {/* Gráficos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
        {eixoChart.length > 0 && (
          <div className="pci-card" style={{ padding: 24 }}>
            <SectionTitle title="Programas por eixo" />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={eixoChart} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: DIM }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10, fontFamily: 'Plus Jakarta Sans', fill: DIM }} />
                <Tooltip contentStyle={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, border: `1px solid ${BORDER}` }} formatter={(v: any) => [v, 'Programas']} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {eixoChart.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {statusChart.length > 0 && (
          <div className="pci-card" style={{ padding: 24 }}>
            <SectionTitle title="Programas por status" />
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusChart} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {statusChart.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Legend formatter={(v) => <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: DIM }}>{v}</span>} />
                <Tooltip contentStyle={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, border: `1px solid ${BORDER}` }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {terrChart.length > 0 && (
          <div className="pci-card" style={{ padding: 24 }}>
            <SectionTitle title="Programas por território" />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={terrChart} margin={{ top: 4, right: 8, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: DIM }} angle={-30} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: DIM }} />
                <Tooltip contentStyle={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, border: `1px solid ${BORDER}` }} formatter={(v: any) => [v, 'Programas']} />
                <Bar dataKey="value" fill={BLUE} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Lista de programas */}
      {programas.length > 0 && (
        <div className="pci-card" style={{ padding: 24, overflowX: 'auto' }}>
          <SectionTitle title="Lista de programas sociais" count={programas.length} />
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Plus Jakarta Sans', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: NAVY, color: 'white' }}>
                {['Programa', 'Território', 'Eixo', 'Tipo', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'JetBrains Mono', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {programas.map((p, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'white' : BG, borderBottom: `1px solid ${BORDER}` }}>
                  <td style={{ padding: '10px 16px', color: TEXT, fontWeight: 600, maxWidth: 260 }}>{p.titulo || p.nome || '—'}</td>
                  <td style={{ padding: '10px 16px', color: DIM, whiteSpace: 'nowrap' }}>{p.territorio || '—'}</td>
                  <td style={{ padding: '10px 16px', color: DIM }}>{p.eixo || '—'}</td>
                  <td style={{ padding: '10px 16px', color: DIM }}>{p.tipo || '—'}</td>
                  <td style={{ padding: '10px 16px' }}><StatusBadge status={p.status || ''} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── aba 3: urbanismo ──────────────────────────────────────────────────────────
function TabUrbanismo({ urbanismo }: { urbanismo: any[] }) {
  const porTipo    = useMemo(() => groupBy(urbanismo, 'tipo'), [urbanismo])
  const porStatus  = useMemo(() => groupBy(urbanismo, 'status'), [urbanismo])
  const porTerr    = useMemo(() => groupBy(urbanismo, 'territorio'), [urbanismo])

  const tipoChart   = Object.entries(porTipo).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  const statusChart = Object.entries(porStatus).map(([name, value]) => ({ name, value }))
  const terrChart   = Object.entries(porTerr).map(([name, value]) => ({ name: name.length > 20 ? name.slice(0, 18) + '…' : name, value })).sort((a, b) => b.value - a.value)

  const concluidos = urbanismo.filter(u => (u.status || '').toLowerCase().includes('concluíd') || (u.status || '').toLowerCase().includes('concluido')).length
  const emObra     = urbanismo.filter(u => {
    const s = (u.status || '').toLowerCase()
    return s.includes('obra') || s.includes('andamento') || s.includes('execução')
  }).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <SectionTitle title="Resumo das intervenções urbanísticas" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          <KPI label="Total de projetos" value={urbanismo.length} sub="Arquitetônicos e urbanísticos" accent={CYAN} />
          <KPI label="Concluídos" value={concluidos} sub="Obras entregues" accent={GREEN} />
          <KPI label="Em execução" value={emObra} sub="Obras em andamento" accent={AMBER} />
          <KPI label="Tipos de projeto" value={Object.keys(porTipo).length} sub="Categorias distintas" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
        {tipoChart.length > 0 && (
          <div className="pci-card" style={{ padding: 24 }}>
            <SectionTitle title="Projetos por tipo" />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={tipoChart} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: DIM }} />
                <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 10, fontFamily: 'Plus Jakarta Sans', fill: DIM }} />
                <Tooltip contentStyle={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, border: `1px solid ${BORDER}` }} formatter={(v: any) => [v, 'Projetos']} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {tipoChart.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {statusChart.length > 0 && (
          <div className="pci-card" style={{ padding: 24 }}>
            <SectionTitle title="Projetos por status" />
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusChart} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {statusChart.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Legend formatter={(v) => <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: DIM }}>{v}</span>} />
                <Tooltip contentStyle={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, border: `1px solid ${BORDER}` }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {terrChart.length > 0 && (
          <div className="pci-card" style={{ padding: 24 }}>
            <SectionTitle title="Projetos por território" />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={terrChart} margin={{ top: 4, right: 8, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: DIM }} angle={-30} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: DIM }} />
                <Tooltip contentStyle={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, border: `1px solid ${BORDER}` }} formatter={(v: any) => [v, 'Projetos']} />
                <Bar dataKey="value" fill={NAVY} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Tabela */}
      {urbanismo.length > 0 && (
        <div className="pci-card" style={{ padding: 24, overflowX: 'auto' }}>
          <SectionTitle title="Lista de intervenções" count={urbanismo.length} />
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Plus Jakarta Sans', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: NAVY, color: 'white' }}>
                {['Projeto', 'Território', 'Tipo', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'JetBrains Mono', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {urbanismo.map((u, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'white' : BG, borderBottom: `1px solid ${BORDER}` }}>
                  <td style={{ padding: '10px 16px', color: TEXT, fontWeight: 600, maxWidth: 300 }}>{u.titulo || u.nome || '—'}</td>
                  <td style={{ padding: '10px 16px', color: DIM, whiteSpace: 'nowrap' }}>{u.territorio || '—'}</td>
                  <td style={{ padding: '10px 16px', color: DIM }}>{u.tipo || '—'}</td>
                  <td style={{ padding: '10px 16px' }}><StatusBadge status={u.status || ''} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── aba 4: equipamentos ───────────────────────────────────────────────────────
function TabEquipamentos({ equipamentos }: { equipamentos: any[] }) {
  const porTipo = useMemo(() => groupBy(equipamentos, 'tipo'), [equipamentos])
  const porTerr = useMemo(() => groupBy(equipamentos, 'territorio'), [equipamentos])

  const tipoChart = Object.entries(porTipo).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  const terrChart = Object.entries(porTerr).map(([name, value]) => ({ name: name.length > 20 ? name.slice(0, 18) + '…' : name, value })).sort((a, b) => b.value - a.value)

  const saude    = count(equipamentos, 'tipo', 'Saúde')
  const educacao = count(equipamentos, 'tipo', 'Educação')
  const assist   = count(equipamentos, 'tipo', 'Assistência Social')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <SectionTitle title="Resumo dos equipamentos públicos" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          <KPI label="Total de equipamentos" value={equipamentos.length} sub="Unidades cadastradas" accent={CYAN} />
          <KPI label="Saúde" value={saude || tipoChart[0]?.value || '—'} sub={saude > 0 ? 'UPAs, CAPSs, Clínicas' : tipoChart[0]?.name || ''} />
          <KPI label="Educação" value={educacao || tipoChart[1]?.value || '—'} sub={educacao > 0 ? 'Escolas e CIEPs' : tipoChart[1]?.name || ''} />
          <KPI label="Assistência Social" value={assist || tipoChart[2]?.value || '—'} sub={assist > 0 ? 'CRAS, CREAS' : tipoChart[2]?.name || ''} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
        {tipoChart.length > 0 && (
          <div className="pci-card" style={{ padding: 24 }}>
            <SectionTitle title="Equipamentos por tipo" />
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={tipoChart} margin={{ top: 4, right: 8, left: 0, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: DIM }} angle={-35} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: DIM }} />
                <Tooltip contentStyle={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, border: `1px solid ${BORDER}` }} formatter={(v: any) => [v, 'Equipamentos']} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {tipoChart.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {terrChart.length > 0 && (
          <div className="pci-card" style={{ padding: 24 }}>
            <SectionTitle title="Equipamentos por território" />
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={terrChart} margin={{ top: 4, right: 8, left: 0, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: DIM }} angle={-35} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: DIM }} />
                <Tooltip contentStyle={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, border: `1px solid ${BORDER}` }} formatter={(v: any) => [v, 'Equipamentos']} />
                <Bar dataKey="value" fill={CYAN} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Tabela */}
      {equipamentos.length > 0 && (
        <div className="pci-card" style={{ padding: 24, overflowX: 'auto' }}>
          <SectionTitle title="Lista de equipamentos" count={equipamentos.length} />
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Plus Jakarta Sans', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: NAVY, color: 'white' }}>
                {['Equipamento', 'Território', 'Tipo', 'Endereço'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'JetBrains Mono', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {equipamentos.map((eq, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'white' : BG, borderBottom: `1px solid ${BORDER}` }}>
                  <td style={{ padding: '10px 16px', color: TEXT, fontWeight: 600 }}>{eq.nome || '—'}</td>
                  <td style={{ padding: '10px 16px', color: DIM, whiteSpace: 'nowrap' }}>{eq.territorio || '—'}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <span className="badge badge-blue">{eq.tipo || '—'}</span>
                  </td>
                  <td style={{ padding: '10px 16px', color: MUTED, fontSize: '0.8rem' }}>{eq.endereco || eq.endereço || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── componente principal ──────────────────────────────────────────────────────
const TABS = [
  { id: 'populacao',    label: 'População',    icon: '👥' },
  { id: 'programas',   label: 'Programas',    icon: '📋' },
  { id: 'urbanismo',   label: 'Urbanismo',    icon: '🏗️' },
  { id: 'equipamentos',label: 'Equipamentos', icon: '🏥' },
]

export default function PainelExecutivo({ indicadores, programas, urbanismo, equipamentos }: Props) {
  const [aba, setAba] = useState('populacao')

  return (
    <div style={{ background: BG, minHeight: '60vh' }}>
      {/* Barra de abas */}
      <div style={{
        background: 'white',
        borderBottom: `1px solid ${BORDER}`,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 2px 8px rgba(26,42,94,0.06)',
      }}>
        <div className="max-w-7xl mx-auto px-6" style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
          {TABS.map(tab => {
            const active = aba === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setAba(tab.id)}
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.875rem',
                  padding: '16px 24px',
                  color: active ? NAVY : DIM,
                  background: 'transparent',
                  border: 'none',
                  borderBottom: active ? `3px solid ${CYAN}` : '3px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
                {active && (
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.6rem',
                    background: LIGHT,
                    color: BLUE,
                    border: `1px solid ${BORDER}`,
                    padding: '1px 6px',
                    borderRadius: 3,
                  }}>
                    {tab.id === 'populacao'    ? indicadores.length
                     : tab.id === 'programas'  ? programas.length
                     : tab.id === 'urbanismo'  ? urbanismo.length
                     : equipamentos.length}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Estado vazio geral */}
        {indicadores.length === 0 && programas.length === 0 && urbanismo.length === 0 && equipamentos.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            color: DIM,
            fontFamily: 'Plus Jakarta Sans',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📊</div>
            <h3 style={{ fontFamily: 'Sora', color: NAVY, marginBottom: 8 }}>Carregando dados…</h3>
            <p style={{ fontSize: '0.9rem', color: MUTED }}>Os dados serão exibidos assim que a conexão com o Directus for estabelecida.</p>
          </div>
        )}

        {/* Abas */}
        <div className="anim-up">
          {aba === 'populacao'    && <TabPopulacao    indicadores={indicadores}   />}
          {aba === 'programas'    && <TabProgramas    programas={programas}       />}
          {aba === 'urbanismo'    && <TabUrbanismo    urbanismo={urbanismo}       />}
          {aba === 'equipamentos' && <TabEquipamentos equipamentos={equipamentos} />}
        </div>
      </div>

      {/* Rodapé de fonte */}
      <div style={{
        borderTop: `1px solid ${BORDER}`,
        padding: '16px 24px',
        textAlign: 'center',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.65rem',
        color: MUTED,
        letterSpacing: '0.06em',
      }}>
        FONTES: IBGE CENSO 2022 · PCI / SECC 2025 · SMS · SME · SMAS 2023 — PAINEL PROGRAMA CIDADE INTEGRADA
      </div>
    </div>
  )
}

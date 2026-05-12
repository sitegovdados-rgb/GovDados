'use client'

import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  LabelList,
} from 'recharts'

// ─── tipos ────────────────────────────────────────────────────────────────────
interface Props {
  indicadores:  any[]
  programas:    any[]
  urbanismo:    any[]
  equipamentos: any[]
}

// ─── paleta ───────────────────────────────────────────────────────────────────
const C = {
  navy:   '#1a2a5e',
  blue:   '#2563a8',
  cyan:   '#00a8cc',
  light:  '#e8f4fa',
  bg:     '#f5f7fc',
  white:  '#ffffff',
  border: '#d4dff0',
  text:   '#0f1d3d',
  dim:    '#4a5f8a',
  muted:  '#8fa3c8',
  green:  '#16a34a',
  amber:  '#d97706',
}

const PALETTE = [
  '#00a8cc', '#2563a8', '#1a2a5e',
  '#0e7490', '#0369a1', '#1d4ed8',
  '#0891b2', '#3b82f6', '#6366f1',
]

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

function toChart(grouped: Record<string, number>, idx = 'name', cat = 'value') {
  return Object.entries(grouped)
    .map(([k, v]) => ({ [idx]: k, [cat]: v }))
    .sort((a: any, b: any) => b[cat] - a[cat])
}

function shortLabel(s: string, max = 18) {
  return s.length > max ? s.slice(0, max - 1) + '…' : s
}

// ─── tooltip customizado ───────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, unit = '' }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: C.white,
      border: `1.5px solid ${C.cyan}`,
      borderRadius: 10,
      padding: '10px 16px',
      boxShadow: '0 8px 24px rgba(0,168,204,0.15)',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      minWidth: 160,
    }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
        {label}
      </div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: p.color || C.cyan, flexShrink: 0 }} />
          <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1rem', color: C.navy }}>
            {fmt(p.value)}{unit}
          </span>
          {p.name && p.name !== 'value' && (
            <span style={{ fontSize: '0.75rem', color: C.dim }}>{p.name}</span>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── gradientes SVG ────────────────────────────────────────────────────────────
function GradientDefs() {
  return (
    <defs>
      <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.cyan} stopOpacity={1} />
        <stop offset="100%" stopColor={C.blue} stopOpacity={0.7} />
      </linearGradient>
      <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.blue} stopOpacity={1} />
        <stop offset="100%" stopColor={C.navy} stopOpacity={0.8} />
      </linearGradient>
      <linearGradient id="gradNavy" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.navy} stopOpacity={1} />
        <stop offset="100%" stopColor="#0f1d3d" stopOpacity={0.8} />
      </linearGradient>
      <linearGradient id="gradHoriz" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={C.navy} stopOpacity={0.85} />
        <stop offset="100%" stopColor={C.cyan} stopOpacity={1} />
      </linearGradient>
    </defs>
  )
}

// ─── donut com label central ───────────────────────────────────────────────────
function DonutLabel({ cx, cy, total, label }: { cx: number; cy: number; total: number; label: string }) {
  return (
    <g>
      <text x={cx} y={cy - 8} textAnchor="middle" dominantBaseline="middle"
        style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.6rem', fill: C.navy }}>
        {total}
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" dominantBaseline="middle"
        style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', fill: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </text>
    </g>
  )
}

// ─── KPI card ──────────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, sub, color = C.cyan }: {
  icon: string; label: string; value: string | number; sub?: string; color?: string
}) {
  return (
    <div className="pci-card" style={{ padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
      {/* barra de cor no topo */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: '12px 12px 0 0' }} />
      {/* ícone de fundo decorativo */}
      <div style={{ position: 'absolute', top: 8, right: 16, fontSize: '2.8rem', opacity: 0.07, userSelect: 'none' }}>
        {icon}
      </div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: C.muted, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '2rem', color: C.navy, lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.78rem', color: C.dim, marginTop: 8 }}>
          {sub}
        </div>
      )}
    </div>
  )
}

// ─── seção título ──────────────────────────────────────────────────────────────
function SectionTitle({ title, count: c }: { title: string; count?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <div style={{ width: 40, height: 4, background: C.cyan, borderRadius: 2, flexShrink: 0 }} />
      <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: C.text, margin: 0 }}>
        {title}
      </h2>
      {c != null && (
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', background: C.light, color: C.blue, border: `1px solid ${C.border}`, padding: '2px 8px', borderRadius: 4 }}>
          {c} itens
        </span>
      )}
    </div>
  )
}

// ─── badge status ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const s = (status || '').toLowerCase()
  let cls = 'badge badge-gray'
  if (/(ativ|andamento|concluíd|concluido)/.test(s)) cls = 'badge badge-green'
  else if (/(planejado|previsto)/.test(s)) cls = 'badge badge-blue'
  else if (/(suspenso|paralisado)/.test(s)) cls = 'badge badge-amber'
  return <span className={cls}>{status || '—'}</span>
}

// ─── tabela ────────────────────────────────────────────────────────────────────
function Tabela({ headers, rows }: { headers: string[]; rows: any[][] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: C.navy }}>
            {headers.map(h => (
              <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: 'white', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500, whiteSpace: 'nowrap' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? C.white : C.bg, borderBottom: `1px solid ${C.border}`, transition: 'background 0.15s' }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '10px 16px', color: j === 0 ? C.text : C.dim, fontWeight: j === 0 ? 600 : 400, maxWidth: j === 0 ? 280 : undefined }}>
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

// ─── card de gráfico ───────────────────────────────────────────────────────────
function ChartCard({ title, children, span2 = false }: { title: string; children: React.ReactNode; span2?: boolean }) {
  return (
    <div className="pci-card" style={{
      padding: 24,
      gridColumn: span2 ? 'span 2' : undefined,
    }}>
      <SectionTitle title={title} />
      {children}
    </div>
  )
}

// ─── aba população ─────────────────────────────────────────────────────────────
function TabPopulacao({ indicadores }: { indicadores: any[] }) {
  const totalPop = indicadores
    .filter(i => /(populaç|populacao|habitantes|moradores)/i.test(i.nome || ''))
    .reduce((s, i) => s + (Number(i.valor) || 0), 0)

  const totalDom = indicadores
    .filter(i => /(domicílio|domicilio)/i.test(i.nome || ''))
    .reduce((s, i) => s + (Number(i.valor) || 0), 0)

  const areasData = useMemo(() =>
    toChart(groupBy(indicadores, 'area_tematica'), 'area', 'qtd')
      .map(d => ({ ...d, area: shortLabel(d.area, 20) })),
    [indicadores])

  const terrData = useMemo(() => {
    const map: Record<string, { terr: string; hab: number }> = {}
    for (const ind of indicadores) {
      const t = ind.territorio || ind.sub_territorio || 'Geral'
      if (/(populaç|populacao|habitantes|moradores)/i.test(ind.nome || '')) {
        if (!map[t]) map[t] = { terr: shortLabel(t, 20), hab: 0 }
        map[t].hab = Math.max(map[t].hab, Number(ind.valor) || 0)
      }
    }
    return Object.values(map)
  }, [indicadores])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        <KpiCard icon="👥" label="População total" value={totalPop > 0 ? fmt(totalPop) : '—'} sub="Censo IBGE 2022" color={C.cyan} />
        <KpiCard icon="🏠" label="Domicílios" value={totalDom > 0 ? fmt(totalDom) : '—'} sub="Censo IBGE 2022" color={C.blue} />
        <KpiCard icon="📍" label="Comunidades" value="19" sub="Cinturão de Jacarepaguá" color={C.navy} />
        <KpiCard icon="📊" label="Indicadores" value={indicadores.length} sub="Cadastrados no painel" color="#0e7490" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 24 }}>
        {terrData.length > 0 && (
          <ChartCard title="Habitantes por território">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={terrData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }} barCategoryGap="35%">
                <GradientDefs />
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="terr" tick={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fill: C.dim }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: C.light }} />
                <Bar dataKey="hab" fill="url(#gradCyan)" radius={[6, 6, 0, 0]} name="Habitantes" isAnimationActive animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
        {areasData.length > 0 && (
          <ChartCard title="Indicadores por área temática">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={areasData} layout="vertical" margin={{ top: 8, right: 40, left: 8, bottom: 8 }} barCategoryGap="30%">
                <GradientDefs />
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                <XAxis type="number" tick={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
                <YAxis dataKey="area" type="category" width={140} tick={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11, fill: C.dim }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: C.light }} />
                <Bar dataKey="qtd" fill="url(#gradBlue)" radius={[0, 6, 6, 0]} name="Indicadores" isAnimationActive animationDuration={800}>
                  <LabelList dataKey="qtd" position="right" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fill: C.navy, fontWeight: 700 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>

      {indicadores.length > 0 && (
        <div className="pci-card" style={{ padding: 24 }}>
          <SectionTitle title="Todos os indicadores" count={indicadores.length} />
          <Tabela
            headers={['Indicador', 'Território', 'Área Temática', 'Valor', 'Unidade']}
            rows={indicadores.map(ind => [
              ind.nome || '—',
              ind.territorio || ind.sub_territorio || '—',
              ind.area_tematica || '—',
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: C.navy }}>{fmt(ind.valor)}</span>,
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: C.muted }}>{ind.unidade || '—'}</span>,
            ])}
          />
        </div>
      )}
    </div>
  )
}

// ─── aba programas ─────────────────────────────────────────────────────────────
function TabProgramas({ programas }: { programas: any[] }) {
  const eixoData   = useMemo(() => toChart(groupBy(programas, 'eixo'), 'eixo', 'qtd').map(d => ({ ...d, eixo: shortLabel(d.eixo, 22) })), [programas])
  const statusData = useMemo(() => toChart(groupBy(programas, 'status'), 'name', 'value'), [programas])
  const terrData   = useMemo(() => toChart(groupBy(programas, 'territorio'), 'terr', 'qtd').map(d => ({ ...d, terr: shortLabel(d.terr, 20) })), [programas])
  const ativos     = programas.filter(p => /(ativ|andamento|execução)/i.test(p.status || '')).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        <KpiCard icon="📋" label="Total de programas" value={programas.length} sub="Sociais cadastrados" color={C.cyan} />
        <KpiCard icon="✅" label="Ativos / Em andamento" value={ativos} sub="Execução confirmada" color={C.green} />
        <KpiCard icon="🎯" label="Eixos de atuação" value={eixoData.length} sub="Dimensões de intervenção" color={C.blue} />
        <KpiCard icon="📍" label="Territórios cobertos" value={terrData.length} sub="Áreas com atuação" color={C.navy} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 24 }}>
        {eixoData.length > 0 && (
          <ChartCard title="Programas por eixo">
            <ResponsiveContainer width="100%" height={Math.max(200, eixoData.length * 44)}>
              <BarChart data={eixoData} layout="vertical" margin={{ top: 8, right: 48, left: 8, bottom: 8 }} barCategoryGap="30%">
                <GradientDefs />
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                <XAxis type="number" tick={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
                <YAxis dataKey="eixo" type="category" width={150} tick={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11, fill: C.dim }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: C.light }} />
                <Bar dataKey="qtd" fill="url(#gradHoriz)" radius={[0, 6, 6, 0]} name="Programas" isAnimationActive animationDuration={800}>
                  <LabelList dataKey="qtd" position="right" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fill: C.navy, fontWeight: 700 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {statusData.length > 0 && (
          <ChartCard title="Distribuição por status">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <defs>
                  {statusData.map((_, i) => (
                    <radialGradient key={i} id={`radialStatus${i}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={PALETTE[i % PALETTE.length]} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={PALETTE[i % PALETTE.length]} stopOpacity={0.6} />
                    </radialGradient>
                  ))}
                </defs>
                <Pie
                  data={statusData}
                  cx="50%" cy="50%"
                  innerRadius="52%" outerRadius="78%"
                  dataKey="value" nameKey="name"
                  paddingAngle={3}
                  isAnimationActive animationDuration={900}
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={`url(#radialStatus${i})`} stroke="none" />
                  ))}
                  <DonutLabel cx={0} cy={0} total={programas.length} label="total" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle" iconSize={8}
                  formatter={(v) => <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem', color: C.dim }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>

      {terrData.length > 0 && (
        <ChartCard title="Programas por território">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={terrData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }} barCategoryGap="35%">
              <GradientDefs />
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="terr" tick={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fill: C.dim }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: C.light }} />
              <Bar dataKey="qtd" fill="url(#gradBlue)" radius={[6, 6, 0, 0]} name="Programas" isAnimationActive animationDuration={800}>
                <LabelList dataKey="qtd" position="top" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fill: C.navy, fontWeight: 700 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {programas.length > 0 && (
        <div className="pci-card" style={{ padding: 24 }}>
          <SectionTitle title="Lista de programas sociais" count={programas.length} />
          <Tabela
            headers={['Programa', 'Território', 'Eixo', 'Tipo', 'Status']}
            rows={programas.map(p => [
              p.titulo || p.nome || '—',
              p.territorio || '—',
              p.eixo || '—',
              p.tipo || '—',
              <StatusBadge status={p.status || ''} />,
            ])}
          />
        </div>
      )}
    </div>
  )
}

// ─── aba urbanismo ─────────────────────────────────────────────────────────────
function TabUrbanismo({ urbanismo }: { urbanismo: any[] }) {
  const tipoData   = useMemo(() => toChart(groupBy(urbanismo, 'tipo'), 'tipo', 'qtd').map(d => ({ ...d, tipo: shortLabel(d.tipo, 22) })), [urbanismo])
  const statusData = useMemo(() => toChart(groupBy(urbanismo, 'status'), 'name', 'value'), [urbanismo])
  const terrData   = useMemo(() => toChart(groupBy(urbanismo, 'territorio'), 'terr', 'qtd').map(d => ({ ...d, terr: shortLabel(d.terr, 20) })), [urbanismo])
  const concluidos = urbanismo.filter(u => /(concluíd|concluido)/i.test(u.status || '')).length
  const emObra     = urbanismo.filter(u => /(obra|andamento|execução)/i.test(u.status || '')).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        <KpiCard icon="🏗️" label="Total de projetos" value={urbanismo.length} sub="Arquitetônicos e urbanísticos" color={C.cyan} />
        <KpiCard icon="✅" label="Concluídos" value={concluidos} sub="Obras entregues" color={C.green} />
        <KpiCard icon="⚙️" label="Em execução" value={emObra} sub="Obras em andamento" color={C.amber} />
        <KpiCard icon="📐" label="Tipos de projeto" value={tipoData.length} sub="Categorias distintas" color={C.navy} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 24 }}>
        {tipoData.length > 0 && (
          <ChartCard title="Projetos por tipo">
            <ResponsiveContainer width="100%" height={Math.max(200, tipoData.length * 44)}>
              <BarChart data={tipoData} layout="vertical" margin={{ top: 8, right: 48, left: 8, bottom: 8 }} barCategoryGap="30%">
                <GradientDefs />
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                <XAxis type="number" tick={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
                <YAxis dataKey="tipo" type="category" width={150} tick={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11, fill: C.dim }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: C.light }} />
                <Bar dataKey="qtd" fill="url(#gradHoriz)" radius={[0, 6, 6, 0]} name="Projetos" isAnimationActive animationDuration={800}>
                  <LabelList dataKey="qtd" position="right" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fill: C.navy, fontWeight: 700 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {statusData.length > 0 && (
          <ChartCard title="Distribuição por status">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <defs>
                  {statusData.map((_, i) => (
                    <radialGradient key={i} id={`radialUrb${i}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={PALETTE[i % PALETTE.length]} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={PALETTE[i % PALETTE.length]} stopOpacity={0.6} />
                    </radialGradient>
                  ))}
                </defs>
                <Pie
                  data={statusData}
                  cx="50%" cy="50%"
                  innerRadius="52%" outerRadius="78%"
                  dataKey="value" nameKey="name"
                  paddingAngle={3}
                  isAnimationActive animationDuration={900}
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={`url(#radialUrb${i})`} stroke="none" />
                  ))}
                  <DonutLabel cx={0} cy={0} total={urbanismo.length} label="projetos" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle" iconSize={8}
                  formatter={(v) => <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem', color: C.dim }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>

      {terrData.length > 0 && (
        <ChartCard title="Projetos por território">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={terrData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }} barCategoryGap="35%">
              <GradientDefs />
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="terr" tick={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fill: C.dim }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: C.light }} />
              <Bar dataKey="qtd" fill="url(#gradNavy)" radius={[6, 6, 0, 0]} name="Projetos" isAnimationActive animationDuration={800}>
                <LabelList dataKey="qtd" position="top" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fill: C.navy, fontWeight: 700 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {urbanismo.length > 0 && (
        <div className="pci-card" style={{ padding: 24 }}>
          <SectionTitle title="Lista de intervenções urbanísticas" count={urbanismo.length} />
          <Tabela
            headers={['Projeto', 'Território', 'Tipo', 'Status']}
            rows={urbanismo.map(u => [
              u.titulo || u.nome || '—',
              u.territorio || '—',
              u.tipo || '—',
              <StatusBadge status={u.status || ''} />,
            ])}
          />
        </div>
      )}
    </div>
  )
}

// ─── aba equipamentos ──────────────────────────────────────────────────────────
function TabEquipamentos({ equipamentos }: { equipamentos: any[] }) {
  const tipoData = useMemo(() => toChart(groupBy(equipamentos, 'tipo'), 'tipo', 'qtd'), [equipamentos])
  const terrData = useMemo(() => toChart(groupBy(equipamentos, 'territorio'), 'terr', 'qtd').map(d => ({ ...d, terr: shortLabel(d.terr, 20) })), [equipamentos])
  const saude    = equipamentos.filter(e => e.tipo === 'Saúde').length
  const educacao = equipamentos.filter(e => e.tipo === 'Educação').length
  const assist   = equipamentos.filter(e => e.tipo === 'Assistência Social').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        <KpiCard icon="🏛️" label="Total de equipamentos" value={equipamentos.length} sub="Unidades cadastradas" color={C.cyan} />
        <KpiCard icon="🏥" label="Saúde" value={saude || tipoData[0]?.qtd || '—'} sub="UPAs, CAPSs, Clínicas" color="#0e7490" />
        <KpiCard icon="🎓" label="Educação" value={educacao || tipoData[1]?.qtd || '—'} sub="Escolas e CIEPs" color={C.blue} />
        <KpiCard icon="🤝" label="Assist. Social" value={assist || tipoData[2]?.qtd || '—'} sub="CRAS, CREAS" color={C.navy} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 24 }}>
        {tipoData.length > 0 && (
          <ChartCard title="Equipamentos por tipo">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <defs>
                  {tipoData.map((_, i) => (
                    <radialGradient key={i} id={`radialEq${i}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={PALETTE[i % PALETTE.length]} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={PALETTE[i % PALETTE.length]} stopOpacity={0.6} />
                    </radialGradient>
                  ))}
                </defs>
                <Pie
                  data={tipoData}
                  cx="50%" cy="50%"
                  innerRadius="52%" outerRadius="78%"
                  dataKey="qtd" nameKey="tipo"
                  paddingAngle={3}
                  isAnimationActive animationDuration={900}
                >
                  {tipoData.map((_, i) => (
                    <Cell key={i} fill={`url(#radialEq${i})`} stroke="none" />
                  ))}
                  <DonutLabel cx={0} cy={0} total={equipamentos.length} label="unidades" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle" iconSize={8}
                  formatter={(v) => <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem', color: C.dim }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {terrData.length > 0 && (
          <ChartCard title="Equipamentos por território">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={terrData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }} barCategoryGap="35%">
                <GradientDefs />
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="terr" tick={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fill: C.dim }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: C.light }} />
                <Bar dataKey="qtd" fill="url(#gradCyan)" radius={[6, 6, 0, 0]} name="Equipamentos" isAnimationActive animationDuration={800}>
                  <LabelList dataKey="qtd" position="top" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fill: C.navy, fontWeight: 700 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>

      {equipamentos.length > 0 && (
        <div className="pci-card" style={{ padding: 24 }}>
          <SectionTitle title="Lista de equipamentos públicos" count={equipamentos.length} />
          <Tabela
            headers={['Equipamento', 'Território', 'Tipo', 'Endereço']}
            rows={equipamentos.map(eq => [
              eq.nome || '—',
              eq.territorio || '—',
              <StatusBadge status={eq.tipo || ''} />,
              <span style={{ color: C.muted, fontSize: '0.8rem' }}>{eq.endereco || eq.endereço || '—'}</span>,
            ])}
          />
        </div>
      )}
    </div>
  )
}

// ─── componente principal ──────────────────────────────────────────────────────
const TABS = [
  { label: '👥  População',     icon: '👥' },
  { label: '📋  Programas',     icon: '📋' },
  { label: '🏗️  Urbanismo',    icon: '🏗️' },
  { label: '🏥  Equipamentos',  icon: '🏥' },
]

export default function PainelExecutivo({ indicadores, programas, urbanismo, equipamentos }: Props) {
  const [aba, setAba] = useState(0)
  const counts = [indicadores.length, programas.length, urbanismo.length, equipamentos.length]
  const vazio  = counts.every(c => c === 0)

  return (
    <div style={{ background: C.bg, minHeight: '60vh' }}>
      {/* barra de abas */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 12px rgba(26,42,94,0.07)' }}>
        <div className="max-w-7xl mx-auto px-6" style={{ display: 'flex', overflowX: 'auto' }}>
          {TABS.map((tab, i) => (
            <button
              key={i}
              onClick={() => setAba(i)}
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: aba === i ? 700 : 500,
                fontSize: '0.875rem',
                padding: '16px 22px',
                color: aba === i ? C.navy : C.dim,
                background: 'transparent',
                border: 'none',
                borderBottom: aba === i ? `3px solid ${C.cyan}` : '3px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {tab.label}
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', background: aba === i ? C.light : 'transparent', color: aba === i ? C.blue : C.muted, border: `1px solid ${aba === i ? C.border : 'transparent'}`, padding: '1px 6px', borderRadius: 3, transition: 'all 0.2s' }}>
                {counts[i]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* conteúdo */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {vazio ? (
          <div className="pci-card" style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📊</div>
            <h3 style={{ fontFamily: 'Sora, sans-serif', color: C.navy, marginBottom: 8 }}>Carregando dados…</h3>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem', color: C.muted }}>
              Os dados serão exibidos assim que a conexão com o Directus for estabelecida.
            </p>
          </div>
        ) : (
          <div className="anim-up">
            {aba === 0 && <TabPopulacao    indicadores={indicadores} />}
            {aba === 1 && <TabProgramas    programas={programas}     />}
            {aba === 2 && <TabUrbanismo    urbanismo={urbanismo}      />}
            {aba === 3 && <TabEquipamentos equipamentos={equipamentos}/>}
          </div>
        )}
      </div>

      {/* rodapé */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: '14px 24px', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', color: C.muted, letterSpacing: '0.06em' }}>
        FONTES: IBGE CENSO 2022 · PCI / SECC 2025 · SMS · SME · SMAS 2023 — PAINEL PROGRAMA CIDADE INTEGRADA
      </div>
    </div>
  )
}

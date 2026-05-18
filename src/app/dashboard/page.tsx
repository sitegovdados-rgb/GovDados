'use client'
import { useState, useMemo, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend
} from 'recharts'

const SOCIAL_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTmQ70z8qfPdYfDBNhP1rPKQOa8IDYvLn3cKOGHkJQAtzWxOrJDilM-3Mfx1Ufy74UI7u7THhWD5XK7/pub?output=csv'
const URBANISMO_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRWfmHpAt-Wjh-IWiAYnyu6dLaj7-vlXDKZXLXP-UsyjR-2BSqFxSf0TMXGtgheYJn5reTMFgCoVO-0/pub?output=csv'

// ── CSV parser ────────────────────────────────────────────────────────────────
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return []
  const parseRow = (line: string): string[] => {
    const cols: string[] = []
    let cur = ''
    let inQ = false
    for (let i = 0; i < line.length; i++) {
      const c = line[i]
      if (c === '"') { if (inQ && line[i + 1] === '"') { cur += '"'; i++ } else inQ = !inQ }
      else if (c === ',' && !inQ) { cols.push(cur); cur = '' }
      else cur += c
    }
    cols.push(cur)
    return cols
  }
  const headers = parseRow(lines[0])
  return lines.slice(1).map(line => {
    const vals = parseRow(line)
    return Object.fromEntries(headers.map((h, i) => [h.trim(), (vals[i] ?? '').trim()]))
  })
}

// ── Types ─────────────────────────────────────────────────────────────────────
type SocialRow = {
  tarefa: string; regiao: string; localidade: string
  responsavel: string; tipo: string; status: string
  media: number; total: number
}

type UrbanismoRow = {
  projeto: string; demandante: string; territorio: string
  tipologia: string; subtipologia: string; grau: string
  status: string; inicio: string; fim: string; municipio: string
}

// ── Constants ─────────────────────────────────────────────────────────────────
const PIE_COLORS = ['#1a2a5e','#2563a8','#00a8cc','#3b82f6','#7c3aed','#0891b2','#0284c7','#1d4ed8','#4338ca','#6366f1']

const STATUS_COLORS: Record<string, string> = {
  'Em execução': '#2563a8', 'Concluída': '#00a8cc', 'Concluído': '#22c55e',
  'Bloqueada': '#e53e3e', 'Aguardando Informação': '#ed8936',
  'Aguardando Aprovação': '#60a5fa', 'Aguardando Revisão': '#a78bfa',
  'Suspenso': '#94a3b8', 'Cancelado': '#ef4444',
  'Não iniciado': '#cbd5e1', 'Não Iniciado': '#cbd5e1',
}

const tooltipStyle = {
  backgroundColor: '#1a2a5e', border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 8, color: 'white', fontFamily: 'Plus Jakarta Sans',
  fontSize: '0.8rem', padding: '8px 12px',
}

// ── Shared UI ─────────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={tooltipStyle}>
      {label && <p style={{ marginBottom: 4, fontWeight: 600 }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || '#00a8cc' }}>{p.name}: <strong>{p.value.toLocaleString('pt-BR')}</strong></p>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    'Em execução':           { bg: '#dbeafe', color: '#1d4ed8' },
    'Concluída':             { bg: '#dcfce7', color: '#15803d' },
    'Concluído':             { bg: '#dcfce7', color: '#15803d' },
    'Bloqueada':             { bg: '#fee2e2', color: '#b91c1c' },
    'Aguardando Informação': { bg: '#fef3c7', color: '#92400e' },
    'Aguardando Aprovação':  { bg: '#e0f2fe', color: '#0369a1' },
    'Aguardando Revisão':    { bg: '#ede9fe', color: '#6d28d9' },
    'Suspenso':              { bg: '#f1f5f9', color: '#475569' },
    'Cancelado':             { bg: '#fee2e2', color: '#b91c1c' },
    'Não iniciado':          { bg: '#f8fafc', color: '#94a3b8' },
  }
  const s = map[status] || { bg: '#f1f5f9', color: '#64748b' }
  return (
    <span style={{
      background: s.bg, color: s.color, fontFamily: 'JetBrains Mono',
      fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em',
      padding: '3px 8px', borderRadius: 4, display: 'inline-block',
    }}>{status}</span>
  )
}

function KpiCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ background: '#1a2a5e', borderRadius: 12, padding: '20px 24px', color: 'white', flex: 1, minWidth: 160 }}>
      <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{label}</p>
      <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 500, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#00a8cc', lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>{sub}</p>}
    </div>
  )
}

function FilterSelect({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void
}) {
  return (
    <div>
      <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4a5f8a', display: 'block', marginBottom: 4 }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        fontFamily: 'Plus Jakarta Sans', fontSize: '0.82rem', padding: '8px 12px',
        borderRadius: 8, border: '1px solid #d4dff0', background: 'white',
        color: '#0f1d3d', minWidth: 200, cursor: 'pointer',
      }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'white', borderRadius: 12, border: '1px solid #d4dff0', padding: '20px 24px' }}>
      <p style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.9rem', color: '#0f1d3d', marginBottom: 16 }}>{title}</p>
      {children}
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '3px solid #d4dff0', borderTopColor: '#2563a8',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD SOCIAL
// ─────────────────────────────────────────────────────────────────────────────
function DashboardSocial({ data, loading }: { data: SocialRow[]; loading: boolean }) {
  const [territorio, setTerritorio] = useState('Todos')
  const [statusFiltro, setStatusFiltro] = useState('Todos')
  const [busca, setBusca] = useState('')
  const [pagina, setPagina] = useState(1)

  const territorios = useMemo(() =>
    ['Todos', ...Array.from(new Set(data.map(d => d.regiao).filter(Boolean))).sort()],
  [data])

  const statuses = useMemo(() =>
    ['Todos', ...Array.from(new Set(data.map(d => d.status).filter(Boolean))).sort()],
  [data])

  const kpis = useMemo(() => ({
    total: data.length,
    emExecucao: data.filter(d => d.status === 'Em execução').length,
    totalAtendidos: data.reduce((s, d) => s + d.total, 0),
    mediaTotal: data.reduce((s, d) => s + d.media, 0),
  }), [data])

  const filtered = useMemo(() => data.filter(d => {
    if (territorio !== 'Todos' && d.regiao !== territorio) return false
    if (statusFiltro !== 'Todos' && d.status !== statusFiltro) return false
    if (busca && !d.tarefa.toLowerCase().includes(busca.toLowerCase()) &&
        !d.responsavel.toLowerCase().includes(busca.toLowerCase())) return false
    return true
  }), [data, territorio, statusFiltro, busca])

  const statusChart = useMemo(() => {
    const map: Record<string, number> = {}
    filtered.forEach(d => { if (d.status) map[d.status] = (map[d.status] || 0) + 1 })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [filtered])

  const tipoChart = useMemo(() => {
    const map: Record<string, number> = {}
    filtered.forEach(d => { if (d.tipo) map[d.tipo] = (map[d.tipo] || 0) + 1 })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [filtered])

  const regiaoChart = useMemo(() => {
    const map: Record<string, number> = {}
    filtered.forEach(d => { if (d.regiao) map[d.regiao] = (map[d.regiao] || 0) + 1 })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [filtered])

  const POR_PAGINA = 10
  const totalPaginas = Math.ceil(filtered.length / POR_PAGINA)
  const paginated = filtered.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <KpiCard label="Total de Ações" value={kpis.total.toString()} sub="ações mapeadas no PCI" />
        <KpiCard label="Em Execução" value={kpis.emExecucao.toString()} sub="ações ativas" />
        <KpiCard label="Pessoas Atendidas" value={kpis.totalAtendidos.toLocaleString('pt-BR')} sub="total acumulado" />
        <KpiCard label="Média Mensal" value={kpis.mediaTotal.toLocaleString('pt-BR')} sub="atendimentos/mês" />
      </div>

      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #d4dff0', padding: '16px 24px', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <FilterSelect label="Território" value={territorio} options={territorios} onChange={v => { setTerritorio(v); setPagina(1) }} />
        <FilterSelect label="Status" value={statusFiltro} options={statuses} onChange={v => { setStatusFiltro(v); setPagina(1) }} />
        <div>
          <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4a5f8a', display: 'block', marginBottom: 4 }}>Busca</label>
          <input
            value={busca}
            onChange={e => { setBusca(e.target.value); setPagina(1) }}
            placeholder="Ação ou responsável..."
            style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.82rem', padding: '8px 12px', borderRadius: 8, border: '1px solid #d4dff0', outline: 'none', minWidth: 220, color: '#0f1d3d' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        <ChartCard title="Status das Ações">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusChart} layout="vertical" margin={{ left: 8, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
              <XAxis type="number" tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#8fa3c8' }} />
              <YAxis dataKey="name" type="category" width={160} tick={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fill: '#4a5f8a' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Ações" radius={[0, 4, 4, 0]}>
                {statusChart.map((e, i) => <Cell key={i} fill={STATUS_COLORS[e.name] || '#8fa3c8'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Tipo de Ação">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={tipoChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {tipoChart.map((_, i) => <Cell key={i} fill={['#1a2a5e','#2563a8','#00a8cc','#3b82f6'][i % 4]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Por Território">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regiaoChart} layout="vertical" margin={{ left: 8, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
              <XAxis type="number" tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#8fa3c8' }} />
              <YAxis dataKey="name" type="category" width={190} tick={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fill: '#4a5f8a' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Ações" radius={[0, 4, 4, 0]}>
                {regiaoChart.map((_, i) => <Cell key={i} fill={['#1a2a5e','#2563a8','#00a8cc'][i % 3]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #d4dff0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #d4dff0' }}>
          <p style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.9rem', color: '#0f1d3d' }}>
            Ações Sociais
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#8fa3c8', marginLeft: 8 }}>({filtered.length} registros)</span>
          </p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f7fc' }}>
                {['Ação', 'Território', 'Responsável', 'Tipo', 'Status', 'Total Atendidos'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4a5f8a', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((d, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f0f4f8' }}>
                  <td style={{ padding: '10px 16px', fontFamily: 'Plus Jakarta Sans', fontSize: '0.82rem', color: '#0f1d3d', maxWidth: 240 }}>{d.tarefa}</td>
                  <td style={{ padding: '10px 16px', fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: '#4a5f8a', whiteSpace: 'nowrap' }}>{d.regiao}</td>
                  <td style={{ padding: '10px 16px', fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: '#4a5f8a' }}>{d.responsavel}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '3px 8px', borderRadius: 4, background: '#e8f4fa', color: '#2563a8' }}>{d.tipo}</span>
                  </td>
                  <td style={{ padding: '10px 16px' }}><StatusBadge status={d.status} /></td>
                  <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono', fontSize: '0.78rem', color: '#0f1d3d', textAlign: 'right' }}>{d.total > 0 ? d.total.toLocaleString('pt-BR') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPaginas > 1 && (
          <div style={{ padding: '12px 24px', borderTop: '1px solid #f0f4f8', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #d4dff0', background: 'white', fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', cursor: pagina === 1 ? 'not-allowed' : 'pointer', color: '#4a5f8a', opacity: pagina === 1 ? 0.4 : 1 }}>‹ Anterior</button>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#8fa3c8' }}>{pagina} / {totalPaginas}</span>
            <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #d4dff0', background: 'white', fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', cursor: pagina === totalPaginas ? 'not-allowed' : 'pointer', color: '#4a5f8a', opacity: pagina === totalPaginas ? 0.4 : 1 }}>Próxima ›</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD URBANISMO
// ─────────────────────────────────────────────────────────────────────────────
function DashboardUrbanismo({ data, loading }: { data: UrbanismoRow[]; loading: boolean }) {
  const [territorio, setTerritorio] = useState('Todos')
  const [tipologia, setTipologia] = useState('Todos')
  const [statusFiltro, setStatusFiltro] = useState('Todos')
  const [busca, setBusca] = useState('')
  const [pagina, setPagina] = useState(1)

  const territorios = useMemo(() =>
    ['Todos', ...Array.from(new Set(data.map(d => d.territorio).filter(Boolean))).sort()],
  [data])

  const tipologias = useMemo(() =>
    ['Todos', ...Array.from(new Set(data.map(d => d.tipologia).filter(Boolean))).sort()],
  [data])

  const statuses = useMemo(() =>
    ['Todos', ...Array.from(new Set(data.map(d => d.status).filter(Boolean))).sort()],
  [data])

  const kpis = useMemo(() => ({
    total: data.length,
    concluidos: data.filter(d => d.status === 'Concluído').length,
    emExecucao: data.filter(d => d.status === 'Em execução').length,
    municipios: new Set(data.map(d => d.municipio).filter(Boolean)).size,
  }), [data])

  const filteredRows = useMemo(() => data.filter(d => {
    if (territorio !== 'Todos' && d.territorio !== territorio) return false
    if (tipologia !== 'Todos' && d.tipologia !== tipologia) return false
    if (statusFiltro !== 'Todos' && d.status !== statusFiltro) return false
    if (busca && !d.projeto.toLowerCase().includes(busca.toLowerCase()) &&
        !d.demandante.toLowerCase().includes(busca.toLowerCase())) return false
    return true
  }), [data, territorio, tipologia, statusFiltro, busca])

  const statusChart = useMemo(() => {
    const map: Record<string, number> = {}
    data.forEach(d => { if (d.status) map[d.status] = (map[d.status] || 0) + 1 })
    return Object.entries(map)
      .map(([name, value]) => ({ name, value, color: STATUS_COLORS[name] || '#8fa3c8' }))
      .sort((a, b) => b.value - a.value)
  }, [data])

  const tipologiaChart = useMemo(() => {
    const map: Record<string, number> = {}
    data.forEach(d => { if (d.tipologia) map[d.tipologia] = (map[d.tipologia] || 0) + 1 })
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [data])

  const grauChart = useMemo(() => {
    const map: Record<string, number> = {}
    data.forEach(d => { if (d.grau) map[d.grau] = (map[d.grau] || 0) + 1 })
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [data])

  const subtipologiaChart = useMemo(() => {
    const map: Record<string, number> = {}
    data.forEach(d => { if (d.subtipologia) map[d.subtipologia] = (map[d.subtipologia] || 0) + 1 })
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8)
  }, [data])

  const POR_PAGINA = 10
  const totalPaginas = Math.ceil(filteredRows.length / POR_PAGINA)
  const paginated = filteredRows.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <KpiCard label="Total de Projetos" value={kpis.total.toString()} sub="intervenções registradas" />
        <KpiCard label="Concluídos" value={kpis.concluidos.toString()} sub="projetos entregues" />
        <KpiCard label="Em Execução" value={kpis.emExecucao.toString()} sub="obras ativas" />
        <KpiCard label="Municípios" value={kpis.municipios.toString()} sub="municípios atendidos" />
      </div>

      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #d4dff0', padding: '16px 24px', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <FilterSelect label="Território" value={territorio} options={territorios} onChange={v => { setTerritorio(v); setPagina(1) }} />
        <FilterSelect label="Tipologia" value={tipologia} options={tipologias} onChange={v => { setTipologia(v); setPagina(1) }} />
        <FilterSelect label="Status" value={statusFiltro} options={statuses} onChange={v => { setStatusFiltro(v); setPagina(1) }} />
        <div>
          <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4a5f8a', display: 'block', marginBottom: 4 }}>Busca</label>
          <input
            value={busca}
            onChange={e => { setBusca(e.target.value); setPagina(1) }}
            placeholder="Projeto ou demandante..."
            style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.82rem', padding: '8px 12px', borderRadius: 8, border: '1px solid #d4dff0', outline: 'none', minWidth: 220, color: '#0f1d3d' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        <ChartCard title="Status dos Projetos">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusChart} margin={{ left: 8, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
              <XAxis dataKey="name" tick={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fill: '#4a5f8a' }} angle={-30} textAnchor="end" interval={0} height={70} />
              <YAxis tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#8fa3c8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Projetos" radius={[4, 4, 0, 0]}>
                {statusChart.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Tipologia do Projeto">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={tipologiaChart} dataKey="value" nameKey="name" cx="40%" cy="50%" innerRadius={55} outerRadius={100}>
                {tipologiaChart.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" iconSize={8}
                formatter={(v) => <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.72rem', color: '#4a5f8a' }}>{v}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Grau de Intervenção">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={grauChart} margin={{ left: 8, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
              <XAxis dataKey="name" tick={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fill: '#4a5f8a' }} angle={-20} textAnchor="end" interval={0} height={60} />
              <YAxis tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#8fa3c8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Projetos" fill="#2563a8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Subtipologias">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subtipologiaChart} layout="vertical" margin={{ left: 8, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
              <XAxis type="number" tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#8fa3c8' }} />
              <YAxis dataKey="name" type="category" width={170} tick={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fill: '#4a5f8a' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Projetos" fill="#00a8cc" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #d4dff0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #d4dff0' }}>
          <p style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.9rem', color: '#0f1d3d' }}>
            Projetos Urbanísticos
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#8fa3c8', marginLeft: 8 }}>({filteredRows.length} registros)</span>
          </p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f7fc' }}>
                {['Projeto', 'Demandante', 'Território', 'Tipologia', 'Status', 'Início', 'Fim'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4a5f8a', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((d, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f0f4f8' }}>
                  <td style={{ padding: '10px 16px', fontFamily: 'Plus Jakarta Sans', fontSize: '0.82rem', color: '#0f1d3d', maxWidth: 240 }}>{d.projeto}</td>
                  <td style={{ padding: '10px 16px', fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: '#4a5f8a' }}>{d.demandante}</td>
                  <td style={{ padding: '10px 16px', fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: '#4a5f8a', whiteSpace: 'nowrap' }}>{d.territorio}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '3px 8px', borderRadius: 4, background: '#e8f4fa', color: '#2563a8' }}>{d.tipologia}</span>
                  </td>
                  <td style={{ padding: '10px 16px' }}><StatusBadge status={d.status} /></td>
                  <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#4a5f8a' }}>{d.inicio}</td>
                  <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#4a5f8a' }}>{d.fim}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPaginas > 1 && (
          <div style={{ padding: '12px 24px', borderTop: '1px solid #f0f4f8', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #d4dff0', background: 'white', fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', cursor: pagina === 1 ? 'not-allowed' : 'pointer', color: '#4a5f8a', opacity: pagina === 1 ? 0.4 : 1 }}>‹ Anterior</button>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#8fa3c8' }}>{pagina} / {totalPaginas}</span>
            <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #d4dff0', background: 'white', fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', cursor: pagina === totalPaginas ? 'not-allowed' : 'pointer', color: '#4a5f8a', opacity: pagina === totalPaginas ? 0.4 : 1 }}>Próxima ›</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [aba, setAba] = useState<'social' | 'urbanismo'>('social')
  const [socialData, setSocialData] = useState<SocialRow[]>([])
  const [urbanismoData, setUrbanismoData] = useState<UrbanismoRow[]>([])
  const [loadingSocial, setLoadingSocial] = useState(true)
  const [loadingUrbanismo, setLoadingUrbanismo] = useState(true)

  useEffect(() => {
    fetch(SOCIAL_URL)
      .then(r => r.text())
      .then(text => {
        const rows = parseCSV(text)
        setSocialData(rows.filter(r => r['Tarefa']).map(r => ({
          tarefa: r['Tarefa'],
          regiao: r['territorio_rotulo'] || 'Outros',
          localidade: r['Localidade Específica'] || '',
          responsavel: r['Responsável - Sec. / Órgão'] || '',
          tipo: r['Tipo'] || '',
          status: r['Status'] || '',
          media: Number(r['Média Atendidos (Mensal)']) || 0,
          total: Number(r['Qtd. Total']) || 0,
        })))
      })
      .catch(() => {})
      .finally(() => setLoadingSocial(false))

    fetch(URBANISMO_URL)
      .then(r => r.text())
      .then(text => {
        const rows = parseCSV(text)
        setUrbanismoData(rows.filter(r => r['Projeto']).map(r => ({
          projeto: r['Projeto'],
          demandante: r['Demandante'] || '',
          territorio: r['territorio_rotulo'] || 'Outros',
          tipologia: r['Tipologia'] || '',
          subtipologia: r['Subtipologia'] || '',
          grau: r['Grau de Intervenção/Projeto'] || '',
          status: r['Status'] || '',
          inicio: r['Data de início'] || '',
          fim: r['Data Final'] || '',
          municipio: r['Município'] || '',
        })))
      })
      .catch(() => {})
      .finally(() => setLoadingUrbanismo(false))
  }, [])

  return (
    <div style={{ background: '#f5f7fc', minHeight: '100vh' }}>
      <section style={{ background: 'linear-gradient(135deg, #1a2a5e 0%, #1e3a8a 100%)', color: 'white', borderBottom: '3px solid #00a8cc' }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', padding: '3px 10px', borderRadius: 4, display: 'inline-block', marginBottom: 12 }}>
            Dashboard · PCI
          </span>
          <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', lineHeight: 1.1, marginBottom: 8 }}>
            Painel de Dados — PCI
          </h1>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', maxWidth: 560, lineHeight: 1.7, marginBottom: 4 }}>
            Ações sociais e projetos de urbanismo do Programa Cidade Integrada
          </p>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Dados em tempo real · Google Sheets
          </p>
        </div>
      </section>

      <div style={{ background: 'white', borderBottom: '1px solid #d4dff0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ display: 'flex', gap: 0 }}>
            {(['social', 'urbanismo'] as const).map(tab => (
              <button key={tab} onClick={() => setAba(tab)} style={{
                fontFamily: 'Plus Jakarta Sans', fontWeight: aba === tab ? 700 : 500,
                fontSize: '0.9rem', padding: '14px 28px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: aba === tab ? '#1a2a5e' : '#8fa3c8',
                borderBottom: aba === tab ? '3px solid #00a8cc' : '3px solid transparent',
                transition: 'all 0.15s',
              }}>
                {tab === 'social' ? '📊 Social' : '🏗️ Urbanismo'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {aba === 'social'
          ? <DashboardSocial data={socialData} loading={loadingSocial} />
          : <DashboardUrbanismo data={urbanismoData} loading={loadingUrbanismo} />
        }
      </div>
    </div>
  )
}

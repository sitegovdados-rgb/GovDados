'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import Script from 'next/script'
import { DM_Serif_Display, Plus_Jakarta_Sans, DM_Mono } from 'next/font/google'

const dmSerif = DM_Serif_Display({ subsets: ['latin'], weight: '400', display: 'swap' })
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' })
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], display: 'swap' })

const SOCIAL_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTmQ70z8qfPdYfDBNhP1rPKQOa8IDYvLn3cKOGHkJQAtzWxOrJDilM-3Mfx1Ufy74UI7u7THhWD5XK7/pub?output=csv'
const URBANISMO_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRWfmHpAt-Wjh-IWiAYnyu6dLaj7-vlXDKZXLXP-UsyjR-2BSqFxSf0TMXGtgheYJn5reTMFgCoVO-0/pub?output=csv'

const BG = '#070e1a'
const SURFACE = 'rgba(255,255,255,0.03)'
const BORDER = 'rgba(255,255,255,0.07)'
const TEXT = '#e8edf5'
const MUTED = '#5577aa'
const ACCENT = '#00a8cc'

const TERR_COLORS: Record<string, string> = {
  'Jacarezinho e Manguinhos': '#f97316',
  'Cinturão de Jacarepaguá': '#06b6d4',
  'PPG': '#a855f7',
  'Outros': '#64748b',
}
const STATUS_COLORS: Record<string, string> = {
  'Em execução': '#3b82f6', 'Concluída': '#22c55e', 'Concluído': '#22c55e',
  'Bloqueada': '#ef4444', 'Aguardando Informação': '#f97316',
  'Aguardando Aprovação': '#06b6d4', 'Aguardando Revisão': '#a855f7',
  'Suspenso': '#64748b', 'Cancelado': '#ef4444',
  'Não iniciado': '#94a3b8', 'Não Iniciado': '#94a3b8',
}
const PIE_COLORS = ['#1e40af','#2563a8','#0ea5e9','#06b6d4','#7c3aed','#8b5cf6','#0891b2','#4338ca','#6366f1','#818cf8']
const TT = {
  backgroundColor: '#0d1929', borderColor: 'rgba(255,255,255,0.12)',
  borderRadius: 8, textStyle: { color: TEXT, fontSize: 12, fontFamily: 'Plus Jakarta Sans, sans-serif' },
}

// ── CSV parser ────────────────────────────────────────────────────────────────
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return []
  const parseRow = (line: string) => {
    const cols: string[] = []; let cur = '', inQ = false
    for (let i = 0; i < line.length; i++) {
      const c = line[i]
      if (c === '"') { if (inQ && line[i+1] === '"') { cur += '"'; i++ } else inQ = !inQ }
      else if (c === ',' && !inQ) { cols.push(cur); cur = '' }
      else cur += c
    }
    cols.push(cur); return cols
  }
  const headers = parseRow(lines[0])
  return lines.slice(1).map(line => {
    const v = parseRow(line)
    return Object.fromEntries(headers.map((h, i) => [h.trim(), (v[i] ?? '').trim()]))
  })
}

type SocialRow = { tarefa: string; regiao: string; responsavel: string; tipo: string; status: string; media: number; total: number }
type UrbanismoRow = { projeto: string; demandante: string; territorio: string; tipologia: string; subtipologia: string; grau: string; status: string; inicio: string; fim: string; municipio: string }

// ── useECharts ────────────────────────────────────────────────────────────────
function useECharts(ref: React.RefObject<HTMLDivElement | null>, getOption: () => object, deps: unknown[]) {
  useEffect(() => {
    if (!ref.current) return
    const ec = (window as any).echarts
    if (!ec) return
    const chart = ec.init(ref.current, null, { renderer: 'canvas' })
    chart.setOption(getOption())
    const ro = new ResizeObserver(() => chart.resize())
    ro.observe(ref.current)
    return () => { ro.disconnect(); chart.dispose() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

// ── Charts ────────────────────────────────────────────────────────────────────
function HBar({ data, colorFn, er }: { data: {name:string;value:number}[]; colorFn?: (n:string,i:number)=>string; er: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useECharts(ref, () => ({
    backgroundColor: 'transparent',
    tooltip: { ...TT, trigger: 'axis' },
    grid: { left: 0, right: 28, top: 4, bottom: 4, containLabel: true },
    xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }, axisLabel: { color: MUTED, fontSize: 11, fontFamily: dmMono.style.fontFamily } },
    yAxis: { type: 'category', data: data.map(d => d.name), axisLabel: { color: '#8fa3c8', fontSize: 11, fontFamily: plusJakarta.style.fontFamily }, axisTick: { show: false }, axisLine: { show: false } },
    series: [{ type: 'bar', data: data.map((d,i) => ({ value: d.value, itemStyle: { color: colorFn ? colorFn(d.name,i) : ACCENT, borderRadius: [0,4,4,0] } })), label: { show: true, position: 'right', color: MUTED, fontSize: 11, fontFamily: dmMono.style.fontFamily } }],
  }), [data, er])
  return <div ref={ref} style={{ width: '100%', height: '100%' }} />
}

function VBar({ data, er }: { data: {name:string;value:number;color?:string}[]; er: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useECharts(ref, () => ({
    backgroundColor: 'transparent',
    tooltip: { ...TT, trigger: 'axis' },
    grid: { left: 0, right: 8, top: 8, bottom: 64, containLabel: true },
    xAxis: { type: 'category', data: data.map(d => d.name), axisLabel: { color: MUTED, fontSize: 10, rotate: -30, fontFamily: plusJakarta.style.fontFamily, interval: 0 }, axisTick: { show: false }, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }, axisLabel: { color: MUTED, fontSize: 11, fontFamily: dmMono.style.fontFamily } },
    series: [{ type: 'bar', data: data.map(d => ({ value: d.value, itemStyle: { color: d.color || '#2563a8', borderRadius: [4,4,0,0] } })) }],
  }), [data, er])
  return <div ref={ref} style={{ width: '100%', height: '100%' }} />
}

function Donut({ data, er }: { data: {name:string;value:number}[]; er: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useECharts(ref, () => ({
    backgroundColor: 'transparent',
    tooltip: { ...TT, trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', right: 0, top: 'center', textStyle: { color: '#8fa3c8', fontSize: 11, fontFamily: plusJakarta.style.fontFamily }, icon: 'circle', itemWidth: 8, itemHeight: 8 },
    series: [{ type: 'pie', radius: ['42%','68%'], center: ['38%','50%'], data: data.map((d,i) => ({ ...d, itemStyle: { color: PIE_COLORS[i % PIE_COLORS.length], borderRadius: 3, borderWidth: 2, borderColor: BG } })), label: { show: false } }],
  }), [data, er])
  return <div ref={ref} style={{ width: '100%', height: '100%' }} />
}

// ── UI atoms ──────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] || '#64748b'
  return <span style={{ display: 'inline-block', background: `${c}18`, color: c, border: `1px solid ${c}40`, fontFamily: dmMono.style.fontFamily, fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '3px 8px', borderRadius: 4 }}>{status}</span>
}

function KpiCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 24px', flex: 1, minWidth: 150 }}>
      <p style={{ fontFamily: dmMono.style.fontFamily, fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED, marginBottom: 8 }}>{label}</p>
      <p style={{ fontFamily: dmMono.style.fontFamily, fontWeight: 500, fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: color || ACCENT, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontFamily: plusJakarta.style.fontFamily, fontSize: '0.68rem', color: MUTED, marginTop: 6 }}>{sub}</p>}
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 24px' }}>
      <p style={{ fontFamily: dmSerif.style.fontFamily, fontSize: '1rem', color: TEXT, marginBottom: 16 }}>{title}</p>
      <div style={{ height: 280 }}>{children}</div>
    </div>
  )
}

function Spin() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
      <style>{`@keyframes _sp{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${BORDER}`, borderTopColor: ACCENT, animation: '_sp 0.8s linear infinite' }} />
    </div>
  )
}

const FL: React.CSSProperties = { fontFamily: '', fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED, display: 'block', marginBottom: 4 }
const FS: React.CSSProperties = { fontSize: '0.8rem', padding: '7px 10px', borderRadius: 8, border: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.04)', color: TEXT, minWidth: 170, cursor: 'pointer' }

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ territories, active, onToggle, busca, onBusca }: {
  territories: string[]; active: Set<string>
  onToggle: (t: string) => void; busca: string; onBusca: (s: string) => void
}) {
  const sec: React.CSSProperties = { fontFamily: dmMono.style.fontFamily, fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED, display: 'block', marginBottom: 10 }
  return (
    <aside style={{ width: 220, flexShrink: 0, background: BG, borderRight: '1px solid rgba(255,255,255,0.06)', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 28, overflowY: 'auto' }}>
      <div>
        <span style={sec}>Busca</span>
        <input value={busca} onChange={e => onBusca(e.target.value)} placeholder="Ação, projeto..." style={{ width: '100%', boxSizing: 'border-box', fontFamily: plusJakarta.style.fontFamily, fontSize: '0.8rem', padding: '8px 10px', borderRadius: 8, border: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.04)', color: TEXT, outline: 'none' }} />
      </div>
      <div>
        <span style={sec}>Território</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {territories.map(t => {
            const on = active.size === 0 || active.has(t)
            const c = TERR_COLORS[t] || '#64748b'
            return (
              <button key={t} onClick={() => onToggle(t)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', textAlign: 'left' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, flexShrink: 0, background: on ? c : 'rgba(255,255,255,0.08)', border: `1px solid ${on ? c : 'rgba(255,255,255,0.15)'}`, transition: 'all 0.15s' }} />
                <span style={{ fontFamily: plusJakarta.style.fontFamily, fontSize: '0.78rem', color: on ? TEXT : MUTED, transition: 'color 0.15s', lineHeight: 1.3 }}>{t}</span>
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

// ── DashboardSocial ───────────────────────────────────────────────────────────
function DashboardSocial({ data, loading, er, territoriosAtivos, busca }: {
  data: SocialRow[]; loading: boolean; er: boolean; territoriosAtivos: Set<string>; busca: string
}) {
  const [statusFiltro, setStatusFiltro] = useState('Todos')
  const [tipoFiltro, setTipoFiltro] = useState('Todos')
  const [pagina, setPagina] = useState(1)

  const statuses = useMemo(() => ['Todos', ...Array.from(new Set(data.map(d => d.status).filter(Boolean))).sort()], [data])
  const tipos = useMemo(() => ['Todos', ...Array.from(new Set(data.map(d => d.tipo).filter(Boolean))).sort()], [data])

  const kpis = useMemo(() => ({
    total: data.length,
    emExecucao: data.filter(d => d.status === 'Em execução').length,
    totalAtendidos: data.reduce((s, d) => s + d.total, 0),
    mediaTotal: data.reduce((s, d) => s + d.media, 0),
  }), [data])

  const filtered = useMemo(() => data.filter(d => {
    if (territoriosAtivos.size > 0 && !territoriosAtivos.has(d.regiao)) return false
    if (statusFiltro !== 'Todos' && d.status !== statusFiltro) return false
    if (tipoFiltro !== 'Todos' && d.tipo !== tipoFiltro) return false
    if (busca && !d.tarefa.toLowerCase().includes(busca.toLowerCase()) && !d.responsavel.toLowerCase().includes(busca.toLowerCase())) return false
    return true
  }), [data, territoriosAtivos, statusFiltro, tipoFiltro, busca])

  const statusChart = useMemo(() => {
    const m: Record<string, number> = {}
    filtered.forEach(d => { if (d.status) m[d.status] = (m[d.status] || 0) + 1 })
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [filtered])

  const tipoChart = useMemo(() => {
    const m: Record<string, number> = {}
    filtered.forEach(d => { if (d.tipo) m[d.tipo] = (m[d.tipo] || 0) + 1 })
    return Object.entries(m).map(([name, value]) => ({ name, value }))
  }, [filtered])

  const regiaoChart = useMemo(() => {
    const m: Record<string, number> = {}
    filtered.forEach(d => { if (d.regiao) m[d.regiao] = (m[d.regiao] || 0) + 1 })
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [filtered])

  const POR_PAGINA = 10
  const totalPaginas = Math.ceil(filtered.length / POR_PAGINA)
  const paginated = filtered.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  if (loading) return <Spin />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <KpiCard label="Total de Ações" value={kpis.total.toString()} sub="ações mapeadas" />
        <KpiCard label="Em Execução" value={kpis.emExecucao.toString()} sub="ativas" color="#22c55e" />
        <KpiCard label="Pessoas Atendidas" value={kpis.totalAtendidos.toLocaleString('pt-BR')} sub="total acumulado" />
        <KpiCard label="Média Mensal" value={kpis.mediaTotal.toLocaleString('pt-BR')} sub="atendimentos/mês" color="#a855f7" />
      </div>

      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 20px', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div><label style={{ ...FL, fontFamily: dmMono.style.fontFamily }}>Status</label><select value={statusFiltro} onChange={e => { setStatusFiltro(e.target.value); setPagina(1) }} style={{ ...FS, fontFamily: plusJakarta.style.fontFamily }}>{statuses.map(o => <option key={o}>{o}</option>)}</select></div>
        <div><label style={{ ...FL, fontFamily: dmMono.style.fontFamily }}>Tipo</label><select value={tipoFiltro} onChange={e => { setTipoFiltro(e.target.value); setPagina(1) }} style={{ ...FS, fontFamily: plusJakarta.style.fontFamily }}>{tipos.map(o => <option key={o}>{o}</option>)}</select></div>
        <span style={{ fontFamily: dmMono.style.fontFamily, fontSize: '0.7rem', color: MUTED }}>{filtered.length} registros</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        <ChartCard title="Status das Ações"><HBar data={statusChart} colorFn={n => STATUS_COLORS[n] || MUTED} er={er} /></ChartCard>
        <ChartCard title="Tipo de Ação"><Donut data={tipoChart} er={er} /></ChartCard>
        <ChartCard title="Por Território"><HBar data={regiaoChart} colorFn={n => TERR_COLORS[n] || ACCENT} er={er} /></ChartCard>
      </div>

      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              {['Ação','Território','Responsável','Tipo','Status','Total Atendidos'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: dmMono.style.fontFamily, fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED, fontWeight: 500, whiteSpace: 'nowrap', borderBottom: `1px solid ${BORDER}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {paginated.map((d, i) => (
                <tr key={i} style={{ borderBottom: 'rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '11px 16px', fontFamily: plusJakarta.style.fontFamily, fontSize: '0.82rem', color: TEXT, maxWidth: 240 }}>{d.tarefa}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: TERR_COLORS[d.regiao] || MUTED, flexShrink: 0 }} />
                      <span style={{ fontFamily: plusJakarta.style.fontFamily, fontSize: '0.78rem', color: MUTED, whiteSpace: 'nowrap' }}>{d.regiao}</span>
                    </span>
                  </td>
                  <td style={{ padding: '11px 16px', fontFamily: plusJakarta.style.fontFamily, fontSize: '0.78rem', color: MUTED }}>{d.responsavel}</td>
                  <td style={{ padding: '11px 16px' }}><span style={{ fontFamily: dmMono.style.fontFamily, fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '3px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: '#8fa3c8' }}>{d.tipo}</span></td>
                  <td style={{ padding: '11px 16px' }}><StatusBadge status={d.status} /></td>
                  <td style={{ padding: '11px 16px', fontFamily: dmMono.style.fontFamily, fontSize: '0.78rem', color: TEXT, textAlign: 'right' }}>{d.total > 0 ? d.total.toLocaleString('pt-BR') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPaginas > 1 && (
          <div style={{ padding: '12px 20px', borderTop: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={() => setPagina(p => Math.max(1, p-1))} disabled={pagina===1} style={{ padding: '5px 11px', borderRadius: 6, border: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.04)', fontFamily: plusJakarta.style.fontFamily, fontSize: '0.78rem', cursor: pagina===1?'not-allowed':'pointer', color: MUTED, opacity: pagina===1?0.4:1 }}>‹</button>
            <span style={{ fontFamily: dmMono.style.fontFamily, fontSize: '0.7rem', color: MUTED }}>{pagina}/{totalPaginas}</span>
            <button onClick={() => setPagina(p => Math.min(totalPaginas, p+1))} disabled={pagina===totalPaginas} style={{ padding: '5px 11px', borderRadius: 6, border: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.04)', fontFamily: plusJakarta.style.fontFamily, fontSize: '0.78rem', cursor: pagina===totalPaginas?'not-allowed':'pointer', color: MUTED, opacity: pagina===totalPaginas?0.4:1 }}>›</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── DashboardUrbanismo ────────────────────────────────────────────────────────
function DashboardUrbanismo({ data, loading, er, territoriosAtivos, busca }: {
  data: UrbanismoRow[]; loading: boolean; er: boolean; territoriosAtivos: Set<string>; busca: string
}) {
  const [statusFiltro, setStatusFiltro] = useState('Todos')
  const [tipologiaFiltro, setTipologiaFiltro] = useState('Todos')
  const [pagina, setPagina] = useState(1)

  const statuses = useMemo(() => ['Todos', ...Array.from(new Set(data.map(d => d.status).filter(Boolean))).sort()], [data])
  const tipologias = useMemo(() => ['Todos', ...Array.from(new Set(data.map(d => d.tipologia).filter(Boolean))).sort()], [data])

  const kpis = useMemo(() => ({
    total: data.length,
    concluidos: data.filter(d => d.status === 'Concluído').length,
    emExecucao: data.filter(d => d.status === 'Em execução').length,
    municipios: new Set(data.map(d => d.municipio).filter(Boolean)).size,
  }), [data])

  const filteredRows = useMemo(() => data.filter(d => {
    if (territoriosAtivos.size > 0 && !territoriosAtivos.has(d.territorio)) return false
    if (statusFiltro !== 'Todos' && d.status !== statusFiltro) return false
    if (tipologiaFiltro !== 'Todos' && d.tipologia !== tipologiaFiltro) return false
    if (busca && !d.projeto.toLowerCase().includes(busca.toLowerCase()) && !d.demandante.toLowerCase().includes(busca.toLowerCase())) return false
    return true
  }), [data, territoriosAtivos, statusFiltro, tipologiaFiltro, busca])

  const statusChart = useMemo(() => {
    const m: Record<string, number> = {}
    data.forEach(d => { if (d.status) m[d.status] = (m[d.status] || 0) + 1 })
    return Object.entries(m).map(([name, value]) => ({ name, value, color: STATUS_COLORS[name] || MUTED })).sort((a, b) => b.value - a.value)
  }, [data])

  const tipologiaChart = useMemo(() => {
    const m: Record<string, number> = {}
    data.forEach(d => { if (d.tipologia) m[d.tipologia] = (m[d.tipologia] || 0) + 1 })
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [data])

  const grauChart = useMemo(() => {
    const m: Record<string, number> = {}
    data.forEach(d => { if (d.grau) m[d.grau] = (m[d.grau] || 0) + 1 })
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [data])

  const subtipoChart = useMemo(() => {
    const m: Record<string, number> = {}
    data.forEach(d => { if (d.subtipologia) m[d.subtipologia] = (m[d.subtipologia] || 0) + 1 })
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8)
  }, [data])

  const POR_PAGINA = 10
  const totalPaginas = Math.ceil(filteredRows.length / POR_PAGINA)
  const paginated = filteredRows.slice((pagina-1)*POR_PAGINA, pagina*POR_PAGINA)

  if (loading) return <Spin />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <KpiCard label="Total de Projetos" value={kpis.total.toString()} sub="intervenções registradas" />
        <KpiCard label="Concluídos" value={kpis.concluidos.toString()} sub="entregues" color="#22c55e" />
        <KpiCard label="Em Execução" value={kpis.emExecucao.toString()} sub="obras ativas" />
        <KpiCard label="Municípios" value={kpis.municipios.toString()} sub="atendidos" color="#a855f7" />
      </div>

      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 20px', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div><label style={{ ...FL, fontFamily: dmMono.style.fontFamily }}>Status</label><select value={statusFiltro} onChange={e => { setStatusFiltro(e.target.value); setPagina(1) }} style={{ ...FS, fontFamily: plusJakarta.style.fontFamily }}>{statuses.map(o => <option key={o}>{o}</option>)}</select></div>
        <div><label style={{ ...FL, fontFamily: dmMono.style.fontFamily }}>Tipologia</label><select value={tipologiaFiltro} onChange={e => { setTipologiaFiltro(e.target.value); setPagina(1) }} style={{ ...FS, fontFamily: plusJakarta.style.fontFamily }}>{tipologias.map(o => <option key={o}>{o}</option>)}</select></div>
        <span style={{ fontFamily: dmMono.style.fontFamily, fontSize: '0.7rem', color: MUTED }}>{filteredRows.length} registros</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        <ChartCard title="Status dos Projetos"><VBar data={statusChart} er={er} /></ChartCard>
        <ChartCard title="Tipologia do Projeto"><Donut data={tipologiaChart} er={er} /></ChartCard>
        <ChartCard title="Grau de Intervenção"><HBar data={grauChart} er={er} /></ChartCard>
        <ChartCard title="Top Subtipologias"><HBar data={subtipoChart} colorFn={() => '#06b6d4'} er={er} /></ChartCard>
      </div>

      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              {['Projeto','Demandante','Território','Tipologia','Status','Início','Fim'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: dmMono.style.fontFamily, fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED, fontWeight: 500, whiteSpace: 'nowrap', borderBottom: `1px solid ${BORDER}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {paginated.map((d, i) => (
                <tr key={i} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                  <td style={{ padding: '11px 16px', fontFamily: plusJakarta.style.fontFamily, fontSize: '0.82rem', color: TEXT, maxWidth: 240 }}>{d.projeto}</td>
                  <td style={{ padding: '11px 16px', fontFamily: plusJakarta.style.fontFamily, fontSize: '0.78rem', color: MUTED }}>{d.demandante}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: TERR_COLORS[d.territorio] || MUTED, flexShrink: 0 }} />
                      <span style={{ fontFamily: plusJakarta.style.fontFamily, fontSize: '0.78rem', color: MUTED, whiteSpace: 'nowrap' }}>{d.territorio}</span>
                    </span>
                  </td>
                  <td style={{ padding: '11px 16px' }}><span style={{ fontFamily: dmMono.style.fontFamily, fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '3px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: '#8fa3c8' }}>{d.tipologia}</span></td>
                  <td style={{ padding: '11px 16px' }}><StatusBadge status={d.status} /></td>
                  <td style={{ padding: '11px 16px', fontFamily: dmMono.style.fontFamily, fontSize: '0.75rem', color: MUTED }}>{d.inicio}</td>
                  <td style={{ padding: '11px 16px', fontFamily: dmMono.style.fontFamily, fontSize: '0.75rem', color: MUTED }}>{d.fim}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPaginas > 1 && (
          <div style={{ padding: '12px 20px', borderTop: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={() => setPagina(p => Math.max(1, p-1))} disabled={pagina===1} style={{ padding: '5px 11px', borderRadius: 6, border: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.04)', fontFamily: plusJakarta.style.fontFamily, fontSize: '0.78rem', cursor: pagina===1?'not-allowed':'pointer', color: MUTED, opacity: pagina===1?0.4:1 }}>‹</button>
            <span style={{ fontFamily: dmMono.style.fontFamily, fontSize: '0.7rem', color: MUTED }}>{pagina}/{totalPaginas}</span>
            <button onClick={() => setPagina(p => Math.min(totalPaginas, p+1))} disabled={pagina===totalPaginas} style={{ padding: '5px 11px', borderRadius: 6, border: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.04)', fontFamily: plusJakarta.style.fontFamily, fontSize: '0.78rem', cursor: pagina===totalPaginas?'not-allowed':'pointer', color: MUTED, opacity: pagina===totalPaginas?0.4:1 }}>›</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [aba, setAba] = useState<'social' | 'urbanismo'>('social')
  const [socialData, setSocialData] = useState<SocialRow[]>([])
  const [urbanismoData, setUrbanismoData] = useState<UrbanismoRow[]>([])
  const [loadingSocial, setLoadingSocial] = useState(true)
  const [loadingUrbanismo, setLoadingUrbanismo] = useState(true)
  const [er, setEr] = useState(false)
  const [territoriosAtivos, setTerritoriosAtivos] = useState<Set<string>>(new Set())
  const [busca, setBusca] = useState('')

  useEffect(() => {
    fetch(SOCIAL_URL).then(r => r.text()).then(text => {
      setSocialData(parseCSV(text).filter(r => r['Tarefa']).map(r => ({
        tarefa: r['Tarefa'], regiao: r['territorio_rotulo'] || 'Outros',
        responsavel: r['Responsável - Sec. / Órgão'] || '',
        tipo: r['Tipo'] || '', status: r['Status'] || '',
        media: Number(r['Média Atendidos (Mensal)']) || 0,
        total: Number(r['Qtd. Total']) || 0,
      })))
    }).catch(() => {}).finally(() => setLoadingSocial(false))

    fetch(URBANISMO_URL).then(r => r.text()).then(text => {
      setUrbanismoData(parseCSV(text).filter(r => r['Projeto']).map(r => ({
        projeto: r['Projeto'], demandante: r['Demandante'] || '',
        territorio: r['territorio_rotulo'] || 'Outros',
        tipologia: r['Tipologia'] || '', subtipologia: r['Subtipologia'] || '',
        grau: r['Grau de Intervenção/Projeto'] || '', status: r['Status'] || '',
        inicio: r['Data de início'] || '', fim: r['Data Final'] || '',
        municipio: r['Município'] || '',
      })))
    }).catch(() => {}).finally(() => setLoadingUrbanismo(false))
  }, [])

  const allTerritories = useMemo(() => {
    const s = new Set<string>()
    socialData.forEach(d => d.regiao && s.add(d.regiao))
    urbanismoData.forEach(d => d.territorio && s.add(d.territorio))
    return Array.from(s).sort()
  }, [socialData, urbanismoData])

  function toggleTerritorio(t: string) {
    setTerritoriosAtivos(prev => {
      if (prev.size === 0) return new Set(allTerritories.filter(x => x !== t))
      const next = new Set(prev)
      if (next.has(t)) { next.delete(t); if (next.size === 0) return new Set() }
      else { next.add(t); if (next.size === allTerritories.length) return new Set() }
      return next
    })
  }

  const hoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <div style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        select option { background: #0d1929; color: ${TEXT}; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
      `}</style>

      <Script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/5.4.3/echarts.min.js" strategy="afterInteractive" onLoad={() => setEr(true)} />

      <header style={{ borderBottom: `1px solid ${BORDER}`, padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <h1 style={{ fontFamily: dmSerif.style.fontFamily, fontSize: 'clamp(1.2rem, 3vw, 1.7rem)', color: TEXT, fontWeight: 400, margin: 0 }}>Painel de Dados — PCI</h1>
          <span style={{ fontFamily: dmMono.style.fontFamily, fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(0,168,204,0.12)', color: ACCENT, border: `1px solid rgba(0,168,204,0.28)`, padding: '4px 10px', borderRadius: 4 }}>ADPF 635</span>
        </div>
        <p style={{ fontFamily: dmMono.style.fontFamily, fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED }}>Atualizado em {hoje}</p>
      </header>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar territories={allTerritories} active={territoriosAtivos} onToggle={toggleTerritorio} busca={busca} onBusca={setBusca} />

        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${BORDER}`, marginBottom: 4 }}>
            {(['social','urbanismo'] as const).map(tab => (
              <button key={tab} onClick={() => setAba(tab)} style={{ fontFamily: plusJakarta.style.fontFamily, fontWeight: aba===tab ? 600 : 400, fontSize: '0.9rem', padding: '11px 24px', background: 'none', border: 'none', cursor: 'pointer', color: aba===tab ? TEXT : MUTED, borderBottom: aba===tab ? `2px solid ${ACCENT}` : '2px solid transparent', marginBottom: -1, transition: 'all 0.15s' }}>
                {tab === 'social' ? 'Social' : 'Urbanismo'}
              </button>
            ))}
          </div>

          {aba === 'social'
            ? <DashboardSocial data={socialData} loading={loadingSocial} er={er} territoriosAtivos={territoriosAtivos} busca={busca} />
            : <DashboardUrbanismo data={urbanismoData} loading={loadingUrbanismo} er={er} territoriosAtivos={territoriosAtivos} busca={busca} />
          }
        </main>
      </div>

      <footer style={{ borderTop: `1px solid rgba(255,255,255,0.05)`, padding: '10px 32px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: dmMono.style.fontFamily, fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(85,119,170,0.45)' }}>Programa Cidade Integrada · Governo do Estado do Rio de Janeiro</span>
        <span style={{ fontFamily: dmMono.style.fontFamily, fontSize: '0.55rem', color: 'rgba(85,119,170,0.35)' }}>Google Sheets · Tempo real</span>
      </footer>
    </div>
  )
}

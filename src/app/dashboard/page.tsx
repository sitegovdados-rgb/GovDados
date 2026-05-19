'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import Script from 'next/script'
import { DM_Serif_Display, Plus_Jakarta_Sans, DM_Mono } from 'next/font/google'

const dmSerif = DM_Serif_Display({ subsets: ['latin'], weight: '400', display: 'swap' })
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' })
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], display: 'swap' })

const SOCIAL_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTmQ70z8qfPdYfDBNhP1rPKQOa8IDYvLn3cKOGHkJQAtzWxOrJDilM-3Mfx1Ufy74UI7u7THhWD5XK7/pub?output=csv'
const URBANISMO_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRWfmHpAt-Wjh-IWiAYnyu6dLaj7-vlXDKZXLXP-UsyjR-2BSqFxSf0TMXGtgheYJn5reTMFgCoVO-0/pub?output=csv'

const BG = '#f5f7fc'
const SURFACE = '#ffffff'
const BORDER = '#e2e8f0'
const TEXT = '#1a2a5e'
const MUTED = '#64748b'
const ACCENT = '#00c2a8'

const TERR_COLORS: Record<string, string> = {
  'Cinturão de Jacarepaguá': '#f5c542',
  'Jacarezinho e Manguinhos': '#ff6b6b',
  'Pavão-Pavãozinho e Cantagalo': '#00c2a8',
  'PPG': '#00c2a8',
  'Outros': '#3d9fff',
}

const TERR_BUTTONS: { label: string; value: string | null }[] = [
  { label: 'Todos', value: null },
  { label: 'Cinturão de Jacarepaguá', value: 'Cinturão de Jacarepaguá' },
  { label: 'Jacarezinho e Manguinhos', value: 'Jacarezinho e Manguinhos' },
  { label: 'Pavão-Pavãozinho e Cantagalo', value: 'PPG' },
]

const STATUS_COLORS: Record<string, string> = {
  'Em execução': '#2563a8',
  'Concluída': '#22c55e',
  'Concluído': '#22c55e',
  'Bloqueada': '#ef4444',
  'Aguardando Informação': '#f59e0b',
  'Aguardando Aprovação': '#f59e0b',
  'Aguardando Revisão': '#a78bfa',
  'Não iniciado': '#94a3b8',
  'Não Iniciado': '#94a3b8',
  'Suspenso': '#94a3b8',
  'Cancelado': '#ef4444',
}

const PIE_COLORS = ['#0ea5e9','#2563a8','#f59e0b','#22c55e','#a78bfa','#ef4444','#06b6d4','#f97316','#818cf8','#94a3b8']

const TT = {
  backgroundColor: '#ffffff',
  borderColor: '#e2e8f0',
  borderRadius: 8,
  textStyle: { color: TEXT, fontSize: 12, fontFamily: 'Plus Jakarta Sans, sans-serif' },
}

// ── CSV parser (multi-line aware) ─────────────────────────────────────────────
function parseCSV(text: string): Record<string, string>[] {
  const rows: string[][] = []
  let row: string[] = [], cur = '', inQ = false
  const t = text.replace(/^﻿/, '')
  for (let i = 0; i < t.length; i++) {
    const c = t[i]
    if (c === '"') {
      if (inQ && t[i + 1] === '"') { cur += '"'; i++ }
      else inQ = !inQ
    } else if (c === ',' && !inQ) {
      row.push(cur); cur = ''
    } else if ((c === '\n' || c === '\r') && !inQ) {
      if (cur !== '' || row.length) { row.push(cur); rows.push(row); row = []; cur = '' }
      if (c === '\r' && t[i + 1] === '\n') i++
    } else cur += c
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row) }
  if (rows.length < 2) return []
  const headers = rows[0].map(h => h.trim())
  return rows.slice(1)
    .filter(r => r.some(v => v.trim() !== ''))
    .map(r => Object.fromEntries(headers.map((h, i) => [h, (r[i] || '').trim()])))
}

function toNum(v: string): number {
  if (!v) return 0
  const n = parseFloat(v.replace(/\./g, '').replace(',', '.'))
  return isNaN(n) ? 0 : n
}

// ── Types ─────────────────────────────────────────────────────────────────────
type SocialRow = {
  tarefa: string; area: string; regiao: string; responsavel: string
  tipo: string; status: string; media: number; total: number
}
type UrbanismoRow = {
  projeto: string; area: string; demandante: string; territorio: string
  tipologia: string; subtipologia: string; grau: string; status: string
  inicio: string; fim: string; areaProjetada: number
}

// ── useECharts ────────────────────────────────────────────────────────────────
function useECharts(
  ref: React.RefObject<HTMLDivElement | null>,
  getOption: () => object,
  deps: unknown[],
  clickRef?: { current: ((params: any) => void) | undefined }
) {
  useEffect(() => {
    if (!ref.current) return
    const ec = (window as any).echarts
    if (!ec) return
    const chart = ec.init(ref.current, null, { renderer: 'canvas' })
    chart.setOption(getOption())
    if (clickRef) chart.on('click', (p: any) => clickRef.current?.(p))
    const ro = new ResizeObserver(() => chart.resize())
    ro.observe(ref.current)
    return () => { ro.disconnect(); chart.dispose() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

// ── Chart components ──────────────────────────────────────────────────────────
function HBar({ data, colorFn, er, selected, onClickItem }: {
  data: { name: string; value: number }[]
  colorFn?: (n: string, i: number) => string
  er: boolean
  selected?: string | null
  onClickItem?: (name: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const clickRef = useRef<((params: any) => void) | undefined>(undefined)
  useEffect(() => { clickRef.current = onClickItem ? (p: any) => onClickItem(p.name) : undefined })
  useECharts(ref, () => ({
    backgroundColor: 'transparent',
    tooltip: { ...TT, trigger: 'axis' },
    grid: { left: 0, right: 40, top: 4, bottom: 4, containLabel: true },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: MUTED, fontSize: 11, fontFamily: dmMono.style.fontFamily },
    },
    yAxis: {
      type: 'category',
      data: data.map(d => d.name),
      axisLabel: { color: '#64748b', fontSize: 11, fontFamily: plusJakarta.style.fontFamily, width: 160, overflow: 'truncate' },
      axisTick: { show: false },
      axisLine: { show: false },
    },
    series: [{
      type: 'bar',
      cursor: onClickItem ? 'pointer' : 'default',
      data: data.map((d, i) => ({
        value: d.value,
        itemStyle: { color: colorFn ? colorFn(d.name, i) : ACCENT, borderRadius: [0, 4, 4, 0], opacity: selected != null && selected !== d.name ? 0.35 : 1 },
      })),
      label: { show: true, position: 'right', color: MUTED, fontSize: 11, fontFamily: dmMono.style.fontFamily },
    }],
  }), [data, er, selected], onClickItem ? clickRef : undefined)
  return <div ref={ref} style={{ width: '100%', height: '100%' }} />
}

function VBar({ data, er, selected, onClickItem }: { data: { name: string; value: number; color?: string }[]; er: boolean; selected?: string | null; onClickItem?: (name: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const clickRef = useRef<((params: any) => void) | undefined>(undefined)
  useEffect(() => { clickRef.current = onClickItem ? (p: any) => onClickItem(p.name) : undefined })
  useECharts(ref, () => ({
    backgroundColor: 'transparent',
    tooltip: { ...TT, trigger: 'axis' },
    grid: { left: 0, right: 8, top: 8, bottom: 72, containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map(d => d.name),
      axisLabel: { color: MUTED, fontSize: 10, rotate: -30, fontFamily: plusJakarta.style.fontFamily, interval: 0 },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#e2e8f0' } },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: MUTED, fontSize: 11, fontFamily: dmMono.style.fontFamily },
    },
    series: [{
      type: 'bar',
      cursor: onClickItem ? 'pointer' : 'default',
      data: data.map(d => ({
        value: d.value,
        itemStyle: { color: d.color || '#2563a8', borderRadius: [4, 4, 0, 0], opacity: selected != null && selected !== d.name ? 0.35 : 1 },
      })),
    }],
  }), [data, er, selected], onClickItem ? clickRef : undefined)
  return <div ref={ref} style={{ width: '100%', height: '100%' }} />
}

function Donut({ data, er, selected, onClickItem }: { data: { name: string; value: number }[]; er: boolean; selected?: string | null; onClickItem?: (name: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const clickRef = useRef<((params: any) => void) | undefined>(undefined)
  useEffect(() => { clickRef.current = onClickItem ? (p: any) => onClickItem(p.name) : undefined })
  useECharts(ref, () => ({
    backgroundColor: 'transparent',
    tooltip: { ...TT, trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: {
      orient: 'vertical',
      right: 0,
      top: 'center',
      textStyle: { color: '#64748b', fontSize: 10, fontFamily: plusJakarta.style.fontFamily },
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
    },
    series: [{
      type: 'pie',
      radius: ['42%', '68%'],
      center: ['38%', '50%'],
      cursor: onClickItem ? 'pointer' : 'default',
      data: data.map((d, i) => ({
        ...d,
        itemStyle: { color: PIE_COLORS[i % PIE_COLORS.length], borderRadius: 3, borderWidth: 2, borderColor: '#ffffff', opacity: selected != null && selected !== d.name ? 0.35 : 1 },
      })),
      label: { show: false },
    }],
  }), [data, er, selected], onClickItem ? clickRef : undefined)
  return <div ref={ref} style={{ width: '100%', height: '100%' }} />
}

// ── UI atoms ──────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] || '#64748b'
  return (
    <span style={{
      display: 'inline-block', background: `${c}18`, color: c,
      border: `1px solid ${c}40`, fontFamily: dmMono.style.fontFamily,
      fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.06em',
      padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap',
    }}>{status}</span>
  )
}

function KpiCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '20px 24px', flex: 1, minWidth: 150 }}>
      <p style={{ fontFamily: dmMono.style.fontFamily, fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED, marginBottom: 8 }}>{label}</p>
      <p style={{ fontFamily: dmMono.style.fontFamily, fontWeight: 500, fontSize: 'clamp(1.3rem, 3vw, 1.85rem)', color: color || ACCENT, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontFamily: plusJakarta.style.fontFamily, fontSize: '0.68rem', color: MUTED, marginTop: 6 }}>{sub}</p>}
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '20px 24px' }}>
      <p style={{ fontFamily: dmSerif.style.fontFamily, fontSize: '0.95rem', color: TEXT, marginBottom: 16 }}>{title}</p>
      <div style={{ height: 280 }}>{children}</div>
    </div>
  )
}

function Spin() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: 16 }}>
      <style>{`@keyframes _sp{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${BORDER}`, borderTopColor: ACCENT, animation: '_sp 0.8s linear infinite' }} />
      <span style={{ fontFamily: dmMono.style.fontFamily, fontSize: '0.7rem', color: MUTED, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Carregando dados do PCI...</span>
    </div>
  )
}

function Pagination({ page, total, onPage }: { page: number; total: number; onPage: (p: number) => void }) {
  if (total <= 1) return null
  return (
    <div style={{ padding: '12px 20px', borderTop: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
      <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1}
        style={{ padding: '5px 11px', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#f8fafc', fontFamily: plusJakarta.style.fontFamily, fontSize: '0.78rem', cursor: page === 1 ? 'not-allowed' : 'pointer', color: MUTED, opacity: page === 1 ? 0.4 : 1 }}>‹</button>
      <span style={{ fontFamily: dmMono.style.fontFamily, fontSize: '0.7rem', color: MUTED }}>{page} / {total}</span>
      <button onClick={() => onPage(Math.min(total, page + 1))} disabled={page === total}
        style={{ padding: '5px 11px', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#f8fafc', fontFamily: plusJakarta.style.fontFamily, fontSize: '0.78rem', cursor: page === total ? 'not-allowed' : 'pointer', color: MUTED, opacity: page === total ? 0.4 : 1 }}>›</button>
    </div>
  )
}

const FL: React.CSSProperties = { fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED, display: 'block', marginBottom: 4 }
const FS: React.CSSProperties = { fontSize: '0.8rem', padding: '7px 10px', borderRadius: 8, border: `1px solid ${BORDER}`, background: '#ffffff', color: TEXT, minWidth: 160, cursor: 'pointer' }

function Th({ label, col, sortKey, sortDir, onSort }: {
  label: string; col: string; sortKey: string; sortDir: 'asc' | 'desc'
  onSort: (c: string) => void
}) {
  const active = sortKey === col
  return (
    <th onClick={() => onSort(col)} style={{
      padding: '12px 16px', textAlign: 'left',
      fontFamily: dmMono.style.fontFamily, fontSize: '0.55rem',
      textTransform: 'uppercase', letterSpacing: '0.08em',
      color: active ? ACCENT : MUTED, fontWeight: 500,
      whiteSpace: 'nowrap', borderBottom: `1px solid ${BORDER}`,
      cursor: 'pointer', userSelect: 'none',
    }}>
      {label}{active ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
    </th>
  )
}

// ── DashboardSocial ───────────────────────────────────────────────────────────
function DashboardSocial({ data, er, territorioSel, busca }: {
  data: SocialRow[]; er: boolean; territorioSel: string | null; busca: string
}) {
  const [statusFiltro, setStatusFiltro] = useState('Todos')
  const [tipoFiltro, setTipoFiltro] = useState('Todos')
  const [pagina, setPagina] = useState(1)
  const [sortKey, setSortKey] = useState('tarefa')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [crossFilter, setCrossFilter] = useState<{ chartId: string; field: string; value: string } | null>(null)

  const statuses = useMemo(() => ['Todos', ...Array.from(new Set(data.map(d => d.status).filter(Boolean))).sort()], [data])
  const tipos = useMemo(() => ['Todos', ...Array.from(new Set(data.map(d => d.tipo).filter(Boolean))).sort()], [data])

  const filtered = useMemo(() => {
    let rows = data
    if (territorioSel) rows = rows.filter(d => d.regiao === territorioSel)
    if (statusFiltro !== 'Todos') rows = rows.filter(d => d.status === statusFiltro)
    if (tipoFiltro !== 'Todos') rows = rows.filter(d => d.tipo === tipoFiltro)
    if (busca) {
      const q = busca.toLowerCase()
      rows = rows.filter(d => d.tarefa.toLowerCase().includes(q) || d.responsavel.toLowerCase().includes(q))
    }
    return rows
  }, [data, territorioSel, statusFiltro, tipoFiltro, busca])

  const dadosFiltrados = useMemo(() => {
    if (!crossFilter) return filtered
    return filtered.filter(d => (d as any)[crossFilter.field] === crossFilter.value)
  }, [filtered, crossFilter])

  const kpis = useMemo(() => ({
    total: dadosFiltrados.length,
    emExecucao: dadosFiltrados.filter(d => d.status === 'Em execução').length,
    totalAtendidos: dadosFiltrados.reduce((s, d) => s + d.total, 0),
    mediaTotal: dadosFiltrados.reduce((s, d) => s + d.media, 0),
  }), [dadosFiltrados])

  const statusChart = useMemo(() => {
    const src = crossFilter?.chartId === 'social-status' ? filtered : dadosFiltrados
    const m: Record<string, number> = {}
    src.forEach(d => { if (d.status) m[d.status] = (m[d.status] || 0) + 1 })
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [filtered, dadosFiltrados, crossFilter])

  const tipoChart = useMemo(() => {
    const src = crossFilter?.chartId === 'social-tipo' ? filtered : dadosFiltrados
    const m: Record<string, number> = {}
    src.forEach(d => { if (d.tipo) m[d.tipo] = (m[d.tipo] || 0) + 1 })
    return Object.entries(m).map(([name, value]) => ({ name, value }))
  }, [filtered, dadosFiltrados, crossFilter])

  const regiaoChart = useMemo(() => {
    const src = crossFilter?.chartId === 'social-regiao' ? filtered : dadosFiltrados
    const m: Record<string, number> = {}
    src.forEach(d => { if (d.regiao) m[d.regiao] = (m[d.regiao] || 0) + 1 })
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [filtered, dadosFiltrados, crossFilter])

  const top10Chart = useMemo(() => {
    const src = crossFilter?.chartId === 'social-top10' ? filtered : dadosFiltrados
    const m: Record<string, number> = {}
    src.forEach(d => { if (d.tarefa) m[d.tarefa] = (m[d.tarefa] || 0) + d.total })
    return Object.entries(m).map(([name, value]) => ({ name, value }))
      .filter(d => d.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  }, [filtered, dadosFiltrados, crossFilter])

  function handleSort(col: string) {
    if (sortKey === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(col); setSortDir('asc') }
    setPagina(1)
  }

  const sorted = useMemo(() => {
    const dir = sortDir === 'asc' ? 1 : -1
    return [...dadosFiltrados].sort((a, b) => {
      const av = (a as any)[sortKey] ?? ''
      const bv = (b as any)[sortKey] ?? ''
      if (typeof av === 'number') return (av - bv) * dir
      return String(av).localeCompare(String(bv), 'pt-BR') * dir
    })
  }, [dadosFiltrados, sortKey, sortDir])

  const POR_PAGINA = 10
  const totalPaginas = Math.ceil(sorted.length / POR_PAGINA)
  const paginated = sorted.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  function handleCFClick(chartId: string, field: string, name: string) {
    setCrossFilter(prev => prev?.chartId === chartId && prev.value === name ? null : { chartId, field, value: name })
    setPagina(1)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="kpi-row" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <KpiCard label="Total de Ações" value={kpis.total.toLocaleString('pt-BR')} sub="ações mapeadas" />
        <KpiCard label="Em Execução" value={kpis.emExecucao.toLocaleString('pt-BR')} sub="ativas" color="#22c55e" />
        <KpiCard label="Pessoas Atendidas" value={kpis.totalAtendidos.toLocaleString('pt-BR')} sub="total acumulado" />
        <KpiCard label="Média Mensal" value={kpis.mediaTotal.toLocaleString('pt-BR')} sub="atendimentos/mês" color="#a78bfa" />
      </div>

      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '14px 20px', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ ...FL, fontFamily: dmMono.style.fontFamily }}>Status</label>
          <select value={statusFiltro} onChange={e => { setStatusFiltro(e.target.value); setPagina(1) }} style={{ ...FS, fontFamily: plusJakarta.style.fontFamily }}>
            {statuses.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label style={{ ...FL, fontFamily: dmMono.style.fontFamily }}>Tipo</label>
          <select value={tipoFiltro} onChange={e => { setTipoFiltro(e.target.value); setPagina(1) }} style={{ ...FS, fontFamily: plusJakarta.style.fontFamily }}>
            {tipos.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <span style={{ fontFamily: dmMono.style.fontFamily, fontSize: '0.7rem', color: MUTED }}>{dadosFiltrados.length} registros</span>
        {crossFilter && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,194,168,0.12)', border: '1px solid #00c2a8', borderRadius: 20, padding: '4px 14px', fontFamily: dmMono.style.fontFamily, fontSize: '0.65rem', color: '#00c2a8', alignSelf: 'center' }}>
            Filtro do gráfico: {crossFilter.field} = {crossFilter.value}
            <button onClick={() => setCrossFilter(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#00c2a8', padding: '0 0 0 6px', fontSize: '0.9rem', lineHeight: 1, fontFamily: 'inherit' }}>✕</button>
          </div>
        )}
      </div>

      <div className="chart-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        <ChartCard title="Status das Ações">
          <HBar data={statusChart} colorFn={n => STATUS_COLORS[n] || MUTED} er={er}
            selected={crossFilter?.chartId === 'social-status' ? crossFilter.value : null}
            onClickItem={name => handleCFClick('social-status', 'status', name)}
          />
        </ChartCard>
        <ChartCard title="Tipo de Ação">
          <Donut data={tipoChart} er={er}
            selected={crossFilter?.chartId === 'social-tipo' ? crossFilter.value : null}
            onClickItem={name => handleCFClick('social-tipo', 'tipo', name)}
          />
        </ChartCard>
        <ChartCard title="Ações por Território">
          <HBar data={regiaoChart} colorFn={n => TERR_COLORS[n] || ACCENT} er={er}
            selected={crossFilter?.chartId === 'social-regiao' ? crossFilter.value : null}
            onClickItem={name => handleCFClick('social-regiao', 'regiao', name)}
          />
        </ChartCard>
        <ChartCard title="Top 10 Programas por Pessoas Atendidas">
          <HBar data={top10Chart} colorFn={() => ACCENT} er={er}
            selected={crossFilter?.chartId === 'social-top10' ? crossFilter.value : null}
            onClickItem={name => handleCFClick('social-top10', 'tarefa', name)}
          />
        </ChartCard>
      </div>

      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <Th label="Ação" col="tarefa" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <Th label="Território" col="regiao" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <Th label="Área" col="area" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <Th label="Responsável" col="responsavel" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <Th label="Tipo" col="tipo" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <Th label="Status" col="status" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <Th label="Atendidos" col="total" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '32px 16px', textAlign: 'center', fontFamily: plusJakarta.style.fontFamily, fontSize: '0.85rem', color: MUTED }}>Nenhum resultado encontrado.</td></tr>
              ) : paginated.map((d, i) => (
                <tr key={i} style={{ borderBottom: `1px solid #f0f4f8` }}>
                  <td style={{ padding: '11px 16px', fontFamily: plusJakarta.style.fontFamily, fontSize: '0.82rem', color: TEXT, maxWidth: 240 }}>{d.tarefa}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: TERR_COLORS[d.regiao] || MUTED, flexShrink: 0 }} />
                      <span style={{ fontFamily: plusJakarta.style.fontFamily, fontSize: '0.78rem', color: MUTED, whiteSpace: 'nowrap' }}>{d.regiao}</span>
                    </span>
                  </td>
                  <td style={{ padding: '11px 16px', fontFamily: plusJakarta.style.fontFamily, fontSize: '0.78rem', color: MUTED }}>{d.area || '—'}</td>
                  <td style={{ padding: '11px 16px', fontFamily: plusJakarta.style.fontFamily, fontSize: '0.78rem', color: MUTED }}>{d.responsavel}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{ fontFamily: dmMono.style.fontFamily, fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '3px 8px', borderRadius: 4, background: '#f0f4f8', color: '#64748b' }}>{d.tipo}</span>
                  </td>
                  <td style={{ padding: '11px 16px' }}><StatusBadge status={d.status} /></td>
                  <td style={{ padding: '11px 16px', fontFamily: dmMono.style.fontFamily, fontSize: '0.78rem', color: TEXT, textAlign: 'right' }}>{d.total > 0 ? d.total.toLocaleString('pt-BR') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={pagina} total={totalPaginas} onPage={p => setPagina(p)} />
      </div>
    </div>
  )
}

// ── DashboardUrbanismo ────────────────────────────────────────────────────────
function DashboardUrbanismo({ data, er, territorioSel, busca }: {
  data: UrbanismoRow[]; er: boolean; territorioSel: string | null; busca: string
}) {
  const [statusFiltro, setStatusFiltro] = useState('Todos')
  const [tipologiaFiltro, setTipologiaFiltro] = useState('Todos')
  const [pagina, setPagina] = useState(1)
  const [sortKey, setSortKey] = useState('projeto')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [crossFilter, setCrossFilter] = useState<{ chartId: string; field: string; value: string } | null>(null)

  const statuses = useMemo(() => ['Todos', ...Array.from(new Set(data.map(d => d.status).filter(Boolean))).sort()], [data])
  const tipologias = useMemo(() => ['Todos', ...Array.from(new Set(data.map(d => d.tipologia).filter(Boolean))).sort()], [data])

  const filtered = useMemo(() => {
    let rows = data
    if (territorioSel) rows = rows.filter(d => d.territorio === territorioSel)
    if (statusFiltro !== 'Todos') rows = rows.filter(d => d.status === statusFiltro)
    if (tipologiaFiltro !== 'Todos') rows = rows.filter(d => d.tipologia === tipologiaFiltro)
    if (busca) {
      const q = busca.toLowerCase()
      rows = rows.filter(d => d.projeto.toLowerCase().includes(q) || d.demandante.toLowerCase().includes(q))
    }
    return rows
  }, [data, territorioSel, statusFiltro, tipologiaFiltro, busca])

  const dadosFiltrados = useMemo(() => {
    if (!crossFilter) return filtered
    return filtered.filter(d => (d as any)[crossFilter.field] === crossFilter.value)
  }, [filtered, crossFilter])

  const kpis = useMemo(() => ({
    total: dadosFiltrados.length,
    concluidos: dadosFiltrados.filter(d => d.status === 'Concluído').length,
    emExecucao: dadosFiltrados.filter(d => d.status === 'Em execução').length,
    areaProjetada: dadosFiltrados.reduce((s, d) => s + d.areaProjetada, 0),
  }), [dadosFiltrados])

  const statusChart = useMemo(() => {
    const src = crossFilter?.chartId === 'urb-status' ? filtered : dadosFiltrados
    const m: Record<string, number> = {}
    src.forEach(d => { if (d.status) m[d.status] = (m[d.status] || 0) + 1 })
    return Object.entries(m).map(([name, value]) => ({ name, value, color: STATUS_COLORS[name] || MUTED })).sort((a, b) => b.value - a.value)
  }, [filtered, dadosFiltrados, crossFilter])

  const tipologiaChart = useMemo(() => {
    const src = crossFilter?.chartId === 'urb-tipologia' ? filtered : dadosFiltrados
    const m: Record<string, number> = {}
    src.forEach(d => { if (d.tipologia) m[d.tipologia] = (m[d.tipologia] || 0) + 1 })
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [filtered, dadosFiltrados, crossFilter])

  const grauChart = useMemo(() => {
    const src = crossFilter?.chartId === 'urb-grau' ? filtered : dadosFiltrados
    const m: Record<string, number> = {}
    src.forEach(d => { if (d.grau) m[d.grau] = (m[d.grau] || 0) + 1 })
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [filtered, dadosFiltrados, crossFilter])

  const subtipoChart = useMemo(() => {
    const src = crossFilter?.chartId === 'urb-subtipo' ? filtered : dadosFiltrados
    const m: Record<string, number> = {}
    src.forEach(d => { if (d.subtipologia) m[d.subtipologia] = (m[d.subtipologia] || 0) + 1 })
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8)
  }, [filtered, dadosFiltrados, crossFilter])

  function handleSort(col: string) {
    if (sortKey === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(col); setSortDir('asc') }
    setPagina(1)
  }

  const sorted = useMemo(() => {
    const dir = sortDir === 'asc' ? 1 : -1
    return [...dadosFiltrados].sort((a, b) => {
      const av = (a as any)[sortKey] ?? ''
      const bv = (b as any)[sortKey] ?? ''
      if (typeof av === 'number') return (av - bv) * dir
      return String(av).localeCompare(String(bv), 'pt-BR') * dir
    })
  }, [dadosFiltrados, sortKey, sortDir])

  const POR_PAGINA = 10
  const totalPaginas = Math.ceil(sorted.length / POR_PAGINA)
  const paginated = sorted.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  function handleCFClick(chartId: string, field: string, name: string) {
    setCrossFilter(prev => prev?.chartId === chartId && prev.value === name ? null : { chartId, field, value: name })
    setPagina(1)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="kpi-row" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <KpiCard label="Total de Projetos" value={kpis.total.toLocaleString('pt-BR')} sub="intervenções registradas" />
        <KpiCard label="Concluídos" value={kpis.concluidos.toLocaleString('pt-BR')} sub="entregues" color="#22c55e" />
        <KpiCard label="Em Execução" value={kpis.emExecucao.toLocaleString('pt-BR')} sub="obras ativas" />
        <KpiCard label="Área Projetada" value={`${kpis.areaProjetada.toLocaleString('pt-BR')} m²`} sub="total projetado" color="#a78bfa" />
      </div>

      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '14px 20px', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ ...FL, fontFamily: dmMono.style.fontFamily }}>Status</label>
          <select value={statusFiltro} onChange={e => { setStatusFiltro(e.target.value); setPagina(1) }} style={{ ...FS, fontFamily: plusJakarta.style.fontFamily }}>
            {statuses.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label style={{ ...FL, fontFamily: dmMono.style.fontFamily }}>Tipologia</label>
          <select value={tipologiaFiltro} onChange={e => { setTipologiaFiltro(e.target.value); setPagina(1) }} style={{ ...FS, fontFamily: plusJakarta.style.fontFamily }}>
            {tipologias.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <span style={{ fontFamily: dmMono.style.fontFamily, fontSize: '0.7rem', color: MUTED }}>{dadosFiltrados.length} registros</span>
        {crossFilter && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,194,168,0.12)', border: '1px solid #00c2a8', borderRadius: 20, padding: '4px 14px', fontFamily: dmMono.style.fontFamily, fontSize: '0.65rem', color: '#00c2a8', alignSelf: 'center' }}>
            Filtro do gráfico: {crossFilter.field} = {crossFilter.value}
            <button onClick={() => setCrossFilter(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#00c2a8', padding: '0 0 0 6px', fontSize: '0.9rem', lineHeight: 1, fontFamily: 'inherit' }}>✕</button>
          </div>
        )}
      </div>

      <div className="chart-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        <ChartCard title="Status dos Projetos">
          <VBar data={statusChart} er={er}
            selected={crossFilter?.chartId === 'urb-status' ? crossFilter.value : null}
            onClickItem={name => handleCFClick('urb-status', 'status', name)}
          />
        </ChartCard>
        <ChartCard title="Tipologia">
          <Donut data={tipologiaChart} er={er}
            selected={crossFilter?.chartId === 'urb-tipologia' ? crossFilter.value : null}
            onClickItem={name => handleCFClick('urb-tipologia', 'tipologia', name)}
          />
        </ChartCard>
        <ChartCard title="Grau de Intervenção">
          <HBar data={grauChart} er={er}
            selected={crossFilter?.chartId === 'urb-grau' ? crossFilter.value : null}
            onClickItem={name => handleCFClick('urb-grau', 'grau', name)}
          />
        </ChartCard>
        <ChartCard title="Top 8 Subtipologias">
          <HBar data={subtipoChart} colorFn={() => ACCENT} er={er}
            selected={crossFilter?.chartId === 'urb-subtipo' ? crossFilter.value : null}
            onClickItem={name => handleCFClick('urb-subtipo', 'subtipologia', name)}
          />
        </ChartCard>
      </div>

      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <Th label="Projeto" col="projeto" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <Th label="Território" col="territorio" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <Th label="Área" col="area" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <Th label="Demandante" col="demandante" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <Th label="Tipologia" col="tipologia" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <Th label="Status" col="status" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <Th label="Início" col="inicio" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <Th label="Fim" col="fim" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '32px 16px', textAlign: 'center', fontFamily: plusJakarta.style.fontFamily, fontSize: '0.85rem', color: MUTED }}>Nenhum resultado encontrado.</td></tr>
              ) : paginated.map((d, i) => (
                <tr key={i} style={{ borderBottom: `1px solid #f0f4f8` }}>
                  <td style={{ padding: '11px 16px', fontFamily: plusJakarta.style.fontFamily, fontSize: '0.82rem', color: TEXT, maxWidth: 240 }}>{d.projeto}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: TERR_COLORS[d.territorio] || MUTED, flexShrink: 0 }} />
                      <span style={{ fontFamily: plusJakarta.style.fontFamily, fontSize: '0.78rem', color: MUTED, whiteSpace: 'nowrap' }}>{d.territorio}</span>
                    </span>
                  </td>
                  <td style={{ padding: '11px 16px', fontFamily: plusJakarta.style.fontFamily, fontSize: '0.78rem', color: MUTED }}>{d.area || '—'}</td>
                  <td style={{ padding: '11px 16px', fontFamily: plusJakarta.style.fontFamily, fontSize: '0.78rem', color: MUTED }}>{d.demandante}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{ fontFamily: dmMono.style.fontFamily, fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '3px 8px', borderRadius: 4, background: '#f0f4f8', color: '#64748b' }}>{d.tipologia}</span>
                  </td>
                  <td style={{ padding: '11px 16px' }}><StatusBadge status={d.status} /></td>
                  <td style={{ padding: '11px 16px', fontFamily: dmMono.style.fontFamily, fontSize: '0.75rem', color: MUTED }}>{d.inicio}</td>
                  <td style={{ padding: '11px 16px', fontFamily: dmMono.style.fontFamily, fontSize: '0.75rem', color: MUTED }}>{d.fim}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={pagina} total={totalPaginas} onPage={p => setPagina(p)} />
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [aba, setAba] = useState<'social' | 'urbanismo'>('social')
  const [socialData, setSocialData] = useState<SocialRow[]>([])
  const [urbanismoData, setUrbanismoData] = useState<UrbanismoRow[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(false)
  const [er, setEr] = useState(false)
  const [territorioSel, setTerritorioSel] = useState<string | null>(null)
  const [busca, setBusca] = useState('')

  useEffect(() => {
    Promise.all([
      fetch(SOCIAL_URL, { cache: 'no-store' }).then(r => r.text()),
      fetch(URBANISMO_URL, { cache: 'no-store' }).then(r => r.text()),
    ]).then(([socialText, urbText]) => {
      setSocialData(
        parseCSV(socialText)
          .filter(r => r['Tarefa'])
          .map(r => ({
            tarefa: r['Tarefa'],
            area: r['area_rotulo'] || '',
            regiao: r['territorio_rotulo'] || 'Outros',
            responsavel: r['Responsável - Sec. / Órgão'] || '',
            tipo: r['Tipo'] || '',
            status: r['Status'] || '',
            media: toNum(r['Média Atendidos (Mensal)']),
            total: toNum(r['Qtd. Total']),
          }))
      )
      setUrbanismoData(
        parseCSV(urbText)
          .filter(r => r['Projeto'])
          .map(r => ({
            projeto: r['Projeto'],
            area: r['area_rotulo'] || '',
            demandante: r['Demandante'] || '',
            territorio: r['territorio_rotulo'] || 'Outros',
            tipologia: r['Tipologia'] || '',
            subtipologia: r['Subtipologia'] || '',
            grau: r['Grau de Intervenção/Projeto'] || '',
            status: r['Status'] || '',
            inicio: r['Data de início'] || '',
            fim: r['Data Final'] || '',
            areaProjetada: toNum(r['Área Projetada (m2)']),
          }))
      )
    }).catch(() => setErro(true)).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ background: BG, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin />
      </div>
    )
  }

  if (erro) {
    return (
      <div style={{ background: BG, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '40px 48px', textAlign: 'center', maxWidth: 480 }}>
          <p style={{ fontFamily: dmSerif.style.fontFamily, fontSize: '1.3rem', color: TEXT, marginBottom: 10 }}>Não foi possível carregar os dados.</p>
          <p style={{ fontFamily: plusJakarta.style.fontFamily, fontSize: '0.85rem', color: MUTED, marginBottom: 24 }}>Tente recarregar a página.</p>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 24px', background: ACCENT, color: BG, border: 'none', borderRadius: 8, fontFamily: plusJakarta.style.fontFamily, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
            Recarregar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        select option { background: white; color: #1a2a5e; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 3px; }
        @media (max-width: 767px) {
          .kpi-row { display: grid !important; grid-template-columns: 1fr 1fr !important; }
          .chart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/echarts/5.4.3/echarts.min.js"
        strategy="afterInteractive"
        onLoad={() => setEr(true)}
      />

      {/* Header */}
      <header style={{ borderBottom: `1px solid ${BORDER}`, padding: '24px 32px 20px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: dmSerif.style.fontFamily, fontSize: 'clamp(1.3rem, 3vw, 1.9rem)', color: TEXT, fontWeight: 400, margin: 0, marginBottom: 4 }}>
              Painel de Monitoramento — PCI
            </h1>
            <p style={{ fontFamily: plusJakarta.style.fontFamily, fontSize: '0.82rem', color: MUTED, margin: 0 }}>
              Programa Cidade Integrada · Governo do Estado do Rio de Janeiro
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: dmMono.style.fontFamily, fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.1em', background: `${ACCENT}18`, color: ACCENT, border: `1px solid ${ACCENT}38`, padding: '4px 10px', borderRadius: 4 }}>
              ADPF 635 · STF
            </span>
            <span style={{ fontFamily: dmMono.style.fontFamily, fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED }}>
              Última atualização: 15 de maio de 2026
            </span>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%', padding: '0 32px', boxSizing: 'border-box', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Territory filter buttons */}
        <div style={{ padding: '20px 0 4px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {TERR_BUTTONS.map(btn => {
            const active = territorioSel === btn.value
            const color = btn.value ? TERR_COLORS[btn.value] || ACCENT : ACCENT
            return (
              <button key={btn.label} onClick={() => setTerritorioSel(btn.value)} style={{
                fontFamily: plusJakarta.style.fontFamily, fontWeight: active ? 600 : 400,
                fontSize: '0.8rem', padding: '7px 16px', borderRadius: 20,
                border: `1px solid ${active ? color : BORDER}`,
                background: active ? `${color}1a` : 'transparent',
                color: active ? color : MUTED,
                cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}>{btn.label}</button>
            )
          })}
        </div>

        {/* Search */}
        <div style={{ padding: '12px 0 0' }}>
          <input
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por ação, projeto, responsável..."
            style={{
              width: '100%', boxSizing: 'border-box',
              fontFamily: plusJakarta.style.fontFamily, fontSize: '0.85rem',
              padding: '10px 16px', borderRadius: 8,
              border: `1px solid ${BORDER}`, background: '#ffffff',
              color: TEXT, outline: 'none',
            }}
          />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, marginTop: 20 }}>
          {(['social', 'urbanismo'] as const).map(tab => (
            <button key={tab} onClick={() => setAba(tab)} style={{
              fontFamily: plusJakarta.style.fontFamily, fontWeight: aba === tab ? 600 : 400,
              fontSize: '0.9rem', padding: '11px 24px',
              background: aba === tab ? 'rgba(0,0,0,0.04)' : 'none',
              border: 'none', cursor: 'pointer',
              color: aba === tab ? TEXT : MUTED,
              borderBottom: aba === tab ? `2px solid ${ACCENT}` : '2px solid transparent',
              marginBottom: -1, transition: 'all 0.15s',
            }}>
              {tab === 'social' ? 'Social' : 'Urbanismo'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '28px 0 48px' }}>
          {aba === 'social'
            ? <DashboardSocial data={socialData} er={er} territorioSel={territorioSel} busca={busca} />
            : <DashboardUrbanismo data={urbanismoData} er={er} territorioSel={territorioSel} busca={busca} />
          }
        </div>
      </div>

      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: '12px 32px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontFamily: dmMono.style.fontFamily, fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(100,116,139,0.6)' }}>
          Programa Cidade Integrada · Governo do Estado do Rio de Janeiro
        </span>
        <span style={{ fontFamily: dmMono.style.fontFamily, fontSize: '0.55rem', color: 'rgba(100,116,139,0.5)' }}>
          Google Sheets · Tempo real
        </span>
      </footer>
    </div>
  )
}

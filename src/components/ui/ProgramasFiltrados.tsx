'use client'
import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Programa {
  id: number
  titulo: string
  descricao: string
  area_tematica: string
  territorio: string
  beneficiarios: number | null
  unidade_beneficiarios: string | null
  periodo: string
  status: string
}

interface Props {
  programas: Programa[]
}

const CORES_AREA: Record<string, string> = {
  'Saúde':               '#16a34a',
  'Cultura':             '#9333ea',
  'Esporte':             '#0891b2',
  'Educação / Juventude':'#1a56a0',
  'Trabalho e Renda':    '#d97706',
  'Gênero':              '#ec4899',
  'Gênero / Segurança':  '#db2777',
  'Serviços Públicos':   '#4f46e5',
  'Meio Ambiente':       '#65a30d',
  'Segurança Alimentar': '#f97316',
  'Arte / Saúde Mental': '#7c3aed',
  'Cultura / Arte':      '#a855f7',
  'Esporte / Educação':  '#0284c7',
  'default':             '#1a56a0',
}

function corArea(area: string): string {
  return CORES_AREA[area] || CORES_AREA['default']
}

export default function ProgramasFiltrados({ programas }: Props) {
  const [areaFiltro, setAreaFiltro]         = useState('Todas')
  const [territorioFiltro, setTerritorioFiltro] = useState('Todos')
  const [statusFiltro, setStatusFiltro]     = useState('Todos')
  const [busca, setBusca]                   = useState('')
  const [verGrafico, setVerGrafico]         = useState(false)

  const areas = useMemo(() => ['Todas', ...Array.from(new Set(programas.map(p => p.area_tematica))).sort()], [programas])
  const territorios = useMemo(() => {
    const ts = new Set<string>()
    programas.forEach(p => {
      p.territorio?.split(' / ').forEach(t => ts.add(t.trim()))
    })
    return ['Todos', ...Array.from(ts).sort()]
  }, [programas])

  const filtrados = useMemo(() => programas.filter(p => {
    if (areaFiltro !== 'Todas' && p.area_tematica !== areaFiltro) return false
    if (territorioFiltro !== 'Todos' && !p.territorio?.includes(territorioFiltro)) return false
    if (statusFiltro !== 'Todos' && p.status !== statusFiltro) return false
    if (busca && !p.titulo.toLowerCase().includes(busca.toLowerCase()) && !p.descricao?.toLowerCase().includes(busca.toLowerCase())) return false
    return true
  }), [programas, areaFiltro, territorioFiltro, statusFiltro, busca])

  const totalBeneficiarios = filtrados.reduce((acc, p) => acc + (p.beneficiarios || 0), 0)

  // Top 10 por beneficiários para o gráfico
  const dadosGrafico = filtrados
    .filter(p => p.beneficiarios && p.beneficiarios > 0)
    .sort((a, b) => (b.beneficiarios || 0) - (a.beneficiarios || 0))
    .slice(0, 10)
    .map(p => ({
      nome: p.titulo.length > 30 ? p.titulo.substring(0, 30) + '...' : p.titulo,
      nomeCompleto: p.titulo,
      valor: p.beneficiarios || 0,
      area: p.area_tematica,
    }))

  return (
    <div>
      {/* Sumário */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Programas encontrados', valor: filtrados.length },
          { label: 'Total de beneficiários', valor: totalBeneficiarios > 0 ? totalBeneficiarios.toLocaleString('pt-BR') : '—' },
          { label: 'Programas ativos', valor: filtrados.filter(p => p.status === 'Ativo').length },
          { label: 'Áreas temáticas', valor: new Set(filtrados.map(p => p.area_tematica)).size },
        ].map(s => (
          <div key={s.label} className="gov-card p-4 text-center">
            <p className="font-display text-2xl font-bold" style={{ color: 'var(--gov-accent)' }}>{s.valor}</p>
            <p className="font-mono text-xs mt-1" style={{ color: 'var(--gov-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="gov-card p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Busca */}
          <div>
            <label className="font-mono text-xs uppercase tracking-widest mb-2 block" style={{ color: 'var(--gov-muted)' }}>Buscar</label>
            <input
              type="text"
              placeholder="Nome do programa..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md border outline-none transition-colors"
              style={{
                background: 'var(--gov-bg)',
                borderColor: 'var(--gov-border)',
                color: 'var(--gov-text)',
              }}
            />
          </div>
          {/* Área */}
          <div>
            <label className="font-mono text-xs uppercase tracking-widest mb-2 block" style={{ color: 'var(--gov-muted)' }}>Área Temática</label>
            <select
              value={areaFiltro}
              onChange={e => setAreaFiltro(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md border outline-none"
              style={{ background: 'var(--gov-bg)', borderColor: 'var(--gov-border)', color: 'var(--gov-text)' }}
            >
              {areas.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          {/* Território */}
          <div>
            <label className="font-mono text-xs uppercase tracking-widest mb-2 block" style={{ color: 'var(--gov-muted)' }}>Território</label>
            <select
              value={territorioFiltro}
              onChange={e => setTerritorioFiltro(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md border outline-none"
              style={{ background: 'var(--gov-bg)', borderColor: 'var(--gov-border)', color: 'var(--gov-text)' }}
            >
              {territorios.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          {/* Status */}
          <div>
            <label className="font-mono text-xs uppercase tracking-widest mb-2 block" style={{ color: 'var(--gov-muted)' }}>Status</label>
            <select
              value={statusFiltro}
              onChange={e => setStatusFiltro(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md border outline-none"
              style={{ background: 'var(--gov-bg)', borderColor: 'var(--gov-border)', color: 'var(--gov-text)' }}
            >
              <option>Todos</option>
              <option>Ativo</option>
              <option>Encerrado</option>
            </select>
          </div>
        </div>

        {/* Reset + toggle gráfico */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => { setAreaFiltro('Todas'); setTerritorioFiltro('Todos'); setStatusFiltro('Todos'); setBusca('') }}
            className="font-mono text-xs hover:underline"
            style={{ color: 'var(--gov-muted)' }}
          >
            Limpar filtros
          </button>
          <button
            onClick={() => setVerGrafico(!verGrafico)}
            className="font-mono text-xs px-3 py-1.5 rounded-md border transition-colors"
            style={{
              borderColor: verGrafico ? 'var(--gov-accent)' : 'var(--gov-border)',
              color: verGrafico ? 'var(--gov-accent)' : 'var(--gov-muted)',
              background: verGrafico ? 'var(--gov-light)' : 'transparent',
            }}
          >
            {verGrafico ? '▼ Ocultar gráfico' : '▲ Ver gráfico de beneficiários'}
          </button>
        </div>
      </div>

      {/* Gráfico */}
      {verGrafico && dadosGrafico.length > 0 && (
        <div className="gov-card p-6 mb-8">
          <h3 className="font-display text-lg font-bold mb-1" style={{ color: 'var(--gov-text)' }}>
            Top {dadosGrafico.length} programas por beneficiários
          </h3>
          <p className="font-mono text-xs mb-6" style={{ color: 'var(--gov-muted)' }}>
            Filtro atual · PCI 2025
          </p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={dadosGrafico} layout="vertical" margin={{ left: 20, right: 30, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dce3ef" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fontFamily: 'Source Code Pro', fill: '#6b7fa3' }}
                tickFormatter={v => v.toLocaleString('pt-BR')}
              />
              <YAxis
                type="category"
                dataKey="nome"
                width={200}
                tick={{ fontSize: 10, fontFamily: 'Source Code Pro', fill: '#4a5880' }}
              />
              <Tooltip
                formatter={(value: any, _: string, props: any) => [
                  value.toLocaleString('pt-BR') + ' beneficiários',
                  props.payload?.nomeCompleto || ''
                ]}
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #dce3ef',
                  borderRadius: '8px',
                  fontFamily: 'Source Code Pro',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="valor" radius={[0, 4, 4, 0]}>
                {dadosGrafico.map((entry, i) => (
                  <Cell key={i} fill={corArea(entry.area)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Cards */}
      {filtrados.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--gov-muted)' }}>
          <p className="font-display text-xl mb-2">Nenhum programa encontrado</p>
          <p className="font-mono text-sm">Tente ajustar os filtros acima</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtrados.map(p => (
            <div key={p.id} className="gov-card p-5 flex flex-col gap-3">

              {/* Header do card */}
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <span
                  className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded"
                  style={{
                    background: corArea(p.area_tematica) + '18',
                    color: corArea(p.area_tematica),
                    border: `1px solid ${corArea(p.area_tematica)}40`,
                  }}
                >
                  {p.area_tematica}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs" style={{ color: 'var(--gov-muted)' }}>{p.periodo}</span>
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
                    p.status === 'Ativo'
                      ? 'text-green-700 bg-green-50 border-green-200'
                      : 'text-gray-500 bg-gray-50 border-gray-200'
                  }`}>
                    {p.status}
                  </span>
                </div>
              </div>

              {/* Título */}
              <h3 className="font-body font-semibold leading-snug" style={{ color: 'var(--gov-text)' }}>
                {p.titulo}
              </h3>

              {/* Descrição */}
              <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--gov-textDim)' }}>
                {p.descricao}
              </p>

              {/* Beneficiários em destaque */}
              {p.beneficiarios && (
                <div className="pt-3 border-t flex items-end gap-2" style={{ borderColor: 'var(--gov-border)' }}>
                  <span
                    className="font-display font-bold text-2xl leading-none"
                    style={{ color: corArea(p.area_tematica) }}
                  >
                    {p.beneficiarios.toLocaleString('pt-BR')}
                  </span>
                  <span className="font-mono text-xs mb-0.5" style={{ color: 'var(--gov-muted)' }}>
                    {p.unidade_beneficiarios}
                  </span>
                </div>
              )}

              {/* Território */}
              {p.territorio && (
                <p className="font-mono text-xs" style={{ color: 'var(--gov-muted)' }}>
                  📍 {p.territorio}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

'use client'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Programa {
  id: number
  titulo: string
  descricao: string
  eixo: string
  tipo: string
  territorio: { id: number; nome: string; slug: string } | null
  beneficiarios: number | null
  unidade_beneficiarios: string | null
  periodo: string
  status: string
}

interface Props {
  programas: Programa[]
}

const CORES_EIXO: Record<string, string> = {
  'Social':        '#2563a8',
  'Econômico':     '#d97706',
  'Infraestrutura':'#0891b2',
  'Segurança':     '#dc2626',
  'Transparência': '#7c3aed',
  'Diálogo':       '#16a34a',
  'default':       '#2563a8',
}

function corEixo(eixo: string) {
  return CORES_EIXO[eixo] || CORES_EIXO['default']
}

const TERR_OPCOES_PROGRAMAS = [
  '',
  'Corredor Itanhangá / Rio das Pedras',
  'Jacarezinho e Manguinhos',
  'PPG',
  'Outros',
]

const TERR_MATCH: Record<string, string[]> = {
  'Corredor Itanhangá / Rio das Pedras': ['Corredor do Itanhangá', 'Corredor Itanhangá', 'Rio das Pedras'],
  'Jacarezinho e Manguinhos':            ['Manguinhos e Jacarezinho', 'Jacarezinho e Manguinhos'],
  'PPG':                                 ['Pavão-Pavãozinho e Cantagalo', 'PPG'],
  'Outros':                              ['Outros'],
}

const SLUGS_PROGRAMAS: Record<string, string> = {
  'Desenvolve Mulher (2022)':      '/programas/corredor-itanhanga/desenvolve-mulher-2022',
  'Reabilita 60+ — Educação Física':'/programas/corredor-itanhanga/reabilita-60',
  'Reabilita 60+ — Fisioterapia':   '/programas/corredor-itanhanga/reabilita-60',
}


function matchTerritorio(p: Programa, filtro: string): boolean {
  if (!filtro) return true
  const terr = p.territorio?.nome || ''
  const matches = TERR_MATCH[filtro] || [filtro]
  return matches.some(m => terr.includes(m))
}

export default function ProgramasFiltrados({ programas }: Props) {
  const [busca, setBusca]               = useState('')
  const [eixoFiltro, setEixoFiltro]     = useState('')
  const [terrFiltro, setTerrFiltro]     = useState('')
  const [statusFiltro, setStatusFiltro] = useState('')
  const [verGrafico, setVerGrafico]     = useState(false)

  const eixos = useMemo(() =>
    ['', ...Array.from(new Set(programas.map(p => p.eixo || 'Social'))).sort()],
    [programas]
  )

  const filtrados = useMemo(() => programas.filter(p => {
    const eixo = p.eixo || 'Social'
    if (eixoFiltro && eixo !== eixoFiltro) return false
    if (terrFiltro && !matchTerritorio(p, terrFiltro)) return false
    if (statusFiltro && p.status !== statusFiltro) return false
    if (busca) {
      const q = busca.toLowerCase()
      if (!p.titulo?.toLowerCase().includes(q) && !p.descricao?.toLowerCase().includes(q)) return false
    }
    return true
  }), [programas, eixoFiltro, terrFiltro, statusFiltro, busca])

  const totalBenef = filtrados.reduce((acc, p) => acc + (p.beneficiarios || 0), 0)

  const dadosGrafico = filtrados
    .filter(p => (p.beneficiarios || 0) > 0)
    .sort((a, b) => (b.beneficiarios || 0) - (a.beneficiarios || 0))
    .slice(0, 8)
    .map(p => ({
      nome: p.titulo.length > 28 ? p.titulo.substring(0, 28) + '…' : p.titulo,
      nomeCompleto: p.titulo,
      valor: p.beneficiarios || 0,
      eixo: p.eixo || 'Social',
    }))

  const selectStyle = {
    width: '100%', padding: '8px 12px', fontSize: '0.85rem',
    border: '1px solid var(--pci-border)', borderRadius: 6, outline: 'none',
    fontFamily: 'Plus Jakarta Sans', background: 'var(--pci-bg)', color: 'var(--pci-text)',
  }

  return (
    <div>
      {/* Sumário */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Programas',      valor: filtrados.length },
          { label: 'Em execução',    valor: filtrados.filter(p => p.status === 'Em execução').length },
          { label: 'Concluídos',     valor: filtrados.filter(p => p.status === 'Concluída').length },
          { label: 'Beneficiários',  valor: totalBenef > 1000 ? (totalBenef/1000).toFixed(1)+'mil' : String(totalBenef || '—') },
        ].map((s, i) => (
          <div key={i} className="pci-card p-4 text-center">
            <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '1.6rem', color: 'var(--pci-navy)' }}>{s.valor}</p>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="pci-card p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pci-muted)', display: 'block', marginBottom: 6 }}>Buscar</label>
            <input type="text" placeholder="Nome do programa..." value={busca} onChange={e => setBusca(e.target.value)} style={selectStyle} />
          </div>
          <div>
            <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pci-muted)', display: 'block', marginBottom: 6 }}>Eixo</label>
            <select value={eixoFiltro} onChange={e => setEixoFiltro(e.target.value)} style={selectStyle}>
              <option value="">Todos</option>
              {eixos.filter(e => e).map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pci-muted)', display: 'block', marginBottom: 6 }}>Território</label>
            <select value={terrFiltro} onChange={e => setTerrFiltro(e.target.value)} style={selectStyle}>
              {TERR_OPCOES_PROGRAMAS.map(t => <option key={t} value={t}>{t || 'Todos'}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pci-muted)', display: 'block', marginBottom: 6 }}>Status</label>
            <select value={statusFiltro} onChange={e => setStatusFiltro(e.target.value)} style={selectStyle}>
              <option value="">Todos</option>
              <option>Em execução</option>
              <option>Concluída</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => { setBusca(''); setEixoFiltro(''); setTerrFiltro(''); setStatusFiltro('') }}
            style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-muted)', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Limpar filtros
          </button>
          {dadosGrafico.length > 0 && (
            <button onClick={() => setVerGrafico(!verGrafico)}
              style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', padding: '6px 12px', borderRadius: 6, border: `1px solid ${verGrafico ? 'var(--pci-blue)' : 'var(--pci-border)'}`, color: verGrafico ? 'var(--pci-blue)' : 'var(--pci-muted)', background: verGrafico ? 'var(--pci-light)' : 'transparent', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {verGrafico ? '▼ Ocultar gráfico' : '▲ Ver gráfico'}
            </button>
          )}
        </div>
      </div>

      {/* Gráfico */}
      {verGrafico && dadosGrafico.length > 0 && (
        <div className="pci-card p-6 mb-8">
          <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.95rem', color: 'var(--pci-navy)', marginBottom: 20 }}>Beneficiários por Programa</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dadosGrafico} layout="vertical" margin={{ left: 16, right: 24, top: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d4dff0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#8fa3c8' }} tickFormatter={v => v.toLocaleString('pt-BR')} />
              <YAxis type="category" dataKey="nome" width={190} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#4a5f8a' }} />
              <Tooltip formatter={(v: any, _: any, p: any) => [v.toLocaleString('pt-BR') + ' beneficiários', p.payload?.nomeCompleto]}
                contentStyle={{ fontFamily: 'JetBrains Mono', fontSize: 11, borderRadius: 8, border: '1px solid var(--pci-border)' }} />
              <Bar dataKey="valor" radius={[0, 4, 4, 0]}>
                {dadosGrafico.map((e, i) => <Cell key={i} fill={corEixo(e.eixo)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Cards */}
      {filtrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--pci-muted)' }}>
          <p style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>Nenhum programa encontrado</p>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ajuste os filtros acima</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtrados.map(p => {
            const eixo = p.eixo || 'Social'
            const cor  = corEixo(eixo)
            const slug = SLUGS_PROGRAMAS[p.titulo]
            return (
              <div key={p.id} className="pci-card flex flex-col" style={{ borderTop: `3px solid ${cor}`, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--pci-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 4, background: cor + '18', color: cor, border: `1px solid ${cor}40` }}>
                      {eixo}
                    </span>
                    <span className={`badge ${p.status === 'Em execução' ? 'badge-green' : p.status === 'Concluída' ? 'badge-blue' : 'badge-gray'}`}>
                      {p.status}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.9rem', color: 'var(--pci-text)', lineHeight: 1.35 }}>{p.titulo}</h3>
                </div>

                <div style={{ padding: '12px 20px', flex: 1 }}>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: 'var(--pci-dim)', lineHeight: 1.6 }}>
                    {p.descricao?.substring(0, 110)}{(p.descricao?.length || 0) > 110 ? '…' : ''}
                  </p>
                </div>

                <div style={{ padding: '10px 20px 16px', borderTop: '1px solid var(--pci-border)' }}>
                  {p.beneficiarios ? (
                    <div style={{ marginBottom: 8 }}>
                      <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '1.4rem', color: cor, lineHeight: 1 }}>
                        {p.beneficiarios.toLocaleString('pt-BR')}
                      </p>
                      <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', color: 'var(--pci-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>
                        {p.unidade_beneficiarios}
                      </p>
                    </div>
                  ) : null}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {p.territorio?.nome ? (
                      <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', color: 'var(--pci-muted)' }}>
                        📍 {p.territorio.nome}
                      </p>
                    ) : null}
                    {slug && (
                      <Link href={slug} style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', color: 'var(--pci-blue)', textTransform: 'uppercase', letterSpacing: '0.06em', textDecoration: 'underline', whiteSpace: 'nowrap' }}>
                        Ver detalhes →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

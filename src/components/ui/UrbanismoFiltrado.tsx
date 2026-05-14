'use client'
import { useState, useMemo } from 'react'

interface Props {
  urbanismo: any[]
}

const TERR_OPCOES_URBANISMO = [
  'Todos',
  'Corredor Itanhangá / Rio das Pedras',
  'Jacarezinho e Manguinhos',
  'PPG',
  'Outros',
  'Cinturão de Jacarepaguá',
  'Gardênia Azul',
  'Rio das Pedras',
]

const TERR_MATCH: Record<string, string[]> = {
  'Corredor Itanhangá / Rio das Pedras': ['Corredor do Itanhangá', 'Corredor Itanhangá', 'Rio das Pedras'],
  'Jacarezinho e Manguinhos':            ['Manguinhos e Jacarezinho', 'Jacarezinho e Manguinhos'],
  'PPG':                                 ['Pavão-Pavãozinho e Cantagalo', 'PPG'],
  'Outros':                              ['Outros'],
  'Cinturão de Jacarepaguá':             ['Cinturão de Jacarepaguá'],
  'Gardênia Azul':                       ['Gardênia Azul'],
  'Rio das Pedras':                      ['Rio das Pedras'],
}

export default function UrbanismoFiltrado({ urbanismo }: Props) {
  const [busca, setBusca]               = useState('')
  const [tipoFiltro, setTipoFiltro]     = useState('Todos')
  const [terrFiltro, setTerrFiltro]     = useState('Todos')
  const [statusFiltro, setStatusFiltro] = useState('Todos')

  const tipos = useMemo(() =>
    ['Todos', ...Array.from(new Set(urbanismo.map((u) => u.tipo).filter(Boolean))).sort()],
    [urbanismo]
  )

  const filtrados = useMemo(() => urbanismo.filter(u => {
    if (tipoFiltro !== 'Todos' && u.tipo !== tipoFiltro) return false
    if (terrFiltro !== 'Todos') {
      const terr = u.territorio?.nome || ''
      const matches = TERR_MATCH[terrFiltro] || [terrFiltro]
      if (!matches.some(m => terr.includes(m))) return false
    }
    if (statusFiltro !== 'Todos' && u.status !== statusFiltro) return false
    if (busca && !u.titulo?.toLowerCase().includes(busca.toLowerCase()) && !u.descricao?.toLowerCase().includes(busca.toLowerCase())) return false
    return true
  }), [urbanismo, tipoFiltro, terrFiltro, statusFiltro, busca])

  const selectStyle = {
    width: '100%', padding: '8px 12px', fontSize: '0.85rem',
    border: '1px solid var(--pci-border)', borderRadius: 6, outline: 'none',
    fontFamily: 'Plus Jakarta Sans', background: 'var(--pci-bg)', color: 'var(--pci-text)',
  }

  return (
    <div>
      {/* Filtros */}
      <div className="pci-card p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pci-muted)', display: 'block', marginBottom: 6 }}>Buscar</label>
            <input placeholder="Nome da intervenção..." value={busca} onChange={e => setBusca(e.target.value)} style={selectStyle} />
          </div>
          <div>
            <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pci-muted)', display: 'block', marginBottom: 6 }}>Tipo</label>
            <select value={tipoFiltro} onChange={e => setTipoFiltro(e.target.value)} style={selectStyle}>
              {tipos.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pci-muted)', display: 'block', marginBottom: 6 }}>Território</label>
            <select value={terrFiltro} onChange={e => setTerrFiltro(e.target.value)} style={selectStyle}>
              {TERR_OPCOES_URBANISMO.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pci-muted)', display: 'block', marginBottom: 6 }}>Status</label>
            <select value={statusFiltro} onChange={e => setStatusFiltro(e.target.value)} style={selectStyle}>
              {['Todos', 'Executado', 'Planejado', 'Em execução', 'Concluído'].map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => { setBusca(''); setTipoFiltro('Todos'); setTerrFiltro('Todos'); setStatusFiltro('Todos') }}
            style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-muted)', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Limpar filtros
          </button>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-muted)' }}>
            {filtrados.length} resultado{filtrados.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Cards */}
      {filtrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--pci-muted)' }}>
          <p style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '1.1rem' }}>Nenhuma intervenção encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtrados.map((u: any) => (
            <div key={u.id} className="pci-card flex flex-col" style={{ borderLeft: `4px solid ${u.status === 'Executado' ? 'var(--pci-green)' : 'var(--pci-cyan)'}` }}>
              <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--pci-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                  <span className="pci-tag">{u.tipologia || u.tipo || '—'}</span>
                  <span className={`badge ${u.status === 'Executado' ? 'badge-green' : u.status === 'Concluído' ? 'badge-blue' : 'badge-amber'}`}>{u.status}</span>
                </div>
                <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.9rem', color: 'var(--pci-text)', lineHeight: 1.35 }}>{u.titulo}</h3>
              </div>
              <div style={{ padding: '12px 20px', flex: 1 }}>
                {u.descricao && <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: 'var(--pci-dim)', lineHeight: 1.6 }}>{u.descricao}</p>}
                {u.subtipologia && (
                  <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', color: 'var(--pci-muted)', marginTop: 6 }}>{u.subtipologia}</p>
                )}
              </div>
              <div style={{ padding: '10px 20px 14px', borderTop: '1px solid var(--pci-border)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                {u.comunidade && (
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', color: 'var(--pci-muted)' }}>{u.comunidade}</span>
                )}
                {u.territorio?.nome && (
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', color: 'var(--pci-muted)' }}>📍 {u.territorio.nome}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

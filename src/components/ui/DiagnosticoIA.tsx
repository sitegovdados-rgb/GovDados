'use client'
import { useState } from 'react'

interface Props {
  subTerritorio: string
  indicadores: any[]
  programas: any[]
  equipamentos: any[]
}

export default function DiagnosticoIA({ subTerritorio, indicadores, programas, equipamentos }: Props) {
  const [diagnostico, setDiagnostico] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [gerado, setGerado] = useState(false)

  async function gerarDiagnostico() {
    setLoading(true)
    try {
      const res = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subTerritorio, indicadores, programas, equipamentos }),
      })
      const data = await res.json()
      setDiagnostico(data.diagnostico)
      setGerado(true)
    } catch (e) {
      setDiagnostico('Erro ao gerar diagnóstico. Tente novamente.')
      setGerado(true)
    }
    setLoading(false)
  }

  return (
    <div className="pci-card p-6" style={{ borderLeft: '4px solid var(--pci-cyan)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: '1.5rem' }}>🤖</span>
        <div>
          <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '1rem', color: 'var(--pci-navy)', marginBottom: 2 }}>
            Diagnóstico Territorial
          </h3>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Gerado por IA · Baseado nos indicadores do Directus
          </p>
        </div>
      </div>

      {!gerado && (
        <div>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.85rem', color: 'var(--pci-dim)', lineHeight: 1.6, marginBottom: 16 }}>
            Análise automática dos dados sociográficos, programas sociais e equipamentos públicos do sub-território, com identificação de pontos críticos e oportunidades de intervenção.
          </p>
          <button
            onClick={gerarDiagnostico}
            disabled={loading}
            style={{
              fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.85rem',
              padding: '10px 20px', borderRadius: 8, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? 'var(--pci-muted)' : 'var(--pci-blue)', color: 'white',
              transition: 'background 0.2s',
            }}
          >
            {loading ? '⏳ Gerando diagnóstico...' : '✨ Gerar Diagnóstico'}
          </button>
        </div>
      )}

      {gerado && diagnostico && (
        <div>
          <div style={{
            fontFamily: 'Plus Jakarta Sans', fontSize: '0.88rem', color: 'var(--pci-text)',
            lineHeight: 1.8, whiteSpace: 'pre-wrap',
          }}>
            {diagnostico}
          </div>
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--pci-border)' }}>
            <button
              onClick={() => { setGerado(false); setDiagnostico('') }}
              style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-muted)', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em' }}
            >
              ↺ Regenerar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

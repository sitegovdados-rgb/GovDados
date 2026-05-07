'use client'
import { useState } from 'react'

interface Mapa {
  titulo: string
  descricao: string
  url: string
}

interface Props {
  mapas: Mapa[]
}

export default function GaleriaMapa({ mapas }: Props) {
  const [ativo, setAtivo] = useState(0)
  const [ampliado, setAmpliado] = useState(false)

  return (
    <div>
      {/* Mapa principal */}
      <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', background: '#f0f4f8', border: '1px solid var(--pci-border)' }}>
        <img
          src={mapas[ativo].url}
          alt={mapas[ativo].titulo}
          style={{ width: '100%', height: 480, objectFit: 'contain', cursor: 'zoom-in', display: 'block' }}
          onClick={() => setAmpliado(true)}
        />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          padding: '32px 20px 16px',
        }}>
          <p style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.95rem', color: 'white', marginBottom: 4 }}>
            {mapas[ativo].titulo}
          </p>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>
            {mapas[ativo].descricao}
          </p>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>
            Clique para ampliar · Programa Cidade Integrada
          </p>
        </div>
      </div>

      {/* Miniaturas */}
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {mapas.map((mapa, i) => (
          <button key={i} onClick={() => setAtivo(i)} style={{
            flex: 1, padding: 0, border: 'none', cursor: 'pointer',
            borderRadius: 8, overflow: 'hidden',
            outline: i === ativo ? '3px solid var(--pci-cyan)' : '3px solid transparent',
            outlineOffset: 2, transition: 'outline 0.15s',
          }}>
            <img src={mapa.url} alt={mapa.titulo} style={{ width: '100%', height: 64, objectFit: 'cover', display: 'block' }} />
            <p style={{
              fontFamily: 'JetBrains Mono', fontSize: '0.55rem', textAlign: 'center',
              padding: '4px 4px', background: i === ativo ? 'var(--pci-navy)' : 'var(--pci-light)',
              color: i === ativo ? 'white' : 'var(--pci-dim)',
              textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.3,
            }}>
              {mapa.titulo.replace('Mapa de ', '').replace('Mapa ', '')}
            </p>
          </button>
        ))}
      </div>

      {/* Modal de ampliação */}
      {ampliado && (
        <div
          onClick={() => setAmpliado(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out', padding: 24,
          }}
        >
          <img
            src={mapas[ativo].url}
            alt={mapas[ativo].titulo}
            style={{ maxWidth: '95vw', maxHeight: '95vh', objectFit: 'contain', borderRadius: 8 }}
          />
          <button onClick={() => setAmpliado(false)} style={{
            position: 'absolute', top: 20, right: 20,
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
            width: 40, height: 40, cursor: 'pointer', color: 'white', fontSize: '1.2rem',
          }}>✕</button>
        </div>
      )}
    </div>
  )
}

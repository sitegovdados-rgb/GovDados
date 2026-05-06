'use client'
import { useEffect, useRef } from 'react'

interface Regiao {
  id: number
  nome: string
  latitude: number
  longitude: number
  populacao: number
  densidade: number
  area_km2: number
  municipio: string
}

interface Props {
  regioes: Regiao[]
}

export default function MapaTerritorios({ regioes }: Props) {
  const mapRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return
    if (mapRef.current) return // já iniciado

    const iniciarMapa = async () => {
      const L = (await import('leaflet')).default

      // Corrigir ícones do Leaflet no Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      const map = L.map(containerRef.current!, {
        center: [-22.95, -43.28],
        zoom: 11,
        zoomControl: true,
      })

      mapRef.current = map

      // Tile layer OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map)

      // Ícone personalizado azul
      const iconeGov = L.divIcon({
        html: `<div style="
          width: 14px; height: 14px;
          background: #1a56a0;
          border: 3px solid #fff;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(26,86,160,0.5);
        "></div>`,
        className: '',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      })

      // Adicionar markers
      regioes
        .filter((r) => r.latitude && r.longitude)
        .forEach((r) => {
          const popup = `
            <div style="font-family: 'Source Code Pro', monospace; min-width: 180px;">
              <strong style="font-family: 'Merriweather', serif; font-size: 14px; color: #1a2340;">${r.nome}</strong>
              <div style="margin-top: 8px; font-size: 11px; color: #4a5880;">
                ${r.populacao > 0 ? `<div>👥 ${r.populacao.toLocaleString('pt-BR')} hab.</div>` : ''}
                ${r.densidade > 0 ? `<div>📐 ${r.densidade.toLocaleString('pt-BR')} hab/km²</div>` : ''}
                ${r.area_km2 > 0 ? `<div>📏 ${r.area_km2} km²</div>` : ''}
                <div>📍 ${r.municipio}</div>
              </div>
              <div style="margin-top: 6px; padding: 3px 8px; background: #e8eef8; border-radius: 3px; font-size: 10px; color: #1a56a0; display: inline-block; text-transform: uppercase; letter-spacing: 0.05em;">Território PCI</div>
            </div>
          `
          L.marker([r.latitude, r.longitude], { icon: iconeGov })
            .addTo(map)
            .bindPopup(popup, { maxWidth: 220 })
        })
    }

    iniciarMapa()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [regioes])

  return (
    <div className="gov-card overflow-hidden">
      <div className="px-6 pt-6 pb-4">
        <h3 className="font-display text-lg font-bold mb-1" style={{ color: 'var(--gov-text)' }}>
          Territórios do PCI — Rio de Janeiro
        </h3>
        <p className="font-mono text-xs" style={{ color: 'var(--gov-muted)' }}>
          Clique nos pontos para ver os dados de cada território
        </p>
      </div>

      {/* CSS do Leaflet */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />

      <div
        ref={containerRef}
        style={{ height: '400px', width: '100%' }}
      />
    </div>
  )
}

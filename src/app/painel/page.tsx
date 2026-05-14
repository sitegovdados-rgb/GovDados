import { getIndicadores, getProgramasTerritorio, getProgramasUrbanismo, getEquipamentos } from '@/lib/directus'
import PainelExecutivo from '@/components/ui/PainelExecutivo'

export const revalidate = 3600

export default async function PainelPage() {
  let indicadores: any[] = []
  let programas: any[] = []
  let urbanismo: any[] = []
  let equipamentos: any[] = []

  try {
    indicadores  = await getIndicadores()
    programas    = await getProgramasTerritorio()
    urbanismo    = await getProgramasUrbanismo()
    equipamentos = await getEquipamentos()
  } catch (e) { console.error(e) }

  return (
    <div>
      {/* Header */}
      <section style={{ background: 'linear-gradient(135deg, var(--pci-navy) 0%, #1e3a8a 100%)', color: 'white', borderBottom: '3px solid var(--pci-cyan)' }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <span className="pci-tag-navy mb-4">Painel Executivo · PCI</span>
          <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.1, marginTop: 12, marginBottom: 10 }}>
            Painel de Indicadores
          </h1>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.95rem', color: 'rgba(255,255,255,0.65)', maxWidth: 560, lineHeight: 1.7 }}>
            Visão executiva dos dados sociográficos, programas sociais e intervenções urbanísticas do Programa Cidade Integrada. Fontes: IBGE Censo 2022 · PCI 2025.
          </p>
        </div>
      </section>

      <PainelExecutivo
        indicadores={indicadores}
        programas={programas}
        urbanismo={urbanismo}
        equipamentos={equipamentos}
      />
    </div>
  )
}

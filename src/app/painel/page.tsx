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

        {/* KPIs globais */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { valor: '224.572', label: 'Beneficiados',       sub: 'pessoas atendidas' },
                { valor: '115',     label: 'Programas',          sub: 'sociais mapeados' },
                { valor: '231',     label: 'Projetos Urbanismo', sub: 'intervenções registradas' },
                { valor: '13/05/2026', label: 'Atualizado',      sub: 'às 12h57' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '16px 24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                  <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '1.6rem', color: 'var(--pci-cyan)', lineHeight: 1 }}>{item.valor}</p>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.78rem', color: 'white', marginTop: 4 }}>{item.label}</p>
                  <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.55rem', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
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

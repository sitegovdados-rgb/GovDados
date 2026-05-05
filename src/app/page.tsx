import Link from 'next/link'
import { getIndicadores, getRegioes } from '@/lib/directus'
import KpiCard from '@/components/ui/KpiCard'

export const revalidate = 3600

export default async function HomePage() {
  let indicadores: any[] = []
  let regioes: any[] = []
  try {
    indicadores = await getIndicadores()
    regioes = await getRegioes()
  } catch (e) {
    console.error(e)
  }

  const kpisDestaque = indicadores.filter((i: any) =>
    i.nome?.includes('Investimento PCI') || i.nome?.includes('Refeições') || i.nome?.includes('Resíduos')
  ).slice(0, 3)

  const kpisPop = indicadores.filter((i: any) =>
    i.area_tematica === 'Dados Demográficos' && i.nome?.includes('População total')
  ).slice(0, 4)

  const totalPop = kpisPop.reduce((acc: number, i: any) => acc + (i.valor || 0), 0)

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b" style={{ borderColor: 'var(--gov-border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="area-tag mb-5">Programa Cidade Integrada · RJ</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-5" style={{ color: 'var(--gov-text)' }}>
              Dados que revelam<br />
              <span style={{ color: 'var(--gov-accent)' }}>políticas públicas</span>
            </h1>
            <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--gov-textDim)' }}>
              Indicadores, programas sociais e dados territoriais do Programa Cidade Integrada — para gestores, pesquisadores e cidadãos.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/painel" className="btn-primary">Ver Painel de Dados</Link>
              <Link href="/dados" className="btn-outline">Dados Abertos</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Números */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--gov-text)' }}>Visão Geral</h2>
          <div className="gov-line flex-1" />
          <span className="font-mono text-xs" style={{ color: 'var(--gov-muted)' }}>IBGE 2022 · PCI 2025</span>
        </div>

        <div className="gov-card p-8 mb-6" style={{ background: 'var(--gov-light)', borderColor: 'var(--gov-accent)' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--gov-muted)' }}>População Total</p>
              <p className="font-display text-5xl font-bold" style={{ color: 'var(--gov-accent)' }}>
                {totalPop > 0 ? totalPop.toLocaleString('pt-BR') : '141.168'}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--gov-textDim)' }}>habitantes nos territórios do PCI</p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--gov-muted)' }}>Territórios</p>
              <p className="font-display text-5xl font-bold" style={{ color: 'var(--gov-text)' }}>{regioes.length || 5}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--gov-textDim)' }}>comunidades atendidas</p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--gov-muted)' }}>Programas Sociais</p>
              <p className="font-display text-5xl font-bold" style={{ color: 'var(--gov-text)' }}>29</p>
              <p className="text-sm mt-1" style={{ color: 'var(--gov-textDim)' }}>iniciativas ativas</p>
            </div>
          </div>
        </div>

        {kpisDestaque.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {kpisDestaque.map((k: any) => (
              <KpiCard key={k.id} titulo={k.nome} valor={k.valor} unidade={k.unidade} area={k.area_tematica} territorio={k.territorio} destaque />
            ))}
          </div>
        )}

        {kpisPop.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpisPop.map((k: any) => (
              <KpiCard key={k.id} titulo={k.nome.replace('População total — ', '')} valor={k.valor} unidade={k.unidade} />
            ))}
          </div>
        )}
      </section>

      {/* Territórios */}
      <section className="bg-white border-y" style={{ borderColor: 'var(--gov-border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--gov-text)' }}>Territórios</h2>
            <div className="gov-line flex-1" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {(regioes.length > 0 ? regioes : [
              { id: 1, nome: 'Jacarezinho',       populacao: 29766 },
              { id: 2, nome: 'Manguinhos',        populacao: 17249 },
              { id: 3, nome: 'Corredor Itanhangá',populacao: 29165 },
              { id: 4, nome: 'Rio das Pedras',    populacao: 64988 },
              { id: 5, nome: 'PPG',               populacao: null  },
            ]).map((r: any) => (
              <Link key={r.id || r.nome} href="/territorios" className="gov-card p-5 block group">
                <p className="font-display font-semibold text-sm mb-2 group-hover:underline" style={{ color: 'var(--gov-accent)' }}>{r.nome}</p>
                {r.populacao && (
                  <p className="font-mono text-xs" style={{ color: 'var(--gov-muted)' }}>
                    {r.populacao.toLocaleString('pt-BR')} hab.
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="font-display text-3xl font-bold mb-4" style={{ color: 'var(--gov-text)' }}>Explore os dados completos</h2>
        <p className="mb-8 max-w-lg mx-auto" style={{ color: 'var(--gov-textDim)' }}>
          Acesse o painel com todos os indicadores, programas e territórios.
        </p>
        <Link href="/painel" className="btn-primary">Abrir Painel Completo →</Link>
      </section>
    </div>
  )
}

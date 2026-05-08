'use client'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts'

interface Props {
  indicadores: any[]
  programas: any[]
  urbanismo: any[]
  equipamentos: any[]
}

const CORES = ['#1a2a5e', '#2563a8', '#00a8cc', '#4a5f8a', '#8fa3c8']
const tip = { fontFamily: 'JetBrains Mono', fontSize: 11, borderRadius: 8, border: '1px solid #d4dff0' }
const label = { fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: '#8fa3c8', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }

// Dados populacionais por sub-território (Censo 2022)
const POP_DATA = [
  { territorio: 'Rio das Pedras',    populacao: 64988, domicilios: 33112, densidade: 51829 },
  { territorio: 'Corredor Itanhangá',populacao: 29165, domicilios: 13347, densidade: 41685 },
  { territorio: 'Gardênia Azul',     populacao: 17399, domicilios: 7109,  densidade: 36042 },
]

const TOTAL_POP = POP_DATA.reduce((acc, t) => acc + t.populacao, 0)
const TOTAL_DOM = POP_DATA.reduce((acc, t) => acc + t.domicilios, 0)

// Alfabetização por território
const ALFA_DATA = [
  { territorio: 'Corredor Itanhangá', taxa: 96.08, referencia: 96.2 },
  { territorio: 'Rio das Pedras',     taxa: 92.59, referencia: 96.2 },
  { territorio: 'Gardênia Azul',      taxa: 92.30, referencia: 96.2 },
]

export default function PainelExecutivo({ indicadores, programas, urbanismo, equipamentos }: Props) {
  const [abaAtiva, setAbaAtiva] = useState<'populacao' | 'programas' | 'urbanismo' | 'equipamentos'>('populacao')

  const totalBenef = programas.reduce((acc: number, p: any) => acc + (p.beneficiarios || 0), 0)
  const execUtados = urbanismo.filter((u: any) => u.status === 'Executado').length
  const planejados = urbanismo.filter((u: any) => u.status === 'Planejado').length

  // Programas por eixo
  const eixoData = Object.entries(
    programas.reduce((acc: Record<string, number>, p: any) => {
      const e = p.eixo || 'Social'
      acc[e] = (acc[e] || 0) + 1
      return acc
    }, {})
  ).map(([nome, valor]) => ({ nome, valor })).sort((a, b) => b.valor - a.valor)

  // Top programas por beneficiários
  const topProgramas = [...programas]
    .filter((p: any) => p.beneficiarios > 0)
    .sort((a: any, b: any) => b.beneficiarios - a.beneficiarios)
    .slice(0, 6)
    .map((p: any) => ({
      nome: p.titulo.length > 26 ? p.titulo.substring(0, 26) + '…' : p.titulo,
      nomeCompleto: p.titulo,
      valor: p.beneficiarios,
    }))

  // Equipamentos por tipo
  const equipData = Object.entries(
    equipamentos.reduce((acc: Record<string, number>, e: any) => {
      acc[e.tipo] = (acc[e.tipo] || 0) + 1
      return acc
    }, {})
  ).map(([nome, valor]) => ({ nome, valor }))

  const abas = [
    { id: 'populacao',    label: 'População' },
    { id: 'programas',    label: 'Programas Sociais' },
    { id: 'urbanismo',    label: 'Urbanismo' },
    { id: 'equipamentos', label: 'Equipamentos' },
  ] as const

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* KPIs principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { n: TOTAL_POP.toLocaleString('pt-BR'), label: 'Habitantes', sub: 'Cinturão de Jacarepaguá · Censo 2022', cor: 'var(--pci-navy)' },
          { n: programas.length || '—',           label: 'Programas Sociais', sub: 'ações e serviços ativos e realizados', cor: 'var(--pci-blue)' },
          { n: totalBenef > 0 ? (totalBenef/1000).toFixed(0)+'mil+' : '—', label: 'Beneficiários', sub: 'total acumulado dos programas', cor: 'var(--pci-cyan)' },
          { n: urbanismo.length || '—',           label: 'Intervenções', sub: `${execUtados} executadas · ${planejados} planejadas`, cor: '#16a34a' },
        ].map((k, i) => (
          <div key={i} className="pci-card p-5" style={{ borderTop: `4px solid ${k.cor}` }}>
            <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '2.2rem', color: k.cor, lineHeight: 1 }}>{k.n}</p>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.85rem', color: 'var(--pci-text)', marginTop: 6 }}>{k.label}</p>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', color: 'var(--pci-muted)', marginTop: 3, letterSpacing: '0.04em' }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Abas */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--pci-border)', marginBottom: 32, gap: 4 }}>
        {abas.map(aba => (
          <button key={aba.id} onClick={() => setAbaAtiva(aba.id)}
            style={{
              fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.85rem',
              padding: '10px 20px', border: 'none', cursor: 'pointer', background: 'transparent',
              color: abaAtiva === aba.id ? 'var(--pci-navy)' : 'var(--pci-muted)',
              borderBottom: abaAtiva === aba.id ? '3px solid var(--pci-cyan)' : '3px solid transparent',
              marginBottom: -2, transition: 'all 0.15s',
            }}>
            {aba.label}
          </button>
        ))}
      </div>

      {/* Aba: População */}
      {abaAtiva === 'populacao' && (
        <div className="space-y-8">

          {/* Comparação de territórios */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="pci-card p-6">
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.95rem', color: 'var(--pci-navy)', marginBottom: 4 }}>
                População por Território
              </h3>
              <p style={label}>Censo Demográfico IBGE 2022</p>
              <ResponsiveContainer width="100%" height={220} style={{ marginTop: 20 }}>
                <BarChart data={POP_DATA} margin={{ left: 0, right: 16, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d4dff0" />
                  <XAxis dataKey="territorio" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#8fa3c8' }} />
                  <YAxis tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#8fa3c8' }} tickFormatter={v => (v/1000).toFixed(0)+'k'} />
                  <Tooltip contentStyle={tip} formatter={(v: any) => [v.toLocaleString('pt-BR'), 'Habitantes']} />
                  <Bar dataKey="populacao" radius={[4, 4, 0, 0]} name="Habitantes">
                    {POP_DATA.map((_, i) => <Cell key={i} fill={CORES[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pci-card p-6">
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.95rem', color: 'var(--pci-navy)', marginBottom: 4 }}>
                Densidade Demográfica
              </h3>
              <p style={label}>hab/km² · comparação com contexto nacional</p>
              <ResponsiveContainer width="100%" height={220} style={{ marginTop: 20 }}>
                <BarChart
                  data={[
                    ...POP_DATA.map(t => ({ nome: t.territorio.split(' ')[0], valor: t.densidade, tipo: 'territorio' })),
                    { nome: 'Mun. Rio', valor: 5325,  tipo: 'referencia' },
                    { nome: 'Estado RJ', valor: 365,  tipo: 'referencia' },
                    { nome: 'Brasil',    valor: 24,   tipo: 'referencia' },
                  ]}
                  margin={{ left: 0, right: 16, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d4dff0" />
                  <XAxis dataKey="nome" tick={{ fontSize: 9, fontFamily: 'JetBrains Mono', fill: '#8fa3c8' }} />
                  <YAxis tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#8fa3c8' }} tickFormatter={v => (v/1000).toFixed(0)+'k'} />
                  <Tooltip contentStyle={tip} formatter={(v: any) => [v.toLocaleString('pt-BR') + ' hab/km²', 'Densidade']} />
                  <Bar dataKey="valor" radius={[4, 4, 0, 0]} name="hab/km²">
                    {[...POP_DATA, {}, {}, {}].map((t: any, i) => (
                      <Cell key={i} fill={t.tipo === 'referencia' || i >= 3 ? '#d4dff0' : CORES[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alfabetização */}
          <div className="pci-card p-6">
            <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.95rem', color: 'var(--pci-navy)', marginBottom: 4 }}>
              Taxa de Alfabetização (15 anos ou mais)
            </h3>
            <p style={label}>% · comparação com município do Rio de Janeiro (96,2%)</p>
            <ResponsiveContainer width="100%" height={180} style={{ marginTop: 20 }}>
              <BarChart data={ALFA_DATA} layout="vertical" margin={{ left: 16, right: 60, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d4dff0" horizontal={false} />
                <XAxis type="number" domain={[88, 100]} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#8fa3c8' }} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="territorio" width={160} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#4a5f8a' }} />
                <Tooltip contentStyle={tip} formatter={(v: any) => [`${v}%`, 'Taxa de Alfabetização']} />
                <Bar dataKey="taxa" radius={[0, 4, 4, 0]} name="Taxa">
                  {ALFA_DATA.map((_, i) => <Cell key={i} fill={CORES[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tabela resumo */}
          <div className="pci-card overflow-hidden">
            <div style={{ padding: '14px 20px', background: 'var(--pci-navy)' }}>
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>Resumo por Território · Censo 2022</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--pci-light)' }}>
                  {['Território', 'População', 'Domicílios', 'Média Moradores', 'Densidade (hab/km²)', 'Alfabetização'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--pci-muted)', textAlign: 'left', borderBottom: '1px solid var(--pci-border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { t: 'Rio das Pedras',     pop: 64988, dom: 33112, med: '2,0', dens: '51.829', alfa: '92,59%' },
                  { t: 'Corredor Itanhangá', pop: 29165, dom: 13347, med: '2,1', dens: '41.685', alfa: '96,08%' },
                  { t: 'Gardênia Azul',      pop: 17399, dom: 7109,  med: '2,4', dens: '36.042', alfa: '92,30%' },
                  { t: 'TOTAL / MÉDIA',      pop: TOTAL_POP, dom: TOTAL_DOM, med: '2,2', dens: '43.185', alfa: '93,66%' },
                ].map((row, i) => (
                  <tr key={i} style={{ background: i === 3 ? 'var(--pci-light)' : i % 2 === 0 ? 'white' : '#fafbfd', borderBottom: '1px solid var(--pci-border)', fontWeight: i === 3 ? 600 : 400 }}>
                    <td style={{ padding: '10px 16px', fontFamily: 'Plus Jakarta Sans', fontSize: '0.82rem', color: 'var(--pci-text)' }}>{row.t}</td>
                    <td style={{ padding: '10px 16px', fontFamily: 'Sora', fontWeight: 700, fontSize: '0.85rem', color: 'var(--pci-navy)' }}>{row.pop.toLocaleString('pt-BR')}</td>
                    <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono', fontSize: '0.78rem', color: 'var(--pci-text)' }}>{row.dom.toLocaleString('pt-BR')}</td>
                    <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono', fontSize: '0.78rem', color: 'var(--pci-text)' }}>{row.med}</td>
                    <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono', fontSize: '0.78rem', color: 'var(--pci-text)' }}>{row.dens}</td>
                    <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono', fontSize: '0.78rem', color: 'var(--pci-text)' }}>{row.alfa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Aba: Programas Sociais */}
      {abaAtiva === 'programas' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Por eixo */}
            <div className="pci-card p-6">
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.95rem', color: 'var(--pci-navy)', marginBottom: 4 }}>
                Programas por Eixo
              </h3>
              <p style={label}>distribuição por eixo de atuação</p>
              <ResponsiveContainer width="100%" height={220} style={{ marginTop: 20 }}>
                <PieChart>
                  <Pie data={eixoData} cx="40%" cy="50%" outerRadius={85} innerRadius={40} dataKey="valor" nameKey="nome">
                    {eixoData.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
                  </Pie>
                  <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: 11 }} />
                  <Tooltip contentStyle={tip} formatter={(v: any, name: any) => [v + ' programa' + (v !== 1 ? 's' : ''), name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top por beneficiários */}
            <div className="pci-card p-6">
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.95rem', color: 'var(--pci-navy)', marginBottom: 4 }}>
                Top Programas por Beneficiários
              </h3>
              <p style={label}>participantes totais acumulados</p>
              <ResponsiveContainer width="100%" height={220} style={{ marginTop: 20 }}>
                <BarChart data={topProgramas} layout="vertical" margin={{ left: 8, right: 32, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d4dff0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#8fa3c8' }} tickFormatter={v => v.toLocaleString('pt-BR')} />
                  <YAxis type="category" dataKey="nome" width={150} tick={{ fontSize: 9, fontFamily: 'JetBrains Mono', fill: '#4a5f8a' }} />
                  <Tooltip contentStyle={tip} formatter={(v: any, _: any, p: any) => [v.toLocaleString('pt-BR') + ' beneficiários', p.payload?.nomeCompleto]} />
                  <Bar dataKey="valor" fill="#1a2a5e" radius={[0, 4, 4, 0]} name="Beneficiários" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status dos programas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { status: 'Em Andamento', label: 'Em Andamento', cor: '#16a34a', bg: '#dcfce7' },
              { status: 'Realizado',    label: 'Realizados',   cor: '#2563a8', bg: 'var(--pci-light)' },
              { status: 'Concluída',    label: 'Concluídos',   cor: '#6b7fa3', bg: '#f1f5f9' },
            ].map(s => {
              const count = programas.filter((p: any) => p.status === s.status).length
              return (
                <div key={s.status} className="pci-card p-5" style={{ borderLeft: `4px solid ${s.cor}` }}>
                  <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '2rem', color: s.cor }}>{count}</p>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.85rem', color: 'var(--pci-text)', marginTop: 4 }}>{s.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Aba: Urbanismo */}
      {abaAtiva === 'urbanismo' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Executado vs Planejado */}
            <div className="pci-card p-6">
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.95rem', color: 'var(--pci-navy)', marginBottom: 4 }}>
                Status das Intervenções
              </h3>
              <p style={label}>executadas vs planejadas</p>
              <ResponsiveContainer width="100%" height={220} style={{ marginTop: 20 }}>
                <PieChart>
                  <Pie
                    data={[
                      { nome: 'Executadas', valor: execUtados },
                      { nome: 'Planejadas', valor: planejados },
                    ]}
                    cx="40%" cy="50%" outerRadius={85} innerRadius={40} dataKey="valor" nameKey="nome">
                    <Cell fill="#16a34a" />
                    <Cell fill="#00a8cc" />
                  </Pie>
                  <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: 11 }} />
                  <Tooltip contentStyle={tip} formatter={(v: any) => [v + ' intervenção' + (v !== 1 ? 'ões' : ''), '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Por tipo */}
            <div className="pci-card p-6">
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.95rem', color: 'var(--pci-navy)', marginBottom: 4 }}>
                Por Tipo de Projeto
              </h3>
              <p style={label}>arquitetônico vs urbanístico</p>
              <ResponsiveContainer width="100%" height={220} style={{ marginTop: 20 }}>
                <PieChart>
                  <Pie
                    data={Object.entries(
                      urbanismo.reduce((acc: Record<string, number>, u: any) => {
                        acc[u.tipo] = (acc[u.tipo] || 0) + 1
                        return acc
                      }, {})
                    ).map(([nome, valor]) => ({ nome, valor }))}
                    cx="40%" cy="50%" outerRadius={85} innerRadius={40} dataKey="valor" nameKey="nome">
                    {urbanismo.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
                  </Pie>
                  <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: 11 }} />
                  <Tooltip contentStyle={tip} formatter={(v: any) => [v + ' projeto' + (v !== 1 ? 's' : ''), '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Por sub-território */}
          <div className="pci-card p-6">
            <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.95rem', color: 'var(--pci-navy)', marginBottom: 4 }}>
              Intervenções por Território
            </h3>
            <p style={label}>distribuição geográfica das obras</p>
            <ResponsiveContainer width="100%" height={200} style={{ marginTop: 20 }}>
              <BarChart
                data={Object.entries(
                  urbanismo.reduce((acc: Record<string, number>, u: any) => {
                    const t = u.sub_territorio || u.territorio || 'Não especificado'
                    acc[t] = (acc[t] || 0) + 1
                    return acc
                  }, {})
                ).map(([nome, valor]) => ({ nome: nome.length > 20 ? nome.substring(0, 20)+'…' : nome, valor }))}
                margin={{ left: 0, right: 16, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d4dff0" />
                <XAxis dataKey="nome" tick={{ fontSize: 9, fontFamily: 'JetBrains Mono', fill: '#8fa3c8' }} />
                <YAxis tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#8fa3c8' }} allowDecimals={false} />
                <Tooltip contentStyle={tip} formatter={(v: any) => [v + ' intervenção' + (v > 1 ? 'ões' : ''), '']} />
                <Bar dataKey="valor" fill="#1a2a5e" radius={[4, 4, 0, 0]}>
                  {urbanismo.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Aba: Equipamentos */}
      {abaAtiva === 'equipamentos' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="pci-card p-6">
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.95rem', color: 'var(--pci-navy)', marginBottom: 4 }}>
                Equipamentos por Tipo
              </h3>
              <p style={label}>distribuição por categoria</p>
              <ResponsiveContainer width="100%" height={220} style={{ marginTop: 20 }}>
                <PieChart>
                  <Pie data={equipData} cx="40%" cy="50%" outerRadius={85} innerRadius={40} dataKey="valor" nameKey="nome">
                    {equipData.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
                  </Pie>
                  <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: 11 }} />
                  <Tooltip contentStyle={tip} formatter={(v: any) => [v + ' equipamento' + (v !== 1 ? 's' : ''), '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Tabela de equipamentos */}
            <div className="pci-card overflow-hidden">
              <div style={{ padding: '12px 20px', background: 'var(--pci-navy)' }}>
                <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.85rem', color: 'white' }}>
                  {equipamentos.length} equipamentos mapeados
                </h3>
              </div>
              <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                {equipamentos.map((e: any, i: number) => (
                  <div key={i} style={{ padding: '10px 16px', borderBottom: '1px solid var(--pci-border)', background: i % 2 === 0 ? 'white' : '#fafbfd' }}>
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, fontSize: '0.8rem', color: 'var(--pci-text)' }}>{e.nome}</p>
                    <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', color: 'var(--pci-muted)', marginTop: 2 }}>
                      {e.tipo} · {e.subtipo} · {e.endereco}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Nota de fontes */}
          <div className="pci-card p-5" style={{ borderLeft: '4px solid var(--pci-border)' }}>
            <p style={{ ...label, marginBottom: 6 }}>Fontes dos dados de equipamentos</p>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.82rem', color: 'var(--pci-dim)', lineHeight: 1.6 }}>
              Saúde: Secretaria Municipal de Saúde (SMS 2023) · Educação: Secretaria Municipal de Educação (SME 2023) · Assistência Social: Secretaria Municipal de Assistência Social (SMAS 2023)
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

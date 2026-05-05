'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Props {
  regioes: any[]
}

const CORES = ['#1a56a0', '#0ea5e9', '#16a34a', '#d97706', '#9333ea']

export default function GraficoBarras({ regioes }: Props) {
  const data = regioes
    .filter((r: any) => r.populacao > 0)
    .map((r: any, i: number) => ({
      nome: r.nome.length > 12 ? r.nome.substring(0, 12) + '...' : r.nome,
      nomeCompleto: r.nome,
      populacao: r.populacao,
      densidade: Math.round(r.densidade / 1000), // em milhares para caber no gráfico
      cor: CORES[i % CORES.length],
    }))

  return (
    <div className="gov-card p-6">
      <h3 className="font-display text-lg font-bold mb-1" style={{ color: 'var(--gov-text)' }}>
        População por Território
      </h3>
      <p className="font-mono text-xs mb-6" style={{ color: 'var(--gov-muted)' }}>
        IBGE — Censo Demográfico 2022
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dce3ef" />
          <XAxis
            dataKey="nome"
            tick={{ fontSize: 11, fontFamily: 'Source Code Pro', fill: '#6b7fa3' }}
            axisLine={{ stroke: '#dce3ef' }}
          />
          <YAxis
            tick={{ fontSize: 11, fontFamily: 'Source Code Pro', fill: '#6b7fa3' }}
            axisLine={{ stroke: '#dce3ef' }}
            tickFormatter={(v) => v.toLocaleString('pt-BR')}
          />
          <Tooltip
            formatter={(value: any, name: string) => [
              value.toLocaleString('pt-BR'),
              name === 'populacao' ? 'População' : 'Densidade (mil hab/km²)'
            ]}
            labelFormatter={(label, payload) => payload?.[0]?.payload?.nomeCompleto || label}
            contentStyle={{
              background: '#fff',
              border: '1px solid #dce3ef',
              borderRadius: '8px',
              fontFamily: 'Source Code Pro',
              fontSize: '12px',
            }}
          />
          <Legend
            formatter={(value) => value === 'populacao' ? 'População' : 'Densidade (mil hab/km²)'}
            wrapperStyle={{ fontSize: '12px', fontFamily: 'Source Code Pro' }}
          />
          <Bar dataKey="populacao" fill="#1a56a0" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

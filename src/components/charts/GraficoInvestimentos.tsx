'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function GraficoInvestimentos() {
  const data = [
    { territorio: 'PPG', valor: 200, cor: '#1a56a0' },
    { territorio: 'Jacarezinho\n+ Manguinhos', valor: 300, cor: '#0ea5e9' },
    { territorio: 'Obras\nRios', valor: 130, cor: '#16a34a' },
  ]

  return (
    <div className="gov-card p-6">
      <h3 className="font-display text-lg font-bold mb-1" style={{ color: 'var(--gov-text)' }}>
        Investimentos do PCI
      </h3>
      <p className="font-mono text-xs mb-6" style={{ color: 'var(--gov-muted)' }}>
        Valores em R$ milhões · Programa Cidade Integrada 2022–2025
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dce3ef" />
          <XAxis
            dataKey="territorio"
            tick={{ fontSize: 11, fontFamily: 'Source Code Pro', fill: '#6b7fa3' }}
            axisLine={{ stroke: '#dce3ef' }}
          />
          <YAxis
            tick={{ fontSize: 11, fontFamily: 'Source Code Pro', fill: '#6b7fa3' }}
            axisLine={{ stroke: '#dce3ef' }}
            tickFormatter={(v) => `R$ ${v}M`}
          />
          <Tooltip
            formatter={(value: any) => [`R$ ${value} milhões`, 'Investimento']}
            contentStyle={{
              background: '#fff',
              border: '1px solid #dce3ef',
              borderRadius: '8px',
              fontFamily: 'Source Code Pro',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.cor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

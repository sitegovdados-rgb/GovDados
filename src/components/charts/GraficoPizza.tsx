'use client'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Props {
  programas: any[]
}

const CORES = ['#1a56a0', '#0ea5e9', '#16a34a', '#d97706', '#9333ea', '#dc2626', '#0891b2', '#65a30d', '#c026d3']

export default function GraficoPizza({ programas }: Props) {
  // Agrupar por área temática
  const contagem: Record<string, number> = {}
  programas.forEach((p: any) => {
    const area = p.area_tematica || 'Outros'
    contagem[area] = (contagem[area] || 0) + 1
  })

  const data = Object.entries(contagem)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  return (
    <div className="gov-card p-6">
      <h3 className="font-display text-lg font-bold mb-1" style={{ color: 'var(--gov-text)' }}>
        Programas por Área Temática
      </h3>
      <p className="font-mono text-xs mb-6" style={{ color: 'var(--gov-muted)' }}>
        {programas.length} programas · PCI 2025
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any, name: string) => [`${value} programa${value !== 1 ? 's' : ''}`, name]}
            contentStyle={{
              background: '#fff',
              border: '1px solid #dce3ef',
              borderRadius: '8px',
              fontFamily: 'Source Code Pro',
              fontSize: '12px',
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '11px', fontFamily: 'Source Code Pro' }}
            formatter={(value) => value.length > 20 ? value.substring(0, 20) + '...' : value}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

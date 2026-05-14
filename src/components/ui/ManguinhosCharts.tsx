'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts'

const CORES_EIXO: Record<string, string> = {
  'Social': '#2563a8', 'Econômico': '#d97706', 'Infraestrutura': '#0891b2',
  'Segurança': '#dc2626', 'Transparência': '#7c3aed', 'Diálogo': '#16a34a',
}
const CHART_COLORS = ['#00a8cc', '#2563a8', '#1a2a5e', '#16a34a']

interface Props {
  dadosEixo:   { name: string; value: number }[]
  dadosStatus: { name: string; value: number }[]
  dadosRaca?:  { name: string; preta: number; parda: number }[]
}

export default function ManguinhosCharts({ dadosEixo, dadosStatus, dadosRaca }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 32 }}>
      {(dadosEixo.length > 0 || dadosStatus.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dadosEixo.length > 0 && (
            <div className="pci-card p-5">
              <p style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.85rem', color: 'var(--pci-navy)', marginBottom: 16 }}>Por eixo</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={dadosEixo} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#8fa3c8' }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#4a5f8a' }} />
                  <Tooltip contentStyle={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11 }} formatter={(v: any) => [v, 'programas']} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {dadosEixo.map((e, i) => <Cell key={i} fill={CORES_EIXO[e.name] || '#2563a8'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          {dadosStatus.length > 0 && (
            <div className="pci-card p-5">
              <p style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.85rem', color: 'var(--pci-navy)', marginBottom: 16 }}>Por status</p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={dadosStatus} cx="50%" cy="50%" outerRadius={60} dataKey="value" nameKey="name"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {dadosStatus.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Legend formatter={(v) => <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, color: '#4a5f8a' }}>{v}</span>} />
                  <Tooltip contentStyle={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
      {dadosRaca && dadosRaca.length > 0 && (
        <div className="pci-card p-5">
          <p style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.85rem', color: 'var(--pci-navy)', marginBottom: 4 }}>
            Composição racial — população preta e parda (%)
          </p>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: '#8fa3c8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
            Fonte: IBGE Censo 2022
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={dadosRaca} margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: '#4a5f8a' }} />
              <YAxis tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#8fa3c8' }} unit="%" domain={[0, 55]} />
              <Tooltip contentStyle={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11 }} formatter={(v: any) => [`${v}%`]} />
              <Bar dataKey="preta" name="Preta" fill="#1a2a5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="parda" name="Parda" fill="#00a8cc" radius={[4, 4, 0, 0]} />
              <Legend formatter={(v) => <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, color: '#4a5f8a' }}>{v}</span>} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

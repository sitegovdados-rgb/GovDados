'use client'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const DADOS = {
  titulo: 'Reabilita 60+',
  tipo: 'Contínua',
  status: 'Em Andamento',
  responsavel: 'Secretaria de Estado de Juventude e Envelhecimento Saudável (SEIJES)',
  sub_territorio: 'Corredor do Itanhangá',
  territorio: 'Cinturão de Jacarepaguá',
  total: 18000,
  media_mensal: 700,
  descricao: 'Programa que oferece sessões gratuitas de reabilitação física — incluindo fisioterapia e educação física — integradas a atividades esportivas e coletivas para pessoas com 60 anos ou mais, com foco em qualidade de vida, autonomia e bem-estar na terceira idade.',
  genero: [
    { nome: 'Feminino',  valor: 85.7 },
    { nome: 'Masculino', valor: 14.3 },
  ],
  raca: [
    { nome: 'Parda',    valor: 46 },
    { nome: 'Branca',   valor: 39 },
    { nome: 'Preta',    valor: 12 },
    { nome: 'Indígena', valor: 2  },
    { nome: 'Amarela',  valor: 1  },
  ],
  escolaridade: [
    { nivel: 'Fund. Completo', valor: 53 },
    { nivel: 'Médio Completo', valor: 26 },
    { nivel: 'Sem instrução',  valor: 17 },
    { nivel: 'Sup. Completo',  valor: 4  },
  ],
  modalidades: [
    { nome: 'Educação Física', participantes: 689 },
    { nome: 'Fisioterapia',    participantes: 95  },
  ],
}

const CORES_G = ['#2563a8', '#00a8cc']
const CORES_R = ['#1a2a5e', '#2563a8', '#00a8cc', '#4a5f8a', '#8fa3c8']
const CORES_E = ['#1a2a5e', '#2563a8', '#00a8cc', '#4a5f8a']
const label   = { fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: '#8fa3c8', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }
const tip     = { fontFamily: 'JetBrains Mono', fontSize: 11, borderRadius: 8, border: '1px solid #d4dff0' }

export default function Reabilita60Page() {
  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, var(--pci-navy) 0%, #1e3a8a 100%)', color: 'white', borderBottom: '3px solid var(--pci-cyan)' }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <Link href="/programas" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Programas Sociais</Link>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>›</span>
            <Link href="/territorios/cinturao-jacarepagua" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cinturão de Jacarepaguá</Link>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>›</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Reabilita 60+</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            <span className="pci-tag-navy">{DADOS.tipo}</span>
            <span className="pci-tag-navy" style={{ background: 'rgba(22,163,74,0.2)', color: '#86efac', borderColor: 'rgba(22,163,74,0.3)' }}>{DADOS.status}</span>
          </div>

          <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.1, marginBottom: 10 }}>
            {DADOS.titulo}
          </h1>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.88rem', color: 'rgba(255,255,255,0.65)', maxWidth: 580, lineHeight: 1.7, marginBottom: 16 }}>
            {DADOS.descricao}
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)' }}>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>📍</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{DADOS.sub_territorio}</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{DADOS.territorio}</span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { n: DADOS.total.toLocaleString('pt-BR'), label: 'Participantes',  sub: 'total acumulado' },
                { n: DADOS.media_mensal.toLocaleString('pt-BR'), label: 'Média mensal', sub: 'participantes por mês' },
                { n: '85,7%', label: 'Feminino',     sub: 'maioria de mulheres' },
                { n: '60+',   label: 'Faixa etária', sub: '100% idosos' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '18px 24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                  <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '1.6rem', color: 'var(--pci-cyan)', lineHeight: 1 }}>{item.n}</p>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.75rem', color: 'white', marginTop: 4 }}>{item.label}</p>
                  <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">

        {/* Modalidades */}
        <section>
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.5rem', marginBottom: 20 }}>Modalidades de Atendimento</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DADOS.modalidades.map((m, i) => (
              <div key={i} className="pci-card p-6" style={{ borderLeft: '4px solid var(--pci-cyan)' }}>
                <p style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '1rem', color: 'var(--pci-navy)', marginBottom: 8 }}>{m.nome}</p>
                <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '2rem', color: 'var(--pci-blue)' }}>{m.participantes.toLocaleString('pt-BR')}</p>
                <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>participantes acumulados</p>
              </div>
            ))}
          </div>
        </section>

        {/* Gênero + Raça/Cor */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="pci-card p-6">
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.9rem', color: 'var(--pci-navy)', marginBottom: 4 }}>Gênero</h3>
              <p style={label}>distribuição por gênero</p>
              <ResponsiveContainer width="100%" height={220} style={{ marginTop: 20 }}>
                <PieChart>
                  <Pie data={DADOS.genero} cx="40%" cy="50%" outerRadius={85} dataKey="valor" nameKey="nome">
                    {DADOS.genero.map((_, i) => <Cell key={i} fill={CORES_G[i]} />)}
                  </Pie>
                  <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: 11 }} />
                  <Tooltip formatter={(v) => `${v}%`} contentStyle={tip} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="pci-card p-6">
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.9rem', color: 'var(--pci-navy)', marginBottom: 4 }}>Raça / Cor</h3>
              <p style={label}>% por autodeclaração</p>
              <ResponsiveContainer width="100%" height={220} style={{ marginTop: 20 }}>
                <BarChart data={DADOS.raca} margin={{ left: 0, right: 16, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d4dff0" />
                  <XAxis dataKey="nome" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#8fa3c8' }} />
                  <YAxis tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#8fa3c8' }} tickFormatter={v => `${v}%`} />
                  <Tooltip formatter={(v) => `${v}%`} contentStyle={tip} />
                  <Bar dataKey="valor" radius={[4, 4, 0, 0]} name="Participantes">
                    {DADOS.raca.map((_, i) => <Cell key={i} fill={CORES_R[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Escolaridade */}
        <section>
          <div className="pci-card p-6">
            <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.9rem', color: 'var(--pci-navy)', marginBottom: 4 }}>Nível de Escolaridade</h3>
            <p style={label}>% dos participantes</p>
            <ResponsiveContainer width="100%" height={200} style={{ marginTop: 20 }}>
              <BarChart data={DADOS.escolaridade} layout="vertical" margin={{ left: 8, right: 32, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d4dff0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#8fa3c8' }} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="nivel" width={140} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#4a5f8a' }} />
                <Tooltip formatter={(v) => `${v}%`} contentStyle={tip} />
                <Bar dataKey="valor" radius={[0, 4, 4, 0]} name="Participantes">
                  {DADOS.escolaridade.map((_, i) => <Cell key={i} fill={CORES_E[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className="pci-card p-5" style={{ borderLeft: '4px solid var(--pci-border)' }}>
          <p style={label}>Fonte dos dados</p>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.82rem', color: 'var(--pci-dim)', marginTop: 6, lineHeight: 1.6 }}>
            Dados extraídos do sistema de monitoramento do Programa Cidade Integrada. Programa realizado no Corredor do Itanhangá, integrante do Cinturão de Jacarepaguá. Status: Aguardando informação adicional para atualização completa.
          </p>
        </div>

        <Link href="/programas" className="pci-btn-outline" style={{ display: 'inline-block' }}>← Voltar aos Programas</Link>
      </div>
    </div>
  )
}

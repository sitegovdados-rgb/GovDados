'use client'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const DADOS = {
  titulo: 'Desenvolve Mulher',
  edicao: '2022',
  tipo: 'Temporária',
  status: 'Concluída',
  responsavel: 'Secretaria de Estado de Desenvolvimento Social e Direitos Humanos',
  sub_territorio: 'Corredor do Itanhangá',
  territorio: 'Cinturão de Jacarepaguá',
  total: 723,
  media_mensal: 72,
  descricao: 'Programa voltado à promoção de mobilidade social e ruptura do ciclo intergeracional de pobreza em famílias monoparentais chefiadas por mulheres em situação de vulnerabilidade socioeconômica, por meio da inclusão produtiva e geração de renda. Cursos oferecidos: Cuidadora de Idosos, Maquiagem, Designer de Unhas e Tranças.',
  raca: [
    { nome: 'Preta',  valor: 87 },
    { nome: 'Branca', valor: 10 },
    { nome: 'Outras', valor: 3  },
  ],
  faixa_etaria: [
    { faixa: '13–18',  valor: 24  },
    { faixa: '19–24',  valor: 380 },
    { faixa: '25–34',  valor: 318 },
  ],
  escolaridade: [
    { nivel: 'Fund. Incompleto', valor: 31.9 },
    { nivel: 'Médio Completo',   valor: 27.8 },
    { nivel: 'Médio Incompleto', valor: 21.0 },
    { nivel: 'Fund. Completo',   valor: 9.2  },
    { nivel: 'Sup. Incompleto',  valor: 5.0  },
    { nivel: 'Sup. Completo',    valor: 2.5  },
  ],
  renda: [
    { faixa: '½ Salário Mín.',   valor: 53.4 },
    { faixa: 'Sem renda',        valor: 32.4 },
    { faixa: '½ a 1 Sal. Mín.', valor: 10.1 },
    { faixa: '2 a 3 Sal. Mín.', valor: 0.8  },
  ],
  recebe_auxilio: 55.5,
}

const CORES = ['#1a2a5e', '#2563a8', '#00a8cc', '#4a5f8a', '#8fa3c8', '#d4dff0']
const label = { fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: '#8fa3c8', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }
const tip   = { fontFamily: 'JetBrains Mono', fontSize: 11, borderRadius: 8, border: '1px solid #d4dff0' }

export default function DesenvolveMulherPage() {
  return (
    <div>
      {/* Header */}
      <section style={{ background: 'linear-gradient(135deg, var(--pci-navy) 0%, #1e3a8a 100%)', color: 'white', borderBottom: '3px solid var(--pci-cyan)' }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <Link href="/programas" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Programas Sociais</Link>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>›</span>
            <Link href="/territorios/cinturao-jacarepagua/corredor-itanhanga" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Corredor do Itanhangá</Link>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>›</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Desenvolve Mulher</span>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            <span className="pci-tag-navy">{DADOS.tipo}</span>
            <span className="pci-tag-navy" style={{ background: 'rgba(22,163,74,0.2)', color: '#86efac', borderColor: 'rgba(22,163,74,0.3)' }}>{DADOS.status}</span>
            <span className="pci-tag-navy">{DADOS.edicao}</span>
          </div>

          <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.1, marginBottom: 10 }}>
            {DADOS.titulo} <span style={{ color: 'var(--pci-cyan)' }}>({DADOS.edicao})</span>
          </h1>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.88rem', color: 'rgba(255,255,255,0.65)', maxWidth: 580, lineHeight: 1.7, marginBottom: 16 }}>
            {DADOS.descricao}
          </p>

          {/* Hierarquia territorial */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)' }}>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>📍</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--pci-cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{DADOS.sub_territorio}</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{DADOS.territorio}</span>
          </div>
        </div>

        {/* Métricas */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-3">
              {[
                { n: DADOS.total.toLocaleString('pt-BR'), label: 'Participantes',   sub: 'total ao longo do programa' },
                { n: DADOS.media_mensal,                  label: 'Média mensal',    sub: 'participantes por mês' },
                { n: '100%',                              label: 'Público feminino',sub: 'exclusivo para mulheres' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '18px 24px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                  <p style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '1.8rem', color: 'var(--pci-cyan)', lineHeight: 1 }}>{item.n}</p>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.78rem', color: 'white', marginTop: 4 }}>{item.label}</p>
                  <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">

        {/* Raça/Cor + Faixa Etária */}
        <section>
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '1.5rem', marginBottom: 20 }}>Perfil das Participantes</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="pci-card p-6">
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.9rem', color: 'var(--pci-navy)', marginBottom: 4 }}>Raça / Cor</h3>
              <p style={label}>autodeclaração · % das participantes</p>
              <ResponsiveContainer width="100%" height={220} style={{ marginTop: 20 }}>
                <PieChart>
                  <Pie data={DADOS.raca} cx="40%" cy="50%" outerRadius={85} dataKey="valor" nameKey="nome">
                    {DADOS.raca.map((_, i) => <Cell key={i} fill={CORES[i]} />)}
                  </Pie>
                  <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: 11 }} formatter={v => `${v}`} />
                  <Tooltip formatter={(v) => `${v}%`} contentStyle={tip} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="pci-card p-6">
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.9rem', color: 'var(--pci-navy)', marginBottom: 4 }}>Faixa Etária</h3>
              <p style={label}>número de participantes por faixa</p>
              <ResponsiveContainer width="100%" height={220} style={{ marginTop: 20 }}>
                <BarChart data={DADOS.faixa_etaria} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d4dff0" />
                  <XAxis dataKey="faixa" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: '#8fa3c8' }} />
                  <YAxis tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#8fa3c8' }} />
                  <Tooltip contentStyle={tip} formatter={(v: any) => [v, 'Participantes']} />
                  <Bar dataKey="valor" fill="#1a2a5e" radius={[4, 4, 0, 0]} name="Participantes" />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--pci-light)', borderRadius: 8, borderLeft: '3px solid var(--pci-cyan)' }}>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.82rem', color: 'var(--pci-dim)' }}>
                  <strong style={{ color: 'var(--pci-navy)' }}>97,9%</strong> das participantes têm entre 19 e 34 anos — mulheres jovens em fase produtiva.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Escolaridade + Renda */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="pci-card p-6">
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.9rem', color: 'var(--pci-navy)', marginBottom: 4 }}>Nível de Escolaridade</h3>
              <p style={label}>% das participantes</p>
              <ResponsiveContainer width="100%" height={230} style={{ marginTop: 20 }}>
                <BarChart data={DADOS.escolaridade} layout="vertical" margin={{ left: 8, right: 32, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d4dff0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#8fa3c8' }} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="nivel" width={135} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#4a5f8a' }} />
                  <Tooltip formatter={(v) => `${v}%`} contentStyle={tip} />
                  <Bar dataKey="valor" radius={[0, 4, 4, 0]} name="Participantes">
                    {DADOS.escolaridade.map((_, i) => <Cell key={i} fill={CORES[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pci-card p-6">
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.9rem', color: 'var(--pci-navy)', marginBottom: 4 }}>Renda Familiar</h3>
              <p style={label}>% das participantes por faixa de renda</p>
              <ResponsiveContainer width="100%" height={230} style={{ marginTop: 20 }}>
                <BarChart data={DADOS.renda} layout="vertical" margin={{ left: 8, right: 32, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d4dff0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#8fa3c8' }} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="faixa" width={135} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#4a5f8a' }} />
                  <Tooltip formatter={(v) => `${v}%`} contentStyle={tip} />
                  <Bar dataKey="valor" fill="#2563a8" radius={[0, 4, 4, 0]} name="Participantes" />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--pci-light)', borderRadius: 8, borderLeft: '3px solid var(--pci-cyan)' }}>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.82rem', color: 'var(--pci-dim)' }}>
                  <strong style={{ color: 'var(--pci-navy)' }}>{DADOS.recebe_auxilio}%</strong> das participantes recebem auxílios governamentais — população em alta vulnerabilidade econômica.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Nota metodológica */}
        <div className="pci-card p-5" style={{ borderLeft: '4px solid var(--pci-border)' }}>
          <p style={label}>Fonte dos dados</p>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.82rem', color: 'var(--pci-dim)', marginTop: 6, lineHeight: 1.6 }}>
            Dados extraídos do sistema de monitoramento do Programa Cidade Integrada, com coleta por autodeclaração das participantes. Programa realizado no Corredor do Itanhangá, integrante do Cinturão de Jacarepaguá. Atualização: 2022.
          </p>
        </div>

        <Link href="/programas" className="pci-btn-outline" style={{ display: 'inline-block' }}>← Voltar aos Programas</Link>
      </div>
    </div>
  )
}

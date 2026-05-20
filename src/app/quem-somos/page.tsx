import Link from 'next/link'

export default function QuemSomosPage() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="pci-accent-line" />
          <h2 className="pci-title" style={{ fontSize: '2rem', marginBottom: 16 }}>O que é o Programa Cidade Integrada</h2>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.95rem', color: 'var(--pci-dim)', lineHeight: 1.8, marginBottom: 16 }}>
            O <strong>Programa Cidade Integrada</strong> é uma iniciativa do Governo do Estado do Rio de Janeiro que visa a integração entre bairros formais e informais através de investimentos estratégicos.
          </p>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.95rem', color: 'var(--pci-dim)', lineHeight: 1.8, marginBottom: 24 }}>
            O programa atua em territórios historicamente conflagrados do Rio de Janeiro, promovendo o novo ordenamento socioterritorial.
          </p>
          <Link href="/territorios" className="pci-btn">Ver Territórios</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '👥', label: 'Social', desc: 'Ações e serviços sociais para a população' },
            { icon: '💼', label: 'Econômico', desc: 'Geração de renda e inclusão produtiva' },
            { icon: '🏗️', label: 'Infraestrutura', desc: 'Urbanismo social e obras públicas' },
            { icon: '🛡️', label: 'Segurança', desc: 'Planejamento e combate ao crime' },
            { icon: '📊', label: 'Transparência', desc: 'Dados abertos e prestação de contas' },
            { icon: '🤝', label: 'Diálogo', desc: 'Governança e participação comunitária' },
          ].map((eixo, i) => (
            <div key={i} className="pci-card p-4">
              <span style={{ fontSize: '1.4rem', display: 'block', marginBottom: 8 }}>{eixo.icon}</span>
              <p style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.85rem', color: 'var(--pci-navy)', marginBottom: 4 }}>{eixo.label}</p>
              <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.75rem', color: 'var(--pci-dim)', lineHeight: 1.5 }}>{eixo.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

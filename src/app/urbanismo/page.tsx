import Link from 'next/link'

export default function UrbanismoPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--pci-light)', border: '1px solid var(--pci-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '1.8rem' }}>
          🔧
        </div>
        <span className="pci-tag mb-4">Em Desenvolvimento</span>
        <h1 className="pci-title" style={{ fontSize: '2rem', marginTop: 16, marginBottom: 12 }}>Urbanismo</h1>
        <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.95rem', color: 'var(--pci-dim)', lineHeight: 1.7, marginBottom: 32 }}>
          A seção de Urbanismo está em desenvolvimento. Em breve disponibilizaremos informações completas sobre os projetos arquitetônicos e intervenções urbanísticas do Programa Cidade Integrada.
        </p>
        <Link href="/" className="pci-btn-outline">Voltar ao início</Link>
      </div>
    </div>
  )
}

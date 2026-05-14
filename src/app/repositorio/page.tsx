import Link from 'next/link'

export default function RepositorioPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--pci-light)', border: '1px solid var(--pci-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '1.8rem' }}>
          🔧
        </div>
        <span className="pci-tag mb-4">Em Desenvolvimento</span>
        <h1 className="pci-title" style={{ fontSize: '2rem', marginTop: 16, marginBottom: 12 }}>Repositório</h1>
        <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.95rem', color: 'var(--pci-dim)', lineHeight: 1.7, marginBottom: 32 }}>
          O Repositório de documentos está em desenvolvimento. Em breve disponibilizaremos relatórios, levantamentos e documentos técnicos do Programa Cidade Integrada para consulta e download.
        </p>
        <Link href="/" className="pci-btn-outline">Voltar ao início</Link>
      </div>
    </div>
  )
}

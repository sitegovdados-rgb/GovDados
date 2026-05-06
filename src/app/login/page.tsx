'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [senha, setSenha]     = useState('')
  const [erro, setErro]       = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro(false)

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senha }),
    })

    if (res.ok) {
      router.push('/')
      router.refresh()
    } else {
      setErro(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gov-bg)' }}>
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--gov-accent)' }}>
            <span className="text-white font-mono text-xl font-bold">GD</span>
          </div>
          <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--gov-text)' }}>GovDados</h1>
          <p className="font-mono text-xs" style={{ color: 'var(--gov-muted)' }}>Acesso restrito · Rio de Janeiro</p>
        </div>

        {/* Formulário */}
        <div className="gov-card p-8">
          <p className="text-sm mb-6 text-center" style={{ color: 'var(--gov-textDim)' }}>
            Insira a senha para acessar o painel de dados.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-mono text-xs uppercase tracking-widest mb-2 block" style={{ color: 'var(--gov-muted)' }}>
                Senha de acesso
              </label>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="••••••••••••••••••"
                required
                autoFocus
                className="w-full px-4 py-3 rounded-lg border outline-none text-sm transition-colors"
                style={{
                  background: 'var(--gov-bg)',
                  borderColor: erro ? '#dc2626' : 'var(--gov-border)',
                  color: 'var(--gov-text)',
                }}
              />
              {erro && (
                <p className="font-mono text-xs mt-2" style={{ color: '#dc2626' }}>
                  Senha incorreta. Tente novamente.
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !senha}
              className="w-full py-3 rounded-lg font-body font-semibold text-sm text-white transition-all"
              style={{
                background: loading || !senha ? 'var(--gov-muted)' : 'var(--gov-accent)',
                cursor: loading || !senha ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center font-mono text-xs mt-6" style={{ color: 'var(--gov-muted)' }}>
          Programa Cidade Integrada · Governo do Estado do RJ
        </p>
      </div>
    </div>
  )
}

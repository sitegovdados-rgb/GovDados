'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [senha, setSenha]     = useState('')
  const [erro, setErro]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [exitAnimation, setExitAnimation] = useState(false)
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
      setExitAnimation(true)
      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 600)
    } else {
      setErro(true)
      setLoading(false)
    }
  }

  return (
    <div 
      className={`min-h-screen flex items-center justify-center px-4 transition-all duration-600 ${
        exitAnimation ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
      style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f4c75 100%)',
      }}
    >
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg" 
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' }}
          >
            <span className="text-white font-mono text-xl font-bold">GD</span>
          </div>
          <h1 className="font-display text-3xl font-bold mb-1" style={{ color: '#f0f9ff' }}>GovDados</h1>
          <p className="font-mono text-xs" style={{ color: '#cbd5e1' }}>Acesso restrito · Rio de Janeiro</p>
        </div>

        {/* Formulário */}
        <div 
          className="p-8 rounded-2xl shadow-2xl border"
          style={{
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(10px)',
            borderColor: 'rgba(148, 163, 184, 0.2)',
          }}
        >
          <p className="text-sm mb-6 text-center" style={{ color: '#cbd5e1' }}>
            Insira a senha para acessar o painel de dados.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-mono text-xs uppercase tracking-widest mb-2 block" style={{ color: '#94a3b8' }}>
                Senha de acesso
              </label>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="••••••••••••••••••"
                required
                autoFocus
                disabled={loading || exitAnimation}
                className="w-full px-4 py-3 rounded-lg border outline-none text-sm transition-colors focus:ring-2 focus:ring-offset-2"
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderColor: erro ? '#ef4444' : 'rgba(148, 163, 184, 0.3)',
                  color: '#f0f9ff',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6'
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = erro ? '#ef4444' : 'rgba(148, 163, 184, 0.3)'
                }}
              />
              {erro && (
                <p className="font-mono text-xs mt-2" style={{ color: '#fca5a5' }}>
                  ✕ Senha incorreta. Tente novamente.
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !senha || exitAnimation}
              className="w-full py-3 rounded-lg font-body font-semibold text-sm text-white transition-all duration-200 hover:shadow-lg"
              style={{
                background: loading || !senha || exitAnimation
                  ? 'rgba(148, 163, 184, 0.5)' 
                  : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                cursor: loading || !senha || exitAnimation ? 'not-allowed' : 'pointer',
                opacity: loading || !senha || exitAnimation ? 0.7 : 1,
              }}
            >
              {exitAnimation ? '✓ Redirecionando...' : loading ? '⌛ Verificando...' : '→ Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center font-mono text-xs mt-6" style={{ color: '#94a3b8' }}>
          Programa Cidade Integrada · Governo do Estado do RJ
        </p>
      </div>
    </div>
  )
}

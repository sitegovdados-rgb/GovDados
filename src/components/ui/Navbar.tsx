'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/',                label: 'Início' },
  { href: '/territorios',     label: 'Territórios' },
  { href: '/programas',       label: 'Programas Sociais' },
  { href: '/urbanismo',       label: 'Urbanismo' },
  { href: '/repositorio',     label: 'Repositório' },
  { href: '/dados',           label: 'Dados Abertos' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header style={{ background: 'var(--pci-navy)', borderBottom: '3px solid var(--pci-cyan)' }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'var(--pci-cyan)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'Sora', fontSize: 11, fontWeight: 800, color: 'var(--pci-navy)', letterSpacing: '0.02em' }}>PCI</span>
          </div>
          <div>
            <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.95rem', color: 'white', letterSpacing: '-0.01em', display: 'block' }}>
              Cidade Integrada
            </span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Painel de Dados · Estado do RJ
            </span>
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          {links.map(link => {
            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link key={link.href} href={link.href} style={{
                fontFamily: 'Plus Jakarta Sans',
                fontWeight: active ? 600 : 400,
                fontSize: '0.8rem',
                padding: '8px 14px',
                borderRadius: 6,
                color: active ? 'white' : 'rgba(255,255,255,0.55)',
                background: active ? 'rgba(0,168,204,0.2)' : 'transparent',
                transition: 'all 0.15s',
              }}>
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile */}
        <button className="lg:hidden" onClick={() => setOpen(!open)} style={{ color: 'rgba(255,255,255,0.7)' }}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
          {links.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} style={{
              display: 'block', padding: '14px 24px',
              fontFamily: 'Plus Jakarta Sans', fontSize: '0.85rem',
              color: pathname === link.href ? 'var(--pci-cyan)' : 'rgba(255,255,255,0.6)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}

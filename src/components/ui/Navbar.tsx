'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/',             label: 'Início' },
  { href: '/painel',       label: 'Painel' },
  { href: '/programas',    label: 'Programas' },
  { href: '/territorios',  label: 'Territórios' },
  { href: '/dados',        label: 'Dados Abertos' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header style={{ background: 'var(--ink)', borderBottom: '2px solid var(--ink)' }}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div style={{
            width: 28, height: 28,
            background: 'var(--paper)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, fontWeight: 600, color: 'var(--ink)', letterSpacing: '0.05em' }}>GD</span>
          </div>
          <div>
            <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: '1.1rem', color: 'var(--paper)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              GovDados
            </span>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: 'rgba(248,246,241,0.4)', display: 'block', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 1 }}>
              Rio de Janeiro · 2025
            </span>
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: 'IBM Plex Mono',
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '0 16px',
                height: 56,
                display: 'flex',
                alignItems: 'center',
                color: pathname === link.href ? 'var(--ink)' : 'rgba(248,246,241,0.55)',
                background: pathname === link.href ? 'var(--paper)' : 'transparent',
                borderLeft: '1px solid rgba(248,246,241,0.1)',
                transition: 'all 0.15s',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile */}
        <button className="md:hidden" onClick={() => setOpen(!open)}
          style={{ color: 'rgba(248,246,241,0.7)' }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {open && (
        <nav style={{ borderTop: '1px solid rgba(248,246,241,0.1)' }}>
          {links.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '14px 24px',
                fontFamily: 'IBM Plex Mono',
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: pathname === link.href ? 'var(--paper)' : 'rgba(248,246,241,0.5)',
                borderBottom: '1px solid rgba(248,246,241,0.08)',
              }}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}

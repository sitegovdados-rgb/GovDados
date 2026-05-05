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
    <header className="sticky top-0 z-50 bg-white border-b border-gov-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gov-accent)' }}>
            <span className="text-white font-mono text-xs font-bold">GD</span>
          </div>
          <div>
            <span className="font-display font-bold text-gov-text text-base leading-none">GovDados</span>
            <span className="block font-mono text-[9px] tracking-widest uppercase" style={{ color: 'var(--gov-muted)' }}>Rio de Janeiro</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(link => (
            <Link key={link.href} href={link.href}
              className={`px-4 py-2 rounded-md text-sm font-body transition-colors ${
                pathname === link.href
                  ? 'text-white font-semibold'
                  : 'hover:bg-gov-light'
              }`}
              style={pathname === link.href ? { background: 'var(--gov-accent)', color: '#fff' } : { color: 'var(--gov-textDim)' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span className="font-mono text-xs" style={{ color: 'var(--gov-muted)' }}>Dados atualizados</span>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu"
          style={{ color: 'var(--gov-muted)' }}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t bg-white px-6 py-4 flex flex-col gap-1" style={{ borderColor: 'var(--gov-border)' }}>
          {links.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-md text-sm transition-colors"
              style={{ color: pathname === link.href ? 'var(--gov-accent)' : 'var(--gov-textDim)' }}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}

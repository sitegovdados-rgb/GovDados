'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/',          label: 'Início' },
  { href: '/painel',    label: 'Painel' },
  { href: '/programas', label: 'Programas' },
  { href: '/territorios', label: 'Territórios' },
  { href: '/dados',     label: 'Dados Abertos' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-gov-border bg-gov-bg/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded bg-gov-accent flex items-center justify-center">
            <span className="text-white font-mono text-xs font-bold">GD</span>
          </div>
          <div>
            <span className="font-display font-bold text-gov-text text-lg leading-none">GovDados</span>
            <span className="block font-mono text-[10px] text-gov-textDim tracking-widest uppercase">Rio de Janeiro</span>
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded text-sm font-body transition-colors ${
                pathname === link.href
                  ? 'text-gov-highlight bg-gov-accent/10'
                  : 'text-gov-textDim hover:text-gov-text hover:bg-gov-surface'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Badge institucional */}
        <div className="hidden md:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="font-mono text-xs text-gov-textDim">Dados atualizados</span>
        </div>

        {/* Menu mobile */}
        <button
          className="md:hidden text-gov-textDim hover:text-gov-text"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Menu mobile aberto */}
      {open && (
        <nav className="md:hidden border-t border-gov-border bg-gov-surface px-6 py-4 flex flex-col gap-2">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`px-4 py-2 rounded text-sm font-body transition-colors ${
                pathname === link.href
                  ? 'text-gov-highlight bg-gov-accent/10'
                  : 'text-gov-textDim hover:text-gov-text'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}

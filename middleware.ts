import { NextRequest, NextResponse } from 'next/server'

const SENHA_CORRETA = process.env.SITE_SENHA || 'cidadeintegrada@secc'
const COOKIE_NAME   = 'govdados_auth'
const COOKIE_VALOR  = 'autorizado'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Liberar a rota de login
  if (pathname === '/login') return NextResponse.next()

  // Verificar cookie de autenticação
  const cookie = request.cookies.get(COOKIE_NAME)
  if (cookie?.value === COOKIE_VALOR) return NextResponse.next()

  // Redirecionar para login
  const url = request.nextUrl.clone()
  url.pathname = '/login'
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)',
  ],
}

import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME  = 'govdados_auth'
const COOKIE_VALOR = 'autorizado'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/login' || pathname.startsWith('/api/login')) return NextResponse.next()
  const cookie = request.cookies.get(COOKIE_NAME)
  if (cookie?.value === COOKIE_VALOR) return NextResponse.next()
  const url = request.nextUrl.clone()
  url.pathname = '/login'
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)'],
}

import { NextRequest, NextResponse } from 'next/server'

const SENHA_CORRETA = process.env.SITE_SENHA || 'cidadeintegrada@secc'

export async function POST(request: NextRequest) {
  const { senha } = await request.json()

  if (senha !== SENHA_CORRETA) {
    return NextResponse.json({ erro: 'Senha incorreta' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })

  response.cookies.set('govdados_auth', 'autorizado', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 dias
    path: '/',
  })

  return response
}

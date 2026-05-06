import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { senha } = body

    if (senha !== 'cidadeintegrada@secc') {
      return NextResponse.json({ erro: 'Senha incorreta' }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set('govdados_auth', 'autorizado', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ erro: 'Erro interno' }, { status: 500 })
  }
}

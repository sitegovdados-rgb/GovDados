import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ erro: 'ID necessário' }, { status: 400 })

  try {
    const res = await fetch(`https://drive.google.com/uc?export=view&id=${id}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      redirect: 'follow',
    })
    if (!res.ok) return NextResponse.json({ erro: 'Imagem não encontrada' }, { status: 404 })

    const buffer = await res.arrayBuffer()
    const contentType = res.headers.get('content-type') || 'image/jpeg'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch {
    return NextResponse.json({ erro: 'Erro ao buscar imagem' }, { status: 500 })
  }
}

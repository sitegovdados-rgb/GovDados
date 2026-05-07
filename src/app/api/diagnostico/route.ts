import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { subTerritorio, indicadores, programas, equipamentos } = await request.json()

    const indResumo = indicadores.slice(0, 15).map((i: any) =>
      `${i.nome}: ${i.valor} ${i.unidade}`
    ).join('\n')

    const progResumo = programas.slice(0, 10).map((p: any) =>
      `${p.titulo} (${p.status}) — ${p.beneficiarios ? p.beneficiarios.toLocaleString('pt-BR') + ' ' + p.unidade_beneficiarios : 'sem dados'}`
    ).join('\n')

    const equipResumo = equipamentos.slice(0, 10).map((e: any) =>
      `${e.nome} (${e.tipo} · ${e.subtipo})`
    ).join('\n')

    const prompt = `Você é um analista de políticas públicas especializado em urbanismo social e desenvolvimento territorial em favelas cariocas.

Analise os dados do sub-território "${subTerritorio}" do Programa Cidade Integrada (PCI) e gere um diagnóstico territorial objetivo e técnico.

INDICADORES SOCIOGRÁFICOS:
${indResumo}

PROGRAMAS SOCIAIS EM ANDAMENTO:
${progResumo}

EQUIPAMENTOS PÚBLICOS MAPEADOS:
${equipResumo}

Gere um diagnóstico territorial com exatamente 4 seções:

1. PERFIL POPULACIONAL: Síntese dos dados demográficos, destacando os indicadores mais relevantes e o que eles revelam sobre a população.

2. VULNERABILIDADES IDENTIFICADAS: 2-3 pontos críticos baseados nos dados, como déficits de infraestrutura, baixa cobertura de serviços, indicadores socioeconômicos preocupantes.

3. CAPACIDADES E ATIVOS: O que o território já tem em termos de equipamentos, programas e organização que representa um ponto positivo.

4. RECOMENDAÇÕES PRIORITÁRIAS: 2-3 ações concretas baseadas nos dados que o PCI deveria priorizar neste sub-território.

Use linguagem técnica mas acessível. Seja objetivo e baseado exclusivamente nos dados fornecidos. Máximo de 400 palavras no total.`

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await res.json()
    const texto = data.content?.[0]?.text || 'Não foi possível gerar o diagnóstico.'

    return NextResponse.json({ diagnostico: texto })
  } catch (e) {
    return NextResponse.json({ diagnostico: 'Erro ao processar. Tente novamente.' }, { status: 500 })
  }
}

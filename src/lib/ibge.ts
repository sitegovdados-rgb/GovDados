// API IBGE SIDRA — gratuita, sem chave de acesso
// Documentação: https://servicodados.ibge.gov.br/api/docs/agregados

const IBGE_BASE = 'https://servicodados.ibge.gov.br/api/v3/agregados'

const BRASIL = 'N1[1]'
const ESTADO_RJ = 'N3[33]'
const MUNICIPIO_RJ = 'N6[3304557]'

async function fetchIBGE(url: string) {
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function getPopulacaoContexto() {
  const url = `${IBGE_BASE}/9514/periodos/2022/variaveis/93?localidades=${BRASIL}|${ESTADO_RJ}|${MUNICIPIO_RJ}`
  const data = await fetchIBGE(url)
  if (!data || !Array.isArray(data)) return null

  const resultado: Record<string, number | null> = {
    brasil: null, estado_rj: null, municipio_rj: null,
  }

  for (const variavel of data) {
    for (const resultado_local of variavel.resultados || []) {
      for (const [codigo, valor] of Object.entries(resultado_local.series || {})) {
        const v = parseInt((valor as any)?.['2022'] || '0')
        if (codigo === '1')       resultado.brasil = v
        if (codigo === '33')      resultado.estado_rj = v
        if (codigo === '3304557') resultado.municipio_rj = v
      }
    }
  }
  return resultado
}

export async function getAlfabetizacaoContexto() {
  const url = `${IBGE_BASE}/9543/periodos/2022/variaveis/10605?localidades=${BRASIL}|${ESTADO_RJ}|${MUNICIPIO_RJ}`
  const data = await fetchIBGE(url)
  if (!data || !Array.isArray(data)) return null

  const resultado: Record<string, number | null> = {
    brasil: null, estado_rj: null, municipio_rj: null,
  }

  for (const variavel of data) {
    for (const resultado_local of variavel.resultados || []) {
      for (const [codigo, valor] of Object.entries(resultado_local.series || {})) {
        const v = parseFloat((valor as any)?.['2022'] || '0')
        if (codigo === '1')       resultado.brasil = v
        if (codigo === '33')      resultado.estado_rj = v
        if (codigo === '3304557') resultado.municipio_rj = v
      }
    }
  }
  return resultado
}

// ─── Dados estáticos do IBGE Censo 2022 ────────────────────────────────────

// Contexto nacional — fallback se a API falhar
export const CONTEXTO_NACIONAL = {
  populacao: {
    brasil:       203062512,
    estado_rj:     16054524,
    municipio_rj:   6211423,
  },
  alfabetizacao: {
    brasil:       88.0,
    estado_rj:    93.5,
    municipio_rj: 96.2,
  },
  densidade: {
    brasil:        23.8,
    estado_rj:    365.2,
    municipio_rj: 5325.0,
  },
}

// ─── Dados específicos de Favelas e Comunidades Urbanas ────────────────────
// Fonte: IBGE — Censo Demográfico 2022 — Favelas e Comunidades Urbanas
// Publicado em novembro de 2024

export const DADOS_FAVELAS: Record<string, {
  ranking_moradores_brasil?: number
  ranking_domicilios_brasil?: number
  moradores: number
  domicilios: number
  contexto: string
  destaque?: string
}> = {
  'Jacarezinho': {
    ranking_moradores_brasil: 5,
    ranking_domicilios_brasil: 9,
    moradores: 29766,
    domicilios: 10936,
    contexto: 'Zona Norte do Rio de Janeiro, ao longo das linhas férreas e Avenida Brasil.',
    destaque: '5ª maior favela do Brasil em número de moradores (Censo 2022)',
  },
  'Rio das Pedras': {
    ranking_domicilios_brasil: 2,
    moradores: 64988,
    domicilios: 23846,
    contexto: 'Zona Sudoeste do Rio de Janeiro, em Jacarepaguá. Um dos maiores aglomerados da região.',
    destaque: '2ª maior favela do Brasil em número de domicílios (Censo 2022)',
  },
  'Manguinhos': {
    moradores: 17249,
    domicilios: 6200,
    contexto: 'Zona Norte do Rio de Janeiro. Grande aglomerado ao longo da Avenida Brasil.',
    destaque: 'Um dos maiores complexos de favelas da Zona Norte carioca',
  },
  'Corredor Itanhangá': {
    moradores: 29165,
    domicilios: 13347,
    contexto: 'Zona Sudoeste do Rio de Janeiro, em Jacarepaguá.',
    destaque: 'Território com alta densidade — 41.685 hab/km²',
  },
  'Pavão-Pavãozinho e Cantagalo': {
    moradores: 0,
    domicilios: 0,
    contexto: 'Zona Sul do Rio de Janeiro, entre Copacabana e Ipanema.',
    destaque: 'Comunidade na Zona Sul — área nobre da cidade',
  },
}

// Contexto geral de favelas no Brasil — Censo 2022
export const CONTEXTO_FAVELAS_BRASIL = {
  total_favelas:   12300,
  total_moradores: 16400000,
  percentual_pop:  8.1,
  municipios:      656,
}

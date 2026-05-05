const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-7e52.up.railway.app'
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || ''

async function fetchDirectus(endpoint: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (DIRECTUS_TOKEN) {
    headers['Authorization'] = `Bearer ${DIRECTUS_TOKEN}`
  }

  const res = await fetch(`${DIRECTUS_URL}${endpoint}`, {
    headers,
    next: { revalidate: 3600 }, // revalida a cada 1 hora
  })

  if (!res.ok) {
    throw new Error(`Erro ao buscar ${endpoint}: ${res.status}`)
  }

  const json = await res.json()
  return json.data
}

export async function getIndicadores(territorio?: string) {
  const filter = territorio
    ? `?filter[territorio][_eq]=${encodeURIComponent(territorio)}&limit=100`
    : '?limit=100&sort=area_tematica,nome'
  return fetchDirectus(`/items/indicadores${filter}`)
}

export async function getProgramas(territorio?: string) {
  const filter = territorio
    ? `?filter[territorio][_contains]=${encodeURIComponent(territorio)}&limit=100`
    : '?limit=100&sort=area_tematica,titulo'
  return fetchDirectus(`/items/programas${filter}`)
}

export async function getRegioes() {
  return fetchDirectus('/items/regioes?limit=20&sort=nome')
}

export async function getRegiao(nome: string) {
  return fetchDirectus(`/items/regioes?filter[nome][_eq]=${encodeURIComponent(nome)}&limit=1`)
}

export { DIRECTUS_URL }

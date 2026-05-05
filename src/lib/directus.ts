const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-7e52.up.railway.app'

async function fetchDirectus(endpoint: string) {
  const res = await fetch(`${DIRECTUS_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`Erro ${res.status}: ${endpoint}`)
  const json = await res.json()
  return json.data
}

export async function getIndicadores() {
  return fetchDirectus('/items/indicadores?limit=200&sort=area_tematica,nome')
}

export async function getProgramas() {
  return fetchDirectus('/items/programas?limit=200&sort=area_tematica,titulo')
}

export async function getRegioes() {
  return fetchDirectus('/items/regioes?limit=20&sort=nome')
}

export { DIRECTUS_URL }

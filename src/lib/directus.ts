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

export async function getTerritorios() {
  return fetchDirectus('/items/territorios?limit=20&sort=nome')
}

export async function getTerritorio(slug: string) {
  const data = await fetchDirectus(`/items/territorios?filter[slug][_eq]=${slug}&limit=1`)
  return data?.[0] || null
}

export async function getSubTerritorios(territorio?: string) {
  const filter = territorio
    ? `?filter[territorio][_eq]=${encodeURIComponent(territorio)}&limit=20`
    : '?limit=20&sort=nome'
  return fetchDirectus(`/items/sub_territorios${filter}`)
}

export async function getFavelas(subTerritorio?: string) {
  const filter = subTerritorio
    ? `?filter[sub_territorio][_eq]=${encodeURIComponent(subTerritorio)}&limit=50`
    : '?limit=100&sort=nome'
  return fetchDirectus(`/items/favelas${filter}`)
}

export async function getIndicadores(territorio?: string) {
  const filter = territorio
    ? `?filter[territorio][_eq]=${encodeURIComponent(territorio)}&limit=100&sort=area_tematica,nome`
    : '?limit=200&sort=area_tematica,nome'
  return fetchDirectus(`/items/indicadores${filter}`)
}

export async function getProgramasSociais(territorio?: string) {
  const filter = territorio
    ? `?filter[territorio][_eq]=${encodeURIComponent(territorio)}&limit=100`
    : '?limit=200&sort=eixo,titulo'
  return fetchDirectus(`/items/programas_sociais${filter}`)
}

export async function getProgramasUrbanismo(territorio?: string) {
  const filter = territorio
    ? `?filter[territorio][_eq]=${encodeURIComponent(territorio)}&limit=100`
    : '?limit=200&sort=status,titulo'
  return fetchDirectus(`/items/programas_urbanismo${filter}`)
}

export async function getEquipamentos(territorio?: string) {
  const filter = territorio
    ? `?filter[territorio][_eq]=${encodeURIComponent(territorio)}&limit=100&sort=tipo,nome`
    : '?limit=200&sort=tipo,nome'
  return fetchDirectus(`/items/equipamentos${filter}`)
}

export { DIRECTUS_URL }

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

// ─── Territórios ──────────────────────────────────────────────────────────────

// Busca todos os territórios nível 1 (Cinturão, Manguinhos, PPG)
export async function getTeritorios() {
  return fetchDirectus('/items/territorios?filter[nivel][_eq]=1&sort=nome&limit=20')
}

// Busca um território por slug (qualquer nível)
export async function getTeritorio(slug: string) {
  const data = await fetchDirectus(
    `/items/territorios?filter[slug][_eq]=${slug}&limit=1`
  )
  return data?.[0] || null
}

// Busca territórios nível 2 filhos de um pai (por slug do pai)
export async function getSubTeritorios(parentSlug?: string) {
  if (parentSlug) {
    const pai = await getTeritorio(parentSlug)
    if (!pai) return []
    return fetchDirectus(
      `/items/territorios?filter[parent][_eq]=${pai.id}&filter[nivel][_eq]=2&limit=20&sort=nome`
    )
  }
  return fetchDirectus('/items/territorios?filter[nivel][_eq]=2&limit=20&sort=nome')
}

// ─── Favelas ──────────────────────────────────────────────────────────────────

// Busca favelas por ID de território (relacional)
export async function getFavelas(territorioId?: number) {
  const filter = territorioId
    ? `?filter[territorio][_eq]=${territorioId}&limit=50`
    : '?limit=100&sort=nome'
  return fetchDirectus(`/items/favelas${filter}`)
}

// Busca favelas por slug do território
export async function getFavelasPorSlug(territorioSlug: string) {
  const terr = await getTeritorio(territorioSlug)
  if (!terr) return []
  return getFavelas(terr.id)
}

// ─── Indicadores ──────────────────────────────────────────────────────────────

// Busca indicadores por ID de território
export async function getIndicadores(territorioId?: number) {
  const filter = territorioId
    ? `?filter[territorio][_eq]=${territorioId}&limit=100&sort=area_tematica,nome`
    : '?limit=200&sort=area_tematica,nome'
  return fetchDirectus(`/items/indicadores${filter}`)
}

// Busca indicadores por slug do território
export async function getIndicadoresPorSlug(territorioSlug: string) {
  const terr = await getTeritorio(territorioSlug)
  if (!terr) return []
  return getIndicadores(terr.id)
}

// ─── Programas Sociais ────────────────────────────────────────────────────────

// Busca todos os programas sociais (base)
export async function getProgramasSociais() {
  return fetchDirectus('/items/programas_sociais?limit=200&sort=eixo,titulo')
}

// Busca vínculos programa×território com dados do programa
export async function getProgramasTerritorio(territorioId?: number) {
  const filter = territorioId
    ? `?filter[territorio][_eq]=${territorioId}&limit=100`
    : '?limit=200'
  const fields = '&fields=*,programa.*'
  return fetchDirectus(`/items/programas_territorios${filter}${fields}`)
}

// Busca programas de um território por slug
export async function getProgramasPorSlug(territorioSlug: string) {
  const terr = await getTeritorio(territorioSlug)
  if (!terr) return []
  return getProgramasTerritorio(terr.id)
}

// ─── Urbanismo ────────────────────────────────────────────────────────────────

// Busca projetos urbanismo por ID de território
export async function getProgramasUrbanismo(territorioId?: number) {
  const filter = territorioId
    ? `?filter[territorio][_eq]=${territorioId}&limit=100`
    : '?limit=200&sort=status,titulo'
  return fetchDirectus(`/items/programas_urbanismo${filter}`)
}

// Busca urbanismo por slug do território
export async function getUrbanismoPorSlug(territorioSlug: string) {
  const terr = await getTeritorio(territorioSlug)
  if (!terr) return []
  return getProgramasUrbanismo(terr.id)
}

// ─── Equipamentos ─────────────────────────────────────────────────────────────

// Busca equipamentos por ID de território
export async function getEquipamentos(territorioId?: number) {
  const filter = territorioId
    ? `?filter[territorio][_eq]=${territorioId}&limit=100&sort=tipo,nome`
    : '?limit=200&sort=tipo,nome'
  return fetchDirectus(`/items/equipamentos${filter}`)
}

// Busca equipamentos por slug do território
export async function getEquipamentosPorSlug(territorioSlug: string) {
  const terr = await getTeritorio(territorioSlug)
  if (!terr) return []
  return getEquipamentos(terr.id)
}

// ─── KPIs globais (para o painel executivo) ───────────────────────────────────
export async function getKpisGlobais() {
  const [territorios, programas, urbanismo, equipamentos] = await Promise.all([
    fetchDirectus('/items/territorios?limit=10&filter[nivel][_eq]=2'),
    fetchDirectus('/items/programas_sociais?limit=1&meta=total_count'),
    fetchDirectus('/items/programas_urbanismo?limit=1&meta=total_count'),
    fetchDirectus('/items/equipamentos?limit=1&meta=total_count'),
  ])
  return { territorios, programas, urbanismo, equipamentos }
}

export { DIRECTUS_URL }

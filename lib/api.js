const DEFAULT_API_BASE = 'https://api.alpaki.app'

/**
 * @param {string} raw
 */
export function resolveSkillPath(raw) {
  const value = String(raw || '').trim().replace(/^\/+|\/+$/g, '')
  if (!value) {
    throw new Error('Debes indicar --skill categoria/slug (ej. creative-design/3d-web-experience).')
  }

  const parts = value.split('/').filter(Boolean)
  if (parts.length === 1) {
    return { category: '', slug: parts[0], path: parts[0] }
  }

  if (parts.length !== 2) {
    throw new Error(`Ruta de skill inválida: "${raw}". Usa categoria/slug.`)
  }

  return {
    category: parts[0],
    slug: parts[1],
    path: `${parts[0]}/${parts[1]}`,
  }
}

/**
 * @param {{ category: string, slug: string, path: string }} skillPath
 * @param {{ apiBase?: string }} [options]
 */
export async function fetchSkill(skillPath, options = {}) {
  const apiBase = normalizeApiBase(options.apiBase)
  const bySlugUrl = `${apiBase}/wp-json/ae/v1/headless/skills/${encodeURIComponent(skillPath.slug)}`

  const skill = await getJson(bySlugUrl)
  if (!skill?.slug) {
    throw new Error(`No se encontró la skill "${skillPath.path}" en Alpaki.`)
  }

  if (skillPath.category && skill.sourcePath && skill.sourcePath !== skillPath.path) {
    // Si el usuario pasó categoria/slug, validamos que coincida con la fuente.
    if (!String(skill.sourcePath).endsWith(`/${skillPath.slug}`)) {
      throw new Error(
        `La skill "${skill.slug}" existe, pero no coincide con "${skillPath.path}". Fuente: ${skill.sourcePath}`,
      )
    }
  }

  return skill
}

/**
 * @param {{ search?: string, category?: string, page?: number, perPage?: number, apiBase?: string }} filters
 */
export async function fetchSkillsCatalog(filters = {}) {
  const apiBase = normalizeApiBase(filters.apiBase)
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.category) params.set('category', filters.category)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.perPage) params.set('perPage', String(filters.perPage))
  const query = params.toString()
  const url = `${apiBase}/wp-json/ae/v1/headless/skills${query ? `?${query}` : ''}`
  return getJson(url)
}

/**
 * @param {number|string} skillId
 * @param {{ apiBase?: string, path?: string, slug?: string }} [options]
 * Fire-and-forget: never throws — install UX must not depend on telemetry.
 */
export async function recordSkillInstall(skillId, options = {}) {
  if (process.env.ALPAKI_DISABLE_TELEMETRY === '1' || process.env.ALPAKI_DISABLE_TELEMETRY === 'true') {
    return null
  }

  const apiBase = normalizeApiBase(options.apiBase)
  const id = Number(skillId)
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'alpaki-skills-cli/1.1',
  }

  try {
    if (Number.isFinite(id) && id > 0) {
      const url = `${apiBase}/wp-json/ae/v1/headless/skills/${encodeURIComponent(String(id))}/stats/install`
      const response = await fetch(url, { method: 'POST', headers })
      if (response.ok) return response.json().catch(() => null)
    }

    const url = `${apiBase}/wp-json/ae/v1/headless/skills/install`
    const body = {
      id: Number.isFinite(id) && id > 0 ? id : undefined,
      slug: options.slug || undefined,
      path: options.path || undefined,
    }
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
    if (response.ok) return response.json().catch(() => null)
  } catch {
    /* telemetry must never break installs */
  }

  return null
}

/**
 * @param {string} [apiBase]
 */
function normalizeApiBase(apiBase) {
  const fromEnv = process.env.ALPAKI_API_BASE || process.env.ALPAPI_API_BASE || ''
  const base = String(apiBase || fromEnv || DEFAULT_API_BASE).replace(/\/$/, '')
  return base
}

/**
 * @param {string} url
 */
async function getJson(url) {
  let response
  try {
    response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'alpaki-skills-cli/1.1',
      },
    })
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    throw new Error(`No se pudo conectar con Alpaki (${url}): ${reason}`)
  }

  const text = await response.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    throw new Error(`Respuesta inválida de Alpaki (${response.status}).`)
  }

  if (!response.ok) {
    const message = data?.message || `HTTP ${response.status}`
    throw new Error(`Alpaki respondió error: ${message}`)
  }

  return data
}

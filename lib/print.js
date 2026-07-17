export function printHelp() {
  console.log(`
alpaki-skills — instala skills de Alpaki en Cursor / Claude Code

Uso:
  npx alpaki-skills@latest --skill <categoria/slug>
  npx alpaki-skills@latest creative-design/3d-web-experience
  npx alpaki-skills@latest list
  npx alpaki-skills@latest search "frontend"

Opciones:
  --skill, -s     Ruta categoria/slug (ej. development/api-design)
  --dir, -d       Carpeta destino (default: ./.cursor/skills)
  --tool, -t      cursor | claude   (default: cursor)
  --global, -g    Instalar en el home del usuario
  --api           Base URL de la API (default: https://api.alpaki.app)
  --category, -c  Filtrar catálogo por categoría
  --page          Página del catálogo
  --per-page      Items por página
  --help, -h      Mostrar ayuda

Ejemplos:
  npx alpaki-skills@latest --skill creative-design/3d-web-experience
  npx alpaki-skills@latest --skill git/commit --tool claude
  npx alpaki-skills@latest list --category development
`)
}

/**
 * @param {{ skill: any, skillPath: { path: string }, skillFile: string, installRoot: string }} payload
 */
export function printSkillInstalled(payload) {
  const { skill, skillPath, skillFile, installRoot } = payload
  console.log(`
✓ Skill instalada

  ${skill.title || skill.slug}
  Origen: ${skillPath.path}
  Destino: ${skillFile}
  Carpeta: ${installRoot}

Ábrela en Cursor como skill local o cópiala a tu flujo de agente.
Catálogo: https://alpaki.app/skills
`)
}

/**
 * @param {{ items?: any[], total?: number, page?: number, totalPages?: number, categories?: any[] }} catalog
 * @param {{ search?: string }} [meta]
 */
export function printCatalog(catalog, meta = {}) {
  const items = catalog.items || []
  const total = catalog.total ?? items.length
  const header = meta.search ? `Resultados para "${meta.search}"` : 'Catálogo Alpaki Skills'

  console.log(`\n${header} (${total})\n`)

  if (!items.length) {
    console.log('No hay skills con ese filtro.\n')
    return
  }

  for (const item of items) {
    const pathLabel = item.sourcePath || item.slug
    const category = item.category?.name || 'Skill'
    console.log(`- ${pathLabel}`)
    console.log(`  ${item.title} · ${category}`)
    if (item.excerpt) {
      const excerpt = String(item.excerpt).replace(/\s+/g, ' ').slice(0, 110)
      console.log(`  ${excerpt}${item.excerpt.length > 110 ? '…' : ''}`)
    }
    console.log('')
  }

  if ((catalog.totalPages || 1) > 1) {
    console.log(`Página ${catalog.page || 1} de ${catalog.totalPages}. Usa --page para ver más.\n`)
  }
}

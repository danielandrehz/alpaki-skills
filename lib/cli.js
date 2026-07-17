import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fetchSkill, fetchSkillsCatalog, resolveSkillPath } from './api.js'
import { printHelp, printSkillInstalled, printCatalog } from './print.js'
import { resolveInstallDir } from './paths.js'

/**
 * @param {string[]} argv
 */
export async function runCli(argv) {
  const args = parseArgs(argv)

  if (args.help || (!args.skill && !args.list && !args.search)) {
    printHelp()
    if (!args.help && !args.skill && !args.list && !args.search) {
      process.exitCode = 1
    }
    return
  }

  if (args.list || args.search) {
    const catalog = await fetchSkillsCatalog({
      search: args.search || '',
      category: args.category || '',
      page: args.page,
      perPage: args.perPage,
      apiBase: args.api,
    })
    printCatalog(catalog, { search: args.search || '' })
    return
  }

  const skillPath = resolveSkillPath(args.skill)
  const skill = await fetchSkill(skillPath, { apiBase: args.api })
  const installRoot = resolveInstallDir({
    cwd: process.cwd(),
    target: args.dir,
    global: args.global,
    tool: args.tool,
  })

  const folderName = skill.slug || skillPath.slug
  const skillDir = path.join(installRoot, folderName)
  const skillFile = path.join(skillDir, 'SKILL.md')
  const body = buildSkillMarkdown(skill)

  await mkdir(skillDir, { recursive: true })
  await writeFile(skillFile, body, 'utf8')

  printSkillInstalled({
    skill,
    skillPath,
    skillFile,
    installRoot,
  })
}

/**
 * @param {string[]} argv
 */
function parseArgs(argv) {
  /** @type {Record<string, any>} */
  const out = {
    help: false,
    list: false,
    global: false,
    skill: '',
    search: '',
    category: '',
    dir: '',
    tool: 'cursor',
    api: '',
    page: 1,
    perPage: 24,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    const next = argv[i + 1]

    if (token === '-h' || token === '--help') {
      out.help = true
      continue
    }
    if (token === 'list' || token === '--list') {
      out.list = true
      continue
    }
    if (token === 'search' || token === '--search') {
      out.search = next || ''
      i += 1
      continue
    }
    if (token === '--skill' || token === '-s') {
      out.skill = next || ''
      i += 1
      continue
    }
    if (token === '--dir' || token === '-d') {
      out.dir = next || ''
      i += 1
      continue
    }
    if (token === '--tool' || token === '-t') {
      out.tool = next || 'cursor'
      i += 1
      continue
    }
    if (token === '--api') {
      out.api = next || ''
      i += 1
      continue
    }
    if (token === '--category' || token === '-c') {
      out.category = next || ''
      i += 1
      continue
    }
    if (token === '--page') {
      out.page = Number(next) || 1
      i += 1
      continue
    }
    if (token === '--per-page') {
      out.perPage = Number(next) || 24
      i += 1
      continue
    }
    if (token === '--global' || token === '-g') {
      out.global = true
      continue
    }
    if (!token.startsWith('-') && !out.skill && token.includes('/')) {
      out.skill = token
      continue
    }
  }

  return out
}

/**
 * @param {{ title?: string, slug?: string, excerpt?: string, content?: string, sourceName?: string, category?: { name?: string, slug?: string } | null, attribution?: string, license?: string }} skill
 */
function buildSkillMarkdown(skill) {
  const name = skill.sourceName || skill.slug || skill.title || 'skill'
  const description = (skill.excerpt || skill.title || name).replace(/\s+/g, ' ').trim()
  const lines = [
    '---',
    `name: ${yamlQuote(name)}`,
    `description: ${yamlQuote(description)}`,
  ]

  if (skill.license) {
    lines.push(`license: ${yamlQuote(skill.license)}`)
  }

  lines.push('---', '')
  lines.push((skill.content || '').trim(), '')

  if (skill.attribution) {
    lines.push('---', '', `> ${skill.attribution}`, '')
  }

  return `${lines.join('\n').trim()}\n`
}

/**
 * @param {string} value
 */
function yamlQuote(value) {
  const safe = String(value).replace(/"/g, '\\"')
  return `"${safe}"`
}

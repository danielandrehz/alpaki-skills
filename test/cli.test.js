import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveSkillPath } from '../lib/api.js'
import { resolveInstallDir } from '../lib/paths.js'

test('resolveSkillPath accepts category/slug', () => {
  assert.deepEqual(resolveSkillPath('creative-design/3d-web-experience'), {
    category: 'creative-design',
    slug: '3d-web-experience',
    path: 'creative-design/3d-web-experience',
  })
})

test('resolveInstallDir defaults to .cursor/skills', () => {
  const dir = resolveInstallDir({ cwd: '/tmp/project', tool: 'cursor' })
  assert.equal(dir.replace(/\\/g, '/'), '/tmp/project/.cursor/skills')
})

test('resolveInstallDir supports claude', () => {
  const dir = resolveInstallDir({ cwd: '/tmp/project', tool: 'claude' })
  assert.equal(dir.replace(/\\/g, '/'), '/tmp/project/.claude/skills')
})

test('recordSkillInstall never throws when API is unreachable', async () => {
  const { recordSkillInstall } = await import('../lib/api.js')
  const result = await recordSkillInstall(1, { apiBase: 'http://127.0.0.1:9' })
  assert.equal(result, null)
})

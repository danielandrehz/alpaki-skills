import os from 'node:os'
import path from 'node:path'

/**
 * @param {{ cwd: string, target?: string, global?: boolean, tool?: string }} options
 */
export function resolveInstallDir(options) {
  if (options.target) {
    return path.resolve(options.cwd, options.target)
  }

  const tool = String(options.tool || 'cursor').toLowerCase()
  const relative =
    tool === 'claude' || tool === 'claude-code'
      ? path.join('.claude', 'skills')
      : path.join('.cursor', 'skills')

  if (options.global) {
    return path.join(os.homedir(), relative)
  }

  return path.join(options.cwd, relative)
}

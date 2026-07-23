/**
 * Write app-update.yml into unpacked Electron resources
 * Required by electron-updater when packaging with --publish never
 * @author prompt-vault team
 * @date 2026-07-23
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const resourcesDir = path.join(root, 'release', 'win-unpacked', 'resources')
const target = path.join(resourcesDir, 'app-update.yml')

const content = `provider: github
owner: manman1414
repo: prompt-vault
updaterCacheDirName: prompt-vault-updater
`

if (!fs.existsSync(resourcesDir)) {
  console.error('[write-app-update-yml] resources dir not found:', resourcesDir)
  process.exit(1)
}

fs.writeFileSync(target, content, 'utf8')
console.log('[write-app-update-yml] Wrote', target)

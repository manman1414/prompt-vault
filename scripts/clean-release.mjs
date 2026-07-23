/**
 * Remove release output directory before electron build
 * @author prompt-vault team
 * @date 2026-07-07
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const releaseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../release')

if (fs.existsSync(releaseDir)) {
  fs.rmSync(releaseDir, { recursive: true, force: true })
}

fs.mkdirSync(releaseDir, { recursive: true })
console.log('[clean-release] Cleared and recreated release/')

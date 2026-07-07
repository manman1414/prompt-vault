/**
 * Generate multi-size Windows icon from PNG
 * @author prompt-vault team
 * @date 2026-07-07
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pngToIco from 'png-to-ico'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const source = path.join(__dirname, '../build/icon-source.png')
const target = path.join(__dirname, '../build/icon.ico')

if (!fs.existsSync(source)) {
  console.error('[generate-icon] missing build/icon-source.png')
  process.exit(1)
}

const buffer = await pngToIco(source)
fs.writeFileSync(target, buffer)
console.log('[generate-icon] wrote', target, `(${buffer.length} bytes)`)

const pngTarget = path.join(__dirname, '../build/icon.png')
fs.copyFileSync(source, pngTarget)
console.log('[generate-icon] wrote', pngTarget)

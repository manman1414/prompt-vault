/**
 * Generate platform icons from PNG source
 * @author prompt-vault team
 * @date 2026-07-07
 */

import fs from 'fs'
import path from 'path'
import pngToIco from 'png-to-ico'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const source = path.join(__dirname, '../build/icon-source.png')
const icoTarget = path.join(__dirname, '../build/icon.ico')
const pngTarget = path.join(__dirname, '../build/icon.png')
const png512Target = path.join(__dirname, '../build/icon-512.png')

if (!fs.existsSync(source)) {
  console.error('[generate-icon] missing build/icon-source.png')
  process.exit(1)
}

await sharp(source).resize(512, 512).png().toFile(png512Target)
console.log('[generate-icon] wrote', png512Target)

await sharp(source).resize(256, 256).png().toFile(pngTarget)
console.log('[generate-icon] wrote', pngTarget)

const buffer = await pngToIco(png512Target)
fs.writeFileSync(icoTarget, buffer)
console.log('[generate-icon] wrote', icoTarget, `(${buffer.length} bytes)`)

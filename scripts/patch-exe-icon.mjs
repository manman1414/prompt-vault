/**
 * Apply custom icon to packaged exe (best-effort, non-blocking)
 * @author prompt-vault team
 * @date 2026-07-07
 */

import fs from 'fs'
import os from 'os'
import path from 'path'
import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'
import { rcedit } from 'rcedit'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const exe = path.join(__dirname, '../release/win-unpacked/prompt-vault.exe')
const icon = path.join(__dirname, '../build/icon.ico')

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function clearReadonly(filePath) {
  if (process.platform === 'win32') {
    spawnSync('attrib', ['-R', filePath], { stdio: 'ignore', shell: true })
  }
}

function stopRunningApp() {
  if (process.platform !== 'win32') return
  spawnSync('taskkill', ['/F', '/IM', 'prompt-vault.exe', '/T'], { stdio: 'ignore', shell: true })
}

async function patchOnce(exePath, iconPath) {
  const tempExe = path.join(os.tmpdir(), `prompt-vault-icon-${Date.now()}.exe`)
  clearReadonly(exePath)
  fs.copyFileSync(exePath, tempExe)
  clearReadonly(tempExe)

  try {
    await rcedit(tempExe, { icon: iconPath })
    clearReadonly(exePath)
    fs.copyFileSync(tempExe, exePath)
  } finally {
    try {
      fs.unlinkSync(tempExe)
    } catch {
      /* ignore */
    }
  }
}

async function main() {
  if (!fs.existsSync(exe)) {
    console.warn('[patch-icon] exe not found, skip')
    return
  }
  if (!fs.existsSync(icon)) {
    console.warn('[patch-icon] icon not found, skip')
    return
  }

  stopRunningApp()
  await sleep(500)

  const maxAttempts = 5
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      console.log(`[patch-icon] attempt ${attempt}/${maxAttempts} ...`)
      await patchOnce(exe, icon)
      console.log('[patch-icon] exe icon updated')
      return
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.warn(`[patch-icon] attempt ${attempt} failed:`, message)
      await sleep(1000)
    }
  }

  console.warn('[patch-icon] could not embed icon into exe (file may be locked)')
  console.warn('[patch-icon] build continues — installed shortcuts still use resources/icon.ico')
  process.exit(0)
}

main().catch((error) => {
  console.warn('[patch-icon] unexpected error:', error.message)
  console.warn('[patch-icon] build continues')
  process.exit(0)
})

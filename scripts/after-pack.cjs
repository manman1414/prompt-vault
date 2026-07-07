/**
 * electron-builder afterPack: 写入 exe 图标（必须在打 NSIS 安装包之前）
 * @author prompt-vault team
 * @date 2026-07-07
 */

const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

function getRceditPath() {
  return path.join(
    process.env.LOCALAPPDATA || '',
    'electron-builder/Cache/winCodeSign/winCodeSign-2.6.0/rcedit-x64.exe',
  )
}

function applyIcon(exePath, iconPath) {
  const rcedit = getRceditPath()
  if (!fs.existsSync(rcedit)) {
    throw new Error('rcedit not found, run electron-builder once to download it')
  }
  if (!fs.existsSync(exePath)) {
    throw new Error(`exe not found: ${exePath}`)
  }
  if (!fs.existsSync(iconPath)) {
    throw new Error(`icon not found: ${iconPath}`)
  }

  console.log('[after-pack] applying icon:', exePath)
  const result = spawnSync(rcedit, [exePath, '--set-icon', iconPath], { encoding: 'utf8' })
  if (result.status !== 0) {
    const detail = result.stderr || result.stdout || 'unknown error'
    throw new Error(`rcedit failed: ${detail}`)
  }
  console.log('[after-pack] icon applied')
}

/** @param {import('electron-builder').AfterPackContext} context */
module.exports = async function afterPack(context) {
  if (context.electronPlatformName !== 'win32') return

  const exe = path.join(context.appOutDir, 'prompt-vault.exe')
  const icon = path.join(context.packager.projectDir, 'build/icon.ico')
  applyIcon(exe, icon)
}

module.exports.applyIcon = applyIcon

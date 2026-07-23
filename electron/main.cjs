/**
 * Electron main process
 * @author prompt-vault team
 * @date 2026-07-07
 */

const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')

const isDev = !app.isPackaged
const UPDATE_FEED_URL = 'https://github.com/manman1414/prompt-vault/releases/latest/download/'

let mainWindow = null
let updaterReady = false

function getIconPath() {
  const ext = process.platform === 'win32' ? 'ico' : 'png'
  const candidates = isDev
    ? [path.join(__dirname, `../build/icon.${ext}`), path.join(__dirname, '../build/icon.png')]
    : [
        path.join(process.resourcesPath, `icon.${ext}`),
        path.join(process.resourcesPath, 'icon.png'),
        path.join(__dirname, '../build/icon.ico'),
        path.join(__dirname, '../build/icon.png'),
      ]

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null
}

function sendUpdaterStatus(payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('updater:status', payload)
  }
}

/** 简单 semver 比较：a > b 返回 1，相等 0，小于 -1 */
function compareVersion(a, b) {
  const pa = String(a).split('.').map((n) => Number(n) || 0)
  const pb = String(b).split('.').map((n) => Number(n) || 0)
  const len = Math.max(pa.length, pb.length)
  for (let i = 0; i < len; i += 1) {
    const x = pa[i] || 0
    const y = pb[i] || 0
    if (x > y) return 1
    if (x < y) return -1
  }
  return 0
}

function setupAutoUpdater() {
  if (isDev) return

  const { autoUpdater } = require('electron-updater')
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true

  // generic 直接读 latest.yml，比 GitHub API 更稳
  autoUpdater.setFeedURL({
    provider: 'generic',
    url: UPDATE_FEED_URL,
  })

  autoUpdater.on('checking-for-update', () => {
    sendUpdaterStatus({ status: 'checking' })
  })

  autoUpdater.on('update-available', (info) => {
    sendUpdaterStatus({
      status: 'available',
      version: String(info.version || ''),
    })
  })

  autoUpdater.on('update-not-available', (info) => {
    sendUpdaterStatus({
      status: 'not-available',
      version: String(info.version || app.getVersion()),
    })
  })

  autoUpdater.on('download-progress', (progress) => {
    sendUpdaterStatus({
      status: 'downloading',
      percent: Number(progress.percent) || 0,
      transferred: Number(progress.transferred) || 0,
      total: Number(progress.total) || 0,
    })
  })

  autoUpdater.on('update-downloaded', (info) => {
    sendUpdaterStatus({
      status: 'downloaded',
      version: String(info.version || ''),
    })
  })

  autoUpdater.on('error', (error) => {
    const raw = error?.message || String(error)
    const message = raw.includes('app-update.yml')
      ? '更新配置缺失，请重新安装最新版本后重试'
      : raw
    sendUpdaterStatus({
      status: 'error',
      message,
    })
  })

  updaterReady = true

  // 启动后静默检查，有新版本再通知前端
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch((error) => {
      sendUpdaterStatus({
        status: 'error',
        message: error?.message || String(error),
        silent: true,
      })
    })
  }, 5000)
}

function setupIpc() {
  ipcMain.handle('app:getVersion', () => app.getVersion())

  ipcMain.handle('updater:check', async () => {
    if (isDev || !updaterReady) {
      return { ok: false, reason: 'dev' }
    }
    const { autoUpdater } = require('electron-updater')
    const currentVersion = app.getVersion()
    try {
      const result = await autoUpdater.checkForUpdates()
      const remoteVersion = result?.updateInfo?.version
        ? String(result.updateInfo.version)
        : null

      if (remoteVersion && compareVersion(remoteVersion, currentVersion) > 0) {
        sendUpdaterStatus({ status: 'available', version: remoteVersion })
        return {
          ok: true,
          status: 'available',
          version: remoteVersion,
          currentVersion,
        }
      }

      sendUpdaterStatus({ status: 'not-available', version: currentVersion })
      return {
        ok: true,
        status: 'not-available',
        version: remoteVersion || currentVersion,
        currentVersion,
      }
    } catch (error) {
      const message = error?.message || String(error)
      sendUpdaterStatus({ status: 'error', message })
      return { ok: false, reason: 'error', message, currentVersion }
    }
  })

  ipcMain.handle('updater:download', async () => {
    if (isDev || !updaterReady) {
      return { ok: false, reason: 'dev' }
    }
    const { autoUpdater } = require('electron-updater')
    try {
      await autoUpdater.downloadUpdate()
      return { ok: true }
    } catch (error) {
      return { ok: false, reason: 'error', message: error?.message || String(error) }
    }
  })

  ipcMain.handle('updater:install', () => {
    if (isDev || !updaterReady) {
      return { ok: false, reason: 'dev' }
    }
    const { autoUpdater } = require('electron-updater')
    setImmediate(() => autoUpdater.quitAndInstall(false, true))
    return { ok: true }
  })
}

function createWindow() {
  const iconPath = getIconPath()

  mainWindow = new BrowserWindow({
    width: 1100,
    height: 760,
    minWidth: 800,
    minHeight: 560,
    title: '提示词库',
    icon: iconPath || undefined,
    autoHideMenuBar: true,
    show: false,
    backgroundColor: '#f8fafc',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow.once('ready-to-show', () => mainWindow.show())

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  // 更新测试标记（不影响界面，仅主进程日志）
  console.log('[prompt-vault] boot', app.getVersion(), 'update-test-2026-07-23')

  Menu.setApplicationMenu(null)
  setupIpc()
  createWindow()
  setupAutoUpdater()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

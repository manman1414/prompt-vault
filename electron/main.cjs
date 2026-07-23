/**
 * Electron main process
 * @author prompt-vault team
 * @date 2026-07-07
 */

const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')

const isDev = !app.isPackaged
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

function setupAutoUpdater() {
  if (isDev) return

  const { autoUpdater } = require('electron-updater')
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('checking-for-update', () => {
    sendUpdaterStatus({ status: 'checking' })
  })

  autoUpdater.on('update-available', (info) => {
    sendUpdaterStatus({
      status: 'available',
      version: info.version,
      releaseNotes: info.releaseNotes ?? null,
    })
  })

  autoUpdater.on('update-not-available', (info) => {
    sendUpdaterStatus({
      status: 'not-available',
      version: info.version,
    })
  })

  autoUpdater.on('download-progress', (progress) => {
    sendUpdaterStatus({
      status: 'downloading',
      percent: progress.percent,
      transferred: progress.transferred,
      total: progress.total,
    })
  })

  autoUpdater.on('update-downloaded', (info) => {
    sendUpdaterStatus({
      status: 'downloaded',
      version: info.version,
    })
  })

  autoUpdater.on('error', (error) => {
    sendUpdaterStatus({
      status: 'error',
      message: error?.message || String(error),
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
  }, 4000)
}

function setupIpc() {
  ipcMain.handle('app:getVersion', () => app.getVersion())

  ipcMain.handle('updater:check', async () => {
    if (isDev || !updaterReady) {
      return { ok: false, reason: 'dev' }
    }
    const { autoUpdater } = require('electron-updater')
    try {
      const result = await autoUpdater.checkForUpdates()
      return { ok: true, version: result?.updateInfo?.version ?? null }
    } catch (error) {
      return { ok: false, reason: 'error', message: error?.message || String(error) }
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
    // 退出并安装
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

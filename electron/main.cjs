/**
 * Electron main process
 * @author prompt-vault team
 * @date 2026-07-07
 */

const { app, BrowserWindow, Menu } = require('electron')
const fs = require('fs')
const path = require('path')

const isDev = !app.isPackaged

function getIconPath() {
  const candidates = isDev
    ? [path.join(__dirname, '../build/icon.ico')]
    : [
        path.join(process.resourcesPath, 'icon.ico'),
        path.join(__dirname, '../build/icon.ico'),
      ]

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null
}

function createWindow() {
  const iconPath = getIconPath()

  const win = new BrowserWindow({
    width: 1100,
    height: 760,
    minWidth: 800,
    minHeight: 560,
    title: '提示词库',
    icon: iconPath || undefined,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null)
  createWindow()

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

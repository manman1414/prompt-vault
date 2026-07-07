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
    show: false,
    backgroundColor: '#f8fafc',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  win.once('ready-to-show', () => win.show())

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

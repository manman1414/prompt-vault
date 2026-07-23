/**
 * Electron renderer bridge types
 * @author prompt-vault team
 * @date 2026-07-23
 */

export type UpdaterStatus =
  | { status: 'checking' }
  | { status: 'available'; version: string; releaseNotes?: string | null }
  | { status: 'not-available'; version?: string }
  | { status: 'downloading'; percent: number; transferred: number; total: number }
  | { status: 'downloaded'; version: string }
  | { status: 'error'; message: string; silent?: boolean }

export interface ElectronAPI {
  isElectron: true
  getVersion: () => Promise<string>
  checkForUpdates: () => Promise<{ ok: boolean; reason?: string; message?: string; version?: string | null }>
  downloadUpdate: () => Promise<{ ok: boolean; reason?: string; message?: string }>
  installUpdate: () => Promise<{ ok: boolean; reason?: string; message?: string }>
  onUpdaterStatus: (callback: (payload: UpdaterStatus) => void) => () => void
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

export {}

import { Injectable } from '@angular/core'
import { DataService } from 'src/app/services/data.service'

export enum IconMode {
  both = 'both',
  dock = 'dock',
  statusBar = 'statusBar',
  neither = 'neither'
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService extends DataService {
  route = `${this.route}/settings`

  async getLaunchOnStartup (): Promise<boolean> {
    const { state } = await this.request({ method: 'GET', endpoint: '/launch-on-startup' })
    return state
  }

  setLaunchOnStartup (state: boolean) {
    return this.request({ method: 'POST', endpoint: '/launch-on-startup', data: { state } })
  }

  async getIconMode (): Promise<IconMode> {
    const { mode } = await this.request({ method: 'GET', endpoint: '/icon-mode' })
    return mode
  }

  setIconMode (mode: IconMode) {
    return this.request({ method: 'POST', endpoint: '/icon-mode', data: { mode } })
  }

  async getDoCollectCrashReports (): Promise<boolean> {
    const { doCollectCrashReports } = await this.request({ method: 'GET', endpoint: '/collect-crash-reports' })
    return doCollectCrashReports
  }

  setDoCollectCrashReports ({ doCollectCrashReports }: { doCollectCrashReports: boolean }) {
    return this.request({ method: 'POST', endpoint: '/collect-crash-reports', data: { doCollectCrashReports } })
  }

  async getDoAutoCheckUpdates (): Promise<boolean> {
    const { doAutoCheckUpdates } = await this.request({ method: 'GET', endpoint: '/auto-check-updates' })
    return doAutoCheckUpdates
  }

  setDoAutoCheckUpdates ({ doAutoCheckUpdates }: { doAutoCheckUpdates: boolean }) {
    return this.request({ method: 'POST', endpoint: '/auto-check-updates', data: { doAutoCheckUpdates } })
  }

  async getDoOTAUpdates (): Promise<boolean> {
    const { doOTAUpdates } = await this.request({ method: 'GET', endpoint: '/ota-updates' })
    return doOTAUpdates
  }

  setDoOTAUpdates ({ doOTAUpdates }: { doOTAUpdates: boolean }) {
    return this.request({ method: 'POST', endpoint: '/ota-updates', data: { doOTAUpdates } })
  }

  async getDoBetaUpdates (): Promise<boolean> {
    const { doBetaUpdates } = await this.request({ method: 'GET', endpoint: '/beta-updates' })
    return doBetaUpdates
  }

  setDoBetaUpdates ({ doBetaUpdates }: { doBetaUpdates: boolean }) {
    return this.request({ method: 'POST', endpoint: '/beta-updates', data: { doBetaUpdates } })
  }
}

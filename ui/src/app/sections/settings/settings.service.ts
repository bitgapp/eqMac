import { Injectable } from '@angular/core'
import { DataService } from 'src/app/services/data.service'

export enum IconMode {
  both = 'both',
  dock = 'dock',
  statusBar = 'statusBar'
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

  // async getMode () {
  //   const { mode } = await this.request({ method: 'GET', endpoint: '/mode' })
  //   return mode as UIMode
  // }

  // setMode (mode: UIMode) {
  //   return this.request({ method: 'POST', endpoint: '/mode', data: { mode } })
  // }
}

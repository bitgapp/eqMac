import { Injectable } from '@angular/core'
import { DataService } from 'src/app/services/data.service'

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
}

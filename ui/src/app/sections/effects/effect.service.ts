import { Injectable } from '@angular/core'
import { DataService } from '../../services/data.service'

@Injectable({
  providedIn: 'root'
})
export class EffectService extends DataService {
  route = `${this.route}/effects`

  async getEnabled () {
    const resp = await this.request({ method: 'GET', endpoint: '/enabled' })
    return resp.enabled
  }

  setEnabled (enabled) {
    return this.request({ method: 'POST', endpoint: '/enabled', data: { enabled } })
  }

  onEnabledChanged (callback: (enabled: boolean) => void) {
    this.on('/enabled', ({ enabled }) => callback(enabled))
  }
}

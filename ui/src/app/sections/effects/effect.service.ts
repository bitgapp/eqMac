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

  onEnabledChanged (callback: EffectEnabledChangedEventCallback) {
    this.on('/enabled', callback)
  }

  offEnabledChanged (callback: EffectEnabledChangedEventCallback) {
    this.off('/enabled', callback)
  }
}

export type EffectEnabledChangedEventCallback = (data: { enabled: boolean }) => void

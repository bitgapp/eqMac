import { Injectable } from '@angular/core'
import { EffectService } from '../effect.service'

@Injectable({
  providedIn: 'root'
})
export class ReverbService extends EffectService {
  route = `${this.route}/reverb`

  async getMix () {
    const resp = await this.request({ method: 'GET', endpoint: '/mix' })
    return resp.mix
  }

  setMix (mix) {
    return this.request({ method: 'POST', endpoint: '/mix', data: { mix } })
  }

  async getPresets () {
    return this.request({ method: 'GET', endpoint: '/presets' })
  }

  async getSelectedPresetId () {
    const resp = await this.request({ method: 'GET', endpoint: '/preset' })
    return resp.id
  }

  setPreset (id) {
    return this.request({ method: 'POST', endpoint: '/preset', data: { id } })
  }

  onMixChanged (callback: (mix: number) => void) {
    this.on(`${this.route}/mix`, ({ mix }) => callback(mix))
  }

  onPresetChanged (callback: (id: number) => void) {
    this.on(`${this.route}/preset`, ({ preset }) => callback(preset))
  }
}

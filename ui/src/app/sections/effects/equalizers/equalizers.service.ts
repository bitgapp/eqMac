import { Injectable } from '@angular/core'
import { EffectService } from '../effect.service'

export const EqualizersTypes = [
  'Basic',
  'Advanced'
] as const
export type EqualizerType = typeof EqualizersTypes[number]

@Injectable({
  providedIn: 'root'
})
export class EqualizersService extends EffectService {
  route = `${this.route}/equalizers`

  async getType (): Promise<EqualizerType> {
    const resp = await this.request({ method: 'GET', endpoint: '/type' })
    return resp.type
  }

  setType (type: EqualizerType) {
    return this.request({ method: 'POST', endpoint: '/type', data: { type } })
  }

  onTypeChanged (callback: EqualizersTypeChangedEventCallback) {
    this.on('/type', callback)
  }

  offTypeChanged (callback: EqualizersTypeChangedEventCallback) {
    this.off('/type', callback)
  }
}

export type EqualizersTypeChangedEventCallback = (data: { type: EqualizerType }) => void

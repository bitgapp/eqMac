import { Injectable } from '@angular/core'
import { VolumeService } from '../../../../services/volume.service'

@Injectable({
  providedIn: 'root'
})
export class BoosterService extends VolumeService {
  route = `${this.route}/gain`
  async getGain () {
    const resp = await this.request({ method: 'GET' })
    return resp.gain
  }

  setGain (gain: number, transition?: boolean) {
    this.request({ method: 'POST', data: { gain, transition } })
  }

  async getBoostEnabled (): Promise<boolean> {
    const { enabled } = await this.request({ method: 'GET', endpoint: '/boost/enabled' })
    return enabled
  }

  setBoostEnabled (enabled: boolean) {
    return this.request({ method: 'POST', endpoint: '/boost/enabled', data: { enabled } })
  }

  onBoostEnabledChanged (callback: BoostEnabledChangedEventCallback) {
    this.on(callback)
  }

  offBoostEnabledChanged (callback: BoostEnabledChangedEventCallback) {
    this.off(callback)
  }

  onGainChanged (callback: BoosterGainChangedEventCallback) {
    this.on(callback)
  }

  offGainChanged (callback: BoosterGainChangedEventCallback) {
    this.off(callback)
  }
}

export type BoosterGainChangedEventCallback = (data: { gain: number }) => void
export type BoostEnabledChangedEventCallback = (data: { enabled: boolean }) => void

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

  onGainChanged (callback: BoosterGainChangedEventCallback) {
    this.on(callback)
  }

  offGainChanged (callback: BoosterGainChangedEventCallback) {
    this.off(callback)
  }
}

export type BoosterGainChangedEventCallback = (data: { gain: number }) => void

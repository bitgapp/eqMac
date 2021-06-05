import { Injectable } from '@angular/core'
import { SourceService } from '../source.service'

@Injectable({
  providedIn: 'root'
})
export class InputService extends SourceService {
  route = `${this.route}/input`

  getDevices (): Promise<any[]> {
    return this.request({ method: 'GET', endpoint: '/devices' })
  }

  async getDevice (): Promise<number> {
    const resp = await this.request({ method: 'GET', endpoint: '/device' })
    return resp.deviceId
  }

  setDevice (deviceId: number) {
    return this.request({ method: 'POST', endpoint: '/device', data: { deviceId } })
  }

  onDeviceChanged (callback: InputDeviceChangedEventCallback) {
    this.on(callback)
  }

  offDeviceChanged (callback: InputDeviceChangedEventCallback) {
    this.off(callback)
  }
}

export type InputDeviceChangedEventCallback = (data: { deviceId: number }) => void

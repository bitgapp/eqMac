import { Injectable } from '@angular/core'
import { DataService } from 'src/app/services/data.service'
import { IconName } from '@eqmac/components'

export type DeviceTransportType =
'airPlay' |
'bluetooth' |
'bluetoothLE' |
'builtIn' |
'displayPort' |
'fireWire' |
'hdmi' |
'pci' |
'thunderbolt' |
'usb' |
'aggregate' |
'virtual'

export interface Output {
  id: number
  name: string
  transportType: DeviceTransportType
  icon?: IconName
}
@Injectable({
  providedIn: 'root'
})
export class OutputsService extends DataService {
  route = `${this.route}/outputs`

  getDevices (): Promise<Output[]> {
    return this.request({ method: 'GET', endpoint: '/devices' })
  }

  async getSelected (): Promise<Output> {
    const output = await this.request({ method: 'GET', endpoint: '/selected' })
    return output
  }

  select (output: Output) {
    return this.request({ method: 'POST', endpoint: '/selected', data: { ...output } })
  }

  onSelectedChanged (callback: OutputsSelectedChangedEventCallback) {
    this.on('/selected', callback)
  }

  offSelectedChanged (callback: OutputsSelectedChangedEventCallback) {
    this.off('/selected', callback)
  }

  onDevicesChanged (callback: OutputsDevicesChangedEventCallback) {
    this.on('/devices', callback)
  }

  offDevicesChanged (callback: OutputsDevicesChangedEventCallback) {
    this.off('/devices', callback)
  }
}

export type OutputsSelectedChangedEventCallback = (data: { id: number }) => void
export type OutputsDevicesChangedEventCallback = (devices: Output[]) => void

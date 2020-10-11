import { Injectable } from '@angular/core'
import { DataService } from 'src/app/services/data.service'
import { IconName } from '../../modules/eqmac-components/components/icon/icons'

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
'aggregate'

export interface Output {
  id: number
  name: string
  transportType: DeviceTransportType,
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

  onChanged (callback: (id: number) => void) {
    this.on('/selected', ({ id }) => callback(id))
  }

  onDevicesChanged (callback: (devices: Output[]) => void) {
    this.on('/devices', devices => callback(devices))
  }
}

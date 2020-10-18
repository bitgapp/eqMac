import { Component, OnInit } from '@angular/core'
import { InputService } from './input.service'

export interface InputDevice {
  deviceId: number
  name: string
  type: string
}

@Component({
  selector: 'eqm-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  constructor (public inputService: InputService) { }

  devices: InputDevice[] = []
  selectedDevice: InputDevice = null

  ngOnInit () {
    this.sync()
    this.setupEvents()
  }

  async sync () {
    await Promise.all([
      this.syncDevices(),
      this.syncSelectedDevice()
    ])
  }

  async syncDevices () {
    this.devices = await this.inputService.getDevices()
  }

  async syncSelectedDevice () {
    const selectedDevice = await this.inputService.getDevice()
  }

  protected setupEvents () {
    this.inputService.onDeviceChanged((deviceId) => {
      this.setDeviceById(deviceId)
    })
  }

  deviceSelected (device) {
    this.selectedDevice = device
    this.inputService.setDevice(this.selectedDevice.deviceId)
  }

  protected async setDeviceById (deviceId: number) {
    if (!deviceId) {
      this.selectedDevice = null
      return
    }
    const device = this.devices.find(device => device.deviceId === deviceId)
    if (!device) {
      await this.syncDevices()
      return this.setDeviceById(deviceId)
    }
    this.selectedDevice = device
  }
}

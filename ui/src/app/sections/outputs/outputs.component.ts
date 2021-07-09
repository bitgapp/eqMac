import { Component, OnInit } from '@angular/core'
import { OutputsService, Output } from './outputs.service'

@Component({
  selector: 'eqm-outputs',
  templateUrl: './outputs.component.html',
  styleUrls: [ './outputs.component.scss' ]
})
export class OutputsComponent implements OnInit {
  outputs: Output[]
  selected: Output
  constructor (public service: OutputsService) { }

  async ngOnInit () {
    await this.sync()
    this.setupEventListeners()
  }

  async sync () {
    await this.syncOutputs()
    await this.syncSelected()
  }

  async syncOutputs () {
    let outputs = await this.service.getDevices()
    outputs = outputs.filter(output => !output.name.includes('CADefaultDeviceAggregate'))
    for (const output of outputs) {
      output.icon = (() => {
        switch (output.transportType) {
          case 'airPlay': return 'airplay'
          case 'bluetoothLE': return 'bluetooth'
          case 'builtIn': return output.name === 'Headphones' ? 'headphones' : 'speaker'
          case 'displayPort': return 'displayport'
          case 'fireWire': return 'firewire'
          case 'virtual': return 'cog'
          default: return output.transportType
        }
      })()
    }
    this.outputs = outputs
  }

  async syncSelected () {
    const selected = await this.service.getSelected()
    const output = this.outputs.find(output => output.id === selected.id)
    if (output) this.selected = output
  }

  async select (output: Output) {
    await this.service.select(output)
  }

  setupEventListeners () {
    this.service.onSelectedChanged(this.sync.bind(this))
    this.service.onDevicesChanged(this.sync.bind(this))
  }

  destroyEvents () {
    this.service.offSelectedChanged(this.sync)
    this.service.offDevicesChanged(this.sync)
  }
}

import {
  Component,
  OnInit,
  EventEmitter,
  Output
} from '@angular/core'
import {
  ReverbService
} from './reverb.service'

@Component({
  selector: 'eqm-reverb',
  templateUrl: './reverb.component.html',
  styleUrls: ['./reverb.component.scss']
})
export class ReverbComponent implements OnInit {
  presets = []
  dryWetMix = 0.5
  enabled = true
  selectedPreset = null
  hide = false

  @Output() visibilityToggled = new EventEmitter()

  constructor (private reverbService: ReverbService) {}

  ngOnInit () {
    this.getPresets()
    this.sync()
    this.setupEvents()
  }

  protected setupEvents () {
    this.reverbService.onEnabledChanged(enabled => {
      this.enabled = enabled
    })

    this.reverbService.onMixChanged(mix => {
      this.dryWetMix = mix
    })

    this.reverbService.onPresetChanged(preset => {
      this.selectedPreset = preset
    })
  }

  async sync () {
    if (this.presets.length === 0) {
      this.getPresets()
    }
    this.getSelectedPreset()
    this.getMix()
    this.getEnabled()

  }

  async getPresets () {
    this.presets = await this.reverbService.getPresets()
  }

  async getSelectedPreset () {
    const selectedPresetId = await this.reverbService.getSelectedPresetId()
    this.selectedPreset = this.presets.find(preset => preset.id === selectedPresetId)
  }

  async getMix () {
    this.dryWetMix = await this.reverbService.getMix()
  }

  setMix () {
    this.reverbService.setMix(this.dryWetMix)
  }

  async getEnabled () {
    this.enabled = await this.reverbService.getEnabled()
  }

  setEnabled () {
    this.reverbService.setEnabled(this.enabled)
  }

  formatDryWetMixValue () {
    return Math.round(this.dryWetMix * 100)
  }

  toggleVisibility () {
    this.hide = !this.hide
    this.visibilityToggled.emit()
  }

}

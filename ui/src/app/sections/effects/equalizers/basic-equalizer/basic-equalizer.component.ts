import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core'
import { BasicEqualizerService, BasicEqualizerPreset, BasicEqualizerBand, BasicEqualizerPresetGains } from './basic-equalizer.service'
import { BridgeService } from '../../../../services/bridge.service'
import { EqualizerComponent } from '../equalizer.component'
import { KnobValueChangedEvent } from '../../../../modules/eqmac-components/components/knob/knob.component'
import { TransitionService } from '../../../../services/transitions.service'
import { ApplicationService } from '../../../../services/app.service'
import { UISettings, UIService } from '../../../../services/ui.service'

@Component({
  selector: 'eqm-basic-equalizer',
  templateUrl: './basic-equalizer.component.html',
  styleUrls: ['./basic-equalizer.component.scss']
})
export class BasicEqualizerComponent extends EqualizerComponent implements OnInit {
  @Input() enabled = true

  gains: BasicEqualizerPresetGains = {
    bass: 0,
    mid: 0,
    treble: 0
  }
  peakLimiter = false

  replaceKnobsWithSliders = false

  public _presets: BasicEqualizerPreset[]
  @Output() presetsChange = new EventEmitter<BasicEqualizerPreset[]>()
  set presets (newPresets: BasicEqualizerPreset[]) {
    this._presets =
    [
      newPresets.find(p => p.id === 'manual'),
      newPresets.find(p => p.id === 'flat'),
      ...newPresets.filter(p => !['manual', 'flat'].includes(p.id)).sort((a, b) => a.name > b.name ? 1 : -1)
    ]
    this.presetsChange.emit(this.presets)
  }
  get presets () { return this._presets }

  public _selectedPreset: BasicEqualizerPreset
  @Output() selectedPresetChange = new EventEmitter<BasicEqualizerPreset>()
  set selectedPreset (newSelectedPreset: BasicEqualizerPreset) {
    this._selectedPreset = newSelectedPreset
    this.selectedPresetChange.emit(this.selectedPreset)
  }
  get selectedPreset () { return this._selectedPreset }

  settings = []

  constructor (
    public service: BasicEqualizerService,
    public app: ApplicationService,
    public ui: UIService,
    public change: ChangeDetectorRef,
    public transition: TransitionService
  ) {
    super()
  }

  async ngOnInit () {
    await this.sync()
    this.setupEvents()
  }

  protected setupEvents () {
    this.service.onPresetsChanged(presets => {
      this.presets = presets
    })
    this.service.onSelectedPresetChanged(preset => {
      this.selectedPreset = preset
      this.setSelectedPresetsGains()
    })
    this.ui.settingsChanged.subscribe(uiSettings => {
      this.replaceKnobsWithSliders = uiSettings.replaceKnobsWithSliders
    })
  }

  async sync () {
    await Promise.all([
      this.syncPresets(),
      this.syncUISettings()
    ])
  }

  async syncPresets () {
    const [ presets, selectedPreset ] = await Promise.all([
      this.service.getPresets(),
      this.service.getSelectedPreset()
    ])
    this.presets = presets
    this.selectedPreset = this.getPreset(selectedPreset.id)
    this.setSelectedPresetsGains()
  }

  async syncUISettings () {
    const uiSettings = await this.ui.getSettings()
    this.replaceKnobsWithSliders = uiSettings.replaceKnobsWithSliders
  }

  async selectPreset (preset: BasicEqualizerPreset) {
    this.selectedPreset = preset
    this.setSelectedPresetsGains()
    await this.service.selectPreset(preset)
  }

  stickSlidersToMiddle = true
  setSelectedPresetsGains () {
    // TODO: Refactor this bollocks
    this.peakLimiter = this.selectedPreset.peakLimiter || false

    for (const [type, gain] of Object.entries(this.selectedPreset.gains)) {
      const currentGain: number = this.gains[type]
      if (currentGain !== gain) {
        this.stickSlidersToMiddle = false
        this.change.detectChanges()
        this.transition.perform(currentGain, gain, value => {
          this.gains[type] = value
          if (value === gain) {
            this.stickSlidersToMiddle = true
          }
          this.change.detectChanges()
        })
      }
    }
  }

  selectFlatPreset () {
    return this.selectPreset(this.getPreset('flat'))
  }

  getPreset (id: string) {
    return this.presets.find(p => p.id === id)
  }

  async savePreset (name: string) {
    const { gains, peakLimiter } = this.selectedPreset
    const existingUserPreset = this.presets.filter(p => !p.isDefault).find(p => p.name === name)
    if (existingUserPreset) {
      // Overwrite
      await this.service.updatePreset({ id: existingUserPreset.id, name, gains, peakLimiter }, {
        select: true
      })
    } else {
      // Create
      await this.service.createPreset({ name, gains, peakLimiter }, true)
    }
    await this.syncPresets()
  }

  async deletePreset () {
    if (!this.selectedPreset.isDefault) {
      await this.service.deletePreset(this.selectedPreset)
      await this.syncPresets()
      await this.selectFlatPreset()
    }
  }

  async setGain (band: BasicEqualizerBand, event: KnobValueChangedEvent) {
    const manualPreset = this.presets.find(p => p.id === 'manual')
    if (this.selectedPreset.id !== manualPreset.id) {
      manualPreset.gains = { ...this.selectedPreset.gains }
    }
    manualPreset.gains[band] = event.value
    manualPreset.peakLimiter = !!this.selectedPreset.peakLimiter
    this.selectedPreset = manualPreset

    if (!event.transition) {
      this.setSelectedPresetsGains()
    }
    await this.service.updatePreset(manualPreset, {
      select: true,
      transition: event.transition
    })
  }

  async togglePeakLimiter () {
    this.peakLimiter = !this.peakLimiter
    this.selectedPreset.peakLimiter = this.peakLimiter
    await this.service.updatePreset(this.selectedPreset, {
      select: true
    })
  }

  screenValue (gain: number) {
    return `${gain > 0 ? '+' : ''}${(gain.toFixed(1))}dB`
  }

  performHapticFeedback (animating) {
    if (!animating) {
      this.app.haptic()
    }
  }
}

import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core'
import { AdvancedEqualizerService, AdvancedEqualizerPreset, AdvancedEqualizerPresetsChangedEventCallback, AdvancedEqualizerSelectedPresetChangedEventCallback } from 'src/app/sections/effects/equalizers/advanced-equalizer/advanced-equalizer.service'
import { EqualizerComponent } from '../equalizer.component'
import { Options, CheckboxOption } from 'src/app/components/options/options.component'
import { TransitionService } from '../../../../services/transitions.service'
import { ApplicationService } from '../../../../services/app.service'

@Component({
  selector: 'eqm-advanced-equalizer',
  templateUrl: './advanced-equalizer.component.html',
  styleUrls: [ './advanced-equalizer.component.scss' ]
})
export class AdvancedEqualizerComponent extends EqualizerComponent implements OnInit, OnDestroy {
  @Input() enabled = true

  public ShowDefaultPresetsCheckbox: CheckboxOption = {
    type: 'checkbox',
    label: 'Show Default Presets',
    value: false,
    toggled: (show) => this.service.setShowDefaultPresets(show)
  }

  settings: Options = [ [
    {
      type: 'button',
      label: 'Import Presets',
      action: () => this.service.importPresets()
    }, {
      type: 'button',
      label: 'Export Presets',
      action: () => this.service.exportPresets()
    }
  ], [
    this.ShowDefaultPresetsCheckbox
  ] ]

  public _presets: AdvancedEqualizerPreset[]
  @Output() presetsChange = new EventEmitter<AdvancedEqualizerPreset[]>()
  set presets (newPresets: AdvancedEqualizerPreset[]) {
    this._presets =
    [
      newPresets.find(p => p.id === 'manual'),
      newPresets.find(p => p.id === 'flat'),
      ...newPresets.filter(p => ![ 'manual', 'flat' ].includes(p.id)).sort((a, b) => a.name > b.name ? 1 : -1)
    ]
    this.presetsChange.emit(this.presets)
  }

  get presets () { return this._presets }

  public _selectedPreset: AdvancedEqualizerPreset
  @Output() selectedPresetChange = new EventEmitter<AdvancedEqualizerPreset>()
  set selectedPreset (newSelectedPreset: AdvancedEqualizerPreset) {
    this._selectedPreset = newSelectedPreset
    this.selectedPresetChange.emit(this.selectedPreset)
  }

  get selectedPreset () { return this._selectedPreset }
  bandFrequencyLabels = [ '32', '64', '125', '250', '500', '1K', '2K', '4K', '8K', '16K' ]

  bands = [ ...Array(10) ].map(() => 0)
  global = 0

  stickSlidersToMiddle = true
  setSelectedPresetsGains () {
    // TODO: Refactor this bollocks
    // Global
    const currentGlobalGain = this.global
    if (this.global !== this.selectedPreset.gains.global) {
      this.stickSlidersToMiddle = false
      this.change.detectChanges()
      this.transition.perform(currentGlobalGain, this.selectedPreset.gains.global, value => {
        this.global = value
        if (value === this.selectedPreset.gains.global) {
          this.stickSlidersToMiddle = true
        }
        this.change.detectChanges()
      })
    }
    for (const [ i, gain ] of this.selectedPreset.gains.bands.entries()) {
      const currentGain = this.bands[i]
      if (currentGain !== gain) {
        this.stickSlidersToMiddle = false
        this.change.detectChanges()
        this.transition.perform(currentGain, gain, value => {
          this.bands[i] = value
          if (value === gain) {
            this.stickSlidersToMiddle = true
          }
          this.change.detectChanges()
        })
      }
    }
  }

  constructor (
    public service: AdvancedEqualizerService,
    public transition: TransitionService,
    public change: ChangeDetectorRef,
    public app: ApplicationService
  ) {
    super()
    this.getImportLegacyAvailable()
  }

  async ngOnInit () {
    await this.sync()
    this.setupEvents()
  }

  async sync () {
    await Promise.all([
      this.syncSettings(),
      this.syncPresets()
    ])
  }

  public async getImportLegacyAvailable () {
    if (await this.service.getImportLegacyAvailable()) {
      this.settings[1].push(
        {
          type: 'button',
          label: 'Import eqMac2 Presets',
          action: async () => {
            await this.service.importLegacy()
            if (this.settingsDialog) {
              this.settingsDialog.close()
            }
          }
        }
      )
    }
  }

  public async syncPresets () {
    const [ presets, selectedPreset ] = await Promise.all([
      this.service.getPresets(),
      this.service.getSelectedPreset()
    ])
    this.presets = presets
    this.selectedPreset = presets.find(preset => preset.id === selectedPreset.id)
    this.setSelectedPresetsGains()
  }

  public async syncSettings () {
    return Promise.all([
      this.syncShowDefaultPresets()
    ])
  }

  public async syncShowDefaultPresets () {
    this.ShowDefaultPresetsCheckbox.value = await this.service.getShowDefaultPresets()
  }

  private onPresetsChangedEventCallback: AdvancedEqualizerPresetsChangedEventCallback
  private onSelectedPresetChangedEventCallback: AdvancedEqualizerSelectedPresetChangedEventCallback
  protected setupEvents () {
    this.onPresetsChangedEventCallback = presets => {
      if (!presets) return
      this.presets = presets
    }
    this.service.onPresetsChanged(this.onPresetsChangedEventCallback)

    this.onSelectedPresetChangedEventCallback = preset => {
      this.selectedPreset = preset
      this.setSelectedPresetsGains()
    }
    this.service.onSelectedPresetChanged(this.onSelectedPresetChangedEventCallback)
  }

  private destroyEvents () {
    this.service.offPresetsChanged(this.onPresetsChangedEventCallback)
    this.service.offSelectedPresetChanged(this.onSelectedPresetChangedEventCallback)
  }

  async selectPreset (preset: AdvancedEqualizerPreset) {
    this.selectedPreset = preset
    this.setSelectedPresetsGains()
    await this.service.selectPreset(preset)
  }

  getPreset (id: string) {
    return this.presets.find(p => p.id === id)
  }

  selectFlatPreset () {
    return this.selectPreset(this.getPreset('flat'))
  }

  async setGain (index: number | 'global', event: { value: number, transition?: boolean }) {
    const manualPreset = this.presets.find(p => p.id === 'manual')
    if (this.selectedPreset.id !== manualPreset.id) {
      manualPreset.gains = {
        bands: [ ...this.selectedPreset.gains.bands ],
        global: this.selectedPreset.gains.global
      }
    }

    if (index === 'global') {
      manualPreset.gains.global = event.value
    } else {
      manualPreset.gains.bands[index] = event.value
    }
    this.selectedPreset = manualPreset

    if (!event.transition) {
      this.setSelectedPresetsGains()
    }

    this.service.updatePreset(manualPreset, {
      select: true,
      transition: event.transition
    })
  }

  async savePreset (name: string) {
    const { gains } = this.selectedPreset
    const existingUserPreset = this.presets.filter(p => !p.isDefault).find(p => p.name === name)
    if (existingUserPreset) {
      // Overwrite
      await this.service.updatePreset({ id: existingUserPreset.id, name, gains }, {
        select: true
      })
      this.selectedPreset = existingUserPreset
    } else {
      // Create
      this.selectedPreset = await this.service.createPreset({ name, gains }, true)
    }
    await this.syncPresets()
  }

  async deletePreset () {
    if (!this.selectedPreset.isDefault) {
      await this.service.deletePreset(this.selectedPreset)
      this.selectFlatPreset()
    }
  }

  screenValue (gain: number) {
    return `${gain > 0 ? '+' : ''}${(gain.toFixed(1))}dB`
  }

  performHapticFeedback () {
    this.app.haptic()
  }

  bandTracker (index) {
    return index
  }

  get globalGainScreenValue () {
    return `${this.selectedPreset.gains.global > 0 ? '+' : ''}${(this.selectedPreset.gains.global.toFixed(1))}dB`
  }

  ngOnDestroy () {
    this.destroyEvents()
  }
}

import { Injectable } from '@angular/core'
import { EqualizersService } from '../equalizers.service'
import { EqualizerPreset } from '../presets/equalizer-presets.component'

export interface BasicEqualizerPresetGains {
  bass: number
  mid: number
  treble: number
}

export type BasicEqualizerBand = keyof BasicEqualizerPresetGains

export interface BasicEqualizerPreset extends EqualizerPreset {
  gains: BasicEqualizerPresetGains
  peakLimiter: boolean
}

@Injectable({
  providedIn: 'root'
})
export class BasicEqualizerService extends EqualizersService {
  route = `${this.route}/basic`

  getPresets () {
    return this.request({ method: 'GET', endpoint: '/presets' })
  }

  getSelectedPreset () {
    return this.request({ method: 'GET', endpoint: '/presets/selected' })
  }

  createPreset (preset: BasicEqualizerPreset, select: boolean = false) {
    return this.request({ method: 'POST', endpoint: '/presets', data: { ...preset, select } as any })
  }

  updatePreset (preset: BasicEqualizerPreset, opts?: { select?: boolean, transition?: boolean }) {
    return this.request({
      method: 'POST',
      endpoint: '/presets',
      data: {
        ...preset,
        select: opts?.select,
        transition: opts?.transition
      } as any
    })
  }

  selectPreset (preset: BasicEqualizerPreset) {
    return this.request({ method: 'POST', endpoint: '/presets/select', data: { ...preset } as any })
  }

  deletePreset (preset: BasicEqualizerPreset) {
    return this.request({ method: 'DELETE', endpoint: '/presets', data: { ...preset } as any })
  }

  onPresetsChanged (callback: (presets: BasicEqualizerPreset[]) => void) {
    this.on('/presets', (presets) => callback(presets))
  }

  onSelectedPresetChanged (callback: (preset: BasicEqualizerPreset) => void) {
    this.on('/presets/selected', (preset) => callback(preset))
  }
}

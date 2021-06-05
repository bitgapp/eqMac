import { Injectable } from '@angular/core'
import { EqualizersService } from '../equalizers.service'
import { EqualizerPreset } from '../presets/equalizer-presets.component'

export interface AdvancedEqualizerPreset extends EqualizerPreset {
  gains: {
    bands: number[]
    global: number
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdvancedEqualizerService extends EqualizersService {
  route = `${this.route}/advanced`

  getPresets () {
    return this.request({ method: 'GET', endpoint: '/presets' })
  }

  getSelectedPreset () {
    return this.request({ method: 'GET', endpoint: '/presets/selected' })
  }

  createPreset (preset: AdvancedEqualizerPreset, select: boolean = false) {
    return this.request({ method: 'POST', endpoint: '/presets', data: { ...preset, select } })
  }

  updatePreset (preset: AdvancedEqualizerPreset, opts?: { select?: boolean, transition?: boolean }) {
    return this.request({
      method: 'POST',
      endpoint: '/presets',
      data: {
        ...preset,
        select: opts?.select,
        transition: opts?.transition
      }
    })
  }

  selectPreset (preset: AdvancedEqualizerPreset) {
    return this.request({ method: 'POST', endpoint: '/presets/select', data: { ...preset } })
  }

  deletePreset (preset: AdvancedEqualizerPreset) {
    return this.request({ method: 'DELETE', endpoint: '/presets', data: { ...preset } })
  }

  async getImportLegacyAvailable () {
    return new Promise(async (resolve) => {
      setTimeout(() => resolve(false), 1000)
      try {
        await this.request({ method: 'GET', endpoint: '/presets/import-legacy/available' })
        resolve(true)
      } catch (err) {
        resolve(false)
      }
    })
  }

  async importLegacy () {
    return this.request({ method: 'GET', endpoint: '/presets/import-legacy' })
  }

  importPresets () {
    return this.request({ method: 'GET', endpoint: '/presets/import' })
  }

  exportPresets () {
    return this.request({ method: 'GET', endpoint: '/presets/export' })
  }

  async getShowDefaultPresets () {
    const { show } = await this.request({ method: 'GET', endpoint: '/settings/show-default-presets' })
    return show
  }

  setShowDefaultPresets (show: boolean) {
    return this.request({ method: 'POST', endpoint: '/settings/show-default-presets', data: { show } })
  }

  onPresetsChanged (callback: AdvancedEqualizerPresetsChangedEventCallback) {
    this.on('/presets', callback)
  }

  offPresetsChanged (callback: AdvancedEqualizerPresetsChangedEventCallback) {
    this.off('/presets', callback)
  }

  onSelectedPresetChanged (callback: AdvancedEqualizerSelectedPresetChangedEventCallback) {
    this.on('/presets/selected', callback)
  }

  offSelectedPresetChanged (callback: AdvancedEqualizerSelectedPresetChangedEventCallback) {
    this.off('/presets/selected', callback)
  }
}

export type AdvancedEqualizerPresetsChangedEventCallback = (presets: AdvancedEqualizerPreset[]) => void
export type AdvancedEqualizerSelectedPresetChangedEventCallback = (preset: AdvancedEqualizerPreset) => void

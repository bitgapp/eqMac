import { Options } from 'src/app/components/options/options.component'
import { AdditionalPresetOption, EqualizerPreset } from './presets/equalizer-presets.component'
import { Component, HostBinding, Input } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { OptionsDialogComponent } from '../../../components/options-dialog/options-dialog.component'

@Component({ template: '' })
export abstract class EqualizerComponent {
  @Input() animationDuration = 500
  @Input() animationFps = 30
  @Input() settingsDialog: MatDialogRef<OptionsDialogComponent, any>
  @HostBinding('style.min-height.px') abstract height: number

  abstract settings: Options
  abstract sync (): Promise<any>
  async selected () {
    await this.sync()
  }

  additionalPresetOptionLeft?: AdditionalPresetOption
  additionalPresetOptionRight?: AdditionalPresetOption

  abstract selectPreset (preset: EqualizerPreset)
  abstract deletePreset ()
  abstract savePreset (name: string)
}

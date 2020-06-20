import { Option, Options } from 'src/app/components/options/options.component'
import { EqualizerPreset } from './presets/equalizer-presets.component'
import { Input } from '@angular/core'
import { MatDialogRef } from '@angular/material'
import { OptionsDialogComponent } from '../../../components/options-dialog/options-dialog.component'

export abstract class EqualizerComponent {
  @Input() animationDuration = 500
  @Input() animationFps = 30
  @Input() settingsDialog: MatDialogRef<OptionsDialogComponent, any>
  abstract settings: Options
  abstract async sync ()
  async selected () {
    await this.sync()
  }

  abstract selectPreset (preset: EqualizerPreset)
  abstract deletePreset ()
  abstract savePreset (name: string)
}

import { Option, Options } from 'src/app/components/options/options.component'
import { EqualizerPreset } from './presets/equalizer-presets.component'
import { Input } from '@angular/core'

export abstract class EqualizerComponent {
  @Input() animationDuration = 500
  @Input() animationFps = 30

  abstract settings: Options
  abstract async sync ()
  async selected () {
    await this.sync()
  }

  abstract selectPreset (preset: EqualizerPreset)
  abstract deletePreset ()
  abstract savePreset (name: string)
}

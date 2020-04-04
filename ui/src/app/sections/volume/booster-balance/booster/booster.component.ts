import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef
} from '@angular/core'

import { BoosterService } from './booster.service'
import { ApplicationService } from '../../../../services/app.service'

@Component({
  selector: 'eqm-booster',
  templateUrl: './booster.component.html',
  styleUrls: ['./booster.component.scss']
})
export class BoosterComponent implements OnInit {
  gain = 1

  @Input() hide = false

  constructor (
    public boosterService: BoosterService,
    private app: ApplicationService,
    private changeRef: ChangeDetectorRef
  ) {}

  ngOnInit () {
    this.sync()
    this.setupEvents()
  }

  async sync () {
    await Promise.all([
      this.getGain()
    ])
  }

  private ignoreUpdates = false
  private ignoreUpdatesDebouncer: NodeJS.Timer
  protected setupEvents () {
    this.boosterService.onGainChanged(gain => {
      if (!this.ignoreUpdates) {
        this.gain = gain
        this.changeRef.detectChanges()
      }
    })
  }

  setGain (gain: number) {
    this.ignoreUpdates = true
    if (this.ignoreUpdatesDebouncer) clearTimeout(this.ignoreUpdatesDebouncer)
    this.ignoreUpdatesDebouncer = setTimeout(() => {
      this.getGain()
      this.ignoreUpdates = false
    }, 500)
    return this.boosterService.setGain(gain)
  }

  async getGain () {
    this.gain = await this.boosterService.getGain()
  }

  performHapticFeedback (animating) {
    if (!animating) {
      this.app.haptic()
    }
  }
}

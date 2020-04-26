import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef
} from '@angular/core'

import { BoosterService } from './booster.service'
import { ApplicationService } from '../../../../services/app.service'
import { UIService, UISettings } from '../../../../services/ui.service'

@Component({
  selector: 'eqm-booster',
  templateUrl: './booster.component.html',
  styleUrls: ['./booster.component.scss']
})
export class BoosterComponent implements OnInit {
  gain = 1
  replaceKnobsWithSliders = false
  @Input() hide = false

  constructor (
    public boosterService: BoosterService,
    private app: ApplicationService,
    private changeRef: ChangeDetectorRef,
    private ui: UIService
  ) {}

  ngOnInit () {
    this.sync()
    this.setupEvents()
  }

  async sync () {
    await Promise.all([
      this.getGain(),
      this.syncUISettings()
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
    this.ui.settingsChanged.subscribe(uiSettings => {
      this.replaceKnobsWithSliders = uiSettings.replaceKnobsWithSliders
    })
  }

  async syncUISettings () {
    const uiSettings = await this.ui.getSettings()
    this.replaceKnobsWithSliders = uiSettings.replaceKnobsWithSliders
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

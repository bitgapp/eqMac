import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core'

import { BoosterGainChangedEventCallback, BoosterService, BoostEnabledChangedEventCallback } from './booster.service'
import { ApplicationService } from '../../../../services/app.service'
import { UIService, UISettings } from '../../../../services/ui.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'eqm-booster',
  templateUrl: './booster.component.html',
  styleUrls: [ './booster.component.scss' ]
})
export class BoosterComponent implements OnInit, OnDestroy {
  gain = 1
  replaceKnobsWithSliders = false
  boostEnabled = true
  @Input() hide = false

  constructor (
    public boosterService: BoosterService,
    public app: ApplicationService,
    public changeRef: ChangeDetectorRef,
    public ui: UIService
  ) {}

  ngOnInit () {
    this.sync()
    this.setupEvents()
  }

  async sync () {
    await Promise.all([
      this.getGain(),
      this.getBoostEnabled(),
      this.syncUISettings()
    ])
  }

  async getGain () {
    this.gain = await this.boosterService.getGain()
  }

  async getBoostEnabled () {
    this.boostEnabled = await this.boosterService.getBoostEnabled()
  }

  async syncUISettings () {
    const uiSettings = await this.ui.getSettings()
    this.replaceKnobsWithSliders = uiSettings.replaceKnobsWithSliders
  }

  public ignoreUpdates = false
  public ignoreUpdatesDebouncer: NodeJS.Timer

  private onGainChangedEventCallback: BoosterGainChangedEventCallback
  private onBoostEnabledChangedEventCallback: BoostEnabledChangedEventCallback

  private onUISettingsChangedEventSubscription: Subscription
  protected setupEvents () {
    this.onGainChangedEventCallback = ({ gain }) => {
      if (!this.ignoreUpdates) {
        this.gain = gain
        this.changeRef.detectChanges()
      }
    }
    this.boosterService.onGainChanged(this.onGainChangedEventCallback)

    this.onBoostEnabledChangedEventCallback = ({ enabled }) => {
      this.boostEnabled = enabled
    }
    this.boosterService.onBoostEnabledChanged(this.onBoostEnabledChangedEventCallback)

    this.onUISettingsChangedEventSubscription = this.ui.settingsChanged.subscribe(uiSettings => {
      this.replaceKnobsWithSliders = uiSettings.replaceKnobsWithSliders
    })
  }

  protected destroyEvents () {
    this.boosterService.offGainChanged(this.onGainChangedEventCallback)
    this.boosterService.offBoostEnabledChanged(this.onBoostEnabledChangedEventCallback)
    this.onUISettingsChangedEventSubscription.unsubscribe()
  }

  setGain (gain: number) {
    this.ignoreUpdates = true
    if (this.ignoreUpdatesDebouncer) clearTimeout(this.ignoreUpdatesDebouncer)
    this.ignoreUpdatesDebouncer = setTimeout(() => {
      this.getGain()
      this.ignoreUpdates = false
    }, 1000)
    this.boosterService.setGain(gain)
  }

  performHapticFeedback (animating) {
    if (!animating) {
      this.app.haptic()
    }
  }

  ngOnDestroy () {
    this.destroyEvents()
  }
}

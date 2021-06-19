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
import { SemanticVersion } from '../../../../services/semantic-version.service'

@Component({
  selector: 'eqm-booster',
  templateUrl: './booster.component.html',
  styleUrls: [ './booster.component.scss' ]
})
export class BoosterComponent implements OnInit, OnDestroy {
  gain = 1
  replaceKnobsWithSliders = false
  boostEnabled = true
  boostEnabledAvailable = false
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
    const [ { version } ] = await Promise.all([
      this.app.getInfo(),
      this.getGain(),
      this.syncUISettings()
    ])
    this.boostEnabledAvailable = new SemanticVersion(version).isGreaterThanOrEqualTo('1.0.0')
    if (this.boostEnabledAvailable) {
      this.getBoostEnabled()
    }
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
      if (!this.boostEnabled && this.gain > 1) {
        this.gain = 1
      }
      this.changeRef.detectChanges()
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
    if (!this.boostEnabled && gain > 1) {
      gain = 1
      this.gain = gain
    }
    this.ignoreUpdates = true
    if (this.ignoreUpdatesDebouncer) clearTimeout(this.ignoreUpdatesDebouncer)
    this.ignoreUpdatesDebouncer = setTimeout(() => {
      this.getGain()
      this.ignoreUpdates = false
    }, 1000)
    this.boosterService.setGain(gain)
  }

  setBoostEnabled (enabled: boolean) {
    this.boostEnabled = enabled
    this.boosterService.setBoostEnabled(this.boostEnabled)
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

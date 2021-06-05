import { Component, OnInit, Input, OnDestroy } from '@angular/core'
import { BalanceChangedEventCallback, BalanceService } from './balance.service'
import { ApplicationService } from '../../../../services/app.service'
import { KnobValueChangedEvent, FlatSliderValueChangedEvent } from '@eqmac/components'
import { UIService } from '../../../../services/ui.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'eqm-balance',
  templateUrl: './balance.component.html',
  styleUrls: [ './balance.component.scss' ]
})
export class BalanceComponent implements OnInit, OnDestroy {
  balance = 0
  @Input() animationDuration = 500
  @Input() animationFps = 30
  @Input() hide = false
  replaceKnobsWithSliders = false

  constructor (
    public balanceService: BalanceService,
    public app: ApplicationService,
    public ui: UIService
  ) { }

  ngOnInit () {
    this.sync()
    this.setupEvents()
  }

  async sync () {
    await Promise.all([
      this.syncUISettings(),
      this.getBalance()
    ])
  }

  async syncUISettings () {
    const uiSettings = await this.ui.getSettings()
    this.replaceKnobsWithSliders = uiSettings.replaceKnobsWithSliders
  }

  private onBalanceChangedEventCallback: BalanceChangedEventCallback
  private onUISettingsChangedSubscription: Subscription
  protected setupEvents () {
    this.onBalanceChangedEventCallback = ({ balance }) => {
      this.balance = balance
    }
    this.balanceService.onBalanceChanged(this.onBalanceChangedEventCallback)

    this.onUISettingsChangedSubscription = this.ui.settingsChanged.subscribe(uiSettings => {
      this.replaceKnobsWithSliders = uiSettings.replaceKnobsWithSliders
    })
  }

  protected destroyEvents () {
    this.balanceService.offBalanceChanged(this.onBalanceChangedEventCallback)
    this.onUISettingsChangedSubscription?.unsubscribe()
  }

  async getBalance () {
    this.balance = await this.balanceService.getBalance()
  }

  async setBalance (event: KnobValueChangedEvent | FlatSliderValueChangedEvent) {
    this.balanceService.setBalance(event.value, event.transition)
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

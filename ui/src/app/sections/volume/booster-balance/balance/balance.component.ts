import { Component, OnInit, Input } from '@angular/core'
import { BalanceService } from './balance.service'
import { ApplicationService } from '../../../../services/app.service'
import { KnobValueChangedEvent } from '../../../../modules/eqmac-components/components/knob/knob.component'
import { UIService } from '../../../../services/ui.service'

@Component({
  selector: 'eqm-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {
  balance = 0
  @Input() animationDuration = 500
  @Input() animationFps = 30
  @Input() hide = false
  replaceKnobWithSlider = false

  constructor (
    public balanceService: BalanceService,
    private app: ApplicationService,
    private ui: UIService
  ) { }

  ngOnInit () {
    this.sync()
    this.setupEvents()
  }

  async sync () {
    this.replaceKnobWithSlider = !!this.ui.getWebSettings().replaceKnobsWithSliders
    await Promise.all([
      this.getBalance()
    ])
  }

  protected setupEvents () {
    this.balanceService.onBalanceChanged((balance) => {
      this.balance = balance
    })
    this.ui.webSettingsChanged.subscribe(webUISettings => {
      this.replaceKnobWithSlider = !!webUISettings.replaceKnobsWithSliders
    })
  }

  async getBalance () {
    this.balance = await this.balanceService.getBalance()
  }

  async setBalance (event: KnobValueChangedEvent) {
    this.balanceService.setBalance(event.value, event.transition)
  }

  performHapticFeedback (animating) {
    if (!animating) {
      this.app.haptic()
    }
  }
}

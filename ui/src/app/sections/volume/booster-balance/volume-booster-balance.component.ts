import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { UIService } from '../../../services/ui.service'

@Component({
  selector: 'eqm-volume-booster-balance',
  templateUrl: './volume-booster-balance.component.html',
  styleUrls: ['./volume-booster-balance.component.scss']
})
export class VolumeBoosterBalanceComponent implements OnInit {
  hide = false
  replaceKnobsWithSliders = false
  @Output() visibilityToggled = new EventEmitter()
  constructor (
    private ui: UIService
  ) { }

  async ngOnInit () {
    this.syncUISettings()
    this.setupListeners()
  }

  async syncUISettings () {
    const uiSettings = this.ui.settings
    this.replaceKnobsWithSliders = !!uiSettings.replaceKnobsWithSliders
  }

  setupListeners () {
    this.ui.settingsChanged.subscribe(uiSettings => {
      this.replaceKnobsWithSliders = !!uiSettings.replaceKnobsWithSliders
    })
  }

  async toggleVisibility () {
    this.hide = !this.hide
    this.visibilityToggled.emit()
  }

}

import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { UtilitiesService } from '../../../services/utilities.service'

@Component({
  selector: 'eqm-volume-booster-balance',
  templateUrl: './volume-booster-balance.component.html',
  styleUrls: ['./volume-booster-balance.component.scss']
})
export class VolumeBoosterBalanceComponent implements OnInit {
  hide = false
  @Output() visibilityToggled = new EventEmitter()
  constructor (private utils: UtilitiesService) { }

  ngOnInit () {
  }

  async toggleVisibility () {
    this.hide = !this.hide
    this.visibilityToggled.emit()
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'eqm-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: [ './toggle.component.scss' ]
})
export class ToggleComponent implements OnInit {
  @Input() state = false
  @Output() stateChange = new EventEmitter()
  @Input() enabled = true
  @Input() interactive = true

  ngOnInit () {
  }

  toggleState () {
    if (this.enabled && this.interactive) {
      this.state = !this.state
      this.stateChange.emit(this.state)
    }
  }
}

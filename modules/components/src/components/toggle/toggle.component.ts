import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'eqm-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: [ './toggle.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleComponent implements OnInit {
  @Input() state = false
  @Output() stateChange = new EventEmitter()
  @Input() enabled = true
  @Input() interactive = true
  @Input() highlighted = false

  ngOnInit () {
  }

  toggleState () {
    if (this.enabled && this.interactive) {
      this.state = !this.state
      this.stateChange.emit(this.state)
    }
  }
}

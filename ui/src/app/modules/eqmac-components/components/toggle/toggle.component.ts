import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'eqm-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})
export class ToggleComponent implements OnInit {

  constructor () { }

  @Input() state = false
  @Output() stateChange = new EventEmitter()

  ngOnInit () {
  }

  toggleState () {
    this.state = !this.state
    this.stateChange.emit(this.state)
  }
}

import { Component, OnInit, Input, EventEmitter, Output, ViewChild, HostBinding, ElementRef } from '@angular/core'

@Component({
  selector: 'eqm-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: [ './input-field.component.scss' ]
})
export class InputFieldComponent implements OnInit {
  @Input() text?: string
  @Input() placeholder = ''
  @Output() textChange = new EventEmitter()
  @Output() enter = new EventEmitter()
  @Input() editable = true
  @HostBinding('class.enabled') @Input() enabled = true
  @Input() fontSize = 12
  @Input() type: string = 'text'
  @ViewChild('container', { static: true }) container!: ElementRef

  ngOnInit () {
  }

  inputChanged () {
    this.textChange.emit(this.text)
  }

  enterPressed () {
    this.enter.emit()
  }
}

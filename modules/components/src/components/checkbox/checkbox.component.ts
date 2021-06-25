import { Component, Input, Output, EventEmitter, HostBinding, HostListener, ViewChild, ElementRef, ContentChild } from '@angular/core'

@Component({
  selector: 'eqm-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: [ './checkbox.component.scss' ]
})
export class CheckboxComponent {
  @Input() labelSide: 'left' | 'right'
  @Input() interactive: boolean = true
  @Input() checked: boolean = false
  @Output() checkedChanged = new EventEmitter<boolean>()
  @HostBinding('class.enabled') @Input() enabled = true

  @HostListener('click')
  toggle () {
    if (this.interactive && this.enabled) {
      this.checked = !this.checked
      this.checkedChanged.emit(this.checked)
    }
  }
}

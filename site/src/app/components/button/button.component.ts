import { Component, OnInit, Output, EventEmitter, HostListener, HostBinding } from '@angular/core'

@Component({
  selector: 'eqm-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Output() pressed = new EventEmitter()
  @HostBinding('class.pressing') pressing = false
  constructor() { }

  ngOnInit() {
  }

  @HostListener('mousedown')
  onMouseDown() {
    this.pressing = true
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.pressing = false
  }

  @HostListener('mouseup')
  onMouseUp() {
    if (this.pressing) {
      this.pressing = false
      this.pressed.emit()
    }
  }
}

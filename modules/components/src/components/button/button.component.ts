import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'eqm-button',
  templateUrl: './button.component.html',
  styleUrls: [ './button.component.scss' ]
})
export class ButtonComponent implements OnInit {
  @Input() type: 'large' | 'narrow' | 'square' | 'circle' | 'transparent' = 'large'
  @Input() height = null
  @Input() width = null
  @Input() state = false
  @Input() toggle = false
  @Input() depressable = true
  @Input() hoverable = true
  @Input() enabled = true
  @Output() pressed = new EventEmitter()

  ngOnInit () {
  }

  get style () {
    return {
      width: `${this.width}px`,
      height: `${this.height}px`
    }
  }

  computeClass () {
    let className = 'button'
    className += ` ${this.type}`
    className += this.state ? ' on' : ' off'
    if (this.enabled) {
      className += ' enabled'
    }
    if (this.hoverable) {
      className += ' hoverable-' + (this.state ? 'on' : 'off')
    }
    return className
  }

  click () {
    if (this.enabled) {
      if (this.toggle) {
        if (this.state && this.depressable) {
          this.state = !this.state
        }
      } else {
        this.state = true
        setTimeout(() => {
          this.state = false
        }, 100)
      }
      this.pressed.emit()
    }
  }
}

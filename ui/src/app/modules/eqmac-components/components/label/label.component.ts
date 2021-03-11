import { Component, OnInit, Input, HostBinding } from '@angular/core'

@Component({
  selector: 'eqm-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent {
  @Input() fontSize: number
  @Input() color: string
  @Input() clickable = false
  constructor () { }

  get style () {
    return {
      ...(this.color && { color: this.color }),
      ...(this.fontSize && { fontSize: `${this.fontSize}px` }),
      ...(this.clickable && { cursor: 'pointer' })
    }
  }

  @HostBinding('style.cursor') get cursor () {
    return this.clickable ? 'pointer' : 'inherit'
  }
}

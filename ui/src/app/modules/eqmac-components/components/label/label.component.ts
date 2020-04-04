import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'eqm-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent {
  @Input() fontSize: number
  @Input() color: string
  constructor () { }

  get style () {
    return {
      ...(this.color && { color: this.color }),
      ...(this.fontSize && { fontSize: `${this.fontSize}px` })
    }
  }
}

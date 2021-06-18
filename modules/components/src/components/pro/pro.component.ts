import { Component, Input } from '@angular/core'
import { ColorsService } from '../../services/colors.service'

@Component({
  selector: 'eqm-pro',
  template: `
    <div [style]="style">
      <eqm-label [fontSize]="fontSize">Pro</eqm-label>
    </div>
  `
})
export class ProComponent {
  @Input() color = this.colors.light
  @Input() backgroundColor = this.colors.dark
  @Input() fontSize = 14
  constructor (public colors: ColorsService) {}
  style: { [name: string]: any } = {
    display: 'inline-block',
    backgroundColor: this.backgroundColor,
    color: this.color,
    borderRadius: '4px',
    padding: '2px 4px'
  }
}
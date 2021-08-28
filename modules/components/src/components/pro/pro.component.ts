import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { ColorsService } from '../../services/colors.service'

@Component({
  selector: 'eqm-pro',
  template: `
    <div [ngStyle]="style">
      <eqm-label [fontSize]="fontSize" [color]="color">Pro</eqm-label>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProComponent {
  @Input() color = this.colors.light
  @Input() backgroundColor = this.colors.dark
  @Input() fontSize = 14
  constructor (public colors: ColorsService) {}
  get style () {
    return {
      display: 'inline-block',
      backgroundColor: this.backgroundColor,
      color: this.color,
      borderRadius: '4px',
      padding: '2px 4px'
    }
  }
}

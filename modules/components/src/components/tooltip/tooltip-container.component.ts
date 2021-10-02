import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { TooltipService } from './tooltip.service'
import { FadeInOutAnimation } from '../../animations/fade-in-out'

@Component({
  selector: 'eqm-tooltip-container',
  template: `
    <div class="tooltip-container">
      <eqm-tooltip
        *ngFor="let tooltip of tooltipService.components"
        [text]="tooltip.text"
        [parent]="tooltip.parent"
        [positionSide]="tooltip.positionSide"
        [scale]="scale"
        [showArrow]="tooltip.showArrow">
      </eqm-tooltip>
    </div>
  `,
  animations: [ FadeInOutAnimation ]
})
export class TooltipContainerComponent {
  @Input() scale = 1
  constructor (public tooltipService: TooltipService) {}
}

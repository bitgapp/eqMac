import { ChangeDetectionStrategy, Component } from '@angular/core'
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
        [showArrow]="tooltip.showArrow">
      </eqm-tooltip>
    </div>
  `,
  animations: [ FadeInOutAnimation ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipContainerComponent {
  constructor (public tooltipService: TooltipService) {}
}

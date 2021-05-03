import { Component } from '@angular/core';
import { TooltipService } from './tooltip.service';
import { FadeInOutAnimation } from '../../animations/fade-in-out';
export class TooltipContainerComponent {
    constructor(tooltipService) {
        this.tooltipService = tooltipService;
    }
}
TooltipContainerComponent.decorators = [
    { type: Component, args: [{
                selector: 'eqm-tooltip-container',
                template: `
    <div class="tooltip-container">
      <eqm-tooltip
        *ngFor="let tooltip of tooltipService.components"
        [@FadeInOut]
        [text]="tooltip.text"
        [parent]="tooltip.parent"
        [positionSide]="tooltip.positionSide"
        [showArrow]="tooltip.showArrow">
      </eqm-tooltip>
    </div>
  `,
                animations: [FadeInOutAnimation]
            },] }
];
TooltipContainerComponent.ctorParameters = () => [
    { type: TooltipService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC1jb250YWluZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvY29tcG9uZW50cy90b29sdGlwL3Rvb2x0aXAtY29udGFpbmVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFBO0FBQ3pDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUNsRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQTtBQWtCakUsTUFBTSxPQUFPLHlCQUF5QjtJQUNwQyxZQUFvQixjQUE4QjtRQUE5QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7SUFBRyxDQUFDOzs7WUFqQnZELFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsdUJBQXVCO2dCQUNqQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7O0dBV1Q7Z0JBQ0QsVUFBVSxFQUFFLENBQUUsa0JBQWtCLENBQUU7YUFDbkM7OztZQWxCUSxjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7IFRvb2x0aXBTZXJ2aWNlIH0gZnJvbSAnLi90b29sdGlwLnNlcnZpY2UnXG5pbXBvcnQgeyBGYWRlSW5PdXRBbmltYXRpb24gfSBmcm9tICcuLi8uLi9hbmltYXRpb25zL2ZhZGUtaW4tb3V0J1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdlcW0tdG9vbHRpcC1jb250YWluZXInLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJ0b29sdGlwLWNvbnRhaW5lclwiPlxuICAgICAgPGVxbS10b29sdGlwXG4gICAgICAgICpuZ0Zvcj1cImxldCB0b29sdGlwIG9mIHRvb2x0aXBTZXJ2aWNlLmNvbXBvbmVudHNcIlxuICAgICAgICBbQEZhZGVJbk91dF1cbiAgICAgICAgW3RleHRdPVwidG9vbHRpcC50ZXh0XCJcbiAgICAgICAgW3BhcmVudF09XCJ0b29sdGlwLnBhcmVudFwiXG4gICAgICAgIFtwb3NpdGlvblNpZGVdPVwidG9vbHRpcC5wb3NpdGlvblNpZGVcIlxuICAgICAgICBbc2hvd0Fycm93XT1cInRvb2x0aXAuc2hvd0Fycm93XCI+XG4gICAgICA8L2VxbS10b29sdGlwPlxuICAgIDwvZGl2PlxuICBgLFxuICBhbmltYXRpb25zOiBbIEZhZGVJbk91dEFuaW1hdGlvbiBdXG59KVxuZXhwb3J0IGNsYXNzIFRvb2x0aXBDb250YWluZXJDb21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHVibGljIHRvb2x0aXBTZXJ2aWNlOiBUb29sdGlwU2VydmljZSkge31cbn1cbiJdfQ==
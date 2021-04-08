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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC1jb250YWluZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2NvbXBvbmVudHMvdG9vbHRpcC90b29sdGlwLWNvbnRhaW5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQTtBQUN6QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUE7QUFDbEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sOEJBQThCLENBQUE7QUFrQmpFLE1BQU0sT0FBTyx5QkFBeUI7SUFDcEMsWUFBb0IsY0FBOEI7UUFBOUIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO0lBQUcsQ0FBQzs7O1lBakJ2RCxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHVCQUF1QjtnQkFDakMsUUFBUSxFQUFFOzs7Ozs7Ozs7OztHQVdUO2dCQUNELFVBQVUsRUFBRSxDQUFFLGtCQUFrQixDQUFFO2FBQ25DOzs7WUFsQlEsY0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5pbXBvcnQgeyBUb29sdGlwU2VydmljZSB9IGZyb20gJy4vdG9vbHRpcC5zZXJ2aWNlJ1xuaW1wb3J0IHsgRmFkZUluT3V0QW5pbWF0aW9uIH0gZnJvbSAnLi4vLi4vYW5pbWF0aW9ucy9mYWRlLWluLW91dCdcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZXFtLXRvb2x0aXAtY29udGFpbmVyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwidG9vbHRpcC1jb250YWluZXJcIj5cbiAgICAgIDxlcW0tdG9vbHRpcFxuICAgICAgICAqbmdGb3I9XCJsZXQgdG9vbHRpcCBvZiB0b29sdGlwU2VydmljZS5jb21wb25lbnRzXCJcbiAgICAgICAgW0BGYWRlSW5PdXRdXG4gICAgICAgIFt0ZXh0XT1cInRvb2x0aXAudGV4dFwiXG4gICAgICAgIFtwYXJlbnRdPVwidG9vbHRpcC5wYXJlbnRcIlxuICAgICAgICBbcG9zaXRpb25TaWRlXT1cInRvb2x0aXAucG9zaXRpb25TaWRlXCJcbiAgICAgICAgW3Nob3dBcnJvd109XCJ0b29sdGlwLnNob3dBcnJvd1wiPlxuICAgICAgPC9lcW0tdG9vbHRpcD5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgYW5pbWF0aW9uczogWyBGYWRlSW5PdXRBbmltYXRpb24gXVxufSlcbmV4cG9ydCBjbGFzcyBUb29sdGlwQ29udGFpbmVyQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHB1YmxpYyB0b29sdGlwU2VydmljZTogVG9vbHRpcFNlcnZpY2UpIHt9XG59XG4iXX0=
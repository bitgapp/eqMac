import { Component } from '@angular/core';
import { FadeInOutAnimation } from '../../animations/fade-in-out';
import * as i0 from "@angular/core";
import * as i1 from "./tooltip.service";
import * as i2 from "@angular/common";
import * as i3 from "./tooltip.component";
function TooltipContainerComponent_eqm_tooltip_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "eqm-tooltip", 2);
} if (rf & 2) {
    const tooltip_r1 = ctx.$implicit;
    i0.ɵɵproperty("@FadeInOut", undefined)("text", tooltip_r1.text)("parent", tooltip_r1.parent)("positionSide", tooltip_r1.positionSide)("showArrow", tooltip_r1.showArrow);
} }
export class TooltipContainerComponent {
    constructor(tooltipService) {
        this.tooltipService = tooltipService;
    }
}
TooltipContainerComponent.ɵfac = function TooltipContainerComponent_Factory(t) { return new (t || TooltipContainerComponent)(i0.ɵɵdirectiveInject(i1.TooltipService)); };
TooltipContainerComponent.ɵcmp = i0.ɵɵdefineComponent({ type: TooltipContainerComponent, selectors: [["eqm-tooltip-container"]], decls: 2, vars: 1, consts: [[1, "tooltip-container"], [3, "text", "parent", "positionSide", "showArrow", 4, "ngFor", "ngForOf"], [3, "text", "parent", "positionSide", "showArrow"]], template: function TooltipContainerComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "div", 0);
        i0.ɵɵtemplate(1, TooltipContainerComponent_eqm_tooltip_1_Template, 1, 5, "eqm-tooltip", 1);
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngForOf", ctx.tooltipService.components);
    } }, directives: [i2.NgForOf, i3.TooltipComponent], encapsulation: 2, data: { animation: [FadeInOutAnimation] } });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TooltipContainerComponent, [{
        type: Component,
        args: [{
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
            }]
    }], function () { return [{ type: i1.TooltipService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC1jb250YWluZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvY29tcG9uZW50cy90b29sdGlwL3Rvb2x0aXAtY29udGFpbmVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFBO0FBRXpDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDhCQUE4QixDQUFBOzs7Ozs7SUFNM0QsaUNBT2M7OztJQUxaLHNDQUFZLHlCQUFBLDZCQUFBLHlDQUFBLG1DQUFBOztBQVVwQixNQUFNLE9BQU8seUJBQXlCO0lBQ3BDLFlBQW9CLGNBQThCO1FBQTlCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtJQUFHLENBQUM7O2tHQUQzQyx5QkFBeUI7OERBQXpCLHlCQUF5QjtRQWJsQyw4QkFBK0I7UUFDN0IsMEZBT2M7UUFDaEIsaUJBQU07O1FBUGtCLGVBQTRCO1FBQTVCLHVEQUE0Qjs2RkFTMUMsQ0FBRSxrQkFBa0IsQ0FBRTt1RkFFdkIseUJBQXlCO2NBaEJyQyxTQUFTO2VBQUM7Z0JBQ1QsUUFBUSxFQUFFLHVCQUF1QjtnQkFDakMsUUFBUSxFQUFFOzs7Ozs7Ozs7OztHQVdUO2dCQUNELFVBQVUsRUFBRSxDQUFFLGtCQUFrQixDQUFFO2FBQ25DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7IFRvb2x0aXBTZXJ2aWNlIH0gZnJvbSAnLi90b29sdGlwLnNlcnZpY2UnXG5pbXBvcnQgeyBGYWRlSW5PdXRBbmltYXRpb24gfSBmcm9tICcuLi8uLi9hbmltYXRpb25zL2ZhZGUtaW4tb3V0J1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdlcW0tdG9vbHRpcC1jb250YWluZXInLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJ0b29sdGlwLWNvbnRhaW5lclwiPlxuICAgICAgPGVxbS10b29sdGlwXG4gICAgICAgICpuZ0Zvcj1cImxldCB0b29sdGlwIG9mIHRvb2x0aXBTZXJ2aWNlLmNvbXBvbmVudHNcIlxuICAgICAgICBbQEZhZGVJbk91dF1cbiAgICAgICAgW3RleHRdPVwidG9vbHRpcC50ZXh0XCJcbiAgICAgICAgW3BhcmVudF09XCJ0b29sdGlwLnBhcmVudFwiXG4gICAgICAgIFtwb3NpdGlvblNpZGVdPVwidG9vbHRpcC5wb3NpdGlvblNpZGVcIlxuICAgICAgICBbc2hvd0Fycm93XT1cInRvb2x0aXAuc2hvd0Fycm93XCI+XG4gICAgICA8L2VxbS10b29sdGlwPlxuICAgIDwvZGl2PlxuICBgLFxuICBhbmltYXRpb25zOiBbIEZhZGVJbk91dEFuaW1hdGlvbiBdXG59KVxuZXhwb3J0IGNsYXNzIFRvb2x0aXBDb250YWluZXJDb21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHVibGljIHRvb2x0aXBTZXJ2aWNlOiBUb29sdGlwU2VydmljZSkge31cbn1cbiJdfQ==
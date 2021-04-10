import { Directive, Input, HostListener } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./tooltip.service";
export class TooltipDirective {
    constructor(tooltipService, element) {
        this.tooltipService = tooltipService;
        this.element = element;
        this.eqmTooltip = '';
        this.eqmTooltipDelay = 100;
        this.eqmTooltipPositionSide = 'top';
        this.eqmTooltipShowArrow = true;
    }
    onMouseEnter() {
        this.left = false;
        this.id = Math.round(Math.random() * 10000).toString();
        const tooltip = {
            id: this.id,
            parent: this.element,
            positionSide: this.eqmTooltipPositionSide,
            showArrow: this.eqmTooltipShowArrow,
            text: this.eqmTooltip
        };
        setTimeout(() => {
            if (!this.left) {
                this.tooltipService.components.push(tooltip);
            }
        }, this.eqmTooltipDelay);
    }
    onMouseLeave() {
        this.left = true;
        this.destroy();
    }
    onMouseClick() {
        this.left = true;
        this.destroy();
    }
    ngOnDestroy() {
        this.destroy();
    }
    destroy() {
        this.tooltipService.components = [];
    }
}
TooltipDirective.ɵfac = function TooltipDirective_Factory(t) { return new (t || TooltipDirective)(i0.ɵɵdirectiveInject(i1.TooltipService), i0.ɵɵdirectiveInject(i0.ElementRef)); };
TooltipDirective.ɵdir = i0.ɵɵdefineDirective({ type: TooltipDirective, selectors: [["", "eqmTooltip", ""]], hostBindings: function TooltipDirective_HostBindings(rf, ctx) { if (rf & 1) {
        i0.ɵɵlistener("mouseenter", function TooltipDirective_mouseenter_HostBindingHandler() { return ctx.onMouseEnter(); })("mouseleave", function TooltipDirective_mouseleave_HostBindingHandler() { return ctx.onMouseLeave(); })("click", function TooltipDirective_click_HostBindingHandler() { return ctx.onMouseClick(); });
    } }, inputs: { eqmTooltip: "eqmTooltip", eqmTooltipDelay: "eqmTooltipDelay", eqmTooltipPositionSide: "eqmTooltipPositionSide", eqmTooltipShowArrow: "eqmTooltipShowArrow" } });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TooltipDirective, [{
        type: Directive,
        args: [{
                selector: '[eqmTooltip]'
            }]
    }], function () { return [{ type: i1.TooltipService }, { type: i0.ElementRef }]; }, { eqmTooltip: [{
            type: Input
        }], eqmTooltipDelay: [{
            type: Input
        }], eqmTooltipPositionSide: [{
            type: Input
        }], eqmTooltipShowArrow: [{
            type: Input
        }], onMouseEnter: [{
            type: HostListener,
            args: ['mouseenter']
        }], onMouseLeave: [{
            type: HostListener,
            args: ['mouseleave']
        }], onMouseClick: [{
            type: HostListener,
            args: ['click']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL3Rvb2x0aXAvdG9vbHRpcC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBYSxLQUFLLEVBQUUsWUFBWSxFQUFjLE1BQU0sZUFBZSxDQUFBOzs7QUFPckYsTUFBTSxPQUFPLGdCQUFnQjtJQU8zQixZQUFvQixjQUE4QixFQUFTLE9BQW1CO1FBQTFELG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUFTLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFOckUsZUFBVSxHQUFHLEVBQUUsQ0FBQTtRQUNmLG9CQUFlLEdBQUcsR0FBRyxDQUFBO1FBQ3JCLDJCQUFzQixHQUF3QixLQUFLLENBQUE7UUFDbkQsd0JBQW1CLEdBQVksSUFBSSxDQUFBO0lBR3NDLENBQUM7SUFHbkYsWUFBWTtRQUNWLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFBO1FBQ2pCLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDdEQsTUFBTSxPQUFPLEdBQUc7WUFDZCxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDWCxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDcEIsWUFBWSxFQUFFLElBQUksQ0FBQyxzQkFBc0I7WUFDekMsU0FBUyxFQUFFLElBQUksQ0FBQyxtQkFBbUI7WUFDbkMsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVO1NBQ3RCLENBQUE7UUFDRCxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO2FBQzdDO1FBQ0gsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtJQUMxQixDQUFDO0lBR0QsWUFBWTtRQUNWLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBQ2hCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtJQUNoQixDQUFDO0lBR0QsWUFBWTtRQUNWLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBQ2hCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtJQUNoQixDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtJQUNoQixDQUFDO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQTtJQUNyQyxDQUFDOztnRkE3Q1UsZ0JBQWdCO3FEQUFoQixnQkFBZ0I7dUdBQWhCLGtCQUFjLHNGQUFkLGtCQUFjLDRFQUFkLGtCQUFjOzt1RkFBZCxnQkFBZ0I7Y0FINUIsU0FBUztlQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2FBQ3pCOzBGQUVVLFVBQVU7a0JBQWxCLEtBQUs7WUFDRyxlQUFlO2tCQUF2QixLQUFLO1lBQ0csc0JBQXNCO2tCQUE5QixLQUFLO1lBQ0csbUJBQW1CO2tCQUEzQixLQUFLO1lBTU4sWUFBWTtrQkFEWCxZQUFZO21CQUFDLFlBQVk7WUFtQjFCLFlBQVk7a0JBRFgsWUFBWTttQkFBQyxZQUFZO1lBTzFCLFlBQVk7a0JBRFgsWUFBWTttQkFBQyxPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBPbkRlc3Ryb3ksIElucHV0LCBIb3N0TGlzdGVuZXIsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuaW1wb3J0IHsgVG9vbHRpcFNlcnZpY2UgfSBmcm9tICcuL3Rvb2x0aXAuc2VydmljZSdcbmltcG9ydCB7IFRvb2x0aXBQb3NpdGlvblNpZGUgfSBmcm9tICcuL3Rvb2x0aXAuY29tcG9uZW50J1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbZXFtVG9vbHRpcF0nXG59KVxuZXhwb3J0IGNsYXNzIFRvb2x0aXBEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBlcW1Ub29sdGlwID0gJydcbiAgQElucHV0KCkgZXFtVG9vbHRpcERlbGF5ID0gMTAwXG4gIEBJbnB1dCgpIGVxbVRvb2x0aXBQb3NpdGlvblNpZGU6IFRvb2x0aXBQb3NpdGlvblNpZGUgPSAndG9wJ1xuICBASW5wdXQoKSBlcW1Ub29sdGlwU2hvd0Fycm93OiBib29sZWFuID0gdHJ1ZVxuICBwdWJsaWMgaWQ/OiBzdHJpbmdcbiAgcHVibGljIGxlZnQ/OiBib29sZWFuXG4gIGNvbnN0cnVjdG9yIChwdWJsaWMgdG9vbHRpcFNlcnZpY2U6IFRvb2x0aXBTZXJ2aWNlLCBwdWJsaWMgZWxlbWVudDogRWxlbWVudFJlZikgeyB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2VlbnRlcicpXG4gIG9uTW91c2VFbnRlciAoKTogdm9pZCB7XG4gICAgdGhpcy5sZWZ0ID0gZmFsc2VcbiAgICB0aGlzLmlkID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTAwMDApLnRvU3RyaW5nKClcbiAgICBjb25zdCB0b29sdGlwID0ge1xuICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICBwYXJlbnQ6IHRoaXMuZWxlbWVudCxcbiAgICAgIHBvc2l0aW9uU2lkZTogdGhpcy5lcW1Ub29sdGlwUG9zaXRpb25TaWRlLFxuICAgICAgc2hvd0Fycm93OiB0aGlzLmVxbVRvb2x0aXBTaG93QXJyb3csXG4gICAgICB0ZXh0OiB0aGlzLmVxbVRvb2x0aXBcbiAgICB9XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMubGVmdCkge1xuICAgICAgICB0aGlzLnRvb2x0aXBTZXJ2aWNlLmNvbXBvbmVudHMucHVzaCh0b29sdGlwKVxuICAgICAgfVxuICAgIH0sIHRoaXMuZXFtVG9vbHRpcERlbGF5KVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2VsZWF2ZScpXG4gIG9uTW91c2VMZWF2ZSAoKTogdm9pZCB7XG4gICAgdGhpcy5sZWZ0ID0gdHJ1ZVxuICAgIHRoaXMuZGVzdHJveSgpXG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjbGljaycpXG4gIG9uTW91c2VDbGljayAoKTogdm9pZCB7XG4gICAgdGhpcy5sZWZ0ID0gdHJ1ZVxuICAgIHRoaXMuZGVzdHJveSgpXG4gIH1cblxuICBuZ09uRGVzdHJveSAoKTogdm9pZCB7XG4gICAgdGhpcy5kZXN0cm95KClcbiAgfVxuXG4gIGRlc3Ryb3kgKCk6IHZvaWQge1xuICAgIHRoaXMudG9vbHRpcFNlcnZpY2UuY29tcG9uZW50cyA9IFtdXG4gIH1cbn1cbiJdfQ==
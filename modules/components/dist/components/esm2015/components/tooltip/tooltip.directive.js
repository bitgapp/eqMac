import { Directive, Input, HostListener, ElementRef } from '@angular/core';
import { TooltipService } from './tooltip.service';
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
TooltipDirective.decorators = [
    { type: Directive, args: [{
                selector: '[eqmTooltip]'
            },] }
];
TooltipDirective.ctorParameters = () => [
    { type: TooltipService },
    { type: ElementRef }
];
TooltipDirective.propDecorators = {
    eqmTooltip: [{ type: Input }],
    eqmTooltipDelay: [{ type: Input }],
    eqmTooltipPositionSide: [{ type: Input }],
    eqmTooltipShowArrow: [{ type: Input }],
    onMouseEnter: [{ type: HostListener, args: ['mouseenter',] }],
    onMouseLeave: [{ type: HostListener, args: ['mouseleave',] }],
    onMouseClick: [{ type: HostListener, args: ['click',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL3Rvb2x0aXAvdG9vbHRpcC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBYSxLQUFLLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQTtBQUNyRixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUE7QUFNbEQsTUFBTSxPQUFPLGdCQUFnQjtJQU8zQixZQUFvQixjQUE4QixFQUFTLE9BQW1CO1FBQTFELG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUFTLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFOckUsZUFBVSxHQUFHLEVBQUUsQ0FBQTtRQUNmLG9CQUFlLEdBQUcsR0FBRyxDQUFBO1FBQ3JCLDJCQUFzQixHQUF3QixLQUFLLENBQUE7UUFDbkQsd0JBQW1CLEdBQVksSUFBSSxDQUFBO0lBR3NDLENBQUM7SUFHbkYsWUFBWTtRQUNWLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFBO1FBQ2pCLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDdEQsTUFBTSxPQUFPLEdBQUc7WUFDZCxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDWCxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDcEIsWUFBWSxFQUFFLElBQUksQ0FBQyxzQkFBc0I7WUFDekMsU0FBUyxFQUFFLElBQUksQ0FBQyxtQkFBbUI7WUFDbkMsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVO1NBQ3RCLENBQUE7UUFDRCxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO2FBQzdDO1FBQ0gsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtJQUMxQixDQUFDO0lBR0QsWUFBWTtRQUNWLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBQ2hCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtJQUNoQixDQUFDO0lBR0QsWUFBWTtRQUNWLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBQ2hCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtJQUNoQixDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtJQUNoQixDQUFDO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQTtJQUNyQyxDQUFDOzs7WUFoREYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2FBQ3pCOzs7WUFMUSxjQUFjO1lBRDZCLFVBQVU7Ozt5QkFRM0QsS0FBSzs4QkFDTCxLQUFLO3FDQUNMLEtBQUs7a0NBQ0wsS0FBSzsyQkFLTCxZQUFZLFNBQUMsWUFBWTsyQkFrQnpCLFlBQVksU0FBQyxZQUFZOzJCQU16QixZQUFZLFNBQUMsT0FBTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgT25EZXN0cm95LCBJbnB1dCwgSG9zdExpc3RlbmVyLCBFbGVtZW50UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7IFRvb2x0aXBTZXJ2aWNlIH0gZnJvbSAnLi90b29sdGlwLnNlcnZpY2UnXG5pbXBvcnQgeyBUb29sdGlwUG9zaXRpb25TaWRlIH0gZnJvbSAnLi90b29sdGlwLmNvbXBvbmVudCdcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2VxbVRvb2x0aXBdJ1xufSlcbmV4cG9ydCBjbGFzcyBUb29sdGlwRGlyZWN0aXZlIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgQElucHV0KCkgZXFtVG9vbHRpcCA9ICcnXG4gIEBJbnB1dCgpIGVxbVRvb2x0aXBEZWxheSA9IDEwMFxuICBASW5wdXQoKSBlcW1Ub29sdGlwUG9zaXRpb25TaWRlOiBUb29sdGlwUG9zaXRpb25TaWRlID0gJ3RvcCdcbiAgQElucHV0KCkgZXFtVG9vbHRpcFNob3dBcnJvdzogYm9vbGVhbiA9IHRydWVcbiAgcHVibGljIGlkPzogc3RyaW5nXG4gIHB1YmxpYyBsZWZ0PzogYm9vbGVhblxuICBjb25zdHJ1Y3RvciAocHVibGljIHRvb2x0aXBTZXJ2aWNlOiBUb29sdGlwU2VydmljZSwgcHVibGljIGVsZW1lbnQ6IEVsZW1lbnRSZWYpIHsgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZW50ZXInKVxuICBvbk1vdXNlRW50ZXIgKCk6IHZvaWQge1xuICAgIHRoaXMubGVmdCA9IGZhbHNlXG4gICAgdGhpcy5pZCA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDEwMDAwKS50b1N0cmluZygpXG4gICAgY29uc3QgdG9vbHRpcCA9IHtcbiAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgcGFyZW50OiB0aGlzLmVsZW1lbnQsXG4gICAgICBwb3NpdGlvblNpZGU6IHRoaXMuZXFtVG9vbHRpcFBvc2l0aW9uU2lkZSxcbiAgICAgIHNob3dBcnJvdzogdGhpcy5lcW1Ub29sdGlwU2hvd0Fycm93LFxuICAgICAgdGV4dDogdGhpcy5lcW1Ub29sdGlwXG4gICAgfVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmxlZnQpIHtcbiAgICAgICAgdGhpcy50b29sdGlwU2VydmljZS5jb21wb25lbnRzLnB1c2godG9vbHRpcClcbiAgICAgIH1cbiAgICB9LCB0aGlzLmVxbVRvb2x0aXBEZWxheSlcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlbGVhdmUnKVxuICBvbk1vdXNlTGVhdmUgKCk6IHZvaWQge1xuICAgIHRoaXMubGVmdCA9IHRydWVcbiAgICB0aGlzLmRlc3Ryb3koKVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignY2xpY2snKVxuICBvbk1vdXNlQ2xpY2sgKCk6IHZvaWQge1xuICAgIHRoaXMubGVmdCA9IHRydWVcbiAgICB0aGlzLmRlc3Ryb3koKVxuICB9XG5cbiAgbmdPbkRlc3Ryb3kgKCk6IHZvaWQge1xuICAgIHRoaXMuZGVzdHJveSgpXG4gIH1cblxuICBkZXN0cm95ICgpOiB2b2lkIHtcbiAgICB0aGlzLnRvb2x0aXBTZXJ2aWNlLmNvbXBvbmVudHMgPSBbXVxuICB9XG59XG4iXX0=
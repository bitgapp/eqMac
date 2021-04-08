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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvY29tcG9uZW50cy90b29sdGlwL3Rvb2x0aXAuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWEsS0FBSyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUE7QUFDckYsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBTWxELE1BQU0sT0FBTyxnQkFBZ0I7SUFPM0IsWUFBb0IsY0FBOEIsRUFBUyxPQUFtQjtRQUExRCxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFBUyxZQUFPLEdBQVAsT0FBTyxDQUFZO1FBTnJFLGVBQVUsR0FBRyxFQUFFLENBQUE7UUFDZixvQkFBZSxHQUFHLEdBQUcsQ0FBQTtRQUNyQiwyQkFBc0IsR0FBd0IsS0FBSyxDQUFBO1FBQ25ELHdCQUFtQixHQUFZLElBQUksQ0FBQTtJQUdzQyxDQUFDO0lBR25GLFlBQVk7UUFDVixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQTtRQUNqQixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQ3RELE1BQU0sT0FBTyxHQUFHO1lBQ2QsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQ1gsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3BCLFlBQVksRUFBRSxJQUFJLENBQUMsc0JBQXNCO1lBQ3pDLFNBQVMsRUFBRSxJQUFJLENBQUMsbUJBQW1CO1lBQ25DLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVTtTQUN0QixDQUFBO1FBQ0QsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNkLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTthQUM3QztRQUNILENBQUMsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUE7SUFDMUIsQ0FBQztJQUdELFlBQVk7UUFDVixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtRQUNoQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7SUFDaEIsQ0FBQztJQUdELFlBQVk7UUFDVixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtRQUNoQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7SUFDaEIsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7SUFDaEIsQ0FBQztJQUVELE9BQU87UUFDTCxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUE7SUFDckMsQ0FBQzs7O1lBaERGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsY0FBYzthQUN6Qjs7O1lBTFEsY0FBYztZQUQ2QixVQUFVOzs7eUJBUTNELEtBQUs7OEJBQ0wsS0FBSztxQ0FDTCxLQUFLO2tDQUNMLEtBQUs7MkJBS0wsWUFBWSxTQUFDLFlBQVk7MkJBa0J6QixZQUFZLFNBQUMsWUFBWTsyQkFNekIsWUFBWSxTQUFDLE9BQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIE9uRGVzdHJveSwgSW5wdXQsIEhvc3RMaXN0ZW5lciwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5pbXBvcnQgeyBUb29sdGlwU2VydmljZSB9IGZyb20gJy4vdG9vbHRpcC5zZXJ2aWNlJ1xuaW1wb3J0IHsgVG9vbHRpcFBvc2l0aW9uU2lkZSB9IGZyb20gJy4vdG9vbHRpcC5jb21wb25lbnQnXG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tlcW1Ub29sdGlwXSdcbn0pXG5leHBvcnQgY2xhc3MgVG9vbHRpcERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpIGVxbVRvb2x0aXAgPSAnJ1xuICBASW5wdXQoKSBlcW1Ub29sdGlwRGVsYXkgPSAxMDBcbiAgQElucHV0KCkgZXFtVG9vbHRpcFBvc2l0aW9uU2lkZTogVG9vbHRpcFBvc2l0aW9uU2lkZSA9ICd0b3AnXG4gIEBJbnB1dCgpIGVxbVRvb2x0aXBTaG93QXJyb3c6IGJvb2xlYW4gPSB0cnVlXG4gIHB1YmxpYyBpZD86IHN0cmluZ1xuICBwdWJsaWMgbGVmdD86IGJvb2xlYW5cbiAgY29uc3RydWN0b3IgKHB1YmxpYyB0b29sdGlwU2VydmljZTogVG9vbHRpcFNlcnZpY2UsIHB1YmxpYyBlbGVtZW50OiBFbGVtZW50UmVmKSB7IH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWVudGVyJylcbiAgb25Nb3VzZUVudGVyICgpOiB2b2lkIHtcbiAgICB0aGlzLmxlZnQgPSBmYWxzZVxuICAgIHRoaXMuaWQgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxMDAwMCkudG9TdHJpbmcoKVxuICAgIGNvbnN0IHRvb2x0aXAgPSB7XG4gICAgICBpZDogdGhpcy5pZCxcbiAgICAgIHBhcmVudDogdGhpcy5lbGVtZW50LFxuICAgICAgcG9zaXRpb25TaWRlOiB0aGlzLmVxbVRvb2x0aXBQb3NpdGlvblNpZGUsXG4gICAgICBzaG93QXJyb3c6IHRoaXMuZXFtVG9vbHRpcFNob3dBcnJvdyxcbiAgICAgIHRleHQ6IHRoaXMuZXFtVG9vbHRpcFxuICAgIH1cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICghdGhpcy5sZWZ0KSB7XG4gICAgICAgIHRoaXMudG9vbHRpcFNlcnZpY2UuY29tcG9uZW50cy5wdXNoKHRvb2x0aXApXG4gICAgICB9XG4gICAgfSwgdGhpcy5lcW1Ub29sdGlwRGVsYXkpXG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWxlYXZlJylcbiAgb25Nb3VzZUxlYXZlICgpOiB2b2lkIHtcbiAgICB0aGlzLmxlZnQgPSB0cnVlXG4gICAgdGhpcy5kZXN0cm95KClcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJylcbiAgb25Nb3VzZUNsaWNrICgpOiB2b2lkIHtcbiAgICB0aGlzLmxlZnQgPSB0cnVlXG4gICAgdGhpcy5kZXN0cm95KClcbiAgfVxuXG4gIG5nT25EZXN0cm95ICgpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3Ryb3koKVxuICB9XG5cbiAgZGVzdHJveSAoKTogdm9pZCB7XG4gICAgdGhpcy50b29sdGlwU2VydmljZS5jb21wb25lbnRzID0gW11cbiAgfVxufVxuIl19
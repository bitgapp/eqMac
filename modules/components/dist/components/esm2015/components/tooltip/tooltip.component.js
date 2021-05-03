import { __awaiter } from "tslib";
import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';
import { DomSanitizer } from '@angular/platform-browser';
export class TooltipComponent {
    constructor(elem, utils, sanitizer) {
        this.elem = elem;
        this.utils = utils;
        this.sanitizer = sanitizer;
        this.positionSide = 'top';
        this.showArrow = true;
        this.padding = 10;
    }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.utils.delay(0);
        });
    }
    get style() {
        var _a;
        if (!((_a = this.text) === null || _a === void 0 ? void 0 : _a.length)) {
            return {
                display: 'none'
            };
        }
        let x = -999;
        let y = -999;
        const body = document.body;
        const html = document.documentElement;
        const viewHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const viewWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
        const tooltipEl = this.tooltip.nativeElement;
        const tooltipWidth = parseInt(tooltipEl.offsetWidth) + 3;
        const tooltipHeight = parseInt(tooltipEl.offsetHeight) + 2;
        const parentEl = this.parent.nativeElement;
        const parentPosition = this.utils.getElementPosition(parentEl);
        const parentHeight = parseInt(parentEl.offsetHeight);
        x = parentPosition.x;
        y = parentPosition.y;
        if (this.positionSide === 'bottom') {
            y += parentHeight;
        }
        if (this.positionSide === 'top') {
            y -= tooltipHeight + this.padding;
            x -= tooltipWidth / 2;
        }
        if (this.positionSide === 'bottom') {
            y = y + this.padding;
            x = x - (tooltipWidth / 2);
        }
        const maxX = viewWidth - tooltipWidth - this.padding / 4;
        if (x > maxX)
            x = maxX;
        const minX = this.padding;
        if (x < minX)
            x = minX;
        const maxY = viewHeight - tooltipHeight - this.padding / 4;
        if (y > maxY)
            y = maxY;
        const minY = this.padding;
        if (y < minY)
            y = minY;
        return {
            left: `${x}px`,
            top: `${y}px`
        };
    }
    get arrowStyle() {
        const arrowSize = 12;
        let x = 0;
        let y = 0;
        let angle = 0;
        const style = {};
        const tooltipEl = this.tooltip.nativeElement;
        const tooltipHeight = tooltipEl.offsetHeight;
        const tooltipPosition = this.utils.getElementPosition(tooltipEl);
        const parentEl = this.parent.nativeElement;
        const parentPosition = this.utils.getElementPosition(parentEl);
        const parentWidth = parentEl.offsetWidth;
        x = parentPosition.x + parentWidth / 2 - tooltipPosition.x - arrowSize / 2 + 3;
        if (this.positionSide === 'top') {
            y = tooltipHeight - arrowSize / 2 + 4;
        }
        if (this.positionSide === 'top') {
            angle = 180;
        }
        if (this.positionSide === 'bottom') {
            y = -arrowSize / 2 + 3;
        }
        style.top = `${y}px`;
        style.left = `${x}px`;
        style.transform = `rotate(${angle}deg)`;
        return style;
    }
}
TooltipComponent.decorators = [
    { type: Component, args: [{
                selector: 'eqm-tooltip',
                template: "<div class=\"container\" [ngStyle]=\"style\">\n  <div #arrow\n    [hidden]=\"!showArrow\" \n    class=\"arrow-container\"\n    [ngStyle]=\"arrowStyle\"\n  >\n    <div class=\"arrow\"></div>\n  </div>\n  <eqm-container class=\"tooltip\" #tooltip>\n    <ng-content></ng-content>\n    <eqm-label *ngIf=\"text\">\n      {{text}}\n    </eqm-label>\n  </eqm-container>\n</div>",
                styles: [".container{display:block;position:absolute;left:-100px;top:-100px;pointer-events:none;z-index:9999}.container .tooltip{text-align:center;padding:0 4px;white-space:pre}.container .arrow-container{position:absolute;z-index:9998;width:12px;height:12px;display:flex;justify-content:center;align-items:center;-webkit-clip-path:polygon(0 0,100% 0,100% 50%,0 50%);clip-path:polygon(0 0,100% 0,100% 50%,0 50%)}.container .arrow-container .arrow{width:50%;height:50%;transform:rotate(45deg);background-color:#222324;box-shadow:0 0 0 1px #000,0 0 0 2px #464a4d;border-radius:10%}"]
            },] }
];
TooltipComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: UtilitiesService },
    { type: DomSanitizer }
];
TooltipComponent.propDecorators = {
    text: [{ type: Input }],
    parent: [{ type: Input }],
    positionSide: [{ type: Input }],
    showArrow: [{ type: Input }],
    arrow: [{ type: ViewChild, args: ['arrow', {
                    read: ElementRef,
                    static: true
                },] }],
    tooltip: [{ type: ViewChild, args: ['tooltip', {
                    read: ElementRef,
                    static: true
                },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL3Rvb2x0aXAvdG9vbHRpcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBRVQsS0FBSyxFQUNMLFVBQVUsRUFDVixTQUFTLEVBQ1YsTUFBTSxlQUFlLENBQUE7QUFDdEIsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sa0NBQWtDLENBQUE7QUFDbkUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDJCQUEyQixDQUFBO0FBUXhELE1BQU0sT0FBTyxnQkFBZ0I7SUFpQjNCLFlBQ1MsSUFBZ0IsRUFDaEIsS0FBdUIsRUFDdkIsU0FBdUI7UUFGdkIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNoQixVQUFLLEdBQUwsS0FBSyxDQUFrQjtRQUN2QixjQUFTLEdBQVQsU0FBUyxDQUFjO1FBakJ2QixpQkFBWSxHQUF3QixLQUFLLENBQUE7UUFDekMsY0FBUyxHQUFZLElBQUksQ0FBQTtRQUMzQixZQUFPLEdBQUcsRUFBRSxDQUFBO0lBZ0JoQixDQUFDO0lBRUUsUUFBUTs7WUFDWixNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzNCLENBQUM7S0FBQTtJQUVELElBQUksS0FBSzs7UUFDUCxJQUFJLFFBQUMsSUFBSSxDQUFDLElBQUksMENBQUUsTUFBTSxDQUFBLEVBQUU7WUFDdEIsT0FBTztnQkFDTCxPQUFPLEVBQUUsTUFBTTthQUNoQixDQUFBO1NBQ0Y7UUFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQTtRQUNaLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFBO1FBQ1osTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQTtRQUMxQixNQUFNLElBQUksR0FBRyxR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OztZQVhDLFVBQVU7WUFHSCxnQkFBZ0I7WUFDaEIsWUFBWTs7O21CQVNsQixLQUFLO3FCQUNMLEtBQUs7MkJBQ0wsS0FBSzt3QkFDTCxLQUFLO29CQUdMLFNBQVMsU0FBQyxPQUFPLEVBQUU7b0JBQ2xCLElBQUksRUFBRSxVQUFVO29CQUNoQixNQUFNLEVBQUUsSUFBSTtpQkFDYjtzQkFFQSxTQUFTLFNBQUMsU0FBUyxFQUFFO29CQUNwQixJQUFJLEVBQUUsVUFBVTtvQkFDaEIsTUFBTSxFQUFFLElBQUk7aUJBQ2IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgSW5wdXQsXG4gIEVsZW1lbnRSZWYsXG4gIFZpZXdDaGlsZFxufSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuaW1wb3J0IHsgVXRpbGl0aWVzU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3V0aWxpdGllcy5zZXJ2aWNlJ1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlcidcblxuZXhwb3J0IHR5cGUgVG9vbHRpcFBvc2l0aW9uU2lkZSA9ICd0b3AnIHwgJ2JvdHRvbScgfCAnbGVmdCcgfCAncmlnaHQnXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdlcW0tdG9vbHRpcCcsXG4gIHRlbXBsYXRlVXJsOiAnLi90b29sdGlwLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbICcuL3Rvb2x0aXAuY29tcG9uZW50LnNjc3MnIF1cbn0pXG5leHBvcnQgY2xhc3MgVG9vbHRpcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpIHRleHQ/OiBzdHJpbmdcbiAgQElucHV0KCkgcGFyZW50PzogYW55XG4gIEBJbnB1dCgpIHBvc2l0aW9uU2lkZTogVG9vbHRpcFBvc2l0aW9uU2lkZSA9ICd0b3AnXG4gIEBJbnB1dCgpIHNob3dBcnJvdzogQm9vbGVhbiA9IHRydWVcbiAgcHVibGljIHBhZGRpbmcgPSAxMFxuXG4gIEBWaWV3Q2hpbGQoJ2Fycm93Jywge1xuICAgIHJlYWQ6IEVsZW1lbnRSZWYsXG4gICAgc3RhdGljOiB0cnVlXG4gIH0pIGFycm93ITogRWxlbWVudFJlZlxuXG4gIEBWaWV3Q2hpbGQoJ3Rvb2x0aXAnLCB7XG4gICAgcmVhZDogRWxlbWVudFJlZixcbiAgICBzdGF0aWM6IHRydWVcbiAgfSkgdG9vbHRpcCE6IEVsZW1lbnRSZWZcblxuICBjb25zdHJ1Y3RvciAoXG4gICAgcHVibGljIGVsZW06IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIHV0aWxzOiBVdGlsaXRpZXNTZXJ2aWNlLFxuICAgIHB1YmxpYyBzYW5pdGl6ZXI6IERvbVNhbml0aXplclxuICApIHt9XG5cbiAgYXN5bmMgbmdPbkluaXQgKCkge1xuICAgIGF3YWl0IHRoaXMudXRpbHMuZGVsYXkoMClcbiAgfVxuXG4gIGdldCBzdHlsZSAoKSB7XG4gICAgaWYgKCF0aGlzLnRleHQ/Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGlzcGxheTogJ25vbmUnXG4gICAgICB9XG4gICAgfVxuICAgIGxldCB4ID0gLTk5OVxuICAgIGxldCB5ID0gLTk5OVxuICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5ib2R5XG4gICAgY29uc3QgaHRtbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxuICAgIGNvbnN0IHZpZXdIZWlnaHQgPSBNYXRoLm1heChib2R5LnNjcm9sbEhlaWdodCwgYm9keS5vZmZzZXRIZWlnaHQsIGh0bWwuY2xpZW50SGVpZ2h0LCBodG1sLnNjcm9sbEhlaWdodCwgaHRtbC5vZmZzZXRIZWlnaHQpXG4gICAgY29uc3Qgdmlld1dpZHRoID0gTWF0aC5tYXgoYm9keS5zY3JvbGxXaWR0aCwgYm9keS5vZmZzZXRXaWR0aCwgaHRtbC5jbGllbnRXaWR0aCwgaHRtbC5zY3JvbGxXaWR0aCwgaHRtbC5vZmZzZXRXaWR0aClcbiAgICBjb25zdCB0b29sdGlwRWwgPSB0aGlzLnRvb2x0aXAubmF0aXZlRWxlbWVudFxuICAgIGNvbnN0IHRvb2x0aXBXaWR0aCA9IHBhcnNlSW50KHRvb2x0aXBFbC5vZmZzZXRXaWR0aCkgKyAzXG4gICAgY29uc3QgdG9vbHRpcEhlaWdodCA9IHBhcnNlSW50KHRvb2x0aXBFbC5vZmZzZXRIZWlnaHQpICsgMlxuICAgIGNvbnN0IHBhcmVudEVsID0gdGhpcy5wYXJlbnQubmF0aXZlRWxlbWVudFxuICAgIGNvbnN0IHBhcmVudFBvc2l0aW9uID0gdGhpcy51dGlscy5nZXRFbGVtZW50UG9zaXRpb24ocGFyZW50RWwpXG4gICAgY29uc3QgcGFyZW50SGVpZ2h0ID0gcGFyc2VJbnQocGFyZW50RWwub2Zmc2V0SGVpZ2h0KVxuXG4gICAgeCA9IHBhcmVudFBvc2l0aW9uLnhcbiAgICB5ID0gcGFyZW50UG9zaXRpb24ueVxuXG4gICAgaWYgKHRoaXMucG9zaXRpb25TaWRlID09PSAnYm90dG9tJykge1xuICAgICAgeSArPSBwYXJlbnRIZWlnaHRcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wb3NpdGlvblNpZGUgPT09ICd0b3AnKSB7XG4gICAgICB5IC09IHRvb2x0aXBIZWlnaHQgKyB0aGlzLnBhZGRpbmdcbiAgICAgIHggLT0gdG9vbHRpcFdpZHRoIC8gMlxuICAgIH1cblxuICAgIGlmICh0aGlzLnBvc2l0aW9uU2lkZSA9PT0gJ2JvdHRvbScpIHtcbiAgICAgIHkgPSB5ICsgdGhpcy5wYWRkaW5nXG4gICAgICB4ID0geCAtICh0b29sdGlwV2lkdGggLyAyKVxuICAgIH1cblxuICAgIGNvbnN0IG1heFggPSB2aWV3V2lkdGggLSB0b29sdGlwV2lkdGggLSB0aGlzLnBhZGRpbmcgLyA0XG4gICAgaWYgKHggPiBtYXhYKSB4ID0gbWF4WFxuXG4gICAgY29uc3QgbWluWCA9IHRoaXMucGFkZGluZ1xuICAgIGlmICh4IDwgbWluWCkgeCA9IG1pblhcblxuICAgIGNvbnN0IG1heFkgPSB2aWV3SGVpZ2h0IC0gdG9vbHRpcEhlaWdodCAtIHRoaXMucGFkZGluZyAvIDRcbiAgICBpZiAoeSA+IG1heFkpIHkgPSBtYXhZXG5cbiAgICBjb25zdCBtaW5ZID0gdGhpcy5wYWRkaW5nXG4gICAgaWYgKHkgPCBtaW5ZKSB5ID0gbWluWVxuICAgIHJldHVybiB7XG4gICAgICBsZWZ0OiBgJHt4fXB4YCxcbiAgICAgIHRvcDogYCR7eX1weGBcbiAgICB9XG4gIH1cblxuICBnZXQgYXJyb3dTdHlsZSAoKSB7XG4gICAgY29uc3QgYXJyb3dTaXplID0gMTJcblxuICAgIGxldCB4ID0gMFxuICAgIGxldCB5ID0gMFxuICAgIGxldCBhbmdsZSA9IDBcbiAgICBjb25zdCBzdHlsZTogeyBbc3R5bGU6IHN0cmluZ106IHN0cmluZyB9ID0ge31cbiAgICBjb25zdCB0b29sdGlwRWwgPSB0aGlzLnRvb2x0aXAubmF0aXZlRWxlbWVudFxuICAgIGNvbnN0IHRvb2x0aXBIZWlnaHQgPSB0b29sdGlwRWwub2Zmc2V0SGVpZ2h0XG4gICAgY29uc3QgdG9vbHRpcFBvc2l0aW9uID0gdGhpcy51dGlscy5nZXRFbGVtZW50UG9zaXRpb24odG9vbHRpcEVsKVxuXG4gICAgY29uc3QgcGFyZW50RWwgPSB0aGlzLnBhcmVudC5uYXRpdmVFbGVtZW50XG4gICAgY29uc3QgcGFyZW50UG9zaXRpb24gPSB0aGlzLnV0aWxzLmdldEVsZW1lbnRQb3NpdGlvbihwYXJlbnRFbClcbiAgICBjb25zdCBwYXJlbnRXaWR0aCA9IHBhcmVudEVsLm9mZnNldFdpZHRoXG5cbiAgICB4ID0gcGFyZW50UG9zaXRpb24ueCArIHBhcmVudFdpZHRoIC8gMiAtIHRvb2x0aXBQb3NpdGlvbi54IC0gYXJyb3dTaXplIC8gMiArIDNcbiAgICBpZiAodGhpcy5wb3NpdGlvblNpZGUgPT09ICd0b3AnKSB7XG4gICAgICB5ID0gdG9vbHRpcEhlaWdodCAtIGFycm93U2l6ZSAvIDIgKyA0XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucG9zaXRpb25TaWRlID09PSAndG9wJykge1xuICAgICAgYW5nbGUgPSAxODBcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wb3NpdGlvblNpZGUgPT09ICdib3R0b20nKSB7XG4gICAgICB5ID0gLWFycm93U2l6ZSAvIDIgKyAzXG4gICAgfVxuXG4gICAgc3R5bGUudG9wID0gYCR7eX1weGBcbiAgICBzdHlsZS5sZWZ0ID0gYCR7eH1weGBcbiAgICBzdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlKCR7YW5nbGV9ZGVnKWBcblxuICAgIHJldHVybiBzdHlsZVxuICB9XG59XG4iXX0=
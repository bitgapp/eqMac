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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvY29tcG9uZW50cy90b29sdGlwL3Rvb2x0aXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULEtBQUssRUFDTCxVQUFVLEVBQ1YsU0FBUyxFQUNWLE1BQU0sZUFBZSxDQUFBO0FBQ3RCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFBO0FBQ25FLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQTtBQVF4RCxNQUFNLE9BQU8sZ0JBQWdCO0lBaUIzQixZQUNTLElBQWdCLEVBQ2hCLEtBQXVCLEVBQ3ZCLFNBQXVCO1FBRnZCLFNBQUksR0FBSixJQUFJLENBQVk7UUFDaEIsVUFBSyxHQUFMLEtBQUssQ0FBa0I7UUFDdkIsY0FBUyxHQUFULFNBQVMsQ0FBYztRQWpCdkIsaUJBQVksR0FBd0IsS0FBSyxDQUFBO1FBQ3pDLGNBQVMsR0FBWSxJQUFJLENBQUE7UUFDM0IsWUFBTyxHQUFHLEVBQUUsQ0FBQTtJQWdCaEIsQ0FBQztJQUVFLFFBQVE7O1lBQ1osTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUMzQixDQUFDO0tBQUE7SUFFRCxJQUFJLEtBQUs7O1FBQ1AsSUFBSSxRQUFDLElBQUksQ0FBQyxJQUFJLDBDQUFFLE1BQU0sQ0FBQSxFQUFFO1lBQ3RCLE9BQU87Z0JBQ0wsT0FBTyxFQUFFLE1BQU07YUFDaEIsQ0FBQTtTQUNGO1FBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUE7UUFDWixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQTtRQUNaLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUE7UUFDMUIsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFD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QUFVO1lBR0gsZ0JBQWdCO1lBQ2hCLFlBQVk7OzttQkFTbEIsS0FBSztxQkFDTCxLQUFLOzJCQUNMLEtBQUs7d0JBQ0wsS0FBSztvQkFHTCxTQUFTLFNBQUMsT0FBTyxFQUFFO29CQUNsQixJQUFJLEVBQUUsVUFBVTtvQkFDaEIsTUFBTSxFQUFFLElBQUk7aUJBQ2I7c0JBRUEsU0FBUyxTQUFDLFNBQVMsRUFBRTtvQkFDcEIsSUFBSSxFQUFFLFVBQVU7b0JBQ2hCLE1BQU0sRUFBRSxJQUFJO2lCQUNiIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBPbkluaXQsXG4gIElucHV0LFxuICBFbGVtZW50UmVmLFxuICBWaWV3Q2hpbGRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7IFV0aWxpdGllc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy91dGlsaXRpZXMuc2VydmljZSdcbmltcG9ydCB7IERvbVNhbml0aXplciB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInXG5cbmV4cG9ydCB0eXBlIFRvb2x0aXBQb3NpdGlvblNpZGUgPSAndG9wJyB8ICdib3R0b20nIHwgJ2xlZnQnIHwgJ3JpZ2h0J1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZXFtLXRvb2x0aXAnLFxuICB0ZW1wbGF0ZVVybDogJy4vdG9vbHRpcC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWyAnLi90b29sdGlwLmNvbXBvbmVudC5zY3NzJyBdXG59KVxuZXhwb3J0IGNsYXNzIFRvb2x0aXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKSB0ZXh0Pzogc3RyaW5nXG4gIEBJbnB1dCgpIHBhcmVudD86IGFueVxuICBASW5wdXQoKSBwb3NpdGlvblNpZGU6IFRvb2x0aXBQb3NpdGlvblNpZGUgPSAndG9wJ1xuICBASW5wdXQoKSBzaG93QXJyb3c6IEJvb2xlYW4gPSB0cnVlXG4gIHB1YmxpYyBwYWRkaW5nID0gMTBcblxuICBAVmlld0NoaWxkKCdhcnJvdycsIHtcbiAgICByZWFkOiBFbGVtZW50UmVmLFxuICAgIHN0YXRpYzogdHJ1ZVxuICB9KSBhcnJvdyE6IEVsZW1lbnRSZWZcblxuICBAVmlld0NoaWxkKCd0b29sdGlwJywge1xuICAgIHJlYWQ6IEVsZW1lbnRSZWYsXG4gICAgc3RhdGljOiB0cnVlXG4gIH0pIHRvb2x0aXAhOiBFbGVtZW50UmVmXG5cbiAgY29uc3RydWN0b3IgKFxuICAgIHB1YmxpYyBlbGVtOiBFbGVtZW50UmVmLFxuICAgIHB1YmxpYyB1dGlsczogVXRpbGl0aWVzU2VydmljZSxcbiAgICBwdWJsaWMgc2FuaXRpemVyOiBEb21TYW5pdGl6ZXJcbiAgKSB7fVxuXG4gIGFzeW5jIG5nT25Jbml0ICgpIHtcbiAgICBhd2FpdCB0aGlzLnV0aWxzLmRlbGF5KDApXG4gIH1cblxuICBnZXQgc3R5bGUgKCkge1xuICAgIGlmICghdGhpcy50ZXh0Py5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRpc3BsYXk6ICdub25lJ1xuICAgICAgfVxuICAgIH1cbiAgICBsZXQgeCA9IC05OTlcbiAgICBsZXQgeSA9IC05OTlcbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuYm9keVxuICAgIGNvbnN0IGh0bWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcbiAgICBjb25zdCB2aWV3SGVpZ2h0ID0gTWF0aC5tYXgoYm9keS5zY3JvbGxIZWlnaHQsIGJvZHkub2Zmc2V0SGVpZ2h0LCBodG1sLmNsaWVudEhlaWdodCwgaHRtbC5zY3JvbGxIZWlnaHQsIGh0bWwub2Zmc2V0SGVpZ2h0KVxuICAgIGNvbnN0IHZpZXdXaWR0aCA9IE1hdGgubWF4KGJvZHkuc2Nyb2xsV2lkdGgsIGJvZHkub2Zmc2V0V2lkdGgsIGh0bWwuY2xpZW50V2lkdGgsIGh0bWwuc2Nyb2xsV2lkdGgsIGh0bWwub2Zmc2V0V2lkdGgpXG4gICAgY29uc3QgdG9vbHRpcEVsID0gdGhpcy50b29sdGlwLm5hdGl2ZUVsZW1lbnRcbiAgICBjb25zdCB0b29sdGlwV2lkdGggPSBwYXJzZUludCh0b29sdGlwRWwub2Zmc2V0V2lkdGgpICsgM1xuICAgIGNvbnN0IHRvb2x0aXBIZWlnaHQgPSBwYXJzZUludCh0b29sdGlwRWwub2Zmc2V0SGVpZ2h0KSArIDJcbiAgICBjb25zdCBwYXJlbnRFbCA9IHRoaXMucGFyZW50Lm5hdGl2ZUVsZW1lbnRcbiAgICBjb25zdCBwYXJlbnRQb3NpdGlvbiA9IHRoaXMudXRpbHMuZ2V0RWxlbWVudFBvc2l0aW9uKHBhcmVudEVsKVxuICAgIGNvbnN0IHBhcmVudEhlaWdodCA9IHBhcnNlSW50KHBhcmVudEVsLm9mZnNldEhlaWdodClcblxuICAgIHggPSBwYXJlbnRQb3NpdGlvbi54XG4gICAgeSA9IHBhcmVudFBvc2l0aW9uLnlcblxuICAgIGlmICh0aGlzLnBvc2l0aW9uU2lkZSA9PT0gJ2JvdHRvbScpIHtcbiAgICAgIHkgKz0gcGFyZW50SGVpZ2h0XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucG9zaXRpb25TaWRlID09PSAndG9wJykge1xuICAgICAgeSAtPSB0b29sdGlwSGVpZ2h0ICsgdGhpcy5wYWRkaW5nXG4gICAgICB4IC09IHRvb2x0aXBXaWR0aCAvIDJcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wb3NpdGlvblNpZGUgPT09ICdib3R0b20nKSB7XG4gICAgICB5ID0geSArIHRoaXMucGFkZGluZ1xuICAgICAgeCA9IHggLSAodG9vbHRpcFdpZHRoIC8gMilcbiAgICB9XG5cbiAgICBjb25zdCBtYXhYID0gdmlld1dpZHRoIC0gdG9vbHRpcFdpZHRoIC0gdGhpcy5wYWRkaW5nIC8gNFxuICAgIGlmICh4ID4gbWF4WCkgeCA9IG1heFhcblxuICAgIGNvbnN0IG1pblggPSB0aGlzLnBhZGRpbmdcbiAgICBpZiAoeCA8IG1pblgpIHggPSBtaW5YXG5cbiAgICBjb25zdCBtYXhZID0gdmlld0hlaWdodCAtIHRvb2x0aXBIZWlnaHQgLSB0aGlzLnBhZGRpbmcgLyA0XG4gICAgaWYgKHkgPiBtYXhZKSB5ID0gbWF4WVxuXG4gICAgY29uc3QgbWluWSA9IHRoaXMucGFkZGluZ1xuICAgIGlmICh5IDwgbWluWSkgeSA9IG1pbllcbiAgICByZXR1cm4ge1xuICAgICAgbGVmdDogYCR7eH1weGAsXG4gICAgICB0b3A6IGAke3l9cHhgXG4gICAgfVxuICB9XG5cbiAgZ2V0IGFycm93U3R5bGUgKCkge1xuICAgIGNvbnN0IGFycm93U2l6ZSA9IDEyXG5cbiAgICBsZXQgeCA9IDBcbiAgICBsZXQgeSA9IDBcbiAgICBsZXQgYW5nbGUgPSAwXG4gICAgY29uc3Qgc3R5bGU6IHsgW3N0eWxlOiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9XG4gICAgY29uc3QgdG9vbHRpcEVsID0gdGhpcy50b29sdGlwLm5hdGl2ZUVsZW1lbnRcbiAgICBjb25zdCB0b29sdGlwSGVpZ2h0ID0gdG9vbHRpcEVsLm9mZnNldEhlaWdodFxuICAgIGNvbnN0IHRvb2x0aXBQb3NpdGlvbiA9IHRoaXMudXRpbHMuZ2V0RWxlbWVudFBvc2l0aW9uKHRvb2x0aXBFbClcblxuICAgIGNvbnN0IHBhcmVudEVsID0gdGhpcy5wYXJlbnQubmF0aXZlRWxlbWVudFxuICAgIGNvbnN0IHBhcmVudFBvc2l0aW9uID0gdGhpcy51dGlscy5nZXRFbGVtZW50UG9zaXRpb24ocGFyZW50RWwpXG4gICAgY29uc3QgcGFyZW50V2lkdGggPSBwYXJlbnRFbC5vZmZzZXRXaWR0aFxuXG4gICAgeCA9IHBhcmVudFBvc2l0aW9uLnggKyBwYXJlbnRXaWR0aCAvIDIgLSB0b29sdGlwUG9zaXRpb24ueCAtIGFycm93U2l6ZSAvIDIgKyAzXG4gICAgaWYgKHRoaXMucG9zaXRpb25TaWRlID09PSAndG9wJykge1xuICAgICAgeSA9IHRvb2x0aXBIZWlnaHQgLSBhcnJvd1NpemUgLyAyICsgNFxuICAgIH1cblxuICAgIGlmICh0aGlzLnBvc2l0aW9uU2lkZSA9PT0gJ3RvcCcpIHtcbiAgICAgIGFuZ2xlID0gMTgwXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucG9zaXRpb25TaWRlID09PSAnYm90dG9tJykge1xuICAgICAgeSA9IC1hcnJvd1NpemUgLyAyICsgM1xuICAgIH1cblxuICAgIHN0eWxlLnRvcCA9IGAke3l9cHhgXG4gICAgc3R5bGUubGVmdCA9IGAke3h9cHhgXG4gICAgc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgke2FuZ2xlfWRlZylgXG5cbiAgICByZXR1cm4gc3R5bGVcbiAgfVxufVxuIl19
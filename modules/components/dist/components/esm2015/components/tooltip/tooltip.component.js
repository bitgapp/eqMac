import { __awaiter } from "tslib";
import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../services/utilities.service";
import * as i2 from "@angular/platform-browser";
import * as i3 from "@angular/common";
import * as i4 from "../container/container.component";
import * as i5 from "../label/label.component";
const _c0 = ["arrow"];
const _c1 = ["tooltip"];
function TooltipComponent_eqm_label_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "eqm-label");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(1);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.text, " ");
} }
const _c2 = ["*"];
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
TooltipComponent.ɵfac = function TooltipComponent_Factory(t) { return new (t || TooltipComponent)(i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i1.UtilitiesService), i0.ɵɵdirectiveInject(i2.DomSanitizer)); };
TooltipComponent.ɵcmp = i0.ɵɵdefineComponent({ type: TooltipComponent, selectors: [["eqm-tooltip"]], viewQuery: function TooltipComponent_Query(rf, ctx) { if (rf & 1) {
        i0.ɵɵviewQuery(_c0, 3, ElementRef);
        i0.ɵɵviewQuery(_c1, 3, ElementRef);
    } if (rf & 2) {
        let _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.arrow = _t.first);
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.tooltip = _t.first);
    } }, inputs: { text: "text", parent: "parent", positionSide: "positionSide", showArrow: "showArrow" }, ngContentSelectors: _c2, decls: 8, vars: 4, consts: [[1, "container", 3, "ngStyle"], [1, "arrow-container", 3, "hidden", "ngStyle"], ["arrow", ""], [1, "arrow"], [1, "tooltip"], ["tooltip", ""], [4, "ngIf"]], template: function TooltipComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵprojectionDef();
        i0.ɵɵelementStart(0, "div", 0);
        i0.ɵɵelementStart(1, "div", 1, 2);
        i0.ɵɵelement(3, "div", 3);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(4, "eqm-container", 4, 5);
        i0.ɵɵprojection(6);
        i0.ɵɵtemplate(7, TooltipComponent_eqm_label_7_Template, 2, 1, "eqm-label", 6);
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵproperty("ngStyle", ctx.style);
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("hidden", !ctx.showArrow)("ngStyle", ctx.arrowStyle);
        i0.ɵɵadvance(6);
        i0.ɵɵproperty("ngIf", ctx.text);
    } }, directives: [i3.NgStyle, i4.ContainerComponent, i3.NgIf, i5.LabelComponent], styles: [".container[_ngcontent-%COMP%]{display:block;position:absolute;left:-100px;top:-100px;pointer-events:none;z-index:9999}.container[_ngcontent-%COMP%]   .tooltip[_ngcontent-%COMP%]{text-align:center;padding:0 4px;white-space:pre}.container[_ngcontent-%COMP%]   .arrow-container[_ngcontent-%COMP%]{position:absolute;z-index:9998;width:12px;height:12px;display:flex;justify-content:center;align-items:center;-webkit-clip-path:polygon(0 0,100% 0,100% 50%,0 50%);clip-path:polygon(0 0,100% 0,100% 50%,0 50%)}.container[_ngcontent-%COMP%]   .arrow-container[_ngcontent-%COMP%]   .arrow[_ngcontent-%COMP%]{width:50%;height:50%;transform:rotate(45deg);background-color:#222324;box-shadow:0 0 0 1px #000,0 0 0 2px #464a4d;border-radius:10%}"] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TooltipComponent, [{
        type: Component,
        args: [{
                selector: 'eqm-tooltip',
                templateUrl: './tooltip.component.html',
                styleUrls: ['./tooltip.component.scss']
            }]
    }], function () { return [{ type: i0.ElementRef }, { type: i1.UtilitiesService }, { type: i2.DomSanitizer }]; }, { text: [{
            type: Input
        }], parent: [{
            type: Input
        }], positionSide: [{
            type: Input
        }], showArrow: [{
            type: Input
        }], arrow: [{
            type: ViewChild,
            args: ['arrow', {
                    read: ElementRef,
                    static: true
                }]
        }], tooltip: [{
            type: ViewChild,
            args: ['tooltip', {
                    read: ElementRef,
                    static: true
                }]
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL3Rvb2x0aXAvdG9vbHRpcC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL3Rvb2x0aXAvdG9vbHRpcC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxLQUFLLEVBQ0wsVUFBVSxFQUNWLFNBQVMsRUFDVixNQUFNLGVBQWUsQ0FBQTs7Ozs7Ozs7OztJQ0lsQixpQ0FBd0I7SUFDdEIsWUFDRjtJQUFBLGlCQUFZOzs7SUFEVixlQUNGO0lBREUsNENBQ0Y7OztBRElKLE1BQU0sT0FBTyxnQkFBZ0I7SUFpQjNCLFlBQ1MsSUFBZ0IsRUFDaEIsS0FBdUIsRUFDdkIsU0FBdUI7UUFGdkIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNoQixVQUFLLEdBQUwsS0FBSyxDQUFrQjtRQUN2QixjQUFTLEdBQVQsU0FBUyxDQUFjO1FBakJ2QixpQkFBWSxHQUF3QixLQUFLLENBQUE7UUFDekMsY0FBUyxHQUFZLElBQUksQ0FBQTtRQUMzQixZQUFPLEdBQUcsRUFBRSxDQUFBO0lBZ0JoQixDQUFDO0lBRUUsUUFBUTs7WUFDWixNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzNCLENBQUM7S0FBQTtJQUVELElBQUksS0FBSzs7UUFDUCxJQUFJLFFBQUMsSUFBSSxDQUFDLElBQUksMENBQUUsTUFBTSxDQUFBLEVBQUU7WUFDdEIsT0FBTztnQkFDTCxPQUFPLEVBQUUsTUFBTTthQUNoQixDQUFBO1NBQ0Y7UUFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQTtRQUNaLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFB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QUM7O2dGQWpIVSxnQkFBZ0I7cURBQWhCLGdCQUFnQjsrQkFRbkIsVUFBVTsrQkFLVixVQUFVOzs7Ozs7O1FDN0JwQiw4QkFBeUM7UUFDdkMsaUNBSUM7UUFDQyx5QkFBeUI7UUFDM0IsaUJBQU07UUFDTiwyQ0FBd0M7UUFDdEMsa0JBQXlCO1FBQ3pCLDZFQUVZO1FBQ2QsaUJBQWdCO1FBQ2xCLGlCQUFNOztRQWRpQixtQ0FBaUI7UUFFcEMsZUFBcUI7UUFBckIsdUNBQXFCLDJCQUFBO1FBUVQsZUFBVTtRQUFWLCtCQUFVOzt1RkRNYixnQkFBZ0I7Y0FMNUIsU0FBUztlQUFDO2dCQUNULFFBQVEsRUFBRSxhQUFhO2dCQUN2QixXQUFXLEVBQUUsMEJBQTBCO2dCQUN2QyxTQUFTLEVBQUUsQ0FBRSwwQkFBMEIsQ0FBRTthQUMxQzt1SEFFVSxJQUFJO2tCQUFaLEtBQUs7WUFDRyxNQUFNO2tCQUFkLEtBQUs7WUFDRyxZQUFZO2tCQUFwQixLQUFLO1lBQ0csU0FBUztrQkFBakIsS0FBSztZQU1ILEtBQUs7a0JBSFAsU0FBUzttQkFBQyxPQUFPLEVBQUU7b0JBQ2xCLElBQUksRUFBRSxVQUFVO29CQUNoQixNQUFNLEVBQUUsSUFBSTtpQkFDYjtZQUtFLE9BQU87a0JBSFQsU0FBUzttQkFBQyxTQUFTLEVBQUU7b0JBQ3BCLElBQUksRUFBRSxVQUFVO29CQUNoQixNQUFNLEVBQUUsSUFBSTtpQkFDYiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBJbnB1dCxcbiAgRWxlbWVudFJlZixcbiAgVmlld0NoaWxkXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5pbXBvcnQgeyBVdGlsaXRpZXNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvdXRpbGl0aWVzLnNlcnZpY2UnXG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJ1xuXG5leHBvcnQgdHlwZSBUb29sdGlwUG9zaXRpb25TaWRlID0gJ3RvcCcgfCAnYm90dG9tJyB8ICdsZWZ0JyB8ICdyaWdodCdcbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2VxbS10b29sdGlwJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3Rvb2x0aXAuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsgJy4vdG9vbHRpcC5jb21wb25lbnQuc2NzcycgXVxufSlcbmV4cG9ydCBjbGFzcyBUb29sdGlwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCkgdGV4dD86IHN0cmluZ1xuICBASW5wdXQoKSBwYXJlbnQ/OiBhbnlcbiAgQElucHV0KCkgcG9zaXRpb25TaWRlOiBUb29sdGlwUG9zaXRpb25TaWRlID0gJ3RvcCdcbiAgQElucHV0KCkgc2hvd0Fycm93OiBCb29sZWFuID0gdHJ1ZVxuICBwdWJsaWMgcGFkZGluZyA9IDEwXG5cbiAgQFZpZXdDaGlsZCgnYXJyb3cnLCB7XG4gICAgcmVhZDogRWxlbWVudFJlZixcbiAgICBzdGF0aWM6IHRydWVcbiAgfSkgYXJyb3chOiBFbGVtZW50UmVmXG5cbiAgQFZpZXdDaGlsZCgndG9vbHRpcCcsIHtcbiAgICByZWFkOiBFbGVtZW50UmVmLFxuICAgIHN0YXRpYzogdHJ1ZVxuICB9KSB0b29sdGlwITogRWxlbWVudFJlZlxuXG4gIGNvbnN0cnVjdG9yIChcbiAgICBwdWJsaWMgZWxlbTogRWxlbWVudFJlZixcbiAgICBwdWJsaWMgdXRpbHM6IFV0aWxpdGllc1NlcnZpY2UsXG4gICAgcHVibGljIHNhbml0aXplcjogRG9tU2FuaXRpemVyXG4gICkge31cblxuICBhc3luYyBuZ09uSW5pdCAoKSB7XG4gICAgYXdhaXQgdGhpcy51dGlscy5kZWxheSgwKVxuICB9XG5cbiAgZ2V0IHN0eWxlICgpIHtcbiAgICBpZiAoIXRoaXMudGV4dD8ubGVuZ3RoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkaXNwbGF5OiAnbm9uZSdcbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IHggPSAtOTk5XG4gICAgbGV0IHkgPSAtOTk5XG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHlcbiAgICBjb25zdCBodG1sID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG4gICAgY29uc3Qgdmlld0hlaWdodCA9IE1hdGgubWF4KGJvZHkuc2Nyb2xsSGVpZ2h0LCBib2R5Lm9mZnNldEhlaWdodCwgaHRtbC5jbGllbnRIZWlnaHQsIGh0bWwuc2Nyb2xsSGVpZ2h0LCBodG1sLm9mZnNldEhlaWdodClcbiAgICBjb25zdCB2aWV3V2lkdGggPSBNYXRoLm1heChib2R5LnNjcm9sbFdpZHRoLCBib2R5Lm9mZnNldFdpZHRoLCBodG1sLmNsaWVudFdpZHRoLCBodG1sLnNjcm9sbFdpZHRoLCBodG1sLm9mZnNldFdpZHRoKVxuICAgIGNvbnN0IHRvb2x0aXBFbCA9IHRoaXMudG9vbHRpcC5uYXRpdmVFbGVtZW50XG4gICAgY29uc3QgdG9vbHRpcFdpZHRoID0gcGFyc2VJbnQodG9vbHRpcEVsLm9mZnNldFdpZHRoKSArIDNcbiAgICBjb25zdCB0b29sdGlwSGVpZ2h0ID0gcGFyc2VJbnQodG9vbHRpcEVsLm9mZnNldEhlaWdodCkgKyAyXG4gICAgY29uc3QgcGFyZW50RWwgPSB0aGlzLnBhcmVudC5uYXRpdmVFbGVtZW50XG4gICAgY29uc3QgcGFyZW50UG9zaXRpb24gPSB0aGlzLnV0aWxzLmdldEVsZW1lbnRQb3NpdGlvbihwYXJlbnRFbClcbiAgICBjb25zdCBwYXJlbnRIZWlnaHQgPSBwYXJzZUludChwYXJlbnRFbC5vZmZzZXRIZWlnaHQpXG5cbiAgICB4ID0gcGFyZW50UG9zaXRpb24ueFxuICAgIHkgPSBwYXJlbnRQb3NpdGlvbi55XG5cbiAgICBpZiAodGhpcy5wb3NpdGlvblNpZGUgPT09ICdib3R0b20nKSB7XG4gICAgICB5ICs9IHBhcmVudEhlaWdodFxuICAgIH1cblxuICAgIGlmICh0aGlzLnBvc2l0aW9uU2lkZSA9PT0gJ3RvcCcpIHtcbiAgICAgIHkgLT0gdG9vbHRpcEhlaWdodCArIHRoaXMucGFkZGluZ1xuICAgICAgeCAtPSB0b29sdGlwV2lkdGggLyAyXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucG9zaXRpb25TaWRlID09PSAnYm90dG9tJykge1xuICAgICAgeSA9IHkgKyB0aGlzLnBhZGRpbmdcbiAgICAgIHggPSB4IC0gKHRvb2x0aXBXaWR0aCAvIDIpXG4gICAgfVxuXG4gICAgY29uc3QgbWF4WCA9IHZpZXdXaWR0aCAtIHRvb2x0aXBXaWR0aCAtIHRoaXMucGFkZGluZyAvIDRcbiAgICBpZiAoeCA+IG1heFgpIHggPSBtYXhYXG5cbiAgICBjb25zdCBtaW5YID0gdGhpcy5wYWRkaW5nXG4gICAgaWYgKHggPCBtaW5YKSB4ID0gbWluWFxuXG4gICAgY29uc3QgbWF4WSA9IHZpZXdIZWlnaHQgLSB0b29sdGlwSGVpZ2h0IC0gdGhpcy5wYWRkaW5nIC8gNFxuICAgIGlmICh5ID4gbWF4WSkgeSA9IG1heFlcblxuICAgIGNvbnN0IG1pblkgPSB0aGlzLnBhZGRpbmdcbiAgICBpZiAoeSA8IG1pblkpIHkgPSBtaW5ZXG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IGAke3h9cHhgLFxuICAgICAgdG9wOiBgJHt5fXB4YFxuICAgIH1cbiAgfVxuXG4gIGdldCBhcnJvd1N0eWxlICgpIHtcbiAgICBjb25zdCBhcnJvd1NpemUgPSAxMlxuXG4gICAgbGV0IHggPSAwXG4gICAgbGV0IHkgPSAwXG4gICAgbGV0IGFuZ2xlID0gMFxuICAgIGNvbnN0IHN0eWxlOiB7IFtzdHlsZTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fVxuICAgIGNvbnN0IHRvb2x0aXBFbCA9IHRoaXMudG9vbHRpcC5uYXRpdmVFbGVtZW50XG4gICAgY29uc3QgdG9vbHRpcEhlaWdodCA9IHRvb2x0aXBFbC5vZmZzZXRIZWlnaHRcbiAgICBjb25zdCB0b29sdGlwUG9zaXRpb24gPSB0aGlzLnV0aWxzLmdldEVsZW1lbnRQb3NpdGlvbih0b29sdGlwRWwpXG5cbiAgICBjb25zdCBwYXJlbnRFbCA9IHRoaXMucGFyZW50Lm5hdGl2ZUVsZW1lbnRcbiAgICBjb25zdCBwYXJlbnRQb3NpdGlvbiA9IHRoaXMudXRpbHMuZ2V0RWxlbWVudFBvc2l0aW9uKHBhcmVudEVsKVxuICAgIGNvbnN0IHBhcmVudFdpZHRoID0gcGFyZW50RWwub2Zmc2V0V2lkdGhcblxuICAgIHggPSBwYXJlbnRQb3NpdGlvbi54ICsgcGFyZW50V2lkdGggLyAyIC0gdG9vbHRpcFBvc2l0aW9uLnggLSBhcnJvd1NpemUgLyAyICsgM1xuICAgIGlmICh0aGlzLnBvc2l0aW9uU2lkZSA9PT0gJ3RvcCcpIHtcbiAgICAgIHkgPSB0b29sdGlwSGVpZ2h0IC0gYXJyb3dTaXplIC8gMiArIDRcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wb3NpdGlvblNpZGUgPT09ICd0b3AnKSB7XG4gICAgICBhbmdsZSA9IDE4MFxuICAgIH1cblxuICAgIGlmICh0aGlzLnBvc2l0aW9uU2lkZSA9PT0gJ2JvdHRvbScpIHtcbiAgICAgIHkgPSAtYXJyb3dTaXplIC8gMiArIDNcbiAgICB9XG5cbiAgICBzdHlsZS50b3AgPSBgJHt5fXB4YFxuICAgIHN0eWxlLmxlZnQgPSBgJHt4fXB4YFxuICAgIHN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGUoJHthbmdsZX1kZWcpYFxuXG4gICAgcmV0dXJuIHN0eWxlXG4gIH1cbn1cbiIsIjxkaXYgY2xhc3M9XCJjb250YWluZXJcIiBbbmdTdHlsZV09XCJzdHlsZVwiPlxuICA8ZGl2ICNhcnJvd1xuICAgIFtoaWRkZW5dPVwiIXNob3dBcnJvd1wiIFxuICAgIGNsYXNzPVwiYXJyb3ctY29udGFpbmVyXCJcbiAgICBbbmdTdHlsZV09XCJhcnJvd1N0eWxlXCJcbiAgPlxuICAgIDxkaXYgY2xhc3M9XCJhcnJvd1wiPjwvZGl2PlxuICA8L2Rpdj5cbiAgPGVxbS1jb250YWluZXIgY2xhc3M9XCJ0b29sdGlwXCIgI3Rvb2x0aXA+XG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDxlcW0tbGFiZWwgKm5nSWY9XCJ0ZXh0XCI+XG4gICAgICB7e3RleHR9fVxuICAgIDwvZXFtLWxhYmVsPlxuICA8L2VxbS1jb250YWluZXI+XG48L2Rpdj4iXX0=
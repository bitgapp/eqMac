import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../label/label.component";
import * as i3 from "../icon/icon.component";
function BreadcrumbsComponent_div_1_eqm_icon_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "eqm-icon", 4);
} if (rf & 2) {
    i0.ɵɵproperty("rotate", 0)("width", 8)("height", 8);
} }
function BreadcrumbsComponent_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0);
    i0.ɵɵtemplate(1, BreadcrumbsComponent_div_1_eqm_icon_1_Template, 1, 3, "eqm-icon", 2);
    i0.ɵɵelementStart(2, "eqm-label", 3);
    i0.ɵɵlistener("click", function BreadcrumbsComponent_div_1_Template_eqm_label_click_2_listener() { i0.ɵɵrestoreView(_r5); const crumb_r1 = ctx.$implicit; const i_r2 = ctx.index; const ctx_r4 = i0.ɵɵnextContext(); return ctx_r4.crumbClicked.emit({ crumb: crumb_r1, index: i_r2 }); });
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const crumb_r1 = ctx.$implicit;
    const i_r2 = ctx.index;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("ngIf", i_r2 !== 0);
    i0.ɵɵadvance(1);
    i0.ɵɵclassMap("crumb-part pointer" + (ctx_r0.underline ? " underline" : ""));
    i0.ɵɵadvance(1);
    i0.ɵɵtextInterpolate(crumb_r1);
} }
export class BreadcrumbsComponent {
    constructor() {
        this.underline = true;
        this.crumbClicked = new EventEmitter();
    }
    ngOnInit() {
    }
}
BreadcrumbsComponent.ɵfac = function BreadcrumbsComponent_Factory(t) { return new (t || BreadcrumbsComponent)(); };
BreadcrumbsComponent.ɵcmp = i0.ɵɵdefineComponent({ type: BreadcrumbsComponent, selectors: [["eqm-breadcrumbs"]], inputs: { crumbs: "crumbs", underline: "underline" }, outputs: { crumbClicked: "crumbClicked" }, decls: 2, vars: 1, consts: [[1, "row"], ["class", "row", 4, "ngFor", "ngForOf"], ["class", "crumb-part", "name", "triangle", 3, "rotate", "width", "height", 4, "ngIf"], [3, "click"], ["name", "triangle", 1, "crumb-part", 3, "rotate", "width", "height"]], template: function BreadcrumbsComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "div", 0);
        i0.ɵɵtemplate(1, BreadcrumbsComponent_div_1_Template, 4, 4, "div", 1);
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngForOf", ctx.crumbs);
    } }, directives: [i1.NgForOf, i1.NgIf, i2.LabelComponent, i3.IconComponent], styles: [".row[_ngcontent-%COMP%]{display:flex;flex-direction:row;align-items:center;justify-content:center}.crumb-part[_ngcontent-%COMP%]{margin-right:5px}.underline[_ngcontent-%COMP%]{text-decoration:underline}.pointer[_ngcontent-%COMP%]{cursor:pointer!important}"] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(BreadcrumbsComponent, [{
        type: Component,
        args: [{
                selector: 'eqm-breadcrumbs',
                templateUrl: './breadcrumbs.component.html',
                styleUrls: ['./breadcrumbs.component.scss']
            }]
    }], null, { crumbs: [{
            type: Input
        }], underline: [{
            type: Input
        }], crumbClicked: [{
            type: Output
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWRjcnVtYnMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvY29tcG9uZW50cy9icmVhZGNydW1icy9icmVhZGNydW1icy5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL2JyZWFkY3J1bWJzL2JyZWFkY3J1bWJzLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUE7Ozs7OztJQ0UxRSw4QkFBOEc7O0lBQWpELDBCQUFZLFlBQUEsYUFBQTs7OztJQUQzRSw4QkFBMEQ7SUFDeEQscUZBQThHO0lBQzlHLG9DQUFvSTtJQUF4RCw0TkFBUywwREFBNkMsSUFBQztJQUFDLFlBQVM7SUFBQSxpQkFBWTtJQUMzSixpQkFBTTs7Ozs7SUFGMEIsZUFBYTtJQUFiLGlDQUFhO0lBQ2hDLGVBQWdFO0lBQWhFLDRFQUFnRTtJQUF5RCxlQUFTO0lBQVQsOEJBQVM7O0FESWpKLE1BQU0sT0FBTyxvQkFBb0I7SUFMakM7UUFPVyxjQUFTLEdBQUcsSUFBSSxDQUFBO1FBQ2YsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBb0MsQ0FBQTtLQUk5RTtJQUZDLFFBQVE7SUFDUixDQUFDOzt3RkFOVSxvQkFBb0I7eURBQXBCLG9CQUFvQjtRQ1BqQyw4QkFBaUI7UUFDZixxRUFHTTtRQUNSLGlCQUFNOztRQUptQixlQUFXO1FBQVgsb0NBQVc7O3VGRE12QixvQkFBb0I7Y0FMaEMsU0FBUztlQUFDO2dCQUNULFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLFdBQVcsRUFBRSw4QkFBOEI7Z0JBQzNDLFNBQVMsRUFBRSxDQUFFLDhCQUE4QixDQUFFO2FBQzlDO2dCQUVVLE1BQU07a0JBQWQsS0FBSztZQUNHLFNBQVM7a0JBQWpCLEtBQUs7WUFDSSxZQUFZO2tCQUFyQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2VxbS1icmVhZGNydW1icycsXG4gIHRlbXBsYXRlVXJsOiAnLi9icmVhZGNydW1icy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWyAnLi9icmVhZGNydW1icy5jb21wb25lbnQuc2NzcycgXVxufSlcbmV4cG9ydCBjbGFzcyBCcmVhZGNydW1ic0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpIGNydW1iczogc3RyaW5nW11cbiAgQElucHV0KCkgdW5kZXJsaW5lID0gdHJ1ZVxuICBAT3V0cHV0KCkgY3J1bWJDbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcjx7IGNydW1iOiBzdHJpbmcsIGluZGV4OiBudW1iZXIgfT4oKVxuXG4gIG5nT25Jbml0ICgpOiB2b2lkIHtcbiAgfVxufVxuIiwiPGRpdiBjbGFzcz1cInJvd1wiPlxuICA8ZGl2ICpuZ0Zvcj1cImxldCBjcnVtYiBvZiBjcnVtYnM7IGluZGV4IGFzIGlcIiBjbGFzcz1cInJvd1wiPlxuICAgIDxlcW0taWNvbiBjbGFzcz1cImNydW1iLXBhcnRcIiAqbmdJZj1cImkgIT09IDBcIiBuYW1lPVwidHJpYW5nbGVcIiBbcm90YXRlXT1cIjBcIiBbd2lkdGhdPVwiOFwiIFtoZWlnaHRdPVwiOFwiPjwvZXFtLWljb24+XG4gICAgPGVxbS1sYWJlbCBbY2xhc3NdPVwiJ2NydW1iLXBhcnQgcG9pbnRlcicgKyAodW5kZXJsaW5lID8gJyB1bmRlcmxpbmUnIDogJycpXCIgKGNsaWNrKT1cImNydW1iQ2xpY2tlZC5lbWl0KHsgY3J1bWI6IGNydW1iLCBpbmRleDogaSB9KVwiPnt7Y3J1bWJ9fTwvZXFtLWxhYmVsPlxuICA8L2Rpdj5cbjwvZGl2PiJdfQ==
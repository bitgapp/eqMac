import { Component, ViewChild, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../label/label.component";
const _c0 = ["wave"];
function LoadingComponent_eqm_label_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵnamespaceSVG();
    i0.ɵɵnamespaceHTML();
    i0.ɵɵelementStart(0, "eqm-label");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(1);
    i0.ɵɵtextInterpolate(ctx_r1.text || "Loading");
} }
export class LoadingComponent {
    constructor() {
        this.showText = true;
    }
    ngAfterViewInit() {
        const path = this.wave.nativeElement;
        // eslint-disable-next-line no-loss-of-precision
        const m = 0.512286623256592433;
        const w = 90;
        const h = 60;
        const a = h / 4;
        const y = h / 2;
        const pathData = [
            'M', w * 0, y + a / 2,
            'c', a * m, 0, -(1 - a) * m, -a, a, -a,
            's', -(1 - a) * m, a, a, a,
            's', -(1 - a) * m, -a, a, -a,
            's', -(1 - a) * m, a, a, a,
            's', -(1 - a) * m, -a, a, -a,
            's', -(1 - a) * m, a, a, a,
            's', -(1 - a) * m, -a, a, -a,
            's', -(1 - a) * m, a, a, a,
            's', -(1 - a) * m, -a, a, -a,
            's', -(1 - a) * m, a, a, a,
            's', -(1 - a) * m, -a, a, -a,
            's', -(1 - a) * m, a, a, a,
            's', -(1 - a) * m, -a, a, -a,
            's', -(1 - a) * m, a, a, a,
            's', -(1 - a) * m, -a, a, -a
        ].join(' ');
        path.setAttribute('d', pathData);
    }
}
LoadingComponent.ɵfac = function LoadingComponent_Factory(t) { return new (t || LoadingComponent)(); };
LoadingComponent.ɵcmp = i0.ɵɵdefineComponent({ type: LoadingComponent, selectors: [["eqm-loading"]], viewQuery: function LoadingComponent_Query(rf, ctx) { if (rf & 1) {
        i0.ɵɵviewQuery(_c0, 3);
    } if (rf & 2) {
        let _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.wave = _t.first);
    } }, inputs: { text: "text", showText: "showText" }, decls: 5, vars: 1, consts: [[1, "loader"], ["xmlns", "http://www.w3.org/2000/svg", "width", "80px", "height", "60px", "viewBox", "5 0 80 60"], ["id", "wave", "fill", "none", "stroke", "#4f8d71", "stroke-width", "4", "stroke-linecap", "round"], ["wave", ""], [4, "ngIf"]], template: function LoadingComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "div", 0);
        i0.ɵɵnamespaceSVG();
        i0.ɵɵelementStart(1, "svg", 1);
        i0.ɵɵelement(2, "path", 2, 3);
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵtemplate(4, LoadingComponent_eqm_label_4_Template, 2, 1, "eqm-label", 4);
    } if (rf & 2) {
        i0.ɵɵadvance(4);
        i0.ɵɵproperty("ngIf", ctx.showText);
    } }, directives: [i1.NgIf, i2.LabelComponent], styles: ["[_nghost-%COMP%]{display:flex;flex-direction:column;justify-content:center;align-items:center}.loader[_ngcontent-%COMP%]{height:60px;width:80px}.loader[_ngcontent-%COMP%]   #wave[_ngcontent-%COMP%]{stroke-dasharray:0 16 101 16;-webkit-animation:animateWave 2.4s linear infinite;animation:animateWave 2.4s linear infinite}@-webkit-keyframes animateWave{0%{stroke-dashoffset:0;transform:translateZ(0)}to{stroke-dashoffset:-133;transform:translate3d(-90px,0,0)}}@keyframes animateWave{0%{stroke-dashoffset:0;transform:translateZ(0)}to{stroke-dashoffset:-133;transform:translate3d(-90px,0,0)}}"] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LoadingComponent, [{
        type: Component,
        args: [{
                selector: 'eqm-loading',
                templateUrl: './loading.component.html',
                styleUrls: ['./loading.component.scss']
            }]
    }], null, { wave: [{
            type: ViewChild,
            args: ['wave', { static: true }]
        }], text: [{
            type: Input
        }], showText: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGluZy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL2xvYWRpbmcvbG9hZGluZy5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL2xvYWRpbmcvbG9hZGluZy5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBNkIsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFBOzs7Ozs7O0lDWXRGLG9CQUE0QjtJQUE1QixpQ0FBNEI7SUFBQSxZQUFxQjtJQUFBLGlCQUFZOzs7SUFBakMsZUFBcUI7SUFBckIsOENBQXFCOztBRExqRCxNQUFNLE9BQU8sZ0JBQWdCO0lBTDdCO1FBUVcsYUFBUSxHQUFHLElBQUksQ0FBQTtLQWlDekI7SUEvQkMsZUFBZTtRQUNiLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFBO1FBQ3BDLGdEQUFnRDtRQUNoRCxNQUFNLENBQUMsR0FBRyxvQkFBb0IsQ0FBQTtRQUM5QixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUE7UUFDWixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUE7UUFFWixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ2YsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUVmLE1BQU0sUUFBUSxHQUFHO1lBQ2YsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO1lBQ3JCLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDMUIsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDNUIsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUMxQixHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM1QixHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQzFCLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzVCLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDMUIsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDNUIsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUMxQixHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM1QixHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQzFCLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzVCLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDMUIsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDN0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7UUFFWCxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUNsQyxDQUFDOztnRkFuQ1UsZ0JBQWdCO3FEQUFoQixnQkFBZ0I7Ozs7OztRQ1A3Qiw4QkFBb0I7UUFDbEIsbUJBRXdCO1FBRnhCLDhCQUV3QjtRQUN0Qiw2QkFLTztRQUNULGlCQUFNO1FBQ1IsaUJBQU07UUFDTiw2RUFBNkQ7O1FBQWpELGVBQWM7UUFBZCxtQ0FBYzs7dUZETGIsZ0JBQWdCO2NBTDVCLFNBQVM7ZUFBQztnQkFDVCxRQUFRLEVBQUUsYUFBYTtnQkFDdkIsV0FBVyxFQUFFLDBCQUEwQjtnQkFDdkMsU0FBUyxFQUFFLENBQUUsMEJBQTBCLENBQUU7YUFDMUM7Z0JBRXNDLElBQUk7a0JBQXhDLFNBQVM7bUJBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtZQUMxQixJQUFJO2tCQUFaLEtBQUs7WUFDRyxRQUFRO2tCQUFoQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYsIEFmdGVyVmlld0luaXQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZXFtLWxvYWRpbmcnLFxuICB0ZW1wbGF0ZVVybDogJy4vbG9hZGluZy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWyAnLi9sb2FkaW5nLmNvbXBvbmVudC5zY3NzJyBdXG59KVxuZXhwb3J0IGNsYXNzIExvYWRpbmdDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcbiAgQFZpZXdDaGlsZCgnd2F2ZScsIHsgc3RhdGljOiB0cnVlIH0pIHdhdmUhOiBFbGVtZW50UmVmXG4gIEBJbnB1dCgpIHRleHQ/OiBzdHJpbmdcbiAgQElucHV0KCkgc2hvd1RleHQgPSB0cnVlXG5cbiAgbmdBZnRlclZpZXdJbml0ICgpIHtcbiAgICBjb25zdCBwYXRoID0gdGhpcy53YXZlLm5hdGl2ZUVsZW1lbnRcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbG9zcy1vZi1wcmVjaXNpb25cbiAgICBjb25zdCBtID0gMC41MTIyODY2MjMyNTY1OTI0MzNcbiAgICBjb25zdCB3ID0gOTBcbiAgICBjb25zdCBoID0gNjBcblxuICAgIGNvbnN0IGEgPSBoIC8gNFxuICAgIGNvbnN0IHkgPSBoIC8gMlxuXG4gICAgY29uc3QgcGF0aERhdGEgPSBbXG4gICAgICAnTScsIHcgKiAwLCB5ICsgYSAvIDIsXG4gICAgICAnYycsIGEgKiBtLCAwLCAtKDEgLSBhKSAqIG0sIC1hLCBhLCAtYSxcbiAgICAgICdzJywgLSgxIC0gYSkgKiBtLCBhLCBhLCBhLFxuICAgICAgJ3MnLCAtKDEgLSBhKSAqIG0sIC1hLCBhLCAtYSxcbiAgICAgICdzJywgLSgxIC0gYSkgKiBtLCBhLCBhLCBhLFxuICAgICAgJ3MnLCAtKDEgLSBhKSAqIG0sIC1hLCBhLCAtYSxcbiAgICAgICdzJywgLSgxIC0gYSkgKiBtLCBhLCBhLCBhLFxuICAgICAgJ3MnLCAtKDEgLSBhKSAqIG0sIC1hLCBhLCAtYSxcbiAgICAgICdzJywgLSgxIC0gYSkgKiBtLCBhLCBhLCBhLFxuICAgICAgJ3MnLCAtKDEgLSBhKSAqIG0sIC1hLCBhLCAtYSxcbiAgICAgICdzJywgLSgxIC0gYSkgKiBtLCBhLCBhLCBhLFxuICAgICAgJ3MnLCAtKDEgLSBhKSAqIG0sIC1hLCBhLCAtYSxcbiAgICAgICdzJywgLSgxIC0gYSkgKiBtLCBhLCBhLCBhLFxuICAgICAgJ3MnLCAtKDEgLSBhKSAqIG0sIC1hLCBhLCAtYSxcbiAgICAgICdzJywgLSgxIC0gYSkgKiBtLCBhLCBhLCBhLFxuICAgICAgJ3MnLCAtKDEgLSBhKSAqIG0sIC1hLCBhLCAtYVxuICAgIF0uam9pbignICcpXG5cbiAgICBwYXRoLnNldEF0dHJpYnV0ZSgnZCcsIHBhdGhEYXRhKVxuICB9XG59XG4iLCI8ZGl2IGNsYXNzPVwibG9hZGVyXCI+XG4gIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIFxuICAgICAgd2lkdGg9XCI4MHB4XCIgaGVpZ2h0PVwiNjBweFwiXG4gICAgICB2aWV3Qm94PVwiNSAwIDgwIDYwXCI+XG4gICAgPHBhdGggaWQ9XCJ3YXZlXCIgI3dhdmVcbiAgICAgICAgZmlsbD1cIm5vbmVcIiBcbiAgICAgICAgc3Ryb2tlPVwiIzRmOGQ3MVwiIFxuICAgICAgICBzdHJva2Utd2lkdGg9XCI0XCJcbiAgICAgICAgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiPlxuICAgIDwvcGF0aD5cbiAgPC9zdmc+XG48L2Rpdj5cbjxlcW0tbGFiZWwgKm5nSWY9XCJzaG93VGV4dFwiPnt7dGV4dCB8fCAnTG9hZGluZyd9fTwvZXFtLWxhYmVsPiJdfQ==
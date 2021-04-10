import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../container/container.component";
import * as i2 from "../label/label.component";
const _c0 = ["*"];
export class ValueScreenComponent {
    constructor() {
        this.fontSize = 10;
        this.disabled = false;
    }
    ngOnInit() { }
}
ValueScreenComponent.ɵfac = function ValueScreenComponent_Factory(t) { return new (t || ValueScreenComponent)(); };
ValueScreenComponent.ɵcmp = i0.ɵɵdefineComponent({ type: ValueScreenComponent, selectors: [["eqm-value-screen"]], inputs: { fontSize: "fontSize", disabled: "disabled" }, ngContentSelectors: _c0, decls: 3, vars: 9, consts: [[3, "fontSize"]], template: function ValueScreenComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵprojectionDef();
        i0.ɵɵelementStart(0, "eqm-container");
        i0.ɵɵelementStart(1, "eqm-label", 0);
        i0.ɵɵprojection(2);
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵclassMap("screen" + (ctx.disabled ? " disabled" : ""));
        i0.ɵɵstyleProp("font-size", ctx.fontSize, "px")("width", ctx.fontSize * 4, "px")("height", ctx.fontSize * 1.4, "px");
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("fontSize", ctx.fontSize);
    } }, directives: [i1.ContainerComponent, i2.LabelComponent], styles: [".screen[_ngcontent-%COMP%]{text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;transition-property:filter;transition-duration:.5s}.screen[_ngcontent-%COMP%]     eqm-label span{color:#4f8d71!important}.disabled[_ngcontent-%COMP%]{filter:grayscale(80%)}"] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ValueScreenComponent, [{
        type: Component,
        args: [{
                selector: 'eqm-value-screen',
                templateUrl: './value-screen.component.html',
                styleUrls: ['./value-screen.component.scss']
            }]
    }], null, { fontSize: [{
            type: Input
        }], disabled: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdWUtc2NyZWVuLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2NvbXBvbmVudHMvdmFsdWUtc2NyZWVuL3ZhbHVlLXNjcmVlbi5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL3ZhbHVlLXNjcmVlbi92YWx1ZS1zY3JlZW4uY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxLQUFLLEVBQ04sTUFBTSxlQUFlLENBQUE7Ozs7O0FBT3RCLE1BQU0sT0FBTyxvQkFBb0I7SUFMakM7UUFNVyxhQUFRLEdBQUcsRUFBRSxDQUFBO1FBQ2IsYUFBUSxHQUFHLEtBQUssQ0FBQTtLQUcxQjtJQURDLFFBQVEsS0FBSyxDQUFDOzt3RkFKSCxvQkFBb0I7eURBQXBCLG9CQUFvQjs7UUNYakMscUNBQXFLO1FBQ25LLG9DQUFpQztRQUMvQixrQkFBeUI7UUFDM0IsaUJBQVk7UUFDZCxpQkFBZ0I7O1FBSkQsMkRBQWtEO1FBQUMsK0NBQStCLGlDQUFBLG9DQUFBO1FBQ3BGLGVBQXFCO1FBQXJCLHVDQUFxQjs7dUZEVXJCLG9CQUFvQjtjQUxoQyxTQUFTO2VBQUM7Z0JBQ1QsUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsV0FBVyxFQUFFLCtCQUErQjtnQkFDNUMsU0FBUyxFQUFFLENBQUUsK0JBQStCLENBQUU7YUFDL0M7Z0JBRVUsUUFBUTtrQkFBaEIsS0FBSztZQUNHLFFBQVE7a0JBQWhCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgSW5wdXRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZXFtLXZhbHVlLXNjcmVlbicsXG4gIHRlbXBsYXRlVXJsOiAnLi92YWx1ZS1zY3JlZW4uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsgJy4vdmFsdWUtc2NyZWVuLmNvbXBvbmVudC5zY3NzJyBdXG59KVxuZXhwb3J0IGNsYXNzIFZhbHVlU2NyZWVuQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCkgZm9udFNpemUgPSAxMFxuICBASW5wdXQoKSBkaXNhYmxlZCA9IGZhbHNlXG5cbiAgbmdPbkluaXQgKCkge31cbn1cbiIsIjxlcW0tY29udGFpbmVyIFtjbGFzc109XCInc2NyZWVuJyArIChkaXNhYmxlZCA/ICcgZGlzYWJsZWQnIDogJycpXCIgW3N0eWxlLmZvbnQtc2l6ZS5weF09XCJmb250U2l6ZVwiIFtzdHlsZS53aWR0aC5weF09XCJmb250U2l6ZSAqIDRcIiBbc3R5bGUuaGVpZ2h0LnB4XT1cImZvbnRTaXplICogMS40XCI+XG4gIDxlcW0tbGFiZWwgW2ZvbnRTaXplXT1cImZvbnRTaXplXCI+XG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICA8L2VxbS1sYWJlbD5cbjwvZXFtLWNvbnRhaW5lcj4iXX0=
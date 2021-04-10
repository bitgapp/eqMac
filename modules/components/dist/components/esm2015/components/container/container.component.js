import { Component, HostBinding, Input } from '@angular/core';
import * as i0 from "@angular/core";
const _c0 = ["*"];
export class ContainerComponent {
    constructor() {
        this.disabled = false;
    }
    ngOnInit() {
    }
}
ContainerComponent.ɵfac = function ContainerComponent_Factory(t) { return new (t || ContainerComponent)(); };
ContainerComponent.ɵcmp = i0.ɵɵdefineComponent({ type: ContainerComponent, selectors: [["eqm-container"]], hostVars: 2, hostBindings: function ContainerComponent_HostBindings(rf, ctx) { if (rf & 2) {
        i0.ɵɵclassProp("disabled", ctx.disabled);
    } }, inputs: { disabled: "disabled" }, ngContentSelectors: _c0, decls: 1, vars: 0, template: function ContainerComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵprojectionDef();
        i0.ɵɵprojection(0);
    } }, styles: ["[_nghost-%COMP%]{display:inline-block;margin:2px;color:#4f8d71;border-radius:2px;background-color:#1e1e1e;box-shadow:0 0 0 1px #000,0 0 0 2px #464a4d;background-size:6px 6px}.disabled[_nghost-%COMP%]{filter:grayscale(80%)}"] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ContainerComponent, [{
        type: Component,
        args: [{
                selector: 'eqm-container',
                templateUrl: './container.component.html',
                styleUrls: ['./container.component.scss']
            }]
    }], null, { disabled: [{
            type: HostBinding,
            args: ['class.disabled']
        }, {
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2NvbXBvbmVudHMvY29udGFpbmVyL2NvbnRhaW5lci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL2NvbnRhaW5lci9jb250YWluZXIuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFBOzs7QUFPckUsTUFBTSxPQUFPLGtCQUFrQjtJQUwvQjtRQU0wQyxhQUFRLEdBQUcsS0FBSyxDQUFBO0tBSXpEO0lBRkMsUUFBUTtJQUNSLENBQUM7O29GQUpVLGtCQUFrQjt1REFBbEIsa0JBQWtCOzs7O1FDUC9CLGtCQUF5Qjs7dUZET1osa0JBQWtCO2NBTDlCLFNBQVM7ZUFBQztnQkFDVCxRQUFRLEVBQUUsZUFBZTtnQkFDekIsV0FBVyxFQUFFLDRCQUE0QjtnQkFDekMsU0FBUyxFQUFFLENBQUUsNEJBQTRCLENBQUU7YUFDNUM7Z0JBRXlDLFFBQVE7a0JBQS9DLFdBQVc7bUJBQUMsZ0JBQWdCOztrQkFBRyxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIEhvc3RCaW5kaW5nLCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2VxbS1jb250YWluZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vY29udGFpbmVyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbICcuL2NvbnRhaW5lci5jb21wb25lbnQuc2NzcycgXVxufSlcbmV4cG9ydCBjbGFzcyBDb250YWluZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmRpc2FibGVkJykgQElucHV0KCkgZGlzYWJsZWQgPSBmYWxzZVxuXG4gIG5nT25Jbml0ICgpIHtcbiAgfVxufVxuIiwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuIl19
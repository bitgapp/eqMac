import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../container/container.component";
import * as i2 from "../icon/icon.component";
export class CheckboxComponent {
    constructor() {
        this.interactive = true;
        this.checked = false;
        this.checkedChanged = new EventEmitter();
        this.enabled = true;
    }
    toggle() {
        if (this.interactive && this.enabled) {
            this.checked = !this.checked;
            this.checkedChanged.emit(this.checked);
        }
    }
}
CheckboxComponent.ɵfac = function CheckboxComponent_Factory(t) { return new (t || CheckboxComponent)(); };
CheckboxComponent.ɵcmp = i0.ɵɵdefineComponent({ type: CheckboxComponent, selectors: [["eqm-checkbox"]], hostVars: 2, hostBindings: function CheckboxComponent_HostBindings(rf, ctx) { if (rf & 2) {
        i0.ɵɵclassProp("enabled", ctx.enabled);
    } }, inputs: { interactive: "interactive", checked: "checked", enabled: "enabled" }, outputs: { checkedChanged: "checkedChanged" }, decls: 2, vars: 1, consts: [[3, "click"], ["name", "checkbox", "size", "10", 3, "color"]], template: function CheckboxComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "eqm-container", 0);
        i0.ɵɵlistener("click", function CheckboxComponent_Template_eqm_container_click_0_listener() { return ctx.toggle(); });
        i0.ɵɵelement(1, "eqm-icon", 1);
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("color", ctx.checked ? "#4f8d71" : "transparent");
    } }, directives: [i1.ContainerComponent, i2.IconComponent], styles: ["[_nghost-%COMP%]{display:flex;justify-content:center;align-items:center;cursor:default;filter:grayscale(80%)}.enabled[_nghost-%COMP%]{filter:none;cursor:pointer}"] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CheckboxComponent, [{
        type: Component,
        args: [{
                selector: 'eqm-checkbox',
                templateUrl: './checkbox.component.html',
                styleUrls: ['./checkbox.component.scss']
            }]
    }], null, { interactive: [{
            type: Input
        }], checked: [{
            type: Input
        }], checkedChanged: [{
            type: Output
        }], enabled: [{
            type: HostBinding,
            args: ['class.enabled']
        }, {
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3guY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvY29tcG9uZW50cy9jaGVja2JveC9jaGVja2JveC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL2NoZWNrYm94L2NoZWNrYm94LmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFBOzs7O0FBT25GLE1BQU0sT0FBTyxpQkFBaUI7SUFMOUI7UUFNVyxnQkFBVyxHQUFZLElBQUksQ0FBQTtRQUMzQixZQUFPLEdBQVksS0FBSyxDQUFBO1FBQ3ZCLG1CQUFjLEdBQUcsSUFBSSxZQUFZLEVBQVcsQ0FBQTtRQUNmLFlBQU8sR0FBRyxJQUFJLENBQUE7S0FRdEQ7SUFOQyxNQUFNO1FBQ0osSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDcEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUE7WUFDNUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1NBQ3ZDO0lBQ0gsQ0FBQzs7a0ZBWFUsaUJBQWlCO3NEQUFqQixpQkFBaUI7OztRQ1A5Qix3Q0FBa0M7UUFBbkIscUdBQVMsWUFBUSxJQUFDO1FBQy9CLDhCQUE2RjtRQUMvRixpQkFBZ0I7O1FBRHNCLGVBQTZDO1FBQTdDLCtEQUE2Qzs7dUZETXRFLGlCQUFpQjtjQUw3QixTQUFTO2VBQUM7Z0JBQ1QsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLFdBQVcsRUFBRSwyQkFBMkI7Z0JBQ3hDLFNBQVMsRUFBRSxDQUFFLDJCQUEyQixDQUFFO2FBQzNDO2dCQUVVLFdBQVc7a0JBQW5CLEtBQUs7WUFDRyxPQUFPO2tCQUFmLEtBQUs7WUFDSSxjQUFjO2tCQUF2QixNQUFNO1lBQ2dDLE9BQU87a0JBQTdDLFdBQVc7bUJBQUMsZUFBZTs7a0JBQUcsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBIb3N0QmluZGluZyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2VxbS1jaGVja2JveCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9jaGVja2JveC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWyAnLi9jaGVja2JveC5jb21wb25lbnQuc2NzcycgXVxufSlcbmV4cG9ydCBjbGFzcyBDaGVja2JveENvbXBvbmVudCB7XG4gIEBJbnB1dCgpIGludGVyYWN0aXZlOiBib29sZWFuID0gdHJ1ZVxuICBASW5wdXQoKSBjaGVja2VkOiBib29sZWFuID0gZmFsc2VcbiAgQE91dHB1dCgpIGNoZWNrZWRDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpXG4gIEBIb3N0QmluZGluZygnY2xhc3MuZW5hYmxlZCcpIEBJbnB1dCgpIGVuYWJsZWQgPSB0cnVlXG5cbiAgdG9nZ2xlICgpIHtcbiAgICBpZiAodGhpcy5pbnRlcmFjdGl2ZSAmJiB0aGlzLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMuY2hlY2tlZCA9ICF0aGlzLmNoZWNrZWRcbiAgICAgIHRoaXMuY2hlY2tlZENoYW5nZWQuZW1pdCh0aGlzLmNoZWNrZWQpXG4gICAgfVxuICB9XG59XG4iLCI8ZXFtLWNvbnRhaW5lciAoY2xpY2spPVwidG9nZ2xlKClcIj5cbiAgPGVxbS1pY29uIG5hbWU9XCJjaGVja2JveFwiIHNpemU9XCIxMFwiIFtjb2xvcl09XCJjaGVja2VkID8gJyM0ZjhkNzEnIDogJ3RyYW5zcGFyZW50J1wiPjwvZXFtLWljb24+XG48L2VxbS1jb250YWluZXI+Il19
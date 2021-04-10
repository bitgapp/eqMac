import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export class ToggleComponent {
    constructor() {
        this.state = false;
        this.stateChange = new EventEmitter();
    }
    ngOnInit() {
    }
    toggleState() {
        this.state = !this.state;
        this.stateChange.emit(this.state);
    }
}
ToggleComponent.ɵfac = function ToggleComponent_Factory(t) { return new (t || ToggleComponent)(); };
ToggleComponent.ɵcmp = i0.ɵɵdefineComponent({ type: ToggleComponent, selectors: [["eqm-toggle"]], inputs: { state: "state" }, outputs: { stateChange: "stateChange" }, decls: 4, vars: 2, consts: [[1, "container", 3, "click"], [1, "indicator", "left"], [1, "indicator", "right"]], template: function ToggleComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "div", 0);
        i0.ɵɵlistener("click", function ToggleComponent_Template_div_click_0_listener() { return ctx.toggleState(); });
        i0.ɵɵelement(1, "div", 1);
        i0.ɵɵelement(2, "div", 2);
        i0.ɵɵelement(3, "div");
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵadvance(3);
        i0.ɵɵclassMap("switch " + (ctx.state ? "on" : "off"));
    } }, styles: [".container[_ngcontent-%COMP%]{height:18px;width:42px;background-color:#1e1e1e;border-radius:9px;position:relative;cursor:pointer;box-shadow:inset 0 0 0 1px #464a4d,inset 1px 1px 2px 1px #000}.container[_ngcontent-%COMP%]   .indicator[_ngcontent-%COMP%]{position:absolute;top:4px;height:10px;display:inline-block;width:10px;border-radius:5px}.container[_ngcontent-%COMP%]   .right[_ngcontent-%COMP%]{right:4px;background-color:#eb3f42}.container[_ngcontent-%COMP%]   .left[_ngcontent-%COMP%]{left:4px;background-color:#4f8d71}.container[_ngcontent-%COMP%]   .switch[_ngcontent-%COMP%]{position:absolute;height:14px;width:14px;left:1px;border-radius:8px;background-color:#45484b;border:1px solid #000;top:1px;transition-property:all;transition-duration:.2s;-webkit-transition-property:all;-webkit-transition-duration:.2s;box-shadow:inset -3px -3px 3px 3px #333436,1px 1px 3px 0 rgba(0,0,0,.5)}.container[_ngcontent-%COMP%]   .on[_ngcontent-%COMP%]{transform:translateX(24px)}.container[_ngcontent-%COMP%]   .off[_ngcontent-%COMP%]{transform:translateX(0)}"] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ToggleComponent, [{
        type: Component,
        args: [{
                selector: 'eqm-toggle',
                templateUrl: './toggle.component.html',
                styleUrls: ['./toggle.component.scss']
            }]
    }], null, { state: [{
            type: Input
        }], stateChange: [{
            type: Output
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9nZ2xlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2NvbXBvbmVudHMvdG9nZ2xlL3RvZ2dsZS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL3RvZ2dsZS90b2dnbGUuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQTs7QUFPOUUsTUFBTSxPQUFPLGVBQWU7SUFMNUI7UUFNVyxVQUFLLEdBQUcsS0FBSyxDQUFBO1FBQ1osZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFBO0tBUzNDO0lBUEMsUUFBUTtJQUNSLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUE7UUFDeEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ25DLENBQUM7OzhFQVZVLGVBQWU7b0RBQWYsZUFBZTtRQ1A1Qiw4QkFBK0M7UUFBeEIseUZBQVMsaUJBQWEsSUFBQztRQUM1Qyx5QkFBa0M7UUFDbEMseUJBQW1DO1FBQ25DLHNCQUF3RDtRQUMxRCxpQkFBTTs7UUFEQyxlQUE0QztRQUE1QyxxREFBNEM7O3VGREl0QyxlQUFlO2NBTDNCLFNBQVM7ZUFBQztnQkFDVCxRQUFRLEVBQUUsWUFBWTtnQkFDdEIsV0FBVyxFQUFFLHlCQUF5QjtnQkFDdEMsU0FBUyxFQUFFLENBQUUseUJBQXlCLENBQUU7YUFDekM7Z0JBRVUsS0FBSztrQkFBYixLQUFLO1lBQ0ksV0FBVztrQkFBcEIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdlcW0tdG9nZ2xlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3RvZ2dsZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWyAnLi90b2dnbGUuY29tcG9uZW50LnNjc3MnIF1cbn0pXG5leHBvcnQgY2xhc3MgVG9nZ2xlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCkgc3RhdGUgPSBmYWxzZVxuICBAT3V0cHV0KCkgc3RhdGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKClcblxuICBuZ09uSW5pdCAoKSB7XG4gIH1cblxuICB0b2dnbGVTdGF0ZSAoKSB7XG4gICAgdGhpcy5zdGF0ZSA9ICF0aGlzLnN0YXRlXG4gICAgdGhpcy5zdGF0ZUNoYW5nZS5lbWl0KHRoaXMuc3RhdGUpXG4gIH1cbn1cbiIsIjxkaXYgY2xhc3M9XCJjb250YWluZXJcIiAoY2xpY2spPVwidG9nZ2xlU3RhdGUoKVwiPlxuICA8ZGl2IGNsYXNzPVwiaW5kaWNhdG9yIGxlZnRcIj48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cImluZGljYXRvciByaWdodFwiPjwvZGl2PlxuICA8ZGl2IFtjbGFzc109XCInc3dpdGNoICcgKyAoc3RhdGUgPyAnb24nIDogJ29mZicpXCI+PC9kaXY+XG48L2Rpdj4iXX0=
import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import * as i0 from "@angular/core";
export class ClickedOutsideDirective {
    constructor() {
        this.clickedOutside = new EventEmitter();
        this.inside = false;
    }
    insideClick() {
        this.inside = true;
    }
    outsideClick() {
        if (!this.inside) {
            this.clickedOutside.emit();
        }
        this.inside = false;
    }
}
ClickedOutsideDirective.ɵfac = function ClickedOutsideDirective_Factory(t) { return new (t || ClickedOutsideDirective)(); };
ClickedOutsideDirective.ɵdir = i0.ɵɵdefineDirective({ type: ClickedOutsideDirective, selectors: [["", "clickedOutside", ""]], hostBindings: function ClickedOutsideDirective_HostBindings(rf, ctx) { if (rf & 1) {
        i0.ɵɵlistener("click", function ClickedOutsideDirective_click_HostBindingHandler() { return ctx.insideClick(); })("click", function ClickedOutsideDirective_click_HostBindingHandler() { return ctx.outsideClick(); }, false, i0.ɵɵresolveDocument);
    } }, outputs: { clickedOutside: "clickedOutside" } });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ClickedOutsideDirective, [{
        type: Directive,
        args: [{ selector: '[clickedOutside]' }]
    }], null, { clickedOutside: [{
            type: Output
        }], insideClick: [{
            type: HostListener,
            args: ['click']
        }], outsideClick: [{
            type: HostListener,
            args: ['document:click']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpY2tlZC1vdXRzaWRlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2RpcmVjdGl2ZXMvY2xpY2tlZC1vdXRzaWRlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFBOztBQUc3RSxNQUFNLE9BQU8sdUJBQXVCO0lBRHBDO1FBRVksbUJBQWMsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFBO1FBRXJDLFdBQU0sR0FBRyxLQUFLLENBQUE7S0FhdkI7SUFYQyxXQUFXO1FBQ1QsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7SUFDcEIsQ0FBQztJQUdELFlBQVk7UUFDVixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNoQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFBO1NBQzNCO1FBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUE7SUFDckIsQ0FBQzs7OEZBZlUsdUJBQXVCOzREQUF2Qix1QkFBdUI7b0dBQXZCLGlCQUFhLG1GQUFiLGtCQUFjOzt1RkFBZCx1QkFBdUI7Y0FEbkMsU0FBUztlQUFDLEVBQUUsUUFBUSxFQUFFLGtCQUFrQixFQUFFO2dCQUUvQixjQUFjO2tCQUF2QixNQUFNO1lBSVAsV0FBVztrQkFEVixZQUFZO21CQUFDLE9BQU87WUFNckIsWUFBWTtrQkFEWCxZQUFZO21CQUFDLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1tjbGlja2VkT3V0c2lkZV0nIH0pXG5leHBvcnQgY2xhc3MgQ2xpY2tlZE91dHNpZGVEaXJlY3RpdmUge1xuICBAT3V0cHV0KCkgY2xpY2tlZE91dHNpZGUgPSBuZXcgRXZlbnRFbWl0dGVyKClcblxuICBwcml2YXRlIGluc2lkZSA9IGZhbHNlXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJylcbiAgaW5zaWRlQ2xpY2sgKCkge1xuICAgIHRoaXMuaW5zaWRlID0gdHJ1ZVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6Y2xpY2snKVxuICBvdXRzaWRlQ2xpY2sgKCkge1xuICAgIGlmICghdGhpcy5pbnNpZGUpIHtcbiAgICAgIHRoaXMuY2xpY2tlZE91dHNpZGUuZW1pdCgpXG4gICAgfVxuICAgIHRoaXMuaW5zaWRlID0gZmFsc2VcbiAgfVxufVxuIl19
import { Directive, Output, HostListener, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export class MouseWheelDirective {
    constructor() {
        this.mouseWheel = new EventEmitter();
    }
    onMouseWheelChrome(event) {
        this.mouseWheelFunc(event);
    }
    onMouseWheelFirefox(event) {
        this.mouseWheelFunc(event);
    }
    onMouseWheelIE(event) {
        this.mouseWheelFunc(event);
    }
    mouseWheelFunc(event) {
        event = window.event || event; // old IE support
        this.mouseWheel.emit(event);
        // for IE
        event.returnValue = false;
        // for Chrome and Firefox
        if (event.preventDefault) {
            event.preventDefault();
        }
    }
}
MouseWheelDirective.ɵfac = function MouseWheelDirective_Factory(t) { return new (t || MouseWheelDirective)(); };
MouseWheelDirective.ɵdir = i0.ɵɵdefineDirective({ type: MouseWheelDirective, selectors: [["", "mouseWheel", ""]], hostBindings: function MouseWheelDirective_HostBindings(rf, ctx) { if (rf & 1) {
        i0.ɵɵlistener("mousewheel", function MouseWheelDirective_mousewheel_HostBindingHandler($event) { return ctx.onMouseWheelChrome($event); })("DOMMouseScroll", function MouseWheelDirective_DOMMouseScroll_HostBindingHandler($event) { return ctx.onMouseWheelFirefox($event); })("onmousewheel", function MouseWheelDirective_onmousewheel_HostBindingHandler($event) { return ctx.onMouseWheelIE($event); });
    } }, outputs: { mouseWheel: "mouseWheel" } });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MouseWheelDirective, [{
        type: Directive,
        args: [{ selector: '[mouseWheel]' }]
    }], null, { mouseWheel: [{
            type: Output
        }], onMouseWheelChrome: [{
            type: HostListener,
            args: ['mousewheel', ['$event']]
        }], onMouseWheelFirefox: [{
            type: HostListener,
            args: ['DOMMouseScroll', ['$event']]
        }], onMouseWheelIE: [{
            type: HostListener,
            args: ['onmousewheel', ['$event']]
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW91c2V3aGVlbC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9kaXJlY3RpdmVzL21vdXNld2hlZWwuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUE7O0FBRzdFLE1BQU0sT0FBTyxtQkFBbUI7SUFEaEM7UUFFWSxlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQTtLQXdCMUM7SUF0QjJDLGtCQUFrQixDQUFFLEtBQVU7UUFDdEUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUM1QixDQUFDO0lBRTZDLG1CQUFtQixDQUFFLEtBQVU7UUFDM0UsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUM1QixDQUFDO0lBRTJDLGNBQWMsQ0FBRSxLQUFVO1FBQ3BFLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDNUIsQ0FBQztJQUVELGNBQWMsQ0FBRSxLQUFVO1FBQ3hCLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQSxDQUFDLGlCQUFpQjtRQUMvQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUMzQixTQUFTO1FBQ1QsS0FBSyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7UUFDekIseUJBQXlCO1FBQ3pCLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRTtZQUN4QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUE7U0FDdkI7SUFDSCxDQUFDOztzRkF4QlUsbUJBQW1CO3dEQUFuQixtQkFBbUI7Z0hBQW5CLDhCQUNULHVHQURTLCtCQUNSLG1HQURRLDBCQUNiOzt1RkFEYSxtQkFBbUI7Y0FEL0IsU0FBUztlQUFDLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRTtnQkFFM0IsVUFBVTtrQkFBbkIsTUFBTTtZQUVtQyxrQkFBa0I7a0JBQTNELFlBQVk7bUJBQUMsWUFBWSxFQUFFLENBQUUsUUFBUSxDQUFFO1lBSU0sbUJBQW1CO2tCQUFoRSxZQUFZO21CQUFDLGdCQUFnQixFQUFFLENBQUUsUUFBUSxDQUFFO1lBSUEsY0FBYztrQkFBekQsWUFBWTttQkFBQyxjQUFjLEVBQUUsQ0FBRSxRQUFRLENBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIE91dHB1dCwgSG9zdExpc3RlbmVyLCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbbW91c2VXaGVlbF0nIH0pXG5leHBvcnQgY2xhc3MgTW91c2VXaGVlbERpcmVjdGl2ZSB7XG4gIEBPdXRwdXQoKSBtb3VzZVdoZWVsID0gbmV3IEV2ZW50RW1pdHRlcigpXG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2V3aGVlbCcsIFsgJyRldmVudCcgXSkgb25Nb3VzZVdoZWVsQ2hyb21lIChldmVudDogYW55KSB7XG4gICAgdGhpcy5tb3VzZVdoZWVsRnVuYyhldmVudClcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ0RPTU1vdXNlU2Nyb2xsJywgWyAnJGV2ZW50JyBdKSBvbk1vdXNlV2hlZWxGaXJlZm94IChldmVudDogYW55KSB7XG4gICAgdGhpcy5tb3VzZVdoZWVsRnVuYyhldmVudClcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ29ubW91c2V3aGVlbCcsIFsgJyRldmVudCcgXSkgb25Nb3VzZVdoZWVsSUUgKGV2ZW50OiBhbnkpIHtcbiAgICB0aGlzLm1vdXNlV2hlZWxGdW5jKGV2ZW50KVxuICB9XG5cbiAgbW91c2VXaGVlbEZ1bmMgKGV2ZW50OiBhbnkpIHtcbiAgICBldmVudCA9IHdpbmRvdy5ldmVudCB8fCBldmVudCAvLyBvbGQgSUUgc3VwcG9ydFxuICAgIHRoaXMubW91c2VXaGVlbC5lbWl0KGV2ZW50KVxuICAgIC8vIGZvciBJRVxuICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2VcbiAgICAvLyBmb3IgQ2hyb21lIGFuZCBGaXJlZm94XG4gICAgaWYgKGV2ZW50LnByZXZlbnREZWZhdWx0KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgfVxuICB9XG59XG4iXX0=
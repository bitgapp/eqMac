import { Directive, Output, HostListener, EventEmitter } from '@angular/core';
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
MouseWheelDirective.decorators = [
    { type: Directive, args: [{ selector: '[mouseWheel]' },] }
];
MouseWheelDirective.propDecorators = {
    mouseWheel: [{ type: Output }],
    onMouseWheelChrome: [{ type: HostListener, args: ['mousewheel', ['$event'],] }],
    onMouseWheelFirefox: [{ type: HostListener, args: ['DOMMouseScroll', ['$event'],] }],
    onMouseWheelIE: [{ type: HostListener, args: ['onmousewheel', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW91c2V3aGVlbC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9kaXJlY3RpdmVzL21vdXNld2hlZWwuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUE7QUFHN0UsTUFBTSxPQUFPLG1CQUFtQjtJQURoQztRQUVZLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFBO0lBd0IzQyxDQUFDO0lBdEIyQyxrQkFBa0IsQ0FBRSxLQUFVO1FBQ3RFLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDNUIsQ0FBQztJQUU2QyxtQkFBbUIsQ0FBRSxLQUFVO1FBQzNFLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDNUIsQ0FBQztJQUUyQyxjQUFjLENBQUUsS0FBVTtRQUNwRSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzVCLENBQUM7SUFFRCxjQUFjLENBQUUsS0FBVTtRQUN4QixLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUEsQ0FBQyxpQkFBaUI7UUFDL0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDM0IsU0FBUztRQUNULEtBQUssQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFBO1FBQ3pCLHlCQUF5QjtRQUN6QixJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUU7WUFDeEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFBO1NBQ3ZCO0lBQ0gsQ0FBQzs7O1lBekJGLFNBQVMsU0FBQyxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUU7Ozt5QkFFcEMsTUFBTTtpQ0FFTixZQUFZLFNBQUMsWUFBWSxFQUFFLENBQUUsUUFBUSxDQUFFO2tDQUl2QyxZQUFZLFNBQUMsZ0JBQWdCLEVBQUUsQ0FBRSxRQUFRLENBQUU7NkJBSTNDLFlBQVksU0FBQyxjQUFjLEVBQUUsQ0FBRSxRQUFRLENBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIE91dHB1dCwgSG9zdExpc3RlbmVyLCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbbW91c2VXaGVlbF0nIH0pXG5leHBvcnQgY2xhc3MgTW91c2VXaGVlbERpcmVjdGl2ZSB7XG4gIEBPdXRwdXQoKSBtb3VzZVdoZWVsID0gbmV3IEV2ZW50RW1pdHRlcigpXG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2V3aGVlbCcsIFsgJyRldmVudCcgXSkgb25Nb3VzZVdoZWVsQ2hyb21lIChldmVudDogYW55KSB7XG4gICAgdGhpcy5tb3VzZVdoZWVsRnVuYyhldmVudClcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ0RPTU1vdXNlU2Nyb2xsJywgWyAnJGV2ZW50JyBdKSBvbk1vdXNlV2hlZWxGaXJlZm94IChldmVudDogYW55KSB7XG4gICAgdGhpcy5tb3VzZVdoZWVsRnVuYyhldmVudClcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ29ubW91c2V3aGVlbCcsIFsgJyRldmVudCcgXSkgb25Nb3VzZVdoZWVsSUUgKGV2ZW50OiBhbnkpIHtcbiAgICB0aGlzLm1vdXNlV2hlZWxGdW5jKGV2ZW50KVxuICB9XG5cbiAgbW91c2VXaGVlbEZ1bmMgKGV2ZW50OiBhbnkpIHtcbiAgICBldmVudCA9IHdpbmRvdy5ldmVudCB8fCBldmVudCAvLyBvbGQgSUUgc3VwcG9ydFxuICAgIHRoaXMubW91c2VXaGVlbC5lbWl0KGV2ZW50KVxuICAgIC8vIGZvciBJRVxuICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2VcbiAgICAvLyBmb3IgQ2hyb21lIGFuZCBGaXJlZm94XG4gICAgaWYgKGV2ZW50LnByZXZlbnREZWZhdWx0KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgfVxuICB9XG59XG4iXX0=
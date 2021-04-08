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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW91c2V3aGVlbC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvZGlyZWN0aXZlcy9tb3VzZXdoZWVsLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFBO0FBRzdFLE1BQU0sT0FBTyxtQkFBbUI7SUFEaEM7UUFFWSxlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQTtJQXdCM0MsQ0FBQztJQXRCMkMsa0JBQWtCLENBQUUsS0FBVTtRQUN0RSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzVCLENBQUM7SUFFNkMsbUJBQW1CLENBQUUsS0FBVTtRQUMzRSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzVCLENBQUM7SUFFMkMsY0FBYyxDQUFFLEtBQVU7UUFDcEUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUM1QixDQUFDO0lBRUQsY0FBYyxDQUFFLEtBQVU7UUFDeEIsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFBLENBQUMsaUJBQWlCO1FBQy9DLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQzNCLFNBQVM7UUFDVCxLQUFLLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQTtRQUN6Qix5QkFBeUI7UUFDekIsSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFO1lBQ3hCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQTtTQUN2QjtJQUNILENBQUM7OztZQXpCRixTQUFTLFNBQUMsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFOzs7eUJBRXBDLE1BQU07aUNBRU4sWUFBWSxTQUFDLFlBQVksRUFBRSxDQUFFLFFBQVEsQ0FBRTtrQ0FJdkMsWUFBWSxTQUFDLGdCQUFnQixFQUFFLENBQUUsUUFBUSxDQUFFOzZCQUkzQyxZQUFZLFNBQUMsY0FBYyxFQUFFLENBQUUsUUFBUSxDQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBPdXRwdXQsIEhvc3RMaXN0ZW5lciwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcblxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW21vdXNlV2hlZWxdJyB9KVxuZXhwb3J0IGNsYXNzIE1vdXNlV2hlZWxEaXJlY3RpdmUge1xuICBAT3V0cHV0KCkgbW91c2VXaGVlbCA9IG5ldyBFdmVudEVtaXR0ZXIoKVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNld2hlZWwnLCBbICckZXZlbnQnIF0pIG9uTW91c2VXaGVlbENocm9tZSAoZXZlbnQ6IGFueSkge1xuICAgIHRoaXMubW91c2VXaGVlbEZ1bmMoZXZlbnQpXG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdET01Nb3VzZVNjcm9sbCcsIFsgJyRldmVudCcgXSkgb25Nb3VzZVdoZWVsRmlyZWZveCAoZXZlbnQ6IGFueSkge1xuICAgIHRoaXMubW91c2VXaGVlbEZ1bmMoZXZlbnQpXG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdvbm1vdXNld2hlZWwnLCBbICckZXZlbnQnIF0pIG9uTW91c2VXaGVlbElFIChldmVudDogYW55KSB7XG4gICAgdGhpcy5tb3VzZVdoZWVsRnVuYyhldmVudClcbiAgfVxuXG4gIG1vdXNlV2hlZWxGdW5jIChldmVudDogYW55KSB7XG4gICAgZXZlbnQgPSB3aW5kb3cuZXZlbnQgfHwgZXZlbnQgLy8gb2xkIElFIHN1cHBvcnRcbiAgICB0aGlzLm1vdXNlV2hlZWwuZW1pdChldmVudClcbiAgICAvLyBmb3IgSUVcbiAgICBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlXG4gICAgLy8gZm9yIENocm9tZSBhbmQgRmlyZWZveFxuICAgIGlmIChldmVudC5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIH1cbiAgfVxufVxuIl19
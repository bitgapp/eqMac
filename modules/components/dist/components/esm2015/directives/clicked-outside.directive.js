import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
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
ClickedOutsideDirective.decorators = [
    { type: Directive, args: [{ selector: '[clickedOutside]' },] }
];
ClickedOutsideDirective.propDecorators = {
    clickedOutside: [{ type: Output }],
    insideClick: [{ type: HostListener, args: ['click',] }],
    outsideClick: [{ type: HostListener, args: ['document:click',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpY2tlZC1vdXRzaWRlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2RpcmVjdGl2ZXMvY2xpY2tlZC1vdXRzaWRlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFBO0FBRzdFLE1BQU0sT0FBTyx1QkFBdUI7SUFEcEM7UUFFWSxtQkFBYyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUE7UUFFckMsV0FBTSxHQUFHLEtBQUssQ0FBQTtJQWF4QixDQUFDO0lBWEMsV0FBVztRQUNULElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFBO0lBQ3BCLENBQUM7SUFHRCxZQUFZO1FBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDaEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtTQUMzQjtRQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFBO0lBQ3JCLENBQUM7OztZQWhCRixTQUFTLFNBQUMsRUFBRSxRQUFRLEVBQUUsa0JBQWtCLEVBQUU7Ozs2QkFFeEMsTUFBTTswQkFHTixZQUFZLFNBQUMsT0FBTzsyQkFLcEIsWUFBWSxTQUFDLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1tjbGlja2VkT3V0c2lkZV0nIH0pXG5leHBvcnQgY2xhc3MgQ2xpY2tlZE91dHNpZGVEaXJlY3RpdmUge1xuICBAT3V0cHV0KCkgY2xpY2tlZE91dHNpZGUgPSBuZXcgRXZlbnRFbWl0dGVyKClcblxuICBwcml2YXRlIGluc2lkZSA9IGZhbHNlXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJylcbiAgaW5zaWRlQ2xpY2sgKCkge1xuICAgIHRoaXMuaW5zaWRlID0gdHJ1ZVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6Y2xpY2snKVxuICBvdXRzaWRlQ2xpY2sgKCkge1xuICAgIGlmICghdGhpcy5pbnNpZGUpIHtcbiAgICAgIHRoaXMuY2xpY2tlZE91dHNpZGUuZW1pdCgpXG4gICAgfVxuICAgIHRoaXMuaW5zaWRlID0gZmFsc2VcbiAgfVxufVxuIl19
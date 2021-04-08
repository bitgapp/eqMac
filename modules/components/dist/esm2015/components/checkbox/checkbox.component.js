import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
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
CheckboxComponent.decorators = [
    { type: Component, args: [{
                selector: 'eqm-checkbox',
                template: "<eqm-container (click)=\"toggle()\">\n  <eqm-icon name=\"checkbox\" size=\"10\" [color]=\"checked ? '#4f8d71' : 'transparent'\"></eqm-icon>\n</eqm-container>",
                styles: [":host{display:flex;justify-content:center;align-items:center;cursor:default;filter:grayscale(80%)}:host.enabled{filter:none;cursor:pointer}"]
            },] }
];
CheckboxComponent.propDecorators = {
    interactive: [{ type: Input }],
    checked: [{ type: Input }],
    checkedChanged: [{ type: Output }],
    enabled: [{ type: HostBinding, args: ['class.enabled',] }, { type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3guY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2NvbXBvbmVudHMvY2hlY2tib3gvY2hlY2tib3guY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFBO0FBT25GLE1BQU0sT0FBTyxpQkFBaUI7SUFMOUI7UUFNVyxnQkFBVyxHQUFZLElBQUksQ0FBQTtRQUMzQixZQUFPLEdBQVksS0FBSyxDQUFBO1FBQ3ZCLG1CQUFjLEdBQUcsSUFBSSxZQUFZLEVBQVcsQ0FBQTtRQUNmLFlBQU8sR0FBRyxJQUFJLENBQUE7SUFRdkQsQ0FBQztJQU5DLE1BQU07UUFDSixJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNwQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQTtZQUM1QixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7U0FDdkM7SUFDSCxDQUFDOzs7WUFoQkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2dCQUN4Qix5S0FBd0M7O2FBRXpDOzs7MEJBRUUsS0FBSztzQkFDTCxLQUFLOzZCQUNMLE1BQU07c0JBQ04sV0FBVyxTQUFDLGVBQWUsY0FBRyxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIEhvc3RCaW5kaW5nIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZXFtLWNoZWNrYm94JyxcbiAgdGVtcGxhdGVVcmw6ICcuL2NoZWNrYm94LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbICcuL2NoZWNrYm94LmNvbXBvbmVudC5zY3NzJyBdXG59KVxuZXhwb3J0IGNsYXNzIENoZWNrYm94Q29tcG9uZW50IHtcbiAgQElucHV0KCkgaW50ZXJhY3RpdmU6IGJvb2xlYW4gPSB0cnVlXG4gIEBJbnB1dCgpIGNoZWNrZWQ6IGJvb2xlYW4gPSBmYWxzZVxuICBAT3V0cHV0KCkgY2hlY2tlZENoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KClcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5lbmFibGVkJykgQElucHV0KCkgZW5hYmxlZCA9IHRydWVcblxuICB0b2dnbGUgKCkge1xuICAgIGlmICh0aGlzLmludGVyYWN0aXZlICYmIHRoaXMuZW5hYmxlZCkge1xuICAgICAgdGhpcy5jaGVja2VkID0gIXRoaXMuY2hlY2tlZFxuICAgICAgdGhpcy5jaGVja2VkQ2hhbmdlZC5lbWl0KHRoaXMuY2hlY2tlZClcbiAgICB9XG4gIH1cbn1cbiJdfQ==
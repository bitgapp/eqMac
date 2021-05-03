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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3guY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvY29tcG9uZW50cy9jaGVja2JveC9jaGVja2JveC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUE7QUFPbkYsTUFBTSxPQUFPLGlCQUFpQjtJQUw5QjtRQU1XLGdCQUFXLEdBQVksSUFBSSxDQUFBO1FBQzNCLFlBQU8sR0FBWSxLQUFLLENBQUE7UUFDdkIsbUJBQWMsR0FBRyxJQUFJLFlBQVksRUFBVyxDQUFBO1FBQ2YsWUFBTyxHQUFHLElBQUksQ0FBQTtJQVF2RCxDQUFDO0lBTkMsTUFBTTtRQUNKLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ3BDLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFBO1lBQzVCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtTQUN2QztJQUNILENBQUM7OztZQWhCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLHlLQUF3Qzs7YUFFekM7OzswQkFFRSxLQUFLO3NCQUNMLEtBQUs7NkJBQ0wsTUFBTTtzQkFDTixXQUFXLFNBQUMsZUFBZSxjQUFHLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgSG9zdEJpbmRpbmcgfSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdlcW0tY2hlY2tib3gnLFxuICB0ZW1wbGF0ZVVybDogJy4vY2hlY2tib3guY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsgJy4vY2hlY2tib3guY29tcG9uZW50LnNjc3MnIF1cbn0pXG5leHBvcnQgY2xhc3MgQ2hlY2tib3hDb21wb25lbnQge1xuICBASW5wdXQoKSBpbnRlcmFjdGl2ZTogYm9vbGVhbiA9IHRydWVcbiAgQElucHV0KCkgY2hlY2tlZDogYm9vbGVhbiA9IGZhbHNlXG4gIEBPdXRwdXQoKSBjaGVja2VkQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKVxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmVuYWJsZWQnKSBASW5wdXQoKSBlbmFibGVkID0gdHJ1ZVxuXG4gIHRvZ2dsZSAoKSB7XG4gICAgaWYgKHRoaXMuaW50ZXJhY3RpdmUgJiYgdGhpcy5lbmFibGVkKSB7XG4gICAgICB0aGlzLmNoZWNrZWQgPSAhdGhpcy5jaGVja2VkXG4gICAgICB0aGlzLmNoZWNrZWRDaGFuZ2VkLmVtaXQodGhpcy5jaGVja2VkKVxuICAgIH1cbiAgfVxufVxuIl19
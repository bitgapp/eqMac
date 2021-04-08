import { Component, Input } from '@angular/core';
export class ValueScreenComponent {
    constructor() {
        this.fontSize = 10;
        this.disabled = false;
    }
    ngOnInit() { }
}
ValueScreenComponent.decorators = [
    { type: Component, args: [{
                selector: 'eqm-value-screen',
                template: "<eqm-container [class]=\"'screen' + (disabled ? ' disabled' : '')\" [style.font-size.px]=\"fontSize\" [style.width.px]=\"fontSize * 4\" [style.height.px]=\"fontSize * 1.4\">\n  <eqm-label [fontSize]=\"fontSize\">\n    <ng-content></ng-content>\n  </eqm-label>\n</eqm-container>",
                styles: [".screen{text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;transition-property:filter;transition-duration:.5s}.screen ::ng-deep eqm-label span{color:#4f8d71!important}.disabled{filter:grayscale(80%)}"]
            },] }
];
ValueScreenComponent.propDecorators = {
    fontSize: [{ type: Input }],
    disabled: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdWUtc2NyZWVuLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9jb21wb25lbnRzL3ZhbHVlLXNjcmVlbi92YWx1ZS1zY3JlZW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBRVQsS0FBSyxFQUNOLE1BQU0sZUFBZSxDQUFBO0FBT3RCLE1BQU0sT0FBTyxvQkFBb0I7SUFMakM7UUFNVyxhQUFRLEdBQUcsRUFBRSxDQUFBO1FBQ2IsYUFBUSxHQUFHLEtBQUssQ0FBQTtJQUczQixDQUFDO0lBREMsUUFBUSxLQUFLLENBQUM7OztZQVRmLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsa0JBQWtCO2dCQUM1QixpU0FBNEM7O2FBRTdDOzs7dUJBRUUsS0FBSzt1QkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBPbkluaXQsXG4gIElucHV0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2VxbS12YWx1ZS1zY3JlZW4nLFxuICB0ZW1wbGF0ZVVybDogJy4vdmFsdWUtc2NyZWVuLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbICcuL3ZhbHVlLXNjcmVlbi5jb21wb25lbnQuc2NzcycgXVxufSlcbmV4cG9ydCBjbGFzcyBWYWx1ZVNjcmVlbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpIGZvbnRTaXplID0gMTBcbiAgQElucHV0KCkgZGlzYWJsZWQgPSBmYWxzZVxuXG4gIG5nT25Jbml0ICgpIHt9XG59XG4iXX0=
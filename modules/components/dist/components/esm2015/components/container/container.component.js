import { Component, HostBinding, Input } from '@angular/core';
export class ContainerComponent {
    constructor() {
        this.disabled = false;
    }
    ngOnInit() {
    }
}
ContainerComponent.decorators = [
    { type: Component, args: [{
                selector: 'eqm-container',
                template: "<ng-content></ng-content>\n",
                styles: [":host{display:inline-block;margin:2px;color:#4f8d71;border-radius:2px;background-color:#1e1e1e;box-shadow:0 0 0 1px #000,0 0 0 2px #464a4d;background-size:6px 6px}:host.disabled{filter:grayscale(80%)}"]
            },] }
];
ContainerComponent.propDecorators = {
    disabled: [{ type: HostBinding, args: ['class.disabled',] }, { type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2NvbXBvbmVudHMvY29udGFpbmVyL2NvbnRhaW5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFBO0FBT3JFLE1BQU0sT0FBTyxrQkFBa0I7SUFML0I7UUFNMEMsYUFBUSxHQUFHLEtBQUssQ0FBQTtJQUkxRCxDQUFDO0lBRkMsUUFBUTtJQUNSLENBQUM7OztZQVRGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZUFBZTtnQkFDekIsdUNBQXlDOzthQUUxQzs7O3VCQUVFLFdBQVcsU0FBQyxnQkFBZ0IsY0FBRyxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIEhvc3RCaW5kaW5nLCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2VxbS1jb250YWluZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vY29udGFpbmVyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbICcuL2NvbnRhaW5lci5jb21wb25lbnQuc2NzcycgXVxufSlcbmV4cG9ydCBjbGFzcyBDb250YWluZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmRpc2FibGVkJykgQElucHV0KCkgZGlzYWJsZWQgPSBmYWxzZVxuXG4gIG5nT25Jbml0ICgpIHtcbiAgfVxufVxuIl19
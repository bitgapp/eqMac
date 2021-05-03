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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdWUtc2NyZWVuLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2NvbXBvbmVudHMvdmFsdWUtc2NyZWVuL3ZhbHVlLXNjcmVlbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxLQUFLLEVBQ04sTUFBTSxlQUFlLENBQUE7QUFPdEIsTUFBTSxPQUFPLG9CQUFvQjtJQUxqQztRQU1XLGFBQVEsR0FBRyxFQUFFLENBQUE7UUFDYixhQUFRLEdBQUcsS0FBSyxDQUFBO0lBRzNCLENBQUM7SUFEQyxRQUFRLEtBQUssQ0FBQzs7O1lBVGYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxrQkFBa0I7Z0JBQzVCLGlTQUE0Qzs7YUFFN0M7Ozt1QkFFRSxLQUFLO3VCQUNMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgSW5wdXRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZXFtLXZhbHVlLXNjcmVlbicsXG4gIHRlbXBsYXRlVXJsOiAnLi92YWx1ZS1zY3JlZW4uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsgJy4vdmFsdWUtc2NyZWVuLmNvbXBvbmVudC5zY3NzJyBdXG59KVxuZXhwb3J0IGNsYXNzIFZhbHVlU2NyZWVuQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCkgZm9udFNpemUgPSAxMFxuICBASW5wdXQoKSBkaXNhYmxlZCA9IGZhbHNlXG5cbiAgbmdPbkluaXQgKCkge31cbn1cbiJdfQ==
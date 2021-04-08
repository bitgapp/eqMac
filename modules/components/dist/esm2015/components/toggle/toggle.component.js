import { Component, Input, Output, EventEmitter } from '@angular/core';
export class ToggleComponent {
    constructor() {
        this.state = false;
        this.stateChange = new EventEmitter();
    }
    ngOnInit() {
    }
    toggleState() {
        this.state = !this.state;
        this.stateChange.emit(this.state);
    }
}
ToggleComponent.decorators = [
    { type: Component, args: [{
                selector: 'eqm-toggle',
                template: "<div class=\"container\" (click)=\"toggleState()\">\n  <div class=\"indicator left\"></div>\n  <div class=\"indicator right\"></div>\n  <div [class]=\"'switch ' + (state ? 'on' : 'off')\"></div>\n</div>",
                styles: [".container{height:18px;width:42px;background-color:#1e1e1e;border-radius:9px;position:relative;cursor:pointer;box-shadow:inset 0 0 0 1px #464a4d,inset 1px 1px 2px 1px #000}.container .indicator{position:absolute;top:4px;height:10px;display:inline-block;width:10px;border-radius:5px}.container .right{right:4px;background-color:#eb3f42}.container .left{left:4px;background-color:#4f8d71}.container .switch{position:absolute;height:14px;width:14px;left:1px;border-radius:8px;background-color:#45484b;border:1px solid #000;top:1px;transition-property:all;transition-duration:.2s;-webkit-transition-property:all;-webkit-transition-duration:.2s;box-shadow:inset -3px -3px 3px 3px #333436,1px 1px 3px 0 rgba(0,0,0,.5)}.container .on{transform:translateX(24px)}.container .off{transform:translateX(0)}"]
            },] }
];
ToggleComponent.propDecorators = {
    state: [{ type: Input }],
    stateChange: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9nZ2xlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9jb21wb25lbnRzL3RvZ2dsZS90b2dnbGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUE7QUFPOUUsTUFBTSxPQUFPLGVBQWU7SUFMNUI7UUFNVyxVQUFLLEdBQUcsS0FBSyxDQUFBO1FBQ1osZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFBO0lBUzVDLENBQUM7SUFQQyxRQUFRO0lBQ1IsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQTtRQUN4QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDbkMsQ0FBQzs7O1lBZkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxZQUFZO2dCQUN0QixzTkFBc0M7O2FBRXZDOzs7b0JBRUUsS0FBSzswQkFDTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2VxbS10b2dnbGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vdG9nZ2xlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbICcuL3RvZ2dsZS5jb21wb25lbnQuc2NzcycgXVxufSlcbmV4cG9ydCBjbGFzcyBUb2dnbGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKSBzdGF0ZSA9IGZhbHNlXG4gIEBPdXRwdXQoKSBzdGF0ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKVxuXG4gIG5nT25Jbml0ICgpIHtcbiAgfVxuXG4gIHRvZ2dsZVN0YXRlICgpIHtcbiAgICB0aGlzLnN0YXRlID0gIXRoaXMuc3RhdGVcbiAgICB0aGlzLnN0YXRlQ2hhbmdlLmVtaXQodGhpcy5zdGF0ZSlcbiAgfVxufVxuIl19
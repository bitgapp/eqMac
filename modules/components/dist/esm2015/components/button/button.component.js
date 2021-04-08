import { Component, Input, Output, EventEmitter } from '@angular/core';
export class ButtonComponent {
    constructor() {
        this.type = 'large';
        this.height = null;
        this.width = null;
        this.state = false;
        this.toggle = false;
        this.depressable = true;
        this.hoverable = true;
        this.disabled = false;
        this.pressed = new EventEmitter();
    }
    ngOnInit() {
    }
    get style() {
        return {
            width: `${this.width}px`,
            height: `${this.height}px`
        };
    }
    computeClass() {
        let className = 'button';
        className += ` ${this.type}`;
        className += ` ${this.type}`;
        className += this.state ? ' on' : ' off';
        if (this.disabled) {
            className += ' disabled';
        }
        else if (this.hoverable) {
            className += ' hoverable-' + (this.state ? 'on' : 'off');
        }
        return className;
    }
    click() {
        if (!this.disabled) {
            if (this.toggle) {
                if (this.state && this.depressable) {
                    this.state = !this.state;
                }
            }
            else {
                this.state = true;
                setTimeout(() => {
                    this.state = false;
                }, 100);
            }
            this.pressed.emit();
        }
    }
}
ButtonComponent.decorators = [
    { type: Component, args: [{
                selector: 'eqm-button',
                template: "<div (click)=\"click()\" [class]=\"computeClass()\" [ngStyle]=\"style\">\n    <ng-content></ng-content>\n</div>",
                styles: [":host{display:inline-block;margin:1px}.button{transform:translate(-1px,-1px);display:flex;flex-direction:column;justify-content:center;text-align:center;background-color:#3e4146;transition-property:filter;transition-duration:.5s;border-radius:3px}.button,.button *{cursor:pointer!important}.transparent{background-color:transparent;box-shadow:none!important}.large{height:34px}.circle,.square{height:34px;width:34px}.circle{border-radius:999px}.narrow{height:22px;padding:0 5px}.off{box-shadow:0 0 0 1px #000,inset 1px 1px 0 0 hsla(0,0%,50.2%,.1),inset -1px -1px 0 0 rgba(0,0,0,.2),0 5px 10px -2px rgba(0,0,0,.5)}.on{box-shadow:0 0 0 1px #000,inset 0 0 0 1px rgba(79,141,113,.5),inset 0 0 15px 10px rgba(0,0,0,.3)}.hoverable-on:hover{box-shadow:0 0 0 1px #000,inset 0 0 15px 1px rgba(79,141,113,.5),inset 0 0 15px 10px rgba(0,0,0,.3)}.hoverable-off:hover{box-shadow:0 0 0 1px #000,inset 0 0 15px 1px rgba(79,141,113,.5),0 5px 10px -2px rgba(0,0,0,.5)}.disabled{filter:grayscale(80%) brightness(80%)}.disabled,.disabled *{cursor:default!important}"]
            },] }
];
ButtonComponent.propDecorators = {
    type: [{ type: Input }],
    height: [{ type: Input }],
    width: [{ type: Input }],
    state: [{ type: Input }],
    toggle: [{ type: Input }],
    depressable: [{ type: Input }],
    hoverable: [{ type: Input }],
    disabled: [{ type: Input }],
    pressed: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9jb21wb25lbnRzL2J1dHRvbi9idXR0b24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUE7QUFPOUUsTUFBTSxPQUFPLGVBQWU7SUFMNUI7UUFNVyxTQUFJLEdBQTZELE9BQU8sQ0FBQTtRQUN4RSxXQUFNLEdBQUcsSUFBSSxDQUFBO1FBQ2IsVUFBSyxHQUFHLElBQUksQ0FBQTtRQUNaLFVBQUssR0FBRyxLQUFLLENBQUE7UUFDYixXQUFNLEdBQUcsS0FBSyxDQUFBO1FBQ2QsZ0JBQVcsR0FBRyxJQUFJLENBQUE7UUFDbEIsY0FBUyxHQUFHLElBQUksQ0FBQTtRQUNoQixhQUFRLEdBQUcsS0FBSyxDQUFBO1FBQ2YsWUFBTyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUE7SUF3Q3hDLENBQUM7SUF0Q0MsUUFBUTtJQUNSLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPO1lBQ0wsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSTtZQUN4QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJO1NBQzNCLENBQUE7SUFDSCxDQUFDO0lBRUQsWUFBWTtRQUNWLElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQTtRQUN4QixTQUFTLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7UUFDNUIsU0FBUyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO1FBQzVCLFNBQVMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQTtRQUN4QyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsU0FBUyxJQUFJLFdBQVcsQ0FBQTtTQUN6QjthQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUN6QixTQUFTLElBQUksYUFBYSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtTQUN6RDtRQUNELE9BQU8sU0FBUyxDQUFBO0lBQ2xCLENBQUM7SUFFRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNmLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO29CQUNsQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQTtpQkFDekI7YUFDRjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQTtnQkFDakIsVUFBVSxDQUFDLEdBQUcsRUFBRTtvQkFDZCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtnQkFDcEIsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFBO2FBQ1I7WUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFBO1NBQ3BCO0lBQ0gsQ0FBQzs7O1lBckRGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsWUFBWTtnQkFDdEIsMkhBQXNDOzthQUV2Qzs7O21CQUVFLEtBQUs7cUJBQ0wsS0FBSztvQkFDTCxLQUFLO29CQUNMLEtBQUs7cUJBQ0wsS0FBSzswQkFDTCxLQUFLO3dCQUNMLEtBQUs7dUJBQ0wsS0FBSztzQkFDTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2VxbS1idXR0b24nLFxuICB0ZW1wbGF0ZVVybDogJy4vYnV0dG9uLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbICcuL2J1dHRvbi5jb21wb25lbnQuc2NzcycgXVxufSlcbmV4cG9ydCBjbGFzcyBCdXR0b25Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKSB0eXBlOiAnbGFyZ2UnIHwgJ25hcnJvdycgfCAnc3F1YXJlJyB8ICdjaXJjbGUnIHwgJ3RyYW5zcGFyZW50JyA9ICdsYXJnZSdcbiAgQElucHV0KCkgaGVpZ2h0ID0gbnVsbFxuICBASW5wdXQoKSB3aWR0aCA9IG51bGxcbiAgQElucHV0KCkgc3RhdGUgPSBmYWxzZVxuICBASW5wdXQoKSB0b2dnbGUgPSBmYWxzZVxuICBASW5wdXQoKSBkZXByZXNzYWJsZSA9IHRydWVcbiAgQElucHV0KCkgaG92ZXJhYmxlID0gdHJ1ZVxuICBASW5wdXQoKSBkaXNhYmxlZCA9IGZhbHNlXG4gIEBPdXRwdXQoKSBwcmVzc2VkID0gbmV3IEV2ZW50RW1pdHRlcigpXG5cbiAgbmdPbkluaXQgKCkge1xuICB9XG5cbiAgZ2V0IHN0eWxlICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgd2lkdGg6IGAke3RoaXMud2lkdGh9cHhgLFxuICAgICAgaGVpZ2h0OiBgJHt0aGlzLmhlaWdodH1weGBcbiAgICB9XG4gIH1cblxuICBjb21wdXRlQ2xhc3MgKCkge1xuICAgIGxldCBjbGFzc05hbWUgPSAnYnV0dG9uJ1xuICAgIGNsYXNzTmFtZSArPSBgICR7dGhpcy50eXBlfWBcbiAgICBjbGFzc05hbWUgKz0gYCAke3RoaXMudHlwZX1gXG4gICAgY2xhc3NOYW1lICs9IHRoaXMuc3RhdGUgPyAnIG9uJyA6ICcgb2ZmJ1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICBjbGFzc05hbWUgKz0gJyBkaXNhYmxlZCdcbiAgICB9IGVsc2UgaWYgKHRoaXMuaG92ZXJhYmxlKSB7XG4gICAgICBjbGFzc05hbWUgKz0gJyBob3ZlcmFibGUtJyArICh0aGlzLnN0YXRlID8gJ29uJyA6ICdvZmYnKVxuICAgIH1cbiAgICByZXR1cm4gY2xhc3NOYW1lXG4gIH1cblxuICBjbGljayAoKSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICBpZiAodGhpcy50b2dnbGUpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgJiYgdGhpcy5kZXByZXNzYWJsZSkge1xuICAgICAgICAgIHRoaXMuc3RhdGUgPSAhdGhpcy5zdGF0ZVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXRlID0gdHJ1ZVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnN0YXRlID0gZmFsc2VcbiAgICAgICAgfSwgMTAwKVxuICAgICAgfVxuICAgICAgdGhpcy5wcmVzc2VkLmVtaXQoKVxuICAgIH1cbiAgfVxufVxuIl19
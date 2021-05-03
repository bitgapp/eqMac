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
                styles: [":host{display:inline-block;margin:1px}.button{transform:translate(-1px,-1px);display:flex;flex-direction:row;justify-content:center;align-items:center;text-align:center;background-color:#3e4146;transition-property:filter;transition-duration:.5s;border-radius:3px}.button,.button *{cursor:pointer!important}.transparent{background-color:transparent;box-shadow:none!important}.large{height:34px}.circle,.square{height:34px;width:34px}.circle{border-radius:999px}.narrow{height:22px;padding:0 5px}.off{box-shadow:0 0 0 1px #000,inset 1px 1px 0 0 hsla(0,0%,50.2%,.1),inset -1px -1px 0 0 rgba(0,0,0,.2),0 5px 10px -2px rgba(0,0,0,.5)}.on{box-shadow:0 0 0 1px #000,inset 0 0 0 1px rgba(79,141,113,.5),inset 0 0 15px 10px rgba(0,0,0,.3)}.hoverable-on:hover{box-shadow:0 0 0 1px #000,inset 0 0 15px 1px rgba(79,141,113,.5),inset 0 0 15px 10px rgba(0,0,0,.3)}.hoverable-off:hover{box-shadow:0 0 0 1px #000,inset 0 0 15px 1px rgba(79,141,113,.5),0 5px 10px -2px rgba(0,0,0,.5)}.disabled{filter:grayscale(80%) brightness(80%)}.disabled,.disabled *{cursor:default!important}"]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2NvbXBvbmVudHMvYnV0dG9uL2J1dHRvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQTtBQU85RSxNQUFNLE9BQU8sZUFBZTtJQUw1QjtRQU1XLFNBQUksR0FBNkQsT0FBTyxDQUFBO1FBQ3hFLFdBQU0sR0FBRyxJQUFJLENBQUE7UUFDYixVQUFLLEdBQUcsSUFBSSxDQUFBO1FBQ1osVUFBSyxHQUFHLEtBQUssQ0FBQTtRQUNiLFdBQU0sR0FBRyxLQUFLLENBQUE7UUFDZCxnQkFBVyxHQUFHLElBQUksQ0FBQTtRQUNsQixjQUFTLEdBQUcsSUFBSSxDQUFBO1FBQ2hCLGFBQVEsR0FBRyxLQUFLLENBQUE7UUFDZixZQUFPLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQTtJQXdDeEMsQ0FBQztJQXRDQyxRQUFRO0lBQ1IsQ0FBQztJQUVELElBQUksS0FBSztRQUNQLE9BQU87WUFDTCxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJO1lBQ3hCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUk7U0FDM0IsQ0FBQTtJQUNILENBQUM7SUFFRCxZQUFZO1FBQ1YsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFBO1FBQ3hCLFNBQVMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUM1QixTQUFTLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7UUFDNUIsU0FBUyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFBO1FBQ3hDLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixTQUFTLElBQUksV0FBVyxDQUFBO1NBQ3pCO2FBQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ3pCLFNBQVMsSUFBSSxhQUFhLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFBO1NBQ3pEO1FBQ0QsT0FBTyxTQUFTLENBQUE7SUFDbEIsQ0FBQztJQUVELEtBQUs7UUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNsQixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ2YsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7b0JBQ2xDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFBO2lCQUN6QjthQUNGO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFBO2dCQUNqQixVQUFVLENBQUMsR0FBRyxFQUFFO29CQUNkLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO2dCQUNwQixDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUE7YUFDUjtZQUNELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUE7U0FDcEI7SUFDSCxDQUFDOzs7WUFyREYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxZQUFZO2dCQUN0QiwySEFBc0M7O2FBRXZDOzs7bUJBRUUsS0FBSztxQkFDTCxLQUFLO29CQUNMLEtBQUs7b0JBQ0wsS0FBSztxQkFDTCxLQUFLOzBCQUNMLEtBQUs7d0JBQ0wsS0FBSzt1QkFDTCxLQUFLO3NCQUNMLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZXFtLWJ1dHRvbicsXG4gIHRlbXBsYXRlVXJsOiAnLi9idXR0b24uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsgJy4vYnV0dG9uLmNvbXBvbmVudC5zY3NzJyBdXG59KVxuZXhwb3J0IGNsYXNzIEJ1dHRvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpIHR5cGU6ICdsYXJnZScgfCAnbmFycm93JyB8ICdzcXVhcmUnIHwgJ2NpcmNsZScgfCAndHJhbnNwYXJlbnQnID0gJ2xhcmdlJ1xuICBASW5wdXQoKSBoZWlnaHQgPSBudWxsXG4gIEBJbnB1dCgpIHdpZHRoID0gbnVsbFxuICBASW5wdXQoKSBzdGF0ZSA9IGZhbHNlXG4gIEBJbnB1dCgpIHRvZ2dsZSA9IGZhbHNlXG4gIEBJbnB1dCgpIGRlcHJlc3NhYmxlID0gdHJ1ZVxuICBASW5wdXQoKSBob3ZlcmFibGUgPSB0cnVlXG4gIEBJbnB1dCgpIGRpc2FibGVkID0gZmFsc2VcbiAgQE91dHB1dCgpIHByZXNzZWQgPSBuZXcgRXZlbnRFbWl0dGVyKClcblxuICBuZ09uSW5pdCAoKSB7XG4gIH1cblxuICBnZXQgc3R5bGUgKCkge1xuICAgIHJldHVybiB7XG4gICAgICB3aWR0aDogYCR7dGhpcy53aWR0aH1weGAsXG4gICAgICBoZWlnaHQ6IGAke3RoaXMuaGVpZ2h0fXB4YFxuICAgIH1cbiAgfVxuXG4gIGNvbXB1dGVDbGFzcyAoKSB7XG4gICAgbGV0IGNsYXNzTmFtZSA9ICdidXR0b24nXG4gICAgY2xhc3NOYW1lICs9IGAgJHt0aGlzLnR5cGV9YFxuICAgIGNsYXNzTmFtZSArPSBgICR7dGhpcy50eXBlfWBcbiAgICBjbGFzc05hbWUgKz0gdGhpcy5zdGF0ZSA/ICcgb24nIDogJyBvZmYnXG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIGNsYXNzTmFtZSArPSAnIGRpc2FibGVkJ1xuICAgIH0gZWxzZSBpZiAodGhpcy5ob3ZlcmFibGUpIHtcbiAgICAgIGNsYXNzTmFtZSArPSAnIGhvdmVyYWJsZS0nICsgKHRoaXMuc3RhdGUgPyAnb24nIDogJ29mZicpXG4gICAgfVxuICAgIHJldHVybiBjbGFzc05hbWVcbiAgfVxuXG4gIGNsaWNrICgpIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIGlmICh0aGlzLnRvZ2dsZSkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSAmJiB0aGlzLmRlcHJlc3NhYmxlKSB7XG4gICAgICAgICAgdGhpcy5zdGF0ZSA9ICF0aGlzLnN0YXRlXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB0cnVlXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc3RhdGUgPSBmYWxzZVxuICAgICAgICB9LCAxMDApXG4gICAgICB9XG4gICAgICB0aGlzLnByZXNzZWQuZW1pdCgpXG4gICAgfVxuICB9XG59XG4iXX0=
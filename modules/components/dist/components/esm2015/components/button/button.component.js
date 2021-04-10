import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
const _c0 = ["*"];
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
ButtonComponent.ɵfac = function ButtonComponent_Factory(t) { return new (t || ButtonComponent)(); };
ButtonComponent.ɵcmp = i0.ɵɵdefineComponent({ type: ButtonComponent, selectors: [["eqm-button"]], inputs: { type: "type", height: "height", width: "width", state: "state", toggle: "toggle", depressable: "depressable", hoverable: "hoverable", disabled: "disabled" }, outputs: { pressed: "pressed" }, ngContentSelectors: _c0, decls: 2, vars: 3, consts: [[3, "ngStyle", "click"]], template: function ButtonComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵprojectionDef();
        i0.ɵɵelementStart(0, "div", 0);
        i0.ɵɵlistener("click", function ButtonComponent_Template_div_click_0_listener() { return ctx.click(); });
        i0.ɵɵprojection(1);
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵclassMap(ctx.computeClass());
        i0.ɵɵproperty("ngStyle", ctx.style);
    } }, directives: [i1.NgStyle], styles: ["[_nghost-%COMP%]{display:inline-block;margin:1px}.button[_ngcontent-%COMP%]{transform:translate(-1px,-1px);display:flex;flex-direction:column;justify-content:center;text-align:center;background-color:#3e4146;transition-property:filter;transition-duration:.5s;border-radius:3px}.button[_ngcontent-%COMP%], .button[_ngcontent-%COMP%]   *[_ngcontent-%COMP%]{cursor:pointer!important}.transparent[_ngcontent-%COMP%]{background-color:transparent;box-shadow:none!important}.large[_ngcontent-%COMP%]{height:34px}.circle[_ngcontent-%COMP%], .square[_ngcontent-%COMP%]{height:34px;width:34px}.circle[_ngcontent-%COMP%]{border-radius:999px}.narrow[_ngcontent-%COMP%]{height:22px;padding:0 5px}.off[_ngcontent-%COMP%]{box-shadow:0 0 0 1px #000,inset 1px 1px 0 0 hsla(0,0%,50.2%,.1),inset -1px -1px 0 0 rgba(0,0,0,.2),0 5px 10px -2px rgba(0,0,0,.5)}.on[_ngcontent-%COMP%]{box-shadow:0 0 0 1px #000,inset 0 0 0 1px rgba(79,141,113,.5),inset 0 0 15px 10px rgba(0,0,0,.3)}.hoverable-on[_ngcontent-%COMP%]:hover{box-shadow:0 0 0 1px #000,inset 0 0 15px 1px rgba(79,141,113,.5),inset 0 0 15px 10px rgba(0,0,0,.3)}.hoverable-off[_ngcontent-%COMP%]:hover{box-shadow:0 0 0 1px #000,inset 0 0 15px 1px rgba(79,141,113,.5),0 5px 10px -2px rgba(0,0,0,.5)}.disabled[_ngcontent-%COMP%]{filter:grayscale(80%) brightness(80%)}.disabled[_ngcontent-%COMP%], .disabled[_ngcontent-%COMP%]   *[_ngcontent-%COMP%]{cursor:default!important}"] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ButtonComponent, [{
        type: Component,
        args: [{
                selector: 'eqm-button',
                templateUrl: './button.component.html',
                styleUrls: ['./button.component.scss']
            }]
    }], null, { type: [{
            type: Input
        }], height: [{
            type: Input
        }], width: [{
            type: Input
        }], state: [{
            type: Input
        }], toggle: [{
            type: Input
        }], depressable: [{
            type: Input
        }], hoverable: [{
            type: Input
        }], disabled: [{
            type: Input
        }], pressed: [{
            type: Output
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2NvbXBvbmVudHMvYnV0dG9uL2J1dHRvbi5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL2J1dHRvbi9idXR0b24uY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQTs7OztBQU85RSxNQUFNLE9BQU8sZUFBZTtJQUw1QjtRQU1XLFNBQUksR0FBNkQsT0FBTyxDQUFBO1FBQ3hFLFdBQU0sR0FBRyxJQUFJLENBQUE7UUFDYixVQUFLLEdBQUcsSUFBSSxDQUFBO1FBQ1osVUFBSyxHQUFHLEtBQUssQ0FBQTtRQUNiLFdBQU0sR0FBRyxLQUFLLENBQUE7UUFDZCxnQkFBVyxHQUFHLElBQUksQ0FBQTtRQUNsQixjQUFTLEdBQUcsSUFBSSxDQUFBO1FBQ2hCLGFBQVEsR0FBRyxLQUFLLENBQUE7UUFDZixZQUFPLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQTtLQXdDdkM7SUF0Q0MsUUFBUTtJQUNSLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPO1lBQ0wsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSTtZQUN4QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJO1NBQzNCLENBQUE7SUFDSCxDQUFDO0lBRUQsWUFBWTtRQUNWLElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQTtRQUN4QixTQUFTLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7UUFDNUIsU0FBUyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO1FBQzVCLFNBQVMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQTtRQUN4QyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsU0FBUyxJQUFJLFdBQVcsQ0FBQTtTQUN6QjthQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUN6QixTQUFTLElBQUksYUFBYSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtTQUN6RDtRQUNELE9BQU8sU0FBUyxDQUFBO0lBQ2xCLENBQUM7SUFFRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNmLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO29CQUNsQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQTtpQkFDekI7YUFDRjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQTtnQkFDakIsVUFBVSxDQUFDLEdBQUcsRUFBRTtvQkFDZCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtnQkFDcEIsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFBO2FBQ1I7WUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFBO1NBQ3BCO0lBQ0gsQ0FBQzs7OEVBaERVLGVBQWU7b0RBQWYsZUFBZTs7UUNQNUIsOEJBQWtFO1FBQTdELHlGQUFTLFdBQU8sSUFBQztRQUNsQixrQkFBeUI7UUFDN0IsaUJBQU07O1FBRmlCLGlDQUF3QjtRQUFDLG1DQUFpQjs7dUZET3BELGVBQWU7Y0FMM0IsU0FBUztlQUFDO2dCQUNULFFBQVEsRUFBRSxZQUFZO2dCQUN0QixXQUFXLEVBQUUseUJBQXlCO2dCQUN0QyxTQUFTLEVBQUUsQ0FBRSx5QkFBeUIsQ0FBRTthQUN6QztnQkFFVSxJQUFJO2tCQUFaLEtBQUs7WUFDRyxNQUFNO2tCQUFkLEtBQUs7WUFDRyxLQUFLO2tCQUFiLEtBQUs7WUFDRyxLQUFLO2tCQUFiLEtBQUs7WUFDRyxNQUFNO2tCQUFkLEtBQUs7WUFDRyxXQUFXO2tCQUFuQixLQUFLO1lBQ0csU0FBUztrQkFBakIsS0FBSztZQUNHLFFBQVE7a0JBQWhCLEtBQUs7WUFDSSxPQUFPO2tCQUFoQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2VxbS1idXR0b24nLFxuICB0ZW1wbGF0ZVVybDogJy4vYnV0dG9uLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbICcuL2J1dHRvbi5jb21wb25lbnQuc2NzcycgXVxufSlcbmV4cG9ydCBjbGFzcyBCdXR0b25Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKSB0eXBlOiAnbGFyZ2UnIHwgJ25hcnJvdycgfCAnc3F1YXJlJyB8ICdjaXJjbGUnIHwgJ3RyYW5zcGFyZW50JyA9ICdsYXJnZSdcbiAgQElucHV0KCkgaGVpZ2h0ID0gbnVsbFxuICBASW5wdXQoKSB3aWR0aCA9IG51bGxcbiAgQElucHV0KCkgc3RhdGUgPSBmYWxzZVxuICBASW5wdXQoKSB0b2dnbGUgPSBmYWxzZVxuICBASW5wdXQoKSBkZXByZXNzYWJsZSA9IHRydWVcbiAgQElucHV0KCkgaG92ZXJhYmxlID0gdHJ1ZVxuICBASW5wdXQoKSBkaXNhYmxlZCA9IGZhbHNlXG4gIEBPdXRwdXQoKSBwcmVzc2VkID0gbmV3IEV2ZW50RW1pdHRlcigpXG5cbiAgbmdPbkluaXQgKCkge1xuICB9XG5cbiAgZ2V0IHN0eWxlICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgd2lkdGg6IGAke3RoaXMud2lkdGh9cHhgLFxuICAgICAgaGVpZ2h0OiBgJHt0aGlzLmhlaWdodH1weGBcbiAgICB9XG4gIH1cblxuICBjb21wdXRlQ2xhc3MgKCkge1xuICAgIGxldCBjbGFzc05hbWUgPSAnYnV0dG9uJ1xuICAgIGNsYXNzTmFtZSArPSBgICR7dGhpcy50eXBlfWBcbiAgICBjbGFzc05hbWUgKz0gYCAke3RoaXMudHlwZX1gXG4gICAgY2xhc3NOYW1lICs9IHRoaXMuc3RhdGUgPyAnIG9uJyA6ICcgb2ZmJ1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICBjbGFzc05hbWUgKz0gJyBkaXNhYmxlZCdcbiAgICB9IGVsc2UgaWYgKHRoaXMuaG92ZXJhYmxlKSB7XG4gICAgICBjbGFzc05hbWUgKz0gJyBob3ZlcmFibGUtJyArICh0aGlzLnN0YXRlID8gJ29uJyA6ICdvZmYnKVxuICAgIH1cbiAgICByZXR1cm4gY2xhc3NOYW1lXG4gIH1cblxuICBjbGljayAoKSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICBpZiAodGhpcy50b2dnbGUpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgJiYgdGhpcy5kZXByZXNzYWJsZSkge1xuICAgICAgICAgIHRoaXMuc3RhdGUgPSAhdGhpcy5zdGF0ZVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXRlID0gdHJ1ZVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnN0YXRlID0gZmFsc2VcbiAgICAgICAgfSwgMTAwKVxuICAgICAgfVxuICAgICAgdGhpcy5wcmVzc2VkLmVtaXQoKVxuICAgIH1cbiAgfVxufVxuIiwiPGRpdiAoY2xpY2spPVwiY2xpY2soKVwiIFtjbGFzc109XCJjb21wdXRlQ2xhc3MoKVwiIFtuZ1N0eWxlXT1cInN0eWxlXCI+XG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuPC9kaXY+Il19
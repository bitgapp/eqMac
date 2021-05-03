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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9nZ2xlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2NvbXBvbmVudHMvdG9nZ2xlL3RvZ2dsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQTtBQU85RSxNQUFNLE9BQU8sZUFBZTtJQUw1QjtRQU1XLFVBQUssR0FBRyxLQUFLLENBQUE7UUFDWixnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUE7SUFTNUMsQ0FBQztJQVBDLFFBQVE7SUFDUixDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFBO1FBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNuQyxDQUFDOzs7WUFmRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFlBQVk7Z0JBQ3RCLHNOQUFzQzs7YUFFdkM7OztvQkFFRSxLQUFLOzBCQUNMLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZXFtLXRvZ2dsZScsXG4gIHRlbXBsYXRlVXJsOiAnLi90b2dnbGUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsgJy4vdG9nZ2xlLmNvbXBvbmVudC5zY3NzJyBdXG59KVxuZXhwb3J0IGNsYXNzIFRvZ2dsZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpIHN0YXRlID0gZmFsc2VcbiAgQE91dHB1dCgpIHN0YXRlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpXG5cbiAgbmdPbkluaXQgKCkge1xuICB9XG5cbiAgdG9nZ2xlU3RhdGUgKCkge1xuICAgIHRoaXMuc3RhdGUgPSAhdGhpcy5zdGF0ZVxuICAgIHRoaXMuc3RhdGVDaGFuZ2UuZW1pdCh0aGlzLnN0YXRlKVxuICB9XG59XG4iXX0=
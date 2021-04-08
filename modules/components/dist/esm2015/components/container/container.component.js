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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9jb21wb25lbnRzL2NvbnRhaW5lci9jb250YWluZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsV0FBVyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQTtBQU9yRSxNQUFNLE9BQU8sa0JBQWtCO0lBTC9CO1FBTTBDLGFBQVEsR0FBRyxLQUFLLENBQUE7SUFJMUQsQ0FBQztJQUZDLFFBQVE7SUFDUixDQUFDOzs7WUFURixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLHVDQUF5Qzs7YUFFMUM7Ozt1QkFFRSxXQUFXLFNBQUMsZ0JBQWdCLGNBQUcsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBIb3N0QmluZGluZywgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdlcW0tY29udGFpbmVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2NvbnRhaW5lci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWyAnLi9jb250YWluZXIuY29tcG9uZW50LnNjc3MnIF1cbn0pXG5leHBvcnQgY2xhc3MgQ29udGFpbmVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5kaXNhYmxlZCcpIEBJbnB1dCgpIGRpc2FibGVkID0gZmFsc2VcblxuICBuZ09uSW5pdCAoKSB7XG4gIH1cbn1cbiJdfQ==
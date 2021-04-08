import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
export class ClickedOutsideDirective {
    constructor() {
        this.clickedOutside = new EventEmitter();
        this.inside = false;
    }
    insideClick() {
        this.inside = true;
    }
    outsideClick() {
        if (!this.inside) {
            this.clickedOutside.emit();
        }
        this.inside = false;
    }
}
ClickedOutsideDirective.decorators = [
    { type: Directive, args: [{ selector: '[clickedOutside]' },] }
];
ClickedOutsideDirective.propDecorators = {
    clickedOutside: [{ type: Output }],
    insideClick: [{ type: HostListener, args: ['click',] }],
    outsideClick: [{ type: HostListener, args: ['document:click',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpY2tlZC1vdXRzaWRlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9kaXJlY3RpdmVzL2NsaWNrZWQtb3V0c2lkZS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQTtBQUc3RSxNQUFNLE9BQU8sdUJBQXVCO0lBRHBDO1FBRVksbUJBQWMsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFBO1FBRXJDLFdBQU0sR0FBRyxLQUFLLENBQUE7SUFheEIsQ0FBQztJQVhDLFdBQVc7UUFDVCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtJQUNwQixDQUFDO0lBR0QsWUFBWTtRQUNWLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2hCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUE7U0FDM0I7UUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTtJQUNyQixDQUFDOzs7WUFoQkYsU0FBUyxTQUFDLEVBQUUsUUFBUSxFQUFFLGtCQUFrQixFQUFFOzs7NkJBRXhDLE1BQU07MEJBR04sWUFBWSxTQUFDLE9BQU87MkJBS3BCLFlBQVksU0FBQyxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyLCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbY2xpY2tlZE91dHNpZGVdJyB9KVxuZXhwb3J0IGNsYXNzIENsaWNrZWRPdXRzaWRlRGlyZWN0aXZlIHtcbiAgQE91dHB1dCgpIGNsaWNrZWRPdXRzaWRlID0gbmV3IEV2ZW50RW1pdHRlcigpXG5cbiAgcHJpdmF0ZSBpbnNpZGUgPSBmYWxzZVxuICBASG9zdExpc3RlbmVyKCdjbGljaycpXG4gIGluc2lkZUNsaWNrICgpIHtcbiAgICB0aGlzLmluc2lkZSA9IHRydWVcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OmNsaWNrJylcbiAgb3V0c2lkZUNsaWNrICgpIHtcbiAgICBpZiAoIXRoaXMuaW5zaWRlKSB7XG4gICAgICB0aGlzLmNsaWNrZWRPdXRzaWRlLmVtaXQoKVxuICAgIH1cbiAgICB0aGlzLmluc2lkZSA9IGZhbHNlXG4gIH1cbn1cbiJdfQ==
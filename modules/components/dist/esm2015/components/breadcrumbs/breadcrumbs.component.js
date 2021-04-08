import { Component, EventEmitter, Input, Output } from '@angular/core';
export class BreadcrumbsComponent {
    constructor() {
        this.underline = true;
        this.crumbClicked = new EventEmitter();
    }
    ngOnInit() {
    }
}
BreadcrumbsComponent.decorators = [
    { type: Component, args: [{
                selector: 'eqm-breadcrumbs',
                template: "<div class=\"row\">\n  <div *ngFor=\"let crumb of crumbs; index as i\" class=\"row\">\n    <eqm-icon class=\"crumb-part\" *ngIf=\"i !== 0\" name=\"triangle\" [rotate]=\"0\" [width]=\"8\" [height]=\"8\"></eqm-icon>\n    <eqm-label [class]=\"'crumb-part pointer' + (underline ? ' underline' : '')\" (click)=\"crumbClicked.emit({ crumb: crumb, index: i })\">{{crumb}}</eqm-label>\n  </div>\n</div>",
                styles: [".row{display:flex;flex-direction:row;align-items:center;justify-content:center}.crumb-part{margin-right:5px}.underline{text-decoration:underline}.pointer{cursor:pointer!important}"]
            },] }
];
BreadcrumbsComponent.propDecorators = {
    crumbs: [{ type: Input }],
    underline: [{ type: Input }],
    crumbClicked: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWRjcnVtYnMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2NvbXBvbmVudHMvYnJlYWRjcnVtYnMvYnJlYWRjcnVtYnMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUE7QUFPOUUsTUFBTSxPQUFPLG9CQUFvQjtJQUxqQztRQU9XLGNBQVMsR0FBRyxJQUFJLENBQUE7UUFDZixpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFvQyxDQUFBO0lBSS9FLENBQUM7SUFGQyxRQUFRO0lBQ1IsQ0FBQzs7O1lBWEYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLHNaQUEyQzs7YUFFNUM7OztxQkFFRSxLQUFLO3dCQUNMLEtBQUs7MkJBQ0wsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdlcW0tYnJlYWRjcnVtYnMnLFxuICB0ZW1wbGF0ZVVybDogJy4vYnJlYWRjcnVtYnMuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsgJy4vYnJlYWRjcnVtYnMuY29tcG9uZW50LnNjc3MnIF1cbn0pXG5leHBvcnQgY2xhc3MgQnJlYWRjcnVtYnNDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKSBjcnVtYnM6IHN0cmluZ1tdXG4gIEBJbnB1dCgpIHVuZGVybGluZSA9IHRydWVcbiAgQE91dHB1dCgpIGNydW1iQ2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXI8eyBjcnVtYjogc3RyaW5nLCBpbmRleDogbnVtYmVyIH0+KClcblxuICBuZ09uSW5pdCAoKTogdm9pZCB7XG4gIH1cbn1cbiJdfQ==
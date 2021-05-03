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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWRjcnVtYnMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvY29tcG9uZW50cy9icmVhZGNydW1icy9icmVhZGNydW1icy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQTtBQU85RSxNQUFNLE9BQU8sb0JBQW9CO0lBTGpDO1FBT1csY0FBUyxHQUFHLElBQUksQ0FBQTtRQUNmLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQW9DLENBQUE7SUFJL0UsQ0FBQztJQUZDLFFBQVE7SUFDUixDQUFDOzs7WUFYRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0Isc1pBQTJDOzthQUU1Qzs7O3FCQUVFLEtBQUs7d0JBQ0wsS0FBSzsyQkFDTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2VxbS1icmVhZGNydW1icycsXG4gIHRlbXBsYXRlVXJsOiAnLi9icmVhZGNydW1icy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWyAnLi9icmVhZGNydW1icy5jb21wb25lbnQuc2NzcycgXVxufSlcbmV4cG9ydCBjbGFzcyBCcmVhZGNydW1ic0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpIGNydW1iczogc3RyaW5nW11cbiAgQElucHV0KCkgdW5kZXJsaW5lID0gdHJ1ZVxuICBAT3V0cHV0KCkgY3J1bWJDbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcjx7IGNydW1iOiBzdHJpbmcsIGluZGV4OiBudW1iZXIgfT4oKVxuXG4gIG5nT25Jbml0ICgpOiB2b2lkIHtcbiAgfVxufVxuIl19
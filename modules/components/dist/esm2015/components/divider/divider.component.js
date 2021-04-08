import { Component, Input, ElementRef, HostBinding } from '@angular/core';
export class DividerComponent {
    constructor(elem) {
        this.elem = elem;
        this.orientation = 'horizontal';
    }
    get width() {
        return this.orientation === 'vertical' ? '1px' : `${this.elem.nativeElement.parentElement.offsetWidth}`;
    }
    get height() {
        return this.orientation === 'vertical' ? `${this.elem.nativeElement.parentElement.offsetHeight}` : '1px';
    }
    get leftBorder() {
        return this.orientation === 'vertical' ? '1px solid rgb(58, 59, 61)' : undefined;
    }
    get rightBorder() {
        return this.orientation === 'vertical' ? '1px solid rgb(96, 97, 101)' : undefined;
    }
    get topBorder() {
        return this.orientation === 'horizontal' ? '1px solid rgb(58, 59, 61)' : undefined;
    }
    get bottomtBorder() {
        return this.orientation === 'horizontal' ? '1px solid rgb(96, 97, 101)' : undefined;
    }
}
DividerComponent.decorators = [
    { type: Component, args: [{
                selector: 'eqm-divider',
                template: "",
                styles: [":host{display:block;overflow:hidden;background-color:#000}"]
            },] }
];
DividerComponent.ctorParameters = () => [
    { type: ElementRef }
];
DividerComponent.propDecorators = {
    orientation: [{ type: Input }],
    width: [{ type: HostBinding, args: ['style.width',] }],
    height: [{ type: HostBinding, args: ['style.height',] }],
    leftBorder: [{ type: HostBinding, args: ['style.border-left',] }],
    rightBorder: [{ type: HostBinding, args: ['style.border-right',] }],
    topBorder: [{ type: HostBinding, args: ['style.border-top',] }],
    bottomtBorder: [{ type: HostBinding, args: ['style.border-bottom',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGl2aWRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvY29tcG9uZW50cy9kaXZpZGVyL2RpdmlkZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUE7QUFPekUsTUFBTSxPQUFPLGdCQUFnQjtJQUczQixZQUNTLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7UUFIaEIsZ0JBQVcsR0FBOEIsWUFBWSxDQUFBO0lBSTNELENBQUM7SUFFSixJQUNJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxXQUFXLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxDQUFBO0lBQ3pHLENBQUM7SUFFRCxJQUNJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxXQUFXLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFBO0lBQzFHLENBQUM7SUFFRCxJQUNJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxXQUFXLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFBO0lBQ2xGLENBQUM7SUFFRCxJQUNJLFdBQVc7UUFDYixPQUFPLElBQUksQ0FBQyxXQUFXLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFBO0lBQ25GLENBQUM7SUFFRCxJQUNJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxXQUFXLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFBO0lBQ3BGLENBQUM7SUFFRCxJQUNJLGFBQWE7UUFDZixPQUFPLElBQUksQ0FBQyxXQUFXLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFBO0lBQ3JGLENBQUM7OztZQXhDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGFBQWE7Z0JBQ3ZCLFlBQXVDOzthQUV4Qzs7O1lBTjBCLFVBQVU7OzswQkFRbEMsS0FBSztvQkFNTCxXQUFXLFNBQUMsYUFBYTtxQkFLekIsV0FBVyxTQUFDLGNBQWM7eUJBSzFCLFdBQVcsU0FBQyxtQkFBbUI7MEJBSy9CLFdBQVcsU0FBQyxvQkFBb0I7d0JBS2hDLFdBQVcsU0FBQyxrQkFBa0I7NEJBSzlCLFdBQVcsU0FBQyxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBFbGVtZW50UmVmLCBIb3N0QmluZGluZyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2VxbS1kaXZpZGVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2RpdmlkZXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsgJy4vZGl2aWRlci5jb21wb25lbnQuc2NzcycgXVxufSlcbmV4cG9ydCBjbGFzcyBEaXZpZGVyQ29tcG9uZW50IHtcbiAgQElucHV0KCkgb3JpZW50YXRpb246ICd2ZXJ0aWNhbCcgfCAnaG9yaXpvbnRhbCcgPSAnaG9yaXpvbnRhbCdcblxuICBjb25zdHJ1Y3RvciAoXG4gICAgcHVibGljIGVsZW06IEVsZW1lbnRSZWZcbiAgKSB7fVxuXG4gIEBIb3N0QmluZGluZygnc3R5bGUud2lkdGgnKVxuICBnZXQgd2lkdGggKCkge1xuICAgIHJldHVybiB0aGlzLm9yaWVudGF0aW9uID09PSAndmVydGljYWwnID8gJzFweCcgOiBgJHt0aGlzLmVsZW0ubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRofWBcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnc3R5bGUuaGVpZ2h0JylcbiAgZ2V0IGhlaWdodCAoKSB7XG4gICAgcmV0dXJuIHRoaXMub3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcgPyBgJHt0aGlzLmVsZW0ubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodH1gIDogJzFweCdcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnc3R5bGUuYm9yZGVyLWxlZnQnKVxuICBnZXQgbGVmdEJvcmRlciAoKSB7XG4gICAgcmV0dXJuIHRoaXMub3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcgPyAnMXB4IHNvbGlkIHJnYig1OCwgNTksIDYxKScgOiB1bmRlZmluZWRcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnc3R5bGUuYm9yZGVyLXJpZ2h0JylcbiAgZ2V0IHJpZ2h0Qm9yZGVyICgpIHtcbiAgICByZXR1cm4gdGhpcy5vcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJyA/ICcxcHggc29saWQgcmdiKDk2LCA5NywgMTAxKScgOiB1bmRlZmluZWRcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnc3R5bGUuYm9yZGVyLXRvcCcpXG4gIGdldCB0b3BCb3JkZXIgKCkge1xuICAgIHJldHVybiB0aGlzLm9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcgPyAnMXB4IHNvbGlkIHJnYig1OCwgNTksIDYxKScgOiB1bmRlZmluZWRcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnc3R5bGUuYm9yZGVyLWJvdHRvbScpXG4gIGdldCBib3R0b210Qm9yZGVyICgpIHtcbiAgICByZXR1cm4gdGhpcy5vcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnID8gJzFweCBzb2xpZCByZ2IoOTYsIDk3LCAxMDEpJyA6IHVuZGVmaW5lZFxuICB9XG59XG4iXX0=
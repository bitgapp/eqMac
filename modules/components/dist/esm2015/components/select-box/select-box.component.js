import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
export class SelectBoxComponent {
    constructor(host) {
        this.host = host;
        this._items = [];
        this.labelParam = 'text';
        this.selectedItem = null;
        this.itemSelected = new EventEmitter();
        this._nVisibleItems = 6;
        this.height = 0;
        this.hidden = true;
        this.itemHeight = 25;
    }
    set items(newItems) {
        this._items = newItems;
        this.setHeight();
    }
    get items() {
        return this._items;
    }
    set numberOfVisibleItems(value) {
        if (!isNaN(parseInt(value.toString(), 10))) {
            this._nVisibleItems = value;
            this.setHeight();
        }
    }
    get numberOfVisibleItems() {
        return this._nVisibleItems;
    }
    ngOnInit() {
        this.setDimensions();
    }
    setDimensions() {
        this.setHeight();
        this.setWidth();
    }
    setHeight() {
        const lowest = Math.min(this._nVisibleItems, this.items.length);
        this.height = lowest * this.itemHeight + (this.numberOfVisibleItems < this.items.length ? this.itemHeight / 2 : 0);
        this.host.nativeElement.style.height = `${this.height}px`;
    }
    setWidth() {
        if (this.width) {
            this.host.nativeElement.style.height = `${this.height}px`;
        }
    }
    selectItem(item) {
        this.selectedItem = item;
        this.itemSelected.emit(item);
    }
}
SelectBoxComponent.decorators = [
    { type: Component, args: [{
                selector: 'eqm-select-box',
                template: "<eqm-container class=\"container\" #container>\n  <cdk-virtual-scroll-viewport [itemSize]=\"itemHeight\" [minBufferPx]=\"400\" [maxBufferPx]=\"800\" style=\"height: 100%; width: 100%\" >\n    <div *cdkVirtualFor=\"let item of items\" [class]=\"'item' + (item == selectedItem ? ' selected' : '')\" (click)=\"selectItem(item)\" [style.height.px]=\"itemHeight - 6\">\n      <eqm-icon *ngIf=\"item.icon\" [name]=\"item.icon\" class=\"icon\"></eqm-icon><eqm-label>{{item[labelParam]}}</eqm-label>\n    </div>\n  </cdk-virtual-scroll-viewport>\n</eqm-container>\n",
                styles: [":host{overflow-x:visible;border-radius:2px}.container{text-align:center;width:calc(100% - 2px);height:100%;overflow-y:scroll}.container .selected{border-color:#4f8d71!important}.container .item{padding:2px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;border:1px solid transparent;display:flex;flex-direction:row;align-items:center;justify-content:center}.container .item .icon{margin-right:10px;display:inline-block}.container .item:first-child{border-radius:3px 3px 0 0}.container .item:last-child{border-radius:0 0 3px 3px}.container .item:hover{border-color:#2a4c3d}"]
            },] }
];
SelectBoxComponent.ctorParameters = () => [
    { type: ElementRef }
];
SelectBoxComponent.propDecorators = {
    items: [{ type: Input }],
    labelParam: [{ type: Input }],
    selectedItem: [{ type: Input }],
    itemSelected: [{ type: Output }],
    container: [{ type: ViewChild, args: ['container', { read: ElementRef, static: true },] }],
    numberOfVisibleItems: [{ type: Input }],
    width: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LWJveC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvY29tcG9uZW50cy9zZWxlY3QtYm94L3NlbGVjdC1ib3guY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQTtBQU9yRyxNQUFNLE9BQU8sa0JBQWtCO0lBa0M3QixZQUFvQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO1FBakNwQyxXQUFNLEdBQVUsRUFBRSxDQUFBO1FBV1QsZUFBVSxHQUFHLE1BQU0sQ0FBQTtRQUNuQixpQkFBWSxHQUFHLElBQUksQ0FBQTtRQUNsQixpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUE7UUFFcEMsbUJBQWMsR0FBVyxDQUFDLENBQUE7UUFhakMsV0FBTSxHQUFHLENBQUMsQ0FBQTtRQUVWLFdBQU0sR0FBRyxJQUFJLENBQUE7UUFDYixlQUFVLEdBQUcsRUFBRSxDQUFBO0lBR2YsQ0FBQztJQWpDRCxJQUNJLEtBQUssQ0FBRSxRQUFlO1FBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFBO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQTtJQUNsQixDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFBO0lBQ3BCLENBQUM7SUFPRCxJQUNJLG9CQUFvQixDQUFFLEtBQWE7UUFDckMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUU7WUFDMUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUE7WUFDM0IsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO1NBQ2pCO0lBQ0gsQ0FBQztJQUVELElBQUksb0JBQW9CO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQTtJQUM1QixDQUFDO0lBVUQsUUFBUTtRQUNOLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtJQUN0QixDQUFDO0lBRU0sYUFBYTtRQUNsQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUE7UUFDaEIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFBO0lBQ2pCLENBQUM7SUFFTSxTQUFTO1FBQ2QsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDL0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xILElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUE7SUFDM0QsQ0FBQztJQUVNLFFBQVE7UUFDYixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFBO1NBQzFEO0lBQ0gsQ0FBQztJQUVELFVBQVUsQ0FBRSxJQUFTO1FBQ25CLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFBO1FBQ3hCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzlCLENBQUM7OztZQWxFRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIseWpCQUEwQzs7YUFFM0M7OztZQU5tRSxVQUFVOzs7b0JBUzNFLEtBQUs7eUJBVUwsS0FBSzsyQkFDTCxLQUFLOzJCQUNMLE1BQU07d0JBQ04sU0FBUyxTQUFDLFdBQVcsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTttQ0FFekQsS0FBSztvQkFhTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgVmlld0NoaWxkLCBFbGVtZW50UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZXFtLXNlbGVjdC1ib3gnLFxuICB0ZW1wbGF0ZVVybDogJy4vc2VsZWN0LWJveC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWyAnLi9zZWxlY3QtYm94LmNvbXBvbmVudC5zY3NzJyBdXG59KVxuZXhwb3J0IGNsYXNzIFNlbGVjdEJveENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIF9pdGVtczogYW55W10gPSBbXVxuICBASW5wdXQoKVxuICBzZXQgaXRlbXMgKG5ld0l0ZW1zOiBhbnlbXSkge1xuICAgIHRoaXMuX2l0ZW1zID0gbmV3SXRlbXNcbiAgICB0aGlzLnNldEhlaWdodCgpXG4gIH1cblxuICBnZXQgaXRlbXMgKCkge1xuICAgIHJldHVybiB0aGlzLl9pdGVtc1xuICB9XG5cbiAgQElucHV0KCkgbGFiZWxQYXJhbSA9ICd0ZXh0J1xuICBASW5wdXQoKSBzZWxlY3RlZEl0ZW0gPSBudWxsXG4gIEBPdXRwdXQoKSBpdGVtU2VsZWN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyKClcbiAgQFZpZXdDaGlsZCgnY29udGFpbmVyJywgeyByZWFkOiBFbGVtZW50UmVmLCBzdGF0aWM6IHRydWUgfSkgY29udGFpbmVyITogRWxlbWVudFJlZlxuICBwdWJsaWMgX25WaXNpYmxlSXRlbXM6IG51bWJlciA9IDZcbiAgQElucHV0KClcbiAgc2V0IG51bWJlck9mVmlzaWJsZUl0ZW1zICh2YWx1ZTogbnVtYmVyKSB7XG4gICAgaWYgKCFpc05hTihwYXJzZUludCh2YWx1ZS50b1N0cmluZygpLCAxMCkpKSB7XG4gICAgICB0aGlzLl9uVmlzaWJsZUl0ZW1zID0gdmFsdWVcbiAgICAgIHRoaXMuc2V0SGVpZ2h0KClcbiAgICB9XG4gIH1cblxuICBnZXQgbnVtYmVyT2ZWaXNpYmxlSXRlbXMgKCkge1xuICAgIHJldHVybiB0aGlzLl9uVmlzaWJsZUl0ZW1zXG4gIH1cblxuICBoZWlnaHQgPSAwXG4gIEBJbnB1dCgpIHdpZHRoPzogbnVtYmVyXG4gIGhpZGRlbiA9IHRydWVcbiAgaXRlbUhlaWdodCA9IDI1XG5cbiAgY29uc3RydWN0b3IgKHB1YmxpYyBob3N0OiBFbGVtZW50UmVmKSB7XG4gIH1cblxuICBuZ09uSW5pdCAoKSB7XG4gICAgdGhpcy5zZXREaW1lbnNpb25zKClcbiAgfVxuXG4gIHB1YmxpYyBzZXREaW1lbnNpb25zICgpIHtcbiAgICB0aGlzLnNldEhlaWdodCgpXG4gICAgdGhpcy5zZXRXaWR0aCgpXG4gIH1cblxuICBwdWJsaWMgc2V0SGVpZ2h0ICgpIHtcbiAgICBjb25zdCBsb3dlc3QgPSBNYXRoLm1pbih0aGlzLl9uVmlzaWJsZUl0ZW1zLCB0aGlzLml0ZW1zLmxlbmd0aClcbiAgICB0aGlzLmhlaWdodCA9IGxvd2VzdCAqIHRoaXMuaXRlbUhlaWdodCArICh0aGlzLm51bWJlck9mVmlzaWJsZUl0ZW1zIDwgdGhpcy5pdGVtcy5sZW5ndGggPyB0aGlzLml0ZW1IZWlnaHQgLyAyIDogMClcbiAgICB0aGlzLmhvc3QubmF0aXZlRWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLmhlaWdodH1weGBcbiAgfVxuXG4gIHB1YmxpYyBzZXRXaWR0aCAoKSB7XG4gICAgaWYgKHRoaXMud2lkdGgpIHtcbiAgICAgIHRoaXMuaG9zdC5uYXRpdmVFbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke3RoaXMuaGVpZ2h0fXB4YFxuICAgIH1cbiAgfVxuXG4gIHNlbGVjdEl0ZW0gKGl0ZW06IGFueSkge1xuICAgIHRoaXMuc2VsZWN0ZWRJdGVtID0gaXRlbVxuICAgIHRoaXMuaXRlbVNlbGVjdGVkLmVtaXQoaXRlbSlcbiAgfVxufVxuIl19
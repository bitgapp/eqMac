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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LWJveC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL3NlbGVjdC1ib3gvc2VsZWN0LWJveC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFBO0FBT3JHLE1BQU0sT0FBTyxrQkFBa0I7SUFrQzdCLFlBQW9CLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7UUFqQ3BDLFdBQU0sR0FBVSxFQUFFLENBQUE7UUFXVCxlQUFVLEdBQUcsTUFBTSxDQUFBO1FBQ25CLGlCQUFZLEdBQUcsSUFBSSxDQUFBO1FBQ2xCLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQTtRQUVwQyxtQkFBYyxHQUFXLENBQUMsQ0FBQTtRQWFqQyxXQUFNLEdBQUcsQ0FBQyxDQUFBO1FBRVYsV0FBTSxHQUFHLElBQUksQ0FBQTtRQUNiLGVBQVUsR0FBRyxFQUFFLENBQUE7SUFHZixDQUFDO0lBakNELElBQ0ksS0FBSyxDQUFFLFFBQWU7UUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUE7UUFDdEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO0lBQ2xCLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUE7SUFDcEIsQ0FBQztJQU9ELElBQ0ksb0JBQW9CLENBQUUsS0FBYTtRQUNyQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRTtZQUMxQyxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQTtZQUMzQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUE7U0FDakI7SUFDSCxDQUFDO0lBRUQsSUFBSSxvQkFBb0I7UUFDdEIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFBO0lBQzVCLENBQUM7SUFVRCxRQUFRO1FBQ04sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBO0lBQ3RCLENBQUM7SUFFTSxhQUFhO1FBQ2xCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQTtRQUNoQixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7SUFDakIsQ0FBQztJQUVNLFNBQVM7UUFDZCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUMvRCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbEgsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQTtJQUMzRCxDQUFDO0lBRU0sUUFBUTtRQUNiLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUE7U0FDMUQ7SUFDSCxDQUFDO0lBRUQsVUFBVSxDQUFFLElBQVM7UUFDbkIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUE7UUFDeEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDOUIsQ0FBQzs7O1lBbEVGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQix5akJBQTBDOzthQUUzQzs7O1lBTm1FLFVBQVU7OztvQkFTM0UsS0FBSzt5QkFVTCxLQUFLOzJCQUNMLEtBQUs7MkJBQ0wsTUFBTTt3QkFDTixTQUFTLFNBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO21DQUV6RCxLQUFLO29CQWFMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdlcW0tc2VsZWN0LWJveCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9zZWxlY3QtYm94LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbICcuL3NlbGVjdC1ib3guY29tcG9uZW50LnNjc3MnIF1cbn0pXG5leHBvcnQgY2xhc3MgU2VsZWN0Qm94Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgX2l0ZW1zOiBhbnlbXSA9IFtdXG4gIEBJbnB1dCgpXG4gIHNldCBpdGVtcyAobmV3SXRlbXM6IGFueVtdKSB7XG4gICAgdGhpcy5faXRlbXMgPSBuZXdJdGVtc1xuICAgIHRoaXMuc2V0SGVpZ2h0KClcbiAgfVxuXG4gIGdldCBpdGVtcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2l0ZW1zXG4gIH1cblxuICBASW5wdXQoKSBsYWJlbFBhcmFtID0gJ3RleHQnXG4gIEBJbnB1dCgpIHNlbGVjdGVkSXRlbSA9IG51bGxcbiAgQE91dHB1dCgpIGl0ZW1TZWxlY3RlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKVxuICBAVmlld0NoaWxkKCdjb250YWluZXInLCB7IHJlYWQ6IEVsZW1lbnRSZWYsIHN0YXRpYzogdHJ1ZSB9KSBjb250YWluZXIhOiBFbGVtZW50UmVmXG4gIHB1YmxpYyBfblZpc2libGVJdGVtczogbnVtYmVyID0gNlxuICBASW5wdXQoKVxuICBzZXQgbnVtYmVyT2ZWaXNpYmxlSXRlbXMgKHZhbHVlOiBudW1iZXIpIHtcbiAgICBpZiAoIWlzTmFOKHBhcnNlSW50KHZhbHVlLnRvU3RyaW5nKCksIDEwKSkpIHtcbiAgICAgIHRoaXMuX25WaXNpYmxlSXRlbXMgPSB2YWx1ZVxuICAgICAgdGhpcy5zZXRIZWlnaHQoKVxuICAgIH1cbiAgfVxuXG4gIGdldCBudW1iZXJPZlZpc2libGVJdGVtcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX25WaXNpYmxlSXRlbXNcbiAgfVxuXG4gIGhlaWdodCA9IDBcbiAgQElucHV0KCkgd2lkdGg/OiBudW1iZXJcbiAgaGlkZGVuID0gdHJ1ZVxuICBpdGVtSGVpZ2h0ID0gMjVcblxuICBjb25zdHJ1Y3RvciAocHVibGljIGhvc3Q6IEVsZW1lbnRSZWYpIHtcbiAgfVxuXG4gIG5nT25Jbml0ICgpIHtcbiAgICB0aGlzLnNldERpbWVuc2lvbnMoKVxuICB9XG5cbiAgcHVibGljIHNldERpbWVuc2lvbnMgKCkge1xuICAgIHRoaXMuc2V0SGVpZ2h0KClcbiAgICB0aGlzLnNldFdpZHRoKClcbiAgfVxuXG4gIHB1YmxpYyBzZXRIZWlnaHQgKCkge1xuICAgIGNvbnN0IGxvd2VzdCA9IE1hdGgubWluKHRoaXMuX25WaXNpYmxlSXRlbXMsIHRoaXMuaXRlbXMubGVuZ3RoKVxuICAgIHRoaXMuaGVpZ2h0ID0gbG93ZXN0ICogdGhpcy5pdGVtSGVpZ2h0ICsgKHRoaXMubnVtYmVyT2ZWaXNpYmxlSXRlbXMgPCB0aGlzLml0ZW1zLmxlbmd0aCA/IHRoaXMuaXRlbUhlaWdodCAvIDIgOiAwKVxuICAgIHRoaXMuaG9zdC5uYXRpdmVFbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke3RoaXMuaGVpZ2h0fXB4YFxuICB9XG5cbiAgcHVibGljIHNldFdpZHRoICgpIHtcbiAgICBpZiAodGhpcy53aWR0aCkge1xuICAgICAgdGhpcy5ob3N0Lm5hdGl2ZUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5oZWlnaHR9cHhgXG4gICAgfVxuICB9XG5cbiAgc2VsZWN0SXRlbSAoaXRlbTogYW55KSB7XG4gICAgdGhpcy5zZWxlY3RlZEl0ZW0gPSBpdGVtXG4gICAgdGhpcy5pdGVtU2VsZWN0ZWQuZW1pdChpdGVtKVxuICB9XG59XG4iXX0=
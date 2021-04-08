import { __awaiter } from "tslib";
import { Component, Input, ViewChild, ElementRef, EventEmitter, Output, NgZone, HostBinding, HostListener } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';
import { FadeInOutAnimation } from '../../animations';
export class DropdownComponent {
    constructor(utils, zone, ref) {
        this.utils = utils;
        this.zone = zone;
        this.ref = ref;
        this._items = [];
        this.editable = false;
        this.refChanged = new EventEmitter();
        this.disabled = false;
        this.selectedItem = null;
        this.selectedItemChange = new EventEmitter();
        this.labelParam = 'text';
        this.numberOfVisibleItems = 6;
        this.placeholder = 'Select item';
        this.noItemsPlaceholder = 'No items';
        this.closeOnSelect = true;
        this.searchable = true;
        this.itemSelected = new EventEmitter();
        this.shown = false;
        this.yCoordinate = 0;
        this.direction = 'down';
        this.padding = 5;
    }
    get items() {
        return this._items;
    }
    set items(newItems) {
        if (!newItems || !Array.isArray(newItems))
            return;
        this.searchText = undefined;
        this._items = newItems;
    }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.items)
                this.items = [];
            this.setDimensions();
            this.calculateYCoordinate();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for (const _ of [...Array(3)]) {
                yield this.utils.delay(100);
                this.calculateYCoordinate();
            }
            this.refChanged.emit(this);
        });
    }
    setDimensions() {
        const inputEl = this.container.nativeElement;
        const boxEl = this.box.nativeElement;
        const inputWidth = inputEl.offsetWidth;
        boxEl.style.width = `${inputWidth}px`;
    }
    calculateYCoordinate() {
        var _a;
        const body = document.body;
        const html = document.documentElement;
        const viewHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const preferredDirection = 'down';
        this.direction = preferredDirection;
        const inputEl = this.container.nativeElement;
        const inputHeight = parseInt(inputEl.offsetHeight);
        const inputPosition = inputEl.getBoundingClientRect();
        const boxHeight = this.boxComponent.height;
        const downY = parseInt(inputPosition.y) + inputHeight + this.padding / 2;
        const downSpaceLeft = viewHeight - (downY + boxHeight);
        const upY = inputPosition.top - boxHeight - this.padding;
        const upSpaceLeft = upY;
        this.direction = (_a = this.forceDirection) !== null && _a !== void 0 ? _a : (downSpaceLeft > upSpaceLeft ? 'down' : 'up');
        const y = this.direction === 'down' ? downY : upY;
        this.yCoordinate = y;
    }
    toggle(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.stopPropagation();
            if (this.shown) {
                this.close();
            }
            else {
                this.open();
            }
        });
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.disabled && !this.shown && this.items.length) {
                this.calculateYCoordinate();
                this.setDimensions();
                this.shown = true;
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.disabled && this.shown) {
                this.shown = false;
                this.searchText = undefined;
            }
        });
    }
    selectItem(item) {
        this.selectedItem = item;
        this.selectedItemChange.emit(item);
        this.itemSelected.emit(item);
        if (this.closeOnSelect) {
            this.close();
        }
    }
    keypress(event) {
        var _a, _b;
        if (!this.disabled && this.shown && this.searchable) {
            switch (event.key) {
                case 'Backspace': {
                    if ((_a = this.searchText) === null || _a === void 0 ? void 0 : _a.length) {
                        this.searchText = this.searchText.slice(0, this.searchText.length - 1);
                    }
                    break;
                }
                case 'Escape': {
                    this.close();
                    break;
                }
                case 'Enter': {
                    break;
                }
                default: {
                    if (/^[+a-zA-Z0-9_.-\s]$/.test(event.key)) {
                        this.searchText = ((_b = this.searchText) !== null && _b !== void 0 ? _b : '') + event.key;
                    }
                }
            }
        }
    }
    get filteredItems() {
        if (this.searchable && this.searchText) {
            return this.items.filter(item => { var _a; return item[this.labelParam].toLowerCase().includes((_a = this.searchText) === null || _a === void 0 ? void 0 : _a.toLowerCase()); });
        }
        else {
            return this.items;
        }
    }
}
DropdownComponent.decorators = [
    { type: Component, args: [{
                selector: 'eqm-dropdown',
                template: "<eqm-container #container [disabled]=\"disabled\" (click)=\"editable ? undefined : toggle($event)\"\n  class=\"container\">\n  <div class=\"item\">\n\n    <eqm-icon *ngIf=\"selectedItem && selectedItem.icon\" [name]=\"selectedItem.icon\" class=\"icon\" color=\"#4f8d71\"></eqm-icon>\n    <eqm-label color=\"#4f8d71\"> {{(searchText || (items.length ? (selectedItem ? selectedItem[labelParam] : placeholder) : noItemsPlaceholder))}} </eqm-label>\n  </div>\n\n  <div class=\"right\" *ngIf=\"searchText\" (click)=\"searchText = undefined\">\n    <eqm-icon [name]=\"'cross'\" [height]=\"16\" [width]=\"16\" color=\"#4f8d71\"></eqm-icon>\n  </div>\n  <div class=\"right\" *ngIf=\"!searchText\" (click)=\"editable ? toggle($event) : undefined\">\n    <eqm-icon [name]=\"'triangle'\" [height]=\"8\" [width]=\"8\" [color]=\"items.length ? '#4f8d71' : '#555'\" [rotate]=\"-90\">\n    </eqm-icon>\n    <eqm-icon [name]=\"'triangle'\" [height]=\"8\" [width]=\"8\" [color]=\"items.length ? '#4f8d71' : '#555'\" [rotate]=\"90\">\n    </eqm-icon>\n  </div>\n</eqm-container>\n<eqm-select-box [numberOfVisibleItems]=\"numberOfVisibleItems\" (clickedOutside)=\"close()\" #box [hidden]=\"!shown || (filteredItems.length === 0)\"\n  [class]=\"'items-select-box' + (direction === 'down' ? ' down' : ' up')\" [items]=\"filteredItems\" [labelParam]=\"labelParam\"\n  [selectedItem]=\"selectedItem\" (itemSelected)=\"selectItem($event)\" [style.top.px]=\"yCoordinate\"></eqm-select-box>",
                animations: [FadeInOutAnimation],
                styles: [":host{display:block;width:100%;transition:filter;transition-duration:.5s}.container{z-index:3;width:100%;height:100%;flex-direction:row;justify-content:center;align-items:center;position:relative;transform:translateX(-2px)}.container,.right{display:inline-flex}.right{width:20px;flex-direction:column;text-align:center;position:absolute;right:0;top:calc(50% - 16px/2)}.items-select-box{position:fixed;z-index:999;box-shadow:0 8px 77px 2px rgba(0,0,0,.56)}.down{transform-origin:top center}.up{transform-origin:bottom center}:host.disabled{filter:grayscale(80%)}.item{margin:4px;display:inline-flex;flex-direction:row;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.item .icon{margin-right:10px;display:inline-block}"]
            },] }
];
DropdownComponent.ctorParameters = () => [
    { type: UtilitiesService },
    { type: NgZone },
    { type: ElementRef }
];
DropdownComponent.propDecorators = {
    editable: [{ type: Input }],
    items: [{ type: Input }],
    refChanged: [{ type: Output }],
    disabled: [{ type: HostBinding, args: ['class.disabled',] }, { type: Input }],
    selectedItem: [{ type: Input }],
    selectedItemChange: [{ type: Output }],
    labelParam: [{ type: Input }],
    numberOfVisibleItems: [{ type: Input }],
    placeholder: [{ type: Input }],
    noItemsPlaceholder: [{ type: Input }],
    closeOnSelect: [{ type: Input }],
    searchable: [{ type: Input }],
    itemSelected: [{ type: Output }],
    container: [{ type: ViewChild, args: ['container', { read: ElementRef, static: true },] }],
    box: [{ type: ViewChild, args: ['box', { read: ElementRef, static: true },] }],
    boxComponent: [{ type: ViewChild, args: ['box', { static: true },] }],
    forceDirection: [{ type: Input }],
    keypress: [{ type: HostListener, args: ['document:keypress', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2NvbXBvbmVudHMvZHJvcGRvd24vZHJvcGRvd24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUE7QUFFeEksT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sa0NBQWtDLENBQUE7QUFDbkUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sa0JBQWtCLENBQUE7QUFRckQsTUFBTSxPQUFPLGlCQUFpQjtJQUM1QixZQUNTLEtBQXVCLEVBQ3ZCLElBQVksRUFDWixHQUFlO1FBRmYsVUFBSyxHQUFMLEtBQUssQ0FBa0I7UUFDdkIsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUNaLFFBQUcsR0FBSCxHQUFHLENBQVk7UUFJakIsV0FBTSxHQUFVLEVBQUUsQ0FBQTtRQUNoQixhQUFRLEdBQUcsS0FBSyxDQUFBO1FBWWYsZUFBVSxHQUFHLElBQUksWUFBWSxFQUFxQixDQUFBO1FBQ3BCLGFBQVEsR0FBRyxLQUFLLENBQUE7UUFDL0MsaUJBQVksR0FBRyxJQUFJLENBQUE7UUFDbEIsdUJBQWtCLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQTtRQUM3QyxlQUFVLEdBQUcsTUFBTSxDQUFBO1FBQ25CLHlCQUFvQixHQUFHLENBQUMsQ0FBQTtRQUN4QixnQkFBVyxHQUFHLGFBQWEsQ0FBQTtRQUMzQix1QkFBa0IsR0FBRyxVQUFVLENBQUE7UUFDL0Isa0JBQWEsR0FBRyxJQUFJLENBQUE7UUFDcEIsZUFBVSxHQUFHLElBQUksQ0FBQTtRQUNoQixpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUE7UUFL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LFdBQVcsRUFBRSxDQUFDLFFBQVEsT0FBQyxJQUFJLENBQUMsVUFBVSwwQ0FBRSxXQUFXLEdBQUcsQ0FBQSxFQUFBLENBQUMsQ0FBQTtTQUMvRzthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBO1NBQ2xCO0lBQ0gsQ0FBQzs7O1lBaktGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsbzhDQUF3QztnQkFFeEMsVUFBVSxFQUFFLENBQUUsa0JBQWtCLENBQUU7O2FBQ25DOzs7WUFSUSxnQkFBZ0I7WUFGdUQsTUFBTTtZQUF4QyxVQUFVOzs7dUJBb0JyRCxLQUFLO29CQUNMLEtBQUs7eUJBV0wsTUFBTTt1QkFDTixXQUFXLFNBQUMsZ0JBQWdCLGNBQUcsS0FBSzsyQkFDcEMsS0FBSztpQ0FDTCxNQUFNO3lCQUNOLEtBQUs7bUNBQ0wsS0FBSzswQkFDTCxLQUFLO2lDQUNMLEtBQUs7NEJBQ0wsS0FBSzt5QkFDTCxLQUFLOzJCQUNMLE1BQU07d0JBRU4sU0FBUyxTQUFDLFdBQVcsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtrQkFDekQsU0FBUyxTQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTsyQkFDbkQsU0FBUyxTQUFDLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7NkJBR2pDLEtBQUs7dUJBcUZMLFlBQVksU0FBQyxtQkFBbUIsRUFBRSxDQUFFLFFBQVEsQ0FBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgVmlld0NoaWxkLCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE91dHB1dCwgTmdab25lLCBIb3N0QmluZGluZywgSG9zdExpc3RlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7IFNlbGVjdEJveENvbXBvbmVudCB9IGZyb20gJy4uL3NlbGVjdC1ib3gvc2VsZWN0LWJveC5jb21wb25lbnQnXG5pbXBvcnQgeyBVdGlsaXRpZXNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvdXRpbGl0aWVzLnNlcnZpY2UnXG5pbXBvcnQgeyBGYWRlSW5PdXRBbmltYXRpb24gfSBmcm9tICcuLi8uLi9hbmltYXRpb25zJ1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdlcW0tZHJvcGRvd24nLFxuICB0ZW1wbGF0ZVVybDogJy4vZHJvcGRvd24uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsgJy4vZHJvcGRvd24uY29tcG9uZW50LnNjc3MnIF0sXG4gIGFuaW1hdGlvbnM6IFsgRmFkZUluT3V0QW5pbWF0aW9uIF1cbn0pXG5leHBvcnQgY2xhc3MgRHJvcGRvd25Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBjb25zdHJ1Y3RvciAoXG4gICAgcHVibGljIHV0aWxzOiBVdGlsaXRpZXNTZXJ2aWNlLFxuICAgIHB1YmxpYyB6b25lOiBOZ1pvbmUsXG4gICAgcHVibGljIHJlZjogRWxlbWVudFJlZlxuICApIHtcbiAgfVxuXG4gIHB1YmxpYyBfaXRlbXM6IGFueVtdID0gW11cbiAgQElucHV0KCkgZWRpdGFibGUgPSBmYWxzZVxuICBASW5wdXQoKVxuICBnZXQgaXRlbXMgKCkge1xuICAgIHJldHVybiB0aGlzLl9pdGVtc1xuICB9XG5cbiAgc2V0IGl0ZW1zIChuZXdJdGVtcykge1xuICAgIGlmICghbmV3SXRlbXMgfHwgIUFycmF5LmlzQXJyYXkobmV3SXRlbXMpKSByZXR1cm5cbiAgICB0aGlzLnNlYXJjaFRleHQgPSB1bmRlZmluZWRcbiAgICB0aGlzLl9pdGVtcyA9IG5ld0l0ZW1zXG4gIH1cblxuICBAT3V0cHV0KCkgcmVmQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8RHJvcGRvd25Db21wb25lbnQ+KClcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5kaXNhYmxlZCcpIEBJbnB1dCgpIGRpc2FibGVkID0gZmFsc2VcbiAgQElucHV0KCkgc2VsZWN0ZWRJdGVtID0gbnVsbFxuICBAT3V0cHV0KCkgc2VsZWN0ZWRJdGVtQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KClcbiAgQElucHV0KCkgbGFiZWxQYXJhbSA9ICd0ZXh0J1xuICBASW5wdXQoKSBudW1iZXJPZlZpc2libGVJdGVtcyA9IDZcbiAgQElucHV0KCkgcGxhY2Vob2xkZXIgPSAnU2VsZWN0IGl0ZW0nXG4gIEBJbnB1dCgpIG5vSXRlbXNQbGFjZWhvbGRlciA9ICdObyBpdGVtcydcbiAgQElucHV0KCkgY2xvc2VPblNlbGVjdCA9IHRydWVcbiAgQElucHV0KCkgc2VhcmNoYWJsZSA9IHRydWVcbiAgQE91dHB1dCgpIGl0ZW1TZWxlY3RlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKVxuXG4gIEBWaWV3Q2hpbGQoJ2NvbnRhaW5lcicsIHsgcmVhZDogRWxlbWVudFJlZiwgc3RhdGljOiB0cnVlIH0pIGNvbnRhaW5lciE6IEVsZW1lbnRSZWZcbiAgQFZpZXdDaGlsZCgnYm94JywgeyByZWFkOiBFbGVtZW50UmVmLCBzdGF0aWM6IHRydWUgfSkgYm94ITogRWxlbWVudFJlZlxuICBAVmlld0NoaWxkKCdib3gnLCB7IHN0YXRpYzogdHJ1ZSB9KSBib3hDb21wb25lbnQhOiBTZWxlY3RCb3hDb21wb25lbnRcbiAgc2hvd24gPSBmYWxzZVxuICB5Q29vcmRpbmF0ZSA9IDBcbiAgQElucHV0KCkgZm9yY2VEaXJlY3Rpb24/OiAnZG93bicgfCAndXAnXG4gIGRpcmVjdGlvbjogJ2Rvd24nIHwgJ3VwJyA9ICdkb3duJ1xuXG4gIHB1YmxpYyBwYWRkaW5nID0gNVxuXG4gIGFzeW5jIG5nT25Jbml0ICgpIHtcbiAgICBpZiAoIXRoaXMuaXRlbXMpIHRoaXMuaXRlbXMgPSBbXVxuICAgIHRoaXMuc2V0RGltZW5zaW9ucygpXG4gICAgdGhpcy5jYWxjdWxhdGVZQ29vcmRpbmF0ZSgpXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuICAgIGZvciAoY29uc3QgXyBvZiBbIC4uLkFycmF5KDMpIF0pIHtcbiAgICAgIGF3YWl0IHRoaXMudXRpbHMuZGVsYXkoMTAwKVxuICAgICAgdGhpcy5jYWxjdWxhdGVZQ29vcmRpbmF0ZSgpXG4gICAgfVxuICAgIHRoaXMucmVmQ2hhbmdlZC5lbWl0KHRoaXMpXG4gIH1cblxuICBzZXREaW1lbnNpb25zICgpIHtcbiAgICBjb25zdCBpbnB1dEVsID0gdGhpcy5jb250YWluZXIubmF0aXZlRWxlbWVudFxuICAgIGNvbnN0IGJveEVsID0gdGhpcy5ib3gubmF0aXZlRWxlbWVudFxuXG4gICAgY29uc3QgaW5wdXRXaWR0aCA9IGlucHV0RWwub2Zmc2V0V2lkdGhcblxuICAgIGJveEVsLnN0eWxlLndpZHRoID0gYCR7aW5wdXRXaWR0aH1weGBcbiAgfVxuXG4gIGNhbGN1bGF0ZVlDb29yZGluYXRlICgpIHtcbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuYm9keVxuICAgIGNvbnN0IGh0bWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcbiAgICBjb25zdCB2aWV3SGVpZ2h0ID0gTWF0aC5tYXgoYm9keS5zY3JvbGxIZWlnaHQsIGJvZHkub2Zmc2V0SGVpZ2h0LCBodG1sLmNsaWVudEhlaWdodCwgaHRtbC5zY3JvbGxIZWlnaHQsIGh0bWwub2Zmc2V0SGVpZ2h0KVxuICAgIGNvbnN0IHByZWZlcnJlZERpcmVjdGlvbiA9ICdkb3duJ1xuICAgIHRoaXMuZGlyZWN0aW9uID0gcHJlZmVycmVkRGlyZWN0aW9uXG4gICAgY29uc3QgaW5wdXRFbCA9IHRoaXMuY29udGFpbmVyLm5hdGl2ZUVsZW1lbnRcblxuICAgIGNvbnN0IGlucHV0SGVpZ2h0ID0gcGFyc2VJbnQoaW5wdXRFbC5vZmZzZXRIZWlnaHQpXG4gICAgY29uc3QgaW5wdXRQb3NpdGlvbiA9IGlucHV0RWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgIGNvbnN0IGJveEhlaWdodCA9IHRoaXMuYm94Q29tcG9uZW50LmhlaWdodFxuXG4gICAgY29uc3QgZG93blkgPSBwYXJzZUludChpbnB1dFBvc2l0aW9uLnkpICsgaW5wdXRIZWlnaHQgKyB0aGlzLnBhZGRpbmcgLyAyXG4gICAgY29uc3QgZG93blNwYWNlTGVmdCA9IHZpZXdIZWlnaHQgLSAoZG93blkgKyBib3hIZWlnaHQpXG5cbiAgICBjb25zdCB1cFkgPSBpbnB1dFBvc2l0aW9uLnRvcCAtIGJveEhlaWdodCAtIHRoaXMucGFkZGluZ1xuICAgIGNvbnN0IHVwU3BhY2VMZWZ0ID0gdXBZXG5cbiAgICB0aGlzLmRpcmVjdGlvbiA9IHRoaXMuZm9yY2VEaXJlY3Rpb24gPz8gKGRvd25TcGFjZUxlZnQgPiB1cFNwYWNlTGVmdCA/ICdkb3duJyA6ICd1cCcpXG4gICAgY29uc3QgeSA9IHRoaXMuZGlyZWN0aW9uID09PSAnZG93bicgPyBkb3duWSA6IHVwWVxuXG4gICAgdGhpcy55Q29vcmRpbmF0ZSA9IHlcbiAgfVxuXG4gIGFzeW5jIHRvZ2dsZSAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIGlmICh0aGlzLnNob3duKSB7XG4gICAgICB0aGlzLmNsb3NlKClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vcGVuKClcbiAgICB9XG4gIH1cblxuICBhc3luYyBvcGVuICgpIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgIXRoaXMuc2hvd24gJiYgdGhpcy5pdGVtcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuY2FsY3VsYXRlWUNvb3JkaW5hdGUoKVxuICAgICAgdGhpcy5zZXREaW1lbnNpb25zKClcbiAgICAgIHRoaXMuc2hvd24gPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgY2xvc2UgKCkge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCAmJiB0aGlzLnNob3duKSB7XG4gICAgICB0aGlzLnNob3duID0gZmFsc2VcbiAgICAgIHRoaXMuc2VhcmNoVGV4dCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfVxuXG4gIHNlbGVjdEl0ZW0gKGl0ZW06IGFueSkge1xuICAgIHRoaXMuc2VsZWN0ZWRJdGVtID0gaXRlbVxuICAgIHRoaXMuc2VsZWN0ZWRJdGVtQ2hhbmdlLmVtaXQoaXRlbSlcbiAgICB0aGlzLml0ZW1TZWxlY3RlZC5lbWl0KGl0ZW0pXG4gICAgaWYgKHRoaXMuY2xvc2VPblNlbGVjdCkge1xuICAgICAgdGhpcy5jbG9zZSgpXG4gICAgfVxuICB9XG5cbiAgc2VhcmNoVGV4dD86IHN0cmluZ1xuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDprZXlwcmVzcycsIFsgJyRldmVudCcgXSlcbiAga2V5cHJlc3MgKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkICYmIHRoaXMuc2hvd24gJiYgdGhpcy5zZWFyY2hhYmxlKSB7XG4gICAgICBzd2l0Y2ggKGV2ZW50LmtleSkge1xuICAgICAgICBjYXNlICdCYWNrc3BhY2UnOiB7XG4gICAgICAgICAgaWYgKHRoaXMuc2VhcmNoVGV4dD8ubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnNlYXJjaFRleHQgPSB0aGlzLnNlYXJjaFRleHQuc2xpY2UoMCwgdGhpcy5zZWFyY2hUZXh0Lmxlbmd0aCAtIDEpXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAnRXNjYXBlJzoge1xuICAgICAgICAgIHRoaXMuY2xvc2UoKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAnRW50ZXInOiB7XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgaWYgKC9eWythLXpBLVowLTlfLi1cXHNdJC8udGVzdChldmVudC5rZXkpKSB7XG4gICAgICAgICAgICB0aGlzLnNlYXJjaFRleHQgPSAodGhpcy5zZWFyY2hUZXh0ID8/ICcnKSArIGV2ZW50LmtleVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldCBmaWx0ZXJlZEl0ZW1zICgpIHtcbiAgICBpZiAodGhpcy5zZWFyY2hhYmxlICYmIHRoaXMuc2VhcmNoVGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXRlbXMuZmlsdGVyKGl0ZW0gPT4gaXRlbVt0aGlzLmxhYmVsUGFyYW1dLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModGhpcy5zZWFyY2hUZXh0Py50b0xvd2VyQ2FzZSgpKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuaXRlbXNcbiAgICB9XG4gIH1cbn1cbiJdfQ==
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvY29tcG9uZW50cy9kcm9wZG93bi9kcm9wZG93bi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQTtBQUV4SSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQTtBQUNuRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQTtBQVFyRCxNQUFNLE9BQU8saUJBQWlCO0lBQzVCLFlBQ1MsS0FBdUIsRUFDdkIsSUFBWSxFQUNaLEdBQWU7UUFGZixVQUFLLEdBQUwsS0FBSyxDQUFrQjtRQUN2QixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ1osUUFBRyxHQUFILEdBQUcsQ0FBWTtRQUlqQixXQUFNLEdBQVUsRUFBRSxDQUFBO1FBQ2hCLGFBQVEsR0FBRyxLQUFLLENBQUE7UUFZZixlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQXFCLENBQUE7UUFDcEIsYUFBUSxHQUFHLEtBQUssQ0FBQTtRQUMvQyxpQkFBWSxHQUFHLElBQUksQ0FBQTtRQUNsQix1QkFBa0IsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFBO1FBQzdDLGVBQVUsR0FBRyxNQUFNLENBQUE7UUFDbkIseUJBQW9CLEdBQUcsQ0FBQyxDQUFBO1FBQ3hCLGdCQUFXLEdBQUcsYUFBYSxDQUFBO1FBQzNCLHVCQUFrQixHQUFHLFVBQVUsQ0FBQTtRQUMvQixrQkFBYSxHQUFHLElBQUksQ0FBQTtRQUNwQixlQUFVLEdBQUcsSUFBSSxDQUFBO1FBQ2hCLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUs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QUFDLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxPQUFDLElBQUksQ0FBQyxVQUFVLDBDQUFFLFdBQVcsR0FBRyxDQUFBLEVBQUEsQ0FBQyxDQUFBO1NBQy9HO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUE7U0FDbEI7SUFDSCxDQUFDOzs7WUFqS0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2dCQUN4QixvOENBQXdDO2dCQUV4QyxVQUFVLEVBQUUsQ0FBRSxrQkFBa0IsQ0FBRTs7YUFDbkM7OztZQVJRLGdCQUFnQjtZQUZ1RCxNQUFNO1lBQXhDLFVBQVU7Ozt1QkFvQnJELEtBQUs7b0JBQ0wsS0FBSzt5QkFXTCxNQUFNO3VCQUNOLFdBQVcsU0FBQyxnQkFBZ0IsY0FBRyxLQUFLOzJCQUNwQyxLQUFLO2lDQUNMLE1BQU07eUJBQ04sS0FBSzttQ0FDTCxLQUFLOzBCQUNMLEtBQUs7aUNBQ0wsS0FBSzs0QkFDTCxLQUFLO3lCQUNMLEtBQUs7MkJBQ0wsTUFBTTt3QkFFTixTQUFTLFNBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2tCQUN6RCxTQUFTLFNBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFOzJCQUNuRCxTQUFTLFNBQUMsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTs2QkFHakMsS0FBSzt1QkFxRkwsWUFBWSxTQUFDLG1CQUFtQixFQUFFLENBQUUsUUFBUSxDQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT3V0cHV0LCBOZ1pvbmUsIEhvc3RCaW5kaW5nLCBIb3N0TGlzdGVuZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuaW1wb3J0IHsgU2VsZWN0Qm94Q29tcG9uZW50IH0gZnJvbSAnLi4vc2VsZWN0LWJveC9zZWxlY3QtYm94LmNvbXBvbmVudCdcbmltcG9ydCB7IFV0aWxpdGllc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy91dGlsaXRpZXMuc2VydmljZSdcbmltcG9ydCB7IEZhZGVJbk91dEFuaW1hdGlvbiB9IGZyb20gJy4uLy4uL2FuaW1hdGlvbnMnXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2VxbS1kcm9wZG93bicsXG4gIHRlbXBsYXRlVXJsOiAnLi9kcm9wZG93bi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWyAnLi9kcm9wZG93bi5jb21wb25lbnQuc2NzcycgXSxcbiAgYW5pbWF0aW9uczogWyBGYWRlSW5PdXRBbmltYXRpb24gXVxufSlcbmV4cG9ydCBjbGFzcyBEcm9wZG93bkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGNvbnN0cnVjdG9yIChcbiAgICBwdWJsaWMgdXRpbHM6IFV0aWxpdGllc1NlcnZpY2UsXG4gICAgcHVibGljIHpvbmU6IE5nWm9uZSxcbiAgICBwdWJsaWMgcmVmOiBFbGVtZW50UmVmXG4gICkge1xuICB9XG5cbiAgcHVibGljIF9pdGVtczogYW55W10gPSBbXVxuICBASW5wdXQoKSBlZGl0YWJsZSA9IGZhbHNlXG4gIEBJbnB1dCgpXG4gIGdldCBpdGVtcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2l0ZW1zXG4gIH1cblxuICBzZXQgaXRlbXMgKG5ld0l0ZW1zKSB7XG4gICAgaWYgKCFuZXdJdGVtcyB8fCAhQXJyYXkuaXNBcnJheShuZXdJdGVtcykpIHJldHVyblxuICAgIHRoaXMuc2VhcmNoVGV4dCA9IHVuZGVmaW5lZFxuICAgIHRoaXMuX2l0ZW1zID0gbmV3SXRlbXNcbiAgfVxuXG4gIEBPdXRwdXQoKSByZWZDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxEcm9wZG93bkNvbXBvbmVudD4oKVxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmRpc2FibGVkJykgQElucHV0KCkgZGlzYWJsZWQgPSBmYWxzZVxuICBASW5wdXQoKSBzZWxlY3RlZEl0ZW0gPSBudWxsXG4gIEBPdXRwdXQoKSBzZWxlY3RlZEl0ZW1DaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKVxuICBASW5wdXQoKSBsYWJlbFBhcmFtID0gJ3RleHQnXG4gIEBJbnB1dCgpIG51bWJlck9mVmlzaWJsZUl0ZW1zID0gNlxuICBASW5wdXQoKSBwbGFjZWhvbGRlciA9ICdTZWxlY3QgaXRlbSdcbiAgQElucHV0KCkgbm9JdGVtc1BsYWNlaG9sZGVyID0gJ05vIGl0ZW1zJ1xuICBASW5wdXQoKSBjbG9zZU9uU2VsZWN0ID0gdHJ1ZVxuICBASW5wdXQoKSBzZWFyY2hhYmxlID0gdHJ1ZVxuICBAT3V0cHV0KCkgaXRlbVNlbGVjdGVkID0gbmV3IEV2ZW50RW1pdHRlcigpXG5cbiAgQFZpZXdDaGlsZCgnY29udGFpbmVyJywgeyByZWFkOiBFbGVtZW50UmVmLCBzdGF0aWM6IHRydWUgfSkgY29udGFpbmVyITogRWxlbWVudFJlZlxuICBAVmlld0NoaWxkKCdib3gnLCB7IHJlYWQ6IEVsZW1lbnRSZWYsIHN0YXRpYzogdHJ1ZSB9KSBib3ghOiBFbGVtZW50UmVmXG4gIEBWaWV3Q2hpbGQoJ2JveCcsIHsgc3RhdGljOiB0cnVlIH0pIGJveENvbXBvbmVudCE6IFNlbGVjdEJveENvbXBvbmVudFxuICBzaG93biA9IGZhbHNlXG4gIHlDb29yZGluYXRlID0gMFxuICBASW5wdXQoKSBmb3JjZURpcmVjdGlvbj86ICdkb3duJyB8ICd1cCdcbiAgZGlyZWN0aW9uOiAnZG93bicgfCAndXAnID0gJ2Rvd24nXG5cbiAgcHVibGljIHBhZGRpbmcgPSA1XG5cbiAgYXN5bmMgbmdPbkluaXQgKCkge1xuICAgIGlmICghdGhpcy5pdGVtcykgdGhpcy5pdGVtcyA9IFtdXG4gICAgdGhpcy5zZXREaW1lbnNpb25zKClcbiAgICB0aGlzLmNhbGN1bGF0ZVlDb29yZGluYXRlKClcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG4gICAgZm9yIChjb25zdCBfIG9mIFsgLi4uQXJyYXkoMykgXSkge1xuICAgICAgYXdhaXQgdGhpcy51dGlscy5kZWxheSgxMDApXG4gICAgICB0aGlzLmNhbGN1bGF0ZVlDb29yZGluYXRlKClcbiAgICB9XG4gICAgdGhpcy5yZWZDaGFuZ2VkLmVtaXQodGhpcylcbiAgfVxuXG4gIHNldERpbWVuc2lvbnMgKCkge1xuICAgIGNvbnN0IGlucHV0RWwgPSB0aGlzLmNvbnRhaW5lci5uYXRpdmVFbGVtZW50XG4gICAgY29uc3QgYm94RWwgPSB0aGlzLmJveC5uYXRpdmVFbGVtZW50XG5cbiAgICBjb25zdCBpbnB1dFdpZHRoID0gaW5wdXRFbC5vZmZzZXRXaWR0aFxuXG4gICAgYm94RWwuc3R5bGUud2lkdGggPSBgJHtpbnB1dFdpZHRofXB4YFxuICB9XG5cbiAgY2FsY3VsYXRlWUNvb3JkaW5hdGUgKCkge1xuICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5ib2R5XG4gICAgY29uc3QgaHRtbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxuICAgIGNvbnN0IHZpZXdIZWlnaHQgPSBNYXRoLm1heChib2R5LnNjcm9sbEhlaWdodCwgYm9keS5vZmZzZXRIZWlnaHQsIGh0bWwuY2xpZW50SGVpZ2h0LCBodG1sLnNjcm9sbEhlaWdodCwgaHRtbC5vZmZzZXRIZWlnaHQpXG4gICAgY29uc3QgcHJlZmVycmVkRGlyZWN0aW9uID0gJ2Rvd24nXG4gICAgdGhpcy5kaXJlY3Rpb24gPSBwcmVmZXJyZWREaXJlY3Rpb25cbiAgICBjb25zdCBpbnB1dEVsID0gdGhpcy5jb250YWluZXIubmF0aXZlRWxlbWVudFxuXG4gICAgY29uc3QgaW5wdXRIZWlnaHQgPSBwYXJzZUludChpbnB1dEVsLm9mZnNldEhlaWdodClcbiAgICBjb25zdCBpbnB1dFBvc2l0aW9uID0gaW5wdXRFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgY29uc3QgYm94SGVpZ2h0ID0gdGhpcy5ib3hDb21wb25lbnQuaGVpZ2h0XG5cbiAgICBjb25zdCBkb3duWSA9IHBhcnNlSW50KGlucHV0UG9zaXRpb24ueSkgKyBpbnB1dEhlaWdodCArIHRoaXMucGFkZGluZyAvIDJcbiAgICBjb25zdCBkb3duU3BhY2VMZWZ0ID0gdmlld0hlaWdodCAtIChkb3duWSArIGJveEhlaWdodClcblxuICAgIGNvbnN0IHVwWSA9IGlucHV0UG9zaXRpb24udG9wIC0gYm94SGVpZ2h0IC0gdGhpcy5wYWRkaW5nXG4gICAgY29uc3QgdXBTcGFjZUxlZnQgPSB1cFlcblxuICAgIHRoaXMuZGlyZWN0aW9uID0gdGhpcy5mb3JjZURpcmVjdGlvbiA/PyAoZG93blNwYWNlTGVmdCA+IHVwU3BhY2VMZWZ0ID8gJ2Rvd24nIDogJ3VwJylcbiAgICBjb25zdCB5ID0gdGhpcy5kaXJlY3Rpb24gPT09ICdkb3duJyA/IGRvd25ZIDogdXBZXG5cbiAgICB0aGlzLnlDb29yZGluYXRlID0geVxuICB9XG5cbiAgYXN5bmMgdG9nZ2xlIChldmVudDogTW91c2VFdmVudCkge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgaWYgKHRoaXMuc2hvd24pIHtcbiAgICAgIHRoaXMuY2xvc2UoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wZW4oKVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIG9wZW4gKCkge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCAmJiAhdGhpcy5zaG93biAmJiB0aGlzLml0ZW1zLmxlbmd0aCkge1xuICAgICAgdGhpcy5jYWxjdWxhdGVZQ29vcmRpbmF0ZSgpXG4gICAgICB0aGlzLnNldERpbWVuc2lvbnMoKVxuICAgICAgdGhpcy5zaG93biA9IHRydWVcbiAgICB9XG4gIH1cblxuICBhc3luYyBjbG9zZSAoKSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkICYmIHRoaXMuc2hvd24pIHtcbiAgICAgIHRoaXMuc2hvd24gPSBmYWxzZVxuICAgICAgdGhpcy5zZWFyY2hUZXh0ID0gdW5kZWZpbmVkXG4gICAgfVxuICB9XG5cbiAgc2VsZWN0SXRlbSAoaXRlbTogYW55KSB7XG4gICAgdGhpcy5zZWxlY3RlZEl0ZW0gPSBpdGVtXG4gICAgdGhpcy5zZWxlY3RlZEl0ZW1DaGFuZ2UuZW1pdChpdGVtKVxuICAgIHRoaXMuaXRlbVNlbGVjdGVkLmVtaXQoaXRlbSlcbiAgICBpZiAodGhpcy5jbG9zZU9uU2VsZWN0KSB7XG4gICAgICB0aGlzLmNsb3NlKClcbiAgICB9XG4gIH1cblxuICBzZWFyY2hUZXh0Pzogc3RyaW5nXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OmtleXByZXNzJywgWyAnJGV2ZW50JyBdKVxuICBrZXlwcmVzcyAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgdGhpcy5zaG93biAmJiB0aGlzLnNlYXJjaGFibGUpIHtcbiAgICAgIHN3aXRjaCAoZXZlbnQua2V5KSB7XG4gICAgICAgIGNhc2UgJ0JhY2tzcGFjZSc6IHtcbiAgICAgICAgICBpZiAodGhpcy5zZWFyY2hUZXh0Py5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoVGV4dCA9IHRoaXMuc2VhcmNoVGV4dC5zbGljZSgwLCB0aGlzLnNlYXJjaFRleHQubGVuZ3RoIC0gMSlcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdFc2NhcGUnOiB7XG4gICAgICAgICAgdGhpcy5jbG9zZSgpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdFbnRlcic6IHtcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICBpZiAoL15bK2EtekEtWjAtOV8uLVxcc10kLy50ZXN0KGV2ZW50LmtleSkpIHtcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoVGV4dCA9ICh0aGlzLnNlYXJjaFRleHQgPz8gJycpICsgZXZlbnQua2V5XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0IGZpbHRlcmVkSXRlbXMgKCkge1xuICAgIGlmICh0aGlzLnNlYXJjaGFibGUgJiYgdGhpcy5zZWFyY2hUZXh0KSB7XG4gICAgICByZXR1cm4gdGhpcy5pdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtW3RoaXMubGFiZWxQYXJhbV0udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyh0aGlzLnNlYXJjaFRleHQ/LnRvTG93ZXJDYXNlKCkpKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5pdGVtc1xuICAgIH1cbiAgfVxufVxuIl19
import { __awaiter } from "tslib";
import { Component, Input, ViewChild, ElementRef, EventEmitter, Output, HostBinding, HostListener } from '@angular/core';
import { FadeInOutAnimation } from '../../animations';
import * as i0 from "@angular/core";
import * as i1 from "../../services/utilities.service";
import * as i2 from "../container/container.component";
import * as i3 from "../carousel/carousel.component";
import * as i4 from "@angular/common";
import * as i5 from "../label/label.component";
import * as i6 from "../select-box/select-box.component";
import * as i7 from "../../directives/clicked-outside.directive";
import * as i8 from "../icon/icon.component";
const _c0 = ["container"];
const _c1 = ["box"];
function DropdownComponent_eqm_icon_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "eqm-icon", 8);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("name", ctx_r1.selectedItem.icon);
} }
function DropdownComponent_div_6_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 9);
    i0.ɵɵlistener("click", function DropdownComponent_div_6_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r5 = i0.ɵɵnextContext(); return ctx_r5.searchText = undefined; });
    i0.ɵɵelement(1, "eqm-icon", 10);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("name", "cross")("height", 16)("width", 16);
} }
function DropdownComponent_div_7_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 9);
    i0.ɵɵlistener("click", function DropdownComponent_div_7_Template_div_click_0_listener($event) { i0.ɵɵrestoreView(_r8); const ctx_r7 = i0.ɵɵnextContext(); return ctx_r7.editable ? ctx_r7.toggle($event) : undefined; });
    i0.ɵɵelement(1, "eqm-icon", 11);
    i0.ɵɵelement(2, "eqm-icon", 11);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r3 = i0.ɵɵnextContext();
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("name", "triangle")("height", 8)("width", 8)("color", ctx_r3.items.length ? "#4f8d71" : "#555")("rotate", -90);
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("name", "triangle")("height", 8)("width", 8)("color", ctx_r3.items.length ? "#4f8d71" : "#555")("rotate", 90);
} }
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
DropdownComponent.ɵfac = function DropdownComponent_Factory(t) { return new (t || DropdownComponent)(i0.ɵɵdirectiveInject(i1.UtilitiesService), i0.ɵɵdirectiveInject(i0.NgZone), i0.ɵɵdirectiveInject(i0.ElementRef)); };
DropdownComponent.ɵcmp = i0.ɵɵdefineComponent({ type: DropdownComponent, selectors: [["eqm-dropdown"]], viewQuery: function DropdownComponent_Query(rf, ctx) { if (rf & 1) {
        i0.ɵɵviewQuery(_c0, 3, ElementRef);
        i0.ɵɵviewQuery(_c1, 3, ElementRef);
        i0.ɵɵviewQuery(_c1, 3);
    } if (rf & 2) {
        let _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.container = _t.first);
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.box = _t.first);
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.boxComponent = _t.first);
    } }, hostVars: 2, hostBindings: function DropdownComponent_HostBindings(rf, ctx) { if (rf & 1) {
        i0.ɵɵlistener("keypress", function DropdownComponent_keypress_HostBindingHandler($event) { return ctx.keypress($event); }, false, i0.ɵɵresolveDocument);
    } if (rf & 2) {
        i0.ɵɵclassProp("disabled", ctx.disabled);
    } }, inputs: { editable: "editable", items: "items", disabled: "disabled", selectedItem: "selectedItem", labelParam: "labelParam", numberOfVisibleItems: "numberOfVisibleItems", placeholder: "placeholder", noItemsPlaceholder: "noItemsPlaceholder", closeOnSelect: "closeOnSelect", searchable: "searchable", forceDirection: "forceDirection" }, outputs: { refChanged: "refChanged", selectedItemChange: "selectedItemChange", itemSelected: "itemSelected" }, decls: 10, vars: 14, consts: [[1, "container", 3, "disabled", "click"], ["container", ""], [1, "item"], ["class", "icon", "color", "#4f8d71", 3, "name", 4, "ngIf"], ["color", "#4f8d71"], ["class", "right", 3, "click", 4, "ngIf"], [3, "numberOfVisibleItems", "hidden", "items", "labelParam", "selectedItem", "clickedOutside", "itemSelected"], ["box", ""], ["color", "#4f8d71", 1, "icon", 3, "name"], [1, "right", 3, "click"], ["color", "#4f8d71", 3, "name", "height", "width"], [3, "name", "height", "width", "color", "rotate"]], template: function DropdownComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "eqm-container", 0, 1);
        i0.ɵɵlistener("click", function DropdownComponent_Template_eqm_container_click_0_listener($event) { return ctx.editable ? undefined : ctx.toggle($event); });
        i0.ɵɵelementStart(2, "div", 2);
        i0.ɵɵtemplate(3, DropdownComponent_eqm_icon_3_Template, 1, 1, "eqm-icon", 3);
        i0.ɵɵelementStart(4, "eqm-label", 4);
        i0.ɵɵtext(5);
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵtemplate(6, DropdownComponent_div_6_Template, 2, 3, "div", 5);
        i0.ɵɵtemplate(7, DropdownComponent_div_7_Template, 3, 10, "div", 5);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(8, "eqm-select-box", 6, 7);
        i0.ɵɵlistener("clickedOutside", function DropdownComponent_Template_eqm_select_box_clickedOutside_8_listener() { return ctx.close(); })("itemSelected", function DropdownComponent_Template_eqm_select_box_itemSelected_8_listener($event) { return ctx.selectItem($event); });
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵproperty("disabled", ctx.disabled);
        i0.ɵɵadvance(3);
        i0.ɵɵproperty("ngIf", ctx.selectedItem && ctx.selectedItem.icon);
        i0.ɵɵadvance(2);
        i0.ɵɵtextInterpolate1(" ", ctx.searchText || (ctx.items.length ? ctx.selectedItem ? ctx.selectedItem[ctx.labelParam] : ctx.placeholder : ctx.noItemsPlaceholder), " ");
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngIf", ctx.searchText);
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngIf", !ctx.searchText);
        i0.ɵɵadvance(1);
        i0.ɵɵclassMap("items-select-box" + (ctx.direction === "down" ? " down" : " up"));
        i0.ɵɵstyleProp("top", ctx.yCoordinate, "px");
        i0.ɵɵproperty("numberOfVisibleItems", ctx.numberOfVisibleItems)("hidden", !ctx.shown || ctx.filteredItems.length === 0)("items", ctx.filteredItems)("labelParam", ctx.labelParam)("selectedItem", ctx.selectedItem);
    } }, directives: [i2.ContainerComponent, i3.CarouselItemElement, i4.NgIf, i5.LabelComponent, i6.SelectBoxComponent, i7.ClickedOutsideDirective, i8.IconComponent], styles: ["[_nghost-%COMP%]{display:block;width:100%;transition:filter;transition-duration:.5s}.container[_ngcontent-%COMP%]{z-index:3;width:100%;height:100%;flex-direction:row;justify-content:center;align-items:center;position:relative;transform:translateX(-2px)}.container[_ngcontent-%COMP%], .right[_ngcontent-%COMP%]{display:inline-flex}.right[_ngcontent-%COMP%]{width:20px;flex-direction:column;text-align:center;position:absolute;right:0;top:calc(50% - 16px/2)}.items-select-box[_ngcontent-%COMP%]{position:fixed;z-index:999;box-shadow:0 8px 77px 2px rgba(0,0,0,.56)}.down[_ngcontent-%COMP%]{transform-origin:top center}.up[_ngcontent-%COMP%]{transform-origin:bottom center}.disabled[_nghost-%COMP%]{filter:grayscale(80%)}.item[_ngcontent-%COMP%]{margin:4px;display:inline-flex;flex-direction:row;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.item[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%]{margin-right:10px;display:inline-block}"], data: { animation: [FadeInOutAnimation] } });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DropdownComponent, [{
        type: Component,
        args: [{
                selector: 'eqm-dropdown',
                templateUrl: './dropdown.component.html',
                styleUrls: ['./dropdown.component.scss'],
                animations: [FadeInOutAnimation]
            }]
    }], function () { return [{ type: i1.UtilitiesService }, { type: i0.NgZone }, { type: i0.ElementRef }]; }, { editable: [{
            type: Input
        }], items: [{
            type: Input
        }], refChanged: [{
            type: Output
        }], disabled: [{
            type: HostBinding,
            args: ['class.disabled']
        }, {
            type: Input
        }], selectedItem: [{
            type: Input
        }], selectedItemChange: [{
            type: Output
        }], labelParam: [{
            type: Input
        }], numberOfVisibleItems: [{
            type: Input
        }], placeholder: [{
            type: Input
        }], noItemsPlaceholder: [{
            type: Input
        }], closeOnSelect: [{
            type: Input
        }], searchable: [{
            type: Input
        }], itemSelected: [{
            type: Output
        }], container: [{
            type: ViewChild,
            args: ['container', { read: ElementRef, static: true }]
        }], box: [{
            type: ViewChild,
            args: ['box', { read: ElementRef, static: true }]
        }], boxComponent: [{
            type: ViewChild,
            args: ['box', { static: true }]
        }], forceDirection: [{
            type: Input
        }], keypress: [{
            type: HostListener,
            args: ['document:keypress', ['$event']]
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvY29tcG9uZW50cy9kcm9wZG93bi9kcm9wZG93bi5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL2Ryb3Bkb3duL2Ryb3Bkb3duLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQVUsV0FBVyxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQTtBQUd4SSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQTs7Ozs7Ozs7Ozs7OztJQ0NqRCw4QkFBdUg7OztJQUFuRSwrQ0FBMEI7Ozs7SUFJaEYsOEJBQXVFO0lBQWpDLCtLQUFzQixTQUFTLElBQUM7SUFDcEUsK0JBQWlGO0lBQ25GLGlCQUFNOztJQURNLGVBQWdCO0lBQWhCLDhCQUFnQixjQUFBLGFBQUE7Ozs7SUFFNUIsOEJBQXVGO0lBQWhELDJNQUFxQyxTQUFTLElBQUM7SUFDcEYsK0JBQ1c7SUFDWCwrQkFDVztJQUNiLGlCQUFNOzs7SUFKTSxlQUFtQjtJQUFuQixpQ0FBbUIsYUFBQSxZQUFBLG1EQUFBLGVBQUE7SUFFbkIsZUFBbUI7SUFBbkIsaUNBQW1CLGFBQUEsWUFBQSxtREFBQSxjQUFBOztBREhqQyxNQUFNLE9BQU8saUJBQWlCO0lBQzVCLFlBQ1MsS0FBdUIsRUFDdkIsSUFBWSxFQUNaLEdBQWU7UUFGZixVQUFLLEdBQUwsS0FBSyxDQUFrQjtRQUN2QixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ1osUUFBRyxHQUFILEdBQUcsQ0FBWTtRQUlqQixXQUFNLEdBQVUsRUFBRSxDQUFBO1FBQ2hCLGFBQVEs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bXBvbmVudCwgT25Jbml0LCBJbnB1dCwgVmlld0NoaWxkLCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE91dHB1dCwgTmdab25lLCBIb3N0QmluZGluZywgSG9zdExpc3RlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7IFNlbGVjdEJveENvbXBvbmVudCB9IGZyb20gJy4uL3NlbGVjdC1ib3gvc2VsZWN0LWJveC5jb21wb25lbnQnXG5pbXBvcnQgeyBVdGlsaXRpZXNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvdXRpbGl0aWVzLnNlcnZpY2UnXG5pbXBvcnQgeyBGYWRlSW5PdXRBbmltYXRpb24gfSBmcm9tICcuLi8uLi9hbmltYXRpb25zJ1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdlcW0tZHJvcGRvd24nLFxuICB0ZW1wbGF0ZVVybDogJy4vZHJvcGRvd24uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsgJy4vZHJvcGRvd24uY29tcG9uZW50LnNjc3MnIF0sXG4gIGFuaW1hdGlvbnM6IFsgRmFkZUluT3V0QW5pbWF0aW9uIF1cbn0pXG5leHBvcnQgY2xhc3MgRHJvcGRvd25Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBjb25zdHJ1Y3RvciAoXG4gICAgcHVibGljIHV0aWxzOiBVdGlsaXRpZXNTZXJ2aWNlLFxuICAgIHB1YmxpYyB6b25lOiBOZ1pvbmUsXG4gICAgcHVibGljIHJlZjogRWxlbWVudFJlZlxuICApIHtcbiAgfVxuXG4gIHB1YmxpYyBfaXRlbXM6IGFueVtdID0gW11cbiAgQElucHV0KCkgZWRpdGFibGUgPSBmYWxzZVxuICBASW5wdXQoKVxuICBnZXQgaXRlbXMgKCkge1xuICAgIHJldHVybiB0aGlzLl9pdGVtc1xuICB9XG5cbiAgc2V0IGl0ZW1zIChuZXdJdGVtcykge1xuICAgIGlmICghbmV3SXRlbXMgfHwgIUFycmF5LmlzQXJyYXkobmV3SXRlbXMpKSByZXR1cm5cbiAgICB0aGlzLnNlYXJjaFRleHQgPSB1bmRlZmluZWRcbiAgICB0aGlzLl9pdGVtcyA9IG5ld0l0ZW1zXG4gIH1cblxuICBAT3V0cHV0KCkgcmVmQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8RHJvcGRvd25Db21wb25lbnQ+KClcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5kaXNhYmxlZCcpIEBJbnB1dCgpIGRpc2FibGVkID0gZmFsc2VcbiAgQElucHV0KCkgc2VsZWN0ZWRJdGVtID0gbnVsbFxuICBAT3V0cHV0KCkgc2VsZWN0ZWRJdGVtQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KClcbiAgQElucHV0KCkgbGFiZWxQYXJhbSA9ICd0ZXh0J1xuICBASW5wdXQoKSBudW1iZXJPZlZpc2libGVJdGVtcyA9IDZcbiAgQElucHV0KCkgcGxhY2Vob2xkZXIgPSAnU2VsZWN0IGl0ZW0nXG4gIEBJbnB1dCgpIG5vSXRlbXNQbGFjZWhvbGRlciA9ICdObyBpdGVtcydcbiAgQElucHV0KCkgY2xvc2VPblNlbGVjdCA9IHRydWVcbiAgQElucHV0KCkgc2VhcmNoYWJsZSA9IHRydWVcbiAgQE91dHB1dCgpIGl0ZW1TZWxlY3RlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKVxuXG4gIEBWaWV3Q2hpbGQoJ2NvbnRhaW5lcicsIHsgcmVhZDogRWxlbWVudFJlZiwgc3RhdGljOiB0cnVlIH0pIGNvbnRhaW5lciE6IEVsZW1lbnRSZWZcbiAgQFZpZXdDaGlsZCgnYm94JywgeyByZWFkOiBFbGVtZW50UmVmLCBzdGF0aWM6IHRydWUgfSkgYm94ITogRWxlbWVudFJlZlxuICBAVmlld0NoaWxkKCdib3gnLCB7IHN0YXRpYzogdHJ1ZSB9KSBib3hDb21wb25lbnQhOiBTZWxlY3RCb3hDb21wb25lbnRcbiAgc2hvd24gPSBmYWxzZVxuICB5Q29vcmRpbmF0ZSA9IDBcbiAgQElucHV0KCkgZm9yY2VEaXJlY3Rpb24/OiAnZG93bicgfCAndXAnXG4gIGRpcmVjdGlvbjogJ2Rvd24nIHwgJ3VwJyA9ICdkb3duJ1xuXG4gIHB1YmxpYyBwYWRkaW5nID0gNVxuXG4gIGFzeW5jIG5nT25Jbml0ICgpIHtcbiAgICBpZiAoIXRoaXMuaXRlbXMpIHRoaXMuaXRlbXMgPSBbXVxuICAgIHRoaXMuc2V0RGltZW5zaW9ucygpXG4gICAgdGhpcy5jYWxjdWxhdGVZQ29vcmRpbmF0ZSgpXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuICAgIGZvciAoY29uc3QgXyBvZiBbIC4uLkFycmF5KDMpIF0pIHtcbiAgICAgIGF3YWl0IHRoaXMudXRpbHMuZGVsYXkoMTAwKVxuICAgICAgdGhpcy5jYWxjdWxhdGVZQ29vcmRpbmF0ZSgpXG4gICAgfVxuICAgIHRoaXMucmVmQ2hhbmdlZC5lbWl0KHRoaXMpXG4gIH1cblxuICBzZXREaW1lbnNpb25zICgpIHtcbiAgICBjb25zdCBpbnB1dEVsID0gdGhpcy5jb250YWluZXIubmF0aXZlRWxlbWVudFxuICAgIGNvbnN0IGJveEVsID0gdGhpcy5ib3gubmF0aXZlRWxlbWVudFxuXG4gICAgY29uc3QgaW5wdXRXaWR0aCA9IGlucHV0RWwub2Zmc2V0V2lkdGhcblxuICAgIGJveEVsLnN0eWxlLndpZHRoID0gYCR7aW5wdXRXaWR0aH1weGBcbiAgfVxuXG4gIGNhbGN1bGF0ZVlDb29yZGluYXRlICgpIHtcbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuYm9keVxuICAgIGNvbnN0IGh0bWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcbiAgICBjb25zdCB2aWV3SGVpZ2h0ID0gTWF0aC5tYXgoYm9keS5zY3JvbGxIZWlnaHQsIGJvZHkub2Zmc2V0SGVpZ2h0LCBodG1sLmNsaWVudEhlaWdodCwgaHRtbC5zY3JvbGxIZWlnaHQsIGh0bWwub2Zmc2V0SGVpZ2h0KVxuICAgIGNvbnN0IHByZWZlcnJlZERpcmVjdGlvbiA9ICdkb3duJ1xuICAgIHRoaXMuZGlyZWN0aW9uID0gcHJlZmVycmVkRGlyZWN0aW9uXG4gICAgY29uc3QgaW5wdXRFbCA9IHRoaXMuY29udGFpbmVyLm5hdGl2ZUVsZW1lbnRcblxuICAgIGNvbnN0IGlucHV0SGVpZ2h0ID0gcGFyc2VJbnQoaW5wdXRFbC5vZmZzZXRIZWlnaHQpXG4gICAgY29uc3QgaW5wdXRQb3NpdGlvbiA9IGlucHV0RWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgIGNvbnN0IGJveEhlaWdodCA9IHRoaXMuYm94Q29tcG9uZW50LmhlaWdodFxuXG4gICAgY29uc3QgZG93blkgPSBwYXJzZUludChpbnB1dFBvc2l0aW9uLnkpICsgaW5wdXRIZWlnaHQgKyB0aGlzLnBhZGRpbmcgLyAyXG4gICAgY29uc3QgZG93blNwYWNlTGVmdCA9IHZpZXdIZWlnaHQgLSAoZG93blkgKyBib3hIZWlnaHQpXG5cbiAgICBjb25zdCB1cFkgPSBpbnB1dFBvc2l0aW9uLnRvcCAtIGJveEhlaWdodCAtIHRoaXMucGFkZGluZ1xuICAgIGNvbnN0IHVwU3BhY2VMZWZ0ID0gdXBZXG5cbiAgICB0aGlzLmRpcmVjdGlvbiA9IHRoaXMuZm9yY2VEaXJlY3Rpb24gPz8gKGRvd25TcGFjZUxlZnQgPiB1cFNwYWNlTGVmdCA/ICdkb3duJyA6ICd1cCcpXG4gICAgY29uc3QgeSA9IHRoaXMuZGlyZWN0aW9uID09PSAnZG93bicgPyBkb3duWSA6IHVwWVxuXG4gICAgdGhpcy55Q29vcmRpbmF0ZSA9IHlcbiAgfVxuXG4gIGFzeW5jIHRvZ2dsZSAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIGlmICh0aGlzLnNob3duKSB7XG4gICAgICB0aGlzLmNsb3NlKClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vcGVuKClcbiAgICB9XG4gIH1cblxuICBhc3luYyBvcGVuICgpIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgIXRoaXMuc2hvd24gJiYgdGhpcy5pdGVtcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuY2FsY3VsYXRlWUNvb3JkaW5hdGUoKVxuICAgICAgdGhpcy5zZXREaW1lbnNpb25zKClcbiAgICAgIHRoaXMuc2hvd24gPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgY2xvc2UgKCkge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCAmJiB0aGlzLnNob3duKSB7XG4gICAgICB0aGlzLnNob3duID0gZmFsc2VcbiAgICAgIHRoaXMuc2VhcmNoVGV4dCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfVxuXG4gIHNlbGVjdEl0ZW0gKGl0ZW06IGFueSkge1xuICAgIHRoaXMuc2VsZWN0ZWRJdGVtID0gaXRlbVxuICAgIHRoaXMuc2VsZWN0ZWRJdGVtQ2hhbmdlLmVtaXQoaXRlbSlcbiAgICB0aGlzLml0ZW1TZWxlY3RlZC5lbWl0KGl0ZW0pXG4gICAgaWYgKHRoaXMuY2xvc2VPblNlbGVjdCkge1xuICAgICAgdGhpcy5jbG9zZSgpXG4gICAgfVxuICB9XG5cbiAgc2VhcmNoVGV4dD86IHN0cmluZ1xuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDprZXlwcmVzcycsIFsgJyRldmVudCcgXSlcbiAga2V5cHJlc3MgKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkICYmIHRoaXMuc2hvd24gJiYgdGhpcy5zZWFyY2hhYmxlKSB7XG4gICAgICBzd2l0Y2ggKGV2ZW50LmtleSkge1xuICAgICAgICBjYXNlICdCYWNrc3BhY2UnOiB7XG4gICAgICAgICAgaWYgKHRoaXMuc2VhcmNoVGV4dD8ubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnNlYXJjaFRleHQgPSB0aGlzLnNlYXJjaFRleHQuc2xpY2UoMCwgdGhpcy5zZWFyY2hUZXh0Lmxlbmd0aCAtIDEpXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAnRXNjYXBlJzoge1xuICAgICAgICAgIHRoaXMuY2xvc2UoKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAnRW50ZXInOiB7XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgaWYgKC9eWythLXpBLVowLTlfLi1cXHNdJC8udGVzdChldmVudC5rZXkpKSB7XG4gICAgICAgICAgICB0aGlzLnNlYXJjaFRleHQgPSAodGhpcy5zZWFyY2hUZXh0ID8/ICcnKSArIGV2ZW50LmtleVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldCBmaWx0ZXJlZEl0ZW1zICgpIHtcbiAgICBpZiAodGhpcy5zZWFyY2hhYmxlICYmIHRoaXMuc2VhcmNoVGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXRlbXMuZmlsdGVyKGl0ZW0gPT4gaXRlbVt0aGlzLmxhYmVsUGFyYW1dLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModGhpcy5zZWFyY2hUZXh0Py50b0xvd2VyQ2FzZSgpKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuaXRlbXNcbiAgICB9XG4gIH1cbn1cbiIsIjxlcW0tY29udGFpbmVyICNjb250YWluZXIgW2Rpc2FibGVkXT1cImRpc2FibGVkXCIgKGNsaWNrKT1cImVkaXRhYmxlID8gdW5kZWZpbmVkIDogdG9nZ2xlKCRldmVudClcIlxuICBjbGFzcz1cImNvbnRhaW5lclwiPlxuICA8ZGl2IGNsYXNzPVwiaXRlbVwiPlxuXG4gICAgPGVxbS1pY29uICpuZ0lmPVwic2VsZWN0ZWRJdGVtICYmIHNlbGVjdGVkSXRlbS5pY29uXCIgW25hbWVdPVwic2VsZWN0ZWRJdGVtLmljb25cIiBjbGFzcz1cImljb25cIiBjb2xvcj1cIiM0ZjhkNzFcIj48L2VxbS1pY29uPlxuICAgIDxlcW0tbGFiZWwgY29sb3I9XCIjNGY4ZDcxXCI+IHt7KHNlYXJjaFRleHQgfHwgKGl0ZW1zLmxlbmd0aCA/IChzZWxlY3RlZEl0ZW0gPyBzZWxlY3RlZEl0ZW1bbGFiZWxQYXJhbV0gOiBwbGFjZWhvbGRlcikgOiBub0l0ZW1zUGxhY2Vob2xkZXIpKX19IDwvZXFtLWxhYmVsPlxuICA8L2Rpdj5cblxuICA8ZGl2IGNsYXNzPVwicmlnaHRcIiAqbmdJZj1cInNlYXJjaFRleHRcIiAoY2xpY2spPVwic2VhcmNoVGV4dCA9IHVuZGVmaW5lZFwiPlxuICAgIDxlcW0taWNvbiBbbmFtZV09XCInY3Jvc3MnXCIgW2hlaWdodF09XCIxNlwiIFt3aWR0aF09XCIxNlwiIGNvbG9yPVwiIzRmOGQ3MVwiPjwvZXFtLWljb24+XG4gIDwvZGl2PlxuICA8ZGl2IGNsYXNzPVwicmlnaHRcIiAqbmdJZj1cIiFzZWFyY2hUZXh0XCIgKGNsaWNrKT1cImVkaXRhYmxlID8gdG9nZ2xlKCRldmVudCkgOiB1bmRlZmluZWRcIj5cbiAgICA8ZXFtLWljb24gW25hbWVdPVwiJ3RyaWFuZ2xlJ1wiIFtoZWlnaHRdPVwiOFwiIFt3aWR0aF09XCI4XCIgW2NvbG9yXT1cIml0ZW1zLmxlbmd0aCA/ICcjNGY4ZDcxJyA6ICcjNTU1J1wiIFtyb3RhdGVdPVwiLTkwXCI+XG4gICAgPC9lcW0taWNvbj5cbiAgICA8ZXFtLWljb24gW25hbWVdPVwiJ3RyaWFuZ2xlJ1wiIFtoZWlnaHRdPVwiOFwiIFt3aWR0aF09XCI4XCIgW2NvbG9yXT1cIml0ZW1zLmxlbmd0aCA/ICcjNGY4ZDcxJyA6ICcjNTU1J1wiIFtyb3RhdGVdPVwiOTBcIj5cbiAgICA8L2VxbS1pY29uPlxuICA8L2Rpdj5cbjwvZXFtLWNvbnRhaW5lcj5cbjxlcW0tc2VsZWN0LWJveCBbbnVtYmVyT2ZWaXNpYmxlSXRlbXNdPVwibnVtYmVyT2ZWaXNpYmxlSXRlbXNcIiAoY2xpY2tlZE91dHNpZGUpPVwiY2xvc2UoKVwiICNib3ggW2hpZGRlbl09XCIhc2hvd24gfHwgKGZpbHRlcmVkSXRlbXMubGVuZ3RoID09PSAwKVwiXG4gIFtjbGFzc109XCInaXRlbXMtc2VsZWN0LWJveCcgKyAoZGlyZWN0aW9uID09PSAnZG93bicgPyAnIGRvd24nIDogJyB1cCcpXCIgW2l0ZW1zXT1cImZpbHRlcmVkSXRlbXNcIiBbbGFiZWxQYXJhbV09XCJsYWJlbFBhcmFtXCJcbiAgW3NlbGVjdGVkSXRlbV09XCJzZWxlY3RlZEl0ZW1cIiAoaXRlbVNlbGVjdGVkKT1cInNlbGVjdEl0ZW0oJGV2ZW50KVwiIFtzdHlsZS50b3AucHhdPVwieUNvb3JkaW5hdGVcIj48L2VxbS1zZWxlY3QtYm94PiJdfQ==
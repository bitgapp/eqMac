import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../container/container.component";
import * as i2 from "@angular/cdk/scrolling";
import * as i3 from "@angular/common";
import * as i4 from "../label/label.component";
import * as i5 from "../icon/icon.component";
const _c0 = ["container"];
function SelectBoxComponent_div_3_eqm_icon_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "eqm-icon", 6);
} if (rf & 2) {
    const item_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("name", item_r2.icon);
} }
function SelectBoxComponent_div_3_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 4);
    i0.ɵɵlistener("click", function SelectBoxComponent_div_3_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r6); const item_r2 = ctx.$implicit; const ctx_r5 = i0.ɵɵnextContext(); return ctx_r5.selectItem(item_r2); });
    i0.ɵɵtemplate(1, SelectBoxComponent_div_3_eqm_icon_1_Template, 1, 1, "eqm-icon", 5);
    i0.ɵɵelementStart(2, "eqm-label");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r2 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵclassMap("item" + (item_r2 == ctx_r1.selectedItem ? " selected" : ""));
    i0.ɵɵstyleProp("height", ctx_r1.itemHeight - 6, "px");
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("ngIf", item_r2.icon);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r2[ctx_r1.labelParam]);
} }
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
SelectBoxComponent.ɵfac = function SelectBoxComponent_Factory(t) { return new (t || SelectBoxComponent)(i0.ɵɵdirectiveInject(i0.ElementRef)); };
SelectBoxComponent.ɵcmp = i0.ɵɵdefineComponent({ type: SelectBoxComponent, selectors: [["eqm-select-box"]], viewQuery: function SelectBoxComponent_Query(rf, ctx) { if (rf & 1) {
        i0.ɵɵviewQuery(_c0, 3, ElementRef);
    } if (rf & 2) {
        let _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.container = _t.first);
    } }, inputs: { items: "items", labelParam: "labelParam", selectedItem: "selectedItem", numberOfVisibleItems: "numberOfVisibleItems", width: "width" }, outputs: { itemSelected: "itemSelected" }, decls: 4, vars: 4, consts: [[1, "container"], ["container", ""], [2, "height", "100%", "width", "100%", 3, "itemSize", "minBufferPx", "maxBufferPx"], [3, "class", "height", "click", 4, "cdkVirtualFor", "cdkVirtualForOf"], [3, "click"], ["class", "icon", 3, "name", 4, "ngIf"], [1, "icon", 3, "name"]], template: function SelectBoxComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "eqm-container", 0, 1);
        i0.ɵɵelementStart(2, "cdk-virtual-scroll-viewport", 2);
        i0.ɵɵtemplate(3, SelectBoxComponent_div_3_Template, 4, 6, "div", 3);
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵadvance(2);
        i0.ɵɵproperty("itemSize", ctx.itemHeight)("minBufferPx", 400)("maxBufferPx", 800);
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("cdkVirtualForOf", ctx.items);
    } }, directives: [i1.ContainerComponent, i2.CdkVirtualScrollViewport, i2.CdkFixedSizeVirtualScroll, i2.CdkVirtualForOf, i3.NgIf, i4.LabelComponent, i5.IconComponent], styles: ["[_nghost-%COMP%]{overflow-x:visible;border-radius:2px}.container[_ngcontent-%COMP%]{text-align:center;width:calc(100% - 2px);height:100%;overflow-y:scroll}.container[_ngcontent-%COMP%]   .selected[_ngcontent-%COMP%]{border-color:#4f8d71!important}.container[_ngcontent-%COMP%]   .item[_ngcontent-%COMP%]{padding:2px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;border:1px solid transparent;display:flex;flex-direction:row;align-items:center;justify-content:center}.container[_ngcontent-%COMP%]   .item[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%]{margin-right:10px;display:inline-block}.container[_ngcontent-%COMP%]   .item[_ngcontent-%COMP%]:first-child{border-radius:3px 3px 0 0}.container[_ngcontent-%COMP%]   .item[_ngcontent-%COMP%]:last-child{border-radius:0 0 3px 3px}.container[_ngcontent-%COMP%]   .item[_ngcontent-%COMP%]:hover{border-color:#2a4c3d}"] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SelectBoxComponent, [{
        type: Component,
        args: [{
                selector: 'eqm-select-box',
                templateUrl: './select-box.component.html',
                styleUrls: ['./select-box.component.scss']
            }]
    }], function () { return [{ type: i0.ElementRef }]; }, { items: [{
            type: Input
        }], labelParam: [{
            type: Input
        }], selectedItem: [{
            type: Input
        }], itemSelected: [{
            type: Output
        }], container: [{
            type: ViewChild,
            args: ['container', { read: ElementRef, static: true }]
        }], numberOfVisibleItems: [{
            type: Input
        }], width: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LWJveC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL3NlbGVjdC1ib3gvc2VsZWN0LWJveC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL3NlbGVjdC1ib3gvc2VsZWN0LWJveC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUE7Ozs7Ozs7OztJQ0cvRiw4QkFBdUU7OztJQUEzQyxtQ0FBa0I7Ozs7SUFEaEQsOEJBQW1LO0lBQTlELHlOQUEwQjtJQUM3SCxtRkFBdUU7SUFBQSxpQ0FBVztJQUFBLFlBQW9CO0lBQUEsaUJBQVk7SUFDcEgsaUJBQU07Ozs7SUFGa0MsMkVBQTREO0lBQTRCLHFEQUFrQztJQUNySixlQUFlO0lBQWYsbUNBQWU7SUFBd0QsZUFBb0I7SUFBcEIsZ0RBQW9COztBREk1RyxNQUFNLE9BQU8sa0JBQWtCO0lBa0M3QixZQUFvQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO1FBakNwQyxXQUFNLEdBQVUsRUFBRSxDQUFBO1FBV1QsZUFBVSxHQUFHLE1BQU0sQ0FBQTtRQUNuQixpQkFBWSxHQUFHLElBQUksQ0FBQTtRQUNsQixpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUE7UUFFcEMsbUJBQWMsR0FBVyxDQUFDLENBQUE7UUFhakMsV0FBTSxHQUFHLENBQUMsQ0FBQTtRQUVWLFdBQU0sR0FBRyxJQUFJLENBQUE7UUFDYixlQUFVLEdBQUcsRUFBRSxDQUFBO0lBR2YsQ0FBQztJQWpDRCxJQUNJLEtBQUssQ0FBRSxRQUFlO1FBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFBO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQTtJQUNsQixDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFBO0lBQ3BCLENBQUM7SUFPRCxJQUNJLG9CQUFvQixDQUFFLEtBQWE7UUFDckMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUU7WUFDMUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUE7WUFDM0IsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO1NBQ2pCO0lBQ0gsQ0FBQztJQUVELElBQUksb0JBQW9CO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQTtJQUM1QixDQUFDO0lBVUQsUUFBUTtRQUNOLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtJQUN0QixDQUFDO0lBRU0sYUFBYTtRQUNsQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUE7UUFDaEIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFBO0lBQ2pCLENBQUM7SUFFTSxTQUFTO1FBQ2QsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDL0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xILElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUE7SUFDM0QsQ0FBQztJQUVNLFFBQVE7UUFDYixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFBO1NBQzFEO0lBQ0gsQ0FBQztJQUVELFVBQVUsQ0FBRSxJQUFTO1FBQ25CLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFBO1FBQ3hCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzlCLENBQUM7O29GQTdEVSxrQkFBa0I7dURBQWxCLGtCQUFrQjsrQkFlRyxVQUFVOzs7OztRQ3RCNUMsMkNBQTRDO1FBQzFDLHNEQUFnSTtRQUM5SCxtRUFFTTtRQUNSLGlCQUE4QjtRQUNoQyxpQkFBZ0I7O1FBTGUsZUFBdUI7UUFBdkIseUNBQXVCLG9CQUFBLG9CQUFBO1FBQ3BCLGVBQVE7UUFBUiwyQ0FBUTs7dUZESzdCLGtCQUFrQjtjQUw5QixTQUFTO2VBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsV0FBVyxFQUFFLDZCQUE2QjtnQkFDMUMsU0FBUyxFQUFFLENBQUUsNkJBQTZCLENBQUU7YUFDN0M7NkRBSUssS0FBSztrQkFEUixLQUFLO1lBVUcsVUFBVTtrQkFBbEIsS0FBSztZQUNHLFlBQVk7a0JBQXBCLEtBQUs7WUFDSSxZQUFZO2tCQUFyQixNQUFNO1lBQ3FELFNBQVM7a0JBQXBFLFNBQVM7bUJBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO1lBR3RELG9CQUFvQjtrQkFEdkIsS0FBSztZQWFHLEtBQUs7a0JBQWIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2VxbS1zZWxlY3QtYm94JyxcbiAgdGVtcGxhdGVVcmw6ICcuL3NlbGVjdC1ib3guY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsgJy4vc2VsZWN0LWJveC5jb21wb25lbnQuc2NzcycgXVxufSlcbmV4cG9ydCBjbGFzcyBTZWxlY3RCb3hDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBfaXRlbXM6IGFueVtdID0gW11cbiAgQElucHV0KClcbiAgc2V0IGl0ZW1zIChuZXdJdGVtczogYW55W10pIHtcbiAgICB0aGlzLl9pdGVtcyA9IG5ld0l0ZW1zXG4gICAgdGhpcy5zZXRIZWlnaHQoKVxuICB9XG5cbiAgZ2V0IGl0ZW1zICgpIHtcbiAgICByZXR1cm4gdGhpcy5faXRlbXNcbiAgfVxuXG4gIEBJbnB1dCgpIGxhYmVsUGFyYW0gPSAndGV4dCdcbiAgQElucHV0KCkgc2VsZWN0ZWRJdGVtID0gbnVsbFxuICBAT3V0cHV0KCkgaXRlbVNlbGVjdGVkID0gbmV3IEV2ZW50RW1pdHRlcigpXG4gIEBWaWV3Q2hpbGQoJ2NvbnRhaW5lcicsIHsgcmVhZDogRWxlbWVudFJlZiwgc3RhdGljOiB0cnVlIH0pIGNvbnRhaW5lciE6IEVsZW1lbnRSZWZcbiAgcHVibGljIF9uVmlzaWJsZUl0ZW1zOiBudW1iZXIgPSA2XG4gIEBJbnB1dCgpXG4gIHNldCBudW1iZXJPZlZpc2libGVJdGVtcyAodmFsdWU6IG51bWJlcikge1xuICAgIGlmICghaXNOYU4ocGFyc2VJbnQodmFsdWUudG9TdHJpbmcoKSwgMTApKSkge1xuICAgICAgdGhpcy5fblZpc2libGVJdGVtcyA9IHZhbHVlXG4gICAgICB0aGlzLnNldEhlaWdodCgpXG4gICAgfVxuICB9XG5cbiAgZ2V0IG51bWJlck9mVmlzaWJsZUl0ZW1zICgpIHtcbiAgICByZXR1cm4gdGhpcy5fblZpc2libGVJdGVtc1xuICB9XG5cbiAgaGVpZ2h0ID0gMFxuICBASW5wdXQoKSB3aWR0aD86IG51bWJlclxuICBoaWRkZW4gPSB0cnVlXG4gIGl0ZW1IZWlnaHQgPSAyNVxuXG4gIGNvbnN0cnVjdG9yIChwdWJsaWMgaG9zdDogRWxlbWVudFJlZikge1xuICB9XG5cbiAgbmdPbkluaXQgKCkge1xuICAgIHRoaXMuc2V0RGltZW5zaW9ucygpXG4gIH1cblxuICBwdWJsaWMgc2V0RGltZW5zaW9ucyAoKSB7XG4gICAgdGhpcy5zZXRIZWlnaHQoKVxuICAgIHRoaXMuc2V0V2lkdGgoKVxuICB9XG5cbiAgcHVibGljIHNldEhlaWdodCAoKSB7XG4gICAgY29uc3QgbG93ZXN0ID0gTWF0aC5taW4odGhpcy5fblZpc2libGVJdGVtcywgdGhpcy5pdGVtcy5sZW5ndGgpXG4gICAgdGhpcy5oZWlnaHQgPSBsb3dlc3QgKiB0aGlzLml0ZW1IZWlnaHQgKyAodGhpcy5udW1iZXJPZlZpc2libGVJdGVtcyA8IHRoaXMuaXRlbXMubGVuZ3RoID8gdGhpcy5pdGVtSGVpZ2h0IC8gMiA6IDApXG4gICAgdGhpcy5ob3N0Lm5hdGl2ZUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5oZWlnaHR9cHhgXG4gIH1cblxuICBwdWJsaWMgc2V0V2lkdGggKCkge1xuICAgIGlmICh0aGlzLndpZHRoKSB7XG4gICAgICB0aGlzLmhvc3QubmF0aXZlRWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLmhlaWdodH1weGBcbiAgICB9XG4gIH1cblxuICBzZWxlY3RJdGVtIChpdGVtOiBhbnkpIHtcbiAgICB0aGlzLnNlbGVjdGVkSXRlbSA9IGl0ZW1cbiAgICB0aGlzLml0ZW1TZWxlY3RlZC5lbWl0KGl0ZW0pXG4gIH1cbn1cbiIsIjxlcW0tY29udGFpbmVyIGNsYXNzPVwiY29udGFpbmVyXCIgI2NvbnRhaW5lcj5cbiAgPGNkay12aXJ0dWFsLXNjcm9sbC12aWV3cG9ydCBbaXRlbVNpemVdPVwiaXRlbUhlaWdodFwiIFttaW5CdWZmZXJQeF09XCI0MDBcIiBbbWF4QnVmZmVyUHhdPVwiODAwXCIgc3R5bGU9XCJoZWlnaHQ6IDEwMCU7IHdpZHRoOiAxMDAlXCIgPlxuICAgIDxkaXYgKmNka1ZpcnR1YWxGb3I9XCJsZXQgaXRlbSBvZiBpdGVtc1wiIFtjbGFzc109XCInaXRlbScgKyAoaXRlbSA9PSBzZWxlY3RlZEl0ZW0gPyAnIHNlbGVjdGVkJyA6ICcnKVwiIChjbGljayk9XCJzZWxlY3RJdGVtKGl0ZW0pXCIgW3N0eWxlLmhlaWdodC5weF09XCJpdGVtSGVpZ2h0IC0gNlwiPlxuICAgICAgPGVxbS1pY29uICpuZ0lmPVwiaXRlbS5pY29uXCIgW25hbWVdPVwiaXRlbS5pY29uXCIgY2xhc3M9XCJpY29uXCI+PC9lcW0taWNvbj48ZXFtLWxhYmVsPnt7aXRlbVtsYWJlbFBhcmFtXX19PC9lcW0tbGFiZWw+XG4gICAgPC9kaXY+XG4gIDwvY2RrLXZpcnR1YWwtc2Nyb2xsLXZpZXdwb3J0PlxuPC9lcW0tY29udGFpbmVyPlxuIl19
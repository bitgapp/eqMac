import { OnInit, EventEmitter, ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class SelectBoxComponent implements OnInit {
    host: ElementRef;
    _items: any[];
    set items(newItems: any[]);
    get items(): any[];
    labelParam: string;
    selectedItem: any;
    itemSelected: EventEmitter<any>;
    container: ElementRef;
    _nVisibleItems: number;
    set numberOfVisibleItems(value: number);
    get numberOfVisibleItems(): number;
    height: number;
    width?: number;
    hidden: boolean;
    itemHeight: number;
    constructor(host: ElementRef);
    ngOnInit(): void;
    setDimensions(): void;
    setHeight(): void;
    setWidth(): void;
    selectItem(item: any): void;
    static ɵfac: i0.ɵɵFactoryDef<SelectBoxComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<SelectBoxComponent, "eqm-select-box", never, { "items": "items"; "labelParam": "labelParam"; "selectedItem": "selectedItem"; "numberOfVisibleItems": "numberOfVisibleItems"; "width": "width"; }, { "itemSelected": "itemSelected"; }, never, never>;
}
//# sourceMappingURL=select-box.component.d.ts.map
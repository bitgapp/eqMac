import { OnInit, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { SelectBoxComponent } from '../select-box/select-box.component';
import { UtilitiesService } from '../../services/utilities.service';
import * as ɵngcc0 from '@angular/core';
export declare class DropdownComponent implements OnInit {
    utils: UtilitiesService;
    zone: NgZone;
    ref: ElementRef;
    constructor(utils: UtilitiesService, zone: NgZone, ref: ElementRef);
    _items: any[];
    editable: boolean;
    get items(): any[];
    set items(newItems: any[]);
    refChanged: EventEmitter<DropdownComponent>;
    disabled: boolean;
    selectedItem: any;
    selectedItemChange: EventEmitter<any>;
    labelParam: string;
    numberOfVisibleItems: number;
    placeholder: string;
    noItemsPlaceholder: string;
    closeOnSelect: boolean;
    searchable: boolean;
    itemSelected: EventEmitter<any>;
    container: ElementRef;
    box: ElementRef;
    boxComponent: SelectBoxComponent;
    shown: boolean;
    yCoordinate: number;
    forceDirection?: 'down' | 'up';
    direction: 'down' | 'up';
    padding: number;
    ngOnInit(): Promise<void>;
    setDimensions(): void;
    calculateYCoordinate(): void;
    toggle(event: MouseEvent): Promise<void>;
    open(): Promise<void>;
    close(): Promise<void>;
    selectItem(item: any): void;
    searchText?: string;
    keypress(event: KeyboardEvent): void;
    get filteredItems(): any[];
    static ɵfac: ɵngcc0.ɵɵFactoryDef<DropdownComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<DropdownComponent, "eqm-dropdown", never, { "editable": "editable"; "disabled": "disabled"; "selectedItem": "selectedItem"; "labelParam": "labelParam"; "numberOfVisibleItems": "numberOfVisibleItems"; "placeholder": "placeholder"; "noItemsPlaceholder": "noItemsPlaceholder"; "closeOnSelect": "closeOnSelect"; "searchable": "searchable"; "items": "items"; "forceDirection": "forceDirection"; }, { "refChanged": "refChanged"; "selectedItemChange": "selectedItemChange"; "itemSelected": "itemSelected"; }, never, never>;
}

//# sourceMappingURL=dropdown.component.d.ts.map
import { QueryList, ElementRef, TemplateRef, AfterViewInit, EventEmitter, OnDestroy } from '@angular/core';
import { AnimationFactory, AnimationBuilder } from '@angular/animations';
import * as i0 from "@angular/core";
export declare class CarouselItemDirective {
    template: TemplateRef<any>;
    eqmCarouselItem?: string;
    constructor(template: TemplateRef<any>);
    static ɵfac: i0.ɵɵFactoryDef<CarouselItemDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDefWithMeta<CarouselItemDirective, "[eqmCarouselItem]", never, { "eqmCarouselItem": "eqmCarouselItem"; }, {}, never>;
}
export declare class CarouselItemElement {
    static ɵfac: i0.ɵɵFactoryDef<CarouselItemElement, never>;
    static ɵdir: i0.ɵɵDirectiveDefWithMeta<CarouselItemElement, ".item", never, {}, {}, never>;
}
export declare class CarouselComponent implements AfterViewInit, OnDestroy {
    builder: AnimationBuilder;
    items: QueryList<CarouselItemDirective>;
    itemElems: QueryList<ElementRef>;
    wrapper: ElementRef;
    loop: boolean;
    animationDuration: number;
    _height: number;
    get height(): number;
    set height(newHeight: number);
    heightDiff: EventEmitter<number>;
    heightChange: EventEmitter<number>;
    recalculateHeightTimer?: number;
    _selectedItemId?: string;
    set selectedItemId(newSelectedItemId: string);
    get selectedItemId(): string;
    selectedItemIdChange: EventEmitter<string>;
    animationCompleted: EventEmitter<string>;
    itemCameIntoView: EventEmitter<string>;
    constructor(builder: AnimationBuilder);
    get wrapperStyle(): {
        height: string;
        transitionDuration: string;
        width: string;
    };
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    get currentIndex(): number;
    next(): void;
    prev(): void;
    animate(): void;
    get animation(): AnimationFactory;
    recalculateHeight(): void;
    static ɵfac: i0.ɵɵFactoryDef<CarouselComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<CarouselComponent, "eqm-carousel", never, { "loop": "loop"; "animationDuration": "animationDuration"; "selectedItemId": "selectedItemId"; }, { "heightDiff": "heightDiff"; "heightChange": "heightChange"; "selectedItemIdChange": "selectedItemIdChange"; "animationCompleted": "animationCompleted"; "itemCameIntoView": "itemCameIntoView"; }, ["items"], never>;
}
//# sourceMappingURL=carousel.component.d.ts.map
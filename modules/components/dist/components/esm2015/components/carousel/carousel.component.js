import { Component, ContentChildren, Directive, ViewChild, ElementRef, Input, Output, EventEmitter, ViewChildren } from '@angular/core';
import { animate, style } from '@angular/animations';
import * as i0 from "@angular/core";
import * as i1 from "@angular/animations";
import * as i2 from "@angular/common";
const _c0 = ["wrapper"];
function CarouselComponent_ng_container_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainer(0, 3);
} if (rf & 2) {
    const item_r2 = ctx.$implicit;
    i0.ɵɵproperty("ngTemplateOutlet", item_r2.template);
} }
export class CarouselItemDirective {
    constructor(template) {
        this.template = template;
    }
}
CarouselItemDirective.ɵfac = function CarouselItemDirective_Factory(t) { return new (t || CarouselItemDirective)(i0.ɵɵdirectiveInject(i0.TemplateRef)); };
CarouselItemDirective.ɵdir = i0.ɵɵdefineDirective({ type: CarouselItemDirective, selectors: [["", "eqmCarouselItem", ""]], inputs: { eqmCarouselItem: "eqmCarouselItem" } });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CarouselItemDirective, [{
        type: Directive,
        args: [{
                selector: '[eqmCarouselItem]'
            }]
    }], function () { return [{ type: i0.TemplateRef }]; }, { eqmCarouselItem: [{
            type: Input
        }] }); })();
export class CarouselItemElement {
}
CarouselItemElement.ɵfac = function CarouselItemElement_Factory(t) { return new (t || CarouselItemElement)(); };
CarouselItemElement.ɵdir = i0.ɵɵdefineDirective({ type: CarouselItemElement, selectors: [["", 8, "item"]] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CarouselItemElement, [{
        type: Directive,
        args: [{
                selector: '.item'
            }]
    }], null, null); })();
export class CarouselComponent {
    constructor(builder) {
        this.builder = builder;
        this.loop = false;
        this.animationDuration = 500;
        this.heightDiff = new EventEmitter();
        this.heightChange = new EventEmitter();
        this.selectedItemIdChange = new EventEmitter();
        this.animationCompleted = new EventEmitter();
        this.itemCameIntoView = new EventEmitter();
    }
    get height() { return this._height; }
    set height(newHeight) {
        const diff = newHeight - this.height;
        this._height = newHeight;
        if (diff) {
            this.heightChange.emit(newHeight);
            this.heightDiff.emit(diff);
        }
    }
    set selectedItemId(newSelectedItemId) {
        if (this._selectedItemId !== newSelectedItemId) {
            this._selectedItemId = newSelectedItemId;
            this.animate();
        }
        this.recalculateHeight();
        this.itemCameIntoView.emit(this.selectedItemId);
    }
    get selectedItemId() { return this._selectedItemId; }
    get wrapperStyle() {
        return {
            height: `${this.height}px`,
            transitionDuration: `${this.animationDuration}ms`,
            width: `${this.items.length * 100}%`
        };
    }
    ngAfterViewInit() {
        for (const item of this.items.toArray()) {
            if (!item.eqmCarouselItem || typeof item.eqmCarouselItem !== 'string') {
                throw new Error('eqmCarouselItem directive was not provided an item ID');
            }
        }
        this.animate();
        this.recalculateHeight();
        this.recalculateHeightTimer = setInterval(() => this.recalculateHeight(), 1000);
    }
    ngOnDestroy() {
        if (this.recalculateHeightTimer) {
            clearInterval(this.recalculateHeightTimer);
        }
    }
    get currentIndex() {
        const items = this.items.toArray();
        const index = items.indexOf(items.find(item => item.eqmCarouselItem === this.selectedItemId));
        return index >= 0 ? index : 0;
    }
    next() {
        const currentIndex = this.currentIndex;
        if (!this.loop && currentIndex >= this.items.length - 1)
            return;
        const nextIndex = (currentIndex + 1) % this.items.length;
        this.selectedItemId = this.items.toArray()[nextIndex].eqmCarouselItem;
        this.selectedItemIdChange.emit(this.selectedItemId);
    }
    prev() {
        const currentIndex = this.currentIndex;
        if (!this.loop && currentIndex === 0)
            return;
        const previousIndex = ((currentIndex - 1) + this.items.length) % this.items.length;
        this.selectedItemId = this.items.toArray()[previousIndex].eqmCarouselItem;
        this.selectedItemIdChange.emit(this.selectedItemId);
    }
    animate() {
        const myAnimation = this.animation;
        const player = myAnimation.create(this.wrapper.nativeElement);
        player.play();
        setTimeout(() => this.animationCompleted.emit(), this.animationDuration);
    }
    get animation() {
        const offset = this.currentIndex * 100 / this.items.length;
        return this.builder.build([
            animate(`${this.animationDuration}ms ease-in`, style({ transform: `translateX(-${offset}%)` }))
        ]);
    }
    recalculateHeight() {
        var _a;
        const itemEl = (_a = this.itemElems) === null || _a === void 0 ? void 0 : _a.toArray()[this.currentIndex].nativeElement.nextElementSibling;
        (itemEl === null || itemEl === void 0 ? void 0 : itemEl.offsetHeight) && (this.height = itemEl.offsetHeight);
    }
}
CarouselComponent.ɵfac = function CarouselComponent_Factory(t) { return new (t || CarouselComponent)(i0.ɵɵdirectiveInject(i1.AnimationBuilder)); };
CarouselComponent.ɵcmp = i0.ɵɵdefineComponent({ type: CarouselComponent, selectors: [["eqm-carousel"]], contentQueries: function CarouselComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
        i0.ɵɵcontentQuery(dirIndex, CarouselItemDirective, 0);
    } if (rf & 2) {
        let _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.items = _t);
    } }, viewQuery: function CarouselComponent_Query(rf, ctx) { if (rf & 1) {
        i0.ɵɵviewQuery(_c0, 3);
        i0.ɵɵviewQuery(CarouselItemElement, 1, ElementRef);
    } if (rf & 2) {
        let _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.wrapper = _t.first);
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.itemElems = _t);
    } }, inputs: { loop: "loop", animationDuration: "animationDuration", selectedItemId: "selectedItemId" }, outputs: { heightDiff: "heightDiff", heightChange: "heightChange", selectedItemIdChange: "selectedItemIdChange", animationCompleted: "animationCompleted", itemCameIntoView: "itemCameIntoView" }, decls: 3, vars: 2, consts: [[1, "wrapper", 3, "ngStyle"], ["wrapper", ""], ["class", "item", 3, "ngTemplateOutlet", 4, "ngFor", "ngForOf"], [1, "item", 3, "ngTemplateOutlet"]], template: function CarouselComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "div", 0, 1);
        i0.ɵɵtemplate(2, CarouselComponent_ng_container_2_Template, 1, 1, "ng-container", 2);
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵproperty("ngStyle", ctx.wrapperStyle);
        i0.ɵɵadvance(2);
        i0.ɵɵproperty("ngForOf", ctx.items);
    } }, directives: [i2.NgStyle, i2.NgForOf, CarouselItemElement, i2.NgTemplateOutlet], styles: ["[_nghost-%COMP%]{width:100%;min-width:100px;overflow:hidden}[_nghost-%COMP%]   .wrapper[_ngcontent-%COMP%]{display:flex;width:100%;flex-direction:row;align-items:center;transition-property:height;transition-timing-function:ease-in-out}[_nghost-%COMP%]   .wrapper[_ngcontent-%COMP%]   .item[_ngcontent-%COMP%]{width:100%}"] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CarouselComponent, [{
        type: Component,
        args: [{
                selector: 'eqm-carousel',
                templateUrl: './carousel.component.html',
                styleUrls: ['./carousel.component.scss']
            }]
    }], function () { return [{ type: i1.AnimationBuilder }]; }, { items: [{
            type: ContentChildren,
            args: [CarouselItemDirective]
        }], itemElems: [{
            type: ViewChildren,
            args: [CarouselItemElement, { read: ElementRef }]
        }], wrapper: [{
            type: ViewChild,
            args: ['wrapper', { static: true }]
        }], loop: [{
            type: Input
        }], animationDuration: [{
            type: Input
        }], heightDiff: [{
            type: Output
        }], heightChange: [{
            type: Output
        }], selectedItemId: [{
            type: Input
        }], selectedItemIdChange: [{
            type: Output
        }], animationCompleted: [{
            type: Output
        }], itemCameIntoView: [{
            type: Output
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Fyb3VzZWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvY29tcG9uZW50cy9jYXJvdXNlbC9jYXJvdXNlbC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL2Nhcm91c2VsL2Nhcm91c2VsLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFhLFNBQVMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBOEIsTUFBTSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQWEsTUFBTSxlQUFlLENBQUE7QUFDekwsT0FBTyxFQUFvQixPQUFPLEVBQUUsS0FBSyxFQUFvQixNQUFNLHFCQUFxQixDQUFBOzs7Ozs7SUNBdEYsMkJBQXlHOzs7SUFBbEQsbURBQWtDOztBREszRixNQUFNLE9BQU8scUJBQXFCO0lBR2hDLFlBQ1MsUUFBMEI7UUFBMUIsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7SUFHbkMsQ0FBQzs7MEZBUFUscUJBQXFCOzBEQUFyQixxQkFBcUI7dUZBQXJCLHFCQUFxQjtjQUhqQyxTQUFTO2VBQUM7Z0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjthQUM5Qjs4REFFVSxlQUFlO2tCQUF2QixLQUFLOztBQVlSLE1BQU0sT0FBTyxtQkFBbUI7O3NGQUFuQixtQkFBbUI7d0RBQW5CLG1CQUFtQjt1RkFBbkIsbUJBQW1CO2NBSC9CLFNBQVM7ZUFBQztnQkFDVCxRQUFRLEVBQUUsT0FBTzthQUNsQjs7QUFTRCxNQUFNLE9BQU8saUJBQWlCO0lBb0M1QixZQUNTLE9BQXlCO1FBQXpCLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBakN6QixTQUFJLEdBQUcsS0FBSyxDQUFBO1FBQ1osc0JBQWlCLEdBQUcsR0FBRyxDQUFBO1FBWXRCLGVB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RSxZQUFZO21CQUFDLG1CQUFtQixFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNmLE9BQU87a0JBQTlDLFNBQVM7bUJBQUMsU0FBUyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtZQUM3QixJQUFJO2tCQUFaLEtBQUs7WUFDRyxpQkFBaUI7a0JBQXpCLEtBQUs7WUFZSSxVQUFVO2tCQUFuQixNQUFNO1lBQ0csWUFBWTtrQkFBckIsTUFBTTtZQUlNLGNBQWM7a0JBQTFCLEtBQUs7WUFVSSxvQkFBb0I7a0JBQTdCLE1BQU07WUFDRyxrQkFBa0I7a0JBQTNCLE1BQU07WUFFRyxnQkFBZ0I7a0JBQXpCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIENvbnRlbnRDaGlsZHJlbiwgUXVlcnlMaXN0LCBEaXJlY3RpdmUsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgSW5wdXQsIFRlbXBsYXRlUmVmLCBBZnRlclZpZXdJbml0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgVmlld0NoaWxkcmVuLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuaW1wb3J0IHsgQW5pbWF0aW9uRmFjdG9yeSwgYW5pbWF0ZSwgc3R5bGUsIEFuaW1hdGlvbkJ1aWxkZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJ1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbZXFtQ2Fyb3VzZWxJdGVtXSdcbn0pXG5leHBvcnQgY2xhc3MgQ2Fyb3VzZWxJdGVtRGlyZWN0aXZlIHtcbiAgQElucHV0KCkgZXFtQ2Fyb3VzZWxJdGVtPzogc3RyaW5nXG5cbiAgY29uc3RydWN0b3IgKFxuICAgIHB1YmxpYyB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PlxuICApIHtcblxuICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJy5pdGVtJ1xufSlcbmV4cG9ydCBjbGFzcyBDYXJvdXNlbEl0ZW1FbGVtZW50IHtcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZXFtLWNhcm91c2VsJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2Nhcm91c2VsLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbICcuL2Nhcm91c2VsLmNvbXBvbmVudC5zY3NzJyBdXG59KVxuZXhwb3J0IGNsYXNzIENhcm91c2VsQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgQENvbnRlbnRDaGlsZHJlbihDYXJvdXNlbEl0ZW1EaXJlY3RpdmUpIGl0ZW1zITogUXVlcnlMaXN0PENhcm91c2VsSXRlbURpcmVjdGl2ZT5cbiAgQFZpZXdDaGlsZHJlbihDYXJvdXNlbEl0ZW1FbGVtZW50LCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSkgaXRlbUVsZW1zITogUXVlcnlMaXN0PEVsZW1lbnRSZWY+XG4gIEBWaWV3Q2hpbGQoJ3dyYXBwZXInLCB7IHN0YXRpYzogdHJ1ZSB9KSB3cmFwcGVyITogRWxlbWVudFJlZlxuICBASW5wdXQoKSBsb29wID0gZmFsc2VcbiAgQElucHV0KCkgYW5pbWF0aW9uRHVyYXRpb24gPSA1MDBcbiAgX2hlaWdodCE6IG51bWJlclxuICBnZXQgaGVpZ2h0ICgpIHsgcmV0dXJuIHRoaXMuX2hlaWdodCB9XG4gIHNldCBoZWlnaHQgKG5ld0hlaWdodDogbnVtYmVyKSB7XG4gICAgY29uc3QgZGlmZiA9IG5ld0hlaWdodCAtIHRoaXMuaGVpZ2h0XG4gICAgdGhpcy5faGVpZ2h0ID0gbmV3SGVpZ2h0XG4gICAgaWYgKGRpZmYpIHtcbiAgICAgIHRoaXMuaGVpZ2h0Q2hhbmdlLmVtaXQobmV3SGVpZ2h0KVxuICAgICAgdGhpcy5oZWlnaHREaWZmLmVtaXQoZGlmZilcbiAgICB9XG4gIH1cblxuICBAT3V0cHV0KCkgaGVpZ2h0RGlmZiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpXG4gIEBPdXRwdXQoKSBoZWlnaHRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKVxuICBwdWJsaWMgcmVjYWxjdWxhdGVIZWlnaHRUaW1lcj86IG51bWJlclxuXG4gIHB1YmxpYyBfc2VsZWN0ZWRJdGVtSWQ/OiBzdHJpbmdcbiAgQElucHV0KCkgc2V0IHNlbGVjdGVkSXRlbUlkIChuZXdTZWxlY3RlZEl0ZW1JZDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkSXRlbUlkICE9PSBuZXdTZWxlY3RlZEl0ZW1JZCkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWRJdGVtSWQgPSBuZXdTZWxlY3RlZEl0ZW1JZFxuICAgICAgdGhpcy5hbmltYXRlKClcbiAgICB9XG4gICAgdGhpcy5yZWNhbGN1bGF0ZUhlaWdodCgpXG4gICAgdGhpcy5pdGVtQ2FtZUludG9WaWV3LmVtaXQodGhpcy5zZWxlY3RlZEl0ZW1JZClcbiAgfVxuXG4gIGdldCBzZWxlY3RlZEl0ZW1JZCAoKSB7IHJldHVybiB0aGlzLl9zZWxlY3RlZEl0ZW1JZCBhcyBhbnkgfVxuICBAT3V0cHV0KCkgc2VsZWN0ZWRJdGVtSWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKVxuICBAT3V0cHV0KCkgYW5pbWF0aW9uQ29tcGxldGVkID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KClcblxuICBAT3V0cHV0KCkgaXRlbUNhbWVJbnRvVmlldyA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpXG4gIGNvbnN0cnVjdG9yIChcbiAgICBwdWJsaWMgYnVpbGRlcjogQW5pbWF0aW9uQnVpbGRlclxuICApIHtcbiAgfVxuXG4gIGdldCB3cmFwcGVyU3R5bGUgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBoZWlnaHQ6IGAke3RoaXMuaGVpZ2h0fXB4YCxcbiAgICAgIHRyYW5zaXRpb25EdXJhdGlvbjogYCR7dGhpcy5hbmltYXRpb25EdXJhdGlvbn1tc2AsXG4gICAgICB3aWR0aDogYCR7dGhpcy5pdGVtcy5sZW5ndGggKiAxMDB9JWBcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQgKCkge1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZW1zLnRvQXJyYXkoKSkge1xuICAgICAgaWYgKCFpdGVtLmVxbUNhcm91c2VsSXRlbSB8fCB0eXBlb2YgaXRlbS5lcW1DYXJvdXNlbEl0ZW0gIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZXFtQ2Fyb3VzZWxJdGVtIGRpcmVjdGl2ZSB3YXMgbm90IHByb3ZpZGVkIGFuIGl0ZW0gSUQnKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYW5pbWF0ZSgpXG4gICAgdGhpcy5yZWNhbGN1bGF0ZUhlaWdodCgpXG4gICAgdGhpcy5yZWNhbGN1bGF0ZUhlaWdodFRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4gdGhpcy5yZWNhbGN1bGF0ZUhlaWdodCgpLCAxMDAwKSBhcyBhbnlcbiAgfVxuXG4gIG5nT25EZXN0cm95ICgpIHtcbiAgICBpZiAodGhpcy5yZWNhbGN1bGF0ZUhlaWdodFRpbWVyKSB7XG4gICAgICBjbGVhckludGVydmFsKHRoaXMucmVjYWxjdWxhdGVIZWlnaHRUaW1lcilcbiAgICB9XG4gIH1cblxuICBnZXQgY3VycmVudEluZGV4ICgpIHtcbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuaXRlbXMudG9BcnJheSgpXG4gICAgY29uc3QgaW5kZXggPSBpdGVtcy5pbmRleE9mKGl0ZW1zLmZpbmQoaXRlbSA9PiBpdGVtLmVxbUNhcm91c2VsSXRlbSA9PT0gdGhpcy5zZWxlY3RlZEl0ZW1JZCkpXG4gICAgcmV0dXJuIGluZGV4ID49IDAgPyBpbmRleCA6IDBcbiAgfVxuXG4gIG5leHQgKCkge1xuICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHRoaXMuY3VycmVudEluZGV4XG4gICAgaWYgKCF0aGlzLmxvb3AgJiYgY3VycmVudEluZGV4ID49IHRoaXMuaXRlbXMubGVuZ3RoIC0gMSkgcmV0dXJuXG4gICAgY29uc3QgbmV4dEluZGV4ID0gKGN1cnJlbnRJbmRleCArIDEpICUgdGhpcy5pdGVtcy5sZW5ndGhcbiAgICB0aGlzLnNlbGVjdGVkSXRlbUlkID0gdGhpcy5pdGVtcy50b0FycmF5KClbbmV4dEluZGV4XS5lcW1DYXJvdXNlbEl0ZW1cbiAgICB0aGlzLnNlbGVjdGVkSXRlbUlkQ2hhbmdlLmVtaXQodGhpcy5zZWxlY3RlZEl0ZW1JZClcbiAgfVxuXG4gIHByZXYgKCkge1xuICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHRoaXMuY3VycmVudEluZGV4XG4gICAgaWYgKCF0aGlzLmxvb3AgJiYgY3VycmVudEluZGV4ID09PSAwKSByZXR1cm5cbiAgICBjb25zdCBwcmV2aW91c0luZGV4ID0gKChjdXJyZW50SW5kZXggLSAxKSArIHRoaXMuaXRlbXMubGVuZ3RoKSAlIHRoaXMuaXRlbXMubGVuZ3RoXG4gICAgdGhpcy5zZWxlY3RlZEl0ZW1JZCA9IHRoaXMuaXRlbXMudG9BcnJheSgpW3ByZXZpb3VzSW5kZXhdLmVxbUNhcm91c2VsSXRlbVxuICAgIHRoaXMuc2VsZWN0ZWRJdGVtSWRDaGFuZ2UuZW1pdCh0aGlzLnNlbGVjdGVkSXRlbUlkKVxuICB9XG5cbiAgcHVibGljIGFuaW1hdGUgKCkge1xuICAgIGNvbnN0IG15QW5pbWF0aW9uOiBBbmltYXRpb25GYWN0b3J5ID0gdGhpcy5hbmltYXRpb25cbiAgICBjb25zdCBwbGF5ZXIgPSBteUFuaW1hdGlvbi5jcmVhdGUodGhpcy53cmFwcGVyLm5hdGl2ZUVsZW1lbnQpXG4gICAgcGxheWVyLnBsYXkoKVxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5hbmltYXRpb25Db21wbGV0ZWQuZW1pdCgpLCB0aGlzLmFuaW1hdGlvbkR1cmF0aW9uKVxuICB9XG5cbiAgcHVibGljIGdldCBhbmltYXRpb24gKCkge1xuICAgIGNvbnN0IG9mZnNldCA9IHRoaXMuY3VycmVudEluZGV4ICogMTAwIC8gdGhpcy5pdGVtcy5sZW5ndGhcbiAgICByZXR1cm4gdGhpcy5idWlsZGVyLmJ1aWxkKFtcbiAgICAgIGFuaW1hdGUoYCR7dGhpcy5hbmltYXRpb25EdXJhdGlvbn1tcyBlYXNlLWluYCwgc3R5bGUoeyB0cmFuc2Zvcm06IGB0cmFuc2xhdGVYKC0ke29mZnNldH0lKWAgfSkpXG4gICAgXSlcbiAgfVxuXG4gIHB1YmxpYyByZWNhbGN1bGF0ZUhlaWdodCAoKSB7XG4gICAgY29uc3QgaXRlbUVsID0gdGhpcy5pdGVtRWxlbXM/LnRvQXJyYXkoKVt0aGlzLmN1cnJlbnRJbmRleF0ubmF0aXZlRWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmdcbiAgICBpdGVtRWw/Lm9mZnNldEhlaWdodCAmJiAodGhpcy5oZWlnaHQgPSBpdGVtRWwub2Zmc2V0SGVpZ2h0KVxuICB9XG59XG4iLCI8ZGl2IGNsYXNzPVwid3JhcHBlclwiIFtuZ1N0eWxlXT1cIndyYXBwZXJTdHlsZVwiICN3cmFwcGVyPlxuICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBpdGVtIG9mIGl0ZW1zO1wiIGNsYXNzPVwiaXRlbVwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIml0ZW0udGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbjwvZGl2PlxuIl19
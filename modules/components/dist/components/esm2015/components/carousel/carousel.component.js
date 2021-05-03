import { Component, ContentChildren, Directive, ViewChild, ElementRef, Input, TemplateRef, Output, EventEmitter, ViewChildren } from '@angular/core';
import { animate, style, AnimationBuilder } from '@angular/animations';
export class CarouselItemDirective {
    constructor(template) {
        this.template = template;
    }
}
CarouselItemDirective.decorators = [
    { type: Directive, args: [{
                selector: '[eqmCarouselItem]'
            },] }
];
CarouselItemDirective.ctorParameters = () => [
    { type: TemplateRef }
];
CarouselItemDirective.propDecorators = {
    eqmCarouselItem: [{ type: Input }]
};
export class CarouselItemElement {
}
CarouselItemElement.decorators = [
    { type: Directive, args: [{
                selector: '.item'
            },] }
];
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
CarouselComponent.decorators = [
    { type: Component, args: [{
                selector: 'eqm-carousel',
                template: "<div class=\"wrapper\" [ngStyle]=\"wrapperStyle\" #wrapper>\n  <ng-container *ngFor=\"let item of items;\" class=\"item\" [ngTemplateOutlet]=\"item.template\"></ng-container>\n</div>\n",
                styles: [":host{width:100%;min-width:100px;overflow:hidden}:host .wrapper{display:flex;width:100%;flex-direction:row;align-items:center;transition-property:height;transition-timing-function:ease-in-out}:host .wrapper .item{width:100%}"]
            },] }
];
CarouselComponent.ctorParameters = () => [
    { type: AnimationBuilder }
];
CarouselComponent.propDecorators = {
    items: [{ type: ContentChildren, args: [CarouselItemDirective,] }],
    itemElems: [{ type: ViewChildren, args: [CarouselItemElement, { read: ElementRef },] }],
    wrapper: [{ type: ViewChild, args: ['wrapper', { static: true },] }],
    loop: [{ type: Input }],
    animationDuration: [{ type: Input }],
    heightDiff: [{ type: Output }],
    heightChange: [{ type: Output }],
    selectedItemId: [{ type: Input }],
    selectedItemIdChange: [{ type: Output }],
    animationCompleted: [{ type: Output }],
    itemCameIntoView: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Fyb3VzZWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvY29tcG9uZW50cy9jYXJvdXNlbC9jYXJvdXNlbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQWEsU0FBUyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBaUIsTUFBTSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQWEsTUFBTSxlQUFlLENBQUE7QUFDekwsT0FBTyxFQUFvQixPQUFPLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLE1BQU0scUJBQXFCLENBQUE7QUFLeEYsTUFBTSxPQUFPLHFCQUFxQjtJQUdoQyxZQUNTLFFBQTBCO1FBQTFCLGFBQVEsR0FBUixRQUFRLENBQWtCO0lBR25DLENBQUM7OztZQVZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsbUJBQW1CO2FBQzlCOzs7WUFMd0YsV0FBVzs7OzhCQU9qRyxLQUFLOztBQVlSLE1BQU0sT0FBTyxtQkFBbUI7OztZQUgvQixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLE9BQU87YUFDbEI7O0FBU0QsTUFBTSxPQUFPLGlCQUFpQjtJQW9DNUIsWUFDUyxPQUF5QjtRQUF6QixZQUFPLEdBQVAsT0FBTyxDQUFrQjtRQWpDekIsU0FBSSxHQUFHLEtBQUssQ0FBQTtRQUNaLHNCQUFpQixHQUFHLEdBQUcsQ0FBQTtRQVl0QixlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQTtRQUN2QyxpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFVLENBQUE7UUFjekMseUJBQW9CLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQTtRQUNqRCx1QkFBa0IsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFBO1FBRS9DLHFCQUFnQixHQUFHLElBQUksWUFBWSxFQUFVLENB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QTtRQUMxRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1lBQ3hCLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsWUFBWSxFQUFFLEtBQUssQ0FBQyxFQUFFLFNBQVMsRUFBRSxlQUFlLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQztTQUNoRyxDQUFDLENBQUE7SUFDSixDQUFDO0lBRU0saUJBQWlCOztRQUN0QixNQUFNLE1BQU0sU0FBRyxJQUFJLENBQUMsU0FBUywwQ0FBRSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUMsa0JBQWtCLENBQUE7UUFDNUYsQ0FBQSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsWUFBWSxLQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUE7SUFDN0QsQ0FBQzs7O1lBL0dGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsb01BQXdDOzthQUV6Qzs7O1lBekIwQyxnQkFBZ0I7OztvQkEyQnhELGVBQWUsU0FBQyxxQkFBcUI7d0JBQ3JDLFlBQVksU0FBQyxtQkFBbUIsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7c0JBQ3RELFNBQVMsU0FBQyxTQUFTLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO21CQUNyQyxLQUFLO2dDQUNMLEtBQUs7eUJBWUwsTUFBTTsyQkFDTixNQUFNOzZCQUlOLEtBQUs7bUNBVUwsTUFBTTtpQ0FDTixNQUFNOytCQUVOLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIENvbnRlbnRDaGlsZHJlbiwgUXVlcnlMaXN0LCBEaXJlY3RpdmUsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgSW5wdXQsIFRlbXBsYXRlUmVmLCBBZnRlclZpZXdJbml0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgVmlld0NoaWxkcmVuLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuaW1wb3J0IHsgQW5pbWF0aW9uRmFjdG9yeSwgYW5pbWF0ZSwgc3R5bGUsIEFuaW1hdGlvbkJ1aWxkZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJ1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbZXFtQ2Fyb3VzZWxJdGVtXSdcbn0pXG5leHBvcnQgY2xhc3MgQ2Fyb3VzZWxJdGVtRGlyZWN0aXZlIHtcbiAgQElucHV0KCkgZXFtQ2Fyb3VzZWxJdGVtPzogc3RyaW5nXG5cbiAgY29uc3RydWN0b3IgKFxuICAgIHB1YmxpYyB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PlxuICApIHtcblxuICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJy5pdGVtJ1xufSlcbmV4cG9ydCBjbGFzcyBDYXJvdXNlbEl0ZW1FbGVtZW50IHtcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZXFtLWNhcm91c2VsJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2Nhcm91c2VsLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbICcuL2Nhcm91c2VsLmNvbXBvbmVudC5zY3NzJyBdXG59KVxuZXhwb3J0IGNsYXNzIENhcm91c2VsQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgQENvbnRlbnRDaGlsZHJlbihDYXJvdXNlbEl0ZW1EaXJlY3RpdmUpIGl0ZW1zITogUXVlcnlMaXN0PENhcm91c2VsSXRlbURpcmVjdGl2ZT5cbiAgQFZpZXdDaGlsZHJlbihDYXJvdXNlbEl0ZW1FbGVtZW50LCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSkgaXRlbUVsZW1zITogUXVlcnlMaXN0PEVsZW1lbnRSZWY+XG4gIEBWaWV3Q2hpbGQoJ3dyYXBwZXInLCB7IHN0YXRpYzogdHJ1ZSB9KSB3cmFwcGVyITogRWxlbWVudFJlZlxuICBASW5wdXQoKSBsb29wID0gZmFsc2VcbiAgQElucHV0KCkgYW5pbWF0aW9uRHVyYXRpb24gPSA1MDBcbiAgX2hlaWdodCE6IG51bWJlclxuICBnZXQgaGVpZ2h0ICgpIHsgcmV0dXJuIHRoaXMuX2hlaWdodCB9XG4gIHNldCBoZWlnaHQgKG5ld0hlaWdodDogbnVtYmVyKSB7XG4gICAgY29uc3QgZGlmZiA9IG5ld0hlaWdodCAtIHRoaXMuaGVpZ2h0XG4gICAgdGhpcy5faGVpZ2h0ID0gbmV3SGVpZ2h0XG4gICAgaWYgKGRpZmYpIHtcbiAgICAgIHRoaXMuaGVpZ2h0Q2hhbmdlLmVtaXQobmV3SGVpZ2h0KVxuICAgICAgdGhpcy5oZWlnaHREaWZmLmVtaXQoZGlmZilcbiAgICB9XG4gIH1cblxuICBAT3V0cHV0KCkgaGVpZ2h0RGlmZiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpXG4gIEBPdXRwdXQoKSBoZWlnaHRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKVxuICBwdWJsaWMgcmVjYWxjdWxhdGVIZWlnaHRUaW1lcj86IG51bWJlclxuXG4gIHB1YmxpYyBfc2VsZWN0ZWRJdGVtSWQ/OiBzdHJpbmdcbiAgQElucHV0KCkgc2V0IHNlbGVjdGVkSXRlbUlkIChuZXdTZWxlY3RlZEl0ZW1JZDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkSXRlbUlkICE9PSBuZXdTZWxlY3RlZEl0ZW1JZCkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWRJdGVtSWQgPSBuZXdTZWxlY3RlZEl0ZW1JZFxuICAgICAgdGhpcy5hbmltYXRlKClcbiAgICB9XG4gICAgdGhpcy5yZWNhbGN1bGF0ZUhlaWdodCgpXG4gICAgdGhpcy5pdGVtQ2FtZUludG9WaWV3LmVtaXQodGhpcy5zZWxlY3RlZEl0ZW1JZClcbiAgfVxuXG4gIGdldCBzZWxlY3RlZEl0ZW1JZCAoKSB7IHJldHVybiB0aGlzLl9zZWxlY3RlZEl0ZW1JZCBhcyBhbnkgfVxuICBAT3V0cHV0KCkgc2VsZWN0ZWRJdGVtSWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKVxuICBAT3V0cHV0KCkgYW5pbWF0aW9uQ29tcGxldGVkID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KClcblxuICBAT3V0cHV0KCkgaXRlbUNhbWVJbnRvVmlldyA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpXG4gIGNvbnN0cnVjdG9yIChcbiAgICBwdWJsaWMgYnVpbGRlcjogQW5pbWF0aW9uQnVpbGRlclxuICApIHtcbiAgfVxuXG4gIGdldCB3cmFwcGVyU3R5bGUgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBoZWlnaHQ6IGAke3RoaXMuaGVpZ2h0fXB4YCxcbiAgICAgIHRyYW5zaXRpb25EdXJhdGlvbjogYCR7dGhpcy5hbmltYXRpb25EdXJhdGlvbn1tc2AsXG4gICAgICB3aWR0aDogYCR7dGhpcy5pdGVtcy5sZW5ndGggKiAxMDB9JWBcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQgKCkge1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZW1zLnRvQXJyYXkoKSkge1xuICAgICAgaWYgKCFpdGVtLmVxbUNhcm91c2VsSXRlbSB8fCB0eXBlb2YgaXRlbS5lcW1DYXJvdXNlbEl0ZW0gIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZXFtQ2Fyb3VzZWxJdGVtIGRpcmVjdGl2ZSB3YXMgbm90IHByb3ZpZGVkIGFuIGl0ZW0gSUQnKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYW5pbWF0ZSgpXG4gICAgdGhpcy5yZWNhbGN1bGF0ZUhlaWdodCgpXG4gICAgdGhpcy5yZWNhbGN1bGF0ZUhlaWdodFRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4gdGhpcy5yZWNhbGN1bGF0ZUhlaWdodCgpLCAxMDAwKSBhcyBhbnlcbiAgfVxuXG4gIG5nT25EZXN0cm95ICgpIHtcbiAgICBpZiAodGhpcy5yZWNhbGN1bGF0ZUhlaWdodFRpbWVyKSB7XG4gICAgICBjbGVhckludGVydmFsKHRoaXMucmVjYWxjdWxhdGVIZWlnaHRUaW1lcilcbiAgICB9XG4gIH1cblxuICBnZXQgY3VycmVudEluZGV4ICgpIHtcbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuaXRlbXMudG9BcnJheSgpXG4gICAgY29uc3QgaW5kZXggPSBpdGVtcy5pbmRleE9mKGl0ZW1zLmZpbmQoaXRlbSA9PiBpdGVtLmVxbUNhcm91c2VsSXRlbSA9PT0gdGhpcy5zZWxlY3RlZEl0ZW1JZCkpXG4gICAgcmV0dXJuIGluZGV4ID49IDAgPyBpbmRleCA6IDBcbiAgfVxuXG4gIG5leHQgKCkge1xuICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHRoaXMuY3VycmVudEluZGV4XG4gICAgaWYgKCF0aGlzLmxvb3AgJiYgY3VycmVudEluZGV4ID49IHRoaXMuaXRlbXMubGVuZ3RoIC0gMSkgcmV0dXJuXG4gICAgY29uc3QgbmV4dEluZGV4ID0gKGN1cnJlbnRJbmRleCArIDEpICUgdGhpcy5pdGVtcy5sZW5ndGhcbiAgICB0aGlzLnNlbGVjdGVkSXRlbUlkID0gdGhpcy5pdGVtcy50b0FycmF5KClbbmV4dEluZGV4XS5lcW1DYXJvdXNlbEl0ZW1cbiAgICB0aGlzLnNlbGVjdGVkSXRlbUlkQ2hhbmdlLmVtaXQodGhpcy5zZWxlY3RlZEl0ZW1JZClcbiAgfVxuXG4gIHByZXYgKCkge1xuICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHRoaXMuY3VycmVudEluZGV4XG4gICAgaWYgKCF0aGlzLmxvb3AgJiYgY3VycmVudEluZGV4ID09PSAwKSByZXR1cm5cbiAgICBjb25zdCBwcmV2aW91c0luZGV4ID0gKChjdXJyZW50SW5kZXggLSAxKSArIHRoaXMuaXRlbXMubGVuZ3RoKSAlIHRoaXMuaXRlbXMubGVuZ3RoXG4gICAgdGhpcy5zZWxlY3RlZEl0ZW1JZCA9IHRoaXMuaXRlbXMudG9BcnJheSgpW3ByZXZpb3VzSW5kZXhdLmVxbUNhcm91c2VsSXRlbVxuICAgIHRoaXMuc2VsZWN0ZWRJdGVtSWRDaGFuZ2UuZW1pdCh0aGlzLnNlbGVjdGVkSXRlbUlkKVxuICB9XG5cbiAgcHVibGljIGFuaW1hdGUgKCkge1xuICAgIGNvbnN0IG15QW5pbWF0aW9uOiBBbmltYXRpb25GYWN0b3J5ID0gdGhpcy5hbmltYXRpb25cbiAgICBjb25zdCBwbGF5ZXIgPSBteUFuaW1hdGlvbi5jcmVhdGUodGhpcy53cmFwcGVyLm5hdGl2ZUVsZW1lbnQpXG4gICAgcGxheWVyLnBsYXkoKVxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5hbmltYXRpb25Db21wbGV0ZWQuZW1pdCgpLCB0aGlzLmFuaW1hdGlvbkR1cmF0aW9uKVxuICB9XG5cbiAgcHVibGljIGdldCBhbmltYXRpb24gKCkge1xuICAgIGNvbnN0IG9mZnNldCA9IHRoaXMuY3VycmVudEluZGV4ICogMTAwIC8gdGhpcy5pdGVtcy5sZW5ndGhcbiAgICByZXR1cm4gdGhpcy5idWlsZGVyLmJ1aWxkKFtcbiAgICAgIGFuaW1hdGUoYCR7dGhpcy5hbmltYXRpb25EdXJhdGlvbn1tcyBlYXNlLWluYCwgc3R5bGUoeyB0cmFuc2Zvcm06IGB0cmFuc2xhdGVYKC0ke29mZnNldH0lKWAgfSkpXG4gICAgXSlcbiAgfVxuXG4gIHB1YmxpYyByZWNhbGN1bGF0ZUhlaWdodCAoKSB7XG4gICAgY29uc3QgaXRlbUVsID0gdGhpcy5pdGVtRWxlbXM/LnRvQXJyYXkoKVt0aGlzLmN1cnJlbnRJbmRleF0ubmF0aXZlRWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmdcbiAgICBpdGVtRWw/Lm9mZnNldEhlaWdodCAmJiAodGhpcy5oZWlnaHQgPSBpdGVtRWwub2Zmc2V0SGVpZ2h0KVxuICB9XG59XG4iXX0=
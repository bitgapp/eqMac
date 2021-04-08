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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Fyb3VzZWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2NvbXBvbmVudHMvY2Fyb3VzZWwvY2Fyb3VzZWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFhLFNBQVMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQWlCLE1BQU0sRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFhLE1BQU0sZUFBZSxDQUFBO0FBQ3pMLE9BQU8sRUFBb0IsT0FBTyxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHFCQUFxQixDQUFBO0FBS3hGLE1BQU0sT0FBTyxxQkFBcUI7SUFHaEMsWUFDUyxRQUEwQjtRQUExQixhQUFRLEdBQVIsUUFBUSxDQUFrQjtJQUduQyxDQUFDOzs7WUFWRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjthQUM5Qjs7O1lBTHdGLFdBQVc7Ozs4QkFPakcsS0FBSzs7QUFZUixNQUFNLE9BQU8sbUJBQW1COzs7WUFIL0IsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxPQUFPO2FBQ2xCOztBQVNELE1BQU0sT0FBTyxpQkFBaUI7SUFvQzVCLFlBQ1MsT0FBeUI7UUFBekIsWUFBTyxHQUFQLE9BQU8sQ0FBa0I7UUFqQ3pCLFNBQUksR0FBRyxLQUFLLENBQUE7UUFDWixzQkFBaUIsR0FBRyxHQUFHLENBQUE7UUFZdEIsZUFBVSxHQUFHLElBQUksWUFBWSxFQUFVLENBQUE7UUFDdkMsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFBO1FBY3pDLHlCQUFvQixHQUFHLElBQUksWUFBWSxFQUFVLENBQUE7UUFDakQsdUJBQWtCLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQTtRQUUvQyxxQkFBZ0IsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFBO0lBSXZE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T0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztZQUN4QixPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLFlBQVksRUFBRSxLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUUsZUFBZSxNQUFNLElBQUksRUFBRSxDQUFDLENBQUM7U0FDaEcsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVNLGlCQUFpQjs7UUFDdEIsTUFBTSxNQUFNLFNBQUcsSUFBSSxDQUFDLFNBQVMsMENBQUUsT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDLGtCQUFrQixDQUFBO1FBQzVGLENBQUEsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLFlBQVksS0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFBO0lBQzdELENBQUM7OztZQS9HRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLG9NQUF3Qzs7YUFFekM7OztZQXpCMEMsZ0JBQWdCOzs7b0JBMkJ4RCxlQUFlLFNBQUMscUJBQXFCO3dCQUNyQyxZQUFZLFNBQUMsbUJBQW1CLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO3NCQUN0RCxTQUFTLFNBQUMsU0FBUyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTttQkFDckMsS0FBSztnQ0FDTCxLQUFLO3lCQVlMLE1BQU07MkJBQ04sTUFBTTs2QkFJTixLQUFLO21DQVVMLE1BQU07aUNBQ04sTUFBTTsrQkFFTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBDb250ZW50Q2hpbGRyZW4sIFF1ZXJ5TGlzdCwgRGlyZWN0aXZlLCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYsIElucHV0LCBUZW1wbGF0ZVJlZiwgQWZ0ZXJWaWV3SW5pdCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIFZpZXdDaGlsZHJlbiwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7IEFuaW1hdGlvbkZhY3RvcnksIGFuaW1hdGUsIHN0eWxlLCBBbmltYXRpb25CdWlsZGVyIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucydcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2VxbUNhcm91c2VsSXRlbV0nXG59KVxuZXhwb3J0IGNsYXNzIENhcm91c2VsSXRlbURpcmVjdGl2ZSB7XG4gIEBJbnB1dCgpIGVxbUNhcm91c2VsSXRlbT86IHN0cmluZ1xuXG4gIGNvbnN0cnVjdG9yIChcbiAgICBwdWJsaWMgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT5cbiAgKSB7XG5cbiAgfVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICcuaXRlbSdcbn0pXG5leHBvcnQgY2xhc3MgQ2Fyb3VzZWxJdGVtRWxlbWVudCB7XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2VxbS1jYXJvdXNlbCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9jYXJvdXNlbC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWyAnLi9jYXJvdXNlbC5jb21wb25lbnQuc2NzcycgXVxufSlcbmV4cG9ydCBjbGFzcyBDYXJvdXNlbENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIEBDb250ZW50Q2hpbGRyZW4oQ2Fyb3VzZWxJdGVtRGlyZWN0aXZlKSBpdGVtcyE6IFF1ZXJ5TGlzdDxDYXJvdXNlbEl0ZW1EaXJlY3RpdmU+XG4gIEBWaWV3Q2hpbGRyZW4oQ2Fyb3VzZWxJdGVtRWxlbWVudCwgeyByZWFkOiBFbGVtZW50UmVmIH0pIGl0ZW1FbGVtcyE6IFF1ZXJ5TGlzdDxFbGVtZW50UmVmPlxuICBAVmlld0NoaWxkKCd3cmFwcGVyJywgeyBzdGF0aWM6IHRydWUgfSkgd3JhcHBlciE6IEVsZW1lbnRSZWZcbiAgQElucHV0KCkgbG9vcCA9IGZhbHNlXG4gIEBJbnB1dCgpIGFuaW1hdGlvbkR1cmF0aW9uID0gNTAwXG4gIF9oZWlnaHQhOiBudW1iZXJcbiAgZ2V0IGhlaWdodCAoKSB7IHJldHVybiB0aGlzLl9oZWlnaHQgfVxuICBzZXQgaGVpZ2h0IChuZXdIZWlnaHQ6IG51bWJlcikge1xuICAgIGNvbnN0IGRpZmYgPSBuZXdIZWlnaHQgLSB0aGlzLmhlaWdodFxuICAgIHRoaXMuX2hlaWdodCA9IG5ld0hlaWdodFxuICAgIGlmIChkaWZmKSB7XG4gICAgICB0aGlzLmhlaWdodENoYW5nZS5lbWl0KG5ld0hlaWdodClcbiAgICAgIHRoaXMuaGVpZ2h0RGlmZi5lbWl0KGRpZmYpXG4gICAgfVxuICB9XG5cbiAgQE91dHB1dCgpIGhlaWdodERpZmYgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKVxuICBAT3V0cHV0KCkgaGVpZ2h0Q2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KClcbiAgcHVibGljIHJlY2FsY3VsYXRlSGVpZ2h0VGltZXI/OiBudW1iZXJcblxuICBwdWJsaWMgX3NlbGVjdGVkSXRlbUlkPzogc3RyaW5nXG4gIEBJbnB1dCgpIHNldCBzZWxlY3RlZEl0ZW1JZCAobmV3U2VsZWN0ZWRJdGVtSWQ6IHN0cmluZykge1xuICAgIGlmICh0aGlzLl9zZWxlY3RlZEl0ZW1JZCAhPT0gbmV3U2VsZWN0ZWRJdGVtSWQpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkSXRlbUlkID0gbmV3U2VsZWN0ZWRJdGVtSWRcbiAgICAgIHRoaXMuYW5pbWF0ZSgpXG4gICAgfVxuICAgIHRoaXMucmVjYWxjdWxhdGVIZWlnaHQoKVxuICAgIHRoaXMuaXRlbUNhbWVJbnRvVmlldy5lbWl0KHRoaXMuc2VsZWN0ZWRJdGVtSWQpXG4gIH1cblxuICBnZXQgc2VsZWN0ZWRJdGVtSWQgKCkgeyByZXR1cm4gdGhpcy5fc2VsZWN0ZWRJdGVtSWQgYXMgYW55IH1cbiAgQE91dHB1dCgpIHNlbGVjdGVkSXRlbUlkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KClcbiAgQE91dHB1dCgpIGFuaW1hdGlvbkNvbXBsZXRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpXG5cbiAgQE91dHB1dCgpIGl0ZW1DYW1lSW50b1ZpZXcgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKVxuICBjb25zdHJ1Y3RvciAoXG4gICAgcHVibGljIGJ1aWxkZXI6IEFuaW1hdGlvbkJ1aWxkZXJcbiAgKSB7XG4gIH1cblxuICBnZXQgd3JhcHBlclN0eWxlICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiBgJHt0aGlzLmhlaWdodH1weGAsXG4gICAgICB0cmFuc2l0aW9uRHVyYXRpb246IGAke3RoaXMuYW5pbWF0aW9uRHVyYXRpb259bXNgLFxuICAgICAgd2lkdGg6IGAke3RoaXMuaXRlbXMubGVuZ3RoICogMTAwfSVgXG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0ICgpIHtcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5pdGVtcy50b0FycmF5KCkpIHtcbiAgICAgIGlmICghaXRlbS5lcW1DYXJvdXNlbEl0ZW0gfHwgdHlwZW9mIGl0ZW0uZXFtQ2Fyb3VzZWxJdGVtICE9PSAnc3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2VxbUNhcm91c2VsSXRlbSBkaXJlY3RpdmUgd2FzIG5vdCBwcm92aWRlZCBhbiBpdGVtIElEJylcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmFuaW1hdGUoKVxuICAgIHRoaXMucmVjYWxjdWxhdGVIZWlnaHQoKVxuICAgIHRoaXMucmVjYWxjdWxhdGVIZWlnaHRUaW1lciA9IHNldEludGVydmFsKCgpID0+IHRoaXMucmVjYWxjdWxhdGVIZWlnaHQoKSwgMTAwMCkgYXMgYW55XG4gIH1cblxuICBuZ09uRGVzdHJveSAoKSB7XG4gICAgaWYgKHRoaXMucmVjYWxjdWxhdGVIZWlnaHRUaW1lcikge1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnJlY2FsY3VsYXRlSGVpZ2h0VGltZXIpXG4gICAgfVxuICB9XG5cbiAgZ2V0IGN1cnJlbnRJbmRleCAoKSB7XG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLml0ZW1zLnRvQXJyYXkoKVxuICAgIGNvbnN0IGluZGV4ID0gaXRlbXMuaW5kZXhPZihpdGVtcy5maW5kKGl0ZW0gPT4gaXRlbS5lcW1DYXJvdXNlbEl0ZW0gPT09IHRoaXMuc2VsZWN0ZWRJdGVtSWQpKVxuICAgIHJldHVybiBpbmRleCA+PSAwID8gaW5kZXggOiAwXG4gIH1cblxuICBuZXh0ICgpIHtcbiAgICBjb25zdCBjdXJyZW50SW5kZXggPSB0aGlzLmN1cnJlbnRJbmRleFxuICAgIGlmICghdGhpcy5sb29wICYmIGN1cnJlbnRJbmRleCA+PSB0aGlzLml0ZW1zLmxlbmd0aCAtIDEpIHJldHVyblxuICAgIGNvbnN0IG5leHRJbmRleCA9IChjdXJyZW50SW5kZXggKyAxKSAlIHRoaXMuaXRlbXMubGVuZ3RoXG4gICAgdGhpcy5zZWxlY3RlZEl0ZW1JZCA9IHRoaXMuaXRlbXMudG9BcnJheSgpW25leHRJbmRleF0uZXFtQ2Fyb3VzZWxJdGVtXG4gICAgdGhpcy5zZWxlY3RlZEl0ZW1JZENoYW5nZS5lbWl0KHRoaXMuc2VsZWN0ZWRJdGVtSWQpXG4gIH1cblxuICBwcmV2ICgpIHtcbiAgICBjb25zdCBjdXJyZW50SW5kZXggPSB0aGlzLmN1cnJlbnRJbmRleFxuICAgIGlmICghdGhpcy5sb29wICYmIGN1cnJlbnRJbmRleCA9PT0gMCkgcmV0dXJuXG4gICAgY29uc3QgcHJldmlvdXNJbmRleCA9ICgoY3VycmVudEluZGV4IC0gMSkgKyB0aGlzLml0ZW1zLmxlbmd0aCkgJSB0aGlzLml0ZW1zLmxlbmd0aFxuICAgIHRoaXMuc2VsZWN0ZWRJdGVtSWQgPSB0aGlzLml0ZW1zLnRvQXJyYXkoKVtwcmV2aW91c0luZGV4XS5lcW1DYXJvdXNlbEl0ZW1cbiAgICB0aGlzLnNlbGVjdGVkSXRlbUlkQ2hhbmdlLmVtaXQodGhpcy5zZWxlY3RlZEl0ZW1JZClcbiAgfVxuXG4gIHB1YmxpYyBhbmltYXRlICgpIHtcbiAgICBjb25zdCBteUFuaW1hdGlvbjogQW5pbWF0aW9uRmFjdG9yeSA9IHRoaXMuYW5pbWF0aW9uXG4gICAgY29uc3QgcGxheWVyID0gbXlBbmltYXRpb24uY3JlYXRlKHRoaXMud3JhcHBlci5uYXRpdmVFbGVtZW50KVxuICAgIHBsYXllci5wbGF5KClcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuYW5pbWF0aW9uQ29tcGxldGVkLmVtaXQoKSwgdGhpcy5hbmltYXRpb25EdXJhdGlvbilcbiAgfVxuXG4gIHB1YmxpYyBnZXQgYW5pbWF0aW9uICgpIHtcbiAgICBjb25zdCBvZmZzZXQgPSB0aGlzLmN1cnJlbnRJbmRleCAqIDEwMCAvIHRoaXMuaXRlbXMubGVuZ3RoXG4gICAgcmV0dXJuIHRoaXMuYnVpbGRlci5idWlsZChbXG4gICAgICBhbmltYXRlKGAke3RoaXMuYW5pbWF0aW9uRHVyYXRpb259bXMgZWFzZS1pbmAsIHN0eWxlKHsgdHJhbnNmb3JtOiBgdHJhbnNsYXRlWCgtJHtvZmZzZXR9JSlgIH0pKVxuICAgIF0pXG4gIH1cblxuICBwdWJsaWMgcmVjYWxjdWxhdGVIZWlnaHQgKCkge1xuICAgIGNvbnN0IGl0ZW1FbCA9IHRoaXMuaXRlbUVsZW1zPy50b0FycmF5KClbdGhpcy5jdXJyZW50SW5kZXhdLm5hdGl2ZUVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nXG4gICAgaXRlbUVsPy5vZmZzZXRIZWlnaHQgJiYgKHRoaXMuaGVpZ2h0ID0gaXRlbUVsLm9mZnNldEhlaWdodClcbiAgfVxufVxuIl19
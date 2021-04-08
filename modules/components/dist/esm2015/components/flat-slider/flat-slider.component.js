import { __awaiter } from "tslib";
import { Component, ViewChild, Input, Output, EventEmitter, HostListener, ElementRef, HostBinding } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';
import { FadeInOutAnimation } from '../../animations';
import { DomSanitizer } from '@angular/platform-browser';
export class FlatSliderComponent {
    constructor(utils, elem, sanitizer) {
        this.utils = utils;
        this.elem = elem;
        this.sanitizer = sanitizer;
        this.scale = 'linear';
        this.doubleClickToAnimateToMiddle = true;
        this.showMiddleNotch = true;
        this.min = 0;
        this.max = 1;
        this.animationDuration = 500;
        this.animationFps = 30;
        this.scrollEnabled = true;
        this.stickToMiddle = true;
        this.thickness = 2;
        this.orientation = 'horizontal';
        this.stickedToMiddle = new EventEmitter();
        this.defaultColor = '#4f8d71';
        this._enabled = true;
        this._color = this.defaultColor;
        this.dragging = false;
        this.thumbRadius = 4;
        this._value = 0.5;
        this.valueChange = new EventEmitter();
        this.userChangedValue = new EventEmitter();
        this.mouseInside = false;
    }
    get middleValue() {
        return typeof this.middle === 'number' ? this.middle : (this.min + this.max) / 2;
    }
    get disabled() { return !this.enabled; }
    set enabled(shouldBeEnabled) {
        this._enabled = shouldBeEnabled;
        this._color = this._enabled ? this.defaultColor : '#777';
    }
    get enabled() { return this._enabled; }
    set color(newColor) {
        this.defaultColor = newColor;
        this._color = this._enabled ? this.defaultColor : '#777';
    }
    get color() {
        return this._color;
    }
    get darkerColor() {
        const rgb = this.utils.hexToRgb(this.color);
        for (const channel in rgb) {
            rgb[channel] = Math.round(0.8 * rgb[channel]);
        }
        const hex = this.utils.rgbToHex(rgb);
        return hex;
    }
    set value(newValue) {
        let value = this.clampValue(newValue);
        if (this.stickToMiddle) {
            const middleValue = this.middleValue;
            let diffFromMiddle = middleValue - value;
            if (diffFromMiddle < 0) {
                diffFromMiddle *= -1;
            }
            const percFromMiddle = this.mapValue({
                value: diffFromMiddle,
                inMin: 0,
                inMax: this.max - middleValue,
                outMin: 0,
                outMax: 100
            });
            if ((this._value).toFixed(2) === (middleValue).toFixed(2) && percFromMiddle < 5) {
                value = middleValue;
            }
            else if ((this._value < middleValue && newValue > this._value) || (this._value > middleValue && newValue < this._value)) {
                if (percFromMiddle < 3) {
                    value = middleValue;
                    this.stickedToMiddle.emit();
                }
            }
        }
        this._value = this.clampValue(value);
        this.valueChange.emit(this._value);
    }
    get value() { return this._value; }
    get height() {
        return this.containerRef.nativeElement.offsetHeight;
    }
    get width() {
        return this.containerRef.nativeElement.offsetWidth;
    }
    clampValue(value) {
        if (value < this.min)
            return this.min;
        if (value > this.max)
            return this.max;
        return value;
    }
    mouseWheel(event) {
        if (this.enabled && this.scrollEnabled) {
            // const multiplier = (this.max - this.min) / 1000
            let progress = this.progress;
            progress += -event.deltaY / 1000;
            if (progress < 0)
                progress = 0;
            if (progress > 1)
                progress = 1;
            progress = Math.round(progress * 1000);
            this.value = this.mapValue({
                value: progress,
                inMin: 0,
                inMax: 1000,
                outMin: this.min,
                outMax: this.max,
                logInverse: false
            });
            this.userChangedValue.emit({ value: this._value });
        }
    }
    getValueFromMouseEvent(event) {
        const coords = this.utils.getCoordinatesInsideElementFromEvent(event, this.containerRef.nativeElement);
        let progress = this.orientation === 'vertical' ? coords.y : coords.x;
        const value = (() => {
            const inMin = this.thumbRadius;
            const inMax = (this.orientation === 'vertical' ? this.height : this.width) - this.thumbRadius * 2;
            if (progress < inMin)
                progress = inMin;
            if (progress > inMax)
                progress = inMax;
            return this.mapValue({
                value: progress,
                inMin,
                inMax,
                outMin: this.min,
                outMax: this.max
            });
        })();
        return value;
    }
    mousedown(event) {
        if (this.enabled) {
            this.dragging = true;
            this.value = this.getValueFromMouseEvent(event);
            this.userChangedValue.emit({ value: this._value });
        }
    }
    mousemove(event) {
        if (this.enabled && this.dragging) {
            this.value = this.getValueFromMouseEvent(event);
            this.userChangedValue.emit({ value: this._value });
        }
    }
    onMouseEnter() {
        this.mouseInside = true;
    }
    onMouseLeave() {
        this.mouseInside = false;
        this.dragging = false;
    }
    doubleclick() {
        if (this.enabled && this.doubleClickToAnimateToMiddle) {
            if (this.doubleclickTimeout) {
                clearTimeout(this.doubleclickTimeout);
            }
            this.userChangedValue.emit({
                value: this.middleValue,
                transition: true
            });
            this.animateSlider(this.value, this.middleValue);
        }
    }
    animateSlider(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            from = this.clampValue(from);
            to = this.clampValue(to);
            const diff = to - from;
            const delay = 1000 / this.animationFps;
            const frames = this.animationFps * (this.animationDuration / 1000);
            const step = diff / frames;
            let value = from;
            for (let frame = 0; frame < frames; frame++) {
                yield this.utils.delay(delay);
                value += step;
                this.value = value;
            }
        });
    }
    onMouseUp(event) {
        this.dragging = false;
    }
    mouseup(event) {
        this.dragging = false;
    }
    get progress() {
        const factor = 10000;
        let progress = this.mapValue({
            value: this.value,
            inMin: this.min,
            inMax: this.max,
            outMin: 0,
            outMax: factor,
            logInverse: true
        });
        progress /= factor;
        return progress;
    }
    get containerStyle() {
        const styles = {};
        const narrow = this.thumbRadius * 2 + 2;
        if (this.orientation === 'horizontal') {
            styles.width = '100%';
            styles.height = `${narrow}px`;
        }
        else {
            styles.height = '100%';
            styles.width = `${narrow}px`;
        }
        return styles;
    }
    get grooveStyle() {
        const style = {};
        if (this.orientation === 'horizontal') {
            style.left = `${this.thumbRadius}px`;
            style.top = `calc(50% - ${this.thickness}px / 2)`;
            style.width = `calc(100% - ${this.thumbRadius * 2}px)`;
            style.height = `${this.thickness}px`;
        }
        else {
            style.top = `${this.thumbRadius}px`;
            style.left = `calc(50% - ${this.thickness}px / 2)`;
            style.height = `calc(100% - ${this.thumbRadius * 2}px)`;
            style.width = `${this.thickness}px`;
        }
        style.backgroundColor = this.darkerColor;
        return style;
    }
    get grooveFillingStyle() {
        const style = {};
        if (this.orientation === 'horizontal') {
            style.left = `${this.thumbRadius}px`;
            style.top = `calc(50% - ${this.thickness}px / 2)`;
            style.width = `calc(${this.progress * 100}% - ${this.thumbRadius}px)`;
            style.height = `${this.thickness}px`;
        }
        else {
            style.top = `${this.thumbRadius}px`;
            style.left = `calc(50% - ${this.thickness}px / 2)`;
            style.height = `calc(${this.progress * 100}% - ${this.thumbRadius * 2}px)`;
            style.width = `${this.thickness}px`;
        }
        style.backgroundColor = this.color;
        return style;
    }
    get thumbNotchStyle() {
        const style = {};
        style.width = `${this.thumbRadius * 2}px`;
        style.height = style.width;
        style.backgroundColor = this.value >= this.middleValue ? this.color : this.darkerColor;
        style.borderRadius = '100%';
        const center = `calc(50% - ${this.thumbRadius}px)`;
        style.top = center;
        style.left = center;
        return style;
    }
    get thumbStyle() {
        const style = {};
        style.width = `${this.thumbRadius * 2}px`;
        style.height = style.width;
        const borderSize = 1;
        style.border = `${borderSize}px solid black`;
        style.backgroundColor = this.color;
        style.borderRadius = '100%';
        if (this.orientation === 'horizontal') {
            const left = this.mapValue({
                value: this.value,
                inMin: this.min,
                inMax: this.max,
                outMin: -borderSize,
                outMax: this.width - this.thumbRadius * 2 - borderSize,
                logInverse: true
            });
            style.left = `${left}px`;
        }
        else {
            style.bottom = `${this.mapValue({
                value: this.value,
                inMin: this.min,
                inMax: this.max,
                outMin: -borderSize,
                outMax: this.height - this.thumbRadius * 2 - borderSize,
                logInverse: true
            })}px`;
        }
        return style;
    }
    mapValue({ value, inMin, inMax, outMin, outMax, logInverse }) {
        switch (this.scale) {
            case 'linear': return this.utils.mapValue(value, inMin, inMax, outMin, outMax);
            case 'logarithmic': return (logInverse ? this.utils.logMapValueInverse : this.utils.logMapValue)({ value, inMin, inMax, outMin, outMax });
        }
    }
}
FlatSliderComponent.decorators = [
    { type: Component, args: [{
                selector: 'eqm-flat-slider',
                template: "\n<div class=\"container\" #container [ngStyle]=\"containerStyle\">\n  <div class=\"groove\" [ngStyle]=\"grooveStyle\"></div>\n  <div class=\"groove-filling\" [ngStyle]=\"grooveFillingStyle\"></div>\n  <div class=\"thumbNotch\" *ngIf=\"showMiddleNotch\" [ngStyle]=\"thumbNotchStyle\"></div>\n  <div class=\"thumb\" [ngStyle]=\"thumbStyle\" (dblclick)=\"doubleclick()\"></div>\n</div>",
                animations: [FadeInOutAnimation],
                styles: [":host{display:block;padding:2px}:host.disabled{filter:grayscale(80%)}.container{position:relative}.container *{position:absolute}"]
            },] }
];
FlatSliderComponent.ctorParameters = () => [
    { type: UtilitiesService },
    { type: ElementRef },
    { type: DomSanitizer }
];
FlatSliderComponent.propDecorators = {
    scale: [{ type: Input }],
    doubleClickToAnimateToMiddle: [{ type: Input }],
    showMiddleNotch: [{ type: Input }],
    min: [{ type: Input }],
    max: [{ type: Input }],
    animationDuration: [{ type: Input }],
    animationFps: [{ type: Input }],
    scrollEnabled: [{ type: Input }],
    middle: [{ type: Input }],
    stickToMiddle: [{ type: Input }],
    thickness: [{ type: Input }],
    orientation: [{ type: Input }],
    stickedToMiddle: [{ type: Output }],
    containerRef: [{ type: ViewChild, args: ['container', { static: true },] }],
    disabled: [{ type: HostBinding, args: ['class.disabled',] }],
    enabled: [{ type: Input }],
    color: [{ type: Input }],
    value: [{ type: Input }],
    valueChange: [{ type: Output }],
    userChangedValue: [{ type: Output }],
    mouseWheel: [{ type: HostListener, args: ['mousewheel', ['$event'],] }],
    mousedown: [{ type: HostListener, args: ['mousedown', ['$event'],] }],
    mousemove: [{ type: HostListener, args: ['mousemove', ['$event'],] }],
    onMouseEnter: [{ type: HostListener, args: ['mouseenter',] }],
    onMouseLeave: [{ type: HostListener, args: ['mouseleave',] }],
    onMouseUp: [{ type: HostListener, args: ['mouseup', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxhdC1zbGlkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2NvbXBvbmVudHMvZmxhdC1zbGlkZXIvZmxhdC1zbGlkZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixZQUFZLEVBQ1osVUFBVSxFQUNWLFdBQVcsRUFDWixNQUFNLGVBQWUsQ0FBQTtBQUN0QixPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2pCLE1BQU0sa0NBQWtDLENBQUE7QUFDekMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sa0JBQWtCLENBQUE7QUFDckQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDJCQUEyQixDQUFBO0FBYXhELE1BQU0sT0FBTyxtQkFBbUI7SUFDOUIsWUFDUyxLQUF1QixFQUN2QixJQUFnQixFQUNoQixTQUF1QjtRQUZ2QixVQUFLLEdBQUwsS0FBSyxDQUFrQjtRQUN2QixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2hCLGNBQVMsR0FBVCxTQUFTLENBQWM7UUFHdkIsVUFBSyxHQUE2QixRQUFRLENBQUE7UUFDMUMsaUNBQTRCLEdBQUcsSUFBSSxDQUFBO1FBQ25DLG9CQUFlLEdBQUcsSUFBSSxDQUFBO1FBQ3RCLFFBQUcsR0FBVyxDQUFDLENBQUE7UUFDZixRQUFHLEdBQVcsQ0FBQyxDQUFBO1FBQ2Ysc0JBQWlCLEdBQUcsR0FBRyxDQUFBO1FBQ3ZCLGlCQUFZLEdBQUcsRUFBRSxDQUFBO1FBQ2pCLGtCQUFhLEdBQUcsSUFBSSxDQUFBO1FBRXBCLGtCQUFhLEdBQUcsSUFBSSxDQUFBO1FBQ3BCLGNBQVMsR0FBRyxDQUFDLENBQUE7UUFDYixnQkFBVyxHQUE4QixZQUFZLENBQUE7UUFDcEQsb0JBQWUsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFBO1FB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QUFLOzhCQUNMLEtBQUs7a0JBQ0wsS0FBSztrQkFDTCxLQUFLO2dDQUNMLEtBQUs7MkJBQ0wsS0FBSzs0QkFDTCxLQUFLO3FCQUNMLEtBQUs7NEJBQ0wsS0FBSzt3QkFDTCxLQUFLOzBCQUNMLEtBQUs7OEJBQ0wsTUFBTTsyQkFDTixTQUFTLFNBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTt1QkFTdkMsV0FBVyxTQUFDLGdCQUFnQjtzQkFDNUIsS0FBSztvQkFTTCxLQUFLO29CQXdCTCxLQUFLOzBCQWlDTCxNQUFNOytCQUNOLE1BQU07eUJBZ0JOLFlBQVksU0FBQyxZQUFZLEVBQUUsQ0FBRSxRQUFRLENBQUU7d0JBd0N2QyxZQUFZLFNBQUMsV0FBVyxFQUFFLENBQUUsUUFBUSxDQUFFO3dCQVN0QyxZQUFZLFNBQUMsV0FBVyxFQUFFLENBQUUsUUFBUSxDQUFFOzJCQVN0QyxZQUFZLFNBQUMsWUFBWTsyQkFLekIsWUFBWSxTQUFDLFlBQVk7d0JBb0N6QixZQUFZLFNBQUMsU0FBUyxFQUFFLENBQUUsUUFBUSxDQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBWaWV3Q2hpbGQsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdExpc3RlbmVyLFxuICBFbGVtZW50UmVmLFxuICBIb3N0QmluZGluZ1xufSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuaW1wb3J0IHtcbiAgVXRpbGl0aWVzU2VydmljZVxufSBmcm9tICcuLi8uLi9zZXJ2aWNlcy91dGlsaXRpZXMuc2VydmljZSdcbmltcG9ydCB7IEZhZGVJbk91dEFuaW1hdGlvbiB9IGZyb20gJy4uLy4uL2FuaW1hdGlvbnMnXG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJ1xuXG5leHBvcnQgaW50ZXJmYWNlIEZsYXRTbGlkZXJWYWx1ZUNoYW5nZWRFdmVudCB7XG4gIHZhbHVlOiBudW1iZXJcbiAgdHJhbnNpdGlvbj86IGJvb2xlYW5cbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZXFtLWZsYXQtc2xpZGVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2ZsYXQtc2xpZGVyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbICcuL2ZsYXQtc2xpZGVyLmNvbXBvbmVudC5zY3NzJyBdLFxuICBhbmltYXRpb25zOiBbIEZhZGVJbk91dEFuaW1hdGlvbiBdXG59KVxuZXhwb3J0IGNsYXNzIEZsYXRTbGlkZXJDb21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAoXG4gICAgcHVibGljIHV0aWxzOiBVdGlsaXRpZXNTZXJ2aWNlLFxuICAgIHB1YmxpYyBlbGVtOiBFbGVtZW50UmVmLFxuICAgIHB1YmxpYyBzYW5pdGl6ZXI6IERvbVNhbml0aXplclxuICApIHt9XG5cbiAgQElucHV0KCkgc2NhbGU6ICdsb2dhcml0aG1pYycgfCAnbGluZWFyJyA9ICdsaW5lYXInXG4gIEBJbnB1dCgpIGRvdWJsZUNsaWNrVG9BbmltYXRlVG9NaWRkbGUgPSB0cnVlXG4gIEBJbnB1dCgpIHNob3dNaWRkbGVOb3RjaCA9IHRydWVcbiAgQElucHV0KCkgbWluOiBudW1iZXIgPSAwXG4gIEBJbnB1dCgpIG1heDogbnVtYmVyID0gMVxuICBASW5wdXQoKSBhbmltYXRpb25EdXJhdGlvbiA9IDUwMFxuICBASW5wdXQoKSBhbmltYXRpb25GcHMgPSAzMFxuICBASW5wdXQoKSBzY3JvbGxFbmFibGVkID0gdHJ1ZVxuICBASW5wdXQoKSBtaWRkbGU/OiBudW1iZXJcbiAgQElucHV0KCkgc3RpY2tUb01pZGRsZSA9IHRydWVcbiAgQElucHV0KCkgdGhpY2tuZXNzID0gMlxuICBASW5wdXQoKSBvcmllbnRhdGlvbjogJ3ZlcnRpY2FsJyB8ICdob3Jpem9udGFsJyA9ICdob3Jpem9udGFsJ1xuICBAT3V0cHV0KCkgc3RpY2tlZFRvTWlkZGxlID0gbmV3IEV2ZW50RW1pdHRlcigpXG4gIEBWaWV3Q2hpbGQoJ2NvbnRhaW5lcicsIHsgc3RhdGljOiB0cnVlIH0pIGNvbnRhaW5lclJlZiE6IEVsZW1lbnRSZWZcblxuICBnZXQgbWlkZGxlVmFsdWUgKCkge1xuICAgIHJldHVybiB0eXBlb2YgdGhpcy5taWRkbGUgPT09ICdudW1iZXInID8gdGhpcy5taWRkbGUgOiAodGhpcy5taW4gKyB0aGlzLm1heCkgLyAyXG4gIH1cblxuICBwdWJsaWMgZGVmYXVsdENvbG9yID0gJyM0ZjhkNzEnXG4gIHB1YmxpYyBfZW5hYmxlZCA9IHRydWVcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmRpc2FibGVkJykgZ2V0IGRpc2FibGVkICgpIHsgcmV0dXJuICF0aGlzLmVuYWJsZWQgfVxuICBASW5wdXQoKVxuICBzZXQgZW5hYmxlZCAoc2hvdWxkQmVFbmFibGVkKSB7XG4gICAgdGhpcy5fZW5hYmxlZCA9IHNob3VsZEJlRW5hYmxlZFxuICAgIHRoaXMuX2NvbG9yID0gdGhpcy5fZW5hYmxlZCA/IHRoaXMuZGVmYXVsdENvbG9yIDogJyM3NzcnXG4gIH1cblxuICBnZXQgZW5hYmxlZCAoKSB7IHJldHVybiB0aGlzLl9lbmFibGVkIH1cblxuICBwdWJsaWMgX2NvbG9yID0gdGhpcy5kZWZhdWx0Q29sb3JcbiAgQElucHV0KClcbiAgc2V0IGNvbG9yIChuZXdDb2xvcikge1xuICAgIHRoaXMuZGVmYXVsdENvbG9yID0gbmV3Q29sb3JcbiAgICB0aGlzLl9jb2xvciA9IHRoaXMuX2VuYWJsZWQgPyB0aGlzLmRlZmF1bHRDb2xvciA6ICcjNzc3J1xuICB9XG5cbiAgZ2V0IGNvbG9yICgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29sb3JcbiAgfVxuXG4gIGdldCBkYXJrZXJDb2xvciAoKSB7XG4gICAgY29uc3QgcmdiID0gdGhpcy51dGlscy5oZXhUb1JnYih0aGlzLmNvbG9yKVxuICAgIHR5cGUgY2MgPSBrZXlvZiB0eXBlb2YgcmdiXG4gICAgZm9yIChjb25zdCBjaGFubmVsIGluIHJnYikge1xuICAgICAgcmdiW2NoYW5uZWwgYXMgY2NdID0gTWF0aC5yb3VuZCgwLjggKiByZ2JbY2hhbm5lbCBhcyBjY10pXG4gICAgfVxuICAgIGNvbnN0IGhleCA9IHRoaXMudXRpbHMucmdiVG9IZXgocmdiKVxuICAgIHJldHVybiBoZXhcbiAgfVxuXG4gIHB1YmxpYyBkcmFnZ2luZyA9IGZhbHNlXG4gIHB1YmxpYyB0aHVtYlJhZGl1cyA9IDRcblxuICBwdWJsaWMgX3ZhbHVlID0gMC41XG4gIEBJbnB1dCgpXG4gIHNldCB2YWx1ZSAobmV3VmFsdWUpIHtcbiAgICBsZXQgdmFsdWUgPSB0aGlzLmNsYW1wVmFsdWUobmV3VmFsdWUpXG5cbiAgICBpZiAodGhpcy5zdGlja1RvTWlkZGxlKSB7XG4gICAgICBjb25zdCBtaWRkbGVWYWx1ZSA9IHRoaXMubWlkZGxlVmFsdWVcblxuICAgICAgbGV0IGRpZmZGcm9tTWlkZGxlID0gbWlkZGxlVmFsdWUgLSB2YWx1ZVxuICAgICAgaWYgKGRpZmZGcm9tTWlkZGxlIDwgMCkge1xuICAgICAgICBkaWZmRnJvbU1pZGRsZSAqPSAtMVxuICAgICAgfVxuICAgICAgY29uc3QgcGVyY0Zyb21NaWRkbGUgPSB0aGlzLm1hcFZhbHVlKHtcbiAgICAgICAgdmFsdWU6IGRpZmZGcm9tTWlkZGxlLFxuICAgICAgICBpbk1pbjogMCxcbiAgICAgICAgaW5NYXg6IHRoaXMubWF4IC0gbWlkZGxlVmFsdWUsXG4gICAgICAgIG91dE1pbjogMCxcbiAgICAgICAgb3V0TWF4OiAxMDBcbiAgICAgIH0pXG4gICAgICBpZiAoKHRoaXMuX3ZhbHVlKS50b0ZpeGVkKDIpID09PSAobWlkZGxlVmFsdWUpLnRvRml4ZWQoMikgJiYgcGVyY0Zyb21NaWRkbGUgPCA1KSB7XG4gICAgICAgIHZhbHVlID0gbWlkZGxlVmFsdWVcbiAgICAgIH0gZWxzZSBpZiAoKHRoaXMuX3ZhbHVlIDwgbWlkZGxlVmFsdWUgJiYgbmV3VmFsdWUgPiB0aGlzLl92YWx1ZSkgfHwgKHRoaXMuX3ZhbHVlID4gbWlkZGxlVmFsdWUgJiYgbmV3VmFsdWUgPCB0aGlzLl92YWx1ZSkpIHtcbiAgICAgICAgaWYgKHBlcmNGcm9tTWlkZGxlIDwgMykge1xuICAgICAgICAgIHZhbHVlID0gbWlkZGxlVmFsdWVcbiAgICAgICAgICB0aGlzLnN0aWNrZWRUb01pZGRsZS5lbWl0KClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl92YWx1ZSA9IHRoaXMuY2xhbXBWYWx1ZSh2YWx1ZSlcbiAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodGhpcy5fdmFsdWUpXG4gIH1cblxuICBnZXQgdmFsdWUgKCkgeyByZXR1cm4gdGhpcy5fdmFsdWUgfVxuXG4gIEBPdXRwdXQoKSB2YWx1ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKVxuICBAT3V0cHV0KCkgdXNlckNoYW5nZWRWYWx1ZSA9IG5ldyBFdmVudEVtaXR0ZXI8RmxhdFNsaWRlclZhbHVlQ2hhbmdlZEV2ZW50PigpXG5cbiAgZ2V0IGhlaWdodCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyUmVmLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0XG4gIH1cblxuICBnZXQgd2lkdGggKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lclJlZi5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoXG4gIH1cblxuICBwdWJsaWMgY2xhbXBWYWx1ZSAodmFsdWU6IG51bWJlcikge1xuICAgIGlmICh2YWx1ZSA8IHRoaXMubWluKSByZXR1cm4gdGhpcy5taW5cbiAgICBpZiAodmFsdWUgPiB0aGlzLm1heCkgcmV0dXJuIHRoaXMubWF4XG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZXdoZWVsJywgWyAnJGV2ZW50JyBdKVxuICBtb3VzZVdoZWVsIChldmVudDogV2hlZWxFdmVudCkge1xuICAgIGlmICh0aGlzLmVuYWJsZWQgJiYgdGhpcy5zY3JvbGxFbmFibGVkKSB7XG4gICAgICAvLyBjb25zdCBtdWx0aXBsaWVyID0gKHRoaXMubWF4IC0gdGhpcy5taW4pIC8gMTAwMFxuICAgICAgbGV0IHByb2dyZXNzID0gdGhpcy5wcm9ncmVzc1xuICAgICAgcHJvZ3Jlc3MgKz0gLWV2ZW50LmRlbHRhWSAvIDEwMDBcbiAgICAgIGlmIChwcm9ncmVzcyA8IDApIHByb2dyZXNzID0gMFxuICAgICAgaWYgKHByb2dyZXNzID4gMSkgcHJvZ3Jlc3MgPSAxXG4gICAgICBwcm9ncmVzcyA9IE1hdGgucm91bmQocHJvZ3Jlc3MgKiAxMDAwKVxuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMubWFwVmFsdWUoe1xuICAgICAgICB2YWx1ZTogcHJvZ3Jlc3MsXG4gICAgICAgIGluTWluOiAwLFxuICAgICAgICBpbk1heDogMTAwMCxcbiAgICAgICAgb3V0TWluOiB0aGlzLm1pbixcbiAgICAgICAgb3V0TWF4OiB0aGlzLm1heCxcbiAgICAgICAgbG9nSW52ZXJzZTogZmFsc2VcbiAgICAgIH0pXG4gICAgICB0aGlzLnVzZXJDaGFuZ2VkVmFsdWUuZW1pdCh7IHZhbHVlOiB0aGlzLl92YWx1ZSB9KVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRWYWx1ZUZyb21Nb3VzZUV2ZW50IChldmVudDogTW91c2VFdmVudCkge1xuICAgIGNvbnN0IGNvb3JkcyA9IHRoaXMudXRpbHMuZ2V0Q29vcmRpbmF0ZXNJbnNpZGVFbGVtZW50RnJvbUV2ZW50KGV2ZW50LCB0aGlzLmNvbnRhaW5lclJlZi5uYXRpdmVFbGVtZW50KVxuICAgIGxldCBwcm9ncmVzcyA9IHRoaXMub3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcgPyBjb29yZHMueSA6IGNvb3Jkcy54XG4gICAgY29uc3QgdmFsdWUgPSAoKCkgPT4ge1xuICAgICAgY29uc3QgaW5NaW4gPSB0aGlzLnRodW1iUmFkaXVzXG4gICAgICBjb25zdCBpbk1heCA9ICh0aGlzLm9yaWVudGF0aW9uID09PSAndmVydGljYWwnID8gdGhpcy5oZWlnaHQgOiB0aGlzLndpZHRoKSAtIHRoaXMudGh1bWJSYWRpdXMgKiAyXG4gICAgICBpZiAocHJvZ3Jlc3MgPCBpbk1pbikgcHJvZ3Jlc3MgPSBpbk1pblxuICAgICAgaWYgKHByb2dyZXNzID4gaW5NYXgpIHByb2dyZXNzID0gaW5NYXhcbiAgICAgIHJldHVybiB0aGlzLm1hcFZhbHVlKHtcbiAgICAgICAgdmFsdWU6IHByb2dyZXNzLFxuICAgICAgICBpbk1pbixcbiAgICAgICAgaW5NYXgsXG4gICAgICAgIG91dE1pbjogdGhpcy5taW4sXG4gICAgICAgIG91dE1heDogdGhpcy5tYXhcbiAgICAgIH0pXG4gICAgfSkoKVxuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2Vkb3duJywgWyAnJGV2ZW50JyBdKVxuICBtb3VzZWRvd24gKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgaWYgKHRoaXMuZW5hYmxlZCkge1xuICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWVcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLmdldFZhbHVlRnJvbU1vdXNlRXZlbnQoZXZlbnQpXG4gICAgICB0aGlzLnVzZXJDaGFuZ2VkVmFsdWUuZW1pdCh7IHZhbHVlOiB0aGlzLl92YWx1ZSB9KVxuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlbW92ZScsIFsgJyRldmVudCcgXSlcbiAgbW91c2Vtb3ZlIChldmVudDogTW91c2VFdmVudCkge1xuICAgIGlmICh0aGlzLmVuYWJsZWQgJiYgdGhpcy5kcmFnZ2luZykge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuZ2V0VmFsdWVGcm9tTW91c2VFdmVudChldmVudClcbiAgICAgIHRoaXMudXNlckNoYW5nZWRWYWx1ZS5lbWl0KHsgdmFsdWU6IHRoaXMuX3ZhbHVlIH0pXG4gICAgfVxuICB9XG5cbiAgcHVibGljIG1vdXNlSW5zaWRlID0gZmFsc2VcbiAgQEhvc3RMaXN0ZW5lcignbW91c2VlbnRlcicpXG4gIG9uTW91c2VFbnRlciAoKTogdm9pZCB7XG4gICAgdGhpcy5tb3VzZUluc2lkZSA9IHRydWVcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlbGVhdmUnKVxuICBvbk1vdXNlTGVhdmUgKCk6IHZvaWQge1xuICAgIHRoaXMubW91c2VJbnNpZGUgPSBmYWxzZVxuICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxuICB9XG5cbiAgcHVibGljIGRvdWJsZWNsaWNrVGltZW91dD86IG51bWJlclxuICBkb3VibGVjbGljayAoKSB7XG4gICAgaWYgKHRoaXMuZW5hYmxlZCAmJiB0aGlzLmRvdWJsZUNsaWNrVG9BbmltYXRlVG9NaWRkbGUpIHtcbiAgICAgIGlmICh0aGlzLmRvdWJsZWNsaWNrVGltZW91dCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5kb3VibGVjbGlja1RpbWVvdXQpXG4gICAgICB9XG5cbiAgICAgIHRoaXMudXNlckNoYW5nZWRWYWx1ZS5lbWl0KHtcbiAgICAgICAgdmFsdWU6IHRoaXMubWlkZGxlVmFsdWUsXG4gICAgICAgIHRyYW5zaXRpb246IHRydWVcbiAgICAgIH0pXG4gICAgICB0aGlzLmFuaW1hdGVTbGlkZXIodGhpcy52YWx1ZSwgdGhpcy5taWRkbGVWYWx1ZSlcbiAgICB9XG4gIH1cblxuICBhc3luYyBhbmltYXRlU2xpZGVyIChmcm9tOiBudW1iZXIsIHRvOiBudW1iZXIpIHtcbiAgICBmcm9tID0gdGhpcy5jbGFtcFZhbHVlKGZyb20pXG4gICAgdG8gPSB0aGlzLmNsYW1wVmFsdWUodG8pXG4gICAgY29uc3QgZGlmZiA9IHRvIC0gZnJvbVxuICAgIGNvbnN0IGRlbGF5ID0gMTAwMCAvIHRoaXMuYW5pbWF0aW9uRnBzXG4gICAgY29uc3QgZnJhbWVzID0gdGhpcy5hbmltYXRpb25GcHMgKiAodGhpcy5hbmltYXRpb25EdXJhdGlvbiAvIDEwMDApXG4gICAgY29uc3Qgc3RlcCA9IGRpZmYgLyBmcmFtZXNcbiAgICBsZXQgdmFsdWUgPSBmcm9tXG4gICAgZm9yIChsZXQgZnJhbWUgPSAwOyBmcmFtZSA8IGZyYW1lczsgZnJhbWUrKykge1xuICAgICAgYXdhaXQgdGhpcy51dGlscy5kZWxheShkZWxheSlcbiAgICAgIHZhbHVlICs9IHN0ZXBcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZVxuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNldXAnLCBbICckZXZlbnQnIF0pXG4gIG9uTW91c2VVcCAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcbiAgfVxuXG4gIG1vdXNldXAgKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXG4gIH1cblxuICBnZXQgcHJvZ3Jlc3MgKCkge1xuICAgIGNvbnN0IGZhY3RvciA9IDEwMDAwXG4gICAgbGV0IHByb2dyZXNzID0gdGhpcy5tYXBWYWx1ZSh7XG4gICAgICB2YWx1ZTogdGhpcy52YWx1ZSxcbiAgICAgIGluTWluOiB0aGlzLm1pbixcbiAgICAgIGluTWF4OiB0aGlzLm1heCxcbiAgICAgIG91dE1pbjogMCxcbiAgICAgIG91dE1heDogZmFjdG9yLFxuICAgICAgbG9nSW52ZXJzZTogdHJ1ZVxuICAgIH0pXG5cbiAgICBwcm9ncmVzcyAvPSBmYWN0b3JcbiAgICByZXR1cm4gcHJvZ3Jlc3NcbiAgfVxuXG4gIGdldCBjb250YWluZXJTdHlsZSAoKSB7XG4gICAgY29uc3Qgc3R5bGVzOiB7IFtzdHlsZTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fVxuICAgIGNvbnN0IG5hcnJvdyA9IHRoaXMudGh1bWJSYWRpdXMgKiAyICsgMlxuICAgIGlmICh0aGlzLm9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIHN0eWxlcy53aWR0aCA9ICcxMDAlJ1xuICAgICAgc3R5bGVzLmhlaWdodCA9IGAke25hcnJvd31weGBcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGVzLmhlaWdodCA9ICcxMDAlJ1xuICAgICAgc3R5bGVzLndpZHRoID0gYCR7bmFycm93fXB4YFxuICAgIH1cblxuICAgIHJldHVybiBzdHlsZXNcbiAgfVxuXG4gIGdldCBncm9vdmVTdHlsZSAoKSB7XG4gICAgY29uc3Qgc3R5bGU6IHsgW3N0eWxlOiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfSA9IHt9XG4gICAgaWYgKHRoaXMub3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgc3R5bGUubGVmdCA9IGAke3RoaXMudGh1bWJSYWRpdXN9cHhgXG4gICAgICBzdHlsZS50b3AgPSBgY2FsYyg1MCUgLSAke3RoaXMudGhpY2tuZXNzfXB4IC8gMilgXG4gICAgICBzdHlsZS53aWR0aCA9IGBjYWxjKDEwMCUgLSAke3RoaXMudGh1bWJSYWRpdXMgKiAyfXB4KWBcbiAgICAgIHN0eWxlLmhlaWdodCA9IGAke3RoaXMudGhpY2tuZXNzfXB4YFxuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZS50b3AgPSBgJHt0aGlzLnRodW1iUmFkaXVzfXB4YFxuICAgICAgc3R5bGUubGVmdCA9IGBjYWxjKDUwJSAtICR7dGhpcy50aGlja25lc3N9cHggLyAyKWBcbiAgICAgIHN0eWxlLmhlaWdodCA9IGBjYWxjKDEwMCUgLSAke3RoaXMudGh1bWJSYWRpdXMgKiAyfXB4KWBcbiAgICAgIHN0eWxlLndpZHRoID0gYCR7dGhpcy50aGlja25lc3N9cHhgXG4gICAgfVxuICAgIHN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuZGFya2VyQ29sb3JcbiAgICByZXR1cm4gc3R5bGVcbiAgfVxuXG4gIGdldCBncm9vdmVGaWxsaW5nU3R5bGUgKCkge1xuICAgIGNvbnN0IHN0eWxlOiB7IFtzdHlsZTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fVxuICAgIGlmICh0aGlzLm9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIHN0eWxlLmxlZnQgPSBgJHt0aGlzLnRodW1iUmFkaXVzfXB4YFxuICAgICAgc3R5bGUudG9wID0gYGNhbGMoNTAlIC0gJHt0aGlzLnRoaWNrbmVzc31weCAvIDIpYFxuICAgICAgc3R5bGUud2lkdGggPSBgY2FsYygke3RoaXMucHJvZ3Jlc3MgKiAxMDB9JSAtICR7dGhpcy50aHVtYlJhZGl1c31weClgXG4gICAgICBzdHlsZS5oZWlnaHQgPSBgJHt0aGlzLnRoaWNrbmVzc31weGBcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGUudG9wID0gYCR7dGhpcy50aHVtYlJhZGl1c31weGBcbiAgICAgIHN0eWxlLmxlZnQgPSBgY2FsYyg1MCUgLSAke3RoaXMudGhpY2tuZXNzfXB4IC8gMilgXG4gICAgICBzdHlsZS5oZWlnaHQgPSBgY2FsYygke3RoaXMucHJvZ3Jlc3MgKiAxMDB9JSAtICR7dGhpcy50aHVtYlJhZGl1cyAqIDJ9cHgpYFxuICAgICAgc3R5bGUud2lkdGggPSBgJHt0aGlzLnRoaWNrbmVzc31weGBcbiAgICB9XG4gICAgc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5jb2xvclxuICAgIHJldHVybiBzdHlsZVxuICB9XG5cbiAgZ2V0IHRodW1iTm90Y2hTdHlsZSAoKSB7XG4gICAgY29uc3Qgc3R5bGU6IHsgW3N0eWxlOiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfSA9IHt9XG4gICAgc3R5bGUud2lkdGggPSBgJHt0aGlzLnRodW1iUmFkaXVzICogMn1weGBcbiAgICBzdHlsZS5oZWlnaHQgPSBzdHlsZS53aWR0aFxuICAgIHN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWUgPj0gdGhpcy5taWRkbGVWYWx1ZSA/IHRoaXMuY29sb3IgOiB0aGlzLmRhcmtlckNvbG9yXG5cbiAgICBzdHlsZS5ib3JkZXJSYWRpdXMgPSAnMTAwJSdcbiAgICBjb25zdCBjZW50ZXIgPSBgY2FsYyg1MCUgLSAke3RoaXMudGh1bWJSYWRpdXN9cHgpYFxuXG4gICAgc3R5bGUudG9wID0gY2VudGVyXG4gICAgc3R5bGUubGVmdCA9IGNlbnRlclxuXG4gICAgcmV0dXJuIHN0eWxlXG4gIH1cblxuICBnZXQgdGh1bWJTdHlsZSAoKSB7XG4gICAgY29uc3Qgc3R5bGU6IHsgW3N0eWxlOiBzdHJpbmddOiBudW1iZXIgfCBzdHJpbmcgfSA9IHt9XG4gICAgc3R5bGUud2lkdGggPSBgJHt0aGlzLnRodW1iUmFkaXVzICogMn1weGBcbiAgICBzdHlsZS5oZWlnaHQgPSBzdHlsZS53aWR0aFxuICAgIGNvbnN0IGJvcmRlclNpemUgPSAxXG4gICAgc3R5bGUuYm9yZGVyID0gYCR7Ym9yZGVyU2l6ZX1weCBzb2xpZCBibGFja2BcbiAgICBzdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmNvbG9yXG5cbiAgICBzdHlsZS5ib3JkZXJSYWRpdXMgPSAnMTAwJSdcbiAgICBpZiAodGhpcy5vcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBjb25zdCBsZWZ0ID0gdGhpcy5tYXBWYWx1ZSh7XG4gICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgICBpbk1pbjogdGhpcy5taW4sXG4gICAgICAgIGluTWF4OiB0aGlzLm1heCxcbiAgICAgICAgb3V0TWluOiAtYm9yZGVyU2l6ZSxcbiAgICAgICAgb3V0TWF4OiB0aGlzLndpZHRoIC0gdGhpcy50aHVtYlJhZGl1cyAqIDIgLSBib3JkZXJTaXplLFxuICAgICAgICBsb2dJbnZlcnNlOiB0cnVlXG4gICAgICB9KVxuICAgICAgc3R5bGUubGVmdCA9IGAke2xlZnR9cHhgXG4gICAgfSBlbHNlIHtcbiAgICAgIHN0eWxlLmJvdHRvbSA9IGAke3RoaXMubWFwVmFsdWUoe1xuICAgICAgICB2YWx1ZTogdGhpcy52YWx1ZSxcbiAgICAgICAgaW5NaW46IHRoaXMubWluLFxuICAgICAgICBpbk1heDogdGhpcy5tYXgsXG4gICAgICAgIG91dE1pbjogLWJvcmRlclNpemUsXG4gICAgICAgIG91dE1heDogdGhpcy5oZWlnaHQgLSB0aGlzLnRodW1iUmFkaXVzICogMiAtIGJvcmRlclNpemUsXG4gICAgICAgIGxvZ0ludmVyc2U6IHRydWVcbiAgICAgIH0pfXB4YFxuICAgIH1cbiAgICByZXR1cm4gc3R5bGVcbiAgfVxuXG4gIHByaXZhdGUgbWFwVmFsdWUgKHsgdmFsdWUsIGluTWluLCBpbk1heCwgb3V0TWluLCBvdXRNYXgsIGxvZ0ludmVyc2UgfToge1xuICAgIHZhbHVlOiBudW1iZXJcbiAgICBpbk1pbjogbnVtYmVyXG4gICAgaW5NYXg6IG51bWJlclxuICAgIG91dE1pbjogbnVtYmVyXG4gICAgb3V0TWF4OiBudW1iZXJcbiAgICBsb2dJbnZlcnNlPzogYm9vbGVhblxuICB9KSB7XG4gICAgc3dpdGNoICh0aGlzLnNjYWxlKSB7XG4gICAgICBjYXNlICdsaW5lYXInOiByZXR1cm4gdGhpcy51dGlscy5tYXBWYWx1ZSh2YWx1ZSwgaW5NaW4sIGluTWF4LCBvdXRNaW4sIG91dE1heClcbiAgICAgIGNhc2UgJ2xvZ2FyaXRobWljJzogcmV0dXJuIChsb2dJbnZlcnNlID8gdGhpcy51dGlscy5sb2dNYXBWYWx1ZUludmVyc2UgOiB0aGlzLnV0aWxzLmxvZ01hcFZhbHVlKSh7IHZhbHVlLCBpbk1pbiwgaW5NYXgsIG91dE1pbiwgb3V0TWF4IH0pXG4gICAgfVxuICB9XG59XG4iXX0=
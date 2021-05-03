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
        this.thumbRadius = 4;
        this.thumbBorderSize = 1;
        this.stickedToMiddle = new EventEmitter();
        this.defaultColor = '#4f8d71';
        this._enabled = true;
        this._color = this.defaultColor;
        this.dragging = false;
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
        var _a;
        const coords = this.utils.getCoordinatesInsideElementFromEvent(event, this.containerRef.nativeElement);
        let progress = this.orientation === 'vertical' ? coords.y : coords.x;
        let value = (() => {
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
        if ((_a = this.notches) === null || _a === void 0 ? void 0 : _a.length) {
            const closest = this.notches.reduce((prev, curr) => {
                return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
            });
            value = closest;
        }
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
        return this.getProgress(this.value);
    }
    getProgress(value) {
        const factor = 10000;
        let progress = this.mapValue({
            value,
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
    getNotchStyle(index) {
        const style = {
            position: 'absolute'
        };
        style.width = `${this.thumbRadius * 2}px`;
        style.height = style.width;
        const notchValue = this.notches[index];
        style.backgroundColor = this.value >= notchValue ? this.color : this.darkerColor;
        style.borderRadius = '100%';
        const center = `calc(50% - ${this.thumbRadius}px)`;
        const notchProgress = this.getProgress(notchValue);
        style.top = center;
        style.left = `${Math.round((this.width - this.thumbRadius * 2) * notchProgress)}px`;
        return style;
    }
    get thumbStyle() {
        const style = {};
        style.width = `${this.thumbRadius * 2}px`;
        style.height = style.width;
        style.border = `${this.thumbBorderSize}px solid black`;
        style.backgroundColor = this.color;
        style.borderRadius = '100%';
        if (this.orientation === 'horizontal') {
            const left = this.mapValue({
                value: this.value,
                inMin: this.min,
                inMax: this.max,
                outMin: -this.thumbBorderSize,
                outMax: this.width - this.thumbRadius * 2 - this.thumbBorderSize,
                logInverse: true
            });
            style.left = `${left}px`;
        }
        else {
            style.bottom = `${this.mapValue({
                value: this.value,
                inMin: this.min,
                inMax: this.max,
                outMin: -this.thumbBorderSize,
                outMax: this.height - this.thumbRadius * 2 - this.thumbBorderSize,
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
                template: "\n<div class=\"container\" #container [ngStyle]=\"containerStyle\">\n  <div class=\"groove\" [ngStyle]=\"grooveStyle\"></div>\n  <div class=\"groove-filling\" [ngStyle]=\"grooveFillingStyle\"></div>\n  <div class=\"thumbNotch\" *ngIf=\"showMiddleNotch\" [ngStyle]=\"thumbNotchStyle\"></div>\n  <div *ngIf=\"notches?.length\" class=\"notches\">\n    <div *ngFor=\"let notch of notches; index as i\" class=\"notch\" [ngStyle]=\"getNotchStyle(i)\"></div>\n  </div>\n  <div class=\"thumb\" [ngStyle]=\"thumbStyle\" (dblclick)=\"doubleclick()\"></div>\n</div>\n",
                animations: [FadeInOutAnimation],
                styles: [":host{display:block;padding:2px}:host.disabled{filter:grayscale(80%)}.container{position:relative}.container .notches{width:100%;height:100%}.container *{position:absolute}"]
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
    notches: [{ type: Input }],
    thumbRadius: [{ type: Input }],
    thumbBorderSize: [{ type: Input }],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxhdC1zbGlkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvY29tcG9uZW50cy9mbGF0LXNsaWRlci9mbGF0LXNsaWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLFlBQVksRUFDWixVQUFVLEVBQ1YsV0FBVyxFQUNaLE1BQU0sZUFBZSxDQUFBO0FBQ3RCLE9BQU8sRUFDTCxnQkFBZ0IsRUFDakIsTUFBTSxrQ0FBa0MsQ0FBQTtBQUN6QyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQTtBQUNyRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMkJBQTJCLENBQUE7QUFheEQsTUFBTSxPQUFPLG1CQUFtQjtJQUM5QixZQUNTLEtBQXVCLEVBQ3ZCLElBQWdCLEVBQ2hCLFNBQXVCO1FBRnZCLFVBQUssR0FBTCxLQUFLLENBQWtCO1FBQ3ZCLFNBQUksR0FBSixJQUFJLENBQVk7UUFDaEIsY0FBUyxHQUFULFNBQVMsQ0FBYztRQUd2QixVQUFLLEdBQTZCLFFBQVEsQ0FBQTtRQUMxQyxpQ0FBNEIsR0FBRyxJQUFJLENBQUE7UUFDbkMsb0JBQWUsR0FBRyxJQUFJLENBQUE7UUFDdEIsUUFBRyxHQUFXLENBQUMsQ0FBQTtRQUNmLFFBQUcsR0FBVyxDQUFDLENBQUE7UUFDZixzQkFBaUIsR0FBRyxHQUFHLENBQUE7UUFDdkIsaUJBQVksR0FBRyxFQUFFLENBQUE7UUFDakIsa0JBQWEsR0FBRyxJQUFJLENBQUE7UUFFcEIsa0JBQWEsR0FBRyxJQUFJLENBQUE7UUFDcEIsY0FBUyxHQUFHLENBQUMsQ0FBQTtRQUNiLGdCQUFXLEdBQThCLFlBQVksQ0FBQTtRQUVyRCxnQkFBVyxHQUFHLENBQUMsQ0FBQTtRQUNm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LENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1NBQzFJO0lBQ0gsQ0FBQzs7O1lBNVhGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQix3akJBQTJDO2dCQUUzQyxVQUFVLEVBQUUsQ0FBRSxrQkFBa0IsQ0FBRTs7YUFDbkM7OztZQWZDLGdCQUFnQjtZQUpoQixVQUFVO1lBT0gsWUFBWTs7O29CQW9CbEIsS0FBSzsyQ0FDTCxLQUFLOzhCQUNMLEtBQUs7a0JBQ0wsS0FBSztrQkFDTCxLQUFLO2dDQUNMLEtBQUs7MkJBQ0wsS0FBSzs0QkFDTCxLQUFLO3FCQUNMLEtBQUs7NEJBQ0wsS0FBSzt3QkFDTCxLQUFLOzBCQUNMLEtBQUs7c0JBQ0wsS0FBSzswQkFDTCxLQUFLOzhCQUNMLEtBQUs7OEJBRUwsTUFBTTsyQkFDTixTQUFTLFNBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTt1QkFTdkMsV0FBVyxTQUFDLGdCQUFnQjtzQkFDNUIsS0FBSztvQkFTTCxLQUFLO29CQXVCTCxLQUFLOzBCQWlDTCxNQUFNOytCQUNOLE1BQU07eUJBZ0JOLFlBQVksU0FBQyxZQUFZLEVBQUUsQ0FBRSxRQUFRLENBQUU7d0JBOEN2QyxZQUFZLFNBQUMsV0FBVyxFQUFFLENBQUUsUUFBUSxDQUFFO3dCQVN0QyxZQUFZLFNBQUMsV0FBVyxFQUFFLENBQUUsUUFBUSxDQUFFOzJCQVN0QyxZQUFZLFNBQUMsWUFBWTsyQkFLekIsWUFBWSxTQUFDLFlBQVk7d0JBb0N6QixZQUFZLFNBQUMsU0FBUyxFQUFFLENBQUUsUUFBUSxDQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBWaWV3Q2hpbGQsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdExpc3RlbmVyLFxuICBFbGVtZW50UmVmLFxuICBIb3N0QmluZGluZ1xufSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuaW1wb3J0IHtcbiAgVXRpbGl0aWVzU2VydmljZVxufSBmcm9tICcuLi8uLi9zZXJ2aWNlcy91dGlsaXRpZXMuc2VydmljZSdcbmltcG9ydCB7IEZhZGVJbk91dEFuaW1hdGlvbiB9IGZyb20gJy4uLy4uL2FuaW1hdGlvbnMnXG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJ1xuXG5leHBvcnQgaW50ZXJmYWNlIEZsYXRTbGlkZXJWYWx1ZUNoYW5nZWRFdmVudCB7XG4gIHZhbHVlOiBudW1iZXJcbiAgdHJhbnNpdGlvbj86IGJvb2xlYW5cbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZXFtLWZsYXQtc2xpZGVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2ZsYXQtc2xpZGVyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbICcuL2ZsYXQtc2xpZGVyLmNvbXBvbmVudC5zY3NzJyBdLFxuICBhbmltYXRpb25zOiBbIEZhZGVJbk91dEFuaW1hdGlvbiBdXG59KVxuZXhwb3J0IGNsYXNzIEZsYXRTbGlkZXJDb21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAoXG4gICAgcHVibGljIHV0aWxzOiBVdGlsaXRpZXNTZXJ2aWNlLFxuICAgIHB1YmxpYyBlbGVtOiBFbGVtZW50UmVmLFxuICAgIHB1YmxpYyBzYW5pdGl6ZXI6IERvbVNhbml0aXplclxuICApIHt9XG5cbiAgQElucHV0KCkgc2NhbGU6ICdsb2dhcml0aG1pYycgfCAnbGluZWFyJyA9ICdsaW5lYXInXG4gIEBJbnB1dCgpIGRvdWJsZUNsaWNrVG9BbmltYXRlVG9NaWRkbGUgPSB0cnVlXG4gIEBJbnB1dCgpIHNob3dNaWRkbGVOb3RjaCA9IHRydWVcbiAgQElucHV0KCkgbWluOiBudW1iZXIgPSAwXG4gIEBJbnB1dCgpIG1heDogbnVtYmVyID0gMVxuICBASW5wdXQoKSBhbmltYXRpb25EdXJhdGlvbiA9IDUwMFxuICBASW5wdXQoKSBhbmltYXRpb25GcHMgPSAzMFxuICBASW5wdXQoKSBzY3JvbGxFbmFibGVkID0gdHJ1ZVxuICBASW5wdXQoKSBtaWRkbGU/OiBudW1iZXJcbiAgQElucHV0KCkgc3RpY2tUb01pZGRsZSA9IHRydWVcbiAgQElucHV0KCkgdGhpY2tuZXNzID0gMlxuICBASW5wdXQoKSBvcmllbnRhdGlvbjogJ3ZlcnRpY2FsJyB8ICdob3Jpem9udGFsJyA9ICdob3Jpem9udGFsJ1xuICBASW5wdXQoKSBub3RjaGVzOiBudW1iZXJbXVxuICBASW5wdXQoKSB0aHVtYlJhZGl1cyA9IDRcbiAgQElucHV0KCkgdGh1bWJCb3JkZXJTaXplID0gMVxuXG4gIEBPdXRwdXQoKSBzdGlja2VkVG9NaWRkbGUgPSBuZXcgRXZlbnRFbWl0dGVyKClcbiAgQFZpZXdDaGlsZCgnY29udGFpbmVyJywgeyBzdGF0aWM6IHRydWUgfSkgY29udGFpbmVyUmVmITogRWxlbWVudFJlZlxuXG4gIGdldCBtaWRkbGVWYWx1ZSAoKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGlzLm1pZGRsZSA9PT0gJ251bWJlcicgPyB0aGlzLm1pZGRsZSA6ICh0aGlzLm1pbiArIHRoaXMubWF4KSAvIDJcbiAgfVxuXG4gIHB1YmxpYyBkZWZhdWx0Q29sb3IgPSAnIzRmOGQ3MSdcbiAgcHVibGljIF9lbmFibGVkID0gdHJ1ZVxuXG4gIEBIb3N0QmluZGluZygnY2xhc3MuZGlzYWJsZWQnKSBnZXQgZGlzYWJsZWQgKCkgeyByZXR1cm4gIXRoaXMuZW5hYmxlZCB9XG4gIEBJbnB1dCgpXG4gIHNldCBlbmFibGVkIChzaG91bGRCZUVuYWJsZWQpIHtcbiAgICB0aGlzLl9lbmFibGVkID0gc2hvdWxkQmVFbmFibGVkXG4gICAgdGhpcy5fY29sb3IgPSB0aGlzLl9lbmFibGVkID8gdGhpcy5kZWZhdWx0Q29sb3IgOiAnIzc3NydcbiAgfVxuXG4gIGdldCBlbmFibGVkICgpIHsgcmV0dXJuIHRoaXMuX2VuYWJsZWQgfVxuXG4gIHB1YmxpYyBfY29sb3IgPSB0aGlzLmRlZmF1bHRDb2xvclxuICBASW5wdXQoKVxuICBzZXQgY29sb3IgKG5ld0NvbG9yKSB7XG4gICAgdGhpcy5kZWZhdWx0Q29sb3IgPSBuZXdDb2xvclxuICAgIHRoaXMuX2NvbG9yID0gdGhpcy5fZW5hYmxlZCA/IHRoaXMuZGVmYXVsdENvbG9yIDogJyM3NzcnXG4gIH1cblxuICBnZXQgY29sb3IgKCkge1xuICAgIHJldHVybiB0aGlzLl9jb2xvclxuICB9XG5cbiAgZ2V0IGRhcmtlckNvbG9yICgpIHtcbiAgICBjb25zdCByZ2IgPSB0aGlzLnV0aWxzLmhleFRvUmdiKHRoaXMuY29sb3IpXG4gICAgdHlwZSBjYyA9IGtleW9mIHR5cGVvZiByZ2JcbiAgICBmb3IgKGNvbnN0IGNoYW5uZWwgaW4gcmdiKSB7XG4gICAgICByZ2JbY2hhbm5lbCBhcyBjY10gPSBNYXRoLnJvdW5kKDAuOCAqIHJnYltjaGFubmVsIGFzIGNjXSlcbiAgICB9XG4gICAgY29uc3QgaGV4ID0gdGhpcy51dGlscy5yZ2JUb0hleChyZ2IpXG4gICAgcmV0dXJuIGhleFxuICB9XG5cbiAgcHVibGljIGRyYWdnaW5nID0gZmFsc2VcblxuICBwdWJsaWMgX3ZhbHVlID0gMC41XG4gIEBJbnB1dCgpXG4gIHNldCB2YWx1ZSAobmV3VmFsdWUpIHtcbiAgICBsZXQgdmFsdWUgPSB0aGlzLmNsYW1wVmFsdWUobmV3VmFsdWUpXG5cbiAgICBpZiAodGhpcy5zdGlja1RvTWlkZGxlKSB7XG4gICAgICBjb25zdCBtaWRkbGVWYWx1ZSA9IHRoaXMubWlkZGxlVmFsdWVcblxuICAgICAgbGV0IGRpZmZGcm9tTWlkZGxlID0gbWlkZGxlVmFsdWUgLSB2YWx1ZVxuICAgICAgaWYgKGRpZmZGcm9tTWlkZGxlIDwgMCkge1xuICAgICAgICBkaWZmRnJvbU1pZGRsZSAqPSAtMVxuICAgICAgfVxuICAgICAgY29uc3QgcGVyY0Zyb21NaWRkbGUgPSB0aGlzLm1hcFZhbHVlKHtcbiAgICAgICAgdmFsdWU6IGRpZmZGcm9tTWlkZGxlLFxuICAgICAgICBpbk1pbjogMCxcbiAgICAgICAgaW5NYXg6IHRoaXMubWF4IC0gbWlkZGxlVmFsdWUsXG4gICAgICAgIG91dE1pbjogMCxcbiAgICAgICAgb3V0TWF4OiAxMDBcbiAgICAgIH0pXG4gICAgICBpZiAoKHRoaXMuX3ZhbHVlKS50b0ZpeGVkKDIpID09PSAobWlkZGxlVmFsdWUpLnRvRml4ZWQoMikgJiYgcGVyY0Zyb21NaWRkbGUgPCA1KSB7XG4gICAgICAgIHZhbHVlID0gbWlkZGxlVmFsdWVcbiAgICAgIH0gZWxzZSBpZiAoKHRoaXMuX3ZhbHVlIDwgbWlkZGxlVmFsdWUgJiYgbmV3VmFsdWUgPiB0aGlzLl92YWx1ZSkgfHwgKHRoaXMuX3ZhbHVlID4gbWlkZGxlVmFsdWUgJiYgbmV3VmFsdWUgPCB0aGlzLl92YWx1ZSkpIHtcbiAgICAgICAgaWYgKHBlcmNGcm9tTWlkZGxlIDwgMykge1xuICAgICAgICAgIHZhbHVlID0gbWlkZGxlVmFsdWVcbiAgICAgICAgICB0aGlzLnN0aWNrZWRUb01pZGRsZS5lbWl0KClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl92YWx1ZSA9IHRoaXMuY2xhbXBWYWx1ZSh2YWx1ZSlcbiAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodGhpcy5fdmFsdWUpXG4gIH1cblxuICBnZXQgdmFsdWUgKCkgeyByZXR1cm4gdGhpcy5fdmFsdWUgfVxuXG4gIEBPdXRwdXQoKSB2YWx1ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKVxuICBAT3V0cHV0KCkgdXNlckNoYW5nZWRWYWx1ZSA9IG5ldyBFdmVudEVtaXR0ZXI8RmxhdFNsaWRlclZhbHVlQ2hhbmdlZEV2ZW50PigpXG5cbiAgZ2V0IGhlaWdodCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyUmVmLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0XG4gIH1cblxuICBnZXQgd2lkdGggKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lclJlZi5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoXG4gIH1cblxuICBwdWJsaWMgY2xhbXBWYWx1ZSAodmFsdWU6IG51bWJlcikge1xuICAgIGlmICh2YWx1ZSA8IHRoaXMubWluKSByZXR1cm4gdGhpcy5taW5cbiAgICBpZiAodmFsdWUgPiB0aGlzLm1heCkgcmV0dXJuIHRoaXMubWF4XG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZXdoZWVsJywgWyAnJGV2ZW50JyBdKVxuICBtb3VzZVdoZWVsIChldmVudDogV2hlZWxFdmVudCkge1xuICAgIGlmICh0aGlzLmVuYWJsZWQgJiYgdGhpcy5zY3JvbGxFbmFibGVkKSB7XG4gICAgICAvLyBjb25zdCBtdWx0aXBsaWVyID0gKHRoaXMubWF4IC0gdGhpcy5taW4pIC8gMTAwMFxuICAgICAgbGV0IHByb2dyZXNzID0gdGhpcy5wcm9ncmVzc1xuICAgICAgcHJvZ3Jlc3MgKz0gLWV2ZW50LmRlbHRhWSAvIDEwMDBcbiAgICAgIGlmIChwcm9ncmVzcyA8IDApIHByb2dyZXNzID0gMFxuICAgICAgaWYgKHByb2dyZXNzID4gMSkgcHJvZ3Jlc3MgPSAxXG4gICAgICBwcm9ncmVzcyA9IE1hdGgucm91bmQocHJvZ3Jlc3MgKiAxMDAwKVxuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMubWFwVmFsdWUoe1xuICAgICAgICB2YWx1ZTogcHJvZ3Jlc3MsXG4gICAgICAgIGluTWluOiAwLFxuICAgICAgICBpbk1heDogMTAwMCxcbiAgICAgICAgb3V0TWluOiB0aGlzLm1pbixcbiAgICAgICAgb3V0TWF4OiB0aGlzLm1heCxcbiAgICAgICAgbG9nSW52ZXJzZTogZmFsc2VcbiAgICAgIH0pXG4gICAgICB0aGlzLnVzZXJDaGFuZ2VkVmFsdWUuZW1pdCh7IHZhbHVlOiB0aGlzLl92YWx1ZSB9KVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRWYWx1ZUZyb21Nb3VzZUV2ZW50IChldmVudDogTW91c2VFdmVudCkge1xuICAgIGNvbnN0IGNvb3JkcyA9IHRoaXMudXRpbHMuZ2V0Q29vcmRpbmF0ZXNJbnNpZGVFbGVtZW50RnJvbUV2ZW50KGV2ZW50LCB0aGlzLmNvbnRhaW5lclJlZi5uYXRpdmVFbGVtZW50KVxuICAgIGxldCBwcm9ncmVzcyA9IHRoaXMub3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcgPyBjb29yZHMueSA6IGNvb3Jkcy54XG4gICAgbGV0IHZhbHVlID0gKCgpID0+IHtcbiAgICAgIGNvbnN0IGluTWluID0gdGhpcy50aHVtYlJhZGl1c1xuICAgICAgY29uc3QgaW5NYXggPSAodGhpcy5vcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJyA/IHRoaXMuaGVpZ2h0IDogdGhpcy53aWR0aCkgLSB0aGlzLnRodW1iUmFkaXVzICogMlxuICAgICAgaWYgKHByb2dyZXNzIDwgaW5NaW4pIHByb2dyZXNzID0gaW5NaW5cbiAgICAgIGlmIChwcm9ncmVzcyA+IGluTWF4KSBwcm9ncmVzcyA9IGluTWF4XG4gICAgICByZXR1cm4gdGhpcy5tYXBWYWx1ZSh7XG4gICAgICAgIHZhbHVlOiBwcm9ncmVzcyxcbiAgICAgICAgaW5NaW4sXG4gICAgICAgIGluTWF4LFxuICAgICAgICBvdXRNaW46IHRoaXMubWluLFxuICAgICAgICBvdXRNYXg6IHRoaXMubWF4XG4gICAgICB9KVxuICAgIH0pKClcbiAgICBpZiAodGhpcy5ub3RjaGVzPy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNsb3Nlc3QgPSB0aGlzLm5vdGNoZXMucmVkdWNlKChwcmV2LCBjdXJyKSA9PiB7XG4gICAgICAgIHJldHVybiAoTWF0aC5hYnMoY3VyciAtIHZhbHVlKSA8IE1hdGguYWJzKHByZXYgLSB2YWx1ZSkgPyBjdXJyIDogcHJldik7XG4gICAgICB9KVxuICAgICAgdmFsdWUgPSBjbG9zZXN0XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2Vkb3duJywgWyAnJGV2ZW50JyBdKVxuICBtb3VzZWRvd24gKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgaWYgKHRoaXMuZW5hYmxlZCkge1xuICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWVcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLmdldFZhbHVlRnJvbU1vdXNlRXZlbnQoZXZlbnQpXG4gICAgICB0aGlzLnVzZXJDaGFuZ2VkVmFsdWUuZW1pdCh7IHZhbHVlOiB0aGlzLl92YWx1ZSB9KVxuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlbW92ZScsIFsgJyRldmVudCcgXSlcbiAgbW91c2Vtb3ZlIChldmVudDogTW91c2VFdmVudCkge1xuICAgIGlmICh0aGlzLmVuYWJsZWQgJiYgdGhpcy5kcmFnZ2luZykge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuZ2V0VmFsdWVGcm9tTW91c2VFdmVudChldmVudClcbiAgICAgIHRoaXMudXNlckNoYW5nZWRWYWx1ZS5lbWl0KHsgdmFsdWU6IHRoaXMuX3ZhbHVlIH0pXG4gICAgfVxuICB9XG5cbiAgcHVibGljIG1vdXNlSW5zaWRlID0gZmFsc2VcbiAgQEhvc3RMaXN0ZW5lcignbW91c2VlbnRlcicpXG4gIG9uTW91c2VFbnRlciAoKTogdm9pZCB7XG4gICAgdGhpcy5tb3VzZUluc2lkZSA9IHRydWVcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlbGVhdmUnKVxuICBvbk1vdXNlTGVhdmUgKCk6IHZvaWQge1xuICAgIHRoaXMubW91c2VJbnNpZGUgPSBmYWxzZVxuICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxuICB9XG5cbiAgcHVibGljIGRvdWJsZWNsaWNrVGltZW91dD86IG51bWJlclxuICBkb3VibGVjbGljayAoKSB7XG4gICAgaWYgKHRoaXMuZW5hYmxlZCAmJiB0aGlzLmRvdWJsZUNsaWNrVG9BbmltYXRlVG9NaWRkbGUpIHtcbiAgICAgIGlmICh0aGlzLmRvdWJsZWNsaWNrVGltZW91dCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5kb3VibGVjbGlja1RpbWVvdXQpXG4gICAgICB9XG5cbiAgICAgIHRoaXMudXNlckNoYW5nZWRWYWx1ZS5lbWl0KHtcbiAgICAgICAgdmFsdWU6IHRoaXMubWlkZGxlVmFsdWUsXG4gICAgICAgIHRyYW5zaXRpb246IHRydWVcbiAgICAgIH0pXG4gICAgICB0aGlzLmFuaW1hdGVTbGlkZXIodGhpcy52YWx1ZSwgdGhpcy5taWRkbGVWYWx1ZSlcbiAgICB9XG4gIH1cblxuICBhc3luYyBhbmltYXRlU2xpZGVyIChmcm9tOiBudW1iZXIsIHRvOiBudW1iZXIpIHtcbiAgICBmcm9tID0gdGhpcy5jbGFtcFZhbHVlKGZyb20pXG4gICAgdG8gPSB0aGlzLmNsYW1wVmFsdWUodG8pXG4gICAgY29uc3QgZGlmZiA9IHRvIC0gZnJvbVxuICAgIGNvbnN0IGRlbGF5ID0gMTAwMCAvIHRoaXMuYW5pbWF0aW9uRnBzXG4gICAgY29uc3QgZnJhbWVzID0gdGhpcy5hbmltYXRpb25GcHMgKiAodGhpcy5hbmltYXRpb25EdXJhdGlvbiAvIDEwMDApXG4gICAgY29uc3Qgc3RlcCA9IGRpZmYgLyBmcmFtZXNcbiAgICBsZXQgdmFsdWUgPSBmcm9tXG4gICAgZm9yIChsZXQgZnJhbWUgPSAwOyBmcmFtZSA8IGZyYW1lczsgZnJhbWUrKykge1xuICAgICAgYXdhaXQgdGhpcy51dGlscy5kZWxheShkZWxheSlcbiAgICAgIHZhbHVlICs9IHN0ZXBcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZVxuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNldXAnLCBbICckZXZlbnQnIF0pXG4gIG9uTW91c2VVcCAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcbiAgfVxuXG4gIG1vdXNldXAgKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXG4gIH1cblxuICBnZXQgcHJvZ3Jlc3MgKCkge1xuICAgIHJldHVybiB0aGlzLmdldFByb2dyZXNzKHRoaXMudmFsdWUpXG4gIH1cblxuICBnZXRQcm9ncmVzcyAodmFsdWU6IG51bWJlcikge1xuICAgIGNvbnN0IGZhY3RvciA9IDEwMDAwXG4gICAgbGV0IHByb2dyZXNzID0gdGhpcy5tYXBWYWx1ZSh7XG4gICAgICB2YWx1ZSxcbiAgICAgIGluTWluOiB0aGlzLm1pbixcbiAgICAgIGluTWF4OiB0aGlzLm1heCxcbiAgICAgIG91dE1pbjogMCxcbiAgICAgIG91dE1heDogZmFjdG9yLFxuICAgICAgbG9nSW52ZXJzZTogdHJ1ZVxuICAgIH0pXG5cbiAgICBwcm9ncmVzcyAvPSBmYWN0b3JcbiAgICByZXR1cm4gcHJvZ3Jlc3NcbiAgfVxuXG4gIGdldCBjb250YWluZXJTdHlsZSAoKSB7XG4gICAgY29uc3Qgc3R5bGVzOiB7IFtzdHlsZTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fVxuICAgIGNvbnN0IG5hcnJvdyA9IHRoaXMudGh1bWJSYWRpdXMgKiAyICsgMlxuICAgIGlmICh0aGlzLm9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIHN0eWxlcy53aWR0aCA9ICcxMDAlJ1xuICAgICAgc3R5bGVzLmhlaWdodCA9IGAke25hcnJvd31weGBcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGVzLmhlaWdodCA9ICcxMDAlJ1xuICAgICAgc3R5bGVzLndpZHRoID0gYCR7bmFycm93fXB4YFxuICAgIH1cblxuICAgIHJldHVybiBzdHlsZXNcbiAgfVxuXG4gIGdldCBncm9vdmVTdHlsZSAoKSB7XG4gICAgY29uc3Qgc3R5bGU6IHsgW3N0eWxlOiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfSA9IHt9XG4gICAgaWYgKHRoaXMub3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgc3R5bGUubGVmdCA9IGAke3RoaXMudGh1bWJSYWRpdXN9cHhgXG4gICAgICBzdHlsZS50b3AgPSBgY2FsYyg1MCUgLSAke3RoaXMudGhpY2tuZXNzfXB4IC8gMilgXG4gICAgICBzdHlsZS53aWR0aCA9IGBjYWxjKDEwMCUgLSAke3RoaXMudGh1bWJSYWRpdXMgKiAyfXB4KWBcbiAgICAgIHN0eWxlLmhlaWdodCA9IGAke3RoaXMudGhpY2tuZXNzfXB4YFxuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZS50b3AgPSBgJHt0aGlzLnRodW1iUmFkaXVzfXB4YFxuICAgICAgc3R5bGUubGVmdCA9IGBjYWxjKDUwJSAtICR7dGhpcy50aGlja25lc3N9cHggLyAyKWBcbiAgICAgIHN0eWxlLmhlaWdodCA9IGBjYWxjKDEwMCUgLSAke3RoaXMudGh1bWJSYWRpdXMgKiAyfXB4KWBcbiAgICAgIHN0eWxlLndpZHRoID0gYCR7dGhpcy50aGlja25lc3N9cHhgXG4gICAgfVxuICAgIHN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuZGFya2VyQ29sb3JcbiAgICByZXR1cm4gc3R5bGVcbiAgfVxuXG4gIGdldCBncm9vdmVGaWxsaW5nU3R5bGUgKCkge1xuICAgIGNvbnN0IHN0eWxlOiB7IFtzdHlsZTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fVxuICAgIGlmICh0aGlzLm9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIHN0eWxlLmxlZnQgPSBgJHt0aGlzLnRodW1iUmFkaXVzfXB4YFxuICAgICAgc3R5bGUudG9wID0gYGNhbGMoNTAlIC0gJHt0aGlzLnRoaWNrbmVzc31weCAvIDIpYFxuICAgICAgc3R5bGUud2lkdGggPSBgY2FsYygke3RoaXMucHJvZ3Jlc3MgKiAxMDB9JSAtICR7dGhpcy50aHVtYlJhZGl1c31weClgXG4gICAgICBzdHlsZS5oZWlnaHQgPSBgJHt0aGlzLnRoaWNrbmVzc31weGBcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGUudG9wID0gYCR7dGhpcy50aHVtYlJhZGl1c31weGBcbiAgICAgIHN0eWxlLmxlZnQgPSBgY2FsYyg1MCUgLSAke3RoaXMudGhpY2tuZXNzfXB4IC8gMilgXG4gICAgICBzdHlsZS5oZWlnaHQgPSBgY2FsYygke3RoaXMucHJvZ3Jlc3MgKiAxMDB9JSAtICR7dGhpcy50aHVtYlJhZGl1cyAqIDJ9cHgpYFxuICAgICAgc3R5bGUud2lkdGggPSBgJHt0aGlzLnRoaWNrbmVzc31weGBcbiAgICB9XG4gICAgc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5jb2xvclxuICAgIHJldHVybiBzdHlsZVxuICB9XG5cbiAgZ2V0IHRodW1iTm90Y2hTdHlsZSAoKSB7XG4gICAgY29uc3Qgc3R5bGU6IHsgW3N0eWxlOiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfSA9IHt9XG4gICAgc3R5bGUud2lkdGggPSBgJHt0aGlzLnRodW1iUmFkaXVzICogMn1weGBcbiAgICBzdHlsZS5oZWlnaHQgPSBzdHlsZS53aWR0aFxuICAgIHN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWUgPj0gdGhpcy5taWRkbGVWYWx1ZSA/IHRoaXMuY29sb3IgOiB0aGlzLmRhcmtlckNvbG9yXG5cbiAgICBzdHlsZS5ib3JkZXJSYWRpdXMgPSAnMTAwJSdcbiAgICBjb25zdCBjZW50ZXIgPSBgY2FsYyg1MCUgLSAke3RoaXMudGh1bWJSYWRpdXN9cHgpYFxuXG4gICAgc3R5bGUudG9wID0gY2VudGVyXG4gICAgc3R5bGUubGVmdCA9IGNlbnRlclxuXG4gICAgcmV0dXJuIHN0eWxlXG4gIH1cblxuICBnZXROb3RjaFN0eWxlIChpbmRleDogbnVtYmVyKSB7XG4gICAgY29uc3Qgc3R5bGU6IHsgW3N0eWxlOiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfSA9IHtcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gICAgfVxuICAgIHN0eWxlLndpZHRoID0gYCR7dGhpcy50aHVtYlJhZGl1cyAqIDJ9cHhgXG4gICAgc3R5bGUuaGVpZ2h0ID0gc3R5bGUud2lkdGhcbiAgICBjb25zdCBub3RjaFZhbHVlID0gdGhpcy5ub3RjaGVzW2luZGV4XVxuICAgIHN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWUgPj0gbm90Y2hWYWx1ZSA/IHRoaXMuY29sb3IgOiB0aGlzLmRhcmtlckNvbG9yXG5cbiAgICBzdHlsZS5ib3JkZXJSYWRpdXMgPSAnMTAwJSdcbiAgICBjb25zdCBjZW50ZXIgPSBgY2FsYyg1MCUgLSAke3RoaXMudGh1bWJSYWRpdXN9cHgpYFxuXG4gICAgY29uc3Qgbm90Y2hQcm9ncmVzcyA9IHRoaXMuZ2V0UHJvZ3Jlc3Mobm90Y2hWYWx1ZSlcbiAgICBzdHlsZS50b3AgPSBjZW50ZXJcbiAgICBzdHlsZS5sZWZ0ID0gYCR7TWF0aC5yb3VuZCgodGhpcy53aWR0aCAtIHRoaXMudGh1bWJSYWRpdXMgKiAyKSAqIG5vdGNoUHJvZ3Jlc3MpfXB4YFxuXG4gICAgcmV0dXJuIHN0eWxlXG4gIH1cblxuICBnZXQgdGh1bWJTdHlsZSAoKSB7XG4gICAgY29uc3Qgc3R5bGU6IHsgW3N0eWxlOiBzdHJpbmddOiBudW1iZXIgfCBzdHJpbmcgfSA9IHt9XG4gICAgc3R5bGUud2lkdGggPSBgJHt0aGlzLnRodW1iUmFkaXVzICogMn1weGBcbiAgICBzdHlsZS5oZWlnaHQgPSBzdHlsZS53aWR0aFxuICAgIHN0eWxlLmJvcmRlciA9IGAke3RoaXMudGh1bWJCb3JkZXJTaXplfXB4IHNvbGlkIGJsYWNrYFxuICAgIHN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuY29sb3JcblxuICAgIHN0eWxlLmJvcmRlclJhZGl1cyA9ICcxMDAlJ1xuICAgIGlmICh0aGlzLm9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIGNvbnN0IGxlZnQgPSB0aGlzLm1hcFZhbHVlKHtcbiAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXG4gICAgICAgIGluTWluOiB0aGlzLm1pbixcbiAgICAgICAgaW5NYXg6IHRoaXMubWF4LFxuICAgICAgICBvdXRNaW46IC10aGlzLnRodW1iQm9yZGVyU2l6ZSxcbiAgICAgICAgb3V0TWF4OiB0aGlzLndpZHRoIC0gdGhpcy50aHVtYlJhZGl1cyAqIDIgLSB0aGlzLnRodW1iQm9yZGVyU2l6ZSxcbiAgICAgICAgbG9nSW52ZXJzZTogdHJ1ZVxuICAgICAgfSlcbiAgICAgIHN0eWxlLmxlZnQgPSBgJHtsZWZ0fXB4YFxuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZS5ib3R0b20gPSBgJHt0aGlzLm1hcFZhbHVlKHtcbiAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXG4gICAgICAgIGluTWluOiB0aGlzLm1pbixcbiAgICAgICAgaW5NYXg6IHRoaXMubWF4LFxuICAgICAgICBvdXRNaW46IC10aGlzLnRodW1iQm9yZGVyU2l6ZSxcbiAgICAgICAgb3V0TWF4OiB0aGlzLmhlaWdodCAtIHRoaXMudGh1bWJSYWRpdXMgKiAyIC0gdGhpcy50aHVtYkJvcmRlclNpemUsXG4gICAgICAgIGxvZ0ludmVyc2U6IHRydWVcbiAgICAgIH0pfXB4YFxuICAgIH1cbiAgICByZXR1cm4gc3R5bGVcbiAgfVxuXG4gIHByaXZhdGUgbWFwVmFsdWUgKHsgdmFsdWUsIGluTWluLCBpbk1heCwgb3V0TWluLCBvdXRNYXgsIGxvZ0ludmVyc2UgfToge1xuICAgIHZhbHVlOiBudW1iZXJcbiAgICBpbk1pbjogbnVtYmVyXG4gICAgaW5NYXg6IG51bWJlclxuICAgIG91dE1pbjogbnVtYmVyXG4gICAgb3V0TWF4OiBudW1iZXJcbiAgICBsb2dJbnZlcnNlPzogYm9vbGVhblxuICB9KSB7XG4gICAgc3dpdGNoICh0aGlzLnNjYWxlKSB7XG4gICAgICBjYXNlICdsaW5lYXInOiByZXR1cm4gdGhpcy51dGlscy5tYXBWYWx1ZSh2YWx1ZSwgaW5NaW4sIGluTWF4LCBvdXRNaW4sIG91dE1heClcbiAgICAgIGNhc2UgJ2xvZ2FyaXRobWljJzogcmV0dXJuIChsb2dJbnZlcnNlID8gdGhpcy51dGlscy5sb2dNYXBWYWx1ZUludmVyc2UgOiB0aGlzLnV0aWxzLmxvZ01hcFZhbHVlKSh7IHZhbHVlLCBpbk1pbiwgaW5NYXgsIG91dE1pbiwgb3V0TWF4IH0pXG4gICAgfVxuICB9XG59XG4iXX0=
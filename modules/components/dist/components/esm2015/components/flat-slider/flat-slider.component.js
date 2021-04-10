import { __awaiter } from "tslib";
import { Component, ViewChild, Input, Output, EventEmitter, HostListener, HostBinding } from '@angular/core';
import { FadeInOutAnimation } from '../../animations';
import * as i0 from "@angular/core";
import * as i1 from "../../services/utilities.service";
import * as i2 from "@angular/platform-browser";
import * as i3 from "@angular/common";
const _c0 = ["container"];
function FlatSliderComponent_div_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 6);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("ngStyle", ctx_r1.thumbNotchStyle);
} }
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
FlatSliderComponent.ɵfac = function FlatSliderComponent_Factory(t) { return new (t || FlatSliderComponent)(i0.ɵɵdirectiveInject(i1.UtilitiesService), i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i2.DomSanitizer)); };
FlatSliderComponent.ɵcmp = i0.ɵɵdefineComponent({ type: FlatSliderComponent, selectors: [["eqm-flat-slider"]], viewQuery: function FlatSliderComponent_Query(rf, ctx) { if (rf & 1) {
        i0.ɵɵviewQuery(_c0, 3);
    } if (rf & 2) {
        let _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.containerRef = _t.first);
    } }, hostVars: 2, hostBindings: function FlatSliderComponent_HostBindings(rf, ctx) { if (rf & 1) {
        i0.ɵɵlistener("mousewheel", function FlatSliderComponent_mousewheel_HostBindingHandler($event) { return ctx.mouseWheel($event); })("mousedown", function FlatSliderComponent_mousedown_HostBindingHandler($event) { return ctx.mousedown($event); })("mousemove", function FlatSliderComponent_mousemove_HostBindingHandler($event) { return ctx.mousemove($event); })("mouseenter", function FlatSliderComponent_mouseenter_HostBindingHandler() { return ctx.onMouseEnter(); })("mouseleave", function FlatSliderComponent_mouseleave_HostBindingHandler() { return ctx.onMouseLeave(); })("mouseup", function FlatSliderComponent_mouseup_HostBindingHandler($event) { return ctx.onMouseUp($event); });
    } if (rf & 2) {
        i0.ɵɵclassProp("disabled", ctx.disabled);
    } }, inputs: { scale: "scale", doubleClickToAnimateToMiddle: "doubleClickToAnimateToMiddle", showMiddleNotch: "showMiddleNotch", min: "min", max: "max", animationDuration: "animationDuration", animationFps: "animationFps", scrollEnabled: "scrollEnabled", middle: "middle", stickToMiddle: "stickToMiddle", thickness: "thickness", orientation: "orientation", enabled: "enabled", color: "color", value: "value" }, outputs: { stickedToMiddle: "stickedToMiddle", valueChange: "valueChange", userChangedValue: "userChangedValue" }, decls: 6, vars: 5, consts: [[1, "container", 3, "ngStyle"], ["container", ""], [1, "groove", 3, "ngStyle"], [1, "groove-filling", 3, "ngStyle"], ["class", "thumbNotch", 3, "ngStyle", 4, "ngIf"], [1, "thumb", 3, "ngStyle", "dblclick"], [1, "thumbNotch", 3, "ngStyle"]], template: function FlatSliderComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "div", 0, 1);
        i0.ɵɵelement(2, "div", 2);
        i0.ɵɵelement(3, "div", 3);
        i0.ɵɵtemplate(4, FlatSliderComponent_div_4_Template, 1, 1, "div", 4);
        i0.ɵɵelementStart(5, "div", 5);
        i0.ɵɵlistener("dblclick", function FlatSliderComponent_Template_div_dblclick_5_listener() { return ctx.doubleclick(); });
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵproperty("ngStyle", ctx.containerStyle);
        i0.ɵɵadvance(2);
        i0.ɵɵproperty("ngStyle", ctx.grooveStyle);
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngStyle", ctx.grooveFillingStyle);
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngIf", ctx.showMiddleNotch);
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngStyle", ctx.thumbStyle);
    } }, directives: [i3.NgStyle, i3.NgIf], styles: ["[_nghost-%COMP%]{display:block;padding:2px}.disabled[_nghost-%COMP%]{filter:grayscale(80%)}.container[_ngcontent-%COMP%]{position:relative}.container[_ngcontent-%COMP%]   *[_ngcontent-%COMP%]{position:absolute}"], data: { animation: [FadeInOutAnimation] } });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(FlatSliderComponent, [{
        type: Component,
        args: [{
                selector: 'eqm-flat-slider',
                templateUrl: './flat-slider.component.html',
                styleUrls: ['./flat-slider.component.scss'],
                animations: [FadeInOutAnimation]
            }]
    }], function () { return [{ type: i1.UtilitiesService }, { type: i0.ElementRef }, { type: i2.DomSanitizer }]; }, { scale: [{
            type: Input
        }], doubleClickToAnimateToMiddle: [{
            type: Input
        }], showMiddleNotch: [{
            type: Input
        }], min: [{
            type: Input
        }], max: [{
            type: Input
        }], animationDuration: [{
            type: Input
        }], animationFps: [{
            type: Input
        }], scrollEnabled: [{
            type: Input
        }], middle: [{
            type: Input
        }], stickToMiddle: [{
            type: Input
        }], thickness: [{
            type: Input
        }], orientation: [{
            type: Input
        }], stickedToMiddle: [{
            type: Output
        }], containerRef: [{
            type: ViewChild,
            args: ['container', { static: true }]
        }], disabled: [{
            type: HostBinding,
            args: ['class.disabled']
        }], enabled: [{
            type: Input
        }], color: [{
            type: Input
        }], value: [{
            type: Input
        }], valueChange: [{
            type: Output
        }], userChangedValue: [{
            type: Output
        }], mouseWheel: [{
            type: HostListener,
            args: ['mousewheel', ['$event']]
        }], mousedown: [{
            type: HostListener,
            args: ['mousedown', ['$event']]
        }], mousemove: [{
            type: HostListener,
            args: ['mousemove', ['$event']]
        }], onMouseEnter: [{
            type: HostListener,
            args: ['mouseenter']
        }], onMouseLeave: [{
            type: HostListener,
            args: ['mouseleave']
        }], onMouseUp: [{
            type: HostListener,
            args: ['mouseup', ['$event']]
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxhdC1zbGlkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvY29tcG9uZW50cy9mbGF0LXNsaWRlci9mbGF0LXNsaWRlci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL2ZsYXQtc2xpZGVyL2ZsYXQtc2xpZGVyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixZQUFZLEVBRVosV0FBVyxFQUNaLE1BQU0sZUFBZSxDQUFBO0FBSXRCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGtCQUFrQixDQUFBOzs7Ozs7O0lDVG5ELHlCQUFrRjs7O0lBQWxDLGdEQUEyQjs7QUR1QjdFLE1BQU0sT0FBTyxtQkFBbUI7SUFDOUIsWUFDUyxLQUF1QixFQUN2QixJQUFnQixFQUNoQixTQUF1QjtRQUZ2QixVQUFLLEdBQUwsS0FBSyxDQUFrQjtRQUN2QixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2hCLGNBQVMsR0FBVCxTQUFTLENBQWM7UUFHdkIsVUFBSyxHQUE2QixRQUFRLENBQUE7UUFDMUMsaUNBQTRCLEdBQUcsSUFBSSxDQUFBO1FBQ25DLG9CQUFlLEdBQUcsSUFBSSxDQUFBO1FBQ3RCLFFBQUcsR0FBVyxDQUFDLENBQUE7UUFDZixRQUFHLEdBQVcsQ0FBQyxDQUFBO1FBQ2Ysc0JBQWlCLEdBQUcsR0FBRyxDQUFBO1FBQ3ZCLGlCQUFZLEdBQUcsRUFBRSxDQUFBO1FBQ2pCLGtCQUFhLEdBQUcsSUFBSSxDQUFBO1FBRXBCLGtCQUFhLEdBQUcsSUFBSSxDQUFBO1FBQ3BCLGNBQVMsR0FBRyxDQUFDLENBQUE7UUFDYixnQkFBVyxHQUE4QixZQUFZLENBQUE7UUFD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QWlCUCxVQUFVO2tCQURULFlBQVk7bUJBQUMsWUFBWSxFQUFFLENBQUUsUUFBUSxDQUFFO1lBeUN4QyxTQUFTO2tCQURSLFlBQVk7bUJBQUMsV0FBVyxFQUFFLENBQUUsUUFBUSxDQUFFO1lBVXZDLFNBQVM7a0JBRFIsWUFBWTttQkFBQyxXQUFXLEVBQUUsQ0FBRSxRQUFRLENBQUU7WUFVdkMsWUFBWTtrQkFEWCxZQUFZO21CQUFDLFlBQVk7WUFNMUIsWUFBWTtrQkFEWCxZQUFZO21CQUFDLFlBQVk7WUFxQzFCLFNBQVM7a0JBRFIsWUFBWTttQkFBQyxTQUFTLEVBQUUsQ0FBRSxRQUFRLENBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIFZpZXdDaGlsZCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5pbXBvcnQge1xuICBVdGlsaXRpZXNTZXJ2aWNlXG59IGZyb20gJy4uLy4uL3NlcnZpY2VzL3V0aWxpdGllcy5zZXJ2aWNlJ1xuaW1wb3J0IHsgRmFkZUluT3V0QW5pbWF0aW9uIH0gZnJvbSAnLi4vLi4vYW5pbWF0aW9ucydcbmltcG9ydCB7IERvbVNhbml0aXplciB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInXG5cbmV4cG9ydCBpbnRlcmZhY2UgRmxhdFNsaWRlclZhbHVlQ2hhbmdlZEV2ZW50IHtcbiAgdmFsdWU6IG51bWJlclxuICB0cmFuc2l0aW9uPzogYm9vbGVhblxufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdlcW0tZmxhdC1zbGlkZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vZmxhdC1zbGlkZXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsgJy4vZmxhdC1zbGlkZXIuY29tcG9uZW50LnNjc3MnIF0sXG4gIGFuaW1hdGlvbnM6IFsgRmFkZUluT3V0QW5pbWF0aW9uIF1cbn0pXG5leHBvcnQgY2xhc3MgRmxhdFNsaWRlckNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChcbiAgICBwdWJsaWMgdXRpbHM6IFV0aWxpdGllc1NlcnZpY2UsXG4gICAgcHVibGljIGVsZW06IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIHNhbml0aXplcjogRG9tU2FuaXRpemVyXG4gICkge31cblxuICBASW5wdXQoKSBzY2FsZTogJ2xvZ2FyaXRobWljJyB8ICdsaW5lYXInID0gJ2xpbmVhcidcbiAgQElucHV0KCkgZG91YmxlQ2xpY2tUb0FuaW1hdGVUb01pZGRsZSA9IHRydWVcbiAgQElucHV0KCkgc2hvd01pZGRsZU5vdGNoID0gdHJ1ZVxuICBASW5wdXQoKSBtaW46IG51bWJlciA9IDBcbiAgQElucHV0KCkgbWF4OiBudW1iZXIgPSAxXG4gIEBJbnB1dCgpIGFuaW1hdGlvbkR1cmF0aW9uID0gNTAwXG4gIEBJbnB1dCgpIGFuaW1hdGlvbkZwcyA9IDMwXG4gIEBJbnB1dCgpIHNjcm9sbEVuYWJsZWQgPSB0cnVlXG4gIEBJbnB1dCgpIG1pZGRsZT86IG51bWJlclxuICBASW5wdXQoKSBzdGlja1RvTWlkZGxlID0gdHJ1ZVxuICBASW5wdXQoKSB0aGlja25lc3MgPSAyXG4gIEBJbnB1dCgpIG9yaWVudGF0aW9uOiAndmVydGljYWwnIHwgJ2hvcml6b250YWwnID0gJ2hvcml6b250YWwnXG4gIEBPdXRwdXQoKSBzdGlja2VkVG9NaWRkbGUgPSBuZXcgRXZlbnRFbWl0dGVyKClcbiAgQFZpZXdDaGlsZCgnY29udGFpbmVyJywgeyBzdGF0aWM6IHRydWUgfSkgY29udGFpbmVyUmVmITogRWxlbWVudFJlZlxuXG4gIGdldCBtaWRkbGVWYWx1ZSAoKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGlzLm1pZGRsZSA9PT0gJ251bWJlcicgPyB0aGlzLm1pZGRsZSA6ICh0aGlzLm1pbiArIHRoaXMubWF4KSAvIDJcbiAgfVxuXG4gIHB1YmxpYyBkZWZhdWx0Q29sb3IgPSAnIzRmOGQ3MSdcbiAgcHVibGljIF9lbmFibGVkID0gdHJ1ZVxuXG4gIEBIb3N0QmluZGluZygnY2xhc3MuZGlzYWJsZWQnKSBnZXQgZGlzYWJsZWQgKCkgeyByZXR1cm4gIXRoaXMuZW5hYmxlZCB9XG4gIEBJbnB1dCgpXG4gIHNldCBlbmFibGVkIChzaG91bGRCZUVuYWJsZWQpIHtcbiAgICB0aGlzLl9lbmFibGVkID0gc2hvdWxkQmVFbmFibGVkXG4gICAgdGhpcy5fY29sb3IgPSB0aGlzLl9lbmFibGVkID8gdGhpcy5kZWZhdWx0Q29sb3IgOiAnIzc3NydcbiAgfVxuXG4gIGdldCBlbmFibGVkICgpIHsgcmV0dXJuIHRoaXMuX2VuYWJsZWQgfVxuXG4gIHB1YmxpYyBfY29sb3IgPSB0aGlzLmRlZmF1bHRDb2xvclxuICBASW5wdXQoKVxuICBzZXQgY29sb3IgKG5ld0NvbG9yKSB7XG4gICAgdGhpcy5kZWZhdWx0Q29sb3IgPSBuZXdDb2xvclxuICAgIHRoaXMuX2NvbG9yID0gdGhpcy5fZW5hYmxlZCA/IHRoaXMuZGVmYXVsdENvbG9yIDogJyM3NzcnXG4gIH1cblxuICBnZXQgY29sb3IgKCkge1xuICAgIHJldHVybiB0aGlzLl9jb2xvclxuICB9XG5cbiAgZ2V0IGRhcmtlckNvbG9yICgpIHtcbiAgICBjb25zdCByZ2IgPSB0aGlzLnV0aWxzLmhleFRvUmdiKHRoaXMuY29sb3IpXG4gICAgdHlwZSBjYyA9IGtleW9mIHR5cGVvZiByZ2JcbiAgICBmb3IgKGNvbnN0IGNoYW5uZWwgaW4gcmdiKSB7XG4gICAgICByZ2JbY2hhbm5lbCBhcyBjY10gPSBNYXRoLnJvdW5kKDAuOCAqIHJnYltjaGFubmVsIGFzIGNjXSlcbiAgICB9XG4gICAgY29uc3QgaGV4ID0gdGhpcy51dGlscy5yZ2JUb0hleChyZ2IpXG4gICAgcmV0dXJuIGhleFxuICB9XG5cbiAgcHVibGljIGRyYWdnaW5nID0gZmFsc2VcbiAgcHVibGljIHRodW1iUmFkaXVzID0gNFxuXG4gIHB1YmxpYyBfdmFsdWUgPSAwLjVcbiAgQElucHV0KClcbiAgc2V0IHZhbHVlIChuZXdWYWx1ZSkge1xuICAgIGxldCB2YWx1ZSA9IHRoaXMuY2xhbXBWYWx1ZShuZXdWYWx1ZSlcblxuICAgIGlmICh0aGlzLnN0aWNrVG9NaWRkbGUpIHtcbiAgICAgIGNvbnN0IG1pZGRsZVZhbHVlID0gdGhpcy5taWRkbGVWYWx1ZVxuXG4gICAgICBsZXQgZGlmZkZyb21NaWRkbGUgPSBtaWRkbGVWYWx1ZSAtIHZhbHVlXG4gICAgICBpZiAoZGlmZkZyb21NaWRkbGUgPCAwKSB7XG4gICAgICAgIGRpZmZGcm9tTWlkZGxlICo9IC0xXG4gICAgICB9XG4gICAgICBjb25zdCBwZXJjRnJvbU1pZGRsZSA9IHRoaXMubWFwVmFsdWUoe1xuICAgICAgICB2YWx1ZTogZGlmZkZyb21NaWRkbGUsXG4gICAgICAgIGluTWluOiAwLFxuICAgICAgICBpbk1heDogdGhpcy5tYXggLSBtaWRkbGVWYWx1ZSxcbiAgICAgICAgb3V0TWluOiAwLFxuICAgICAgICBvdXRNYXg6IDEwMFxuICAgICAgfSlcbiAgICAgIGlmICgodGhpcy5fdmFsdWUpLnRvRml4ZWQoMikgPT09IChtaWRkbGVWYWx1ZSkudG9GaXhlZCgyKSAmJiBwZXJjRnJvbU1pZGRsZSA8IDUpIHtcbiAgICAgICAgdmFsdWUgPSBtaWRkbGVWYWx1ZVxuICAgICAgfSBlbHNlIGlmICgodGhpcy5fdmFsdWUgPCBtaWRkbGVWYWx1ZSAmJiBuZXdWYWx1ZSA+IHRoaXMuX3ZhbHVlKSB8fCAodGhpcy5fdmFsdWUgPiBtaWRkbGVWYWx1ZSAmJiBuZXdWYWx1ZSA8IHRoaXMuX3ZhbHVlKSkge1xuICAgICAgICBpZiAocGVyY0Zyb21NaWRkbGUgPCAzKSB7XG4gICAgICAgICAgdmFsdWUgPSBtaWRkbGVWYWx1ZVxuICAgICAgICAgIHRoaXMuc3RpY2tlZFRvTWlkZGxlLmVtaXQoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX3ZhbHVlID0gdGhpcy5jbGFtcFZhbHVlKHZhbHVlKVxuICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh0aGlzLl92YWx1ZSlcbiAgfVxuXG4gIGdldCB2YWx1ZSAoKSB7IHJldHVybiB0aGlzLl92YWx1ZSB9XG5cbiAgQE91dHB1dCgpIHZhbHVlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpXG4gIEBPdXRwdXQoKSB1c2VyQ2hhbmdlZFZhbHVlID0gbmV3IEV2ZW50RW1pdHRlcjxGbGF0U2xpZGVyVmFsdWVDaGFuZ2VkRXZlbnQ+KClcblxuICBnZXQgaGVpZ2h0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXJSZWYubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHRcbiAgfVxuXG4gIGdldCB3aWR0aCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyUmVmLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGhcbiAgfVxuXG4gIHB1YmxpYyBjbGFtcFZhbHVlICh2YWx1ZTogbnVtYmVyKSB7XG4gICAgaWYgKHZhbHVlIDwgdGhpcy5taW4pIHJldHVybiB0aGlzLm1pblxuICAgIGlmICh2YWx1ZSA+IHRoaXMubWF4KSByZXR1cm4gdGhpcy5tYXhcbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNld2hlZWwnLCBbICckZXZlbnQnIF0pXG4gIG1vdXNlV2hlZWwgKGV2ZW50OiBXaGVlbEV2ZW50KSB7XG4gICAgaWYgKHRoaXMuZW5hYmxlZCAmJiB0aGlzLnNjcm9sbEVuYWJsZWQpIHtcbiAgICAgIC8vIGNvbnN0IG11bHRpcGxpZXIgPSAodGhpcy5tYXggLSB0aGlzLm1pbikgLyAxMDAwXG4gICAgICBsZXQgcHJvZ3Jlc3MgPSB0aGlzLnByb2dyZXNzXG4gICAgICBwcm9ncmVzcyArPSAtZXZlbnQuZGVsdGFZIC8gMTAwMFxuICAgICAgaWYgKHByb2dyZXNzIDwgMCkgcHJvZ3Jlc3MgPSAwXG4gICAgICBpZiAocHJvZ3Jlc3MgPiAxKSBwcm9ncmVzcyA9IDFcbiAgICAgIHByb2dyZXNzID0gTWF0aC5yb3VuZChwcm9ncmVzcyAqIDEwMDApXG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5tYXBWYWx1ZSh7XG4gICAgICAgIHZhbHVlOiBwcm9ncmVzcyxcbiAgICAgICAgaW5NaW46IDAsXG4gICAgICAgIGluTWF4OiAxMDAwLFxuICAgICAgICBvdXRNaW46IHRoaXMubWluLFxuICAgICAgICBvdXRNYXg6IHRoaXMubWF4LFxuICAgICAgICBsb2dJbnZlcnNlOiBmYWxzZVxuICAgICAgfSlcbiAgICAgIHRoaXMudXNlckNoYW5nZWRWYWx1ZS5lbWl0KHsgdmFsdWU6IHRoaXMuX3ZhbHVlIH0pXG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldFZhbHVlRnJvbU1vdXNlRXZlbnQgKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgY29uc3QgY29vcmRzID0gdGhpcy51dGlscy5nZXRDb29yZGluYXRlc0luc2lkZUVsZW1lbnRGcm9tRXZlbnQoZXZlbnQsIHRoaXMuY29udGFpbmVyUmVmLm5hdGl2ZUVsZW1lbnQpXG4gICAgbGV0IHByb2dyZXNzID0gdGhpcy5vcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJyA/IGNvb3Jkcy55IDogY29vcmRzLnhcbiAgICBjb25zdCB2YWx1ZSA9ICgoKSA9PiB7XG4gICAgICBjb25zdCBpbk1pbiA9IHRoaXMudGh1bWJSYWRpdXNcbiAgICAgIGNvbnN0IGluTWF4ID0gKHRoaXMub3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcgPyB0aGlzLmhlaWdodCA6IHRoaXMud2lkdGgpIC0gdGhpcy50aHVtYlJhZGl1cyAqIDJcbiAgICAgIGlmIChwcm9ncmVzcyA8IGluTWluKSBwcm9ncmVzcyA9IGluTWluXG4gICAgICBpZiAocHJvZ3Jlc3MgPiBpbk1heCkgcHJvZ3Jlc3MgPSBpbk1heFxuICAgICAgcmV0dXJuIHRoaXMubWFwVmFsdWUoe1xuICAgICAgICB2YWx1ZTogcHJvZ3Jlc3MsXG4gICAgICAgIGluTWluLFxuICAgICAgICBpbk1heCxcbiAgICAgICAgb3V0TWluOiB0aGlzLm1pbixcbiAgICAgICAgb3V0TWF4OiB0aGlzLm1heFxuICAgICAgfSlcbiAgICB9KSgpXG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWRvd24nLCBbICckZXZlbnQnIF0pXG4gIG1vdXNlZG93biAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5lbmFibGVkKSB7XG4gICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZVxuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuZ2V0VmFsdWVGcm9tTW91c2VFdmVudChldmVudClcbiAgICAgIHRoaXMudXNlckNoYW5nZWRWYWx1ZS5lbWl0KHsgdmFsdWU6IHRoaXMuX3ZhbHVlIH0pXG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2Vtb3ZlJywgWyAnJGV2ZW50JyBdKVxuICBtb3VzZW1vdmUgKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgaWYgKHRoaXMuZW5hYmxlZCAmJiB0aGlzLmRyYWdnaW5nKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5nZXRWYWx1ZUZyb21Nb3VzZUV2ZW50KGV2ZW50KVxuICAgICAgdGhpcy51c2VyQ2hhbmdlZFZhbHVlLmVtaXQoeyB2YWx1ZTogdGhpcy5fdmFsdWUgfSlcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbW91c2VJbnNpZGUgPSBmYWxzZVxuICBASG9zdExpc3RlbmVyKCdtb3VzZWVudGVyJylcbiAgb25Nb3VzZUVudGVyICgpOiB2b2lkIHtcbiAgICB0aGlzLm1vdXNlSW5zaWRlID0gdHJ1ZVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2VsZWF2ZScpXG4gIG9uTW91c2VMZWF2ZSAoKTogdm9pZCB7XG4gICAgdGhpcy5tb3VzZUluc2lkZSA9IGZhbHNlXG4gICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXG4gIH1cblxuICBwdWJsaWMgZG91YmxlY2xpY2tUaW1lb3V0PzogbnVtYmVyXG4gIGRvdWJsZWNsaWNrICgpIHtcbiAgICBpZiAodGhpcy5lbmFibGVkICYmIHRoaXMuZG91YmxlQ2xpY2tUb0FuaW1hdGVUb01pZGRsZSkge1xuICAgICAgaWYgKHRoaXMuZG91YmxlY2xpY2tUaW1lb3V0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmRvdWJsZWNsaWNrVGltZW91dClcbiAgICAgIH1cblxuICAgICAgdGhpcy51c2VyQ2hhbmdlZFZhbHVlLmVtaXQoe1xuICAgICAgICB2YWx1ZTogdGhpcy5taWRkbGVWYWx1ZSxcbiAgICAgICAgdHJhbnNpdGlvbjogdHJ1ZVxuICAgICAgfSlcbiAgICAgIHRoaXMuYW5pbWF0ZVNsaWRlcih0aGlzLnZhbHVlLCB0aGlzLm1pZGRsZVZhbHVlKVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGFuaW1hdGVTbGlkZXIgKGZyb206IG51bWJlciwgdG86IG51bWJlcikge1xuICAgIGZyb20gPSB0aGlzLmNsYW1wVmFsdWUoZnJvbSlcbiAgICB0byA9IHRoaXMuY2xhbXBWYWx1ZSh0bylcbiAgICBjb25zdCBkaWZmID0gdG8gLSBmcm9tXG4gICAgY29uc3QgZGVsYXkgPSAxMDAwIC8gdGhpcy5hbmltYXRpb25GcHNcbiAgICBjb25zdCBmcmFtZXMgPSB0aGlzLmFuaW1hdGlvbkZwcyAqICh0aGlzLmFuaW1hdGlvbkR1cmF0aW9uIC8gMTAwMClcbiAgICBjb25zdCBzdGVwID0gZGlmZiAvIGZyYW1lc1xuICAgIGxldCB2YWx1ZSA9IGZyb21cbiAgICBmb3IgKGxldCBmcmFtZSA9IDA7IGZyYW1lIDwgZnJhbWVzOyBmcmFtZSsrKSB7XG4gICAgICBhd2FpdCB0aGlzLnV0aWxzLmRlbGF5KGRlbGF5KVxuICAgICAgdmFsdWUgKz0gc3RlcFxuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlXG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2V1cCcsIFsgJyRldmVudCcgXSlcbiAgb25Nb3VzZVVwIChldmVudDogTW91c2VFdmVudCkge1xuICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxuICB9XG5cbiAgbW91c2V1cCAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcbiAgfVxuXG4gIGdldCBwcm9ncmVzcyAoKSB7XG4gICAgY29uc3QgZmFjdG9yID0gMTAwMDBcbiAgICBsZXQgcHJvZ3Jlc3MgPSB0aGlzLm1hcFZhbHVlKHtcbiAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgaW5NaW46IHRoaXMubWluLFxuICAgICAgaW5NYXg6IHRoaXMubWF4LFxuICAgICAgb3V0TWluOiAwLFxuICAgICAgb3V0TWF4OiBmYWN0b3IsXG4gICAgICBsb2dJbnZlcnNlOiB0cnVlXG4gICAgfSlcblxuICAgIHByb2dyZXNzIC89IGZhY3RvclxuICAgIHJldHVybiBwcm9ncmVzc1xuICB9XG5cbiAgZ2V0IGNvbnRhaW5lclN0eWxlICgpIHtcbiAgICBjb25zdCBzdHlsZXM6IHsgW3N0eWxlOiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9XG4gICAgY29uc3QgbmFycm93ID0gdGhpcy50aHVtYlJhZGl1cyAqIDIgKyAyXG4gICAgaWYgKHRoaXMub3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgc3R5bGVzLndpZHRoID0gJzEwMCUnXG4gICAgICBzdHlsZXMuaGVpZ2h0ID0gYCR7bmFycm93fXB4YFxuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZXMuaGVpZ2h0ID0gJzEwMCUnXG4gICAgICBzdHlsZXMud2lkdGggPSBgJHtuYXJyb3d9cHhgXG4gICAgfVxuXG4gICAgcmV0dXJuIHN0eWxlc1xuICB9XG5cbiAgZ2V0IGdyb292ZVN0eWxlICgpIHtcbiAgICBjb25zdCBzdHlsZTogeyBbc3R5bGU6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB9ID0ge31cbiAgICBpZiAodGhpcy5vcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBzdHlsZS5sZWZ0ID0gYCR7dGhpcy50aHVtYlJhZGl1c31weGBcbiAgICAgIHN0eWxlLnRvcCA9IGBjYWxjKDUwJSAtICR7dGhpcy50aGlja25lc3N9cHggLyAyKWBcbiAgICAgIHN0eWxlLndpZHRoID0gYGNhbGMoMTAwJSAtICR7dGhpcy50aHVtYlJhZGl1cyAqIDJ9cHgpYFxuICAgICAgc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy50aGlja25lc3N9cHhgXG4gICAgfSBlbHNlIHtcbiAgICAgIHN0eWxlLnRvcCA9IGAke3RoaXMudGh1bWJSYWRpdXN9cHhgXG4gICAgICBzdHlsZS5sZWZ0ID0gYGNhbGMoNTAlIC0gJHt0aGlzLnRoaWNrbmVzc31weCAvIDIpYFxuICAgICAgc3R5bGUuaGVpZ2h0ID0gYGNhbGMoMTAwJSAtICR7dGhpcy50aHVtYlJhZGl1cyAqIDJ9cHgpYFxuICAgICAgc3R5bGUud2lkdGggPSBgJHt0aGlzLnRoaWNrbmVzc31weGBcbiAgICB9XG4gICAgc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5kYXJrZXJDb2xvclxuICAgIHJldHVybiBzdHlsZVxuICB9XG5cbiAgZ2V0IGdyb292ZUZpbGxpbmdTdHlsZSAoKSB7XG4gICAgY29uc3Qgc3R5bGU6IHsgW3N0eWxlOiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9XG4gICAgaWYgKHRoaXMub3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgc3R5bGUubGVmdCA9IGAke3RoaXMudGh1bWJSYWRpdXN9cHhgXG4gICAgICBzdHlsZS50b3AgPSBgY2FsYyg1MCUgLSAke3RoaXMudGhpY2tuZXNzfXB4IC8gMilgXG4gICAgICBzdHlsZS53aWR0aCA9IGBjYWxjKCR7dGhpcy5wcm9ncmVzcyAqIDEwMH0lIC0gJHt0aGlzLnRodW1iUmFkaXVzfXB4KWBcbiAgICAgIHN0eWxlLmhlaWdodCA9IGAke3RoaXMudGhpY2tuZXNzfXB4YFxuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZS50b3AgPSBgJHt0aGlzLnRodW1iUmFkaXVzfXB4YFxuICAgICAgc3R5bGUubGVmdCA9IGBjYWxjKDUwJSAtICR7dGhpcy50aGlja25lc3N9cHggLyAyKWBcbiAgICAgIHN0eWxlLmhlaWdodCA9IGBjYWxjKCR7dGhpcy5wcm9ncmVzcyAqIDEwMH0lIC0gJHt0aGlzLnRodW1iUmFkaXVzICogMn1weClgXG4gICAgICBzdHlsZS53aWR0aCA9IGAke3RoaXMudGhpY2tuZXNzfXB4YFxuICAgIH1cbiAgICBzdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmNvbG9yXG4gICAgcmV0dXJuIHN0eWxlXG4gIH1cblxuICBnZXQgdGh1bWJOb3RjaFN0eWxlICgpIHtcbiAgICBjb25zdCBzdHlsZTogeyBbc3R5bGU6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB9ID0ge31cbiAgICBzdHlsZS53aWR0aCA9IGAke3RoaXMudGh1bWJSYWRpdXMgKiAyfXB4YFxuICAgIHN0eWxlLmhlaWdodCA9IHN0eWxlLndpZHRoXG4gICAgc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZSA+PSB0aGlzLm1pZGRsZVZhbHVlID8gdGhpcy5jb2xvciA6IHRoaXMuZGFya2VyQ29sb3JcblxuICAgIHN0eWxlLmJvcmRlclJhZGl1cyA9ICcxMDAlJ1xuICAgIGNvbnN0IGNlbnRlciA9IGBjYWxjKDUwJSAtICR7dGhpcy50aHVtYlJhZGl1c31weClgXG5cbiAgICBzdHlsZS50b3AgPSBjZW50ZXJcbiAgICBzdHlsZS5sZWZ0ID0gY2VudGVyXG5cbiAgICByZXR1cm4gc3R5bGVcbiAgfVxuXG4gIGdldCB0aHVtYlN0eWxlICgpIHtcbiAgICBjb25zdCBzdHlsZTogeyBbc3R5bGU6IHN0cmluZ106IG51bWJlciB8IHN0cmluZyB9ID0ge31cbiAgICBzdHlsZS53aWR0aCA9IGAke3RoaXMudGh1bWJSYWRpdXMgKiAyfXB4YFxuICAgIHN0eWxlLmhlaWdodCA9IHN0eWxlLndpZHRoXG4gICAgY29uc3QgYm9yZGVyU2l6ZSA9IDFcbiAgICBzdHlsZS5ib3JkZXIgPSBgJHtib3JkZXJTaXplfXB4IHNvbGlkIGJsYWNrYFxuICAgIHN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuY29sb3JcblxuICAgIHN0eWxlLmJvcmRlclJhZGl1cyA9ICcxMDAlJ1xuICAgIGlmICh0aGlzLm9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIGNvbnN0IGxlZnQgPSB0aGlzLm1hcFZhbHVlKHtcbiAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXG4gICAgICAgIGluTWluOiB0aGlzLm1pbixcbiAgICAgICAgaW5NYXg6IHRoaXMubWF4LFxuICAgICAgICBvdXRNaW46IC1ib3JkZXJTaXplLFxuICAgICAgICBvdXRNYXg6IHRoaXMud2lkdGggLSB0aGlzLnRodW1iUmFkaXVzICogMiAtIGJvcmRlclNpemUsXG4gICAgICAgIGxvZ0ludmVyc2U6IHRydWVcbiAgICAgIH0pXG4gICAgICBzdHlsZS5sZWZ0ID0gYCR7bGVmdH1weGBcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGUuYm90dG9tID0gYCR7dGhpcy5tYXBWYWx1ZSh7XG4gICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgICBpbk1pbjogdGhpcy5taW4sXG4gICAgICAgIGluTWF4OiB0aGlzLm1heCxcbiAgICAgICAgb3V0TWluOiAtYm9yZGVyU2l6ZSxcbiAgICAgICAgb3V0TWF4OiB0aGlzLmhlaWdodCAtIHRoaXMudGh1bWJSYWRpdXMgKiAyIC0gYm9yZGVyU2l6ZSxcbiAgICAgICAgbG9nSW52ZXJzZTogdHJ1ZVxuICAgICAgfSl9cHhgXG4gICAgfVxuICAgIHJldHVybiBzdHlsZVxuICB9XG5cbiAgcHJpdmF0ZSBtYXBWYWx1ZSAoeyB2YWx1ZSwgaW5NaW4sIGluTWF4LCBvdXRNaW4sIG91dE1heCwgbG9nSW52ZXJzZSB9OiB7XG4gICAgdmFsdWU6IG51bWJlclxuICAgIGluTWluOiBudW1iZXJcbiAgICBpbk1heDogbnVtYmVyXG4gICAgb3V0TWluOiBudW1iZXJcbiAgICBvdXRNYXg6IG51bWJlclxuICAgIGxvZ0ludmVyc2U/OiBib29sZWFuXG4gIH0pIHtcbiAgICBzd2l0Y2ggKHRoaXMuc2NhbGUpIHtcbiAgICAgIGNhc2UgJ2xpbmVhcic6IHJldHVybiB0aGlzLnV0aWxzLm1hcFZhbHVlKHZhbHVlLCBpbk1pbiwgaW5NYXgsIG91dE1pbiwgb3V0TWF4KVxuICAgICAgY2FzZSAnbG9nYXJpdGhtaWMnOiByZXR1cm4gKGxvZ0ludmVyc2UgPyB0aGlzLnV0aWxzLmxvZ01hcFZhbHVlSW52ZXJzZSA6IHRoaXMudXRpbHMubG9nTWFwVmFsdWUpKHsgdmFsdWUsIGluTWluLCBpbk1heCwgb3V0TWluLCBvdXRNYXggfSlcbiAgICB9XG4gIH1cbn1cbiIsIlxuPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiICNjb250YWluZXIgW25nU3R5bGVdPVwiY29udGFpbmVyU3R5bGVcIj5cbiAgPGRpdiBjbGFzcz1cImdyb292ZVwiIFtuZ1N0eWxlXT1cImdyb292ZVN0eWxlXCI+PC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJncm9vdmUtZmlsbGluZ1wiIFtuZ1N0eWxlXT1cImdyb292ZUZpbGxpbmdTdHlsZVwiPjwvZGl2PlxuICA8ZGl2IGNsYXNzPVwidGh1bWJOb3RjaFwiICpuZ0lmPVwic2hvd01pZGRsZU5vdGNoXCIgW25nU3R5bGVdPVwidGh1bWJOb3RjaFN0eWxlXCI+PC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJ0aHVtYlwiIFtuZ1N0eWxlXT1cInRodW1iU3R5bGVcIiAoZGJsY2xpY2spPVwiZG91YmxlY2xpY2soKVwiPjwvZGl2PlxuPC9kaXY+Il19
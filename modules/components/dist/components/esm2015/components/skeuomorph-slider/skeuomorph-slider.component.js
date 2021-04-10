import { __awaiter } from "tslib";
import { Component, Input, Output, HostListener, ViewChild, EventEmitter, HostBinding } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../services/utilities.service";
const _c0 = ["notches"];
export class SkeuomorphSliderComponent {
    constructor(utils, elRef) {
        this.utils = utils;
        this.elRef = elRef;
        this.min = 0;
        this.max = 1;
        this.animationDuration = 500;
        this.animationFps = 30;
        this.scrollEnabled = true;
        this.stickToMiddle = false;
        this.stickedToMiddle = new EventEmitter();
        this.dragging = false;
        this.userChangedValue = new EventEmitter();
        this.valueChange = new EventEmitter();
        this.showNotches = true;
        this.disabled = false;
        this._value = 0.5;
    }
    get middleValue() {
        return typeof this.middle === 'number' ? this.middle : (this.min + this.max) / 2;
    }
    set value(newValue) {
        let value = this.clampValue(newValue);
        if (this.stickToMiddle) {
            const middleValue = this.middleValue;
            let diffFromMiddle = middleValue - value;
            if (diffFromMiddle < 0) {
                diffFromMiddle *= -1;
            }
            const percFromMiddle = this.utils.mapValue(diffFromMiddle, 0, this.max - middleValue, 0, 100);
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
    onMouseWheel(event) {
        if (!this.disabled && this.scrollEnabled) {
            this.value += -event.deltaY / 100;
            this.userChangedValue.emit({ value: this.value });
        }
    }
    getValueFromMouseEvent(event) {
        const coords = this.utils.getCoordinatesInsideElementFromEvent(event, this.elRef.nativeElement);
        const y = coords.y;
        const height = this.elRef.nativeElement.offsetHeight;
        const padding = height * 0.11;
        const value = this.clampValue(this.utils.mapValue(y, height - padding / 2, padding, this.min, this.max));
        return value;
    }
    clampValue(value) {
        if (value < this.min) {
            return this.min;
        }
        else if (value > this.max) {
            return this.max;
        }
        else {
            return value;
        }
    }
    onMouseDown(event) {
        if (!this.disabled) {
            this.dragging = true;
            if (!this.doubleclickTimeout) {
                this.doubleclickTimeout = setTimeout(() => {
                    this.doubleclickTimeout = undefined;
                    this.value = this.getValueFromMouseEvent(event);
                    this.userChangedValue.emit({ value: this.value });
                }, 200);
            }
        }
    }
    onMouseMove(event) {
        if (!this.disabled && this.dragging) {
            this.value = this.getValueFromMouseEvent(event);
            this.userChangedValue.emit({ value: this.value });
        }
    }
    onMouseUp() {
        this.dragging = false;
    }
    onMouseLeave() {
        this.dragging = false;
    }
    doubleclick() {
        if (!this.disabled) {
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
    ngOnInit() {
        if (this.showNotches) {
            this.drawNotches();
            setTimeout(() => this.drawNotches());
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
    drawNotches() {
        const canvas = this.notches.nativeElement;
        const ctx = canvas.getContext('2d');
        const height = this.elRef.nativeElement.offsetHeight;
        const width = this.elRef.nativeElement.offsetWidth;
        canvas.height = height;
        canvas.width = width;
        const padding = height * 0.08;
        const gap = (height - padding * 2) / 10;
        ctx.strokeStyle = '#559e7d';
        for (let i = 0; i <= 10; i++) {
            const y = Math.round(padding + gap * i) - 0.5;
            ctx.beginPath();
            const lineWidth = [0, 5, 10].includes(i) ? width : (width * 0.9);
            ctx.moveTo((width - lineWidth) / 1, y);
            ctx.lineTo(lineWidth, y);
            ctx.stroke();
            ctx.closePath();
        }
        ctx.clearRect(width / 2 - 5, 0, 9, height);
    }
    calculateTop() {
        return `${this.utils.mapValue(this._value, this.min, this.max, parseInt(this.elRef.nativeElement.offsetHeight) - 25, 0)}px`;
    }
}
SkeuomorphSliderComponent.ɵfac = function SkeuomorphSliderComponent_Factory(t) { return new (t || SkeuomorphSliderComponent)(i0.ɵɵdirectiveInject(i1.UtilitiesService), i0.ɵɵdirectiveInject(i0.ElementRef)); };
SkeuomorphSliderComponent.ɵcmp = i0.ɵɵdefineComponent({ type: SkeuomorphSliderComponent, selectors: [["eqm-skeuomorph-slider"]], viewQuery: function SkeuomorphSliderComponent_Query(rf, ctx) { if (rf & 1) {
        i0.ɵɵviewQuery(_c0, 3);
    } if (rf & 2) {
        let _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.notches = _t.first);
    } }, hostVars: 2, hostBindings: function SkeuomorphSliderComponent_HostBindings(rf, ctx) { if (rf & 1) {
        i0.ɵɵlistener("mousewheel", function SkeuomorphSliderComponent_mousewheel_HostBindingHandler($event) { return ctx.onMouseWheel($event); })("mousedown", function SkeuomorphSliderComponent_mousedown_HostBindingHandler($event) { return ctx.onMouseDown($event); })("mousemove", function SkeuomorphSliderComponent_mousemove_HostBindingHandler($event) { return ctx.onMouseMove($event); })("mouseup", function SkeuomorphSliderComponent_mouseup_HostBindingHandler() { return ctx.onMouseUp(); })("mouseleave", function SkeuomorphSliderComponent_mouseleave_HostBindingHandler() { return ctx.onMouseLeave(); })("resize", function SkeuomorphSliderComponent_resize_HostBindingHandler() { return ctx.drawNotches(); }, false, i0.ɵɵresolveWindow);
    } if (rf & 2) {
        i0.ɵɵclassProp("disabled", ctx.disabled);
    } }, inputs: { min: "min", max: "max", animationDuration: "animationDuration", animationFps: "animationFps", scrollEnabled: "scrollEnabled", middle: "middle", stickToMiddle: "stickToMiddle", showNotches: "showNotches", disabled: "disabled", value: "value" }, outputs: { stickedToMiddle: "stickedToMiddle", userChangedValue: "userChangedValue", valueChange: "valueChange" }, decls: 5, vars: 3, consts: [["height", "137", 1, "notches", 3, "hidden"], ["notches", ""], [1, "groove"], [1, "thumb", 3, "dblclick"], [1, "line-group"]], template: function SkeuomorphSliderComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelement(0, "canvas", 0, 1);
        i0.ɵɵelement(2, "div", 2);
        i0.ɵɵelementStart(3, "div", 3);
        i0.ɵɵlistener("dblclick", function SkeuomorphSliderComponent_Template_div_dblclick_3_listener() { return ctx.doubleclick(); });
        i0.ɵɵelement(4, "div", 4);
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵproperty("hidden", !ctx.showNotches);
        i0.ɵɵadvance(3);
        i0.ɵɵstyleProp("top", ctx.calculateTop());
    } }, styles: ["[_nghost-%COMP%]{width:31px;height:100%;min-height:100px;display:inline-flex;flex-direction:column;justify-content:center;align-items:center;position:relative;transition-property:filter;transition-duration:.5s}.notches[_ngcontent-%COMP%]{position:absolute;top:0;left:0;height:100%;width:100%}.groove[_ngcontent-%COMP%]{width:7px;height:89%;background-color:#29292b;box-shadow:inset 0 0 0 1px #45494d,inset 0 2px 5px 1px #000,inset -1px -1px 0 1px #313234,inset 1px 1px 0 1px #0e0e0e}.groove[_ngcontent-%COMP%], .thumb[_ngcontent-%COMP%]{border-radius:3px}.thumb[_ngcontent-%COMP%]{position:absolute;display:flex;justify-content:center;align-items:center;top:0;left:calc(50% - 21px / 2);width:21px;height:25px;background-color:#38393d;box-shadow:inset 0 0 0 1px #1f2024,inset 1px 1px 0 1px #4c4f52,inset -1px -1px 0 1px #313437,0 3px 10px -2px #000}.thumb[_ngcontent-%COMP%]   .line-group[_ngcontent-%COMP%]{width:calc(100% - 2px);height:3px;background:linear-gradient(180deg,#1a2b24,#1a2b24 1px,#559e7d 0,#559e7d 2px,#466d66 0,#466d66 3px)}.disabled[_nghost-%COMP%]{filter:grayscale(80%)}"] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SkeuomorphSliderComponent, [{
        type: Component,
        args: [{
                selector: 'eqm-skeuomorph-slider',
                templateUrl: './skeuomorph-slider.component.html',
                styleUrls: ['./skeuomorph-slider.component.scss']
            }]
    }], function () { return [{ type: i1.UtilitiesService }, { type: i0.ElementRef }]; }, { min: [{
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
        }], stickedToMiddle: [{
            type: Output
        }], notches: [{
            type: ViewChild,
            args: ['notches', { static: true }]
        }], userChangedValue: [{
            type: Output
        }], valueChange: [{
            type: Output
        }], showNotches: [{
            type: Input
        }], disabled: [{
            type: HostBinding,
            args: ['class.disabled']
        }, {
            type: Input
        }], value: [{
            type: Input
        }], onMouseWheel: [{
            type: HostListener,
            args: ['mousewheel', ['$event']]
        }], onMouseDown: [{
            type: HostListener,
            args: ['mousedown', ['$event']]
        }], onMouseMove: [{
            type: HostListener,
            args: ['mousemove', ['$event']]
        }], onMouseUp: [{
            type: HostListener,
            args: ['mouseup']
        }], onMouseLeave: [{
            type: HostListener,
            args: ['mouseleave']
        }], drawNotches: [{
            type: HostListener,
            args: ['window:resize']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tldW9tb3JwaC1zbGlkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvY29tcG9uZW50cy9za2V1b21vcnBoLXNsaWRlci9za2V1b21vcnBoLXNsaWRlci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL3NrZXVvbW9ycGgtc2xpZGVyL3NrZXVvbW9ycGgtc2xpZGVyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULEtBQUssRUFDTCxNQUFNLEVBRU4sWUFBWSxFQUNaLFNBQVMsRUFDVCxZQUFZLEVBQ1osV0FBVyxFQUNaLE1BQU0sZUFBZSxDQUFBOzs7O0FBZXRCLE1BQU0sT0FBTyx5QkFBeUI7SUFDcEMsWUFBb0IsS0FBdUIsRUFBUyxLQUFpQjtRQUFqRCxVQUFLLEdBQUwsS0FBSyxDQUFrQjtRQUFTLFVBQUssR0FBTCxLQUFLLENBQVk7UUFFNUQsUUFBRyxHQUFXLENBQUMsQ0FBQTtRQUNmLFFBQUcsR0FBVyxDQUFDLENBQUE7UUFDZixzQkFBaUIsR0FBRyxHQUFHLENBQUE7UUFDdkIsaUJBQVksR0FBRyxFQUFFLENBQUE7UUFDakIsa0JBQWEsR0FBRyxJQUFJLENBQUE7UUFFcEIsa0JBQWEsR0FBRyxLQUFLLENBQUE7UUFDcEIsb0JBQWUsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFBO1FBTXZDLGFBQVEsR0FBRyxLQUFLLENBQUE7UUFJYixxQkFBZ0IsR0FBRyxJQUFJLFlBQVksRUFBcUMsQ0FBQTtRQUN4RSxnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUE7UUFDakMsZ0JBQVcsR0FBRyxJQUFJLENBQUE7UUFFYSxhQUFRLEdBQUcsS0FBSyxDQUFBO1FBRWpELFdBQU0sR0FBRyxHQUFHLENBQUE7SUF6QnFELENB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biAgT3V0cHV0LFxuICBFbGVtZW50UmVmLFxuICBIb3N0TGlzdGVuZXIsXG4gIFZpZXdDaGlsZCxcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0QmluZGluZ1xufSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuaW1wb3J0IHtcbiAgVXRpbGl0aWVzU2VydmljZVxufSBmcm9tICcuLi8uLi9zZXJ2aWNlcy91dGlsaXRpZXMuc2VydmljZSdcblxuZXhwb3J0IGludGVyZmFjZSBTa2V1b21vcnBoU2xpZGVyVmFsdWVDaGFuZ2VkRXZlbnQge1xuICB2YWx1ZTogbnVtYmVyXG4gIHRyYW5zaXRpb24/OiBib29sZWFuXG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2VxbS1za2V1b21vcnBoLXNsaWRlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9za2V1b21vcnBoLXNsaWRlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWyAnLi9za2V1b21vcnBoLXNsaWRlci5jb21wb25lbnQuc2NzcycgXVxufSlcbmV4cG9ydCBjbGFzcyBTa2V1b21vcnBoU2xpZGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgY29uc3RydWN0b3IgKHB1YmxpYyB1dGlsczogVXRpbGl0aWVzU2VydmljZSwgcHVibGljIGVsUmVmOiBFbGVtZW50UmVmKSB7fVxuXG4gIEBJbnB1dCgpIG1pbjogbnVtYmVyID0gMFxuICBASW5wdXQoKSBtYXg6IG51bWJlciA9IDFcbiAgQElucHV0KCkgYW5pbWF0aW9uRHVyYXRpb24gPSA1MDBcbiAgQElucHV0KCkgYW5pbWF0aW9uRnBzID0gMzBcbiAgQElucHV0KCkgc2Nyb2xsRW5hYmxlZCA9IHRydWVcbiAgQElucHV0KCkgbWlkZGxlPzogbnVtYmVyXG4gIEBJbnB1dCgpIHN0aWNrVG9NaWRkbGUgPSBmYWxzZVxuICBAT3V0cHV0KCkgc3RpY2tlZFRvTWlkZGxlID0gbmV3IEV2ZW50RW1pdHRlcigpXG5cbiAgZ2V0IG1pZGRsZVZhbHVlICgpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaXMubWlkZGxlID09PSAnbnVtYmVyJyA/IHRoaXMubWlkZGxlIDogKHRoaXMubWluICsgdGhpcy5tYXgpIC8gMlxuICB9XG5cbiAgcHVibGljIGRyYWdnaW5nID0gZmFsc2VcbiAgcHVibGljIGRvdWJsZWNsaWNrVGltZW91dD86IG51bWJlclxuXG4gIEBWaWV3Q2hpbGQoJ25vdGNoZXMnLCB7IHN0YXRpYzogdHJ1ZSB9KSBub3RjaGVzITogRWxlbWVudFJlZlxuICBAT3V0cHV0KCkgdXNlckNoYW5nZWRWYWx1ZSA9IG5ldyBFdmVudEVtaXR0ZXI8U2tldW9tb3JwaFNsaWRlclZhbHVlQ2hhbmdlZEV2ZW50PigpXG4gIEBPdXRwdXQoKSB2YWx1ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKVxuICBASW5wdXQoKSBzaG93Tm90Y2hlcyA9IHRydWVcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmRpc2FibGVkJykgQElucHV0KCkgZGlzYWJsZWQgPSBmYWxzZVxuXG4gIHB1YmxpYyBfdmFsdWUgPSAwLjVcbiAgQElucHV0KClcbiAgc2V0IHZhbHVlIChuZXdWYWx1ZSkge1xuICAgIGxldCB2YWx1ZSA9IHRoaXMuY2xhbXBWYWx1ZShuZXdWYWx1ZSlcblxuICAgIGlmICh0aGlzLnN0aWNrVG9NaWRkbGUpIHtcbiAgICAgIGNvbnN0IG1pZGRsZVZhbHVlID0gdGhpcy5taWRkbGVWYWx1ZVxuXG4gICAgICBsZXQgZGlmZkZyb21NaWRkbGUgPSBtaWRkbGVWYWx1ZSAtIHZhbHVlXG4gICAgICBpZiAoZGlmZkZyb21NaWRkbGUgPCAwKSB7XG4gICAgICAgIGRpZmZGcm9tTWlkZGxlICo9IC0xXG4gICAgICB9XG4gICAgICBjb25zdCBwZXJjRnJvbU1pZGRsZSA9IHRoaXMudXRpbHMubWFwVmFsdWUoZGlmZkZyb21NaWRkbGUsIDAsIHRoaXMubWF4IC0gbWlkZGxlVmFsdWUsIDAsIDEwMClcbiAgICAgIGlmICgodGhpcy5fdmFsdWUpLnRvRml4ZWQoMikgPT09IChtaWRkbGVWYWx1ZSkudG9GaXhlZCgyKSAmJiBwZXJjRnJvbU1pZGRsZSA8IDUpIHtcbiAgICAgICAgdmFsdWUgPSBtaWRkbGVWYWx1ZVxuICAgICAgfSBlbHNlIGlmICgodGhpcy5fdmFsdWUgPCBtaWRkbGVWYWx1ZSAmJiBuZXdWYWx1ZSA+IHRoaXMuX3ZhbHVlKSB8fCAodGhpcy5fdmFsdWUgPiBtaWRkbGVWYWx1ZSAmJiBuZXdWYWx1ZSA8IHRoaXMuX3ZhbHVlKSkge1xuICAgICAgICBpZiAocGVyY0Zyb21NaWRkbGUgPCAzKSB7XG4gICAgICAgICAgdmFsdWUgPSBtaWRkbGVWYWx1ZVxuICAgICAgICAgIHRoaXMuc3RpY2tlZFRvTWlkZGxlLmVtaXQoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX3ZhbHVlID0gdGhpcy5jbGFtcFZhbHVlKHZhbHVlKVxuICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh0aGlzLl92YWx1ZSlcbiAgfVxuXG4gIGdldCB2YWx1ZSAoKSB7IHJldHVybiB0aGlzLl92YWx1ZSB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2V3aGVlbCcsIFsgJyRldmVudCcgXSlcbiAgb25Nb3VzZVdoZWVsIChldmVudDogV2hlZWxFdmVudCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCAmJiB0aGlzLnNjcm9sbEVuYWJsZWQpIHtcbiAgICAgIHRoaXMudmFsdWUgKz0gLWV2ZW50LmRlbHRhWSAvIDEwMFxuICAgICAgdGhpcy51c2VyQ2hhbmdlZFZhbHVlLmVtaXQoeyB2YWx1ZTogdGhpcy52YWx1ZSB9KVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRWYWx1ZUZyb21Nb3VzZUV2ZW50IChldmVudDogTW91c2VFdmVudCkge1xuICAgIGNvbnN0IGNvb3JkcyA9IHRoaXMudXRpbHMuZ2V0Q29vcmRpbmF0ZXNJbnNpZGVFbGVtZW50RnJvbUV2ZW50KGV2ZW50LCB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQpXG4gICAgY29uc3QgeSA9IGNvb3Jkcy55XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodFxuICAgIGNvbnN0IHBhZGRpbmcgPSBoZWlnaHQgKiAwLjExXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmNsYW1wVmFsdWUodGhpcy51dGlscy5tYXBWYWx1ZSh5LCBoZWlnaHQgLSBwYWRkaW5nIC8gMiwgcGFkZGluZywgdGhpcy5taW4sIHRoaXMubWF4KSlcbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIHB1YmxpYyBjbGFtcFZhbHVlICh2YWx1ZTogbnVtYmVyKSB7XG4gICAgaWYgKHZhbHVlIDwgdGhpcy5taW4pIHtcbiAgICAgIHJldHVybiB0aGlzLm1pblxuICAgIH0gZWxzZSBpZiAodmFsdWUgPiB0aGlzLm1heCkge1xuICAgICAgcmV0dXJuIHRoaXMubWF4XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWx1ZVxuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZG93bicsIFsgJyRldmVudCcgXSlcbiAgb25Nb3VzZURvd24gKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZVxuICAgICAgaWYgKCF0aGlzLmRvdWJsZWNsaWNrVGltZW91dCkge1xuICAgICAgICB0aGlzLmRvdWJsZWNsaWNrVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZG91YmxlY2xpY2tUaW1lb3V0ID0gdW5kZWZpbmVkXG4gICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuZ2V0VmFsdWVGcm9tTW91c2VFdmVudChldmVudClcbiAgICAgICAgICB0aGlzLnVzZXJDaGFuZ2VkVmFsdWUuZW1pdCh7IHZhbHVlOiB0aGlzLnZhbHVlIH0pXG4gICAgICAgIH0sIDIwMCkgYXMgdW5rbm93biBhcyBudW1iZXJcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZW1vdmUnLCBbICckZXZlbnQnIF0pXG4gIG9uTW91c2VNb3ZlIChldmVudDogTW91c2VFdmVudCkge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCAmJiB0aGlzLmRyYWdnaW5nKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5nZXRWYWx1ZUZyb21Nb3VzZUV2ZW50KGV2ZW50KVxuICAgICAgdGhpcy51c2VyQ2hhbmdlZFZhbHVlLmVtaXQoeyB2YWx1ZTogdGhpcy52YWx1ZSB9KVxuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNldXAnKVxuICBvbk1vdXNlVXAgKCkge1xuICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2VsZWF2ZScpXG4gIG9uTW91c2VMZWF2ZSAoKSB7XG4gICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXG4gIH1cblxuICBkb3VibGVjbGljayAoKSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICBpZiAodGhpcy5kb3VibGVjbGlja1RpbWVvdXQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZG91YmxlY2xpY2tUaW1lb3V0KVxuICAgICAgfVxuXG4gICAgICB0aGlzLnVzZXJDaGFuZ2VkVmFsdWUuZW1pdCh7XG4gICAgICAgIHZhbHVlOiB0aGlzLm1pZGRsZVZhbHVlLFxuICAgICAgICB0cmFuc2l0aW9uOiB0cnVlXG4gICAgICB9KVxuICAgICAgdGhpcy5hbmltYXRlU2xpZGVyKHRoaXMudmFsdWUsIHRoaXMubWlkZGxlVmFsdWUpXG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQgKCkge1xuICAgIGlmICh0aGlzLnNob3dOb3RjaGVzKSB7XG4gICAgICB0aGlzLmRyYXdOb3RjaGVzKClcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5kcmF3Tm90Y2hlcygpKVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGFuaW1hdGVTbGlkZXIgKGZyb206IG51bWJlciwgdG86IG51bWJlcikge1xuICAgIGZyb20gPSB0aGlzLmNsYW1wVmFsdWUoZnJvbSlcbiAgICB0byA9IHRoaXMuY2xhbXBWYWx1ZSh0bylcbiAgICBjb25zdCBkaWZmID0gdG8gLSBmcm9tXG4gICAgY29uc3QgZGVsYXkgPSAxMDAwIC8gdGhpcy5hbmltYXRpb25GcHNcbiAgICBjb25zdCBmcmFtZXMgPSB0aGlzLmFuaW1hdGlvbkZwcyAqICh0aGlzLmFuaW1hdGlvbkR1cmF0aW9uIC8gMTAwMClcbiAgICBjb25zdCBzdGVwID0gZGlmZiAvIGZyYW1lc1xuICAgIGxldCB2YWx1ZSA9IGZyb21cbiAgICBmb3IgKGxldCBmcmFtZSA9IDA7IGZyYW1lIDwgZnJhbWVzOyBmcmFtZSsrKSB7XG4gICAgICBhd2FpdCB0aGlzLnV0aWxzLmRlbGF5KGRlbGF5KVxuICAgICAgdmFsdWUgKz0gc3RlcFxuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlXG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScpXG4gIGRyYXdOb3RjaGVzICgpIHtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLm5vdGNoZXMubmF0aXZlRWxlbWVudFxuICAgIGNvbnN0IGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGhcbiAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0XG4gICAgY2FudmFzLndpZHRoID0gd2lkdGhcbiAgICBjb25zdCBwYWRkaW5nID0gaGVpZ2h0ICogMC4wOFxuICAgIGNvbnN0IGdhcCA9IChoZWlnaHQgLSBwYWRkaW5nICogMikgLyAxMFxuICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjNTU5ZTdkJ1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IDEwOyBpKyspIHtcbiAgICAgIGNvbnN0IHkgPSBNYXRoLnJvdW5kKHBhZGRpbmcgKyBnYXAgKiBpKSAtIDAuNVxuICAgICAgY3R4LmJlZ2luUGF0aCgpXG4gICAgICBjb25zdCBsaW5lV2lkdGggPSBbIDAsIDUsIDEwIF0uaW5jbHVkZXMoaSkgPyB3aWR0aCA6ICh3aWR0aCAqIDAuOSlcbiAgICAgIGN0eC5tb3ZlVG8oKHdpZHRoIC0gbGluZVdpZHRoKSAvIDEsIHkpXG4gICAgICBjdHgubGluZVRvKGxpbmVXaWR0aCwgeSlcbiAgICAgIGN0eC5zdHJva2UoKVxuICAgICAgY3R4LmNsb3NlUGF0aCgpXG4gICAgfVxuICAgIGN0eC5jbGVhclJlY3Qod2lkdGggLyAyIC0gNSwgMCwgOSwgaGVpZ2h0KVxuICB9XG5cbiAgY2FsY3VsYXRlVG9wICgpIHtcbiAgICByZXR1cm4gYCR7dGhpcy51dGlscy5tYXBWYWx1ZSh0aGlzLl92YWx1ZSwgdGhpcy5taW4sIHRoaXMubWF4LCBwYXJzZUludCh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0KSAtIDI1LCAwKX1weGBcbiAgfVxufVxuIiwiPGNhbnZhcyBbaGlkZGVuXT1cIiFzaG93Tm90Y2hlc1wiICNub3RjaGVzIGhlaWdodD1cIjEzN1wiIGNsYXNzPVwibm90Y2hlc1wiPjwvY2FudmFzPlxuPGRpdiBjbGFzcz1cImdyb292ZVwiPjwvZGl2PlxuPGRpdiBjbGFzcz1cInRodW1iXCIgW3N0eWxlLnRvcF09XCJjYWxjdWxhdGVUb3AoKVwiIChkYmxjbGljayk9XCJkb3VibGVjbGljaygpXCI+XG4gIDxkaXYgY2xhc3M9XCJsaW5lLWdyb3VwXCI+PC9kaXY+XG48L2Rpdj5cbiJdfQ==
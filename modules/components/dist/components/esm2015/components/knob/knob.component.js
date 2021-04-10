import { __awaiter } from "tslib";
import { Component, Input, Output, EventEmitter, ViewChild, HostListener, HostBinding } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../services/utilities.service";
import * as i2 from "../../directives/mousewheel.directive";
import * as i3 from "@angular/common";
const _c0 = ["container"];
function KnobComponent_div_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 5);
    i0.ɵɵnamespaceSVG();
    i0.ɵɵelementStart(1, "svg", 6);
    i0.ɵɵelement(2, "defs");
    i0.ɵɵelementStart(3, "g");
    i0.ɵɵelement(4, "path", 7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
    i0.ɵɵnamespaceHTML();
    i0.ɵɵelement(5, "div", 8);
    i0.ɵɵelement(6, "div", 9);
    i0.ɵɵelementStart(7, "div", 10);
    i0.ɵɵelement(8, "div", 11);
    i0.ɵɵelementStart(9, "div", 12);
    i0.ɵɵnamespaceSVG();
    i0.ɵɵelementStart(10, "svg", 13);
    i0.ɵɵelement(11, "path", 14);
    i0.ɵɵelementEnd();
    i0.ɵɵnamespaceHTML();
    i0.ɵɵelement(12, "div", 15);
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(8);
    i0.ɵɵproperty("ngStyle", ctx_r1.largeCapBodyStyle);
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("ngStyle", ctx_r1.largeCapIndicatorStyle);
} }
function KnobComponent_div_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 16);
    i0.ɵɵnamespaceSVG();
    i0.ɵɵelementStart(1, "svg", 17);
    i0.ɵɵelementStart(2, "g");
    i0.ɵɵelement(3, "path", 18);
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
    i0.ɵɵnamespaceHTML();
    i0.ɵɵelement(4, "div", 8);
    i0.ɵɵelement(5, "div", 9);
    i0.ɵɵelementStart(6, "div", 19);
    i0.ɵɵnamespaceSVG();
    i0.ɵɵelementStart(7, "svg", 20);
    i0.ɵɵelementStart(8, "g");
    i0.ɵɵelement(9, "path", 21);
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngStyle", ctx_r2.mediumCapIndicatorStyle);
} }
function KnobComponent_div_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 22);
    i0.ɵɵnamespaceSVG();
    i0.ɵɵelementStart(1, "svg", 23);
    i0.ɵɵelementStart(2, "g");
    i0.ɵɵelement(3, "path", 24);
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
    i0.ɵɵnamespaceHTML();
    i0.ɵɵelement(4, "div", 8);
    i0.ɵɵelement(5, "div", 9);
    i0.ɵɵelementStart(6, "div", 19);
    i0.ɵɵnamespaceSVG();
    i0.ɵɵelementStart(7, "svg", 25);
    i0.ɵɵelementStart(8, "g");
    i0.ɵɵelement(9, "path", 26);
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r3 = i0.ɵɵnextContext();
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngStyle", ctx_r3.smallCapIndicatorStyle);
} }
export class KnobComponent {
    constructor(utils) {
        this.utils = utils;
        this.size = 'medium';
        this.showScale = true;
        this._min = -1;
        this._max = 1;
        this.disabled = false;
        this.doubleClickToAnimateToMiddle = true;
        this.animationDuration = 500;
        this.animationFps = 30;
        this.animatingToMiddle = new EventEmitter();
        this.stickToMiddle = false;
        this.stickedToMiddle = new EventEmitter();
        this.dragging = false;
        this.setDraggingFalseTimeout = null;
        this.continueAnimation = false;
        this.dragStartDegr = 0;
        this._value = 0;
        this.valueChange = new EventEmitter();
        this.userChangedValue = new EventEmitter();
        this.middleValue = this.calculateMiddleValue();
        this.largeCapMaxAngle = 135;
        this.mediumCapMaxAngle = 135;
        this.smallCapMaxAngle = 135;
    }
    set min(newMin) { this._min = newMin; this.calculateMiddleValue(); }
    get min() { return this._min; }
    set max(newMax) { this._max = newMax; this.calculateMiddleValue(); }
    get max() { return this._max; }
    set value(newValue) {
        if (this._value === newValue || typeof newValue !== 'number')
            return;
        let value = newValue;
        if (this.stickToMiddle) {
            let diffFromMiddle = this.middleValue - value;
            if (diffFromMiddle < 0) {
                diffFromMiddle *= -1;
            }
            const percFromMiddle = this.utils.mapValue(diffFromMiddle, 0, this.max - this.middleValue, 0, 100);
            if ((this._value).toFixed(1) === (this.middleValue).toFixed(1) && percFromMiddle < 2) {
                value = this.middleValue;
            }
            else if ((this._value < this.middleValue && newValue > this._value) || (this._value > this.middleValue && newValue < this._value)) {
                if (percFromMiddle < 5) {
                    value = this.middleValue;
                    this.stickedToMiddle.emit(this.continueAnimation);
                }
            }
        }
        this._value = this.clampValue(value);
        this.valueChange.emit(this._value);
    }
    get value() {
        return this._value;
    }
    calculateMiddleValue() {
        this.middleValue = (this.min + this.max) / 2;
        return this.middleValue;
    }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.container = this.containerRef.nativeElement;
        });
    }
    mouseWheel(event) {
        if (!this.disabled) {
            this.continueAnimation = false;
            const oldValue = this.value;
            this.value += -event.deltaY / (1000 / this.max);
            const newValue = this.value;
            if (oldValue !== newValue)
                this.userChangedValue.emit({ value: this.value });
        }
    }
    mousedown(event) {
        if (!this.disabled) {
            this.continueAnimation = false;
            this.dragStartDegr = this.getDegreesFromEvent(event);
            this.dragging = true;
        }
    }
    onMouseLeave() {
        this.dragging = false;
    }
    onGestureChange(event) {
        if (!this.disabled) {
            try {
                this.continueAnimation = false;
                const oldValue = this.value;
                this.value += event.rotation / (5000 / this.max);
                const newValue = this.value;
                if (oldValue !== newValue)
                    this.userChangedValue.emit({ value: this.value });
            }
            catch (err) {
                console.error(err);
            }
        }
    }
    mousemove(event) {
        if (!this.disabled) {
            if (this.setDraggingFalseTimeout) {
                window.clearTimeout(this.setDraggingFalseTimeout);
            }
            if (this.dragging) {
                this.continueAnimation = false;
                const distanceFromCenter = this.getDistanceFromCenterOfElementAndEvent(event);
                const unaffectedRadius = (this.container.clientWidth) / 7;
                if (distanceFromCenter < unaffectedRadius) {
                    return;
                }
                const degrees = this.getDegreesFromEvent(event);
                if ((this.dragStartDegr < 0 && degrees > 0) || (this.dragStartDegr > 0 && degrees < 0)) {
                    this.dragStartDegr = degrees;
                }
                const degreeDiff = this.dragStartDegr - degrees;
                this.dragStartDegr = degrees;
                const multiplier = (() => {
                    switch (this.size) {
                        case 'large': return 250;
                        case 'medium': return 220;
                        case 'small': return 600;
                        default: return 220;
                    }
                })();
                const oldValue = this.value;
                this.value += degreeDiff / (multiplier / this.max);
                const newValue = this.value;
                if (oldValue !== newValue)
                    this.userChangedValue.emit({ value: this.value });
            }
            this.setDraggingFalseTimeout = setTimeout(() => {
                this.dragging = false;
            }, 1000);
        }
    }
    mouseup(event) {
        this.dragging = false;
    }
    doubleclick() {
        if (this.doubleClickToAnimateToMiddle && !this.disabled) {
            this.animatingToMiddle.emit();
            this.userChangedValue.emit({ value: this.middleValue, transition: true });
            this.animateKnob(this._value, this.middleValue);
        }
    }
    get largeCapClipPathStyle() {
        return {
            transform: `rotate(${this.utils.mapValue(this.value, this.min, this.max, -this.largeCapMaxAngle, this.largeCapMaxAngle)}deg)`,
            'transform-origin': '50% 50%'
        };
    }
    get largeCapIndicatorStyle() {
        return {
            transform: `translate(-50%, -50%) rotate(${this.utils.mapValue(this.value, this.min, this.max, -this.largeCapMaxAngle, this.largeCapMaxAngle)}deg)`
        };
    }
    get largeCapBodyStyle() {
        return {
        // 'clip-path': `url(#large-knob-cap-clip-path-${this.id})`,
        // '-webkit-clip-path': `url(#large-knob-cap-clip-path-${this.id})`
        };
    }
    get mediumCapIndicatorStyle() {
        return {
            transform: `translate(-50%, -50%) rotate(${this.utils.mapValue(this.value, this.min, this.max, -this.mediumCapMaxAngle, this.mediumCapMaxAngle)}deg)`
        };
    }
    get smallCapIndicatorStyle() {
        return {
            transform: `translate(-50%, -50%) rotate(${this.utils.mapValue(this.value, this.min, this.max, -this.smallCapMaxAngle, this.smallCapMaxAngle)}deg)`
        };
    }
    animateKnob(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            from = this.clampValue(from);
            to = this.clampValue(to);
            const diff = to - from;
            const delay = 1000 / this.animationFps;
            const frames = this.animationFps * (this.animationDuration / 1000);
            const step = diff / frames;
            this.continueAnimation = true;
            let value = from;
            for (let frame = 0; frame < frames; frame++) {
                if (this.continueAnimation) {
                    yield this.utils.delay(delay);
                    value += step;
                    this.value = value;
                }
                else {
                    break;
                }
            }
            this.continueAnimation = false;
        });
    }
    getDegreesFromEvent(event) {
        const coords = this.utils.getCoordinatesInsideElementFromEvent(event, this.container);
        const knobCenterX = (this.container.clientWidth) / 2;
        const knobCenterY = (this.container.clientHeight) / 2;
        const rads = Math.atan2(coords.x - knobCenterX, coords.y - knobCenterY);
        return rads * 100;
    }
    getDistanceFromCenterOfElementAndEvent(event) {
        const coords = this.utils.getCoordinatesInsideElementFromEvent(event, this.container);
        const knobCenterX = (this.container.clientWidth) / 2;
        const knobCenterY = (this.container.clientHeight) / 2;
        const w = coords.x - knobCenterX;
        const h = coords.y - knobCenterY;
        return Math.sqrt(w * w + h * h);
    }
    clampValue(value) {
        if (value > this.max) {
            value = this.max;
        }
        if (value < this.min) {
            value = this.min;
        }
        return value;
    }
}
KnobComponent.ɵfac = function KnobComponent_Factory(t) { return new (t || KnobComponent)(i0.ɵɵdirectiveInject(i1.UtilitiesService)); };
KnobComponent.ɵcmp = i0.ɵɵdefineComponent({ type: KnobComponent, selectors: [["eqm-knob"]], viewQuery: function KnobComponent_Query(rf, ctx) { if (rf & 1) {
        i0.ɵɵviewQuery(_c0, 3);
    } if (rf & 2) {
        let _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.containerRef = _t.first);
    } }, hostVars: 2, hostBindings: function KnobComponent_HostBindings(rf, ctx) { if (rf & 1) {
        i0.ɵɵlistener("mouseleave", function KnobComponent_mouseleave_HostBindingHandler() { return ctx.onMouseLeave(); })("gesturechange", function KnobComponent_gesturechange_HostBindingHandler($event) { return ctx.onGestureChange($event); });
    } if (rf & 2) {
        i0.ɵɵclassProp("disabled", ctx.disabled);
    } }, inputs: { size: "size", showScale: "showScale", min: "min", max: "max", disabled: "disabled", doubleClickToAnimateToMiddle: "doubleClickToAnimateToMiddle", animationDuration: "animationDuration", animationFps: "animationFps", stickToMiddle: "stickToMiddle", value: "value" }, outputs: { animatingToMiddle: "animatingToMiddle", stickedToMiddle: "stickedToMiddle", valueChange: "valueChange", userChangedValue: "userChangedValue" }, decls: 5, vars: 3, consts: [["mouseWheel", "", 1, "container", 3, "mouseWheel", "dblclick", "mousedown", "mousemove", "mouseup"], ["container", ""], ["class", "knob large", 4, "ngIf"], ["class", "knob medium", 4, "ngIf"], ["class", "knob small", 4, "ngIf"], [1, "knob", "large"], ["version", "1.1", "xmlns", "http://www.w3.org/2000/svg", 0, "xmlns", "xlink", "http://www.w3.org/1999/xlink", "x", "0px", "y", "0px", "width", "175.82px", "height", "144.94px", "viewBox", "0 0 175.82 144.94", 0, "xml", "space", "preserve", 1, "scale", 2, "enable-background", "new 0 0 175.82 144.94"], ["d", "M174.29,104.03l-2.13-0.57c0.95-5.1,1.47-10.35,1.47-15.72c0-5.37-0.52-10.62-1.47-15.72l2.13-0.57\n c0.99,5.28,1.54,10.72,1.54,16.29C175.82,93.31,175.28,98.75,174.29,104.03z M152.99,143.38c6.82-7.94,12.22-17.14,15.77-27.21\n l2.13,0.57c-3.66,10.44-9.26,19.98-16.34,28.19L152.99,143.38z M152.97,32.12l1.56-1.56c7.09,8.22,12.7,17.73,16.36,28.18\n l-2.13,0.57C165.2,49.24,159.79,40.06,152.97,32.12z M116.4,7.05l0.57-2.13c10.46,3.66,20,9.26,28.23,16.33l-1.56,1.55\n C135.69,16,126.49,10.6,116.4,7.05z M87.91,2.19c-5.38,0-10.65,0.5-15.75,1.45l-0.57-2.12C76.88,0.52,82.33,0,87.91,0\n s11.03,0.53,16.32,1.53l-0.57,2.13C98.56,2.7,93.29,2.19,87.91,2.19z M30.6,21.24C38.83,14.16,48.4,8.6,58.86,4.94l0.57,2.12\n c-10.08,3.55-19.31,8.92-27.27,15.73L30.6,21.24z M4.94,116.74l2.13-0.57c3.55,10.07,8.97,19.25,15.79,27.19l-1.56,1.55\n C14.21,136.71,8.6,127.19,4.94,116.74z M4.94,58.74C8.6,48.3,14.2,38.76,21.28,30.55l1.56,1.56c-6.82,7.94-12.22,17.14-15.77,27.21\n L4.94,58.74z M3.67,103.46l-2.13,0.57C0.54,98.75,0,93.31,0,87.74c0-5.57,0.54-11.01,1.54-16.29l2.13,0.57\n C2.72,77.12,2.2,82.37,2.2,87.74C2.2,93.11,2.72,98.36,3.67,103.46z"], [1, "slot"], [1, "body"], [1, "cap"], [1, "cap-body", 3, "ngStyle"], [1, "indicator", 3, "ngStyle"], ["xmlns", "http://www.w3.org/2000/svg", 0, "xmlns", "xlink", "http://www.w3.org/1999/xlink", "x", "0px", "y", "0px", "width", "40px", "height", "40px", "viewBox", "0 0 40 40", 0, "xml", "space", "preserve", 1, "inner-line", 2, "enable-background", "new 0 0 40 40"], ["d", "M20.000,40.000 C8.954,40.000 -0.000,31.046 -0.000,20.000 C-0.000,10.324 6.871,2.255 16.000,0.402 L16.000,1.430 C7.429,3.268 1.000,10.880 1.000,20.000 C1.000,30.493 9.507,39.000 20.000,39.000 C30.493,39.000 39.000,30.493 39.000,20.000 C39.000,10.880 32.571,3.268 24.000,1.430 L24.000,0.402 C33.129,2.255 40.000,10.324 40.000,20.000 C40.000,31.046 31.046,40.000 20.000,40.000 Z"], [1, "pointer"], [1, "knob", "medium"], ["xmlns", "http://www.w3.org/2000/svg", 0, "xmlns", "xlink", "http://www.w3.org/1999/xlink", 1, "scale"], ["d", "M54.284,51.455 L51.444,48.604 C55.520,43.875 58.000,37.732 58.000,31.000 C58.000,24.563 55.739,18.659 51.980,14.020 L52.000,14.000 L51.861,13.861 C46.909,7.841 39.404,4.000 31.000,4.000 C16.088,4.000 4.000,16.088 4.000,31.000 C4.000,37.751 6.494,43.907 10.589,48.641 L7.717,51.456 C2.917,45.996 -0.000,38.841 -0.000,31.000 C-0.000,13.879 13.879,-0.000 31.000,-0.000 C48.121,-0.000 62.000,13.879 62.000,31.000 C62.000,38.840 59.083,45.996 54.284,51.455 ZM9.080,52.921 C9.080,52.920 9.080,52.920 9.079,52.920 L9.080,52.921 ZM13.433,51.478 C18.157,55.534 24.285,58.000 31.000,58.000 C37.732,58.000 43.875,55.520 48.604,51.444 L51.455,54.284 C45.996,59.083 38.840,62.000 31.000,62.000 C23.160,62.000 16.005,59.084 10.546,54.284 L13.433,51.478 Z"], [1, "cap", 3, "ngStyle"], ["width", "38px", "height", "38px", "xmlns", "http://www.w3.org/2000/svg", 0, "xmlns", "xlink", "http://www.w3.org/1999/xlink"], ["d", "M19.000,38.000 C8.507,38.000 -0.000,29.493 -0.000,19.000 C-0.000,8.844 7.974,0.574 18.000,0.050 L18.000,13.000 C18.000,13.552 18.448,14.000 19.000,14.000 C19.552,14.000 20.000,13.552 20.000,13.000 L20.000,0.050 C30.026,0.574 38.000,8.844 38.000,19.000 C38.000,29.493 29.493,38.000 19.000,38.000 Z"], [1, "knob", "small"], ["version", "1.1", "xmlns", "http://www.w3.org/2000/svg", 0, "xmlns", "xlink", "http://www.w3.org/1999/xlink", 0, "xml", "space", "preserve", 1, "scale"], ["d", "M33.46,32l-0.04-0.04C36.26,28.78,38,24.6,38,20c0-9.94-8.06-18-18-18S2,10.06,2,20c0,4.62,1.75,8.81,4.61,12l-0.28,0.26\n      L6,32.61l-0.81,0.8C1.98,29.86,0,25.17,0,20C0,8.95,8.95,0,20,0s20,8.95,20,20c0,5.16-1.97,9.84-5.18,13.39L34,32.55"], ["width", "24px", "height", "24px", "xmlns", "http://www.w3.org/2000/svg", 0, "xmlns", "xlink", "http://www.w3.org/1999/xlink"], ["d", "M12.000,24.000 C5.373,24.000 -0.000,18.627 -0.000,12.000 C-0.000,5.710 4.842,0.560 11.000,0.050 L11.000,6.000 C11.000,6.552 11.448,7.000 12.000,7.000 C12.552,7.000 13.000,6.552 13.000,6.000 L13.000,0.050 C19.158,0.560 24.000,5.710 24.000,12.000 C24.000,18.627 18.627,24.000 12.000,24.000 Z"]], template: function KnobComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "div", 0, 1);
        i0.ɵɵlistener("mouseWheel", function KnobComponent_Template_div_mouseWheel_0_listener($event) { return ctx.mouseWheel($event); })("dblclick", function KnobComponent_Template_div_dblclick_0_listener() { return ctx.doubleclick(); })("mousedown", function KnobComponent_Template_div_mousedown_0_listener($event) { return ctx.mousedown($event); })("mousemove", function KnobComponent_Template_div_mousemove_0_listener($event) { return ctx.mousemove($event); })("mouseup", function KnobComponent_Template_div_mouseup_0_listener($event) { return ctx.mouseup($event); });
        i0.ɵɵtemplate(2, KnobComponent_div_2_Template, 13, 2, "div", 2);
        i0.ɵɵtemplate(3, KnobComponent_div_3_Template, 10, 1, "div", 3);
        i0.ɵɵtemplate(4, KnobComponent_div_4_Template, 10, 1, "div", 4);
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵadvance(2);
        i0.ɵɵproperty("ngIf", ctx.size === "large");
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngIf", ctx.size === "medium");
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngIf", ctx.size === "small");
    } }, directives: [i2.MouseWheelDirective, i3.NgIf, i3.NgStyle], styles: [".disabled[_nghost-%COMP%]{filter:grayscale(80%)}.container[_ngcontent-%COMP%]{display:inline-block}.container[_ngcontent-%COMP%]   .knob[_ngcontent-%COMP%]{position:relative}.container[_ngcontent-%COMP%]   .large[_ngcontent-%COMP%]{width:90px;height:90px}.container[_ngcontent-%COMP%]   .large[_ngcontent-%COMP%]   .scale[_ngcontent-%COMP%]{width:80px;height:80px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);fill:#4f8d71;top:43%}.container[_ngcontent-%COMP%]   .large[_ngcontent-%COMP%]   .slot[_ngcontent-%COMP%]{width:70px;height:70px;border-radius:50%;box-shadow:0 5px 5px rgba(0,0,0,.6666666666666666);border:2px solid #000}.container[_ngcontent-%COMP%]   .large[_ngcontent-%COMP%]   .body[_ngcontent-%COMP%], .container[_ngcontent-%COMP%]   .large[_ngcontent-%COMP%]   .slot[_ngcontent-%COMP%]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background-color:#46494e}.container[_ngcontent-%COMP%]   .large[_ngcontent-%COMP%]   .body[_ngcontent-%COMP%]{width:64px;height:64px;box-shadow:0 1px 5px .5px #000,0 -1px 5px .5px hsla(0,0%,100%,.6);border-radius:50%;box-shadow:0 -.5px 0 0 hsla(0,0%,100%,.2),0 -1px 5px .5px hsla(0,0%,100%,.26666666666666666),0 .5px .5px .5px #000,0 1px 5px .5px #000}.container[_ngcontent-%COMP%]   .large[_ngcontent-%COMP%]   .cap[_ngcontent-%COMP%]{filter:drop-shadow(0 -1px 0 #FFF3) drop-shadow(0 2px 5px black)}.container[_ngcontent-%COMP%]   .large[_ngcontent-%COMP%]   .cap[_ngcontent-%COMP%], .container[_ngcontent-%COMP%]   .large[_ngcontent-%COMP%]   .cap[_ngcontent-%COMP%]   .cap-body[_ngcontent-%COMP%]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:58px;height:58px}.container[_ngcontent-%COMP%]   .large[_ngcontent-%COMP%]   .cap[_ngcontent-%COMP%]   .cap-body[_ngcontent-%COMP%]{border-radius:50%;background-image:linear-gradient(180deg,#51555a,#3c4045)}.container[_ngcontent-%COMP%]   .large[_ngcontent-%COMP%]   .cap[_ngcontent-%COMP%]   .indicator[_ngcontent-%COMP%], .container[_ngcontent-%COMP%]   .large[_ngcontent-%COMP%]   .cap[_ngcontent-%COMP%]   .indicator[_ngcontent-%COMP%]   .inner-line[_ngcontent-%COMP%]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:40px;height:40px}.container[_ngcontent-%COMP%]   .large[_ngcontent-%COMP%]   .cap[_ngcontent-%COMP%]   .indicator[_ngcontent-%COMP%]   .inner-line[_ngcontent-%COMP%]{fill:#232628}.container[_ngcontent-%COMP%]   .large[_ngcontent-%COMP%]   .cap[_ngcontent-%COMP%]   .indicator[_ngcontent-%COMP%]   .pointer[_ngcontent-%COMP%]{width:5px;height:5px;border-radius:50%;position:absolute;top:-4%;left:50%;transform:translate(-50%);background-color:#4f8d71}.container[_ngcontent-%COMP%]   .medium[_ngcontent-%COMP%]{width:70px;height:70px}.container[_ngcontent-%COMP%]   .medium[_ngcontent-%COMP%]   .scale[_ngcontent-%COMP%]{width:62px;height:62px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);fill:#4f8d71}.container[_ngcontent-%COMP%]   .medium[_ngcontent-%COMP%]   .slot[_ngcontent-%COMP%]{width:48px;height:48px;background-color:#3f4346;box-shadow:0 3px 5px 2px rgba(0,0,0,.6)}.container[_ngcontent-%COMP%]   .medium[_ngcontent-%COMP%]   .body[_ngcontent-%COMP%], .container[_ngcontent-%COMP%]   .medium[_ngcontent-%COMP%]   .slot[_ngcontent-%COMP%]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%}.container[_ngcontent-%COMP%]   .medium[_ngcontent-%COMP%]   .body[_ngcontent-%COMP%]{width:38px;height:38px;box-shadow:0 0 2px .5px hsla(0,0%,100%,.13333333333333333);background-color:#3d4244}.container[_ngcontent-%COMP%]   .medium[_ngcontent-%COMP%]   .cap[_ngcontent-%COMP%]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:38px;height:38px;fill:#4f8d71}.container[_ngcontent-%COMP%]   .small[_ngcontent-%COMP%]{width:50px;height:50px}.container[_ngcontent-%COMP%]   .small[_ngcontent-%COMP%]   .scale[_ngcontent-%COMP%]{width:40px;height:40px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);fill:#4f8d71}.container[_ngcontent-%COMP%]   .small[_ngcontent-%COMP%]   .slot[_ngcontent-%COMP%]{width:34px;height:34px;background-color:#3f4346;box-shadow:0 2px 5px 2px rgba(0,0,0,.6)}.container[_ngcontent-%COMP%]   .small[_ngcontent-%COMP%]   .body[_ngcontent-%COMP%], .container[_ngcontent-%COMP%]   .small[_ngcontent-%COMP%]   .slot[_ngcontent-%COMP%]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%}.container[_ngcontent-%COMP%]   .small[_ngcontent-%COMP%]   .body[_ngcontent-%COMP%]{width:27px;height:27px;box-shadow:0 0 2px .5px hsla(0,0%,100%,.13333333333333333);background-color:#3d4244}.container[_ngcontent-%COMP%]   .small[_ngcontent-%COMP%]   .cap[_ngcontent-%COMP%]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:24px;height:24px;fill:#4f8d71}"] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(KnobComponent, [{
        type: Component,
        args: [{
                selector: 'eqm-knob',
                templateUrl: './knob.component.html',
                styleUrls: ['./knob.component.scss']
            }]
    }], function () { return [{ type: i1.UtilitiesService }]; }, { size: [{
            type: Input
        }], showScale: [{
            type: Input
        }], min: [{
            type: Input
        }], max: [{
            type: Input
        }], disabled: [{
            type: HostBinding,
            args: ['class.disabled']
        }, {
            type: Input
        }], doubleClickToAnimateToMiddle: [{
            type: Input
        }], animationDuration: [{
            type: Input
        }], animationFps: [{
            type: Input
        }], animatingToMiddle: [{
            type: Output
        }], stickToMiddle: [{
            type: Input
        }], stickedToMiddle: [{
            type: Output
        }], containerRef: [{
            type: ViewChild,
            args: ['container', { static: true }]
        }], valueChange: [{
            type: Output
        }], userChangedValue: [{
            type: Output
        }], value: [{
            type: Input
        }], onMouseLeave: [{
            type: HostListener,
            args: ['mouseleave']
        }], onGestureChange: [{
            type: HostListener,
            args: ['gesturechange', ['$event']]
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25vYi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL2tub2Iva25vYi5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL2tub2Iva25vYi5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixTQUFTLEVBQ1QsWUFBWSxFQUNaLFdBQVcsRUFFWixNQUFNLGVBQWUsQ0FBQTs7Ozs7OztJQ05wQiw4QkFBaUQ7SUFDL0MsbUJBRXdFO0lBRnhFLDhCQUV3RTtJQUN0RSx1QkFDTztJQUNQLHlCQUFHO0lBQ0QsMEJBUzhEO0lBQ2hFLGlCQUFJO0lBQ04saUJBQU07SUFFTixvQkFBa0I7SUFBbEIseUJBQXdCO0lBQ3hCLHlCQUF3QjtJQUN4QiwrQkFBaUI7SUFDZiwwQkFBMEQ7SUFDMUQsK0JBQTBEO0lBQ3hELG1CQUV1QjtJQUZ2QixnQ0FFdUI7SUFFckIsNEJBQ2dZO0lBQ2xZLGlCQUFNO0lBQ04sb0JBQXFCO0lBQXJCLDJCQUEyQjtJQUM3QixpQkFBTTtJQUNSLGlCQUFNO0lBQ1IsaUJBQU07OztJQVpvQixlQUE2QjtJQUE3QixrREFBNkI7SUFDNUIsZUFBa0M7SUFBbEMsdURBQWtDOzs7SUFjN0QsK0JBQW1EO0lBQ2pELG1CQUFpRztJQUFqRywrQkFBaUc7SUFDL0YseUJBQUc7SUFDRCwyQkFDNnVCO0lBQy91QixpQkFBSTtJQUNOLGlCQUFNO0lBQ04sb0JBQWtCO0lBQWxCLHlCQUF3QjtJQUN4Qix5QkFBd0I7SUFDeEIsK0JBQXFEO0lBQ25ELG1CQUE4RztJQUE5RywrQkFBOEc7SUFDNUcseUJBQUc7SUFDRCwyQkFDaVQ7SUFDblQsaUJBQUk7SUFDTixpQkFBTTtJQUNSLGlCQUFNO0lBQ1IsaUJBQU07OztJQVJhLGVBQW1DO0lBQW5DLHdEQUFtQzs7O0lBV3RELCtCQUFpRDtJQUMvQyxtQkFDdUI7SUFEdkIsK0JBQ3VCO0lBQ3JCLHlCQUFHO0lBQ0QsMkJBRWtIO0lBQ3BILGlCQUFJO0lBQ04saUJBQU07SUFDTixvQkFBa0I7SUFBbEIseUJBQXdCO0lBQ3hCLHlCQUF3QjtJQUV4QiwrQkFBb0Q7SUFDbEQsbUJBQThHO0lBQTlHLCtCQUE4RztJQUM1Ryx5QkFBRztJQUNELDJCQUMwUztJQUM1UyxpQkFBSTtJQUNOLGlCQUFNO0lBQ1IsaUJBQU07SUFDUixpQkFBTTs7O0lBUmEsZUFBa0M7SUFBbEMsdURBQWtDOztBRHBEdkQsTUFBTSxPQUFPLGFBQWE7SUFpRXhCLFlBQW9CLEtBQXVCO1FBQXZCLFVBQUssR0FBTCxLQUFLLENBQWtCO1FBaEVsQyxTQUFJLEdBQWlDLFFBQVEsQ0FBQTtRQUM3QyxjQUFTLEdBQUcsSUFBSSxDQUFBO1FBQ2xCLFNBQUksR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUlULFNBQUksR0FBRyxDQUFDLENBQUE7UUFJeUIsYUFBUSxHQUFHLEtBQUssQ0FBQTtRQUUvQyxpQ0FBNEIsR0FBRyxJQUFJLENBQUE7UUFDbkMsc0JBQWlCLEdBQUcsR0FBRyxDQUFBO1FBQ3ZCLGlCQUFZLEdBQUcsRUFBRSxDQUFBO1FBQ2hCLHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUE7UUFFdkMsa0JBQWEsR0FBRyxLQUFLLENBQUE7UUFDcEIsb0JBQWUsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFBO1FBRXZDLGFBQVEsR0FBRyxLQUFLLENBQUE7UUFDaEIsNEJBQXVCLEdBQVEsSUFBSSxDQUFBO1FBQ25DLHNCQUFpQixHQUFHLEtBQUssQ0FBQTtRQUN6QixrQkFBYSxHQUFHLENBQUMsQ0FBQTtRQUtqQixXQUFNLEdBQUcsQ0FBQyxDQUFBO1FBQ1AsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFBO1FBQ3hDLHFCQUFnQixHQUFHLElBQUksWUFBWSxFQUF5QixDQUFBO1FBNEJ0RSxnQkFBVyxHQUFXLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFBO1FBbUdqRCxxQkFBZ0IsR0FBRyxHQUFHLENBQUE7UUFxQnRCLHNCQUFpQixHQUFHLEdBQUcsQ0FBQTtRQU92QixxQkFBZ0IsR0FBRyxHQUFHLENBQUE7SUF6SHdCLENBQUM7SUE3RC9DLElBQWEsR0FBRyxDQUFFLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFBLENBQUMsQ0FBQztJQUM3RSxJQUFJLEdBQUcsS0FBTSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUEsQ0FBQyxDQUFDO0lBRy9CLElBQWEsR0FBRyxDQUFFLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFBLENBQUMsQ0FBQztJQUM3RSxJQUFJLEdBQUcsS0FBTSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUEsQ0FBQyxDQUFDO0lBdUIvQixJQUNJLEtBQUssQ0FBRSxRQUFnQjtRQUN6QixJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVE7WUFBRSxPQUFNO1FBQ3BFLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQTtRQUNwQixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdEIsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7WUFDN0MsSUFBSSxjQUFjLEdBQUcsQ0FBQyxFQUFFO2dCQUN0QixjQUFjLElBQUksQ0FBQyxDQUFDLENBQUE7YUFDckI7WUFDRCxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUE7WUFDbEcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLGNBQWMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3BGLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFBO2FBQ3pCO2lCQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNuSSxJQUFJLGNBQWMsR0FBRyxDQUFDLEVBQUU7b0JBQ3RCLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFBO29CQUN4QixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtpQkFDbEQ7YUFDRjtTQUNGO1FBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3BDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUNwQyxDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFBO0lBQ3BCLENBQUM7SUFHTSxvQkFBb0I7UUFDekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUM1QyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUE7SUFDekIsQ0FBQztJQUlLLFFBQVE7O1lBQ1osSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQTtRQUNsRCxDQUFDO0tBQUE7SUFFRCxVQUFVLENBQUUsS0FBaUI7UUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQTtZQUM5QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFBO1lBQzNCLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUMvQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFBO1lBQzNCLElBQUksUUFBUSxLQUFLLFFBQVE7Z0JBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQTtTQUM3RTtJQUNILENBQUM7SUFFRCxTQUFTLENBQUUsS0FBaUI7UUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQTtZQUM5QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNwRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtTQUNyQjtJQUNILENBQUM7SUFHRCxZQUFZO1FBQ1YsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUE7SUFDdkIsQ0FBQztJQUdELGVBQWUsQ0FBRSxLQUFVO1FBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xCLElBQUk7Z0JBQ0YsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQTtnQkFDOUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQTtnQkFDM0IsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDaEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQTtnQkFDM0IsSUFBSSxRQUFRLEtBQUssUUFBUTtvQkFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO2FBQzdFO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1osT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTthQUNuQjtTQUNGO0lBQ0gsQ0FBQztJQUVELFNBQVMsQ0FBRSxLQUFpQjtRQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNsQixJQUFJLElBQUksQ0FBQyx1QkFBdUIsRUFBRTtnQkFDaEMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQTthQUNsRDtZQUNELElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDakIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQTtnQkFDOUIsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsc0NBQXNDLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBQzdFLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDekQsSUFBSSxrQkFBa0IsR0FBRyxnQkFBZ0IsRUFBRTtvQkFDekMsT0FBTTtpQkFDUDtnQkFDRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBQy9DLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEVBQUU7b0JBQ3RGLElBQUksQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFBO2lCQUM3QjtnQkFDRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQTtnQkFDL0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUE7Z0JBQzVCLE1BQU0sVUFBVSxHQUFHLENBQUMsR0FBRyxFQUFFO29CQUN2QixRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUU7d0JBQ2pCLEtBQUssT0FBTyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUE7d0JBQ3hCLEtBQUssUUFBUSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUE7d0JBQ3pCLEtBQUssT0FBTyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUE7d0JBQ3hCLE9BQU8sQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFBO3FCQUNwQjtnQkFDSCxDQUFDLENBQUMsRUFBRSxDQUFBO2dCQUNKLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUE7Z0JBQzNCLElBQUksQ0FBQyxLQUFLLElBQUksVUFBVSxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDbEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQTtnQkFDM0IsSUFBSSxRQUFRLEtBQUssUUFBUTtvQkFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO2FBQzdFO1lBQ0QsSUFBSSxDQUFDLHVCQUF1QixHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQzdDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO1lBQ3ZCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtTQUNUO0lBQ0gsQ0FBQztJQUVELE9BQU8sQ0FBRSxLQUFpQjtRQUN4QixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQTtJQUN2QixDQUFDO0lBRUQsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLDRCQUE0QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUN2RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLENBQUE7WUFDN0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1lBQ3pFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7U0FDaEQ7SUFDSCxDQUFDO0lBR0QsSUFBSSxxQkFBcUI7UUFDdkIsT0FBTztZQUNMLFNBQVMsRUFBRSxVQUFVLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNO1lBQzdILGtCQUFrQixFQUFFLFNBQVM7U0FDOUIsQ0FBQTtJQUNILENBQUM7SUFFRCxJQUFJLHNCQUFzQjtRQUN4QixPQUFPO1lBQ0wsU0FBUyxFQUFFLGdDQUFnQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTTtTQUNwSixDQUFBO0lBQ0gsQ0FBQztJQUVELElBQUksaUJBQWlCO1FBQ25CLE9BQU87UUFDTCw0REFBNEQ7UUFDNUQsbUVBQW1FO1NBQ3BFLENBQUE7SUFDSCxDQUFDO0lBR0QsSUFBSSx1QkFBdUI7UUFDekIsT0FBTztZQUNMLFNBQVMsRUFBRSxnQ0FBZ0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU07U0FDdEosQ0FBQTtJQUNILENBQUM7SUFHRCxJQUFJLHNCQUFzQjtRQUN4QixPQUFPO1lBQ0wsU0FBUyxFQUFFLGdDQUFnQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTTtTQUNwSixDQUFBO0lBQ0gsQ0FBQztJQUVLLFdBQVcsQ0FBRSxJQUFZLEVBQUUsRUFBVTs7WUFDekMsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDNUIsRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDeEIsTUFBTSxJQUFJLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQTtZQUV0QixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQTtZQUN0QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxDQUFBO1lBQ2xFLE1BQU0sSUFBSSxHQUFHLElBQUksR0FBRyxNQUFNLENBQUE7WUFDMUIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQTtZQUM3QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUE7WUFDaEIsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDM0MsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7b0JBQzFCLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7b0JBQzdCLEtBQUssSUFBSSxJQUFJLENBQUE7b0JBQ2IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7aUJBQ25CO3FCQUFNO29CQUNMLE1BQUs7aUJBQ047YUFDRjtZQUNELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUE7UUFDaEMsQ0FBQztLQUFBO0lBRU0sbUJBQW1CLENBQUUsS0FBaUI7UUFDM0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQ3JGLE1BQU0sV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDcEQsTUFBTSxXQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNyRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUE7UUFDdkUsT0FBTyxJQUFJLEdBQUcsR0FBRyxDQUFBO0lBQ25CLENBQUM7SUFFTSxzQ0FBc0MsQ0FBRSxLQUFpQjtRQUM5RCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7UUFDckYsTUFBTSxXQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNwRCxNQUFNLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3JELE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFBO1FBQ2hDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFBO1FBQ2hDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUNqQyxDQUFDO0lBRU0sVUFBVSxDQUFFLEtBQWE7UUFDOUIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNwQixLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQTtTQUNqQjtRQUVELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDcEIsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUE7U0FDakI7UUFFRCxPQUFPLEtBQUssQ0FBQTtJQUNkLENBQUM7OzBFQWxQVSxhQUFhO2tEQUFiLGFBQWE7Ozs7OztvR0FBYixrQkFBYywrRkFBZCwyQkFBdUI7Ozs7UUN0QnBDLGlDQUM4RjtRQURqRCx1R0FBYyxzQkFBa0IsSUFBQyxnRkFBYSxpQkFBYSxJQUExQix3RkFDL0QscUJBQWlCLElBRDhDLHdGQUMvQixxQkFBaUIsSUFEYyxvRkFDRCxtQkFBZSxJQURkO1FBSTVFLCtEQW1DTTtRQUdOLCtEQWlCTTtRQUdOLCtEQW9CTTtRQUNSLGlCQUFNOztRQS9FRSxlQUFzQjtRQUF0QiwyQ0FBc0I7UUFzQ3RCLGVBQXVCO1FBQXZCLDRDQUF1QjtRQW9CdkIsZUFBc0I7UUFBdEIsMkNBQXNCOzt1RkR4Q2pCLGFBQWE7Y0FMekIsU0FBUztlQUFDO2dCQUNULFFBQVEsRUFBRSxVQUFVO2dCQUNwQixXQUFXLEVBQUUsdUJBQXVCO2dCQUNwQyxTQUFTLEVBQUUsQ0FBRSx1QkFBdUIsQ0FBRTthQUN2QzttRUFFVSxJQUFJO2tCQUFaLEtBQUs7WUFDRyxTQUFTO2tCQUFqQixLQUFLO1lBRU8sR0FBRztrQkFBZixLQUFLO1lBSU8sR0FBRztrQkFBZixLQUFLO1lBR2tDLFFBQVE7a0JBQS9DLFdBQVc7bUJBQUMsZ0JBQWdCOztrQkFBRyxLQUFLO1lBRTVCLDRCQUE0QjtrQkFBcEMsS0FBSztZQUNHLGlCQUFpQjtrQkFBekIsS0FBSztZQUNHLFlBQVk7a0JBQXBCLEtBQUs7WUFDSSxpQkFBaUI7a0JBQTFCLE1BQU07WUFFRSxhQUFhO2tCQUFyQixLQUFLO1lBQ0ksZUFBZTtrQkFBeEIsTUFBTTtZQU9tQyxZQUFZO2tCQUFyRCxTQUFTO21CQUFDLFdBQVcsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7WUFJOUIsV0FBVztrQkFBcEIsTUFBTTtZQUNHLGdCQUFnQjtrQkFBekIsTUFBTTtZQUVILEtBQUs7a0JBRFIsS0FBSztZQTBETixZQUFZO2tCQURYLFlBQVk7bUJBQUMsWUFBWTtZQU0xQixlQUFlO2tCQURkLFlBQVk7bUJBQUMsZUFBZSxFQUFFLENBQUUsUUFBUSxDQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBPbkluaXQsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgVmlld0NoaWxkLFxuICBIb3N0TGlzdGVuZXIsXG4gIEhvc3RCaW5kaW5nLFxuICBFbGVtZW50UmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5pbXBvcnQgeyBVdGlsaXRpZXNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvdXRpbGl0aWVzLnNlcnZpY2UnXG5cbmV4cG9ydCBpbnRlcmZhY2UgS25vYlZhbHVlQ2hhbmdlZEV2ZW50IHtcbiAgdmFsdWU6IG51bWJlclxuICB0cmFuc2l0aW9uPzogYm9vbGVhblxufVxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZXFtLWtub2InLFxuICB0ZW1wbGF0ZVVybDogJy4va25vYi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWyAnLi9rbm9iLmNvbXBvbmVudC5zY3NzJyBdXG59KVxuZXhwb3J0IGNsYXNzIEtub2JDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKSBzaXplOiAnbGFyZ2UnIHwgJ21lZGl1bScgfCAnc21hbGwnID0gJ21lZGl1bSdcbiAgQElucHV0KCkgc2hvd1NjYWxlID0gdHJ1ZVxuICBwdWJsaWMgX21pbiA9IC0xXG4gIEBJbnB1dCgpIHNldCBtaW4gKG5ld01pbikgeyB0aGlzLl9taW4gPSBuZXdNaW47IHRoaXMuY2FsY3VsYXRlTWlkZGxlVmFsdWUoKSB9XG4gIGdldCBtaW4gKCkgeyByZXR1cm4gdGhpcy5fbWluIH1cblxuICBwdWJsaWMgX21heCA9IDFcbiAgQElucHV0KCkgc2V0IG1heCAobmV3TWF4KSB7IHRoaXMuX21heCA9IG5ld01heDsgdGhpcy5jYWxjdWxhdGVNaWRkbGVWYWx1ZSgpIH1cbiAgZ2V0IG1heCAoKSB7IHJldHVybiB0aGlzLl9tYXggfVxuXG4gIEBIb3N0QmluZGluZygnY2xhc3MuZGlzYWJsZWQnKSBASW5wdXQoKSBkaXNhYmxlZCA9IGZhbHNlXG5cbiAgQElucHV0KCkgZG91YmxlQ2xpY2tUb0FuaW1hdGVUb01pZGRsZSA9IHRydWVcbiAgQElucHV0KCkgYW5pbWF0aW9uRHVyYXRpb24gPSA1MDBcbiAgQElucHV0KCkgYW5pbWF0aW9uRnBzID0gMzBcbiAgQE91dHB1dCgpIGFuaW1hdGluZ1RvTWlkZGxlID0gbmV3IEV2ZW50RW1pdHRlcigpXG5cbiAgQElucHV0KCkgc3RpY2tUb01pZGRsZSA9IGZhbHNlXG4gIEBPdXRwdXQoKSBzdGlja2VkVG9NaWRkbGUgPSBuZXcgRXZlbnRFbWl0dGVyKClcblxuICBwdWJsaWMgZHJhZ2dpbmcgPSBmYWxzZVxuICBwdWJsaWMgc2V0RHJhZ2dpbmdGYWxzZVRpbWVvdXQ6IGFueSA9IG51bGxcbiAgcHVibGljIGNvbnRpbnVlQW5pbWF0aW9uID0gZmFsc2VcbiAgcHVibGljIGRyYWdTdGFydERlZ3IgPSAwXG5cbiAgQFZpZXdDaGlsZCgnY29udGFpbmVyJywgeyBzdGF0aWM6IHRydWUgfSkgY29udGFpbmVyUmVmITogRWxlbWVudFJlZlxuICBjb250YWluZXIhOiBIVE1MRGl2RWxlbWVudFxuXG4gIHB1YmxpYyBfdmFsdWUgPSAwXG4gIEBPdXRwdXQoKSB2YWx1ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpXG4gIEBPdXRwdXQoKSB1c2VyQ2hhbmdlZFZhbHVlID0gbmV3IEV2ZW50RW1pdHRlcjxLbm9iVmFsdWVDaGFuZ2VkRXZlbnQ+KClcbiAgQElucHV0KClcbiAgc2V0IHZhbHVlIChuZXdWYWx1ZTogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuX3ZhbHVlID09PSBuZXdWYWx1ZSB8fCB0eXBlb2YgbmV3VmFsdWUgIT09ICdudW1iZXInKSByZXR1cm5cbiAgICBsZXQgdmFsdWUgPSBuZXdWYWx1ZVxuICAgIGlmICh0aGlzLnN0aWNrVG9NaWRkbGUpIHtcbiAgICAgIGxldCBkaWZmRnJvbU1pZGRsZSA9IHRoaXMubWlkZGxlVmFsdWUgLSB2YWx1ZVxuICAgICAgaWYgKGRpZmZGcm9tTWlkZGxlIDwgMCkge1xuICAgICAgICBkaWZmRnJvbU1pZGRsZSAqPSAtMVxuICAgICAgfVxuICAgICAgY29uc3QgcGVyY0Zyb21NaWRkbGUgPSB0aGlzLnV0aWxzLm1hcFZhbHVlKGRpZmZGcm9tTWlkZGxlLCAwLCB0aGlzLm1heCAtIHRoaXMubWlkZGxlVmFsdWUsIDAsIDEwMClcbiAgICAgIGlmICgodGhpcy5fdmFsdWUpLnRvRml4ZWQoMSkgPT09ICh0aGlzLm1pZGRsZVZhbHVlKS50b0ZpeGVkKDEpICYmIHBlcmNGcm9tTWlkZGxlIDwgMikge1xuICAgICAgICB2YWx1ZSA9IHRoaXMubWlkZGxlVmFsdWVcbiAgICAgIH0gZWxzZSBpZiAoKHRoaXMuX3ZhbHVlIDwgdGhpcy5taWRkbGVWYWx1ZSAmJiBuZXdWYWx1ZSA+IHRoaXMuX3ZhbHVlKSB8fCAodGhpcy5fdmFsdWUgPiB0aGlzLm1pZGRsZVZhbHVlICYmIG5ld1ZhbHVlIDwgdGhpcy5fdmFsdWUpKSB7XG4gICAgICAgIGlmIChwZXJjRnJvbU1pZGRsZSA8IDUpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMubWlkZGxlVmFsdWVcbiAgICAgICAgICB0aGlzLnN0aWNrZWRUb01pZGRsZS5lbWl0KHRoaXMuY29udGludWVBbmltYXRpb24pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5fdmFsdWUgPSB0aGlzLmNsYW1wVmFsdWUodmFsdWUpXG4gICAgdGhpcy52YWx1ZUNoYW5nZS5lbWl0KHRoaXMuX3ZhbHVlKVxuICB9XG5cbiAgZ2V0IHZhbHVlICgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVcbiAgfVxuXG4gIG1pZGRsZVZhbHVlOiBudW1iZXIgPSB0aGlzLmNhbGN1bGF0ZU1pZGRsZVZhbHVlKClcbiAgcHVibGljIGNhbGN1bGF0ZU1pZGRsZVZhbHVlICgpIHtcbiAgICB0aGlzLm1pZGRsZVZhbHVlID0gKHRoaXMubWluICsgdGhpcy5tYXgpIC8gMlxuICAgIHJldHVybiB0aGlzLm1pZGRsZVZhbHVlXG4gIH1cblxuICBjb25zdHJ1Y3RvciAocHVibGljIHV0aWxzOiBVdGlsaXRpZXNTZXJ2aWNlKSB7fVxuXG4gIGFzeW5jIG5nT25Jbml0ICgpIHtcbiAgICB0aGlzLmNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyUmVmLm5hdGl2ZUVsZW1lbnRcbiAgfVxuXG4gIG1vdXNlV2hlZWwgKGV2ZW50OiBXaGVlbEV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLmNvbnRpbnVlQW5pbWF0aW9uID0gZmFsc2VcbiAgICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy52YWx1ZVxuICAgICAgdGhpcy52YWx1ZSArPSAtZXZlbnQuZGVsdGFZIC8gKDEwMDAgLyB0aGlzLm1heClcbiAgICAgIGNvbnN0IG5ld1ZhbHVlID0gdGhpcy52YWx1ZVxuICAgICAgaWYgKG9sZFZhbHVlICE9PSBuZXdWYWx1ZSkgdGhpcy51c2VyQ2hhbmdlZFZhbHVlLmVtaXQoeyB2YWx1ZTogdGhpcy52YWx1ZSB9KVxuICAgIH1cbiAgfVxuXG4gIG1vdXNlZG93biAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuY29udGludWVBbmltYXRpb24gPSBmYWxzZVxuICAgICAgdGhpcy5kcmFnU3RhcnREZWdyID0gdGhpcy5nZXREZWdyZWVzRnJvbUV2ZW50KGV2ZW50KVxuICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWVcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWxlYXZlJylcbiAgb25Nb3VzZUxlYXZlICgpOiB2b2lkIHtcbiAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2dlc3R1cmVjaGFuZ2UnLCBbICckZXZlbnQnIF0pXG4gIG9uR2VzdHVyZUNoYW5nZSAoZXZlbnQ6IGFueSkge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5jb250aW51ZUFuaW1hdGlvbiA9IGZhbHNlXG4gICAgICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy52YWx1ZVxuICAgICAgICB0aGlzLnZhbHVlICs9IGV2ZW50LnJvdGF0aW9uIC8gKDUwMDAgLyB0aGlzLm1heClcbiAgICAgICAgY29uc3QgbmV3VmFsdWUgPSB0aGlzLnZhbHVlXG4gICAgICAgIGlmIChvbGRWYWx1ZSAhPT0gbmV3VmFsdWUpIHRoaXMudXNlckNoYW5nZWRWYWx1ZS5lbWl0KHsgdmFsdWU6IHRoaXMudmFsdWUgfSlcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycilcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBtb3VzZW1vdmUgKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICBpZiAodGhpcy5zZXREcmFnZ2luZ0ZhbHNlVGltZW91dCkge1xuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuc2V0RHJhZ2dpbmdGYWxzZVRpbWVvdXQpXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5kcmFnZ2luZykge1xuICAgICAgICB0aGlzLmNvbnRpbnVlQW5pbWF0aW9uID0gZmFsc2VcbiAgICAgICAgY29uc3QgZGlzdGFuY2VGcm9tQ2VudGVyID0gdGhpcy5nZXREaXN0YW5jZUZyb21DZW50ZXJPZkVsZW1lbnRBbmRFdmVudChldmVudClcbiAgICAgICAgY29uc3QgdW5hZmZlY3RlZFJhZGl1cyA9ICh0aGlzLmNvbnRhaW5lci5jbGllbnRXaWR0aCkgLyA3XG4gICAgICAgIGlmIChkaXN0YW5jZUZyb21DZW50ZXIgPCB1bmFmZmVjdGVkUmFkaXVzKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGVncmVlcyA9IHRoaXMuZ2V0RGVncmVlc0Zyb21FdmVudChldmVudClcbiAgICAgICAgaWYgKCh0aGlzLmRyYWdTdGFydERlZ3IgPCAwICYmIGRlZ3JlZXMgPiAwKSB8fCAodGhpcy5kcmFnU3RhcnREZWdyID4gMCAmJiBkZWdyZWVzIDwgMCkpIHtcbiAgICAgICAgICB0aGlzLmRyYWdTdGFydERlZ3IgPSBkZWdyZWVzXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGVncmVlRGlmZiA9IHRoaXMuZHJhZ1N0YXJ0RGVnciAtIGRlZ3JlZXNcbiAgICAgICAgdGhpcy5kcmFnU3RhcnREZWdyID0gZGVncmVlc1xuICAgICAgICBjb25zdCBtdWx0aXBsaWVyID0gKCgpID0+IHtcbiAgICAgICAgICBzd2l0Y2ggKHRoaXMuc2l6ZSkge1xuICAgICAgICAgICAgY2FzZSAnbGFyZ2UnOiByZXR1cm4gMjUwXG4gICAgICAgICAgICBjYXNlICdtZWRpdW0nOiByZXR1cm4gMjIwXG4gICAgICAgICAgICBjYXNlICdzbWFsbCc6IHJldHVybiA2MDBcbiAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiAyMjBcbiAgICAgICAgICB9XG4gICAgICAgIH0pKClcbiAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLnZhbHVlXG4gICAgICAgIHRoaXMudmFsdWUgKz0gZGVncmVlRGlmZiAvIChtdWx0aXBsaWVyIC8gdGhpcy5tYXgpXG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gdGhpcy52YWx1ZVxuICAgICAgICBpZiAob2xkVmFsdWUgIT09IG5ld1ZhbHVlKSB0aGlzLnVzZXJDaGFuZ2VkVmFsdWUuZW1pdCh7IHZhbHVlOiB0aGlzLnZhbHVlIH0pXG4gICAgICB9XG4gICAgICB0aGlzLnNldERyYWdnaW5nRmFsc2VUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxuICAgICAgfSwgMTAwMClcbiAgICB9XG4gIH1cblxuICBtb3VzZXVwIChldmVudDogTW91c2VFdmVudCkge1xuICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxuICB9XG5cbiAgZG91YmxlY2xpY2sgKCkge1xuICAgIGlmICh0aGlzLmRvdWJsZUNsaWNrVG9BbmltYXRlVG9NaWRkbGUgJiYgIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuYW5pbWF0aW5nVG9NaWRkbGUuZW1pdCgpXG4gICAgICB0aGlzLnVzZXJDaGFuZ2VkVmFsdWUuZW1pdCh7IHZhbHVlOiB0aGlzLm1pZGRsZVZhbHVlLCB0cmFuc2l0aW9uOiB0cnVlIH0pXG4gICAgICB0aGlzLmFuaW1hdGVLbm9iKHRoaXMuX3ZhbHVlLCB0aGlzLm1pZGRsZVZhbHVlKVxuICAgIH1cbiAgfVxuXG4gIGxhcmdlQ2FwTWF4QW5nbGUgPSAxMzVcbiAgZ2V0IGxhcmdlQ2FwQ2xpcFBhdGhTdHlsZSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRyYW5zZm9ybTogYHJvdGF0ZSgke3RoaXMudXRpbHMubWFwVmFsdWUodGhpcy52YWx1ZSwgdGhpcy5taW4sIHRoaXMubWF4LCAtdGhpcy5sYXJnZUNhcE1heEFuZ2xlLCB0aGlzLmxhcmdlQ2FwTWF4QW5nbGUpfWRlZylgLFxuICAgICAgJ3RyYW5zZm9ybS1vcmlnaW4nOiAnNTAlIDUwJSdcbiAgICB9XG4gIH1cblxuICBnZXQgbGFyZ2VDYXBJbmRpY2F0b3JTdHlsZSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgtNTAlLCAtNTAlKSByb3RhdGUoJHt0aGlzLnV0aWxzLm1hcFZhbHVlKHRoaXMudmFsdWUsIHRoaXMubWluLCB0aGlzLm1heCwgLXRoaXMubGFyZ2VDYXBNYXhBbmdsZSwgdGhpcy5sYXJnZUNhcE1heEFuZ2xlKX1kZWcpYFxuICAgIH1cbiAgfVxuXG4gIGdldCBsYXJnZUNhcEJvZHlTdHlsZSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8vICdjbGlwLXBhdGgnOiBgdXJsKCNsYXJnZS1rbm9iLWNhcC1jbGlwLXBhdGgtJHt0aGlzLmlkfSlgLFxuICAgICAgLy8gJy13ZWJraXQtY2xpcC1wYXRoJzogYHVybCgjbGFyZ2Uta25vYi1jYXAtY2xpcC1wYXRoLSR7dGhpcy5pZH0pYFxuICAgIH1cbiAgfVxuXG4gIG1lZGl1bUNhcE1heEFuZ2xlID0gMTM1XG4gIGdldCBtZWRpdW1DYXBJbmRpY2F0b3JTdHlsZSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgtNTAlLCAtNTAlKSByb3RhdGUoJHt0aGlzLnV0aWxzLm1hcFZhbHVlKHRoaXMudmFsdWUsIHRoaXMubWluLCB0aGlzLm1heCwgLXRoaXMubWVkaXVtQ2FwTWF4QW5nbGUsIHRoaXMubWVkaXVtQ2FwTWF4QW5nbGUpfWRlZylgXG4gICAgfVxuICB9XG5cbiAgc21hbGxDYXBNYXhBbmdsZSA9IDEzNVxuICBnZXQgc21hbGxDYXBJbmRpY2F0b3JTdHlsZSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgtNTAlLCAtNTAlKSByb3RhdGUoJHt0aGlzLnV0aWxzLm1hcFZhbHVlKHRoaXMudmFsdWUsIHRoaXMubWluLCB0aGlzLm1heCwgLXRoaXMuc21hbGxDYXBNYXhBbmdsZSwgdGhpcy5zbWFsbENhcE1heEFuZ2xlKX1kZWcpYFxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGFuaW1hdGVLbm9iIChmcm9tOiBudW1iZXIsIHRvOiBudW1iZXIpIHtcbiAgICBmcm9tID0gdGhpcy5jbGFtcFZhbHVlKGZyb20pXG4gICAgdG8gPSB0aGlzLmNsYW1wVmFsdWUodG8pXG4gICAgY29uc3QgZGlmZiA9IHRvIC0gZnJvbVxuXG4gICAgY29uc3QgZGVsYXkgPSAxMDAwIC8gdGhpcy5hbmltYXRpb25GcHNcbiAgICBjb25zdCBmcmFtZXMgPSB0aGlzLmFuaW1hdGlvbkZwcyAqICh0aGlzLmFuaW1hdGlvbkR1cmF0aW9uIC8gMTAwMClcbiAgICBjb25zdCBzdGVwID0gZGlmZiAvIGZyYW1lc1xuICAgIHRoaXMuY29udGludWVBbmltYXRpb24gPSB0cnVlXG4gICAgbGV0IHZhbHVlID0gZnJvbVxuICAgIGZvciAobGV0IGZyYW1lID0gMDsgZnJhbWUgPCBmcmFtZXM7IGZyYW1lKyspIHtcbiAgICAgIGlmICh0aGlzLmNvbnRpbnVlQW5pbWF0aW9uKSB7XG4gICAgICAgIGF3YWl0IHRoaXMudXRpbHMuZGVsYXkoZGVsYXkpXG4gICAgICAgIHZhbHVlICs9IHN0ZXBcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmNvbnRpbnVlQW5pbWF0aW9uID0gZmFsc2VcbiAgfVxuXG4gIHB1YmxpYyBnZXREZWdyZWVzRnJvbUV2ZW50IChldmVudDogTW91c2VFdmVudCkge1xuICAgIGNvbnN0IGNvb3JkcyA9IHRoaXMudXRpbHMuZ2V0Q29vcmRpbmF0ZXNJbnNpZGVFbGVtZW50RnJvbUV2ZW50KGV2ZW50LCB0aGlzLmNvbnRhaW5lcilcbiAgICBjb25zdCBrbm9iQ2VudGVyWCA9ICh0aGlzLmNvbnRhaW5lci5jbGllbnRXaWR0aCkgLyAyXG4gICAgY29uc3Qga25vYkNlbnRlclkgPSAodGhpcy5jb250YWluZXIuY2xpZW50SGVpZ2h0KSAvIDJcbiAgICBjb25zdCByYWRzID0gTWF0aC5hdGFuMihjb29yZHMueCAtIGtub2JDZW50ZXJYLCBjb29yZHMueSAtIGtub2JDZW50ZXJZKVxuICAgIHJldHVybiByYWRzICogMTAwXG4gIH1cblxuICBwdWJsaWMgZ2V0RGlzdGFuY2VGcm9tQ2VudGVyT2ZFbGVtZW50QW5kRXZlbnQgKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgY29uc3QgY29vcmRzID0gdGhpcy51dGlscy5nZXRDb29yZGluYXRlc0luc2lkZUVsZW1lbnRGcm9tRXZlbnQoZXZlbnQsIHRoaXMuY29udGFpbmVyKVxuICAgIGNvbnN0IGtub2JDZW50ZXJYID0gKHRoaXMuY29udGFpbmVyLmNsaWVudFdpZHRoKSAvIDJcbiAgICBjb25zdCBrbm9iQ2VudGVyWSA9ICh0aGlzLmNvbnRhaW5lci5jbGllbnRIZWlnaHQpIC8gMlxuICAgIGNvbnN0IHcgPSBjb29yZHMueCAtIGtub2JDZW50ZXJYXG4gICAgY29uc3QgaCA9IGNvb3Jkcy55IC0ga25vYkNlbnRlcllcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHcgKiB3ICsgaCAqIGgpXG4gIH1cblxuICBwdWJsaWMgY2xhbXBWYWx1ZSAodmFsdWU6IG51bWJlcikge1xuICAgIGlmICh2YWx1ZSA+IHRoaXMubWF4KSB7XG4gICAgICB2YWx1ZSA9IHRoaXMubWF4XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlIDwgdGhpcy5taW4pIHtcbiAgICAgIHZhbHVlID0gdGhpcy5taW5cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWVcbiAgfVxufVxuIiwiPGRpdiAjY29udGFpbmVyIGNsYXNzPVwiY29udGFpbmVyXCIgbW91c2VXaGVlbCAobW91c2VXaGVlbCk9XCJtb3VzZVdoZWVsKCRldmVudClcIiAoZGJsY2xpY2spPVwiZG91YmxlY2xpY2soKVwiXG4gIChtb3VzZWRvd24pPVwibW91c2Vkb3duKCRldmVudClcIiAobW91c2Vtb3ZlKT1cIm1vdXNlbW92ZSgkZXZlbnQpXCIgKG1vdXNldXApPVwibW91c2V1cCgkZXZlbnQpXCI+XG5cbiAgPCEtLSBMYXJnZSAtLT5cbiAgPGRpdiAqbmdJZj1cInNpemUgPT09ICdsYXJnZSdcIiBjbGFzcz1cImtub2IgbGFyZ2VcIj5cbiAgICA8c3ZnIGNsYXNzPVwic2NhbGVcIiB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiXG4gICAgICB4PVwiMHB4XCIgeT1cIjBweFwiIHdpZHRoPVwiMTc1LjgycHhcIiBoZWlnaHQ9XCIxNDQuOTRweFwiIHZpZXdCb3g9XCIwIDAgMTc1LjgyIDE0NC45NFwiXG4gICAgICBzdHlsZT1cImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTc1LjgyIDE0NC45NDtcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPlxuICAgICAgPGRlZnM+XG4gICAgICA8L2RlZnM+XG4gICAgICA8Zz5cbiAgICAgICAgPHBhdGggZD1cIk0xNzQuMjksMTA0LjAzbC0yLjEzLTAuNTdjMC45NS01LjEsMS40Ny0xMC4zNSwxLjQ3LTE1LjcyYzAtNS4zNy0wLjUyLTEwLjYyLTEuNDctMTUuNzJsMi4xMy0wLjU3XG4gYzAuOTksNS4yOCwxLjU0LDEwLjcyLDEuNTQsMTYuMjlDMTc1LjgyLDkzLjMxLDE3NS4yOCw5OC43NSwxNzQuMjksMTA0LjAzeiBNMTUyLjk5LDE0My4zOGM2LjgyLTcuOTQsMTIuMjItMTcuMTQsMTUuNzctMjcuMjFcbiBsMi4xMywwLjU3Yy0zLjY2LDEwLjQ0LTkuMjYsMTkuOTgtMTYuMzQsMjguMTlMMTUyLjk5LDE0My4zOHogTTE1Mi45NywzMi4xMmwxLjU2LTEuNTZjNy4wOSw4LjIyLDEyLjcsMTcuNzMsMTYuMzYsMjguMThcbiBsLTIuMTMsMC41N0MxNjUuMiw0OS4yNCwxNTkuNzksNDAuMDYsMTUyLjk3LDMyLjEyeiBNMTE2LjQsNy4wNWwwLjU3LTIuMTNjMTAuNDYsMy42NiwyMCw5LjI2LDI4LjIzLDE2LjMzbC0xLjU2LDEuNTVcbiBDMTM1LjY5LDE2LDEyNi40OSwxMC42LDExNi40LDcuMDV6IE04Ny45MSwyLjE5Yy01LjM4LDAtMTAuNjUsMC41LTE1Ljc1LDEuNDVsLTAuNTctMi4xMkM3Ni44OCwwLjUyLDgyLjMzLDAsODcuOTEsMFxuIHMxMS4wMywwLjUzLDE2LjMyLDEuNTNsLTAuNTcsMi4xM0M5OC41NiwyLjcsOTMuMjksMi4xOSw4Ny45MSwyLjE5eiBNMzAuNiwyMS4yNEMzOC44MywxNC4xNiw0OC40LDguNiw1OC44Niw0Ljk0bDAuNTcsMi4xMlxuIGMtMTAuMDgsMy41NS0xOS4zMSw4LjkyLTI3LjI3LDE1LjczTDMwLjYsMjEuMjR6IE00Ljk0LDExNi43NGwyLjEzLTAuNTdjMy41NSwxMC4wNyw4Ljk3LDE5LjI1LDE1Ljc5LDI3LjE5bC0xLjU2LDEuNTVcbiBDMTQuMjEsMTM2LjcxLDguNiwxMjcuMTksNC45NCwxMTYuNzR6IE00Ljk0LDU4Ljc0QzguNiw0OC4zLDE0LjIsMzguNzYsMjEuMjgsMzAuNTVsMS41NiwxLjU2Yy02LjgyLDcuOTQtMTIuMjIsMTcuMTQtMTUuNzcsMjcuMjFcbiBMNC45NCw1OC43NHogTTMuNjcsMTAzLjQ2bC0yLjEzLDAuNTdDMC41NCw5OC43NSwwLDkzLjMxLDAsODcuNzRjMC01LjU3LDAuNTQtMTEuMDEsMS41NC0xNi4yOWwyLjEzLDAuNTdcbiBDMi43Miw3Ny4xMiwyLjIsODIuMzcsMi4yLDg3Ljc0QzIuMiw5My4xMSwyLjcyLDk4LjM2LDMuNjcsMTAzLjQ2elwiIC8+XG4gICAgICA8L2c+XG4gICAgPC9zdmc+XG5cbiAgICA8ZGl2IGNsYXNzPVwic2xvdFwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJib2R5XCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImNhcFwiPlxuICAgICAgPGRpdiBjbGFzcz1cImNhcC1ib2R5XCIgW25nU3R5bGVdPVwibGFyZ2VDYXBCb2R5U3R5bGVcIj48L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJpbmRpY2F0b3JcIiBbbmdTdHlsZV09XCJsYXJnZUNhcEluZGljYXRvclN0eWxlXCI+XG4gICAgICAgIDxzdmcgY2xhc3M9XCJpbm5lci1saW5lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIlxuICAgICAgICAgIHk9XCIwcHhcIiB3aWR0aD1cIjQwcHhcIiBoZWlnaHQ9XCI0MHB4XCIgdmlld0JveD1cIjAgMCA0MCA0MFwiIHN0eWxlPVwiZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MCA0MDtcIlxuICAgICAgICAgIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+XG5cbiAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgZD1cIk0yMC4wMDAsNDAuMDAwIEM4Ljk1NCw0MC4wMDAgLTAuMDAwLDMxLjA0NiAtMC4wMDAsMjAuMDAwIEMtMC4wMDAsMTAuMzI0IDYuODcxLDIuMjU1IDE2LjAwMCwwLjQwMiBMMTYuMDAwLDEuNDMwIEM3LjQyOSwzLjI2OCAxLjAwMCwxMC44ODAgMS4wMDAsMjAuMDAwIEMxLjAwMCwzMC40OTMgOS41MDcsMzkuMDAwIDIwLjAwMCwzOS4wMDAgQzMwLjQ5MywzOS4wMDAgMzkuMDAwLDMwLjQ5MyAzOS4wMDAsMjAuMDAwIEMzOS4wMDAsMTAuODgwIDMyLjU3MSwzLjI2OCAyNC4wMDAsMS40MzAgTDI0LjAwMCwwLjQwMiBDMzMuMTI5LDIuMjU1IDQwLjAwMCwxMC4zMjQgNDAuMDAwLDIwLjAwMCBDNDAuMDAwLDMxLjA0NiAzMS4wNDYsNDAuMDAwIDIwLjAwMCw0MC4wMDAgWlwiIC8+XG4gICAgICAgIDwvc3ZnPlxuICAgICAgICA8ZGl2IGNsYXNzPVwicG9pbnRlclwiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuXG4gIDwhLS0gTWVkaXVtIC0tPlxuICA8ZGl2ICpuZ0lmPVwic2l6ZSA9PT0gJ21lZGl1bSdcIiBjbGFzcz1cImtub2IgbWVkaXVtXCI+XG4gICAgPHN2ZyBjbGFzcz1cInNjYWxlXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiPlxuICAgICAgPGc+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZD1cIk01NC4yODQsNTEuNDU1IEw1MS40NDQsNDguNjA0IEM1NS41MjAsNDMuODc1IDU4LjAwMCwzNy43MzIgNTguMDAwLDMxLjAwMCBDNTguMDAwLDI0LjU2MyA1NS43MzksMTguNjU5IDUxLjk4MCwxNC4wMjAgTDUyLjAwMCwxNC4wMDAgTDUxLjg2MSwxMy44NjEgQzQ2LjkwOSw3Ljg0MSAzOS40MDQsNC4wMDAgMzEuMDAwLDQuMDAwIEMxNi4wODgsNC4wMDAgNC4wMDAsMTYuMDg4IDQuMDAwLDMxLjAwMCBDNC4wMDAsMzcuNzUxIDYuNDk0LDQzLjkwNyAxMC41ODksNDguNjQxIEw3LjcxNyw1MS40NTYgQzIuOTE3LDQ1Ljk5NiAtMC4wMDAsMzguODQxIC0wLjAwMCwzMS4wMDAgQy0wLjAwMCwxMy44NzkgMTMuODc5LC0wLjAwMCAzMS4wMDAsLTAuMDAwIEM0OC4xMjEsLTAuMDAwIDYyLjAwMCwxMy44NzkgNjIuMDAwLDMxLjAwMCBDNjIuMDAwLDM4Ljg0MCA1OS4wODMsNDUuOTk2IDU0LjI4NCw1MS40NTUgWk05LjA4MCw1Mi45MjEgQzkuMDgwLDUyLjkyMCA5LjA4MCw1Mi45MjAgOS4wNzksNTIuOTIwIEw5LjA4MCw1Mi45MjEgWk0xMy40MzMsNTEuNDc4IEMxOC4xNTcsNTUuNTM0IDI0LjI4NSw1OC4wMDAgMzEuMDAwLDU4LjAwMCBDMzcuNzMyLDU4LjAwMCA0My44NzUsNTUuNTIwIDQ4LjYwNCw1MS40NDQgTDUxLjQ1NSw1NC4yODQgQzQ1Ljk5Niw1OS4wODMgMzguODQwLDYyLjAwMCAzMS4wMDAsNjIuMDAwIEMyMy4xNjAsNjIuMDAwIDE2LjAwNSw1OS4wODQgMTAuNTQ2LDU0LjI4NCBMMTMuNDMzLDUxLjQ3OCBaXCIgLz5cbiAgICAgIDwvZz5cbiAgICA8L3N2Zz5cbiAgICA8ZGl2IGNsYXNzPVwic2xvdFwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJib2R5XCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImNhcFwiIFtuZ1N0eWxlXT1cIm1lZGl1bUNhcEluZGljYXRvclN0eWxlXCI+XG4gICAgICA8c3ZnIHdpZHRoPVwiMzhweFwiIGhlaWdodD1cIjM4cHhcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCI+XG4gICAgICAgIDxnPlxuICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICBkPVwiTTE5LjAwMCwzOC4wMDAgQzguNTA3LDM4LjAwMCAtMC4wMDAsMjkuNDkzIC0wLjAwMCwxOS4wMDAgQy0wLjAwMCw4Ljg0NCA3Ljk3NCwwLjU3NCAxOC4wMDAsMC4wNTAgTDE4LjAwMCwxMy4wMDAgQzE4LjAwMCwxMy41NTIgMTguNDQ4LDE0LjAwMCAxOS4wMDAsMTQuMDAwIEMxOS41NTIsMTQuMDAwIDIwLjAwMCwxMy41NTIgMjAuMDAwLDEzLjAwMCBMMjAuMDAwLDAuMDUwIEMzMC4wMjYsMC41NzQgMzguMDAwLDguODQ0IDM4LjAwMCwxOS4wMDAgQzM4LjAwMCwyOS40OTMgMjkuNDkzLDM4LjAwMCAxOS4wMDAsMzguMDAwIFpcIiAvPlxuICAgICAgICA8L2c+XG4gICAgICA8L3N2Zz5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5cbiAgPCEtLSBTbWFsbCAtLT5cbiAgPGRpdiAqbmdJZj1cInNpemUgPT09ICdzbWFsbCdcIiBjbGFzcz1cImtub2Igc21hbGxcIj5cbiAgICA8c3ZnIGNsYXNzPVwic2NhbGVcIiB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiXG4gICAgICB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPlxuICAgICAgPGc+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZD1cIk0zMy40NiwzMmwtMC4wNC0wLjA0QzM2LjI2LDI4Ljc4LDM4LDI0LjYsMzgsMjBjMC05Ljk0LTguMDYtMTgtMTgtMThTMiwxMC4wNiwyLDIwYzAsNC42MiwxLjc1LDguODEsNC42MSwxMmwtMC4yOCwwLjI2XG4gICAgICBMNiwzMi42MWwtMC44MSwwLjhDMS45OCwyOS44NiwwLDI1LjE3LDAsMjBDMCw4Ljk1LDguOTUsMCwyMCwwczIwLDguOTUsMjAsMjBjMCw1LjE2LTEuOTcsOS44NC01LjE4LDEzLjM5TDM0LDMyLjU1XCIgLz5cbiAgICAgIDwvZz5cbiAgICA8L3N2Zz5cbiAgICA8ZGl2IGNsYXNzPVwic2xvdFwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJib2R5XCI+PC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwiY2FwXCIgW25nU3R5bGVdPVwic21hbGxDYXBJbmRpY2F0b3JTdHlsZVwiPlxuICAgICAgPHN2ZyB3aWR0aD1cIjI0cHhcIiBoZWlnaHQ9XCIyNHB4XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiPlxuICAgICAgICA8Zz5cbiAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgZD1cIk0xMi4wMDAsMjQuMDAwIEM1LjM3MywyNC4wMDAgLTAuMDAwLDE4LjYyNyAtMC4wMDAsMTIuMDAwIEMtMC4wMDAsNS43MTAgNC44NDIsMC41NjAgMTEuMDAwLDAuMDUwIEwxMS4wMDAsNi4wMDAgQzExLjAwMCw2LjU1MiAxMS40NDgsNy4wMDAgMTIuMDAwLDcuMDAwIEMxMi41NTIsNy4wMDAgMTMuMDAwLDYuNTUyIDEzLjAwMCw2LjAwMCBMMTMuMDAwLDAuMDUwIEMxOS4xNTgsMC41NjAgMjQuMDAwLDUuNzEwIDI0LjAwMCwxMi4wMDAgQzI0LjAwMCwxOC42MjcgMTguNjI3LDI0LjAwMCAxMi4wMDAsMjQuMDAwIFpcIiAvPlxuICAgICAgICA8L2c+XG4gICAgICA8L3N2Zz5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L2Rpdj4iXX0=
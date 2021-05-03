import { __awaiter } from "tslib";
import { Component, Input, Output, EventEmitter, ViewChild, HostListener, HostBinding } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';
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
KnobComponent.decorators = [
    { type: Component, args: [{
                selector: 'eqm-knob',
                template: "<div #container class=\"container\" mouseWheel (mouseWheel)=\"mouseWheel($event)\" (dblclick)=\"doubleclick()\"\n  (mousedown)=\"mousedown($event)\" (mousemove)=\"mousemove($event)\" (mouseup)=\"mouseup($event)\">\n\n  <!-- Large -->\n  <div *ngIf=\"size === 'large'\" class=\"knob large\">\n    <svg class=\"scale\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n      x=\"0px\" y=\"0px\" width=\"175.82px\" height=\"144.94px\" viewBox=\"0 0 175.82 144.94\"\n      style=\"enable-background:new 0 0 175.82 144.94;\" xml:space=\"preserve\">\n      <defs>\n      </defs>\n      <g>\n        <path d=\"M174.29,104.03l-2.13-0.57c0.95-5.1,1.47-10.35,1.47-15.72c0-5.37-0.52-10.62-1.47-15.72l2.13-0.57\n c0.99,5.28,1.54,10.72,1.54,16.29C175.82,93.31,175.28,98.75,174.29,104.03z M152.99,143.38c6.82-7.94,12.22-17.14,15.77-27.21\n l2.13,0.57c-3.66,10.44-9.26,19.98-16.34,28.19L152.99,143.38z M152.97,32.12l1.56-1.56c7.09,8.22,12.7,17.73,16.36,28.18\n l-2.13,0.57C165.2,49.24,159.79,40.06,152.97,32.12z M116.4,7.05l0.57-2.13c10.46,3.66,20,9.26,28.23,16.33l-1.56,1.55\n C135.69,16,126.49,10.6,116.4,7.05z M87.91,2.19c-5.38,0-10.65,0.5-15.75,1.45l-0.57-2.12C76.88,0.52,82.33,0,87.91,0\n s11.03,0.53,16.32,1.53l-0.57,2.13C98.56,2.7,93.29,2.19,87.91,2.19z M30.6,21.24C38.83,14.16,48.4,8.6,58.86,4.94l0.57,2.12\n c-10.08,3.55-19.31,8.92-27.27,15.73L30.6,21.24z M4.94,116.74l2.13-0.57c3.55,10.07,8.97,19.25,15.79,27.19l-1.56,1.55\n C14.21,136.71,8.6,127.19,4.94,116.74z M4.94,58.74C8.6,48.3,14.2,38.76,21.28,30.55l1.56,1.56c-6.82,7.94-12.22,17.14-15.77,27.21\n L4.94,58.74z M3.67,103.46l-2.13,0.57C0.54,98.75,0,93.31,0,87.74c0-5.57,0.54-11.01,1.54-16.29l2.13,0.57\n C2.72,77.12,2.2,82.37,2.2,87.74C2.2,93.11,2.72,98.36,3.67,103.46z\" />\n      </g>\n    </svg>\n\n    <div class=\"slot\"></div>\n    <div class=\"body\"></div>\n    <div class=\"cap\">\n      <div class=\"cap-body\" [ngStyle]=\"largeCapBodyStyle\"></div>\n      <div class=\"indicator\" [ngStyle]=\"largeCapIndicatorStyle\">\n        <svg class=\"inner-line\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\"\n          y=\"0px\" width=\"40px\" height=\"40px\" viewBox=\"0 0 40 40\" style=\"enable-background:new 0 0 40 40;\"\n          xml:space=\"preserve\">\n\n          <path\n            d=\"M20.000,40.000 C8.954,40.000 -0.000,31.046 -0.000,20.000 C-0.000,10.324 6.871,2.255 16.000,0.402 L16.000,1.430 C7.429,3.268 1.000,10.880 1.000,20.000 C1.000,30.493 9.507,39.000 20.000,39.000 C30.493,39.000 39.000,30.493 39.000,20.000 C39.000,10.880 32.571,3.268 24.000,1.430 L24.000,0.402 C33.129,2.255 40.000,10.324 40.000,20.000 C40.000,31.046 31.046,40.000 20.000,40.000 Z\" />\n        </svg>\n        <div class=\"pointer\"></div>\n      </div>\n    </div>\n  </div>\n\n  <!-- Medium -->\n  <div *ngIf=\"size === 'medium'\" class=\"knob medium\">\n    <svg class=\"scale\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n      <g>\n        <path\n          d=\"M54.284,51.455 L51.444,48.604 C55.520,43.875 58.000,37.732 58.000,31.000 C58.000,24.563 55.739,18.659 51.980,14.020 L52.000,14.000 L51.861,13.861 C46.909,7.841 39.404,4.000 31.000,4.000 C16.088,4.000 4.000,16.088 4.000,31.000 C4.000,37.751 6.494,43.907 10.589,48.641 L7.717,51.456 C2.917,45.996 -0.000,38.841 -0.000,31.000 C-0.000,13.879 13.879,-0.000 31.000,-0.000 C48.121,-0.000 62.000,13.879 62.000,31.000 C62.000,38.840 59.083,45.996 54.284,51.455 ZM9.080,52.921 C9.080,52.920 9.080,52.920 9.079,52.920 L9.080,52.921 ZM13.433,51.478 C18.157,55.534 24.285,58.000 31.000,58.000 C37.732,58.000 43.875,55.520 48.604,51.444 L51.455,54.284 C45.996,59.083 38.840,62.000 31.000,62.000 C23.160,62.000 16.005,59.084 10.546,54.284 L13.433,51.478 Z\" />\n      </g>\n    </svg>\n    <div class=\"slot\"></div>\n    <div class=\"body\"></div>\n    <div class=\"cap\" [ngStyle]=\"mediumCapIndicatorStyle\">\n      <svg width=\"38px\" height=\"38px\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n        <g>\n          <path\n            d=\"M19.000,38.000 C8.507,38.000 -0.000,29.493 -0.000,19.000 C-0.000,8.844 7.974,0.574 18.000,0.050 L18.000,13.000 C18.000,13.552 18.448,14.000 19.000,14.000 C19.552,14.000 20.000,13.552 20.000,13.000 L20.000,0.050 C30.026,0.574 38.000,8.844 38.000,19.000 C38.000,29.493 29.493,38.000 19.000,38.000 Z\" />\n        </g>\n      </svg>\n    </div>\n  </div>\n\n  <!-- Small -->\n  <div *ngIf=\"size === 'small'\" class=\"knob small\">\n    <svg class=\"scale\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n      xml:space=\"preserve\">\n      <g>\n        <path\n          d=\"M33.46,32l-0.04-0.04C36.26,28.78,38,24.6,38,20c0-9.94-8.06-18-18-18S2,10.06,2,20c0,4.62,1.75,8.81,4.61,12l-0.28,0.26\n      L6,32.61l-0.81,0.8C1.98,29.86,0,25.17,0,20C0,8.95,8.95,0,20,0s20,8.95,20,20c0,5.16-1.97,9.84-5.18,13.39L34,32.55\" />\n      </g>\n    </svg>\n    <div class=\"slot\"></div>\n    <div class=\"body\"></div>\n\n    <div class=\"cap\" [ngStyle]=\"smallCapIndicatorStyle\">\n      <svg width=\"24px\" height=\"24px\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n        <g>\n          <path\n            d=\"M12.000,24.000 C5.373,24.000 -0.000,18.627 -0.000,12.000 C-0.000,5.710 4.842,0.560 11.000,0.050 L11.000,6.000 C11.000,6.552 11.448,7.000 12.000,7.000 C12.552,7.000 13.000,6.552 13.000,6.000 L13.000,0.050 C19.158,0.560 24.000,5.710 24.000,12.000 C24.000,18.627 18.627,24.000 12.000,24.000 Z\" />\n        </g>\n      </svg>\n    </div>\n  </div>\n</div>",
                styles: [":host.disabled{filter:grayscale(80%)}.container{display:inline-block}.container .knob{position:relative}.container .large{width:90px;height:90px}.container .large .scale{width:80px;height:80px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);fill:#4f8d71;top:43%}.container .large .slot{width:70px;height:70px;border-radius:50%;box-shadow:0 5px 5px rgba(0,0,0,.6666666666666666);border:2px solid #000}.container .large .body,.container .large .slot{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background-color:#46494e}.container .large .body{width:64px;height:64px;box-shadow:0 1px 5px .5px #000,0 -1px 5px .5px hsla(0,0%,100%,.6);border-radius:50%;box-shadow:0 -.5px 0 0 hsla(0,0%,100%,.2),0 -1px 5px .5px hsla(0,0%,100%,.26666666666666666),0 .5px .5px .5px #000,0 1px 5px .5px #000}.container .large .cap{filter:drop-shadow(0 -1px 0 #FFF3) drop-shadow(0 2px 5px black)}.container .large .cap,.container .large .cap .cap-body{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:58px;height:58px}.container .large .cap .cap-body{border-radius:50%;background-image:linear-gradient(180deg,#51555a,#3c4045)}.container .large .cap .indicator,.container .large .cap .indicator .inner-line{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:40px;height:40px}.container .large .cap .indicator .inner-line{fill:#232628}.container .large .cap .indicator .pointer{width:5px;height:5px;border-radius:50%;position:absolute;top:-4%;left:50%;transform:translate(-50%);background-color:#4f8d71}.container .medium{width:70px;height:70px}.container .medium .scale{width:62px;height:62px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);fill:#4f8d71}.container .medium .slot{width:48px;height:48px;background-color:#3f4346;box-shadow:0 3px 5px 2px rgba(0,0,0,.6)}.container .medium .body,.container .medium .slot{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%}.container .medium .body{width:38px;height:38px;box-shadow:0 0 2px .5px hsla(0,0%,100%,.13333333333333333);background-color:#3d4244}.container .medium .cap{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:38px;height:38px;fill:#4f8d71}.container .small{width:50px;height:50px}.container .small .scale{width:40px;height:40px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);fill:#4f8d71}.container .small .slot{width:34px;height:34px;background-color:#3f4346;box-shadow:0 2px 5px 2px rgba(0,0,0,.6)}.container .small .body,.container .small .slot{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%}.container .small .body{width:27px;height:27px;box-shadow:0 0 2px .5px hsla(0,0%,100%,.13333333333333333);background-color:#3d4244}.container .small .cap{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:24px;height:24px;fill:#4f8d71}"]
            },] }
];
KnobComponent.ctorParameters = () => [
    { type: UtilitiesService }
];
KnobComponent.propDecorators = {
    size: [{ type: Input }],
    showScale: [{ type: Input }],
    min: [{ type: Input }],
    max: [{ type: Input }],
    disabled: [{ type: HostBinding, args: ['class.disabled',] }, { type: Input }],
    doubleClickToAnimateToMiddle: [{ type: Input }],
    animationDuration: [{ type: Input }],
    animationFps: [{ type: Input }],
    animatingToMiddle: [{ type: Output }],
    stickToMiddle: [{ type: Input }],
    stickedToMiddle: [{ type: Output }],
    containerRef: [{ type: ViewChild, args: ['container', { static: true },] }],
    valueChange: [{ type: Output }],
    userChangedValue: [{ type: Output }],
    value: [{ type: Input }],
    onMouseLeave: [{ type: HostListener, args: ['mouseleave',] }],
    onGestureChange: [{ type: HostListener, args: ['gesturechange', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25vYi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL2tub2Iva25vYi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBRVQsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osU0FBUyxFQUNULFlBQVksRUFDWixXQUFXLEVBRVosTUFBTSxlQUFlLENBQUE7QUFDdEIsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sa0NBQWtDLENBQUE7QUFXbkUsTUFBTSxPQUFPLGFBQWE7SUFpRXhCLFlBQW9CLEtBQXVCO1FBQXZCLFVBQUssR0FBTCxLQUFLLENBQWtCO1FBaEVsQyxTQUFJLEdBQWlDLFFBQVEsQ0FBQTtRQUM3QyxjQUFTLEdBQUcsSUFBSSxDQUFBO1FBQ2xCLFNBQUksR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUlULFNBQUksR0FBRyxDQUFDLENBQUE7UUFJeUIsYUFBUSxHQUFHLEtBQUssQ0FBQTtRQUUvQyxpQ0FBNEIsR0FBRyxJQUFJLENBQUE7UUFDbkMsc0JBQWlCLEdBQUcsR0FBRyxDQUFBO1FBQ3ZCLGlCQUFZLEdBQUcsRUFBRSxDQUFBO1FBQ2hCLHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUE7UUFFdkMsa0JBQWEsR0FBRyxLQUFLLENBQUE7UUFDcEIsb0JBQWUsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFBO1FBRXZDLGFBQVEsR0FBRyxLQUFLLENBQUE7UUFDaEIsNEJBQXVCLEdBQVEsSUFBSSxDQUFBO1FBQ25DLHNCQUFpQixHQUFHLEtBQUssQ0FBQTtRQUN6QixrQkFBYSxHQUFHLENBQUMsQ0FBQTtRQUtqQixXQUFNLEdBQUcsQ0FBQyxDQUFBO1FBQ1AsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFBO1FBQ3hDLHFCQUFnQixHQUFHLElBQUksWUFBWSxF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QUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUNqQyxDQUFDO0lBRU0sVUFBVSxDQUFFLEtBQWE7UUFDOUIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNwQixLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQTtTQUNqQjtRQUVELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDcEIsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUE7U0FDakI7UUFFRCxPQUFPLEtBQUssQ0FBQTtJQUNkLENBQUM7OztZQXZQRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLHdpTEFBb0M7O2FBRXJDOzs7WUFWUSxnQkFBZ0I7OzttQkFZdEIsS0FBSzt3QkFDTCxLQUFLO2tCQUVMLEtBQUs7a0JBSUwsS0FBSzt1QkFHTCxXQUFXLFNBQUMsZ0JBQWdCLGNBQUcsS0FBSzsyQ0FFcEMsS0FBSztnQ0FDTCxLQUFLOzJCQUNMLEtBQUs7Z0NBQ0wsTUFBTTs0QkFFTixLQUFLOzhCQUNMLE1BQU07MkJBT04sU0FBUyxTQUFDLFdBQVcsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7MEJBSXZDLE1BQU07K0JBQ04sTUFBTTtvQkFDTixLQUFLOzJCQXlETCxZQUFZLFNBQUMsWUFBWTs4QkFLekIsWUFBWSxTQUFDLGVBQWUsRUFBRSxDQUFFLFFBQVEsQ0FBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIFZpZXdDaGlsZCxcbiAgSG9zdExpc3RlbmVyLFxuICBIb3N0QmluZGluZyxcbiAgRWxlbWVudFJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuaW1wb3J0IHsgVXRpbGl0aWVzU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3V0aWxpdGllcy5zZXJ2aWNlJ1xuXG5leHBvcnQgaW50ZXJmYWNlIEtub2JWYWx1ZUNoYW5nZWRFdmVudCB7XG4gIHZhbHVlOiBudW1iZXJcbiAgdHJhbnNpdGlvbj86IGJvb2xlYW5cbn1cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2VxbS1rbm9iJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2tub2IuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsgJy4va25vYi5jb21wb25lbnQuc2NzcycgXVxufSlcbmV4cG9ydCBjbGFzcyBLbm9iQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCkgc2l6ZTogJ2xhcmdlJyB8ICdtZWRpdW0nIHwgJ3NtYWxsJyA9ICdtZWRpdW0nXG4gIEBJbnB1dCgpIHNob3dTY2FsZSA9IHRydWVcbiAgcHVibGljIF9taW4gPSAtMVxuICBASW5wdXQoKSBzZXQgbWluIChuZXdNaW4pIHsgdGhpcy5fbWluID0gbmV3TWluOyB0aGlzLmNhbGN1bGF0ZU1pZGRsZVZhbHVlKCkgfVxuICBnZXQgbWluICgpIHsgcmV0dXJuIHRoaXMuX21pbiB9XG5cbiAgcHVibGljIF9tYXggPSAxXG4gIEBJbnB1dCgpIHNldCBtYXggKG5ld01heCkgeyB0aGlzLl9tYXggPSBuZXdNYXg7IHRoaXMuY2FsY3VsYXRlTWlkZGxlVmFsdWUoKSB9XG4gIGdldCBtYXggKCkgeyByZXR1cm4gdGhpcy5fbWF4IH1cblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmRpc2FibGVkJykgQElucHV0KCkgZGlzYWJsZWQgPSBmYWxzZVxuXG4gIEBJbnB1dCgpIGRvdWJsZUNsaWNrVG9BbmltYXRlVG9NaWRkbGUgPSB0cnVlXG4gIEBJbnB1dCgpIGFuaW1hdGlvbkR1cmF0aW9uID0gNTAwXG4gIEBJbnB1dCgpIGFuaW1hdGlvbkZwcyA9IDMwXG4gIEBPdXRwdXQoKSBhbmltYXRpbmdUb01pZGRsZSA9IG5ldyBFdmVudEVtaXR0ZXIoKVxuXG4gIEBJbnB1dCgpIHN0aWNrVG9NaWRkbGUgPSBmYWxzZVxuICBAT3V0cHV0KCkgc3RpY2tlZFRvTWlkZGxlID0gbmV3IEV2ZW50RW1pdHRlcigpXG5cbiAgcHVibGljIGRyYWdnaW5nID0gZmFsc2VcbiAgcHVibGljIHNldERyYWdnaW5nRmFsc2VUaW1lb3V0OiBhbnkgPSBudWxsXG4gIHB1YmxpYyBjb250aW51ZUFuaW1hdGlvbiA9IGZhbHNlXG4gIHB1YmxpYyBkcmFnU3RhcnREZWdyID0gMFxuXG4gIEBWaWV3Q2hpbGQoJ2NvbnRhaW5lcicsIHsgc3RhdGljOiB0cnVlIH0pIGNvbnRhaW5lclJlZiE6IEVsZW1lbnRSZWZcbiAgY29udGFpbmVyITogSFRNTERpdkVsZW1lbnRcblxuICBwdWJsaWMgX3ZhbHVlID0gMFxuICBAT3V0cHV0KCkgdmFsdWVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKVxuICBAT3V0cHV0KCkgdXNlckNoYW5nZWRWYWx1ZSA9IG5ldyBFdmVudEVtaXR0ZXI8S25vYlZhbHVlQ2hhbmdlZEV2ZW50PigpXG4gIEBJbnB1dCgpXG4gIHNldCB2YWx1ZSAobmV3VmFsdWU6IG51bWJlcikge1xuICAgIGlmICh0aGlzLl92YWx1ZSA9PT0gbmV3VmFsdWUgfHwgdHlwZW9mIG5ld1ZhbHVlICE9PSAnbnVtYmVyJykgcmV0dXJuXG4gICAgbGV0IHZhbHVlID0gbmV3VmFsdWVcbiAgICBpZiAodGhpcy5zdGlja1RvTWlkZGxlKSB7XG4gICAgICBsZXQgZGlmZkZyb21NaWRkbGUgPSB0aGlzLm1pZGRsZVZhbHVlIC0gdmFsdWVcbiAgICAgIGlmIChkaWZmRnJvbU1pZGRsZSA8IDApIHtcbiAgICAgICAgZGlmZkZyb21NaWRkbGUgKj0gLTFcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBlcmNGcm9tTWlkZGxlID0gdGhpcy51dGlscy5tYXBWYWx1ZShkaWZmRnJvbU1pZGRsZSwgMCwgdGhpcy5tYXggLSB0aGlzLm1pZGRsZVZhbHVlLCAwLCAxMDApXG4gICAgICBpZiAoKHRoaXMuX3ZhbHVlKS50b0ZpeGVkKDEpID09PSAodGhpcy5taWRkbGVWYWx1ZSkudG9GaXhlZCgxKSAmJiBwZXJjRnJvbU1pZGRsZSA8IDIpIHtcbiAgICAgICAgdmFsdWUgPSB0aGlzLm1pZGRsZVZhbHVlXG4gICAgICB9IGVsc2UgaWYgKCh0aGlzLl92YWx1ZSA8IHRoaXMubWlkZGxlVmFsdWUgJiYgbmV3VmFsdWUgPiB0aGlzLl92YWx1ZSkgfHwgKHRoaXMuX3ZhbHVlID4gdGhpcy5taWRkbGVWYWx1ZSAmJiBuZXdWYWx1ZSA8IHRoaXMuX3ZhbHVlKSkge1xuICAgICAgICBpZiAocGVyY0Zyb21NaWRkbGUgPCA1KSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLm1pZGRsZVZhbHVlXG4gICAgICAgICAgdGhpcy5zdGlja2VkVG9NaWRkbGUuZW1pdCh0aGlzLmNvbnRpbnVlQW5pbWF0aW9uKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX3ZhbHVlID0gdGhpcy5jbGFtcFZhbHVlKHZhbHVlKVxuICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh0aGlzLl92YWx1ZSlcbiAgfVxuXG4gIGdldCB2YWx1ZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlXG4gIH1cblxuICBtaWRkbGVWYWx1ZTogbnVtYmVyID0gdGhpcy5jYWxjdWxhdGVNaWRkbGVWYWx1ZSgpXG4gIHB1YmxpYyBjYWxjdWxhdGVNaWRkbGVWYWx1ZSAoKSB7XG4gICAgdGhpcy5taWRkbGVWYWx1ZSA9ICh0aGlzLm1pbiArIHRoaXMubWF4KSAvIDJcbiAgICByZXR1cm4gdGhpcy5taWRkbGVWYWx1ZVxuICB9XG5cbiAgY29uc3RydWN0b3IgKHB1YmxpYyB1dGlsczogVXRpbGl0aWVzU2VydmljZSkge31cblxuICBhc3luYyBuZ09uSW5pdCAoKSB7XG4gICAgdGhpcy5jb250YWluZXIgPSB0aGlzLmNvbnRhaW5lclJlZi5uYXRpdmVFbGVtZW50XG4gIH1cblxuICBtb3VzZVdoZWVsIChldmVudDogV2hlZWxFdmVudCkge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5jb250aW51ZUFuaW1hdGlvbiA9IGZhbHNlXG4gICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMudmFsdWVcbiAgICAgIHRoaXMudmFsdWUgKz0gLWV2ZW50LmRlbHRhWSAvICgxMDAwIC8gdGhpcy5tYXgpXG4gICAgICBjb25zdCBuZXdWYWx1ZSA9IHRoaXMudmFsdWVcbiAgICAgIGlmIChvbGRWYWx1ZSAhPT0gbmV3VmFsdWUpIHRoaXMudXNlckNoYW5nZWRWYWx1ZS5lbWl0KHsgdmFsdWU6IHRoaXMudmFsdWUgfSlcbiAgICB9XG4gIH1cblxuICBtb3VzZWRvd24gKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLmNvbnRpbnVlQW5pbWF0aW9uID0gZmFsc2VcbiAgICAgIHRoaXMuZHJhZ1N0YXJ0RGVnciA9IHRoaXMuZ2V0RGVncmVlc0Zyb21FdmVudChldmVudClcbiAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2VsZWF2ZScpXG4gIG9uTW91c2VMZWF2ZSAoKTogdm9pZCB7XG4gICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdnZXN0dXJlY2hhbmdlJywgWyAnJGV2ZW50JyBdKVxuICBvbkdlc3R1cmVDaGFuZ2UgKGV2ZW50OiBhbnkpIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuY29udGludWVBbmltYXRpb24gPSBmYWxzZVxuICAgICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMudmFsdWVcbiAgICAgICAgdGhpcy52YWx1ZSArPSBldmVudC5yb3RhdGlvbiAvICg1MDAwIC8gdGhpcy5tYXgpXG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gdGhpcy52YWx1ZVxuICAgICAgICBpZiAob2xkVmFsdWUgIT09IG5ld1ZhbHVlKSB0aGlzLnVzZXJDaGFuZ2VkVmFsdWUuZW1pdCh7IHZhbHVlOiB0aGlzLnZhbHVlIH0pXG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbW91c2Vtb3ZlIChldmVudDogTW91c2VFdmVudCkge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgaWYgKHRoaXMuc2V0RHJhZ2dpbmdGYWxzZVRpbWVvdXQpIHtcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLnNldERyYWdnaW5nRmFsc2VUaW1lb3V0KVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZHJhZ2dpbmcpIHtcbiAgICAgICAgdGhpcy5jb250aW51ZUFuaW1hdGlvbiA9IGZhbHNlXG4gICAgICAgIGNvbnN0IGRpc3RhbmNlRnJvbUNlbnRlciA9IHRoaXMuZ2V0RGlzdGFuY2VGcm9tQ2VudGVyT2ZFbGVtZW50QW5kRXZlbnQoZXZlbnQpXG4gICAgICAgIGNvbnN0IHVuYWZmZWN0ZWRSYWRpdXMgPSAodGhpcy5jb250YWluZXIuY2xpZW50V2lkdGgpIC8gN1xuICAgICAgICBpZiAoZGlzdGFuY2VGcm9tQ2VudGVyIDwgdW5hZmZlY3RlZFJhZGl1cykge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRlZ3JlZXMgPSB0aGlzLmdldERlZ3JlZXNGcm9tRXZlbnQoZXZlbnQpXG4gICAgICAgIGlmICgodGhpcy5kcmFnU3RhcnREZWdyIDwgMCAmJiBkZWdyZWVzID4gMCkgfHwgKHRoaXMuZHJhZ1N0YXJ0RGVnciA+IDAgJiYgZGVncmVlcyA8IDApKSB7XG4gICAgICAgICAgdGhpcy5kcmFnU3RhcnREZWdyID0gZGVncmVlc1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRlZ3JlZURpZmYgPSB0aGlzLmRyYWdTdGFydERlZ3IgLSBkZWdyZWVzXG4gICAgICAgIHRoaXMuZHJhZ1N0YXJ0RGVnciA9IGRlZ3JlZXNcbiAgICAgICAgY29uc3QgbXVsdGlwbGllciA9ICgoKSA9PiB7XG4gICAgICAgICAgc3dpdGNoICh0aGlzLnNpemUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2xhcmdlJzogcmV0dXJuIDI1MFxuICAgICAgICAgICAgY2FzZSAnbWVkaXVtJzogcmV0dXJuIDIyMFxuICAgICAgICAgICAgY2FzZSAnc21hbGwnOiByZXR1cm4gNjAwXG4gICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gMjIwXG4gICAgICAgICAgfVxuICAgICAgICB9KSgpXG4gICAgICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy52YWx1ZVxuICAgICAgICB0aGlzLnZhbHVlICs9IGRlZ3JlZURpZmYgLyAobXVsdGlwbGllciAvIHRoaXMubWF4KVxuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IHRoaXMudmFsdWVcbiAgICAgICAgaWYgKG9sZFZhbHVlICE9PSBuZXdWYWx1ZSkgdGhpcy51c2VyQ2hhbmdlZFZhbHVlLmVtaXQoeyB2YWx1ZTogdGhpcy52YWx1ZSB9KVxuICAgICAgfVxuICAgICAgdGhpcy5zZXREcmFnZ2luZ0ZhbHNlVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcbiAgICAgIH0sIDEwMDApXG4gICAgfVxuICB9XG5cbiAgbW91c2V1cCAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcbiAgfVxuXG4gIGRvdWJsZWNsaWNrICgpIHtcbiAgICBpZiAodGhpcy5kb3VibGVDbGlja1RvQW5pbWF0ZVRvTWlkZGxlICYmICF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLmFuaW1hdGluZ1RvTWlkZGxlLmVtaXQoKVxuICAgICAgdGhpcy51c2VyQ2hhbmdlZFZhbHVlLmVtaXQoeyB2YWx1ZTogdGhpcy5taWRkbGVWYWx1ZSwgdHJhbnNpdGlvbjogdHJ1ZSB9KVxuICAgICAgdGhpcy5hbmltYXRlS25vYih0aGlzLl92YWx1ZSwgdGhpcy5taWRkbGVWYWx1ZSlcbiAgICB9XG4gIH1cblxuICBsYXJnZUNhcE1heEFuZ2xlID0gMTM1XG4gIGdldCBsYXJnZUNhcENsaXBQYXRoU3R5bGUgKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0cmFuc2Zvcm06IGByb3RhdGUoJHt0aGlzLnV0aWxzLm1hcFZhbHVlKHRoaXMudmFsdWUsIHRoaXMubWluLCB0aGlzLm1heCwgLXRoaXMubGFyZ2VDYXBNYXhBbmdsZSwgdGhpcy5sYXJnZUNhcE1heEFuZ2xlKX1kZWcpYCxcbiAgICAgICd0cmFuc2Zvcm0tb3JpZ2luJzogJzUwJSA1MCUnXG4gICAgfVxuICB9XG5cbiAgZ2V0IGxhcmdlQ2FwSW5kaWNhdG9yU3R5bGUgKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUoLTUwJSwgLTUwJSkgcm90YXRlKCR7dGhpcy51dGlscy5tYXBWYWx1ZSh0aGlzLnZhbHVlLCB0aGlzLm1pbiwgdGhpcy5tYXgsIC10aGlzLmxhcmdlQ2FwTWF4QW5nbGUsIHRoaXMubGFyZ2VDYXBNYXhBbmdsZSl9ZGVnKWBcbiAgICB9XG4gIH1cblxuICBnZXQgbGFyZ2VDYXBCb2R5U3R5bGUgKCkge1xuICAgIHJldHVybiB7XG4gICAgICAvLyAnY2xpcC1wYXRoJzogYHVybCgjbGFyZ2Uta25vYi1jYXAtY2xpcC1wYXRoLSR7dGhpcy5pZH0pYCxcbiAgICAgIC8vICctd2Via2l0LWNsaXAtcGF0aCc6IGB1cmwoI2xhcmdlLWtub2ItY2FwLWNsaXAtcGF0aC0ke3RoaXMuaWR9KWBcbiAgICB9XG4gIH1cblxuICBtZWRpdW1DYXBNYXhBbmdsZSA9IDEzNVxuICBnZXQgbWVkaXVtQ2FwSW5kaWNhdG9yU3R5bGUgKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUoLTUwJSwgLTUwJSkgcm90YXRlKCR7dGhpcy51dGlscy5tYXBWYWx1ZSh0aGlzLnZhbHVlLCB0aGlzLm1pbiwgdGhpcy5tYXgsIC10aGlzLm1lZGl1bUNhcE1heEFuZ2xlLCB0aGlzLm1lZGl1bUNhcE1heEFuZ2xlKX1kZWcpYFxuICAgIH1cbiAgfVxuXG4gIHNtYWxsQ2FwTWF4QW5nbGUgPSAxMzVcbiAgZ2V0IHNtYWxsQ2FwSW5kaWNhdG9yU3R5bGUgKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUoLTUwJSwgLTUwJSkgcm90YXRlKCR7dGhpcy51dGlscy5tYXBWYWx1ZSh0aGlzLnZhbHVlLCB0aGlzLm1pbiwgdGhpcy5tYXgsIC10aGlzLnNtYWxsQ2FwTWF4QW5nbGUsIHRoaXMuc21hbGxDYXBNYXhBbmdsZSl9ZGVnKWBcbiAgICB9XG4gIH1cblxuICBhc3luYyBhbmltYXRlS25vYiAoZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyKSB7XG4gICAgZnJvbSA9IHRoaXMuY2xhbXBWYWx1ZShmcm9tKVxuICAgIHRvID0gdGhpcy5jbGFtcFZhbHVlKHRvKVxuICAgIGNvbnN0IGRpZmYgPSB0byAtIGZyb21cblxuICAgIGNvbnN0IGRlbGF5ID0gMTAwMCAvIHRoaXMuYW5pbWF0aW9uRnBzXG4gICAgY29uc3QgZnJhbWVzID0gdGhpcy5hbmltYXRpb25GcHMgKiAodGhpcy5hbmltYXRpb25EdXJhdGlvbiAvIDEwMDApXG4gICAgY29uc3Qgc3RlcCA9IGRpZmYgLyBmcmFtZXNcbiAgICB0aGlzLmNvbnRpbnVlQW5pbWF0aW9uID0gdHJ1ZVxuICAgIGxldCB2YWx1ZSA9IGZyb21cbiAgICBmb3IgKGxldCBmcmFtZSA9IDA7IGZyYW1lIDwgZnJhbWVzOyBmcmFtZSsrKSB7XG4gICAgICBpZiAodGhpcy5jb250aW51ZUFuaW1hdGlvbikge1xuICAgICAgICBhd2FpdCB0aGlzLnV0aWxzLmRlbGF5KGRlbGF5KVxuICAgICAgICB2YWx1ZSArPSBzdGVwXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jb250aW51ZUFuaW1hdGlvbiA9IGZhbHNlXG4gIH1cblxuICBwdWJsaWMgZ2V0RGVncmVlc0Zyb21FdmVudCAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBjb25zdCBjb29yZHMgPSB0aGlzLnV0aWxzLmdldENvb3JkaW5hdGVzSW5zaWRlRWxlbWVudEZyb21FdmVudChldmVudCwgdGhpcy5jb250YWluZXIpXG4gICAgY29uc3Qga25vYkNlbnRlclggPSAodGhpcy5jb250YWluZXIuY2xpZW50V2lkdGgpIC8gMlxuICAgIGNvbnN0IGtub2JDZW50ZXJZID0gKHRoaXMuY29udGFpbmVyLmNsaWVudEhlaWdodCkgLyAyXG4gICAgY29uc3QgcmFkcyA9IE1hdGguYXRhbjIoY29vcmRzLnggLSBrbm9iQ2VudGVyWCwgY29vcmRzLnkgLSBrbm9iQ2VudGVyWSlcbiAgICByZXR1cm4gcmFkcyAqIDEwMFxuICB9XG5cbiAgcHVibGljIGdldERpc3RhbmNlRnJvbUNlbnRlck9mRWxlbWVudEFuZEV2ZW50IChldmVudDogTW91c2VFdmVudCkge1xuICAgIGNvbnN0IGNvb3JkcyA9IHRoaXMudXRpbHMuZ2V0Q29vcmRpbmF0ZXNJbnNpZGVFbGVtZW50RnJvbUV2ZW50KGV2ZW50LCB0aGlzLmNvbnRhaW5lcilcbiAgICBjb25zdCBrbm9iQ2VudGVyWCA9ICh0aGlzLmNvbnRhaW5lci5jbGllbnRXaWR0aCkgLyAyXG4gICAgY29uc3Qga25vYkNlbnRlclkgPSAodGhpcy5jb250YWluZXIuY2xpZW50SGVpZ2h0KSAvIDJcbiAgICBjb25zdCB3ID0gY29vcmRzLnggLSBrbm9iQ2VudGVyWFxuICAgIGNvbnN0IGggPSBjb29yZHMueSAtIGtub2JDZW50ZXJZXG4gICAgcmV0dXJuIE1hdGguc3FydCh3ICogdyArIGggKiBoKVxuICB9XG5cbiAgcHVibGljIGNsYW1wVmFsdWUgKHZhbHVlOiBudW1iZXIpIHtcbiAgICBpZiAodmFsdWUgPiB0aGlzLm1heCkge1xuICAgICAgdmFsdWUgPSB0aGlzLm1heFxuICAgIH1cblxuICAgIGlmICh2YWx1ZSA8IHRoaXMubWluKSB7XG4gICAgICB2YWx1ZSA9IHRoaXMubWluXG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cbn1cbiJdfQ==
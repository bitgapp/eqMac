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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25vYi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvY29tcG9uZW50cy9rbm9iL2tub2IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLFNBQVMsRUFDVCxZQUFZLEVBQ1osV0FBVyxFQUVaLE1BQU0sZUFBZSxDQUFBO0FBQ3RCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFBO0FBV25FLE1BQU0sT0FBTyxhQUFhO0lBaUV4QixZQUFvQixLQUF1QjtRQUF2QixVQUFLLEdBQUwsS0FBSyxDQUFrQjtRQWhFbEMsU0FBSSxHQUFpQyxRQUFRLENBQUE7UUFDN0MsY0FBUyxHQUFHLElBQUksQ0FBQTtRQUNsQixTQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFJVCxTQUFJLEdBQUcsQ0FBQyxDQUFBO1FBSXlCLGFBQVEsR0FBRyxLQUFLLENBQUE7UUFFL0MsaUNBQTRCLEdBQUcsSUFBSSxDQUFBO1FBQ25DLHNCQUFpQixHQUFHLEdBQUcsQ0FBQTtRQUN2QixpQkFBWSxHQUFHLEVBQUUsQ0FBQTtRQUNoQixzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFBO1FBRXZDLGtCQUFhLEdBQUcsS0FBSyxDQUFBO1FBQ3BCLG9CQUFlLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQTtRQUV2QyxhQUFRLEdBQUcsS0FBSyxDQUFBO1FBQ2hCLDRCQUF1QixHQUFRLElBQUksQ0FBQTtRQUNuQyxzQkFBaUIsR0FBRyxLQUFLLENBQUE7UUFDekIsa0JBQWEsR0FBRyxDQUFDLENBQUE7UUFLakIsV0FBTSxHQUFHLENBQUMsQ0FBQTtRQUNQLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQTtRQUN4QyxxQkFBZ0IsR0FBRyxJQUFJLFlBQVksRUFBeUIsQ0FB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Q0FBQyxDQUFDLENBQUE7SUFDakMsQ0FBQztJQUVNLFVBQVUsQ0FBRSxLQUFhO1FBQzlCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDcEIsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUE7U0FDakI7UUFFRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ3BCLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFBO1NBQ2pCO1FBRUQsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDOzs7WUF2UEYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxVQUFVO2dCQUNwQix3aUxBQW9DOzthQUVyQzs7O1lBVlEsZ0JBQWdCOzs7bUJBWXRCLEtBQUs7d0JBQ0wsS0FBSztrQkFFTCxLQUFLO2tCQUlMLEtBQUs7dUJBR0wsV0FBVyxTQUFDLGdCQUFnQixjQUFHLEtBQUs7MkNBRXBDLEtBQUs7Z0NBQ0wsS0FBSzsyQkFDTCxLQUFLO2dDQUNMLE1BQU07NEJBRU4sS0FBSzs4QkFDTCxNQUFNOzJCQU9OLFNBQVMsU0FBQyxXQUFXLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFOzBCQUl2QyxNQUFNOytCQUNOLE1BQU07b0JBQ04sS0FBSzsyQkF5REwsWUFBWSxTQUFDLFlBQVk7OEJBS3pCLFlBQVksU0FBQyxlQUFlLEVBQUUsQ0FBRSxRQUFRLENBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBWaWV3Q2hpbGQsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSG9zdEJpbmRpbmcsXG4gIEVsZW1lbnRSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7IFV0aWxpdGllc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy91dGlsaXRpZXMuc2VydmljZSdcblxuZXhwb3J0IGludGVyZmFjZSBLbm9iVmFsdWVDaGFuZ2VkRXZlbnQge1xuICB2YWx1ZTogbnVtYmVyXG4gIHRyYW5zaXRpb24/OiBib29sZWFuXG59XG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdlcW0ta25vYicsXG4gIHRlbXBsYXRlVXJsOiAnLi9rbm9iLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbICcuL2tub2IuY29tcG9uZW50LnNjc3MnIF1cbn0pXG5leHBvcnQgY2xhc3MgS25vYkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpIHNpemU6ICdsYXJnZScgfCAnbWVkaXVtJyB8ICdzbWFsbCcgPSAnbWVkaXVtJ1xuICBASW5wdXQoKSBzaG93U2NhbGUgPSB0cnVlXG4gIHB1YmxpYyBfbWluID0gLTFcbiAgQElucHV0KCkgc2V0IG1pbiAobmV3TWluKSB7IHRoaXMuX21pbiA9IG5ld01pbjsgdGhpcy5jYWxjdWxhdGVNaWRkbGVWYWx1ZSgpIH1cbiAgZ2V0IG1pbiAoKSB7IHJldHVybiB0aGlzLl9taW4gfVxuXG4gIHB1YmxpYyBfbWF4ID0gMVxuICBASW5wdXQoKSBzZXQgbWF4IChuZXdNYXgpIHsgdGhpcy5fbWF4ID0gbmV3TWF4OyB0aGlzLmNhbGN1bGF0ZU1pZGRsZVZhbHVlKCkgfVxuICBnZXQgbWF4ICgpIHsgcmV0dXJuIHRoaXMuX21heCB9XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5kaXNhYmxlZCcpIEBJbnB1dCgpIGRpc2FibGVkID0gZmFsc2VcblxuICBASW5wdXQoKSBkb3VibGVDbGlja1RvQW5pbWF0ZVRvTWlkZGxlID0gdHJ1ZVxuICBASW5wdXQoKSBhbmltYXRpb25EdXJhdGlvbiA9IDUwMFxuICBASW5wdXQoKSBhbmltYXRpb25GcHMgPSAzMFxuICBAT3V0cHV0KCkgYW5pbWF0aW5nVG9NaWRkbGUgPSBuZXcgRXZlbnRFbWl0dGVyKClcblxuICBASW5wdXQoKSBzdGlja1RvTWlkZGxlID0gZmFsc2VcbiAgQE91dHB1dCgpIHN0aWNrZWRUb01pZGRsZSA9IG5ldyBFdmVudEVtaXR0ZXIoKVxuXG4gIHB1YmxpYyBkcmFnZ2luZyA9IGZhbHNlXG4gIHB1YmxpYyBzZXREcmFnZ2luZ0ZhbHNlVGltZW91dDogYW55ID0gbnVsbFxuICBwdWJsaWMgY29udGludWVBbmltYXRpb24gPSBmYWxzZVxuICBwdWJsaWMgZHJhZ1N0YXJ0RGVnciA9IDBcblxuICBAVmlld0NoaWxkKCdjb250YWluZXInLCB7IHN0YXRpYzogdHJ1ZSB9KSBjb250YWluZXJSZWYhOiBFbGVtZW50UmVmXG4gIGNvbnRhaW5lciE6IEhUTUxEaXZFbGVtZW50XG5cbiAgcHVibGljIF92YWx1ZSA9IDBcbiAgQE91dHB1dCgpIHZhbHVlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KClcbiAgQE91dHB1dCgpIHVzZXJDaGFuZ2VkVmFsdWUgPSBuZXcgRXZlbnRFbWl0dGVyPEtub2JWYWx1ZUNoYW5nZWRFdmVudD4oKVxuICBASW5wdXQoKVxuICBzZXQgdmFsdWUgKG5ld1ZhbHVlOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5fdmFsdWUgPT09IG5ld1ZhbHVlIHx8IHR5cGVvZiBuZXdWYWx1ZSAhPT0gJ251bWJlcicpIHJldHVyblxuICAgIGxldCB2YWx1ZSA9IG5ld1ZhbHVlXG4gICAgaWYgKHRoaXMuc3RpY2tUb01pZGRsZSkge1xuICAgICAgbGV0IGRpZmZGcm9tTWlkZGxlID0gdGhpcy5taWRkbGVWYWx1ZSAtIHZhbHVlXG4gICAgICBpZiAoZGlmZkZyb21NaWRkbGUgPCAwKSB7XG4gICAgICAgIGRpZmZGcm9tTWlkZGxlICo9IC0xXG4gICAgICB9XG4gICAgICBjb25zdCBwZXJjRnJvbU1pZGRsZSA9IHRoaXMudXRpbHMubWFwVmFsdWUoZGlmZkZyb21NaWRkbGUsIDAsIHRoaXMubWF4IC0gdGhpcy5taWRkbGVWYWx1ZSwgMCwgMTAwKVxuICAgICAgaWYgKCh0aGlzLl92YWx1ZSkudG9GaXhlZCgxKSA9PT0gKHRoaXMubWlkZGxlVmFsdWUpLnRvRml4ZWQoMSkgJiYgcGVyY0Zyb21NaWRkbGUgPCAyKSB7XG4gICAgICAgIHZhbHVlID0gdGhpcy5taWRkbGVWYWx1ZVxuICAgICAgfSBlbHNlIGlmICgodGhpcy5fdmFsdWUgPCB0aGlzLm1pZGRsZVZhbHVlICYmIG5ld1ZhbHVlID4gdGhpcy5fdmFsdWUpIHx8ICh0aGlzLl92YWx1ZSA+IHRoaXMubWlkZGxlVmFsdWUgJiYgbmV3VmFsdWUgPCB0aGlzLl92YWx1ZSkpIHtcbiAgICAgICAgaWYgKHBlcmNGcm9tTWlkZGxlIDwgNSkge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5taWRkbGVWYWx1ZVxuICAgICAgICAgIHRoaXMuc3RpY2tlZFRvTWlkZGxlLmVtaXQodGhpcy5jb250aW51ZUFuaW1hdGlvbilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl92YWx1ZSA9IHRoaXMuY2xhbXBWYWx1ZSh2YWx1ZSlcbiAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodGhpcy5fdmFsdWUpXG4gIH1cblxuICBnZXQgdmFsdWUgKCkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZVxuICB9XG5cbiAgbWlkZGxlVmFsdWU6IG51bWJlciA9IHRoaXMuY2FsY3VsYXRlTWlkZGxlVmFsdWUoKVxuICBwdWJsaWMgY2FsY3VsYXRlTWlkZGxlVmFsdWUgKCkge1xuICAgIHRoaXMubWlkZGxlVmFsdWUgPSAodGhpcy5taW4gKyB0aGlzLm1heCkgLyAyXG4gICAgcmV0dXJuIHRoaXMubWlkZGxlVmFsdWVcbiAgfVxuXG4gIGNvbnN0cnVjdG9yIChwdWJsaWMgdXRpbHM6IFV0aWxpdGllc1NlcnZpY2UpIHt9XG5cbiAgYXN5bmMgbmdPbkluaXQgKCkge1xuICAgIHRoaXMuY29udGFpbmVyID0gdGhpcy5jb250YWluZXJSZWYubmF0aXZlRWxlbWVudFxuICB9XG5cbiAgbW91c2VXaGVlbCAoZXZlbnQ6IFdoZWVsRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuY29udGludWVBbmltYXRpb24gPSBmYWxzZVxuICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLnZhbHVlXG4gICAgICB0aGlzLnZhbHVlICs9IC1ldmVudC5kZWx0YVkgLyAoMTAwMCAvIHRoaXMubWF4KVxuICAgICAgY29uc3QgbmV3VmFsdWUgPSB0aGlzLnZhbHVlXG4gICAgICBpZiAob2xkVmFsdWUgIT09IG5ld1ZhbHVlKSB0aGlzLnVzZXJDaGFuZ2VkVmFsdWUuZW1pdCh7IHZhbHVlOiB0aGlzLnZhbHVlIH0pXG4gICAgfVxuICB9XG5cbiAgbW91c2Vkb3duIChldmVudDogTW91c2VFdmVudCkge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5jb250aW51ZUFuaW1hdGlvbiA9IGZhbHNlXG4gICAgICB0aGlzLmRyYWdTdGFydERlZ3IgPSB0aGlzLmdldERlZ3JlZXNGcm9tRXZlbnQoZXZlbnQpXG4gICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlbGVhdmUnKVxuICBvbk1vdXNlTGVhdmUgKCk6IHZvaWQge1xuICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZ2VzdHVyZWNoYW5nZScsIFsgJyRldmVudCcgXSlcbiAgb25HZXN0dXJlQ2hhbmdlIChldmVudDogYW55KSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmNvbnRpbnVlQW5pbWF0aW9uID0gZmFsc2VcbiAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLnZhbHVlXG4gICAgICAgIHRoaXMudmFsdWUgKz0gZXZlbnQucm90YXRpb24gLyAoNTAwMCAvIHRoaXMubWF4KVxuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IHRoaXMudmFsdWVcbiAgICAgICAgaWYgKG9sZFZhbHVlICE9PSBuZXdWYWx1ZSkgdGhpcy51c2VyQ2hhbmdlZFZhbHVlLmVtaXQoeyB2YWx1ZTogdGhpcy52YWx1ZSB9KVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG1vdXNlbW92ZSAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIGlmICh0aGlzLnNldERyYWdnaW5nRmFsc2VUaW1lb3V0KSB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5zZXREcmFnZ2luZ0ZhbHNlVGltZW91dClcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmRyYWdnaW5nKSB7XG4gICAgICAgIHRoaXMuY29udGludWVBbmltYXRpb24gPSBmYWxzZVxuICAgICAgICBjb25zdCBkaXN0YW5jZUZyb21DZW50ZXIgPSB0aGlzLmdldERpc3RhbmNlRnJvbUNlbnRlck9mRWxlbWVudEFuZEV2ZW50KGV2ZW50KVxuICAgICAgICBjb25zdCB1bmFmZmVjdGVkUmFkaXVzID0gKHRoaXMuY29udGFpbmVyLmNsaWVudFdpZHRoKSAvIDdcbiAgICAgICAgaWYgKGRpc3RhbmNlRnJvbUNlbnRlciA8IHVuYWZmZWN0ZWRSYWRpdXMpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkZWdyZWVzID0gdGhpcy5nZXREZWdyZWVzRnJvbUV2ZW50KGV2ZW50KVxuICAgICAgICBpZiAoKHRoaXMuZHJhZ1N0YXJ0RGVnciA8IDAgJiYgZGVncmVlcyA+IDApIHx8ICh0aGlzLmRyYWdTdGFydERlZ3IgPiAwICYmIGRlZ3JlZXMgPCAwKSkge1xuICAgICAgICAgIHRoaXMuZHJhZ1N0YXJ0RGVnciA9IGRlZ3JlZXNcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkZWdyZWVEaWZmID0gdGhpcy5kcmFnU3RhcnREZWdyIC0gZGVncmVlc1xuICAgICAgICB0aGlzLmRyYWdTdGFydERlZ3IgPSBkZWdyZWVzXG4gICAgICAgIGNvbnN0IG11bHRpcGxpZXIgPSAoKCkgPT4ge1xuICAgICAgICAgIHN3aXRjaCAodGhpcy5zaXplKSB7XG4gICAgICAgICAgICBjYXNlICdsYXJnZSc6IHJldHVybiAyNTBcbiAgICAgICAgICAgIGNhc2UgJ21lZGl1bSc6IHJldHVybiAyMjBcbiAgICAgICAgICAgIGNhc2UgJ3NtYWxsJzogcmV0dXJuIDYwMFxuICAgICAgICAgICAgZGVmYXVsdDogcmV0dXJuIDIyMFxuICAgICAgICAgIH1cbiAgICAgICAgfSkoKVxuICAgICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMudmFsdWVcbiAgICAgICAgdGhpcy52YWx1ZSArPSBkZWdyZWVEaWZmIC8gKG11bHRpcGxpZXIgLyB0aGlzLm1heClcbiAgICAgICAgY29uc3QgbmV3VmFsdWUgPSB0aGlzLnZhbHVlXG4gICAgICAgIGlmIChvbGRWYWx1ZSAhPT0gbmV3VmFsdWUpIHRoaXMudXNlckNoYW5nZWRWYWx1ZS5lbWl0KHsgdmFsdWU6IHRoaXMudmFsdWUgfSlcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0RHJhZ2dpbmdGYWxzZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXG4gICAgICB9LCAxMDAwKVxuICAgIH1cbiAgfVxuXG4gIG1vdXNldXAgKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXG4gIH1cblxuICBkb3VibGVjbGljayAoKSB7XG4gICAgaWYgKHRoaXMuZG91YmxlQ2xpY2tUb0FuaW1hdGVUb01pZGRsZSAmJiAhdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5hbmltYXRpbmdUb01pZGRsZS5lbWl0KClcbiAgICAgIHRoaXMudXNlckNoYW5nZWRWYWx1ZS5lbWl0KHsgdmFsdWU6IHRoaXMubWlkZGxlVmFsdWUsIHRyYW5zaXRpb246IHRydWUgfSlcbiAgICAgIHRoaXMuYW5pbWF0ZUtub2IodGhpcy5fdmFsdWUsIHRoaXMubWlkZGxlVmFsdWUpXG4gICAgfVxuICB9XG5cbiAgbGFyZ2VDYXBNYXhBbmdsZSA9IDEzNVxuICBnZXQgbGFyZ2VDYXBDbGlwUGF0aFN0eWxlICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHJhbnNmb3JtOiBgcm90YXRlKCR7dGhpcy51dGlscy5tYXBWYWx1ZSh0aGlzLnZhbHVlLCB0aGlzLm1pbiwgdGhpcy5tYXgsIC10aGlzLmxhcmdlQ2FwTWF4QW5nbGUsIHRoaXMubGFyZ2VDYXBNYXhBbmdsZSl9ZGVnKWAsXG4gICAgICAndHJhbnNmb3JtLW9yaWdpbic6ICc1MCUgNTAlJ1xuICAgIH1cbiAgfVxuXG4gIGdldCBsYXJnZUNhcEluZGljYXRvclN0eWxlICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlKC01MCUsIC01MCUpIHJvdGF0ZSgke3RoaXMudXRpbHMubWFwVmFsdWUodGhpcy52YWx1ZSwgdGhpcy5taW4sIHRoaXMubWF4LCAtdGhpcy5sYXJnZUNhcE1heEFuZ2xlLCB0aGlzLmxhcmdlQ2FwTWF4QW5nbGUpfWRlZylgXG4gICAgfVxuICB9XG5cbiAgZ2V0IGxhcmdlQ2FwQm9keVN0eWxlICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLy8gJ2NsaXAtcGF0aCc6IGB1cmwoI2xhcmdlLWtub2ItY2FwLWNsaXAtcGF0aC0ke3RoaXMuaWR9KWAsXG4gICAgICAvLyAnLXdlYmtpdC1jbGlwLXBhdGgnOiBgdXJsKCNsYXJnZS1rbm9iLWNhcC1jbGlwLXBhdGgtJHt0aGlzLmlkfSlgXG4gICAgfVxuICB9XG5cbiAgbWVkaXVtQ2FwTWF4QW5nbGUgPSAxMzVcbiAgZ2V0IG1lZGl1bUNhcEluZGljYXRvclN0eWxlICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlKC01MCUsIC01MCUpIHJvdGF0ZSgke3RoaXMudXRpbHMubWFwVmFsdWUodGhpcy52YWx1ZSwgdGhpcy5taW4sIHRoaXMubWF4LCAtdGhpcy5tZWRpdW1DYXBNYXhBbmdsZSwgdGhpcy5tZWRpdW1DYXBNYXhBbmdsZSl9ZGVnKWBcbiAgICB9XG4gIH1cblxuICBzbWFsbENhcE1heEFuZ2xlID0gMTM1XG4gIGdldCBzbWFsbENhcEluZGljYXRvclN0eWxlICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlKC01MCUsIC01MCUpIHJvdGF0ZSgke3RoaXMudXRpbHMubWFwVmFsdWUodGhpcy52YWx1ZSwgdGhpcy5taW4sIHRoaXMubWF4LCAtdGhpcy5zbWFsbENhcE1heEFuZ2xlLCB0aGlzLnNtYWxsQ2FwTWF4QW5nbGUpfWRlZylgXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgYW5pbWF0ZUtub2IgKGZyb206IG51bWJlciwgdG86IG51bWJlcikge1xuICAgIGZyb20gPSB0aGlzLmNsYW1wVmFsdWUoZnJvbSlcbiAgICB0byA9IHRoaXMuY2xhbXBWYWx1ZSh0bylcbiAgICBjb25zdCBkaWZmID0gdG8gLSBmcm9tXG5cbiAgICBjb25zdCBkZWxheSA9IDEwMDAgLyB0aGlzLmFuaW1hdGlvbkZwc1xuICAgIGNvbnN0IGZyYW1lcyA9IHRoaXMuYW5pbWF0aW9uRnBzICogKHRoaXMuYW5pbWF0aW9uRHVyYXRpb24gLyAxMDAwKVxuICAgIGNvbnN0IHN0ZXAgPSBkaWZmIC8gZnJhbWVzXG4gICAgdGhpcy5jb250aW51ZUFuaW1hdGlvbiA9IHRydWVcbiAgICBsZXQgdmFsdWUgPSBmcm9tXG4gICAgZm9yIChsZXQgZnJhbWUgPSAwOyBmcmFtZSA8IGZyYW1lczsgZnJhbWUrKykge1xuICAgICAgaWYgKHRoaXMuY29udGludWVBbmltYXRpb24pIHtcbiAgICAgICAgYXdhaXQgdGhpcy51dGlscy5kZWxheShkZWxheSlcbiAgICAgICAgdmFsdWUgKz0gc3RlcFxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuY29udGludWVBbmltYXRpb24gPSBmYWxzZVxuICB9XG5cbiAgcHVibGljIGdldERlZ3JlZXNGcm9tRXZlbnQgKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgY29uc3QgY29vcmRzID0gdGhpcy51dGlscy5nZXRDb29yZGluYXRlc0luc2lkZUVsZW1lbnRGcm9tRXZlbnQoZXZlbnQsIHRoaXMuY29udGFpbmVyKVxuICAgIGNvbnN0IGtub2JDZW50ZXJYID0gKHRoaXMuY29udGFpbmVyLmNsaWVudFdpZHRoKSAvIDJcbiAgICBjb25zdCBrbm9iQ2VudGVyWSA9ICh0aGlzLmNvbnRhaW5lci5jbGllbnRIZWlnaHQpIC8gMlxuICAgIGNvbnN0IHJhZHMgPSBNYXRoLmF0YW4yKGNvb3Jkcy54IC0ga25vYkNlbnRlclgsIGNvb3Jkcy55IC0ga25vYkNlbnRlclkpXG4gICAgcmV0dXJuIHJhZHMgKiAxMDBcbiAgfVxuXG4gIHB1YmxpYyBnZXREaXN0YW5jZUZyb21DZW50ZXJPZkVsZW1lbnRBbmRFdmVudCAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBjb25zdCBjb29yZHMgPSB0aGlzLnV0aWxzLmdldENvb3JkaW5hdGVzSW5zaWRlRWxlbWVudEZyb21FdmVudChldmVudCwgdGhpcy5jb250YWluZXIpXG4gICAgY29uc3Qga25vYkNlbnRlclggPSAodGhpcy5jb250YWluZXIuY2xpZW50V2lkdGgpIC8gMlxuICAgIGNvbnN0IGtub2JDZW50ZXJZID0gKHRoaXMuY29udGFpbmVyLmNsaWVudEhlaWdodCkgLyAyXG4gICAgY29uc3QgdyA9IGNvb3Jkcy54IC0ga25vYkNlbnRlclhcbiAgICBjb25zdCBoID0gY29vcmRzLnkgLSBrbm9iQ2VudGVyWVxuICAgIHJldHVybiBNYXRoLnNxcnQodyAqIHcgKyBoICogaClcbiAgfVxuXG4gIHB1YmxpYyBjbGFtcFZhbHVlICh2YWx1ZTogbnVtYmVyKSB7XG4gICAgaWYgKHZhbHVlID4gdGhpcy5tYXgpIHtcbiAgICAgIHZhbHVlID0gdGhpcy5tYXhcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgPCB0aGlzLm1pbikge1xuICAgICAgdmFsdWUgPSB0aGlzLm1pblxuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZVxuICB9XG59XG4iXX0=
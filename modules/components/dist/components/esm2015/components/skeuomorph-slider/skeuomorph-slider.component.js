import { __awaiter } from "tslib";
import { Component, Input, Output, ElementRef, HostListener, ViewChild, EventEmitter, HostBinding } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';
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
SkeuomorphSliderComponent.decorators = [
    { type: Component, args: [{
                selector: 'eqm-skeuomorph-slider',
                template: "<canvas [hidden]=\"!showNotches\" #notches height=\"137\" class=\"notches\"></canvas>\n<div class=\"groove\"></div>\n<div class=\"thumb\" [style.top]=\"calculateTop()\" (dblclick)=\"doubleclick()\">\n  <div class=\"line-group\"></div>\n</div>\n",
                styles: [":host{width:31px;height:100%;min-height:100px;display:inline-flex;flex-direction:column;justify-content:center;align-items:center;position:relative;transition-property:filter;transition-duration:.5s}.notches{position:absolute;top:0;left:0;height:100%;width:100%}.groove{width:7px;height:89%;background-color:#29292b;box-shadow:inset 0 0 0 1px #45494d,inset 0 2px 5px 1px #000,inset -1px -1px 0 1px #313234,inset 1px 1px 0 1px #0e0e0e}.groove,.thumb{border-radius:3px}.thumb{position:absolute;display:flex;justify-content:center;align-items:center;top:0;left:calc(50% - 21px / 2);width:21px;height:25px;background-color:#38393d;box-shadow:inset 0 0 0 1px #1f2024,inset 1px 1px 0 1px #4c4f52,inset -1px -1px 0 1px #313437,0 3px 10px -2px #000}.thumb .line-group{width:calc(100% - 2px);height:3px;background:linear-gradient(180deg,#1a2b24,#1a2b24 1px,#559e7d 0,#559e7d 2px,#466d66 0,#466d66 3px)}:host.disabled{filter:grayscale(80%)}"]
            },] }
];
SkeuomorphSliderComponent.ctorParameters = () => [
    { type: UtilitiesService },
    { type: ElementRef }
];
SkeuomorphSliderComponent.propDecorators = {
    min: [{ type: Input }],
    max: [{ type: Input }],
    animationDuration: [{ type: Input }],
    animationFps: [{ type: Input }],
    scrollEnabled: [{ type: Input }],
    middle: [{ type: Input }],
    stickToMiddle: [{ type: Input }],
    stickedToMiddle: [{ type: Output }],
    notches: [{ type: ViewChild, args: ['notches', { static: true },] }],
    userChangedValue: [{ type: Output }],
    valueChange: [{ type: Output }],
    showNotches: [{ type: Input }],
    disabled: [{ type: HostBinding, args: ['class.disabled',] }, { type: Input }],
    value: [{ type: Input }],
    onMouseWheel: [{ type: HostListener, args: ['mousewheel', ['$event'],] }],
    onMouseDown: [{ type: HostListener, args: ['mousedown', ['$event'],] }],
    onMouseMove: [{ type: HostListener, args: ['mousemove', ['$event'],] }],
    onMouseUp: [{ type: HostListener, args: ['mouseup',] }],
    onMouseLeave: [{ type: HostListener, args: ['mouseleave',] }],
    drawNotches: [{ type: HostListener, args: ['window:resize',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tldW9tb3JwaC1zbGlkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvY29tcG9uZW50cy9za2V1b21vcnBoLXNsaWRlci9za2V1b21vcnBoLXNsaWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBRVQsS0FBSyxFQUNMLE1BQU0sRUFDTixVQUFVLEVBQ1YsWUFBWSxFQUNaLFNBQVMsRUFDVCxZQUFZLEVBQ1osV0FBVyxFQUNaLE1BQU0sZUFBZSxDQUFBO0FBQ3RCLE9BQU8sRUFDTCxnQkFBZ0IsRUFDakIsTUFBTSxrQ0FBa0MsQ0FBQTtBQVl6QyxNQUFNLE9BQU8seUJBQXlCO0lBQ3BDLFlBQW9CLEtBQXVCLEVBQVMsS0FBaUI7UUFBakQsVUFBSyxHQUFMLEtBQUssQ0FBa0I7UUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFZO1FBRTVELFFBQUcsR0FBVyxDQUFDLENBQUE7UUFDZixRQUFHLEdBQVcsQ0FBQyxDQUFBO1FBQ2Ysc0JBQWlCLEdBQUcsR0FBRyxDQUFBO1FBQ3ZCLGlCQUFZLEdBQUcsRUFBRSxDQUFBO1FBQ2pCLGtCQUFhLEdBQUcsSUFBSSxDQUFBO1FBRXBCLGtCQUFhLEdBQUcsS0FBSyxDQUFBO1FBQ3BCLG9CQUFlLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQTtRQU12QyxhQUFRLEdBQUcsS0FBSyxDQUFBO1FBSWIscUJBQWdCLEdBQUcsSUFBSSxZQUFZLEVBQXFDLENBQUE7UUFDeEUsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFBO1FBQ2pDLGdCQUFXLEdBQUcsSUFBSSxDQUFBO1FBRWEsYUFBUSxHQUFHLEtBQUssQ0FBQTtRQUVqRCxXQUFNLEdBQUcsR0FBRyxDQUFBO0lBekJxRCxDQUFDO0lBV3pFLElBQUksV0FBVztRQUNiLE9BQU8sT0FBTyxJQUFJLENBQUMsTUFBTSxL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TSxFQUFFLElBQUksRUFBRTsrQkFDckMsTUFBTTswQkFDTixNQUFNOzBCQUNOLEtBQUs7dUJBRUwsV0FBVyxTQUFDLGdCQUFnQixjQUFHLEtBQUs7b0JBR3BDLEtBQUs7MkJBMkJMLFlBQVksU0FBQyxZQUFZLEVBQUUsQ0FBRSxRQUFRLENBQUU7MEJBMkJ2QyxZQUFZLFNBQUMsV0FBVyxFQUFFLENBQUUsUUFBUSxDQUFFOzBCQWN0QyxZQUFZLFNBQUMsV0FBVyxFQUFFLENBQUUsUUFBUSxDQUFFO3dCQVF0QyxZQUFZLFNBQUMsU0FBUzsyQkFLdEIsWUFBWSxTQUFDLFlBQVk7MEJBeUN6QixZQUFZLFNBQUMsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFbGVtZW50UmVmLFxuICBIb3N0TGlzdGVuZXIsXG4gIFZpZXdDaGlsZCxcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0QmluZGluZ1xufSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuaW1wb3J0IHtcbiAgVXRpbGl0aWVzU2VydmljZVxufSBmcm9tICcuLi8uLi9zZXJ2aWNlcy91dGlsaXRpZXMuc2VydmljZSdcblxuZXhwb3J0IGludGVyZmFjZSBTa2V1b21vcnBoU2xpZGVyVmFsdWVDaGFuZ2VkRXZlbnQge1xuICB2YWx1ZTogbnVtYmVyXG4gIHRyYW5zaXRpb24/OiBib29sZWFuXG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2VxbS1za2V1b21vcnBoLXNsaWRlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9za2V1b21vcnBoLXNsaWRlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWyAnLi9za2V1b21vcnBoLXNsaWRlci5jb21wb25lbnQuc2NzcycgXVxufSlcbmV4cG9ydCBjbGFzcyBTa2V1b21vcnBoU2xpZGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgY29uc3RydWN0b3IgKHB1YmxpYyB1dGlsczogVXRpbGl0aWVzU2VydmljZSwgcHVibGljIGVsUmVmOiBFbGVtZW50UmVmKSB7fVxuXG4gIEBJbnB1dCgpIG1pbjogbnVtYmVyID0gMFxuICBASW5wdXQoKSBtYXg6IG51bWJlciA9IDFcbiAgQElucHV0KCkgYW5pbWF0aW9uRHVyYXRpb24gPSA1MDBcbiAgQElucHV0KCkgYW5pbWF0aW9uRnBzID0gMzBcbiAgQElucHV0KCkgc2Nyb2xsRW5hYmxlZCA9IHRydWVcbiAgQElucHV0KCkgbWlkZGxlPzogbnVtYmVyXG4gIEBJbnB1dCgpIHN0aWNrVG9NaWRkbGUgPSBmYWxzZVxuICBAT3V0cHV0KCkgc3RpY2tlZFRvTWlkZGxlID0gbmV3IEV2ZW50RW1pdHRlcigpXG5cbiAgZ2V0IG1pZGRsZVZhbHVlICgpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaXMubWlkZGxlID09PSAnbnVtYmVyJyA/IHRoaXMubWlkZGxlIDogKHRoaXMubWluICsgdGhpcy5tYXgpIC8gMlxuICB9XG5cbiAgcHVibGljIGRyYWdnaW5nID0gZmFsc2VcbiAgcHVibGljIGRvdWJsZWNsaWNrVGltZW91dD86IG51bWJlclxuXG4gIEBWaWV3Q2hpbGQoJ25vdGNoZXMnLCB7IHN0YXRpYzogdHJ1ZSB9KSBub3RjaGVzITogRWxlbWVudFJlZlxuICBAT3V0cHV0KCkgdXNlckNoYW5nZWRWYWx1ZSA9IG5ldyBFdmVudEVtaXR0ZXI8U2tldW9tb3JwaFNsaWRlclZhbHVlQ2hhbmdlZEV2ZW50PigpXG4gIEBPdXRwdXQoKSB2YWx1ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKVxuICBASW5wdXQoKSBzaG93Tm90Y2hlcyA9IHRydWVcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmRpc2FibGVkJykgQElucHV0KCkgZGlzYWJsZWQgPSBmYWxzZVxuXG4gIHB1YmxpYyBfdmFsdWUgPSAwLjVcbiAgQElucHV0KClcbiAgc2V0IHZhbHVlIChuZXdWYWx1ZSkge1xuICAgIGxldCB2YWx1ZSA9IHRoaXMuY2xhbXBWYWx1ZShuZXdWYWx1ZSlcblxuICAgIGlmICh0aGlzLnN0aWNrVG9NaWRkbGUpIHtcbiAgICAgIGNvbnN0IG1pZGRsZVZhbHVlID0gdGhpcy5taWRkbGVWYWx1ZVxuXG4gICAgICBsZXQgZGlmZkZyb21NaWRkbGUgPSBtaWRkbGVWYWx1ZSAtIHZhbHVlXG4gICAgICBpZiAoZGlmZkZyb21NaWRkbGUgPCAwKSB7XG4gICAgICAgIGRpZmZGcm9tTWlkZGxlICo9IC0xXG4gICAgICB9XG4gICAgICBjb25zdCBwZXJjRnJvbU1pZGRsZSA9IHRoaXMudXRpbHMubWFwVmFsdWUoZGlmZkZyb21NaWRkbGUsIDAsIHRoaXMubWF4IC0gbWlkZGxlVmFsdWUsIDAsIDEwMClcbiAgICAgIGlmICgodGhpcy5fdmFsdWUpLnRvRml4ZWQoMikgPT09IChtaWRkbGVWYWx1ZSkudG9GaXhlZCgyKSAmJiBwZXJjRnJvbU1pZGRsZSA8IDUpIHtcbiAgICAgICAgdmFsdWUgPSBtaWRkbGVWYWx1ZVxuICAgICAgfSBlbHNlIGlmICgodGhpcy5fdmFsdWUgPCBtaWRkbGVWYWx1ZSAmJiBuZXdWYWx1ZSA+IHRoaXMuX3ZhbHVlKSB8fCAodGhpcy5fdmFsdWUgPiBtaWRkbGVWYWx1ZSAmJiBuZXdWYWx1ZSA8IHRoaXMuX3ZhbHVlKSkge1xuICAgICAgICBpZiAocGVyY0Zyb21NaWRkbGUgPCAzKSB7XG4gICAgICAgICAgdmFsdWUgPSBtaWRkbGVWYWx1ZVxuICAgICAgICAgIHRoaXMuc3RpY2tlZFRvTWlkZGxlLmVtaXQoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX3ZhbHVlID0gdGhpcy5jbGFtcFZhbHVlKHZhbHVlKVxuICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh0aGlzLl92YWx1ZSlcbiAgfVxuXG4gIGdldCB2YWx1ZSAoKSB7IHJldHVybiB0aGlzLl92YWx1ZSB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2V3aGVlbCcsIFsgJyRldmVudCcgXSlcbiAgb25Nb3VzZVdoZWVsIChldmVudDogV2hlZWxFdmVudCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCAmJiB0aGlzLnNjcm9sbEVuYWJsZWQpIHtcbiAgICAgIHRoaXMudmFsdWUgKz0gLWV2ZW50LmRlbHRhWSAvIDEwMFxuICAgICAgdGhpcy51c2VyQ2hhbmdlZFZhbHVlLmVtaXQoeyB2YWx1ZTogdGhpcy52YWx1ZSB9KVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRWYWx1ZUZyb21Nb3VzZUV2ZW50IChldmVudDogTW91c2VFdmVudCkge1xuICAgIGNvbnN0IGNvb3JkcyA9IHRoaXMudXRpbHMuZ2V0Q29vcmRpbmF0ZXNJbnNpZGVFbGVtZW50RnJvbUV2ZW50KGV2ZW50LCB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQpXG4gICAgY29uc3QgeSA9IGNvb3Jkcy55XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodFxuICAgIGNvbnN0IHBhZGRpbmcgPSBoZWlnaHQgKiAwLjExXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmNsYW1wVmFsdWUodGhpcy51dGlscy5tYXBWYWx1ZSh5LCBoZWlnaHQgLSBwYWRkaW5nIC8gMiwgcGFkZGluZywgdGhpcy5taW4sIHRoaXMubWF4KSlcbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIHB1YmxpYyBjbGFtcFZhbHVlICh2YWx1ZTogbnVtYmVyKSB7XG4gICAgaWYgKHZhbHVlIDwgdGhpcy5taW4pIHtcbiAgICAgIHJldHVybiB0aGlzLm1pblxuICAgIH0gZWxzZSBpZiAodmFsdWUgPiB0aGlzLm1heCkge1xuICAgICAgcmV0dXJuIHRoaXMubWF4XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWx1ZVxuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZG93bicsIFsgJyRldmVudCcgXSlcbiAgb25Nb3VzZURvd24gKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZVxuICAgICAgaWYgKCF0aGlzLmRvdWJsZWNsaWNrVGltZW91dCkge1xuICAgICAgICB0aGlzLmRvdWJsZWNsaWNrVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZG91YmxlY2xpY2tUaW1lb3V0ID0gdW5kZWZpbmVkXG4gICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuZ2V0VmFsdWVGcm9tTW91c2VFdmVudChldmVudClcbiAgICAgICAgICB0aGlzLnVzZXJDaGFuZ2VkVmFsdWUuZW1pdCh7IHZhbHVlOiB0aGlzLnZhbHVlIH0pXG4gICAgICAgIH0sIDIwMCkgYXMgdW5rbm93biBhcyBudW1iZXJcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZW1vdmUnLCBbICckZXZlbnQnIF0pXG4gIG9uTW91c2VNb3ZlIChldmVudDogTW91c2VFdmVudCkge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCAmJiB0aGlzLmRyYWdnaW5nKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5nZXRWYWx1ZUZyb21Nb3VzZUV2ZW50KGV2ZW50KVxuICAgICAgdGhpcy51c2VyQ2hhbmdlZFZhbHVlLmVtaXQoeyB2YWx1ZTogdGhpcy52YWx1ZSB9KVxuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNldXAnKVxuICBvbk1vdXNlVXAgKCkge1xuICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2VsZWF2ZScpXG4gIG9uTW91c2VMZWF2ZSAoKSB7XG4gICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXG4gIH1cblxuICBkb3VibGVjbGljayAoKSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICBpZiAodGhpcy5kb3VibGVjbGlja1RpbWVvdXQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZG91YmxlY2xpY2tUaW1lb3V0KVxuICAgICAgfVxuXG4gICAgICB0aGlzLnVzZXJDaGFuZ2VkVmFsdWUuZW1pdCh7XG4gICAgICAgIHZhbHVlOiB0aGlzLm1pZGRsZVZhbHVlLFxuICAgICAgICB0cmFuc2l0aW9uOiB0cnVlXG4gICAgICB9KVxuICAgICAgdGhpcy5hbmltYXRlU2xpZGVyKHRoaXMudmFsdWUsIHRoaXMubWlkZGxlVmFsdWUpXG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQgKCkge1xuICAgIGlmICh0aGlzLnNob3dOb3RjaGVzKSB7XG4gICAgICB0aGlzLmRyYXdOb3RjaGVzKClcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5kcmF3Tm90Y2hlcygpKVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGFuaW1hdGVTbGlkZXIgKGZyb206IG51bWJlciwgdG86IG51bWJlcikge1xuICAgIGZyb20gPSB0aGlzLmNsYW1wVmFsdWUoZnJvbSlcbiAgICB0byA9IHRoaXMuY2xhbXBWYWx1ZSh0bylcbiAgICBjb25zdCBkaWZmID0gdG8gLSBmcm9tXG4gICAgY29uc3QgZGVsYXkgPSAxMDAwIC8gdGhpcy5hbmltYXRpb25GcHNcbiAgICBjb25zdCBmcmFtZXMgPSB0aGlzLmFuaW1hdGlvbkZwcyAqICh0aGlzLmFuaW1hdGlvbkR1cmF0aW9uIC8gMTAwMClcbiAgICBjb25zdCBzdGVwID0gZGlmZiAvIGZyYW1lc1xuICAgIGxldCB2YWx1ZSA9IGZyb21cbiAgICBmb3IgKGxldCBmcmFtZSA9IDA7IGZyYW1lIDwgZnJhbWVzOyBmcmFtZSsrKSB7XG4gICAgICBhd2FpdCB0aGlzLnV0aWxzLmRlbGF5KGRlbGF5KVxuICAgICAgdmFsdWUgKz0gc3RlcFxuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlXG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScpXG4gIGRyYXdOb3RjaGVzICgpIHtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLm5vdGNoZXMubmF0aXZlRWxlbWVudFxuICAgIGNvbnN0IGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGhcbiAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0XG4gICAgY2FudmFzLndpZHRoID0gd2lkdGhcbiAgICBjb25zdCBwYWRkaW5nID0gaGVpZ2h0ICogMC4wOFxuICAgIGNvbnN0IGdhcCA9IChoZWlnaHQgLSBwYWRkaW5nICogMikgLyAxMFxuICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjNTU5ZTdkJ1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IDEwOyBpKyspIHtcbiAgICAgIGNvbnN0IHkgPSBNYXRoLnJvdW5kKHBhZGRpbmcgKyBnYXAgKiBpKSAtIDAuNVxuICAgICAgY3R4LmJlZ2luUGF0aCgpXG4gICAgICBjb25zdCBsaW5lV2lkdGggPSBbIDAsIDUsIDEwIF0uaW5jbHVkZXMoaSkgPyB3aWR0aCA6ICh3aWR0aCAqIDAuOSlcbiAgICAgIGN0eC5tb3ZlVG8oKHdpZHRoIC0gbGluZVdpZHRoKSAvIDEsIHkpXG4gICAgICBjdHgubGluZVRvKGxpbmVXaWR0aCwgeSlcbiAgICAgIGN0eC5zdHJva2UoKVxuICAgICAgY3R4LmNsb3NlUGF0aCgpXG4gICAgfVxuICAgIGN0eC5jbGVhclJlY3Qod2lkdGggLyAyIC0gNSwgMCwgOSwgaGVpZ2h0KVxuICB9XG5cbiAgY2FsY3VsYXRlVG9wICgpIHtcbiAgICByZXR1cm4gYCR7dGhpcy51dGlscy5tYXBWYWx1ZSh0aGlzLl92YWx1ZSwgdGhpcy5taW4sIHRoaXMubWF4LCBwYXJzZUludCh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0KSAtIDI1LCAwKX1weGBcbiAgfVxufVxuIl19
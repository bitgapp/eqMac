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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tldW9tb3JwaC1zbGlkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2NvbXBvbmVudHMvc2tldW9tb3JwaC1zbGlkZXIvc2tldW9tb3JwaC1zbGlkZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULEtBQUssRUFDTCxNQUFNLEVBQ04sVUFBVSxFQUNWLFlBQVksRUFDWixTQUFTLEVBQ1QsWUFBWSxFQUNaLFdBQVcsRUFDWixNQUFNLGVBQWUsQ0FBQTtBQUN0QixPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2pCLE1BQU0sa0NBQWtDLENBQUE7QUFZekMsTUFBTSxPQUFPLHlCQUF5QjtJQUNwQyxZQUFvQixLQUF1QixFQUFTLEtBQWlCO1FBQWpELFVBQUssR0FBTCxLQUFLLENBQWtCO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQUU1RCxRQUFHLEdBQVcsQ0FBQyxDQUFBO1FBQ2YsUUFBRyxHQUFXLENBQUMsQ0FBQTtRQUNmLHNCQUFpQixHQUFHLEdBQUcsQ0FBQTtRQUN2QixpQkFBWSxHQUFHLEVBQUUsQ0FBQTtRQUNqQixrQkFBYSxHQUFHLElBQUksQ0FBQTtRQUVwQixrQkFBYSxHQUFHLEtBQUssQ0FBQTtRQUNwQixvQkFBZSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUE7UUFNdkMsYUFBUSxHQUFHLEtBQUssQ0FBQTtRQUliLHFCQUFnQixHQUFHLElBQUksWUFBWSxFQUFxQyxDQUFBO1FBQ3hFLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQTtRQUNqQyxnQkFBVyxHQUFHLElBQUksQ0FBQTtRQUVhLGFBQVEsR0FBRyxLQUFLLENBQUE7UUFFakQsV0FBTSxHQUFHLEdBQUcsQ0FBQTtJQXpCcUQsQ0FBQztJQVd6RSxJQUFJLFdBQVc7UUFDYixPQUFPLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ2xGLENBQUM7SUFhRCxJQUNJLEtBQUssQ0FBRSxRQUFRO1FBQ2pCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUE7UUFFckMsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3RCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUE7WUFFcEMsSUFBSSxjQUFjLEdBQUcsV0FBVyxHQUFHLEtBQUssQ0FBQTtZQUN4QyxJQUFJLGNBQWMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3RCLGNBQWMsSUFBSSxDQUFDLENBQUMsQ0FBQTthQUNyQjtZQUNELE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFBO1lBQzdGLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLGNBQWMsR0FBRyxDQUFDLEVBQUU7Z0JBQy9FLEtBQUssR0FBRyxXQUFXLENBQUE7YUFDcEI7aUJBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsV0FBVyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLFdBQVcsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN6SCxJQUFJLGNBQWMsR0FBRyxDQUFDLEVBQUU7b0JBQ3RCLEtBQUssR0FBRyxXQUFXLENBQUE7b0JBQ25CLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUE7aUJBQzVCO2FBQ0Y7U0FDRjtRQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNwQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDcEMsQ0FBQztJQUVELElBQUksS0FBSyxLQUFNLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQSxDQUFDLENBQUM7SUFHbkMsWUFBWSxDQUFFLEtBQWlCO1FBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDeEMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFBO1lBQ2pDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUE7U0FDbEQ7SUFDSCxDQUFDO0lBRU0sc0JBQXNCLENBQUUsS0FBaUI7UUFDOUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQTtRQUMvRixNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFBO1FBQ2xCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQTtRQUNwRCxNQUFNLE9BQU8sR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFBO1FBQzdCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLE1BQU0sR0FBRyxPQUFPLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQ3hHLE9BQU8sS0FBSyxDQUFBO0lBQ2QsQ0FBQztJQUVNLFVBQVUsQ0FBRSxLQUFhO1FBQzlCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDcEIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFBO1NBQ2hCO2FBQU0sSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUMzQixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUE7U0FDaEI7YUFBTTtZQUNMLE9BQU8sS0FBSyxDQUFBO1NBQ2I7SUFDSCxDQUFDO0lBR0QsV0FBVyxDQUFFLEtBQWlCO1FBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO1lBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFO29CQUN4QyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsU0FBUyxDQUFBO29CQUNuQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtvQkFDL0MsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQTtnQkFDbkQsQ0FBQyxFQUFFLEdBQUcsQ0FBc0IsQ0FBQTthQUM3QjtTQUNGO0lBQ0gsQ0FBQztJQUdELFdBQVcsQ0FBRSxLQUFpQjtRQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ25DLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQy9DLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUE7U0FDbEQ7SUFDSCxDQUFDO0lBR0QsU0FBUztRQUNQLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO0lBQ3ZCLENBQUM7SUFHRCxZQUFZO1FBQ1YsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUE7SUFDdkIsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNsQixJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtnQkFDM0IsWUFBWSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO2FBQ3RDO1lBRUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQztnQkFDekIsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXO2dCQUN2QixVQUFVLEVBQUUsSUFBSTthQUNqQixDQUFDLENBQUE7WUFDRixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1NBQ2pEO0lBQ0gsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFBO1lBQ2xCLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQTtTQUNyQztJQUNILENBQUM7SUFFSyxhQUFhLENBQUUsSUFBWSxFQUFFLEVBQVU7O1lBQzNDLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQzVCLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ3hCLE1BQU0sSUFBSSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUE7WUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUE7WUFDdEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsQ0FBQTtZQUNsRSxNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFBO1lBQzFCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQTtZQUNoQixLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUMzQyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUM3QixLQUFLLElBQUksSUFBSSxDQUFBO2dCQUNiLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO2FBQ25CO1FBQ0gsQ0FBQztLQUFBO0lBR0QsV0FBVztRQUNULE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFBO1FBQ3pDLE1BQU0sR0FBRyxHQUE2QixNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzdELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQTtRQUNwRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUE7UUFDbEQsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7UUFDdEIsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7UUFDcEIsTUFBTSxPQUFPLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQTtRQUM3QixNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ3ZDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFBO1FBQzNCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDNUIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtZQUM3QyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUE7WUFDZixNQUFNLFNBQVMsR0FBRyxDQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFBO1lBQ2xFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1lBQ3RDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFBO1lBQ3hCLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtZQUNaLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtTQUNoQjtRQUNELEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQTtJQUM1QyxDQUFDO0lBRUQsWUFBWTtRQUNWLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUE7SUFDN0gsQ0FBQzs7O1lBbkxGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsdUJBQXVCO2dCQUNqQyxnUUFBaUQ7O2FBRWxEOzs7WUFaQyxnQkFBZ0I7WUFQaEIsVUFBVTs7O2tCQXVCVCxLQUFLO2tCQUNMLEtBQUs7Z0NBQ0wsS0FBSzsyQkFDTCxLQUFLOzRCQUNMLEtBQUs7cUJBQ0wsS0FBSzs0QkFDTCxLQUFLOzhCQUNMLE1BQU07c0JBU04sU0FBUyxTQUFDLFNBQVMsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7K0JBQ3JDLE1BQU07MEJBQ04sTUFBTTswQkFDTixLQUFLO3VCQUVMLFdBQVcsU0FBQyxnQkFBZ0IsY0FBRyxLQUFLO29CQUdwQyxLQUFLOzJCQTJCTCxZQUFZLFNBQUMsWUFBWSxFQUFFLENBQUUsUUFBUSxDQUFFOzBCQTJCdkMsWUFBWSxTQUFDLFdBQVcsRUFBRSxDQUFFLFFBQVEsQ0FBRTswQkFjdEMsWUFBWSxTQUFDLFdBQVcsRUFBRSxDQUFFLFFBQVEsQ0FBRTt3QkFRdEMsWUFBWSxTQUFDLFNBQVM7MkJBS3RCLFlBQVksU0FBQyxZQUFZOzBCQXlDekIsWUFBWSxTQUFDLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRWxlbWVudFJlZixcbiAgSG9zdExpc3RlbmVyLFxuICBWaWV3Q2hpbGQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdEJpbmRpbmdcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7XG4gIFV0aWxpdGllc1NlcnZpY2Vcbn0gZnJvbSAnLi4vLi4vc2VydmljZXMvdXRpbGl0aWVzLnNlcnZpY2UnXG5cbmV4cG9ydCBpbnRlcmZhY2UgU2tldW9tb3JwaFNsaWRlclZhbHVlQ2hhbmdlZEV2ZW50IHtcbiAgdmFsdWU6IG51bWJlclxuICB0cmFuc2l0aW9uPzogYm9vbGVhblxufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdlcW0tc2tldW9tb3JwaC1zbGlkZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vc2tldW9tb3JwaC1zbGlkZXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsgJy4vc2tldW9tb3JwaC1zbGlkZXIuY29tcG9uZW50LnNjc3MnIF1cbn0pXG5leHBvcnQgY2xhc3MgU2tldW9tb3JwaFNsaWRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGNvbnN0cnVjdG9yIChwdWJsaWMgdXRpbHM6IFV0aWxpdGllc1NlcnZpY2UsIHB1YmxpYyBlbFJlZjogRWxlbWVudFJlZikge31cblxuICBASW5wdXQoKSBtaW46IG51bWJlciA9IDBcbiAgQElucHV0KCkgbWF4OiBudW1iZXIgPSAxXG4gIEBJbnB1dCgpIGFuaW1hdGlvbkR1cmF0aW9uID0gNTAwXG4gIEBJbnB1dCgpIGFuaW1hdGlvbkZwcyA9IDMwXG4gIEBJbnB1dCgpIHNjcm9sbEVuYWJsZWQgPSB0cnVlXG4gIEBJbnB1dCgpIG1pZGRsZT86IG51bWJlclxuICBASW5wdXQoKSBzdGlja1RvTWlkZGxlID0gZmFsc2VcbiAgQE91dHB1dCgpIHN0aWNrZWRUb01pZGRsZSA9IG5ldyBFdmVudEVtaXR0ZXIoKVxuXG4gIGdldCBtaWRkbGVWYWx1ZSAoKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGlzLm1pZGRsZSA9PT0gJ251bWJlcicgPyB0aGlzLm1pZGRsZSA6ICh0aGlzLm1pbiArIHRoaXMubWF4KSAvIDJcbiAgfVxuXG4gIHB1YmxpYyBkcmFnZ2luZyA9IGZhbHNlXG4gIHB1YmxpYyBkb3VibGVjbGlja1RpbWVvdXQ/OiBudW1iZXJcblxuICBAVmlld0NoaWxkKCdub3RjaGVzJywgeyBzdGF0aWM6IHRydWUgfSkgbm90Y2hlcyE6IEVsZW1lbnRSZWZcbiAgQE91dHB1dCgpIHVzZXJDaGFuZ2VkVmFsdWUgPSBuZXcgRXZlbnRFbWl0dGVyPFNrZXVvbW9ycGhTbGlkZXJWYWx1ZUNoYW5nZWRFdmVudD4oKVxuICBAT3V0cHV0KCkgdmFsdWVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKClcbiAgQElucHV0KCkgc2hvd05vdGNoZXMgPSB0cnVlXG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5kaXNhYmxlZCcpIEBJbnB1dCgpIGRpc2FibGVkID0gZmFsc2VcblxuICBwdWJsaWMgX3ZhbHVlID0gMC41XG4gIEBJbnB1dCgpXG4gIHNldCB2YWx1ZSAobmV3VmFsdWUpIHtcbiAgICBsZXQgdmFsdWUgPSB0aGlzLmNsYW1wVmFsdWUobmV3VmFsdWUpXG5cbiAgICBpZiAodGhpcy5zdGlja1RvTWlkZGxlKSB7XG4gICAgICBjb25zdCBtaWRkbGVWYWx1ZSA9IHRoaXMubWlkZGxlVmFsdWVcblxuICAgICAgbGV0IGRpZmZGcm9tTWlkZGxlID0gbWlkZGxlVmFsdWUgLSB2YWx1ZVxuICAgICAgaWYgKGRpZmZGcm9tTWlkZGxlIDwgMCkge1xuICAgICAgICBkaWZmRnJvbU1pZGRsZSAqPSAtMVxuICAgICAgfVxuICAgICAgY29uc3QgcGVyY0Zyb21NaWRkbGUgPSB0aGlzLnV0aWxzLm1hcFZhbHVlKGRpZmZGcm9tTWlkZGxlLCAwLCB0aGlzLm1heCAtIG1pZGRsZVZhbHVlLCAwLCAxMDApXG4gICAgICBpZiAoKHRoaXMuX3ZhbHVlKS50b0ZpeGVkKDIpID09PSAobWlkZGxlVmFsdWUpLnRvRml4ZWQoMikgJiYgcGVyY0Zyb21NaWRkbGUgPCA1KSB7XG4gICAgICAgIHZhbHVlID0gbWlkZGxlVmFsdWVcbiAgICAgIH0gZWxzZSBpZiAoKHRoaXMuX3ZhbHVlIDwgbWlkZGxlVmFsdWUgJiYgbmV3VmFsdWUgPiB0aGlzLl92YWx1ZSkgfHwgKHRoaXMuX3ZhbHVlID4gbWlkZGxlVmFsdWUgJiYgbmV3VmFsdWUgPCB0aGlzLl92YWx1ZSkpIHtcbiAgICAgICAgaWYgKHBlcmNGcm9tTWlkZGxlIDwgMykge1xuICAgICAgICAgIHZhbHVlID0gbWlkZGxlVmFsdWVcbiAgICAgICAgICB0aGlzLnN0aWNrZWRUb01pZGRsZS5lbWl0KClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl92YWx1ZSA9IHRoaXMuY2xhbXBWYWx1ZSh2YWx1ZSlcbiAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodGhpcy5fdmFsdWUpXG4gIH1cblxuICBnZXQgdmFsdWUgKCkgeyByZXR1cm4gdGhpcy5fdmFsdWUgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNld2hlZWwnLCBbICckZXZlbnQnIF0pXG4gIG9uTW91c2VXaGVlbCAoZXZlbnQ6IFdoZWVsRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgdGhpcy5zY3JvbGxFbmFibGVkKSB7XG4gICAgICB0aGlzLnZhbHVlICs9IC1ldmVudC5kZWx0YVkgLyAxMDBcbiAgICAgIHRoaXMudXNlckNoYW5nZWRWYWx1ZS5lbWl0KHsgdmFsdWU6IHRoaXMudmFsdWUgfSlcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0VmFsdWVGcm9tTW91c2VFdmVudCAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBjb25zdCBjb29yZHMgPSB0aGlzLnV0aWxzLmdldENvb3JkaW5hdGVzSW5zaWRlRWxlbWVudEZyb21FdmVudChldmVudCwgdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50KVxuICAgIGNvbnN0IHkgPSBjb29yZHMueVxuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHRcbiAgICBjb25zdCBwYWRkaW5nID0gaGVpZ2h0ICogMC4xMVxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5jbGFtcFZhbHVlKHRoaXMudXRpbHMubWFwVmFsdWUoeSwgaGVpZ2h0IC0gcGFkZGluZyAvIDIsIHBhZGRpbmcsIHRoaXMubWluLCB0aGlzLm1heCkpXG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cblxuICBwdWJsaWMgY2xhbXBWYWx1ZSAodmFsdWU6IG51bWJlcikge1xuICAgIGlmICh2YWx1ZSA8IHRoaXMubWluKSB7XG4gICAgICByZXR1cm4gdGhpcy5taW5cbiAgICB9IGVsc2UgaWYgKHZhbHVlID4gdGhpcy5tYXgpIHtcbiAgICAgIHJldHVybiB0aGlzLm1heFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdmFsdWVcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWRvd24nLCBbICckZXZlbnQnIF0pXG4gIG9uTW91c2VEb3duIChldmVudDogTW91c2VFdmVudCkge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWVcbiAgICAgIGlmICghdGhpcy5kb3VibGVjbGlja1RpbWVvdXQpIHtcbiAgICAgICAgdGhpcy5kb3VibGVjbGlja1RpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLmRvdWJsZWNsaWNrVGltZW91dCA9IHVuZGVmaW5lZFxuICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLmdldFZhbHVlRnJvbU1vdXNlRXZlbnQoZXZlbnQpXG4gICAgICAgICAgdGhpcy51c2VyQ2hhbmdlZFZhbHVlLmVtaXQoeyB2YWx1ZTogdGhpcy52YWx1ZSB9KVxuICAgICAgICB9LCAyMDApIGFzIHVua25vd24gYXMgbnVtYmVyXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2Vtb3ZlJywgWyAnJGV2ZW50JyBdKVxuICBvbk1vdXNlTW92ZSAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgdGhpcy5kcmFnZ2luZykge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuZ2V0VmFsdWVGcm9tTW91c2VFdmVudChldmVudClcbiAgICAgIHRoaXMudXNlckNoYW5nZWRWYWx1ZS5lbWl0KHsgdmFsdWU6IHRoaXMudmFsdWUgfSlcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZXVwJylcbiAgb25Nb3VzZVVwICgpIHtcbiAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlbGVhdmUnKVxuICBvbk1vdXNlTGVhdmUgKCkge1xuICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxuICB9XG5cbiAgZG91YmxlY2xpY2sgKCkge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgaWYgKHRoaXMuZG91YmxlY2xpY2tUaW1lb3V0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmRvdWJsZWNsaWNrVGltZW91dClcbiAgICAgIH1cblxuICAgICAgdGhpcy51c2VyQ2hhbmdlZFZhbHVlLmVtaXQoe1xuICAgICAgICB2YWx1ZTogdGhpcy5taWRkbGVWYWx1ZSxcbiAgICAgICAgdHJhbnNpdGlvbjogdHJ1ZVxuICAgICAgfSlcbiAgICAgIHRoaXMuYW5pbWF0ZVNsaWRlcih0aGlzLnZhbHVlLCB0aGlzLm1pZGRsZVZhbHVlKVxuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0ICgpIHtcbiAgICBpZiAodGhpcy5zaG93Tm90Y2hlcykge1xuICAgICAgdGhpcy5kcmF3Tm90Y2hlcygpXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZHJhd05vdGNoZXMoKSlcbiAgICB9XG4gIH1cblxuICBhc3luYyBhbmltYXRlU2xpZGVyIChmcm9tOiBudW1iZXIsIHRvOiBudW1iZXIpIHtcbiAgICBmcm9tID0gdGhpcy5jbGFtcFZhbHVlKGZyb20pXG4gICAgdG8gPSB0aGlzLmNsYW1wVmFsdWUodG8pXG4gICAgY29uc3QgZGlmZiA9IHRvIC0gZnJvbVxuICAgIGNvbnN0IGRlbGF5ID0gMTAwMCAvIHRoaXMuYW5pbWF0aW9uRnBzXG4gICAgY29uc3QgZnJhbWVzID0gdGhpcy5hbmltYXRpb25GcHMgKiAodGhpcy5hbmltYXRpb25EdXJhdGlvbiAvIDEwMDApXG4gICAgY29uc3Qgc3RlcCA9IGRpZmYgLyBmcmFtZXNcbiAgICBsZXQgdmFsdWUgPSBmcm9tXG4gICAgZm9yIChsZXQgZnJhbWUgPSAwOyBmcmFtZSA8IGZyYW1lczsgZnJhbWUrKykge1xuICAgICAgYXdhaXQgdGhpcy51dGlscy5kZWxheShkZWxheSlcbiAgICAgIHZhbHVlICs9IHN0ZXBcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZVxuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpyZXNpemUnKVxuICBkcmF3Tm90Y2hlcyAoKSB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5ub3RjaGVzLm5hdGl2ZUVsZW1lbnRcbiAgICBjb25zdCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodFxuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoXG4gICAgY2FudmFzLmhlaWdodCA9IGhlaWdodFxuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoXG4gICAgY29uc3QgcGFkZGluZyA9IGhlaWdodCAqIDAuMDhcbiAgICBjb25zdCBnYXAgPSAoaGVpZ2h0IC0gcGFkZGluZyAqIDIpIC8gMTBcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzU1OWU3ZCdcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSAxMDsgaSsrKSB7XG4gICAgICBjb25zdCB5ID0gTWF0aC5yb3VuZChwYWRkaW5nICsgZ2FwICogaSkgLSAwLjVcbiAgICAgIGN0eC5iZWdpblBhdGgoKVxuICAgICAgY29uc3QgbGluZVdpZHRoID0gWyAwLCA1LCAxMCBdLmluY2x1ZGVzKGkpID8gd2lkdGggOiAod2lkdGggKiAwLjkpXG4gICAgICBjdHgubW92ZVRvKCh3aWR0aCAtIGxpbmVXaWR0aCkgLyAxLCB5KVxuICAgICAgY3R4LmxpbmVUbyhsaW5lV2lkdGgsIHkpXG4gICAgICBjdHguc3Ryb2tlKClcbiAgICAgIGN0eC5jbG9zZVBhdGgoKVxuICAgIH1cbiAgICBjdHguY2xlYXJSZWN0KHdpZHRoIC8gMiAtIDUsIDAsIDksIGhlaWdodClcbiAgfVxuXG4gIGNhbGN1bGF0ZVRvcCAoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMudXRpbHMubWFwVmFsdWUodGhpcy5fdmFsdWUsIHRoaXMubWluLCB0aGlzLm1heCwgcGFyc2VJbnQodGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodCkgLSAyNSwgMCl9cHhgXG4gIH1cbn1cbiJdfQ==
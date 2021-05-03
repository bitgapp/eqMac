import { OnInit, EventEmitter, ElementRef } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';
import * as ɵngcc0 from '@angular/core';
export interface KnobValueChangedEvent {
    value: number;
    transition?: boolean;
}
export declare class KnobComponent implements OnInit {
    utils: UtilitiesService;
    size: 'large' | 'medium' | 'small';
    showScale: boolean;
    _min: number;
    set min(newMin: number);
    get min(): number;
    _max: number;
    set max(newMax: number);
    get max(): number;
    disabled: boolean;
    doubleClickToAnimateToMiddle: boolean;
    animationDuration: number;
    animationFps: number;
    animatingToMiddle: EventEmitter<any>;
    stickToMiddle: boolean;
    stickedToMiddle: EventEmitter<any>;
    dragging: boolean;
    setDraggingFalseTimeout: any;
    continueAnimation: boolean;
    dragStartDegr: number;
    containerRef: ElementRef;
    container: HTMLDivElement;
    _value: number;
    valueChange: EventEmitter<number>;
    userChangedValue: EventEmitter<KnobValueChangedEvent>;
    set value(newValue: number);
    get value(): number;
    middleValue: number;
    calculateMiddleValue(): number;
    constructor(utils: UtilitiesService);
    ngOnInit(): Promise<void>;
    mouseWheel(event: WheelEvent): void;
    mousedown(event: MouseEvent): void;
    onMouseLeave(): void;
    onGestureChange(event: any): void;
    mousemove(event: MouseEvent): void;
    mouseup(event: MouseEvent): void;
    doubleclick(): void;
    largeCapMaxAngle: number;
    get largeCapClipPathStyle(): {
        transform: string;
        'transform-origin': string;
    };
    get largeCapIndicatorStyle(): {
        transform: string;
    };
    get largeCapBodyStyle(): {};
    mediumCapMaxAngle: number;
    get mediumCapIndicatorStyle(): {
        transform: string;
    };
    smallCapMaxAngle: number;
    get smallCapIndicatorStyle(): {
        transform: string;
    };
    animateKnob(from: number, to: number): Promise<void>;
    getDegreesFromEvent(event: MouseEvent): number;
    getDistanceFromCenterOfElementAndEvent(event: MouseEvent): number;
    clampValue(value: number): number;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<KnobComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<KnobComponent, "eqm-knob", never, { "size": "size"; "showScale": "showScale"; "disabled": "disabled"; "doubleClickToAnimateToMiddle": "doubleClickToAnimateToMiddle"; "animationDuration": "animationDuration"; "animationFps": "animationFps"; "stickToMiddle": "stickToMiddle"; "min": "min"; "max": "max"; "value": "value"; }, { "animatingToMiddle": "animatingToMiddle"; "stickedToMiddle": "stickedToMiddle"; "valueChange": "valueChange"; "userChangedValue": "userChangedValue"; }, never, never>;
}

//# sourceMappingURL=knob.component.d.ts.map
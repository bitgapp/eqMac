import { EventEmitter, ElementRef } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as ɵngcc0 from '@angular/core';
export interface FlatSliderValueChangedEvent {
    value: number;
    transition?: boolean;
}
export declare class FlatSliderComponent {
    utils: UtilitiesService;
    elem: ElementRef;
    sanitizer: DomSanitizer;
    constructor(utils: UtilitiesService, elem: ElementRef, sanitizer: DomSanitizer);
    scale: 'logarithmic' | 'linear';
    doubleClickToAnimateToMiddle: boolean;
    showMiddleNotch: boolean;
    min: number;
    max: number;
    animationDuration: number;
    animationFps: number;
    scrollEnabled: boolean;
    middle?: number;
    stickToMiddle: boolean;
    thickness: number;
    orientation: 'vertical' | 'horizontal';
    stickedToMiddle: EventEmitter<any>;
    containerRef: ElementRef;
    get middleValue(): number;
    defaultColor: string;
    _enabled: boolean;
    get disabled(): boolean;
    set enabled(shouldBeEnabled: boolean);
    get enabled(): boolean;
    _color: string;
    set color(newColor: string);
    get color(): string;
    get darkerColor(): string;
    dragging: boolean;
    thumbRadius: number;
    _value: number;
    set value(newValue: number);
    get value(): number;
    valueChange: EventEmitter<any>;
    userChangedValue: EventEmitter<FlatSliderValueChangedEvent>;
    get height(): any;
    get width(): any;
    clampValue(value: number): number;
    mouseWheel(event: WheelEvent): void;
    getValueFromMouseEvent(event: MouseEvent): number;
    mousedown(event: MouseEvent): void;
    mousemove(event: MouseEvent): void;
    mouseInside: boolean;
    onMouseEnter(): void;
    onMouseLeave(): void;
    doubleclickTimeout?: number;
    doubleclick(): void;
    animateSlider(from: number, to: number): Promise<void>;
    onMouseUp(event: MouseEvent): void;
    mouseup(event: MouseEvent): void;
    get progress(): number;
    get containerStyle(): {
        [style: string]: string;
    };
    get grooveStyle(): {
        [style: string]: string | number;
    };
    get grooveFillingStyle(): {
        [style: string]: string;
    };
    get thumbNotchStyle(): {
        [style: string]: string | number;
    };
    get thumbStyle(): {
        [style: string]: string | number;
    };
    private mapValue;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<FlatSliderComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<FlatSliderComponent, "eqm-flat-slider", never, { "scale": "scale"; "doubleClickToAnimateToMiddle": "doubleClickToAnimateToMiddle"; "showMiddleNotch": "showMiddleNotch"; "min": "min"; "max": "max"; "animationDuration": "animationDuration"; "animationFps": "animationFps"; "scrollEnabled": "scrollEnabled"; "stickToMiddle": "stickToMiddle"; "thickness": "thickness"; "orientation": "orientation"; "enabled": "enabled"; "color": "color"; "value": "value"; "middle": "middle"; }, { "stickedToMiddle": "stickedToMiddle"; "valueChange": "valueChange"; "userChangedValue": "userChangedValue"; }, never, never>;
}

//# sourceMappingURL=flat-slider.component.d.ts.map
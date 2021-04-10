import { OnInit, ElementRef, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';
import * as i0 from "@angular/core";
export interface SkeuomorphSliderValueChangedEvent {
    value: number;
    transition?: boolean;
}
export declare class SkeuomorphSliderComponent implements OnInit {
    utils: UtilitiesService;
    elRef: ElementRef;
    constructor(utils: UtilitiesService, elRef: ElementRef);
    min: number;
    max: number;
    animationDuration: number;
    animationFps: number;
    scrollEnabled: boolean;
    middle?: number;
    stickToMiddle: boolean;
    stickedToMiddle: EventEmitter<any>;
    get middleValue(): number;
    dragging: boolean;
    doubleclickTimeout?: number;
    notches: ElementRef;
    userChangedValue: EventEmitter<SkeuomorphSliderValueChangedEvent>;
    valueChange: EventEmitter<any>;
    showNotches: boolean;
    disabled: boolean;
    _value: number;
    set value(newValue: number);
    get value(): number;
    onMouseWheel(event: WheelEvent): void;
    getValueFromMouseEvent(event: MouseEvent): number;
    clampValue(value: number): number;
    onMouseDown(event: MouseEvent): void;
    onMouseMove(event: MouseEvent): void;
    onMouseUp(): void;
    onMouseLeave(): void;
    doubleclick(): void;
    ngOnInit(): void;
    animateSlider(from: number, to: number): Promise<void>;
    drawNotches(): void;
    calculateTop(): string;
    static ɵfac: i0.ɵɵFactoryDef<SkeuomorphSliderComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<SkeuomorphSliderComponent, "eqm-skeuomorph-slider", never, { "min": "min"; "max": "max"; "animationDuration": "animationDuration"; "animationFps": "animationFps"; "scrollEnabled": "scrollEnabled"; "middle": "middle"; "stickToMiddle": "stickToMiddle"; "showNotches": "showNotches"; "disabled": "disabled"; "value": "value"; }, { "stickedToMiddle": "stickedToMiddle"; "userChangedValue": "userChangedValue"; "valueChange": "valueChange"; }, never, never>;
}
//# sourceMappingURL=skeuomorph-slider.component.d.ts.map
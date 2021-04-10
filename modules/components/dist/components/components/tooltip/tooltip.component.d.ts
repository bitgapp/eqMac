import { OnInit, ElementRef } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as i0 from "@angular/core";
export declare type TooltipPositionSide = 'top' | 'bottom' | 'left' | 'right';
export declare class TooltipComponent implements OnInit {
    elem: ElementRef;
    utils: UtilitiesService;
    sanitizer: DomSanitizer;
    text?: string;
    parent?: any;
    positionSide: TooltipPositionSide;
    showArrow: Boolean;
    padding: number;
    arrow: ElementRef;
    tooltip: ElementRef;
    constructor(elem: ElementRef, utils: UtilitiesService, sanitizer: DomSanitizer);
    ngOnInit(): Promise<void>;
    get style(): {
        display: string;
        left?: undefined;
        top?: undefined;
    } | {
        left: string;
        top: string;
        display?: undefined;
    };
    get arrowStyle(): {
        [style: string]: string;
    };
    static ɵfac: i0.ɵɵFactoryDef<TooltipComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<TooltipComponent, "eqm-tooltip", never, { "text": "text"; "parent": "parent"; "positionSide": "positionSide"; "showArrow": "showArrow"; }, {}, never, ["*"]>;
}
//# sourceMappingURL=tooltip.component.d.ts.map
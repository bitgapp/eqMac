import { OnDestroy, ElementRef } from '@angular/core';
import { TooltipService } from './tooltip.service';
import { TooltipPositionSide } from './tooltip.component';
import * as i0 from "@angular/core";
export declare class TooltipDirective implements OnDestroy {
    tooltipService: TooltipService;
    element: ElementRef;
    eqmTooltip: string;
    eqmTooltipDelay: number;
    eqmTooltipPositionSide: TooltipPositionSide;
    eqmTooltipShowArrow: boolean;
    id?: string;
    left?: boolean;
    constructor(tooltipService: TooltipService, element: ElementRef);
    onMouseEnter(): void;
    onMouseLeave(): void;
    onMouseClick(): void;
    ngOnDestroy(): void;
    destroy(): void;
    static ɵfac: i0.ɵɵFactoryDef<TooltipDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDefWithMeta<TooltipDirective, "[eqmTooltip]", never, { "eqmTooltip": "eqmTooltip"; "eqmTooltipDelay": "eqmTooltipDelay"; "eqmTooltipPositionSide": "eqmTooltipPositionSide"; "eqmTooltipShowArrow": "eqmTooltipShowArrow"; }, {}, never>;
}
//# sourceMappingURL=tooltip.directive.d.ts.map
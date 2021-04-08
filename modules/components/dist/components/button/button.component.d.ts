import { OnInit, EventEmitter } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class ButtonComponent implements OnInit {
    type: 'large' | 'narrow' | 'square' | 'circle' | 'transparent';
    height: any;
    width: any;
    state: boolean;
    toggle: boolean;
    depressable: boolean;
    hoverable: boolean;
    disabled: boolean;
    pressed: EventEmitter<any>;
    ngOnInit(): void;
    get style(): {
        width: string;
        height: string;
    };
    computeClass(): string;
    click(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ButtonComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<ButtonComponent, "eqm-button", never, { "type": "type"; "height": "height"; "width": "width"; "state": "state"; "toggle": "toggle"; "depressable": "depressable"; "hoverable": "hoverable"; "disabled": "disabled"; }, { "pressed": "pressed"; }, never, ["*"]>;
}

//# sourceMappingURL=button.component.d.ts.map
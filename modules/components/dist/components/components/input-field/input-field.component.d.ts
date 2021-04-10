import { OnInit, EventEmitter, ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class InputFieldComponent implements OnInit {
    text?: string;
    placeholder: string;
    textChange: EventEmitter<any>;
    enter: EventEmitter<any>;
    editable: boolean;
    disabled: boolean;
    fontSize: number;
    container: ElementRef;
    ngOnInit(): void;
    inputChanged(): void;
    enterPressed(): void;
    static ɵfac: i0.ɵɵFactoryDef<InputFieldComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<InputFieldComponent, "eqm-input-field", never, { "text": "text"; "placeholder": "placeholder"; "editable": "editable"; "disabled": "disabled"; "fontSize": "fontSize"; }, { "textChange": "textChange"; "enter": "enter"; }, never, never>;
}
//# sourceMappingURL=input-field.component.d.ts.map
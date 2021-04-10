import * as i0 from "@angular/core";
export declare class UtilitiesService {
    mapValue(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number;
    logMapValue({ value, inMin, inMax, outMin, outMax }: {
        value: number;
        inMin: number;
        inMax: number;
        outMin: number;
        outMax: number;
    }): number;
    logMapValueInverse({ value, inMin, inMax, outMin, outMax }: {
        value: number;
        inMin: number;
        inMax: number;
        outMin: number;
        outMax: number;
    }): number;
    getImageFromSrcWhenLoaded(src: string): Promise<HTMLImageElement>;
    getBackgroundImageSrcFromClass(className: string): string;
    getImageFromClassBackgroundImageSrcWhenLoaded(className: string): Promise<HTMLImageElement>;
    getRandomFloatInRange(min: number, max: number): number;
    getCoordinatesInsideElementFromEvent(event: MouseEvent, element?: HTMLElement): {
        x: number;
        y: number;
    };
    delay(ms: number): Promise<unknown>;
    getElementPosition(el: HTMLElement): {
        y: number;
        x: number;
    };
    hexToRgb(hex: string): {
        b: any;
        g: any;
        r: any;
    };
    rgbToHex({ r, g, b }: {
        r: number;
        g: number;
        b: number;
    }): string;
    static ɵfac: i0.ɵɵFactoryDef<UtilitiesService, never>;
    static ɵprov: i0.ɵɵInjectableDef<UtilitiesService>;
}
//# sourceMappingURL=utilities.service.d.ts.map
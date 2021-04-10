import { EventEmitter, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class BreadcrumbsComponent implements OnInit {
    crumbs: string[];
    underline: boolean;
    crumbClicked: EventEmitter<{
        crumb: string;
        index: number;
    }>;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDef<BreadcrumbsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<BreadcrumbsComponent, "eqm-breadcrumbs", never, { "crumbs": "crumbs"; "underline": "underline"; }, { "crumbClicked": "crumbClicked"; }, never, never>;
}
//# sourceMappingURL=breadcrumbs.component.d.ts.map
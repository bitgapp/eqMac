import { EventEmitter, OnInit } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class BreadcrumbsComponent implements OnInit {
    crumbs: string[];
    underline: boolean;
    crumbClicked: EventEmitter<{
        crumb: string;
        index: number;
    }>;
    ngOnInit(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BreadcrumbsComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<BreadcrumbsComponent, "eqm-breadcrumbs", never, { "underline": "underline"; "crumbs": "crumbs"; }, { "crumbClicked": "crumbClicked"; }, never, never>;
}

//# sourceMappingURL=breadcrumbs.component.d.ts.map
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { svgs } from './icons';
import * as i0 from "@angular/core";
import * as i1 from "@angular/platform-browser";
import * as i2 from "@angular/common";
export class IconComponent {
    constructor(sanitizer) {
        this.sanitizer = sanitizer;
        this.width = 20;
        this.height = 20;
        this.icons = svgs;
        this._color = '#979aa0';
        this._strokeColor = this._color;
        this._rotate = 0;
        this.stroke = 0;
    }
    set size(newSize) {
        this.width = newSize;
        this.height = newSize;
    }
    set color(newColor) {
        if (newColor && newColor !== '') {
            this._color = newColor;
        }
        else {
            this._color = '#979aa0';
        }
    }
    set strokeColor(newColor) {
        if (newColor && newColor !== '') {
            this._strokeColor = newColor;
        }
        else {
            this._strokeColor = this._color;
        }
    }
    get rotate() {
        return this._rotate;
    }
    set rotate(angle) {
        this._rotate = angle;
    }
    set name(iconName) {
        this._name = iconName;
        this.svg = this.sanitizer.bypassSecurityTrustHtml(this.icons[this.name]);
    }
    get name() { return this._name; }
    ngOnInit() {
    }
    get style() {
        const style = {};
        style.fill = `${this._color}`;
        style.display = 'block';
        style.margin = '0 auto';
        if (this.height >= 0) {
            style.height = `${this.height}px`;
        }
        if (this.height >= 0) {
            style.width = `${this.width}px`;
        }
        style.transform = `rotate(${this.rotate}deg)`;
        if (this.stroke) {
            style['stroke-width'] = `${this.stroke}px`;
            style.stroke = `${this._strokeColor}`;
        }
        return style;
    }
}
IconComponent.ɵfac = function IconComponent_Factory(t) { return new (t || IconComponent)(i0.ɵɵdirectiveInject(i1.DomSanitizer)); };
IconComponent.ɵcmp = i0.ɵɵdefineComponent({ type: IconComponent, selectors: [["eqm-icon"]], inputs: { width: "width", height: "height", size: "size", color: "color", strokeColor: "strokeColor", rotate: "rotate", name: "name", stroke: "stroke" }, decls: 1, vars: 2, consts: [[1, "container", 3, "ngStyle", "innerHtml"]], template: function IconComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelement(0, "div", 0);
    } if (rf & 2) {
        i0.ɵɵproperty("ngStyle", ctx.style)("innerHtml", ctx.svg, i0.ɵɵsanitizeHtml);
    } }, directives: [i2.NgStyle], styles: [".container{position:relative}.container svg{width:100%;height:100%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}"], encapsulation: 3 });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IconComponent, [{
        type: Component,
        args: [{
                selector: 'eqm-icon',
                templateUrl: './icon.component.html',
                styleUrls: ['./icon.component.scss'],
                encapsulation: ViewEncapsulation.ShadowDom
            }]
    }], function () { return [{ type: i1.DomSanitizer }]; }, { width: [{
            type: Input
        }], height: [{
            type: Input
        }], size: [{
            type: Input
        }], color: [{
            type: Input
        }], strokeColor: [{
            type: Input
        }], rotate: [{
            type: Input
        }], name: [{
            type: Input
        }], stroke: [{
            type: Input
        }] }); })();
export * from './icons';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL2ljb24vaWNvbi5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL2ljb24vaWNvbi5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULEtBQUssRUFDTCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUE7QUFDdEIsT0FBTyxFQUFFLElBQUksRUFBWSxNQUFNLFNBQVMsQ0FBQTs7OztBQVN4QyxNQUFNLE9BQU8sYUFBYTtJQW9EeEIsWUFBb0IsU0FBdUI7UUFBdkIsY0FBUyxHQUFULFNBQVMsQ0FBYztRQW5EbEMsVUFBSyxHQUFHLEVBQUUsQ0FBQTtRQUNWLFdBQU0sR0FBRyxFQUFFLENBQUE7UUFFcEIsVUFBSyxHQUFHLElBQUksQ0FBQTtRQU9aLFdBQU0sR0FBRyxTQUFTLENBQUE7UUFVbEIsaUJBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFBO1FBVW5CLFlBQU8sR0FBRyxDQUFDLENBQUE7UUFtQlQsV0FBTSxHQUFXLENBQUMsQ0FBQTtJQUVtQixDQUFDO0lBOUMvQyxJQUFhLElBQUksQ0FBRSxPQUFlO1FBQ2hDLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFBO1FBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFBO0lBQ3ZCLENBQUM7SUFHRCxJQUNJLEtBQUssQ0FBRSxRQUFnQjtRQUN6QixJQUFJLFFBQVEsSUFBSSxRQUFRLEtBQUssRUFBRSxFQUFFO1lBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFBO1NBQ3ZCO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQTtTQUN4QjtJQUNILENBQUM7SUFHRCxJQUNJLFdBQVcsQ0FBRSxRQUFnQjtRQUMvQixJQUFJLFFBQVEsSUFBSSxRQUFRLEtBQUssRUFBRSxFQUFFO1lBQy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFBO1NBQzdCO2FBQU07WUFDTCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUE7U0FDaEM7SUFDSCxDQUFDO0lBR0QsSUFDSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBO0lBQ3JCLENBQUM7SUFFRCxJQUFJLE1BQU0sQ0FBRSxLQUFhO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO0lBQ3RCLENBQUM7SUFHRCxJQUNJLElBQUksQ0FBRSxRQUFrQjtRQUMxQixJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQTtRQUNyQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUMxRSxDQUFDO0lBRUQsSUFBSSxJQUFJLEtBQU0sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQztJQUtqQyxRQUFRO0lBQ1IsQ0FBQztJQUVELElBQUksS0FBSztRQUNQLE1BQU0sS0FBSyxHQUFRLEVBQUUsQ0FBQTtRQUVyQixLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO1FBQzdCLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO1FBQ3ZCLEtBQUssQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFBO1FBQ3ZCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDcEIsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQTtTQUNsQztRQUNELElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDcEIsS0FBSyxDQUFDLEtBQUssR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQTtTQUNoQztRQUNELEtBQUssQ0FBQyxTQUFTLEdBQUcsVUFBVSxJQUFJLENBQUMsTUFBTSxNQUFNLENBQUE7UUFFN0MsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsS0FBSyxDQUFDLGNBQWMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFBO1lBQzFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7U0FDdEM7UUFFRCxPQUFPLEtBQUssQ0FBQTtJQUNkLENBQUM7OzBFQTVFVSxhQUFhO2tEQUFiLGFBQWE7UUNmMUIseUJBQWlFOztRQUExQyxtQ0FBaUIseUNBQUE7O3VGRGUzQixhQUFhO2NBTnpCLFNBQVM7ZUFBQztnQkFDVCxRQUFRLEVBQUUsVUFBVTtnQkFDcEIsV0FBVyxFQUFFLHVCQUF1QjtnQkFDcEMsU0FBUyxFQUFFLENBQUUsdUJBQXVCLENBQUU7Z0JBQ3RDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxTQUFTO2FBQzNDOytEQUVVLEtBQUs7a0JBQWIsS0FBSztZQUNHLE1BQU07a0JBQWQsS0FBSztZQUlPLElBQUk7a0JBQWhCLEtBQUs7WUFPRixLQUFLO2tCQURSLEtBQUs7WUFXRixXQUFXO2tCQURkLEtBQUs7WUFXRixNQUFNO2tCQURULEtBQUs7WUFXRixJQUFJO2tCQURQLEtBQUs7WUFRRyxNQUFNO2tCQUFkLEtBQUs7O0FBNkJSLGNBQWMsU0FBUyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBPbkluaXQsXG4gIElucHV0LFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuaW1wb3J0IHsgc3ZncywgSWNvbk5hbWUgfSBmcm9tICcuL2ljb25zJ1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyLCBTYWZlSHRtbCB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2VxbS1pY29uJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2ljb24uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsgJy4vaWNvbi5jb21wb25lbnQuc2NzcycgXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uU2hhZG93RG9tXG59KVxuZXhwb3J0IGNsYXNzIEljb25Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKSB3aWR0aCA9IDIwXG4gIEBJbnB1dCgpIGhlaWdodCA9IDIwXG4gIHN2Zz86IFNhZmVIdG1sXG4gIGljb25zID0gc3Znc1xuXG4gIEBJbnB1dCgpIHNldCBzaXplIChuZXdTaXplOiBudW1iZXIpIHtcbiAgICB0aGlzLndpZHRoID0gbmV3U2l6ZVxuICAgIHRoaXMuaGVpZ2h0ID0gbmV3U2l6ZVxuICB9XG5cbiAgX2NvbG9yID0gJyM5NzlhYTAnXG4gIEBJbnB1dCgpXG4gIHNldCBjb2xvciAobmV3Q29sb3I6IHN0cmluZykge1xuICAgIGlmIChuZXdDb2xvciAmJiBuZXdDb2xvciAhPT0gJycpIHtcbiAgICAgIHRoaXMuX2NvbG9yID0gbmV3Q29sb3JcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY29sb3IgPSAnIzk3OWFhMCdcbiAgICB9XG4gIH1cblxuICBfc3Ryb2tlQ29sb3IgPSB0aGlzLl9jb2xvclxuICBASW5wdXQoKVxuICBzZXQgc3Ryb2tlQ29sb3IgKG5ld0NvbG9yOiBzdHJpbmcpIHtcbiAgICBpZiAobmV3Q29sb3IgJiYgbmV3Q29sb3IgIT09ICcnKSB7XG4gICAgICB0aGlzLl9zdHJva2VDb2xvciA9IG5ld0NvbG9yXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3N0cm9rZUNvbG9yID0gdGhpcy5fY29sb3JcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgX3JvdGF0ZSA9IDBcbiAgQElucHV0KClcbiAgZ2V0IHJvdGF0ZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JvdGF0ZVxuICB9XG5cbiAgc2V0IHJvdGF0ZSAoYW5nbGU6IG51bWJlcikge1xuICAgIHRoaXMuX3JvdGF0ZSA9IGFuZ2xlXG4gIH1cblxuICBfbmFtZSE6IEljb25OYW1lXG4gIEBJbnB1dCgpXG4gIHNldCBuYW1lIChpY29uTmFtZTogSWNvbk5hbWUpIHtcbiAgICB0aGlzLl9uYW1lID0gaWNvbk5hbWVcbiAgICB0aGlzLnN2ZyA9IHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RIdG1sKHRoaXMuaWNvbnNbdGhpcy5uYW1lXSlcbiAgfVxuXG4gIGdldCBuYW1lICgpIHsgcmV0dXJuIHRoaXMuX25hbWUgfVxuXG4gIEBJbnB1dCgpIHN0cm9rZTogbnVtYmVyID0gMFxuXG4gIGNvbnN0cnVjdG9yIChwdWJsaWMgc2FuaXRpemVyOiBEb21TYW5pdGl6ZXIpIHt9XG4gIG5nT25Jbml0ICgpIHtcbiAgfVxuXG4gIGdldCBzdHlsZSAoKSB7XG4gICAgY29uc3Qgc3R5bGU6IGFueSA9IHt9XG5cbiAgICBzdHlsZS5maWxsID0gYCR7dGhpcy5fY29sb3J9YFxuICAgIHN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgc3R5bGUubWFyZ2luID0gJzAgYXV0bydcbiAgICBpZiAodGhpcy5oZWlnaHQgPj0gMCkge1xuICAgICAgc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5oZWlnaHR9cHhgXG4gICAgfVxuICAgIGlmICh0aGlzLmhlaWdodCA+PSAwKSB7XG4gICAgICBzdHlsZS53aWR0aCA9IGAke3RoaXMud2lkdGh9cHhgXG4gICAgfVxuICAgIHN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGUoJHt0aGlzLnJvdGF0ZX1kZWcpYFxuXG4gICAgaWYgKHRoaXMuc3Ryb2tlKSB7XG4gICAgICBzdHlsZVsnc3Ryb2tlLXdpZHRoJ10gPSBgJHt0aGlzLnN0cm9rZX1weGBcbiAgICAgIHN0eWxlLnN0cm9rZSA9IGAke3RoaXMuX3N0cm9rZUNvbG9yfWBcbiAgICB9XG5cbiAgICByZXR1cm4gc3R5bGVcbiAgfVxufVxuXG5leHBvcnQgKiBmcm9tICcuL2ljb25zJyIsIjxkaXYgY2xhc3M9XCJjb250YWluZXJcIiBbbmdTdHlsZV09XCJzdHlsZVwiIFtpbm5lckh0bWxdPVwic3ZnXCI+PC9kaXY+XG4iXX0=
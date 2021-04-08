import { Component, Input, ViewEncapsulation } from '@angular/core';
import { svgs } from './icons';
import { DomSanitizer } from '@angular/platform-browser';
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
IconComponent.decorators = [
    { type: Component, args: [{
                selector: 'eqm-icon',
                template: "<div class=\"container\" [ngStyle]=\"style\" [innerHtml]=\"svg\"></div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: [".container{position:relative}.container svg{width:100%;height:100%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}"]
            },] }
];
IconComponent.ctorParameters = () => [
    { type: DomSanitizer }
];
IconComponent.propDecorators = {
    width: [{ type: Input }],
    height: [{ type: Input }],
    size: [{ type: Input }],
    color: [{ type: Input }],
    strokeColor: [{ type: Input }],
    rotate: [{ type: Input }],
    name: [{ type: Input }],
    stroke: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvY29tcG9uZW50cy9pY29uL2ljb24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBRVQsS0FBSyxFQUNMLGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQTtBQUN0QixPQUFPLEVBQUUsSUFBSSxFQUFZLE1BQU0sU0FBUyxDQUFBO0FBQ3hDLE9BQU8sRUFBRSxZQUFZLEVBQVksTUFBTSwyQkFBMkIsQ0FBQTtBQVFsRSxNQUFNLE9BQU8sYUFBYTtJQW9EeEIsWUFBb0IsU0FBdUI7UUFBdkIsY0FBUyxHQUFULFNBQVMsQ0FBYztRQW5EbEMsVUFBSyxHQUFHLEVBQUUsQ0FBQTtRQUNWLFdBQU0sR0FBRyxFQUFFLENBQUE7UUFFcEIsVUFBSyxHQUFHLElBQUksQ0FBQTtRQU9aLFdBQU0sR0FBRyxTQUFTLENBQUE7UUFVbEIsaUJBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFBO1FBVW5CLFlBQU8sR0FBRyxDQUFDLENBQUE7UUFtQlQsV0FBTSxHQUFXLENBQUMsQ0FBQTtJQUVtQixDQUFDO0lBOUMvQyxJQUFhLElBQUksQ0FBRSxPQUFlO1FBQ2hDLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFBO1FBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFBO0lBQ3ZCLENBQUM7SUFHRCxJQUNJLEtBQUssQ0FBRSxRQUFnQjtRQUN6QixJQUFJLFFBQVEsSUFBSSxRQUFRLEtBQUssRUFBRSxFQUFFO1lBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFBO1NBQ3ZCO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQTtTQUN4QjtJQUNILENBQUM7SUFHRCxJQUNJLFdBQVcsQ0FBRSxRQUFnQjtRQUMvQixJQUFJLFFBQVEsSUFBSSxRQUFRLEtBQUssRUFBRSxFQUFFO1lBQy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFBO1NBQzdCO2FBQU07WUFDTCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUE7U0FDaEM7SUFDSCxDQUFDO0lBR0QsSUFDSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBO0lBQ3JCLENBQUM7SUFFRCxJQUFJLE1BQU0sQ0FBRSxLQUFhO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO0lBQ3RCLENBQUM7SUFHRCxJQUNJLElBQUksQ0FBRSxRQUFrQjtRQUMxQixJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQTtRQUNyQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUMxRSxDQUFDO0lBRUQsSUFBSSxJQUFJLEtBQU0sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQztJQUtqQyxRQUFRO0lBQ1IsQ0FBQztJQUVELElBQUksS0FBSztRQUNQLE1BQU0sS0FBSyxHQUFRLEVBQUUsQ0FBQTtRQUVyQixLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO1FBQzdCLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO1FBQ3ZCLEtBQUssQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFBO1FBQ3ZCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDcEIsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQTtTQUNsQztRQUNELElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDcEIsS0FBSyxDQUFDLEtBQUssR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQTtTQUNoQztRQUNELEtBQUssQ0FBQyxTQUFTLEdBQUcsVUFBVSxJQUFJLENBQUMsTUFBTSxNQUFNLENBQUE7UUFFN0MsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsS0FBSyxDQUFDLGNBQWMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFBO1lBQzFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7U0FDdEM7UUFFRCxPQUFPLEtBQUssQ0FBQTtJQUNkLENBQUM7OztZQWxGRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLHFGQUFvQztnQkFFcEMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLFNBQVM7O2FBQzNDOzs7WUFQUSxZQUFZOzs7b0JBU2xCLEtBQUs7cUJBQ0wsS0FBSzttQkFJTCxLQUFLO29CQU1MLEtBQUs7MEJBVUwsS0FBSztxQkFVTCxLQUFLO21CQVVMLEtBQUs7cUJBUUwsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBJbnB1dCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7IHN2Z3MsIEljb25OYW1lIH0gZnJvbSAnLi9pY29ucydcbmltcG9ydCB7IERvbVNhbml0aXplciwgU2FmZUh0bWwgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJ1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdlcW0taWNvbicsXG4gIHRlbXBsYXRlVXJsOiAnLi9pY29uLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbICcuL2ljb24uY29tcG9uZW50LnNjc3MnIF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBJY29uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCkgd2lkdGggPSAyMFxuICBASW5wdXQoKSBoZWlnaHQgPSAyMFxuICBzdmc/OiBTYWZlSHRtbFxuICBpY29ucyA9IHN2Z3NcblxuICBASW5wdXQoKSBzZXQgc2l6ZSAobmV3U2l6ZTogbnVtYmVyKSB7XG4gICAgdGhpcy53aWR0aCA9IG5ld1NpemVcbiAgICB0aGlzLmhlaWdodCA9IG5ld1NpemVcbiAgfVxuXG4gIF9jb2xvciA9ICcjOTc5YWEwJ1xuICBASW5wdXQoKVxuICBzZXQgY29sb3IgKG5ld0NvbG9yOiBzdHJpbmcpIHtcbiAgICBpZiAobmV3Q29sb3IgJiYgbmV3Q29sb3IgIT09ICcnKSB7XG4gICAgICB0aGlzLl9jb2xvciA9IG5ld0NvbG9yXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NvbG9yID0gJyM5NzlhYTAnXG4gICAgfVxuICB9XG5cbiAgX3N0cm9rZUNvbG9yID0gdGhpcy5fY29sb3JcbiAgQElucHV0KClcbiAgc2V0IHN0cm9rZUNvbG9yIChuZXdDb2xvcjogc3RyaW5nKSB7XG4gICAgaWYgKG5ld0NvbG9yICYmIG5ld0NvbG9yICE9PSAnJykge1xuICAgICAgdGhpcy5fc3Ryb2tlQ29sb3IgPSBuZXdDb2xvclxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zdHJva2VDb2xvciA9IHRoaXMuX2NvbG9yXG4gICAgfVxuICB9XG5cbiAgcHVibGljIF9yb3RhdGUgPSAwXG4gIEBJbnB1dCgpXG4gIGdldCByb3RhdGUgKCkge1xuICAgIHJldHVybiB0aGlzLl9yb3RhdGVcbiAgfVxuXG4gIHNldCByb3RhdGUgKGFuZ2xlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9yb3RhdGUgPSBhbmdsZVxuICB9XG5cbiAgX25hbWUhOiBJY29uTmFtZVxuICBASW5wdXQoKVxuICBzZXQgbmFtZSAoaWNvbk5hbWU6IEljb25OYW1lKSB7XG4gICAgdGhpcy5fbmFtZSA9IGljb25OYW1lXG4gICAgdGhpcy5zdmcgPSB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0SHRtbCh0aGlzLmljb25zW3RoaXMubmFtZV0pXG4gIH1cblxuICBnZXQgbmFtZSAoKSB7IHJldHVybiB0aGlzLl9uYW1lIH1cblxuICBASW5wdXQoKSBzdHJva2U6IG51bWJlciA9IDBcblxuICBjb25zdHJ1Y3RvciAocHVibGljIHNhbml0aXplcjogRG9tU2FuaXRpemVyKSB7fVxuICBuZ09uSW5pdCAoKSB7XG4gIH1cblxuICBnZXQgc3R5bGUgKCkge1xuICAgIGNvbnN0IHN0eWxlOiBhbnkgPSB7fVxuXG4gICAgc3R5bGUuZmlsbCA9IGAke3RoaXMuX2NvbG9yfWBcbiAgICBzdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgIHN0eWxlLm1hcmdpbiA9ICcwIGF1dG8nXG4gICAgaWYgKHRoaXMuaGVpZ2h0ID49IDApIHtcbiAgICAgIHN0eWxlLmhlaWdodCA9IGAke3RoaXMuaGVpZ2h0fXB4YFxuICAgIH1cbiAgICBpZiAodGhpcy5oZWlnaHQgPj0gMCkge1xuICAgICAgc3R5bGUud2lkdGggPSBgJHt0aGlzLndpZHRofXB4YFxuICAgIH1cbiAgICBzdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlKCR7dGhpcy5yb3RhdGV9ZGVnKWBcblxuICAgIGlmICh0aGlzLnN0cm9rZSkge1xuICAgICAgc3R5bGVbJ3N0cm9rZS13aWR0aCddID0gYCR7dGhpcy5zdHJva2V9cHhgXG4gICAgICBzdHlsZS5zdHJva2UgPSBgJHt0aGlzLl9zdHJva2VDb2xvcn1gXG4gICAgfVxuXG4gICAgcmV0dXJuIHN0eWxlXG4gIH1cbn1cbiJdfQ==
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
export * from './icons';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL2ljb24vaWNvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxLQUFLLEVBQ0wsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFBO0FBQ3RCLE9BQU8sRUFBRSxJQUFJLEVBQVksTUFBTSxTQUFTLENBQUE7QUFDeEMsT0FBTyxFQUFFLFlBQVksRUFBWSxNQUFNLDJCQUEyQixDQUFBO0FBUWxFLE1BQU0sT0FBTyxhQUFhO0lBb0R4QixZQUFvQixTQUF1QjtRQUF2QixjQUFTLEdBQVQsU0FBUyxDQUFjO1FBbkRsQyxVQUFLLEdBQUcsRUFBRSxDQUFBO1FBQ1YsV0FBTSxHQUFHLEVBQUUsQ0FBQTtRQUVwQixVQUFLLEdBQUcsSUFBSSxDQUFBO1FBT1osV0FBTSxHQUFHLFNBQVMsQ0FBQTtRQVVsQixpQkFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUE7UUFVbkIsWUFBTyxHQUFHLENBQUMsQ0FBQTtRQW1CVCxXQUFNLEdBQVcsQ0FBQyxDQUFBO0lBRW1CLENBQUM7SUE5Qy9DLElBQWEsSUFBSSxDQUFFLE9BQWU7UUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUE7UUFDcEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUE7SUFDdkIsQ0FBQztJQUdELElBQ0ksS0FBSyxDQUFFLFFBQWdCO1FBQ3pCLElBQUksUUFBUSxJQUFJLFFBQVEsS0FBSyxFQUFFLEVBQUU7WUFDL0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUE7U0FDdkI7YUFBTTtZQUNMLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFBO1NBQ3hCO0lBQ0gsQ0FBQztJQUdELElBQ0ksV0FBVyxDQUFFLFFBQWdCO1FBQy9CLElBQUksUUFBUSxJQUFJLFFBQVEsS0FBSyxFQUFFLEVBQUU7WUFDL0IsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUE7U0FDN0I7YUFBTTtZQUNMLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQTtTQUNoQztJQUNILENBQUM7SUFHRCxJQUNJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUE7SUFDckIsQ0FBQztJQUVELElBQUksTUFBTSxDQUFFLEtBQWE7UUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7SUFDdEIsQ0FBQztJQUdELElBQ0ksSUFBSSxDQUFFLFFBQWtCO1FBQzFCLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFBO1FBQ3JCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0lBQzFFLENBQUM7SUFFRCxJQUFJLElBQUksS0FBTSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUEsQ0FBQyxDQUFDO0lBS2pDLFFBQVE7SUFDUixDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ1AsTUFBTSxLQUFLLEdBQVEsRUFBRSxDQUFBO1FBRXJCLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7UUFDN0IsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7UUFDdkIsS0FBSyxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUE7UUFDdkIsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUNwQixLQUFLLENBQUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFBO1NBQ2xDO1FBQ0QsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUNwQixLQUFLLENBQUMsS0FBSyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFBO1NBQ2hDO1FBQ0QsS0FBSyxDQUFDLFNBQVMsR0FBRyxVQUFVLElBQUksQ0FBQyxNQUFNLE1BQU0sQ0FBQTtRQUU3QyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDZixLQUFLLENBQUMsY0FBYyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUE7WUFDMUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtTQUN0QztRQUVELE9BQU8sS0FBSyxDQUFBO0lBQ2QsQ0FBQzs7O1lBbEZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsVUFBVTtnQkFDcEIscUZBQW9DO2dCQUVwQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsU0FBUzs7YUFDM0M7OztZQVBRLFlBQVk7OztvQkFTbEIsS0FBSztxQkFDTCxLQUFLO21CQUlMLEtBQUs7b0JBTUwsS0FBSzswQkFVTCxLQUFLO3FCQVVMLEtBQUs7bUJBVUwsS0FBSztxQkFRTCxLQUFLOztBQTZCUixjQUFjLFNBQVMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBJbnB1dCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7IHN2Z3MsIEljb25OYW1lIH0gZnJvbSAnLi9pY29ucydcbmltcG9ydCB7IERvbVNhbml0aXplciwgU2FmZUh0bWwgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJ1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdlcW0taWNvbicsXG4gIHRlbXBsYXRlVXJsOiAnLi9pY29uLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbICcuL2ljb24uY29tcG9uZW50LnNjc3MnIF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBJY29uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCkgd2lkdGggPSAyMFxuICBASW5wdXQoKSBoZWlnaHQgPSAyMFxuICBzdmc/OiBTYWZlSHRtbFxuICBpY29ucyA9IHN2Z3NcblxuICBASW5wdXQoKSBzZXQgc2l6ZSAobmV3U2l6ZTogbnVtYmVyKSB7XG4gICAgdGhpcy53aWR0aCA9IG5ld1NpemVcbiAgICB0aGlzLmhlaWdodCA9IG5ld1NpemVcbiAgfVxuXG4gIF9jb2xvciA9ICcjOTc5YWEwJ1xuICBASW5wdXQoKVxuICBzZXQgY29sb3IgKG5ld0NvbG9yOiBzdHJpbmcpIHtcbiAgICBpZiAobmV3Q29sb3IgJiYgbmV3Q29sb3IgIT09ICcnKSB7XG4gICAgICB0aGlzLl9jb2xvciA9IG5ld0NvbG9yXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NvbG9yID0gJyM5NzlhYTAnXG4gICAgfVxuICB9XG5cbiAgX3N0cm9rZUNvbG9yID0gdGhpcy5fY29sb3JcbiAgQElucHV0KClcbiAgc2V0IHN0cm9rZUNvbG9yIChuZXdDb2xvcjogc3RyaW5nKSB7XG4gICAgaWYgKG5ld0NvbG9yICYmIG5ld0NvbG9yICE9PSAnJykge1xuICAgICAgdGhpcy5fc3Ryb2tlQ29sb3IgPSBuZXdDb2xvclxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zdHJva2VDb2xvciA9IHRoaXMuX2NvbG9yXG4gICAgfVxuICB9XG5cbiAgcHVibGljIF9yb3RhdGUgPSAwXG4gIEBJbnB1dCgpXG4gIGdldCByb3RhdGUgKCkge1xuICAgIHJldHVybiB0aGlzLl9yb3RhdGVcbiAgfVxuXG4gIHNldCByb3RhdGUgKGFuZ2xlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9yb3RhdGUgPSBhbmdsZVxuICB9XG5cbiAgX25hbWUhOiBJY29uTmFtZVxuICBASW5wdXQoKVxuICBzZXQgbmFtZSAoaWNvbk5hbWU6IEljb25OYW1lKSB7XG4gICAgdGhpcy5fbmFtZSA9IGljb25OYW1lXG4gICAgdGhpcy5zdmcgPSB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0SHRtbCh0aGlzLmljb25zW3RoaXMubmFtZV0pXG4gIH1cblxuICBnZXQgbmFtZSAoKSB7IHJldHVybiB0aGlzLl9uYW1lIH1cblxuICBASW5wdXQoKSBzdHJva2U6IG51bWJlciA9IDBcblxuICBjb25zdHJ1Y3RvciAocHVibGljIHNhbml0aXplcjogRG9tU2FuaXRpemVyKSB7fVxuICBuZ09uSW5pdCAoKSB7XG4gIH1cblxuICBnZXQgc3R5bGUgKCkge1xuICAgIGNvbnN0IHN0eWxlOiBhbnkgPSB7fVxuXG4gICAgc3R5bGUuZmlsbCA9IGAke3RoaXMuX2NvbG9yfWBcbiAgICBzdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgIHN0eWxlLm1hcmdpbiA9ICcwIGF1dG8nXG4gICAgaWYgKHRoaXMuaGVpZ2h0ID49IDApIHtcbiAgICAgIHN0eWxlLmhlaWdodCA9IGAke3RoaXMuaGVpZ2h0fXB4YFxuICAgIH1cbiAgICBpZiAodGhpcy5oZWlnaHQgPj0gMCkge1xuICAgICAgc3R5bGUud2lkdGggPSBgJHt0aGlzLndpZHRofXB4YFxuICAgIH1cbiAgICBzdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlKCR7dGhpcy5yb3RhdGV9ZGVnKWBcblxuICAgIGlmICh0aGlzLnN0cm9rZSkge1xuICAgICAgc3R5bGVbJ3N0cm9rZS13aWR0aCddID0gYCR7dGhpcy5zdHJva2V9cHhgXG4gICAgICBzdHlsZS5zdHJva2UgPSBgJHt0aGlzLl9zdHJva2VDb2xvcn1gXG4gICAgfVxuXG4gICAgcmV0dXJuIHN0eWxlXG4gIH1cbn1cblxuZXhwb3J0ICogZnJvbSAnLi9pY29ucyciXX0=
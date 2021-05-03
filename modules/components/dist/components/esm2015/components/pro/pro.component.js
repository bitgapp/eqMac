import { Component, Input } from '@angular/core';
import { ColorsService } from '../../services/colors.service';
export class ProComponent {
    constructor(colors) {
        this.colors = colors;
        this.color = this.colors.light;
        this.backgroundColor = this.colors.dark;
        this.fontSize = 14;
        this.style = {
            display: 'inline-block',
            backgroundColor: this.backgroundColor,
            color: this.color,
            borderRadius: '4px',
            padding: '2px 4px'
        };
    }
}
ProComponent.decorators = [
    { type: Component, args: [{
                selector: 'eqm-pro',
                template: `
    <div [style]="style">
      <eqm-label [fontSize]="fontSize">Pro</eqm-label>
    </div>
  `
            },] }
];
ProComponent.ctorParameters = () => [
    { type: ColorsService }
];
ProComponent.propDecorators = {
    color: [{ type: Input }],
    backgroundColor: [{ type: Input }],
    fontSize: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2NvbXBvbmVudHMvcHJvL3Byby5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUE7QUFDaEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLCtCQUErQixDQUFBO0FBVTdELE1BQU0sT0FBTyxZQUFZO0lBSXZCLFlBQW9CLE1BQXFCO1FBQXJCLFdBQU0sR0FBTixNQUFNLENBQWU7UUFIaEMsVUFBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFBO1FBQ3pCLG9CQUFlLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUE7UUFDbEMsYUFBUSxHQUFHLEVBQUUsQ0FBQTtRQUV0QixVQUFLLEdBQTRCO1lBQy9CLE9BQU8sRUFBRSxjQUFjO1lBQ3ZCLGVBQWUsRUFBRSxJQUFJLENBQUMsZUFBZTtZQUNyQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDakIsWUFBWSxFQUFFLEtBQUs7WUFDbkIsT0FBTyxFQUFFLFNBQVM7U0FDbkIsQ0FBQTtJQVAyQyxDQUFDOzs7WUFaOUMsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxTQUFTO2dCQUNuQixRQUFRLEVBQUU7Ozs7R0FJVDthQUNGOzs7WUFUUSxhQUFhOzs7b0JBV25CLEtBQUs7OEJBQ0wsS0FBSzt1QkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5pbXBvcnQgeyBDb2xvcnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29sb3JzLnNlcnZpY2UnXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2VxbS1wcm8nLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgW3N0eWxlXT1cInN0eWxlXCI+XG4gICAgICA8ZXFtLWxhYmVsIFtmb250U2l6ZV09XCJmb250U2l6ZVwiPlBybzwvZXFtLWxhYmVsPlxuICAgIDwvZGl2PlxuICBgXG59KVxuZXhwb3J0IGNsYXNzIFByb0NvbXBvbmVudCB7XG4gIEBJbnB1dCgpIGNvbG9yID0gdGhpcy5jb2xvcnMubGlnaHRcbiAgQElucHV0KCkgYmFja2dyb3VuZENvbG9yID0gdGhpcy5jb2xvcnMuZGFya1xuICBASW5wdXQoKSBmb250U2l6ZSA9IDE0XG4gIGNvbnN0cnVjdG9yIChwdWJsaWMgY29sb3JzOiBDb2xvcnNTZXJ2aWNlKSB7fVxuICBzdHlsZTogeyBbbmFtZTogc3RyaW5nXTogYW55IH0gPSB7XG4gICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLmJhY2tncm91bmRDb2xvcixcbiAgICBjb2xvcjogdGhpcy5jb2xvcixcbiAgICBib3JkZXJSYWRpdXM6ICc0cHgnLFxuICAgIHBhZGRpbmc6ICcycHggNHB4J1xuICB9XG59Il19
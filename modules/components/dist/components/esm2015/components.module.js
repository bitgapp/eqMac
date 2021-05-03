import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KnobComponent } from './components/knob/knob.component';
import { MouseWheelDirective } from './directives/mousewheel.directive';
import { ValueScreenComponent } from './components/value-screen/value-screen.component';
import { ButtonComponent } from './components/button/button.component';
import { ToggleComponent } from './components/toggle/toggle.component';
import { ContainerComponent } from './components/container/container.component';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { FormsModule } from '@angular/forms';
import { SelectBoxComponent } from './components/select-box/select-box.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { ScrewComponent } from './components/screw/screw.component';
import { VentComponent } from './components/vent/vent.component';
import { DividerComponent } from './components/divider/divider.component';
import { IconComponent } from './components/icon/icon.component';
import { FlatSliderComponent } from './components/flat-slider/flat-slider.component';
import { TooltipDirective } from './components/tooltip/tooltip.directive';
import { TooltipContainerComponent } from './components/tooltip/tooltip-container.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { SkeuomorphSliderComponent } from './components/skeuomorph-slider/skeuomorph-slider.component';
import { UtilitiesService } from './services/utilities.service';
import { LabelComponent } from './components/label/label.component';
import { LoadingComponent } from './components/loading/loading.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { PromptComponent } from './components/prompt/prompt.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselComponent, CarouselItemDirective, CarouselItemElement } from './components/carousel/carousel.component';
import { QuestionComponent } from './components/question/question.component';
import { ClickedOutsideDirective } from './directives/clicked-outside.directive';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { ProComponent } from './components/pro/pro.component';
import { ColorsService } from './services/colors.service';
export class ComponentsModule {
}
ComponentsModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    FormsModule,
                    BrowserAnimationsModule,
                    ScrollingModule
                ],
                declarations: [
                    ClickedOutsideDirective,
                    KnobComponent,
                    MouseWheelDirective,
                    ValueScreenComponent,
                    ButtonComponent,
                    ToggleComponent,
                    ContainerComponent,
                    InputFieldComponent,
                    SelectBoxComponent,
                    DropdownComponent,
                    ScrewComponent,
                    VentComponent,
                    DividerComponent,
                    IconComponent,
                    FlatSliderComponent,
                    TooltipDirective,
                    TooltipComponent,
                    TooltipContainerComponent,
                    SkeuomorphSliderComponent,
                    LabelComponent,
                    LoadingComponent,
                    CheckboxComponent,
                    PromptComponent,
                    CarouselComponent,
                    CarouselItemElement,
                    CarouselItemDirective,
                    QuestionComponent,
                    BreadcrumbsComponent,
                    ProComponent
                ],
                exports: [
                    ClickedOutsideDirective,
                    KnobComponent,
                    ValueScreenComponent,
                    ButtonComponent,
                    ToggleComponent,
                    InputFieldComponent,
                    ContainerComponent,
                    SelectBoxComponent,
                    DropdownComponent,
                    ScrewComponent,
                    VentComponent,
                    DividerComponent,
                    IconComponent,
                    FlatSliderComponent,
                    TooltipContainerComponent,
                    TooltipComponent,
                    TooltipDirective,
                    SkeuomorphSliderComponent,
                    LabelComponent,
                    LoadingComponent,
                    CheckboxComponent,
                    CarouselComponent,
                    CarouselItemDirective,
                    QuestionComponent,
                    BreadcrumbsComponent,
                    ProComponent
                ],
                providers: [
                    UtilitiesService,
                    ColorsService
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50cy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsUUFBUSxFQUNULE1BQU0sZUFBZSxDQUFBO0FBQ3RCLE9BQU8sRUFDTCxZQUFZLEVBQ2IsTUFBTSxpQkFBaUIsQ0FBQTtBQUN4QixPQUFPLEVBQ0wsYUFBYSxFQUNkLE1BQU0sa0NBQWtDLENBQUE7QUFDekMsT0FBTyxFQUNMLG1CQUFtQixFQUNwQixNQUFNLG1DQUFtQyxDQUFBO0FBRTFDLE9BQU8sRUFDTCxvQkFBb0IsRUFDckIsTUFBTSxrREFBa0QsQ0FBQTtBQUN6RCxPQUFPLEVBQ0wsZUFBZSxFQUNoQixNQUFNLHNDQUFzQyxDQUFBO0FBQzdDLE9BQU8sRUFDTCxlQUFlLEVBQ2hCLE1BQU0sc0NBQXNDLENBQUE7QUFDN0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNENBQTRDLENBQUE7QUFDL0UsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0RBQWdELENBQUE7QUFDcEYsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBQzVDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDhDQUE4QyxDQUFBO0FBQ2pGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDBDQUEwQyxDQUFBO0FBQzVFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQTtBQUNuRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0NBQWtDLENBQUE7QUFDaEUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sd0NBQXdDLENBQUE7QUFDekUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtDQUFrQyxDQUFBO0FBQ2hFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdEQUFnRCxDQUFBO0FBQ3BGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFBO0FBQ3pFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGtEQUFrRCxDQUFBO0FBQzVGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFBO0FBQ3pFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLDREQUE0RCxDQUFBO0FBQ3RHLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDhCQUE4QixDQUFBO0FBQy9ELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQTtBQUNuRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQTtBQUN6RSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQTtBQUM1RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sc0NBQXNDLENBQUE7QUFDdEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sc0NBQXNDLENBQUE7QUFDOUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLHFCQUFxQixFQUFFLG1CQUFtQixFQUFFLE1BQU0sMENBQTBDLENBQUE7QUFDeEgsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMENBQTBDLENBQUE7QUFDNUUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sd0NBQXdDLENBQUE7QUFDaEYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHdCQUF3QixDQUFBO0FBQ3hELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGdEQUFnRCxDQUFBO0FBQ3JGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQTtBQUM3RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUE7QUF5RXpELE1BQU0sT0FBTyxnQkFBZ0I7OztZQXZFNUIsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRTtvQkFDUCxZQUFZO29CQUNaLFdBQVc7b0JBQ1gsdUJBQXVCO29CQUN2QixlQUFlO2lCQUNoQjtnQkFDRCxZQUFZLEVBQUU7b0JBQ1osdUJBQXVCO29CQUN2QixhQUFhO29CQUNiLG1CQUFtQjtvQkFDbkIsb0JBQW9CO29CQUNwQixlQUFlO29CQUNmLGVBQWU7b0JBQ2Ysa0JBQWtCO29CQUNsQixtQkFBbUI7b0JBQ25CLGtCQUFrQjtvQkFDbEIsaUJBQWlCO29CQUNqQixjQUFjO29CQUNkLGFBQWE7b0JBQ2IsZ0JBQWdCO29CQUNoQixhQUFhO29CQUNiLG1CQUFtQjtvQkFDbkIsZ0JBQWdCO29CQUNoQixnQkFBZ0I7b0JBQ2hCLHlCQUF5QjtvQkFDekIseUJBQXlCO29CQUN6QixjQUFjO29CQUNkLGdCQUFnQjtvQkFDaEIsaUJBQWlCO29CQUNqQixlQUFlO29CQUNmLGlCQUFpQjtvQkFDakIsbUJBQW1CO29CQUNuQixxQkFBcUI7b0JBQ3JCLGlCQUFpQjtvQkFDakIsb0JBQW9CO29CQUNwQixZQUFZO2lCQUNiO2dCQUNELE9BQU8sRUFBRTtvQkFDUCx1QkFBdUI7b0JBQ3ZCLGFBQWE7b0JBQ2Isb0JBQW9CO29CQUNwQixlQUFlO29CQUNmLGVBQWU7b0JBQ2YsbUJBQW1CO29CQUNuQixrQkFBa0I7b0JBQ2xCLGtCQUFrQjtvQkFDbEIsaUJBQWlCO29CQUNqQixjQUFjO29CQUNkLGFBQWE7b0JBQ2IsZ0JBQWdCO29CQUNoQixhQUFhO29CQUNiLG1CQUFtQjtvQkFDbkIseUJBQXlCO29CQUN6QixnQkFBZ0I7b0JBQ2hCLGdCQUFnQjtvQkFDaEIseUJBQXlCO29CQUN6QixjQUFjO29CQUNkLGdCQUFnQjtvQkFDaEIsaUJBQWlCO29CQUNqQixpQkFBaUI7b0JBQ2pCLHFCQUFxQjtvQkFDckIsaUJBQWlCO29CQUNqQixvQkFBb0I7b0JBQ3BCLFlBQVk7aUJBQ2I7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULGdCQUFnQjtvQkFDaEIsYUFBYTtpQkFDZDthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgTmdNb2R1bGVcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7XG4gIENvbW1vbk1vZHVsZVxufSBmcm9tICdAYW5ndWxhci9jb21tb24nXG5pbXBvcnQge1xuICBLbm9iQ29tcG9uZW50XG59IGZyb20gJy4vY29tcG9uZW50cy9rbm9iL2tub2IuY29tcG9uZW50J1xuaW1wb3J0IHtcbiAgTW91c2VXaGVlbERpcmVjdGl2ZVxufSBmcm9tICcuL2RpcmVjdGl2ZXMvbW91c2V3aGVlbC5kaXJlY3RpdmUnXG5cbmltcG9ydCB7XG4gIFZhbHVlU2NyZWVuQ29tcG9uZW50XG59IGZyb20gJy4vY29tcG9uZW50cy92YWx1ZS1zY3JlZW4vdmFsdWUtc2NyZWVuLmNvbXBvbmVudCdcbmltcG9ydCB7XG4gIEJ1dHRvbkNvbXBvbmVudFxufSBmcm9tICcuL2NvbXBvbmVudHMvYnV0dG9uL2J1dHRvbi5jb21wb25lbnQnXG5pbXBvcnQge1xuICBUb2dnbGVDb21wb25lbnRcbn0gZnJvbSAnLi9jb21wb25lbnRzL3RvZ2dsZS90b2dnbGUuY29tcG9uZW50J1xuaW1wb3J0IHsgQ29udGFpbmVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2NvbnRhaW5lci9jb250YWluZXIuY29tcG9uZW50J1xuaW1wb3J0IHsgSW5wdXRGaWVsZENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9pbnB1dC1maWVsZC9pbnB1dC1maWVsZC5jb21wb25lbnQnXG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJ1xuaW1wb3J0IHsgU2VsZWN0Qm94Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3NlbGVjdC1ib3gvc2VsZWN0LWJveC5jb21wb25lbnQnXG5pbXBvcnQgeyBEcm9wZG93bkNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9kcm9wZG93bi9kcm9wZG93bi5jb21wb25lbnQnXG5pbXBvcnQgeyBTY3Jld0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9zY3Jldy9zY3Jldy5jb21wb25lbnQnXG5pbXBvcnQgeyBWZW50Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3ZlbnQvdmVudC5jb21wb25lbnQnXG5pbXBvcnQgeyBEaXZpZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2RpdmlkZXIvZGl2aWRlci5jb21wb25lbnQnXG5pbXBvcnQgeyBJY29uQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2ljb24vaWNvbi5jb21wb25lbnQnXG5pbXBvcnQgeyBGbGF0U2xpZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2ZsYXQtc2xpZGVyL2ZsYXQtc2xpZGVyLmNvbXBvbmVudCdcbmltcG9ydCB7IFRvb2x0aXBEaXJlY3RpdmUgfSBmcm9tICcuL2NvbXBvbmVudHMvdG9vbHRpcC90b29sdGlwLmRpcmVjdGl2ZSdcbmltcG9ydCB7IFRvb2x0aXBDb250YWluZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdG9vbHRpcC90b29sdGlwLWNvbnRhaW5lci5jb21wb25lbnQnXG5pbXBvcnQgeyBUb29sdGlwQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3Rvb2x0aXAvdG9vbHRpcC5jb21wb25lbnQnXG5pbXBvcnQgeyBTa2V1b21vcnBoU2xpZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3NrZXVvbW9ycGgtc2xpZGVyL3NrZXVvbW9ycGgtc2xpZGVyLmNvbXBvbmVudCdcbmltcG9ydCB7IFV0aWxpdGllc1NlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL3V0aWxpdGllcy5zZXJ2aWNlJ1xuaW1wb3J0IHsgTGFiZWxDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvbGFiZWwvbGFiZWwuY29tcG9uZW50J1xuaW1wb3J0IHsgTG9hZGluZ0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9sb2FkaW5nL2xvYWRpbmcuY29tcG9uZW50J1xuaW1wb3J0IHsgQ2hlY2tib3hDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY2hlY2tib3gvY2hlY2tib3guY29tcG9uZW50J1xuaW1wb3J0IHsgUHJvbXB0Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3Byb21wdC9wcm9tcHQuY29tcG9uZW50J1xuaW1wb3J0IHsgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnXG5pbXBvcnQgeyBDYXJvdXNlbENvbXBvbmVudCwgQ2Fyb3VzZWxJdGVtRGlyZWN0aXZlLCBDYXJvdXNlbEl0ZW1FbGVtZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2Nhcm91c2VsL2Nhcm91c2VsLmNvbXBvbmVudCdcbmltcG9ydCB7IFF1ZXN0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3F1ZXN0aW9uL3F1ZXN0aW9uLmNvbXBvbmVudCdcbmltcG9ydCB7IENsaWNrZWRPdXRzaWRlRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2NsaWNrZWQtb3V0c2lkZS5kaXJlY3RpdmUnXG5pbXBvcnQgeyBTY3JvbGxpbmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJ1xuaW1wb3J0IHsgQnJlYWRjcnVtYnNDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvYnJlYWRjcnVtYnMvYnJlYWRjcnVtYnMuY29tcG9uZW50J1xuaW1wb3J0IHsgUHJvQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3Byby9wcm8uY29tcG9uZW50J1xuaW1wb3J0IHsgQ29sb3JzU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvY29sb3JzLnNlcnZpY2UnXG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgRm9ybXNNb2R1bGUsXG4gICAgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUsXG4gICAgU2Nyb2xsaW5nTW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIENsaWNrZWRPdXRzaWRlRGlyZWN0aXZlLFxuICAgIEtub2JDb21wb25lbnQsXG4gICAgTW91c2VXaGVlbERpcmVjdGl2ZSxcbiAgICBWYWx1ZVNjcmVlbkNvbXBvbmVudCxcbiAgICBCdXR0b25Db21wb25lbnQsXG4gICAgVG9nZ2xlQ29tcG9uZW50LFxuICAgIENvbnRhaW5lckNvbXBvbmVudCxcbiAgICBJbnB1dEZpZWxkQ29tcG9uZW50LFxuICAgIFNlbGVjdEJveENvbXBvbmVudCxcbiAgICBEcm9wZG93bkNvbXBvbmVudCxcbiAgICBTY3Jld0NvbXBvbmVudCxcbiAgICBWZW50Q29tcG9uZW50LFxuICAgIERpdmlkZXJDb21wb25lbnQsXG4gICAgSWNvbkNvbXBvbmVudCxcbiAgICBGbGF0U2xpZGVyQ29tcG9uZW50LFxuICAgIFRvb2x0aXBEaXJlY3RpdmUsXG4gICAgVG9vbHRpcENvbXBvbmVudCxcbiAgICBUb29sdGlwQ29udGFpbmVyQ29tcG9uZW50LFxuICAgIFNrZXVvbW9ycGhTbGlkZXJDb21wb25lbnQsXG4gICAgTGFiZWxDb21wb25lbnQsXG4gICAgTG9hZGluZ0NvbXBvbmVudCxcbiAgICBDaGVja2JveENvbXBvbmVudCxcbiAgICBQcm9tcHRDb21wb25lbnQsXG4gICAgQ2Fyb3VzZWxDb21wb25lbnQsXG4gICAgQ2Fyb3VzZWxJdGVtRWxlbWVudCxcbiAgICBDYXJvdXNlbEl0ZW1EaXJlY3RpdmUsXG4gICAgUXVlc3Rpb25Db21wb25lbnQsXG4gICAgQnJlYWRjcnVtYnNDb21wb25lbnQsXG4gICAgUHJvQ29tcG9uZW50XG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBDbGlja2VkT3V0c2lkZURpcmVjdGl2ZSxcbiAgICBLbm9iQ29tcG9uZW50LFxuICAgIFZhbHVlU2NyZWVuQ29tcG9uZW50LFxuICAgIEJ1dHRvbkNvbXBvbmVudCxcbiAgICBUb2dnbGVDb21wb25lbnQsXG4gICAgSW5wdXRGaWVsZENvbXBvbmVudCxcbiAgICBDb250YWluZXJDb21wb25lbnQsXG4gICAgU2VsZWN0Qm94Q29tcG9uZW50LFxuICAgIERyb3Bkb3duQ29tcG9uZW50LFxuICAgIFNjcmV3Q29tcG9uZW50LFxuICAgIFZlbnRDb21wb25lbnQsXG4gICAgRGl2aWRlckNvbXBvbmVudCxcbiAgICBJY29uQ29tcG9uZW50LFxuICAgIEZsYXRTbGlkZXJDb21wb25lbnQsXG4gICAgVG9vbHRpcENvbnRhaW5lckNvbXBvbmVudCxcbiAgICBUb29sdGlwQ29tcG9uZW50LFxuICAgIFRvb2x0aXBEaXJlY3RpdmUsXG4gICAgU2tldW9tb3JwaFNsaWRlckNvbXBvbmVudCxcbiAgICBMYWJlbENvbXBvbmVudCxcbiAgICBMb2FkaW5nQ29tcG9uZW50LFxuICAgIENoZWNrYm94Q29tcG9uZW50LFxuICAgIENhcm91c2VsQ29tcG9uZW50LFxuICAgIENhcm91c2VsSXRlbURpcmVjdGl2ZSxcbiAgICBRdWVzdGlvbkNvbXBvbmVudCxcbiAgICBCcmVhZGNydW1ic0NvbXBvbmVudCxcbiAgICBQcm9Db21wb25lbnRcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgVXRpbGl0aWVzU2VydmljZSxcbiAgICBDb2xvcnNTZXJ2aWNlXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50c01vZHVsZSB7fVxuIl19
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
                    BreadcrumbsComponent
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
                    BreadcrumbsComponent
                ],
                providers: [
                    UtilitiesService
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50cy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvY29tcG9uZW50cy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFFBQVEsRUFDVCxNQUFNLGVBQWUsQ0FBQTtBQUN0QixPQUFPLEVBQ0wsWUFBWSxFQUNiLE1BQU0saUJBQWlCLENBQUE7QUFDeEIsT0FBTyxFQUNMLGFBQWEsRUFDZCxNQUFNLGtDQUFrQyxDQUFBO0FBQ3pDLE9BQU8sRUFDTCxtQkFBbUIsRUFDcEIsTUFBTSxtQ0FBbUMsQ0FBQTtBQUUxQyxPQUFPLEVBQ0wsb0JBQW9CLEVBQ3JCLE1BQU0sa0RBQWtELENBQUE7QUFDekQsT0FBTyxFQUNMLGVBQWUsRUFDaEIsTUFBTSxzQ0FBc0MsQ0FBQTtBQUM3QyxPQUFPLEVBQ0wsZUFBZSxFQUNoQixNQUFNLHNDQUFzQyxDQUFBO0FBQzdDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDRDQUE0QyxDQUFBO0FBQy9FLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdEQUFnRCxDQUFBO0FBQ3BGLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUM1QyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQTtBQUNqRixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQTtBQUM1RSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0NBQW9DLENBQUE7QUFDbkUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtDQUFrQyxDQUFBO0FBQ2hFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFBO0FBQ3pFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQTtBQUNoRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQTtBQUNwRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQTtBQUN6RSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxrREFBa0QsQ0FBQTtBQUM1RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQTtBQUN6RSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQTtBQUN0RyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQTtBQUMvRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0NBQW9DLENBQUE7QUFDbkUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sd0NBQXdDLENBQUE7QUFDekUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMENBQTBDLENBQUE7QUFDNUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHNDQUFzQyxDQUFBO0FBQ3RFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFBO0FBQzlFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxxQkFBcUIsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDBDQUEwQyxDQUFBO0FBQ3hILE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDBDQUEwQyxDQUFBO0FBQzVFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHdDQUF3QyxDQUFBO0FBQ2hGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQTtBQUN4RCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQTtBQXNFckYsTUFBTSxPQUFPLGdCQUFnQjs7O1lBcEU1QixRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFO29CQUNQLFlBQVk7b0JBQ1osV0FBVztvQkFDWCx1QkFBdUI7b0JBQ3ZCLGVBQWU7aUJBQ2hCO2dCQUNELFlBQVksRUFBRTtvQkFDWix1QkFBdUI7b0JBQ3ZCLGFBQWE7b0JBQ2IsbUJBQW1CO29CQUNuQixvQkFBb0I7b0JBQ3BCLGVBQWU7b0JBQ2YsZUFBZTtvQkFDZixrQkFBa0I7b0JBQ2xCLG1CQUFtQjtvQkFDbkIsa0JBQWtCO29CQUNsQixpQkFBaUI7b0JBQ2pCLGNBQWM7b0JBQ2QsYUFBYTtvQkFDYixnQkFBZ0I7b0JBQ2hCLGFBQWE7b0JBQ2IsbUJBQW1CO29CQUNuQixnQkFBZ0I7b0JBQ2hCLGdCQUFnQjtvQkFDaEIseUJBQXlCO29CQUN6Qix5QkFBeUI7b0JBQ3pCLGNBQWM7b0JBQ2QsZ0JBQWdCO29CQUNoQixpQkFBaUI7b0JBQ2pCLGVBQWU7b0JBQ2YsaUJBQWlCO29CQUNqQixtQkFBbUI7b0JBQ25CLHFCQUFxQjtvQkFDckIsaUJBQWlCO29CQUNqQixvQkFBb0I7aUJBQ3JCO2dCQUNELE9BQU8sRUFBRTtvQkFDUCx1QkFBdUI7b0JBQ3ZCLGFBQWE7b0JBQ2Isb0JBQW9CO29CQUNwQixlQUFlO29CQUNmLGVBQWU7b0JBQ2YsbUJBQW1CO29CQUNuQixrQkFBa0I7b0JBQ2xCLGtCQUFrQjtvQkFDbEIsaUJBQWlCO29CQUNqQixjQUFjO29CQUNkLGFBQWE7b0JBQ2IsZ0JBQWdCO29CQUNoQixhQUFhO29CQUNiLG1CQUFtQjtvQkFDbkIseUJBQXlCO29CQUN6QixnQkFBZ0I7b0JBQ2hCLGdCQUFnQjtvQkFDaEIseUJBQXlCO29CQUN6QixjQUFjO29CQUNkLGdCQUFnQjtvQkFDaEIsaUJBQWlCO29CQUNqQixpQkFBaUI7b0JBQ2pCLHFCQUFxQjtvQkFDckIsaUJBQWlCO29CQUNqQixvQkFBb0I7aUJBQ3JCO2dCQUNELFNBQVMsRUFBRTtvQkFDVCxnQkFBZ0I7aUJBQ2pCO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBOZ01vZHVsZVxufSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuaW1wb3J0IHtcbiAgQ29tbW9uTW9kdWxlXG59IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbidcbmltcG9ydCB7XG4gIEtub2JDb21wb25lbnRcbn0gZnJvbSAnLi9jb21wb25lbnRzL2tub2Iva25vYi5jb21wb25lbnQnXG5pbXBvcnQge1xuICBNb3VzZVdoZWVsRGlyZWN0aXZlXG59IGZyb20gJy4vZGlyZWN0aXZlcy9tb3VzZXdoZWVsLmRpcmVjdGl2ZSdcblxuaW1wb3J0IHtcbiAgVmFsdWVTY3JlZW5Db21wb25lbnRcbn0gZnJvbSAnLi9jb21wb25lbnRzL3ZhbHVlLXNjcmVlbi92YWx1ZS1zY3JlZW4uY29tcG9uZW50J1xuaW1wb3J0IHtcbiAgQnV0dG9uQ29tcG9uZW50XG59IGZyb20gJy4vY29tcG9uZW50cy9idXR0b24vYnV0dG9uLmNvbXBvbmVudCdcbmltcG9ydCB7XG4gIFRvZ2dsZUNvbXBvbmVudFxufSBmcm9tICcuL2NvbXBvbmVudHMvdG9nZ2xlL3RvZ2dsZS5jb21wb25lbnQnXG5pbXBvcnQgeyBDb250YWluZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY29udGFpbmVyL2NvbnRhaW5lci5jb21wb25lbnQnXG5pbXBvcnQgeyBJbnB1dEZpZWxkQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2lucHV0LWZpZWxkL2lucHV0LWZpZWxkLmNvbXBvbmVudCdcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnXG5pbXBvcnQgeyBTZWxlY3RCb3hDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvc2VsZWN0LWJveC9zZWxlY3QtYm94LmNvbXBvbmVudCdcbmltcG9ydCB7IERyb3Bkb3duQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2Ryb3Bkb3duL2Ryb3Bkb3duLmNvbXBvbmVudCdcbmltcG9ydCB7IFNjcmV3Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3NjcmV3L3NjcmV3LmNvbXBvbmVudCdcbmltcG9ydCB7IFZlbnRDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdmVudC92ZW50LmNvbXBvbmVudCdcbmltcG9ydCB7IERpdmlkZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvZGl2aWRlci9kaXZpZGVyLmNvbXBvbmVudCdcbmltcG9ydCB7IEljb25Db21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvaWNvbi9pY29uLmNvbXBvbmVudCdcbmltcG9ydCB7IEZsYXRTbGlkZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvZmxhdC1zbGlkZXIvZmxhdC1zbGlkZXIuY29tcG9uZW50J1xuaW1wb3J0IHsgVG9vbHRpcERpcmVjdGl2ZSB9IGZyb20gJy4vY29tcG9uZW50cy90b29sdGlwL3Rvb2x0aXAuZGlyZWN0aXZlJ1xuaW1wb3J0IHsgVG9vbHRpcENvbnRhaW5lckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90b29sdGlwL3Rvb2x0aXAtY29udGFpbmVyLmNvbXBvbmVudCdcbmltcG9ydCB7IFRvb2x0aXBDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdG9vbHRpcC90b29sdGlwLmNvbXBvbmVudCdcbmltcG9ydCB7IFNrZXVvbW9ycGhTbGlkZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvc2tldW9tb3JwaC1zbGlkZXIvc2tldW9tb3JwaC1zbGlkZXIuY29tcG9uZW50J1xuaW1wb3J0IHsgVXRpbGl0aWVzU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvdXRpbGl0aWVzLnNlcnZpY2UnXG5pbXBvcnQgeyBMYWJlbENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9sYWJlbC9sYWJlbC5jb21wb25lbnQnXG5pbXBvcnQgeyBMb2FkaW5nQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2xvYWRpbmcvbG9hZGluZy5jb21wb25lbnQnXG5pbXBvcnQgeyBDaGVja2JveENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9jaGVja2JveC9jaGVja2JveC5jb21wb25lbnQnXG5pbXBvcnQgeyBQcm9tcHRDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvcHJvbXB0L3Byb21wdC5jb21wb25lbnQnXG5pbXBvcnQgeyBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucydcbmltcG9ydCB7IENhcm91c2VsQ29tcG9uZW50LCBDYXJvdXNlbEl0ZW1EaXJlY3RpdmUsIENhcm91c2VsSXRlbUVsZW1lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY2Fyb3VzZWwvY2Fyb3VzZWwuY29tcG9uZW50J1xuaW1wb3J0IHsgUXVlc3Rpb25Db21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvcXVlc3Rpb24vcXVlc3Rpb24uY29tcG9uZW50J1xuaW1wb3J0IHsgQ2xpY2tlZE91dHNpZGVEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvY2xpY2tlZC1vdXRzaWRlLmRpcmVjdGl2ZSdcbmltcG9ydCB7IFNjcm9sbGluZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnXG5pbXBvcnQgeyBCcmVhZGNydW1ic0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9icmVhZGNydW1icy9icmVhZGNydW1icy5jb21wb25lbnQnXG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgRm9ybXNNb2R1bGUsXG4gICAgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUsXG4gICAgU2Nyb2xsaW5nTW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIENsaWNrZWRPdXRzaWRlRGlyZWN0aXZlLFxuICAgIEtub2JDb21wb25lbnQsXG4gICAgTW91c2VXaGVlbERpcmVjdGl2ZSxcbiAgICBWYWx1ZVNjcmVlbkNvbXBvbmVudCxcbiAgICBCdXR0b25Db21wb25lbnQsXG4gICAgVG9nZ2xlQ29tcG9uZW50LFxuICAgIENvbnRhaW5lckNvbXBvbmVudCxcbiAgICBJbnB1dEZpZWxkQ29tcG9uZW50LFxuICAgIFNlbGVjdEJveENvbXBvbmVudCxcbiAgICBEcm9wZG93bkNvbXBvbmVudCxcbiAgICBTY3Jld0NvbXBvbmVudCxcbiAgICBWZW50Q29tcG9uZW50LFxuICAgIERpdmlkZXJDb21wb25lbnQsXG4gICAgSWNvbkNvbXBvbmVudCxcbiAgICBGbGF0U2xpZGVyQ29tcG9uZW50LFxuICAgIFRvb2x0aXBEaXJlY3RpdmUsXG4gICAgVG9vbHRpcENvbXBvbmVudCxcbiAgICBUb29sdGlwQ29udGFpbmVyQ29tcG9uZW50LFxuICAgIFNrZXVvbW9ycGhTbGlkZXJDb21wb25lbnQsXG4gICAgTGFiZWxDb21wb25lbnQsXG4gICAgTG9hZGluZ0NvbXBvbmVudCxcbiAgICBDaGVja2JveENvbXBvbmVudCxcbiAgICBQcm9tcHRDb21wb25lbnQsXG4gICAgQ2Fyb3VzZWxDb21wb25lbnQsXG4gICAgQ2Fyb3VzZWxJdGVtRWxlbWVudCxcbiAgICBDYXJvdXNlbEl0ZW1EaXJlY3RpdmUsXG4gICAgUXVlc3Rpb25Db21wb25lbnQsXG4gICAgQnJlYWRjcnVtYnNDb21wb25lbnRcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIENsaWNrZWRPdXRzaWRlRGlyZWN0aXZlLFxuICAgIEtub2JDb21wb25lbnQsXG4gICAgVmFsdWVTY3JlZW5Db21wb25lbnQsXG4gICAgQnV0dG9uQ29tcG9uZW50LFxuICAgIFRvZ2dsZUNvbXBvbmVudCxcbiAgICBJbnB1dEZpZWxkQ29tcG9uZW50LFxuICAgIENvbnRhaW5lckNvbXBvbmVudCxcbiAgICBTZWxlY3RCb3hDb21wb25lbnQsXG4gICAgRHJvcGRvd25Db21wb25lbnQsXG4gICAgU2NyZXdDb21wb25lbnQsXG4gICAgVmVudENvbXBvbmVudCxcbiAgICBEaXZpZGVyQ29tcG9uZW50LFxuICAgIEljb25Db21wb25lbnQsXG4gICAgRmxhdFNsaWRlckNvbXBvbmVudCxcbiAgICBUb29sdGlwQ29udGFpbmVyQ29tcG9uZW50LFxuICAgIFRvb2x0aXBDb21wb25lbnQsXG4gICAgVG9vbHRpcERpcmVjdGl2ZSxcbiAgICBTa2V1b21vcnBoU2xpZGVyQ29tcG9uZW50LFxuICAgIExhYmVsQ29tcG9uZW50LFxuICAgIExvYWRpbmdDb21wb25lbnQsXG4gICAgQ2hlY2tib3hDb21wb25lbnQsXG4gICAgQ2Fyb3VzZWxDb21wb25lbnQsXG4gICAgQ2Fyb3VzZWxJdGVtRGlyZWN0aXZlLFxuICAgIFF1ZXN0aW9uQ29tcG9uZW50LFxuICAgIEJyZWFkY3J1bWJzQ29tcG9uZW50XG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIFV0aWxpdGllc1NlcnZpY2VcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBDb21wb25lbnRzTW9kdWxlIHt9XG4iXX0=
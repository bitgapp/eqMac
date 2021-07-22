import {
  NgModule
} from '@angular/core'
import {
  CommonModule
} from '@angular/common'
import {
  KnobComponent
} from './components/knob/knob.component'
import {
  ValueScreenComponent
} from './components/value-screen/value-screen.component'
import {
  ButtonComponent
} from './components/button/button.component'
import {
  ToggleComponent
} from './components/toggle/toggle.component'
import { ContainerComponent } from './components/container/container.component'
import { InputFieldComponent } from './components/input-field/input-field.component'
import { FormsModule } from '@angular/forms'
import { SelectBoxComponent } from './components/select-box/select-box.component'
import { DropdownComponent } from './components/dropdown/dropdown.component'
import { ScrewComponent } from './components/screw/screw.component'
import { VentComponent } from './components/vent/vent.component'
import { DividerComponent } from './components/divider/divider.component'
import { IconComponent } from './components/icon/icon.component'
import { FlatSliderComponent } from './components/flat-slider/flat-slider.component'
import { TooltipDirective } from './components/tooltip/tooltip.directive'
import { TooltipContainerComponent } from './components/tooltip/tooltip-container.component'
import { TooltipComponent } from './components/tooltip/tooltip.component'
import { SkeuomorphSliderComponent } from './components/skeuomorph-slider/skeuomorph-slider.component'
import { UtilitiesService } from './services/utilities.service'
import { LabelComponent } from './components/label/label.component'
import { LoadingComponent } from './components/loading/loading.component'
import { CheckboxComponent } from './components/checkbox/checkbox.component'
import { PromptComponent } from './components/prompt/prompt.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { CarouselComponent, CarouselItemDirective, CarouselItemElement } from './components/carousel/carousel.component'
import { QuestionComponent } from './components/question/question.component'
import { ClickedOutsideDirective } from './directives/clicked-outside.directive'
import { ScrollingModule } from '@angular/cdk/scrolling'
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component'
import { ProComponent } from './components/pro/pro.component'
import { ColorsService } from './services/colors.service'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ScrollingModule
  ],
  declarations: [
    ClickedOutsideDirective,
    KnobComponent,
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
})
export class ComponentsModule {}

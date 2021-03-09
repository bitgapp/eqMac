import {
  NgModule, TemplateRef
} from '@angular/core'
import {
  CommonModule
} from '@angular/common'
import {
  KnobComponent
} from './components/knob/knob.component'
import {
  MouseWheelDirective
} from './directives/mousewheel.directive'

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
import { AnalyzerComponent } from './components/analyzer/analyzer.component'
import { ScrewComponent } from './components/screw/screw.component'
import { VentComponent } from './components/vent/vent.component'
import { DividerComponent } from './components/divider/divider.component'
import { IconComponent } from './components/icon/icon.component'
import { HttpClientModule } from '@angular/common/http'
import { FlatSliderComponent } from './components/flat-slider/flat-slider.component'
import { TooltipDirective } from './components/tooltip/tooltip.directive'
import { TooltipContainerComponent } from './components/tooltip/tooltip-container.component'
import { TooltipComponent } from './components/tooltip/tooltip.component'
import { SkeuomorphSliderComponent } from './components/skeuomorph-slider/skeuomorph-slider.component'
import { UtilitiesService } from './services/utilities.service'
import { LabelComponent } from './components/label/label.component'
import { PipesModule } from '../pipes/pipes.module'
import { LoadingComponent } from './components/loading/loading.component'
import { CheckboxComponent } from './components/checkbox/checkbox.component'
import { PromptComponent } from './components/prompt/prompt.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { CarouselComponent, CarouselItemDirective, CarouselItemElement } from './components/carousel/carousel.component'
import { QuestionComponent } from './components/question/question.component'
import { ClickedOutsideDirective } from './directives/clicked-outside.directive'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    PipesModule,
    BrowserAnimationsModule
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
    AnalyzerComponent,
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
    QuestionComponent
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
    AnalyzerComponent,
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
    QuestionComponent
  ],
  providers: [
    UtilitiesService
  ]
})
export class EqmacComponentsModule {}

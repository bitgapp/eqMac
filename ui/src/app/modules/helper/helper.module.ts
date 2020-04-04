import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PositionRelativeDirective } from './directives/position-relative.directive'
import { TopRightDirective } from './directives/top-right.directive'
import { PositionAbsoluteDirective } from './directives/position-absolute.directive'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PositionRelativeDirective, TopRightDirective, PositionAbsoluteDirective],
  exports: [
    PositionRelativeDirective, TopRightDirective, PositionAbsoluteDirective
  ]
})
export class HelperModule { }

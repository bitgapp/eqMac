import {
  NgModule
} from '@angular/core'
import {
  CommonModule
} from '@angular/common'
import {
  ClipValuePipe
} from './clip-value.pipe'
import {
  CapitalizeFirstPipe
} from './capitalizefirst.pipe'
import {
  MapValuePipe
} from './map-value.pipe'
import {
  FixFloatPipe
} from './fix-float.pipe'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ClipValuePipe,
    CapitalizeFirstPipe,
    MapValuePipe,
    FixFloatPipe
  ],
  exports: [
    ClipValuePipe,
    CapitalizeFirstPipe,
    MapValuePipe,
    FixFloatPipe
  ]
})
export class PipesModule {}

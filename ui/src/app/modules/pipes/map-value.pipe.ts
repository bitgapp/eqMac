import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'mapValue'
})
export class MapValuePipe implements PipeTransform {
  transform (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
  }
}

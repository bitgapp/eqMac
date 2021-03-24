import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'fixFloat'
})
export class FixFloatPipe implements PipeTransform {
  transform (value: number, fixTo: number, showZeros = true) {
    let fixedValue: any = value.toFixed(fixTo)
    if (!showZeros) {
      fixedValue = parseFloat(fixedValue)
    }
    return fixedValue
  }
}

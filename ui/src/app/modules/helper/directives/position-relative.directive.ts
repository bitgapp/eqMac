import { Directive, ElementRef } from '@angular/core'

@Directive({
  selector: '[eqmPositionRelative]'
})
export class PositionRelativeDirective {
  constructor (element: ElementRef) {
    const style = element.nativeElement.style
    style.position = 'relative'
  }
}

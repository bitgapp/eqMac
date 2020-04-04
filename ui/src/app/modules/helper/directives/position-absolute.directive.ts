import { Directive, ElementRef } from '@angular/core'

@Directive({
  selector: '[eqmPositionAbsolute]'
})
export class PositionAbsoluteDirective {
  constructor (element: ElementRef) {
    const style = element.nativeElement.style
    style.position = 'absolute'
  }
}

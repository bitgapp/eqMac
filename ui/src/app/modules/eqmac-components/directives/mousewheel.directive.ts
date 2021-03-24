import { Directive, Output, HostListener, EventEmitter } from '@angular/core'

@Directive({ selector: '[mouseWheel]' })
export class MouseWheelDirective {
  @Output() mouseWheel = new EventEmitter()

  @HostListener('mousewheel', [ '$event' ]) onMouseWheelChrome (event: any) {
    this.mouseWheelFunc(event)
  }

  @HostListener('DOMMouseScroll', [ '$event' ]) onMouseWheelFirefox (event: any) {
    this.mouseWheelFunc(event)
  }

  @HostListener('onmousewheel', [ '$event' ]) onMouseWheelIE (event: any) {
    this.mouseWheelFunc(event)
  }

  mouseWheelFunc (event: any) {
    event = window.event || event // old IE support
    this.mouseWheel.emit(event)
    // for IE
    event.returnValue = false
    // for Chrome and Firefox
    if (event.preventDefault) {
      event.preventDefault()
    }
  }
}

import { Directive, EventEmitter, HostListener, Output } from '@angular/core'

@Directive({ selector: '[clickedOutside]' })
export class ClickedOutsideDirective {
  @Output() clickedOutside = new EventEmitter<MouseEvent>()

  private inside = false
  @HostListener('click')
  insideClick () {
    this.inside = true
  }

  @HostListener('document:click', [ '$event' ])
  outsideClick (event: MouseEvent) {
    if (!this.inside) {
      this.clickedOutside.emit(event)
    }
    this.inside = false
  }
}

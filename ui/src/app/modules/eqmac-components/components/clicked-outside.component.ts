import { Component, EventEmitter, HostListener, Output } from "@angular/core";


// @Component({
//   template: ``
// })
export class ClickedOutsideComponent {
  @Output() clickedOutside = new EventEmitter()

  private inside = false
  @HostListener('click')
  insideClick () {
    this.inside = true
  }
  @HostListener('document:click')
  outsideClick () {
    if (!this.inside) {
      this.clickedOutside.emit()
    }
    this.inside = false
  }
}
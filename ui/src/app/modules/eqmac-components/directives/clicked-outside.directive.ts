import { Component, Directive, EventEmitter, HostListener, Output } from "@angular/core";

@Directive({ selector: `[clickedOutside]` })
export class ClickedOutsideDirective {
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
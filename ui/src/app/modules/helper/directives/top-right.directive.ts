import { Directive, ElementRef, Input, OnInit } from '@angular/core'

@Directive({
  selector: '[eqmTopRight]'
})

export class TopRightDirective implements OnInit {
  @Input() top = 0
  @Input() right = 0
  constructor (private element: ElementRef) {}

  ngOnInit () {
    const style = this.element.nativeElement.style
    style.right = `${this.right}px`
    style.top = `${this.top}px`
  }
}

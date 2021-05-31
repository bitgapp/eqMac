import { Component, Input, ElementRef, HostBinding } from '@angular/core'

@Component({
  selector: 'eqm-divider',
  templateUrl: './divider.component.html',
  styleUrls: [ './divider.component.scss' ]
})
export class DividerComponent {
  @Input() orientation: 'vertical' | 'horizontal' = 'horizontal'

  constructor (
    public elem: ElementRef
  ) {}

  @HostBinding('style.width')
  get width () {
    return this.orientation === 'vertical' ? '1px' : `${this.elem.nativeElement.parentElement.offsetWidth}`
  }

  @HostBinding('style.height')
  get height () {
    return this.orientation === 'vertical' ? `${this.elem.nativeElement.parentElement.offsetHeight}` : '1px'
  }

  @HostBinding('style.border-left')
  get leftBorder () {
    return this.orientation === 'vertical' ? '1px solid rgb(58, 59, 61)' : undefined
  }

  @HostBinding('style.border-right')
  get rightBorder () {
    return this.orientation === 'vertical' ? '1px solid rgb(96, 97, 101)' : undefined
  }

  @HostBinding('style.border-top')
  get topBorder () {
    return this.orientation === 'horizontal' ? '1px solid rgb(58, 59, 61)' : undefined
  }

  @HostBinding('style.border-bottom')
  get bottomtBorder () {
    return this.orientation === 'horizontal' ? '1px solid rgb(96, 97, 101)' : undefined
  }
}

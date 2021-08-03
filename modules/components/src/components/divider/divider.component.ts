import { Component, Input, ElementRef, HostBinding, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'eqm-divider',
  template: '',
  styleUrls: [ './divider.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DividerComponent {
  @Input() orientation: 'vertical' | 'horizontal' = 'horizontal'

  constructor (
    public elem: ElementRef
  ) {}

  @HostBinding('style.width')
  get width () {
    return this.orientation === 'vertical' ? '1px' : '100%'
  }

  @HostBinding('style.height')
  get height () {
    return this.orientation === 'vertical' ? 'initial' : '1px'
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

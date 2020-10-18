import { Component, ContentChildren, QueryList, Directive, ViewChild, ElementRef, Input, TemplateRef, ViewContainerRef, AfterViewInit, Output, EventEmitter, HostBinding, ViewChildren, OnDestroy } from '@angular/core'
import { AnimationPlayer, AnimationFactory, animate, style, AnimationBuilder } from '@angular/animations'

@Directive({
  selector: '[eqmCarouselItem]'
})
export class CarouselItemDirective {
  @Input() eqmCarouselItem: string

  constructor (
    public template: TemplateRef<any>
  ) {

  }
}

@Directive({
  selector: '.item'
})
export class CarouselItemElement {
}

@Component({
  selector: 'eqm-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements AfterViewInit, OnDestroy {
  @ContentChildren(CarouselItemDirective) items: QueryList<CarouselItemDirective>
  @ViewChildren(CarouselItemElement, { read: ElementRef }) itemElems: QueryList<ElementRef>
  @ViewChild('wrapper', { static: true }) wrapper: ElementRef
  @Input() loop = false
  @Input() animationDuration = 500
  _height: number
  get height () { return this._height }
  set height (newHeight: number) {
    const diff = newHeight - this.height
    this._height = newHeight
    if (diff) {
      this.heightChange.emit(newHeight)
      this.heightDiff.emit(diff)
    }
  }
  @Output() heightDiff = new EventEmitter<number>()
  @Output() heightChange = new EventEmitter<number>()
  public recalculateHeightTimer

  public _selectedItemId: string
  @Input() set selectedItemId (newSelectedItemId: string) {
    if (this._selectedItemId !== newSelectedItemId) {
      this._selectedItemId = newSelectedItemId
      this.animate()
    }
    this.recalculateHeight()
    this.itemCameIntoView.emit(this.selectedItemId)
  }
  get selectedItemId () { return this._selectedItemId }
  @Output() selectedItemIdChange = new EventEmitter<string>()
  @Output() animationCompleted = new EventEmitter<string>()

  @Output() itemCameIntoView = new EventEmitter<string>()
  constructor (
    public builder: AnimationBuilder
  ) {
  }

  get wrapperStyle () {
    return {
      height: `${this.height}px`,
      transitionDuration: `${this.animationDuration}ms`,
      width: `${this.items.length * 100}%`
    }
  }

  ngAfterViewInit () {
    for (const item of this.items.toArray()) {
      if (!item.eqmCarouselItem || typeof item.eqmCarouselItem !== 'string') {
        throw new Error(`eqmCarouselItem directive was not provided an item ID`)
      }
    }

    this.animate()
    this.recalculateHeight()
    this.recalculateHeightTimer = setInterval(this.recalculateHeight.bind(this), 1000)
  }

  ngOnDestroy () {
    if (this.recalculateHeightTimer) {
      clearInterval(this.recalculateHeightTimer)
    }
  }

  get currentIndex () {
    const items = this.items.toArray()
    const index = items.indexOf(items.find(item => item.eqmCarouselItem === this.selectedItemId))
    return index >= 0 ? index : 0
  }

  next () {
    const currentIndex = this.currentIndex
    if (!this.loop && currentIndex >= this.items.length - 1) return
    const nextIndex = (currentIndex + 1) % this.items.length
    this.selectedItemId = this.items.toArray()[nextIndex].eqmCarouselItem
    this.selectedItemIdChange.emit(this.selectedItemId)
  }

  prev () {
    const currentIndex = this.currentIndex
    if (!this.loop && currentIndex === 0) return
    const previousIndex = ((currentIndex - 1) + this.items.length) % this.items.length
    this.selectedItemId = this.items.toArray()[previousIndex].eqmCarouselItem
    this.selectedItemIdChange.emit(this.selectedItemId)
  }

  public animate () {
    const myAnimation: AnimationFactory = this.animation
    const player = myAnimation.create(this.wrapper.nativeElement)
    player.play()
    setTimeout(() => this.animationCompleted.emit(), this.animationDuration)
  }

  public get animation () {
    const offset = this.currentIndex * 100 / this.items.length
    return this.builder.build([
      animate(`${this.animationDuration}ms ease-in`, style({ transform: `translateX(-${offset}%)` }))
    ])
  }

  public recalculateHeight () {
    const itemEl = this.itemElems && this.itemElems.toArray()[this.currentIndex].nativeElement.nextElementSibling
    itemEl && itemEl.offsetHeight && (this.height = itemEl.offsetHeight)
  }

}

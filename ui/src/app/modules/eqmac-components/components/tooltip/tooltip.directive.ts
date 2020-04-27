import { Directive, OnDestroy, Input, HostListener, ElementRef } from '@angular/core'
import { TooltipService } from './tooltip.service'
import { TooltipPositionSide } from './tooltip.component'

@Directive({
  selector: '[eqmTooltip]'
})
export class TooltipDirective implements OnDestroy {
  @Input() eqmTooltip = ''
  @Input() eqmTooltipDelay = 100
  @Input() eqmTooltipPositionSide: TooltipPositionSide = 'top'
  @Input() eqmTooltipShowArrow: boolean = true
  private id: string
  private left: boolean
  constructor (private tooltipService: TooltipService, private element: ElementRef) { }

  @HostListener('mouseenter')
  onMouseEnter (): void {
    this.left = false
    this.id = Math.round(Math.random() * 10000).toString()
    const tooltip = {
      id: this.id,
      parent: this.element,
      positionSide: this.eqmTooltipPositionSide,
      showArrow: this.eqmTooltipShowArrow,
      text: this.eqmTooltip
    }
    setTimeout(() => {
      if (!this.left) {
        this.tooltipService.components.push(tooltip)
      }
    }, this.eqmTooltipDelay)
  }

  @HostListener('mouseleave')
  onMouseLeave (): void {
    this.left = true
    this.destroy()
  }

  @HostListener('click')
  onMouseClick (): void {
    this.left = true
    this.destroy()
  }

  ngOnDestroy (): void {
    this.destroy()
  }

  destroy (): void {
    this.tooltipService.components = []
  }

}

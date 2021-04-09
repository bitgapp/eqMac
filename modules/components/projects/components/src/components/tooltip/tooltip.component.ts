import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild
} from '@angular/core'
import { UtilitiesService } from '../../services/utilities.service'
import { DomSanitizer } from '@angular/platform-browser'

export type TooltipPositionSide = 'top' | 'bottom' | 'left' | 'right'
@Component({
  selector: 'eqm-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: [ './tooltip.component.scss' ]
})
export class TooltipComponent implements OnInit {
  @Input() text?: string
  @Input() parent?: any
  @Input() positionSide: TooltipPositionSide = 'top'
  @Input() showArrow: Boolean = true
  public padding = 10

  @ViewChild('arrow', {
    read: ElementRef,
    static: true
  }) arrow!: ElementRef

  @ViewChild('tooltip', {
    read: ElementRef,
    static: true
  }) tooltip!: ElementRef

  constructor (
    public elem: ElementRef,
    public utils: UtilitiesService,
    public sanitizer: DomSanitizer
  ) {}

  async ngOnInit () {
    await this.utils.delay(0)
  }

  get style () {
    if (!this.text?.length) {
      return {
        display: 'none'
      }
    }
    let x = -999
    let y = -999
    const body = document.body
    const html = document.documentElement
    const viewHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
    const viewWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth)
    const tooltipEl = this.tooltip.nativeElement
    const tooltipWidth = parseInt(tooltipEl.offsetWidth) + 3
    const tooltipHeight = parseInt(tooltipEl.offsetHeight) + 2
    const parentEl = this.parent.nativeElement
    const parentPosition = this.utils.getElementPosition(parentEl)
    const parentHeight = parseInt(parentEl.offsetHeight)

    x = parentPosition.x
    y = parentPosition.y

    if (this.positionSide === 'bottom') {
      y += parentHeight
    }

    if (this.positionSide === 'top') {
      y -= tooltipHeight + this.padding
      x -= tooltipWidth / 2
    }

    if (this.positionSide === 'bottom') {
      y = y + this.padding
      x = x - (tooltipWidth / 2)
    }

    const maxX = viewWidth - tooltipWidth - this.padding / 4
    if (x > maxX) x = maxX

    const minX = this.padding
    if (x < minX) x = minX

    const maxY = viewHeight - tooltipHeight - this.padding / 4
    if (y > maxY) y = maxY

    const minY = this.padding
    if (y < minY) y = minY
    return {
      left: `${x}px`,
      top: `${y}px`
    }
  }

  get arrowStyle () {
    const arrowSize = 12

    let x = 0
    let y = 0
    let angle = 0
    const style: { [style: string]: string } = {}
    const tooltipEl = this.tooltip.nativeElement
    const tooltipHeight = tooltipEl.offsetHeight
    const tooltipPosition = this.utils.getElementPosition(tooltipEl)

    const parentEl = this.parent.nativeElement
    const parentPosition = this.utils.getElementPosition(parentEl)
    const parentWidth = parentEl.offsetWidth

    x = parentPosition.x + parentWidth / 2 - tooltipPosition.x - arrowSize / 2 + 3
    if (this.positionSide === 'top') {
      y = tooltipHeight - arrowSize / 2 + 4
    }

    if (this.positionSide === 'top') {
      angle = 180
    }

    if (this.positionSide === 'bottom') {
      y = -arrowSize / 2 + 3
    }

    style.top = `${y}px`
    style.left = `${x}px`
    style.transform = `rotate(${angle}deg)`

    return style
  }
}

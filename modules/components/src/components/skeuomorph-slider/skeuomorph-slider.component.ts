import {
  Component,
  OnInit,
  Input,
  Output,
  ElementRef,
  HostListener,
  ViewChild,
  EventEmitter,
  HostBinding,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core'
import {
  UtilitiesService
} from '../../services/utilities.service'

export interface SkeuomorphSliderValueChangedEvent {
  value: number
  transition?: boolean
}

@Component({
  selector: 'eqm-skeuomorph-slider',
  templateUrl: './skeuomorph-slider.component.html',
  styleUrls: [ './skeuomorph-slider.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeuomorphSliderComponent implements OnInit, OnDestroy {
  constructor (
    public utils: UtilitiesService,
    public elRef: ElementRef<HTMLElement>,
    private readonly changeRef: ChangeDetectorRef
  ) {}

  @Input() min: number = 0
  @Input() max: number = 1
  @Input() animationDuration = 500
  @Input() animationFps = 30
  @Input() scrollEnabled = true
  @Input() middle?: number
  @Input() stickToMiddle = false
  @Output() stickedToMiddle = new EventEmitter()

  private readonly padding = 14

  get middleValue () {
    return typeof this.middle === 'number' ? this.middle : (this.min + this.max) / 2
  }

  public dragging = false
  public doubleclickTimeout?: number

  @ViewChild('notches', { static: true }) notches!: ElementRef
  @Output() userChangedValue = new EventEmitter<SkeuomorphSliderValueChangedEvent>()
  @Output() valueChange = new EventEmitter()
  @Input() showNotches = true

  @HostBinding('class.enabled') @Input() enabled = true

  public _value = 0.5
  @Input()
  set value (newValue) {
    let value = this.clampValue(newValue)

    if (this.stickToMiddle) {
      const middleValue = this.middleValue

      let diffFromMiddle = middleValue - value
      if (diffFromMiddle < 0) {
        diffFromMiddle *= -1
      }
      const percFromMiddle = this.utils.mapValue(diffFromMiddle, 0, this.max - middleValue, 0, 100)
      if ((this._value).toFixed(2) === (middleValue).toFixed(2) && percFromMiddle < 2) {
        value = middleValue
      } else if ((this._value < middleValue && newValue > this._value) || (this._value > middleValue && newValue < this._value)) {
        if (percFromMiddle < 1) {
          value = middleValue
          this.stickedToMiddle.emit()
        }
      }
    }
    this._value = this.clampValue(value)
    this.valueChange.emit(this._value)
    this.changeRef.detectChanges()
  }

  get value () { return this._value }

  get width () {
    return this.elRef.nativeElement.offsetWidth
  }

  get height () {
    return this.elRef.nativeElement.offsetHeight
  }

  get notchCount () {
    let multiplier = this.height / 167
    multiplier = Math.floor(Math.max(1, multiplier))
    let count = multiplier * 11
    count = count % 2 === 1 ? count : count + 1
    return count
  }

  private lastWheelEvent = new Date().getTime()
  private readonly wheelDebouncer = 1000 / 30
  @HostListener('mousewheel', [ '$event' ])
  onMouseWheel (event: WheelEvent): void {
    if (this.enabled && this.scrollEnabled) {
      const now = new Date().getTime()
      if ((now - this.lastWheelEvent) < this.wheelDebouncer) return
      this.lastWheelEvent = now
      const changeDelta = -event.deltaY
      const diff = changeDelta < 0 ? -changeDelta : changeDelta
      if (diff < 2) return
      this.value += changeDelta * ((this.max - this.min) / 1000)
      this.userChangedValue.emit({ value: this.value })
    }
  }

  public getValueFromMouseEvent (event: MouseEvent) {
    const coords = this.utils.getCoordinatesInsideElementFromEvent(event, this.elRef.nativeElement)
    const y = coords.y
    const value = this.clampValue(this.utils.mapValue(y, this.height - this.padding / 2, this.padding, this.min, this.max))
    return value
  }

  public clampValue (value: number) {
    if (value < this.min) {
      return this.min
    } else if (value > this.max) {
      return this.max
    } else {
      return value
    }
  }

  @HostListener('mousedown', [ '$event' ])
  mousedown (event: MouseEvent) {
    if (this.enabled) {
      this.dragging = true
      if (!this.doubleclickTimeout) {
        this.doubleclickTimeout = setTimeout(() => {
          this.doubleclickTimeout = undefined
          this.value = this.getValueFromMouseEvent(event)
          this.userChangedValue.emit({ value: this.value })
        }, 200) as unknown as number
      }
    }
  }

  @HostListener('mousemove', [ '$event' ])
  mousemove = (event: MouseEvent) => {
    if (this.enabled && this.dragging) {
      this.value = this.getValueFromMouseEvent(event)
      this.userChangedValue.emit({ value: this.value })
    }
  }

  @HostListener('mouseleave', [ '$event' ])
  mouseleave () {
    if (this.dragging) {
      this.attachWindowEvents()
    }
  }

  @HostListener('mouseup', [ '$event' ])
  mouseup = (event: MouseEvent) => {
    this.dragging = false
    this.dettachWindowEvents()
  }

  @HostListener('mouseenter', [ '$event' ])
  mouseenter () {
    if (this.windowEventsAttached) {
      this.dettachWindowEvents()
    }
  }

  private windowEventsAttached = false
  private attachWindowEvents () {
    if (this.windowEventsAttached) return
    this.windowEventsAttached = true
    window.addEventListener('mousemove', this.mousemove, true)
    window.addEventListener('mouseup', this.mouseup, true)
  }

  private dettachWindowEvents () {
    window.removeEventListener('mousemove', this.mousemove, true)
    window.removeEventListener('mouseup', this.mouseup, true)
    this.windowEventsAttached = false
  }

  doubleclick () {
    if (this.enabled) {
      if (this.doubleclickTimeout) {
        clearTimeout(this.doubleclickTimeout)
      }

      this.userChangedValue.emit({
        value: this.middleValue,
        transition: true
      })
      this.animateSlider(this.value, this.middleValue)
    }
  }

  ngOnInit () {
    if (this.showNotches) {
      this.drawNotches()
      setTimeout(() => this.drawNotches())
    }
    setTimeout(() => this.changeRef.detectChanges())
  }

  async animateSlider (from: number, to: number) {
    from = this.clampValue(from)
    to = this.clampValue(to)
    const diff = to - from
    const delay = 1000 / this.animationFps
    const frames = this.animationFps * (this.animationDuration / 1000)
    const step = diff / frames
    let value = from
    for (let frame = 0; frame < frames; frame++) {
      await this.utils.delay(delay)
      value += step
      this.value = value
    }
  }

  drawNotches () {
    const canvas = this.notches.nativeElement
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')
    canvas.height = this.height
    canvas.width = this.width
    const gap = (this.height - this.padding * 2) / (this.notchCount - 1)
    ctx.strokeStyle = '#559e7d'
    for (let i = 0; i < this.notchCount; i++) {
      const y = Math.round(this.padding + gap * i) - 1
      ctx.beginPath()
      const lineWidth = [ 0, (this.notchCount - 1) / 2, this.notchCount - 1 ].includes(i) ? this.width : (this.width * 0.9)
      ctx.moveTo((this.width - lineWidth) / 1, y)
      ctx.lineTo(lineWidth, y)
      ctx.stroke()
      ctx.closePath()
    }
    ctx.clearRect(this.width / 2 - 5, 0, 9, this.height)
  }

  calculateTop () {
    return `${this.utils.mapValue(this._value, this.min, this.max, this.height - 25, 0) - 1}px`
  }

  ngOnDestroy () {
    this.dettachWindowEvents()
  }
}

import {
  Component,
  OnInit,
  Input,
  Output,
  ElementRef,
  HostListener,
  ViewChild,
  EventEmitter,
  HostBinding
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
  styleUrls: [ './skeuomorph-slider.component.scss' ]
})
export class SkeuomorphSliderComponent implements OnInit {
  constructor (public utils: UtilitiesService, public elRef: ElementRef) {}

  @Input() min: number = 0
  @Input() max: number = 1
  @Input() animationDuration = 500
  @Input() animationFps = 30
  @Input() scrollEnabled = true
  @Input() middle?: number
  @Input() stickToMiddle = false
  @Output() stickedToMiddle = new EventEmitter()

  get middleValue () {
    return typeof this.middle === 'number' ? this.middle : (this.min + this.max) / 2
  }

  public dragging = false
  public doubleclickTimeout?: number

  @ViewChild('notches', { static: true }) notches!: ElementRef
  @Output() userChangedValue = new EventEmitter<SkeuomorphSliderValueChangedEvent>()
  @Output() valueChange = new EventEmitter()
  @Input() showNotches = true

  @HostBinding('class.disabled') @Input() disabled = false

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
      if ((this._value).toFixed(2) === (middleValue).toFixed(2) && percFromMiddle < 5) {
        value = middleValue
      } else if ((this._value < middleValue && newValue > this._value) || (this._value > middleValue && newValue < this._value)) {
        if (percFromMiddle < 3) {
          value = middleValue
          this.stickedToMiddle.emit()
        }
      }
    }
    this._value = this.clampValue(value)
    this.valueChange.emit(this._value)
  }

  get value () { return this._value }

  @HostListener('mousewheel', [ '$event' ])
  onMouseWheel (event: WheelEvent): void {
    if (!this.disabled && this.scrollEnabled) {
      this.value += -event.deltaY / 100
      this.userChangedValue.emit({ value: this.value })
    }
  }

  public getValueFromMouseEvent (event: MouseEvent) {
    const coords = this.utils.getCoordinatesInsideElementFromEvent(event, this.elRef.nativeElement)
    const y = coords.y
    const height = this.elRef.nativeElement.offsetHeight
    const padding = height * 0.11
    const value = this.clampValue(this.utils.mapValue(y, height - padding / 2, padding, this.min, this.max))
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
  onMouseDown (event: MouseEvent) {
    if (!this.disabled) {
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
  onMouseMove (event: MouseEvent) {
    if (!this.disabled && this.dragging) {
      this.value = this.getValueFromMouseEvent(event)
      this.userChangedValue.emit({ value: this.value })
    }
  }

  @HostListener('mouseup', [ '$event' ])
  onMouseUp () {
    this.dragging = false
  }

  @HostListener('mouseleave')
  onMouseLeave () {
    this.dragging = false
  }

  doubleclick () {
    if (!this.disabled) {
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

  @HostListener('window:resize')
  drawNotches () {
    const canvas = this.notches.nativeElement
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')
    const height = this.elRef.nativeElement.offsetHeight
    const width = this.elRef.nativeElement.offsetWidth
    canvas.height = height
    canvas.width = width
    const padding = height * 0.08
    const gap = (height - padding * 2) / 10
    ctx.strokeStyle = '#559e7d'
    for (let i = 0; i <= 10; i++) {
      const y = Math.round(padding + gap * i) - 0.5
      ctx.beginPath()
      const lineWidth = [ 0, 5, 10 ].includes(i) ? width : (width * 0.9)
      ctx.moveTo((width - lineWidth) / 1, y)
      ctx.lineTo(lineWidth, y)
      ctx.stroke()
      ctx.closePath()
    }
    ctx.clearRect(width / 2 - 5, 0, 9, height)
  }

  calculateTop () {
    return `${this.utils.mapValue(this._value, this.min, this.max, parseInt(this.elRef.nativeElement.offsetHeight) - 25, 0)}px`
  }
}

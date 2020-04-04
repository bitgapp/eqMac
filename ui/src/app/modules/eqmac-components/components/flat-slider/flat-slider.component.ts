import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  HostBinding
} from '@angular/core'
import {
  UtilitiesService
} from '../../services/utilities.service'
import { FadeInOutAnimation } from '../../../animations'
import { SafeStyle, DomSanitizer } from '@angular/platform-browser'

export interface FlatSliderValueChangedEvent {
  value: number
  transition?: boolean
}

@Component({
  selector: 'eqm-flat-slider',
  templateUrl: './flat-slider.component.html',
  styleUrls: ['./flat-slider.component.scss'],
  animations: [FadeInOutAnimation]
})
export class FlatSliderComponent {
  constructor (
    private utils: UtilitiesService,
    private elem: ElementRef,
    private sanitizer: DomSanitizer
  ) {}

  @Input() min: number = 0
  @Input() max: number = 1
  @Input() animationDuration = 500
  @Input() animationFps = 30
  @Input() scrollEnabled = true
  @Input() middle: number
  @Input() stickToMiddle = true
  @Input() thickness = 2
  @Input() orientation: 'vertical' | 'horizontal' = 'horizontal'
  @Output() stickedToMiddle = new EventEmitter()
  get middleValue () {
    return typeof this.middle === 'number' ? this.middle : (this.min + this.max) / 2
  }

  private defaultColor = '#4f8d71'
  private _enabled = true

  @HostBinding('class.disabled') get disabled () { return !this.enabled }
  @Input()
  set enabled (shouldBeEnabled) {
    this._enabled = shouldBeEnabled
    this._color = this._enabled ? this.defaultColor : '#777'
  }
  get enabled () { return this._enabled }

  private _color = this.defaultColor
  @Input()
  set color (newColor) {
    this.defaultColor = newColor
    this._color = this._enabled ? this.defaultColor : '#777'
  }
  get color () {
    return this._color
  }

  get darkerColor () {
    const rgb = this.utils.hexToRgb(this.color)
    for (const channel in rgb) {
      rgb[channel] = Math.round(0.8 * rgb[channel])
    }
    const hex = this.utils.rgbToHex(rgb)
    return hex
  }

  private dragging = false
  private knobRadius = 4

  private _value = .5
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

  @Output() valueChange = new EventEmitter()
  @Output() userChangedValue = new EventEmitter<FlatSliderValueChangedEvent>()

  get height () {
    return this.elem.nativeElement.offsetHeight
  }

  get width () {
    return this.elem.nativeElement.offsetWidth
  }
  private clampValue (value) {
    if (value < this.min) return this.min
    if (value > this.max) return this.max
    return value
  }

  @HostListener('mousewheel', ['$event'])
  mouseWheel (event: MouseWheelEvent) {
    if (this.enabled && this.scrollEnabled) {
      const multiplier = (this.max - this.min) / 1000
      this.value = this._value + (-event.deltaY * multiplier)
      this.userChangedValue.emit({ value: this._value })
    }
  }

  private getValueFromMouseEvent (event: MouseEvent) {
    const coords = this.utils.getCoordinatesInsideElementFromEvent(event, this.elem.nativeElement)
    const progress = this.orientation === 'vertical' ? coords.y : coords.x
    const value = this.utils.mapValue(progress, this.knobRadius, (this.orientation === 'vertical' ? this.height : this.width) - this.knobRadius, this.min, this.max)
    return value
  }

  @HostListener('mousedown', ['$event'])
  mousedown (event: MouseEvent) {
    if (this.enabled) {
      this.dragging = true
      this.value = this.getValueFromMouseEvent(event)
      this.userChangedValue.emit({ value: this._value })
    }
  }

  @HostListener('mousemove', ['$event'])
  mousemove (event: MouseEvent) {
    if (this.enabled && this.dragging) {
      this.value = this.getValueFromMouseEvent(event)
      this.userChangedValue.emit({ value: this._value })
    }
  }

  private mouseInside = false
  @HostListener('mouseenter')
  onMouseEnter (): void {
    this.mouseInside = true
  }
  @HostListener('mouseleave')
  onMouseLeave (): void {
    this.mouseInside = false
    this.dragging = false
  }

  private doubleclickTimeout = null
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
    return
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp () {
    this.dragging = false
  }
  mouseup (event) {
    this.dragging = false
  }

  get progress () {
    return this.utils.mapValue(this.value, this.min, this.max, 0, 1)
  }

  @HostBinding('style')
  get style (): SafeStyle {
    const styles: { [style: string]: string } = {}
    const thickness = this.knobRadius * 2 + 2
    if (this.orientation === 'horizontal') {
      styles.width = `100%`
      styles.height = `${thickness}px`
      styles.flexDirection = 'column'
    } else {
      styles.height = `100%`
      styles.width = `${thickness}px`
      styles.flexDirection = 'row'
    }

    const style = Object.entries(styles)
    .map(([ key, value ]) => `${key}: ${value}`)
    .join('; ')
    return this.sanitizer.bypassSecurityTrustStyle(style)
  }

  get grooveStyle () {
    const style: { [style: string]: string | number } = {}
    if (this.orientation === 'horizontal') {
      style.left = `${this.knobRadius}px`
      style.width = `calc(100% - ${this.knobRadius * 2}px)`
      style.height = `${this.thickness}px`
    } else {
      style.bottom = `${this.knobRadius}px`
      style.height = `calc(100% - ${this.knobRadius * 2}px)`
      style.width = `${this.thickness}px`
    }
    style.backgroundColor = this.darkerColor
    return style
  }

  get grooveFillingStyle () {
    const style: { [style: string]: string } = {}
    if (this.orientation === 'horizontal') {
      style.left = `${this.knobRadius}px`
      style.width = `calc(${this.progress * 100}% - ${this.knobRadius}px)`
      style.height = `${this.thickness}px`
    } else {
      style.bottom = `${this.knobRadius}px`
      style.height = `calc(${this.progress * 100}% - ${this.knobRadius * 2}px)`
      style.width = `${this.thickness}px`
    }
    style.backgroundColor = this.color
    return style
  }

  get thumbNotchStyle () {
    const style: { [style: string]: string | number } = {}
    style.width = `${this.knobRadius * 2}px`
    style.height = style.width
    style.backgroundColor = this.value >= this.middleValue ? this.color : this.darkerColor

    style.borderRadius = '100%'
    if (this.orientation === 'horizontal') {
      style.left = `${this.utils.mapValue(this.middleValue, this.min, this.max, 0, this.width)}px`
    } else {
      style.bottom = `${this.utils.mapValue(this.middleValue, this.min, this.max, 0, this.height)}px`
    }

    return style
  }

  get thumbStyle () {
    const style: { [style: string]: number | string } = {}
    style.width = `${this.knobRadius * 2}px`
    style.height = style.width
    style.border = '1px solid black'
    style.backgroundColor = this.color

    style.borderRadius = '100%'
    if (this.orientation === 'horizontal') {
      style.left = `${this.utils.mapValue(this.value, this.min, this.max, 0, this.width - this.knobRadius * 2)}px`
    } else {
      style.bottom = `${this.utils.mapValue(this.value, this.min, this.max, 0, this.height - this.knobRadius * 2)}px`
    }
    return style
  }
}

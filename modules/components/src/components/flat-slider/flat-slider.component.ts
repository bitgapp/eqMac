import {
  Component,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  HostBinding,
  HostListener,
  OnInit,
  OnDestroy
} from '@angular/core'
import {
  UtilitiesService
} from '../../services/utilities.service'
import { FadeInOutAnimation } from '../../animations'
import { DomSanitizer } from '@angular/platform-browser'

export interface FlatSliderValueChangedEvent {
  value: number
  transition?: boolean
}

@Component({
  selector: 'eqm-flat-slider',
  templateUrl: './flat-slider.component.html',
  styleUrls: [ './flat-slider.component.scss' ],
  animations: [ FadeInOutAnimation ]
})
export class FlatSliderComponent implements OnInit, OnDestroy {
  constructor (
    public utils: UtilitiesService,
    public elem: ElementRef<HTMLElement>,
    public sanitizer: DomSanitizer
  ) {}

  @Input() scale: 'logarithmic' | 'linear' = 'linear'
  @Input() doubleClickToAnimateToMiddle = true
  @Input() showMiddleNotch = true
  @Input() min: number = 0
  @Input() max: number = 1
  @Input() animationDuration = 500
  @Input() animationFps = 30
  @Input() scrollEnabled = true
  @Input() middle?: number
  @Input() stickToMiddle = true
  @Input() thickness = 2
  @Input() orientation: 'vertical' | 'horizontal' = 'horizontal'
  @Input() notches: number[]
  @Input() thumbRadius = 4
  @Input() thumbBorderSize = 1
  @Input() wheelAnimationFPS = 30

  @Output() stickedToMiddle = new EventEmitter()
  @ViewChild('container', { static: true }) containerRef!: ElementRef

  get middleValue () {
    return typeof this.middle === 'number' ? this.middle : (this.min + this.max) / 2
  }

  public defaultColor = '#4f8d71'
  public _enabled = true

  @HostBinding('class.enabled')
  @Input()
  set enabled (shouldBeEnabled) {
    this._enabled = shouldBeEnabled
    this._color = this._enabled ? this.defaultColor : '#777'
  }

  get enabled () { return this._enabled }

  public _color = this.defaultColor
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
    type cc = keyof typeof rgb
    for (const channel in rgb) {
      rgb[channel as cc] = Math.round(0.8 * rgb[channel as cc])
    }
    const hex = this.utils.rgbToHex(rgb)
    return hex
  }

  public dragging = false

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
      const percFromMiddle = this.mapValue({
        value: diffFromMiddle,
        inMin: 0,
        inMax: this.max - middleValue,
        outMin: 0,
        outMax: 100
      })
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
    return this.containerRef.nativeElement.offsetHeight
  }

  get width () {
    return this.containerRef.nativeElement.offsetWidth
  }

  ngOnInit () {
  }

  public clampValue (value: number) {
    if (value < this.min) return this.min
    if (value > this.max) return this.max
    return value
  }

  private lastWheelEvent = new Date().getTime()
  private get wheelDebouncer () { return 1000 / this.wheelAnimationFPS }
  @HostListener('mousewheel', [ '$event' ])
  mouseWheel (event: WheelEvent) {
    if (this.enabled && this.scrollEnabled) {
      const now = new Date().getTime()
      if (now - this.lastWheelEvent < this.wheelDebouncer) return
      this.lastWheelEvent = now
      let progress = this.progress
      progress += -event.deltaY / 1000
      if (progress < 0) progress = 0
      if (progress > 1) progress = 1
      progress = Math.round(progress * 1000)
      this.value = this.mapValue({
        value: progress,
        inMin: 0,
        inMax: 1000,
        outMin: this.min,
        outMax: this.max,
        logInverse: false
      })
      this.userChangedValue.emit({ value: this._value })
    }
  }

  public getValueFromMouseEvent (event: MouseEvent) {
    const coords = this.utils.getCoordinatesInsideElementFromEvent(event, this.containerRef.nativeElement)
    let progress = this.orientation === 'vertical' ? coords.y : coords.x
    let value = (() => {
      const inMin = this.thumbRadius
      const inMax = (this.orientation === 'vertical' ? this.height : this.width) - this.thumbRadius * 2
      if (progress < inMin) progress = inMin
      if (progress > inMax) progress = inMax
      return this.mapValue({
        value: progress,
        inMin,
        inMax,
        outMin: this.min,
        outMax: this.max
      })
    })()
    if (this.notches?.length) {
      const closest = this.notches.reduce((prev, curr) => {
        return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev)
      })
      value = closest
    }
    return value
  }

  @HostListener('mousedown', [ '$event' ])
  mousedown (event: MouseEvent) {
    if (this.enabled) {
      this.dragging = true
      this.value = this.getValueFromMouseEvent(event)
      this.userChangedValue.emit({ value: this._value })
    }
  }

  @HostListener('mousemove', [ '$event' ])
  mousemove = (event: MouseEvent) => {
    if (this.enabled && this.dragging) {
      this.value = this.getValueFromMouseEvent(event)
      this.userChangedValue.emit({ value: this._value })
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

  public doubleclickTimeout?: number
  doubleclick () {
    if (this.enabled && this.doubleClickToAnimateToMiddle) {
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
  }

  get progress () {
    return this.getProgress(this.value)
  }

  getProgress (value: number) {
    const factor = 10000
    let progress = this.mapValue({
      value,
      inMin: this.min,
      inMax: this.max,
      outMin: 0,
      outMax: factor,
      logInverse: true
    })

    progress /= factor
    return progress
  }

  get containerStyle () {
    const styles: { [style: string]: string } = {}
    const narrow = this.thumbRadius * 2 + 2
    if (this.orientation === 'horizontal') {
      styles.width = '100%'
      styles.height = `${narrow}px`
    } else {
      styles.height = '100%'
      styles.width = `${narrow}px`
    }

    return styles
  }

  get grooveStyle () {
    const style: { [style: string]: string | number } = {}
    if (this.orientation === 'horizontal') {
      style.left = `${this.thumbRadius}px`
      style.top = `calc(50% - ${this.thickness}px / 2)`
      style.width = `calc(100% - ${this.thumbRadius * 2}px)`
      style.height = `${this.thickness}px`
    } else {
      style.top = `${this.thumbRadius}px`
      style.left = `calc(50% - ${this.thickness}px / 2)`
      style.height = `calc(100% - ${this.thumbRadius * 2}px)`
      style.width = `${this.thickness}px`
    }
    style.backgroundColor = this.darkerColor
    return style
  }

  get grooveFillingStyle () {
    const style: { [style: string]: string } = {}
    if (this.orientation === 'horizontal') {
      style.left = `${this.thumbRadius}px`
      style.top = `calc(50% - ${this.thickness}px / 2)`
      style.width = `calc(${this.progress * 100}% - ${this.thumbRadius}px)`
      style.height = `${this.thickness}px`
    } else {
      style.top = `${this.thumbRadius}px`
      style.left = `calc(50% - ${this.thickness}px / 2)`
      style.height = `calc(${this.progress * 100}% - ${this.thumbRadius * 2}px)`
      style.width = `${this.thickness}px`
    }
    style.backgroundColor = this.color
    return style
  }

  get thumbNotchStyle () {
    const style: { [style: string]: string | number } = {}
    style.width = `${this.thumbRadius * 2}px`
    style.height = style.width
    style.backgroundColor = this.value >= this.middleValue ? this.color : this.darkerColor

    style.borderRadius = '100%'
    const center = `calc(50% - ${this.thumbRadius}px)`

    const middleProgress = this.getProgress(this.middleValue)
    if (this.orientation === 'horizontal') {
      style.top = center
      style.left = `${Math.round((this.width - this.thumbRadius * 2) * middleProgress)}px`
    } else {
      style.left = center
      style.top = `${Math.round((this.height - this.thumbRadius * 2) * middleProgress)}px`
    }

    return style
  }

  getNotchStyle (index: number) {
    const style: { [style: string]: string | number } = {
      position: 'absolute'
    }
    style.width = `${this.thumbRadius * 2}px`
    style.height = style.width
    const notchValue = this.notches[index]
    style.backgroundColor = this.value >= notchValue ? this.color : this.darkerColor

    style.borderRadius = '100%'
    const center = `calc(50% - ${this.thumbRadius}px)`

    const notchProgress = this.getProgress(notchValue)
    style.top = center
    style.left = `${Math.round((this.width - this.thumbRadius * 2) * notchProgress)}px`

    return style
  }

  get thumbStyle () {
    const style: { [style: string]: number | string } = {}
    style.width = `${this.thumbRadius * 2}px`
    style.height = style.width
    style.border = `${this.thumbBorderSize}px solid black`
    style.backgroundColor = this.color

    style.borderRadius = '100%'
    if (this.orientation === 'horizontal') {
      const left = this.mapValue({
        value: this.value,
        inMin: this.min,
        inMax: this.max,
        outMin: -this.thumbBorderSize,
        outMax: this.width - this.thumbRadius * 2 - this.thumbBorderSize,
        logInverse: true
      })
      style.left = `${left}px`
    } else {
      style.bottom = `${this.mapValue({
        value: this.value,
        inMin: this.min,
        inMax: this.max,
        outMin: -this.thumbBorderSize,
        outMax: this.height - this.thumbRadius * 2 - this.thumbBorderSize,
        logInverse: true
      })}px`
    }
    return style
  }

  private mapValue ({ value, inMin, inMax, outMin, outMax, logInverse }: {
    value: number
    inMin: number
    inMax: number
    outMin: number
    outMax: number
    logInverse?: boolean
  }) {
    switch (this.scale) {
      case 'linear': return this.utils.mapValue(value, inMin, inMax, outMin, outMax)
      case 'logarithmic': return (logInverse ? this.utils.logMapValueInverse : this.utils.logMapValue)({ value, inMin, inMax, outMin, outMax })
    }
  }

  ngOnDestroy () {
    this.dettachWindowEvents()
  }
}

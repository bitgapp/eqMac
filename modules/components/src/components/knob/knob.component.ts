import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  HostListener,
  HostBinding,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core'
import { UtilitiesService } from '../../services/utilities.service'

export interface KnobValueChangedEvent {
  value: number
  transition?: boolean
}
@Component({
  selector: 'eqm-knob',
  templateUrl: './knob.component.html',
  styleUrls: [ './knob.component.scss' ]
})
export class KnobComponent implements OnInit, OnDestroy {
  @Input() size: 'large' | 'medium' | 'small' = 'medium'
  @Input() showScale = true
  public _min = -1
  @Input() set min (newMin) { this._min = newMin; this.calculateMiddleValue() }
  get min () { return this._min }

  public _max = 1
  @Input() set max (newMax) { this._max = newMax; this.calculateMiddleValue() }
  get max () { return this._max }

  @HostBinding('class.enabled') @Input() enabled = true

  @Input() doubleClickToAnimateToMiddle = true
  @Input() animationDuration = 500
  @Input() animationFps = 30
  @Output() animatingToMiddle = new EventEmitter()

  @Input() stickToMiddle = false
  @Output() stickedToMiddle = new EventEmitter()

  public dragging = false
  public setDraggingFalseTimeout: any = null
  public continueAnimation = false

  @ViewChild('container', { static: true }) containerRef!: ElementRef
  container!: HTMLDivElement

  public _value = 0
  @Output() valueChange = new EventEmitter<number>()
  @Output() userChangedValue = new EventEmitter<KnobValueChangedEvent>()
  @Input()
  set value (newValue: number) {
    if (this._value === newValue || typeof newValue !== 'number') return
    let value = newValue
    if (this.stickToMiddle) {
      let diffFromMiddle = this.middleValue - value
      if (diffFromMiddle < 0) {
        diffFromMiddle *= -1
      }
      const percFromMiddle = this.utils.mapValue(diffFromMiddle, 0, this.max - this.middleValue, 0, 100)
      if ((this._value).toFixed(1) === (this.middleValue).toFixed(1) && percFromMiddle < 2) {
        value = this.middleValue
      } else if ((this._value < this.middleValue && newValue > this._value) || (this._value > this.middleValue && newValue < this._value)) {
        if (percFromMiddle < 5) {
          value = this.middleValue
          this.stickedToMiddle.emit(this.continueAnimation)
        }
      }
    }
    this._value = this.clampValue(value)
    this.valueChange.emit(this._value)
  }

  get value () {
    return this._value
  }

  middleValue: number = this.calculateMiddleValue()
  public calculateMiddleValue () {
    this.middleValue = (this.min + this.max) / 2
    return this.middleValue
  }

  constructor (public utils: UtilitiesService, public changeRef: ChangeDetectorRef) {}

  async ngOnInit () {
    this.container = this.containerRef.nativeElement
    window.addEventListener('mousemove', this.mousemove, true)
    window.addEventListener('mouseup', this.mouseup, true)
  }

  private lastWheelEvent = new Date().getTime()
  private readonly wheelDebouncer = 1000 / 30
  @HostListener('mousewheel', [ '$event' ])
  mouseWheel (event: WheelEvent) {
    if (this.enabled) {
      this.continueAnimation = false
      const now = new Date().getTime()
      if ((now - this.lastWheelEvent) < this.wheelDebouncer) return
      this.lastWheelEvent = now
      this.value += -event.deltaY / (1000 / this.max)
      this.userChangedValue.emit({ value: this.value })
    }
  }

  mousedown (event: MouseEvent) {
    if (this.enabled) {
      this.continueAnimation = false
      this.dragging = true
    }
  }

  @HostListener('gesturechange', [ '$event' ])
  onGestureChange (event: any) {
    if (this.enabled) {
      try {
        this.continueAnimation = false
        const oldValue = this.value
        this.value += event.rotation / (5000 / this.max)
        const newValue = this.value
        if (oldValue !== newValue) this.userChangedValue.emit({ value: this.value })
      } catch (err) {
        console.error(err)
      }
    }
  }

  mousemove = (event: MouseEvent) => {
    if (this.enabled) {
      if (this.setDraggingFalseTimeout) {
        window.clearTimeout(this.setDraggingFalseTimeout)
      }
      if (this.dragging) {
        this.continueAnimation = false
        const change = -event.movementY / (100 / this.max)
        console.log(change)
        this.value += change
        this.userChangedValue.emit({ value: this.value })
      }
      this.setDraggingFalseTimeout = setTimeout(() => {
        this.dragging = false
      }, 1000)
    }
  }

  mouseup = (event: MouseEvent) => {
    this.dragging = false
  }

  doubleclick () {
    if (this.doubleClickToAnimateToMiddle && this.enabled) {
      this.animatingToMiddle.emit()
      this.userChangedValue.emit({ value: this.middleValue, transition: true })
      this.animateKnob(this._value, this.middleValue)
    }
  }

  largeCapMaxAngle = 135
  get largeCapClipPathStyle () {
    const transform = `rotate(${this.utils.mapValue(this.value, this.min, this.max, -this.largeCapMaxAngle, this.largeCapMaxAngle)}deg)`
    const transformOrigin = '50% 50%'
    return {
      transform,
      '-webkit-transform': transform,
      'transform-origin': transformOrigin,
      '-webkit-transform-origin': transformOrigin
    }
  }

  get largeCapIndicatorStyle () {
    const transform = `translate(-50%, -50%) rotate(${this.utils.mapValue(this.value, this.min, this.max, -this.largeCapMaxAngle, this.largeCapMaxAngle)}deg)`
    return {
      transform,
      '-webkit-transform': transform
    }
  }

  get largeCapBodyStyle () {
    return {
      // 'clip-path': `url(#large-knob-cap-clip-path-${this.id})`,
      // '-webkit-clip-path': `url(#large-knob-cap-clip-path-${this.id})`
    }
  }

  mediumCapMaxAngle = 135
  get mediumCapIndicatorStyle () {
    const transform = `translate(-50%, -50%) rotate(${this.utils.mapValue(this.value, this.min, this.max, -this.mediumCapMaxAngle, this.mediumCapMaxAngle)}deg)`
    return {
      transform,
      '-webkit-transform': transform
    }
  }

  smallCapMaxAngle = 135
  get smallCapIndicatorStyle () {
    const transform = `translate(-50%, -50%) rotate(${this.utils.mapValue(this.value, this.min, this.max, -this.smallCapMaxAngle, this.smallCapMaxAngle)}deg)`
    return {
      transform,
      '-webkit-transform': transform
    }
  }

  async animateKnob (from: number, to: number) {
    from = this.clampValue(from)
    to = this.clampValue(to)
    const diff = to - from

    const delay = 1000 / this.animationFps
    const frames = this.animationFps * (this.animationDuration / 1000)
    const step = diff / frames
    this.continueAnimation = true
    let value = from
    for (let frame = 0; frame < frames; frame++) {
      if (this.continueAnimation) {
        await this.utils.delay(delay)
        value += step
        this.value = value
      } else {
        break
      }
    }
    this.continueAnimation = false
  }

  public clampValue (value: number) {
    if (value > this.max) {
      value = this.max
    }

    if (value < this.min) {
      value = this.min
    }

    return value
  }

  ngOnDestroy () {
    window.removeEventListener('mousemove', this.mousemove, true)
    window.removeEventListener('mouseup', this.mouseup, true)
  }
}

import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  HostListener,
  HostBinding,
  ElementRef
} from '@angular/core'
import * as uuid from 'uuid/v4'
import { UtilitiesService } from '../../services/utilities.service'

export interface KnobValueChangedEvent {
  value: number
  transition?: boolean
}
@Component({
  selector: 'eqm-knob',
  templateUrl: './knob.component.html',
  styleUrls: ['./knob.component.scss']
})
export class KnobComponent implements OnInit {
  @Input() size: 'large' | 'medium' | 'small' = 'medium'
  @Input() showScale = true
  id = uuid()
  private _min = -1
  @Input() set min (newMin) { this._min = newMin; this.calculateMiddleValue() }
  get min () { return this._min }

  private _max = 1
  @Input() set max (newMax) { this._max = newMax; this.calculateMiddleValue() }
  get max () { return this._max }

  @HostBinding('class.disabled') @Input() disabled = false

  @Input() doubleClickToAnimateToMiddle = true
  @Input() animationDuration = 500
  @Input() animationFps = 30
  @Output() animatingToMiddle = new EventEmitter()

  @Input() stickToMiddle = false
  @Output() stickedToMiddle = new EventEmitter()

  private dragging = false
  private setDraggingFalseTimeout: any = null
  private continueAnimation = false
  private dragStartDegr = 0

  @ViewChild('container', { static: true }) containerRef: ElementRef
  container: HTMLDivElement

  private _value = 0
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
  private calculateMiddleValue () {
    this.middleValue = (this.min + this.max) / 2
    return this.middleValue
  }

  constructor (private utils: UtilitiesService) {}

  async ngOnInit () {
    this.container = this.containerRef.nativeElement
  }

  mouseWheel (event) {
    if (!this.disabled) {
      this.continueAnimation = false
      const oldValue = this.value
      this.value += -event.deltaY / (1000 / this.max)
      const newValue = this.value
      if (oldValue !== newValue) this.userChangedValue.emit({ value: this.value })
    }
  }

  mousedown (event) {
    if (!this.disabled) {
      this.continueAnimation = false
      this.dragStartDegr = this.getDegreesFromEvent(event)
      this.dragging = true
    }
  }

  @HostListener('mouseleave')
  onMouseLeave (): void {
    this.dragging = false
  }

  @HostListener('gesturechange', ['$event'])
  onGestureChange (event) {
    if (!this.disabled) {
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

  mousemove (event) {
    if (!this.disabled) {

      if (this.setDraggingFalseTimeout) {
        window.clearTimeout(this.setDraggingFalseTimeout)
      }
      if (this.dragging) {
        this.continueAnimation = false
        const distanceFromCenter = this.getDistanceFromCenterOfElementAndEvent(event)
        const unaffectedRadius = (this.container.clientWidth) / 7
        if (distanceFromCenter < unaffectedRadius) {
          return
        }
        const degrees = this.getDegreesFromEvent(event)
        if ((this.dragStartDegr < 0 && degrees > 0) || (this.dragStartDegr > 0 && degrees < 0)) {
          this.dragStartDegr = degrees
        }
        const degreeDiff = this.dragStartDegr - degrees
        this.dragStartDegr = degrees
        const multiplier = (() => {
          switch (this.size) {
            case 'large': return 110
            case 'medium': return 220
            case 'small': return 400
            default: return 220
          }
        })()
        const oldValue = this.value
        this.value += degreeDiff / (multiplier / this.max)
        const newValue = this.value
        if (oldValue !== newValue) this.userChangedValue.emit({ value: this.value })
      }
      this.setDraggingFalseTimeout = setTimeout(() => {
        this.dragging = false
      }, 1000)
    }
  }

  mouseup (event) {
    this.dragging = false
  }

  doubleclick () {
    if (this.doubleClickToAnimateToMiddle && !this.disabled) {
      this.animatingToMiddle.emit()
      this.userChangedValue.emit({ value: this.middleValue, transition: true })
      this.animateKnob(this._value, this.middleValue)
    }
  }

  largeCapMaxAngle = 135
  get largeCapClipPathStyle () {
    return {
      transform: `rotate(${this.utils.mapValue(this.value, this.min, this.max, -this.largeCapMaxAngle, this.largeCapMaxAngle)}deg)`,
      'transform-origin': '50% 50%'
    }
  }

  get largeCapIndicatorStyle () {
    return {
      transform: `translate(-50%, -50%) rotate(${this.utils.mapValue(this.value, this.min, this.max, -this.largeCapMaxAngle, this.largeCapMaxAngle)}deg)`
    }
  }

  get largeCapBodyStyle () {
    return {
      'clip-path': `url(#large-knob-cap-clip-path-${this.id})`,
      '-webkit-clip-path': `url(#large-knob-cap-clip-path-${this.id})`
    }
  }

  mediumCapMaxAngle = 135
  get mediumCapIndicatorStyle () {
    return {
      transform: `translate(-50%, -50%) rotate(${this.utils.mapValue(this.value, this.min, this.max, -this.mediumCapMaxAngle, this.mediumCapMaxAngle)}deg)`
    }
  }

  smallCapMaxAngle = 135
  get smallCapIndicatorStyle () {
    return {
      transform: `translate(-50%, -50%) rotate(${this.utils.mapValue(this.value, this.min, this.max, -this.smallCapMaxAngle, this.smallCapMaxAngle)}deg)`
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
    return
  }

  private getDegreesFromEvent (event) {
    const coords = this.utils.getCoordinatesInsideElementFromEvent(event, this.container)
    const knobCenterX = (this.container.clientWidth) / 2
    const knobCenterY = (this.container.clientHeight) / 2
    const rads = Math.atan2(coords.x - knobCenterX, coords.y - knobCenterY)
    return rads * 100
  }

  private getDistanceFromCenterOfElementAndEvent (event) {
    const coords = this.utils.getCoordinatesInsideElementFromEvent(event, this.container)
    const knobCenterX = (this.container.clientWidth) / 2
    const knobCenterY = (this.container.clientHeight) / 2
    const w = coords.x - knobCenterX
    const h = coords.y - knobCenterY
    return Math.sqrt(w * w + h * h)
  }

  private clampValue (value) {
    if (value > this.max) {
      value = this.max
    }

    if (value < this.min) {
      value = this.min
    }

    return value
  }
}

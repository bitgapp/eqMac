import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  HostListener,
  HostBinding
} from '@angular/core'
import {
  AssetsService
} from '../../services/assets.service'

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
  private frameImage = new Image()
  private dragging = false
  private padding = 5
  private setDraggingFalseTimeout: any = null
  private continueAnimation = false
  private dragStartDegr = 0
  private loaded = false
  @ViewChild('knobCanvas', { static: true }) knobCanvas

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
    this.setKnobImage(this._value)
  }
  get value () {
    return this._value
  }

  middleValue: number = this.calculateMiddleValue()
  private calculateMiddleValue () {
    this.middleValue = (this.min + this.max) / 2
    return this.middleValue
  }

  constructor (private utils: UtilitiesService, private assets: AssetsService) {}

  async ngOnInit () {
    await this.assets.load()
    this.loaded = true
    this.setKnobImage(this._value)
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
        const unaffectedRadius = (this.frameImage.width + this.padding * 2) / 7
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
    const coords = this.utils.getCoordinatesInsideElementFromEvent(event)
    const knobCenterX = (this.frameImage.width + this.padding * 2) / 2
    const knobCenterY = (this.frameImage.height + this.padding * 2) / 2
    const rads = Math.atan2(coords.x - knobCenterX, coords.y - knobCenterY)
    return rads * 50
  }

  private getDistanceFromCenterOfElementAndEvent (event) {
    const coords = this.utils.getCoordinatesInsideElementFromEvent(event)
    const knobCenterX = (this.frameImage.width + this.padding * 2) / 2
    const knobCenterY = (this.frameImage.height + this.padding * 2) / 2
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

  private setKnobImage (value: number) {
    if (!this.loaded) return

    const frame = Math.round(this.utils.mapValue(value, this.min, this.max, 1, this.assets.maxFrames))
    this.frameImage.crossOrigin = 'anonymous'  // This enables CORS
    this.frameImage = this.assets.getKnobFrameImageForSizeAndFrame(this.size, frame)

    const imageHeight = this.frameImage.height
    const imageWidth = this.frameImage.width
    const canvasHeight = imageHeight + this.padding * 2
    const canvasWidth = imageWidth + this.padding * 2
    this.knobCanvas.nativeElement.height = canvasHeight
    this.knobCanvas.nativeElement.width = canvasWidth
    const ctx: CanvasRenderingContext2D = this.knobCanvas.nativeElement.getContext('2d')
    ctx.clearRect(0, 0, canvasHeight, canvasWidth)

    if (this.size === 'large') {
      ctx.beginPath()
      const height = imageHeight * 0.85
      ctx.arc(canvasWidth / 2, (imageHeight - this.padding + 1) / 2, height / 2, 0, 2 * Math.PI)
      ctx.fill()
      ctx.closePath()
    }

    if (this.showScale) {
      const scaleImage = this.assets.getKnobScaleImageForSize(this.size)
      const [size, y] = (() => {
        switch (this.size) {
          case 'large':
            return [1, 1.5]
          case 'medium':
            return [1, 6]
          case 'small':
            return [1.05, 8]
        }
      })()
      const x = (this.frameImage.width - scaleImage.width * size) / 2 + this.padding
      ctx.drawImage(scaleImage, x, y, scaleImage.width * size, scaleImage.height * size)
    }

    ctx.drawImage(this.frameImage, this.padding, this.padding)
  }

}

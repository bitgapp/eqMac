import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild
} from '@angular/core'

@Component({
  selector: 'eqm-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
  @Input() width = 20
  @Input() height = 20

  @ViewChild('icon', { static: true }) iconRef: ElementRef

  @Input() set size (newSize) {
    this.width = newSize
    this.height = newSize
  }
  _color = '#979aa0'
  @Input()
  set color (newColor) {
    if (newColor && newColor !== '') {
      this._color = newColor
    } else {
      this._color = '#979aa0'
    }
  }

  _strokeColor = this._color
  @Input()
  set strokeColor (newColor) {
    if (newColor && newColor !== '') {
      this._strokeColor = newColor
    } else {
      this._strokeColor = this._color
    }
  }

  private _rotate = 0
  @Input()
  get rotate () {
    return this._rotate
  }
  set rotate (angle: number) {
    this._rotate = angle
  }

  _name = null
  @Input()
  set name (iconName: string) {
    this._name = iconName
  }
  get name () { return this._name }

  @Input() stroke: number = 0

  ngOnInit () {
  }

  get style () {
    const style: any = {}

    style.fill = `${this._color}`
    style.display = 'block'
    style.margin = '0 auto'
    if (this.height >= 0) {
      style.height = `${this.height}px`
    }
    if (this.height >= 0) {
      style.width = `${this.width}px`
    }
    style.transform = `rotate(${this.rotate}deg)`

    if (this.stroke) {
      style['stroke-width'] = `${this.stroke}px`
      style.stroke = `${this._strokeColor}`
    }

    return style
  }
}

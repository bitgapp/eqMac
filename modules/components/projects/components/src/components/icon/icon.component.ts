import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation
} from '@angular/core'
import { svgs, IconName } from './icons'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

@Component({
  selector: 'eqm-icon',
  templateUrl: './icon.component.html',
  styleUrls: [ './icon.component.scss' ],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class IconComponent implements OnInit {
  @Input() width = 20
  @Input() height = 20
  svg?: SafeHtml
  icons = svgs

  @Input() set size (newSize: number) {
    this.width = newSize
    this.height = newSize
  }

  _color = '#979aa0'
  @Input()
  set color (newColor: string) {
    if (newColor && newColor !== '') {
      this._color = newColor
    } else {
      this._color = '#979aa0'
    }
  }

  _strokeColor = this._color
  @Input()
  set strokeColor (newColor: string) {
    if (newColor && newColor !== '') {
      this._strokeColor = newColor
    } else {
      this._strokeColor = this._color
    }
  }

  public _rotate = 0
  @Input()
  get rotate () {
    return this._rotate
  }

  set rotate (angle: number) {
    this._rotate = angle
  }

  _name!: IconName
  @Input()
  set name (iconName: IconName) {
    this._name = iconName
    this.svg = this.sanitizer.bypassSecurityTrustHtml(this.icons[this.name])
  }

  get name () { return this._name }

  @Input() stroke: number = 0

  constructor (public sanitizer: DomSanitizer) {}
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

export * from './icons'
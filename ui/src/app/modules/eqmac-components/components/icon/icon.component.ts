import {
  Component,
  OnInit,
  Input,
  ElementRef,
  Renderer
} from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'eqm-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
  @Input() width = 20
  @Input() height = 20

  @Input() set size (newSize) {
    this.width = newSize
    this.height = newSize
    this.loadSVG()
  }
  _color = '#979aa0'
  @Input()
  set color (newColor) {
    if (newColor && newColor !== '') {
      this._color = newColor
    } else {
      this._color = '#979aa0'
    }
    this.loadSVG()
  }

  _strokeColor = this._color
  @Input()
  set strokeColor (newColor) {
    if (newColor && newColor !== '') {
      this._strokeColor = newColor
    } else {
      this._strokeColor = this._color
    }
    this.loadSVG()
  }

  private _rotate = 0
  @Input()
  get rotate () {
    return this._rotate
  }
  set rotate (angle: number) {
    this._rotate = angle
    this.loadSVG()
  }

  _name = null
  @Input()
  set name (iconName: string) {
    this._name = iconName
    this.loadSVG()
  }
  get name () { return this._name }

  @Input() stroke: number = 0
  constructor (
    private elementRef: ElementRef,
    private renderer: Renderer,
    private http: HttpClient
  ) {}

  ngOnInit () {
    this.loadSVG()
  }

  loadSVG () {
    if (!this.name) return
    const responseType: any = 'text'
    this.http.get <any>(`/assets/icons/${this.name}.svg`, {
      responseType
    }).subscribe(response => {

      const element = this.elementRef.nativeElement
      element.innerHTML = ''

      const parser = new DOMParser()
      const svg = parser.parseFromString(response, 'image/svg+xml').documentElement
      svg.style.fill = `${this._color}`
      svg.style.display = 'block'
      svg.style.margin = '0 auto'
      if (this.height >= 0) {
        svg.style.height = `${this.height}px`
      }
      if (this.height >= 0) {
        svg.style.width = `${this.width}px`
      }
      svg.style.transform = `rotate(${this.rotate}deg)`

      if (this.stroke) {
        svg.style['stroke-width'] = `${this.stroke}px`
        svg.style.stroke = `${this._strokeColor}`
      }
      this.renderer.projectNodes(element, [svg])
      if (this.height >= 0) {
        svg.parentElement.style.height = `${this.height}px`
      }
    })
  }
}

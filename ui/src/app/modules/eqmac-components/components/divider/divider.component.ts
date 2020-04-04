import { Component, OnInit, Input, ElementRef } from '@angular/core'

@Component({
  selector: 'eqm-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss']
})
export class DividerComponent implements OnInit {

  constructor (private elRef: ElementRef) { }
  _horizontal = true
  _vertical = false
  @Input()
  set horizontal (isHorizontal) {
    this._horizontal = isHorizontal
    this._vertical = !isHorizontal
  }

  @Input()
  set vertical (isVertical) {
    this._vertical = isVertical
    this._horizontal = !isVertical
  }
  ngOnInit () {
  }

}

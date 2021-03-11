import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output, NgZone, HostBinding, HostListener } from '@angular/core'
import { SelectBoxComponent } from '../select-box/select-box.component'
import { UtilitiesService } from '../../services/utilities.service'
import { InputFieldComponent } from '../input-field/input-field.component'
import { FadeInOutAnimation } from 'src/app/modules/animations'

@Component({
  selector: 'eqm-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  animations: [ FadeInOutAnimation ]
})
export class DropdownComponent implements OnInit {
  constructor (
    public utils: UtilitiesService, 
    public zone: NgZone,
    public ref: ElementRef
  ) {
  }
  
  public _items: any[] = []
  @Input() editable = false
  @Input()
  get items () {
    return this._items
  }
  set items (newItems) {
    if (!newItems || !Array.isArray(newItems)) return
    this.searchText = null
    this._items = newItems
  }
  @Output() refChanged = new EventEmitter<DropdownComponent>()
  @HostBinding('class.disabled') @Input() disabled = false
  @Input() selectedItem = null
  @Input() labelParam = 'text'
  @Input() numberOfVisibleItems = 6
  @Input() placeholder = 'Select item'
  @Input() noItemsPlaceholder = 'No items'
  @Input() closeOnSelect = true
  @Input() searchable = true
  @Output() itemSelected = new EventEmitter()

  @ViewChild('container', { read: ElementRef, static: true }) container: ElementRef
  @ViewChild('box', { read: ElementRef, static: true }) box: ElementRef
  @ViewChild('box', { static: true }) boxComponent: SelectBoxComponent
  shown = false
  yCoordinate = 0
  @Input() forceDirection: 'down' | 'up'
  direction: 'down' | 'up' = 'down'

  public padding = 5

  async ngOnInit () {
    if (!this.items) this.items = []
    this.setDimensions()
    this.calculateYCoordinate()
    for (let _ in [...Array(3)]) {
      await this.utils.delay(100)
      this.calculateYCoordinate()
    }
    this.refChanged.emit(this)
  }

  setDimensions () {
    const inputEl = this.container.nativeElement
    const boxEl = this.box.nativeElement

    const inputWidth = inputEl.offsetWidth

    boxEl.style.width = `${inputWidth}px`
  }

  calculateYCoordinate () {
    const body = document.body
    const html = document.documentElement
    const viewHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
    const preferredDirection = 'down'
    this.direction = preferredDirection
    const inputEl = this.container.nativeElement

    const inputHeight = inputEl.offsetHeight
    const inputPosition = inputEl.getBoundingClientRect()

    const boxHeight = this.boxComponent.height

    const downY = inputPosition.y + inputHeight + this.padding / 2
    const downSpaceLeft = viewHeight - (downY + boxHeight)

    const upY = inputPosition.top - boxHeight - this.padding
    const upSpaceLeft = upY

    this.direction = this.forceDirection ?? (downSpaceLeft > upSpaceLeft ? 'down' : 'up')
    let y = this.direction === 'down' ? downY : upY

    this.yCoordinate = y
  }

  async toggle (event) {
    event.stopPropagation()
    if (this.shown) {
      this.close()
    } else {
      this.open()
    }
  }

  async open () {
    if (!this.disabled && !this.shown && this.items.length) {
      this.calculateYCoordinate()
      this.setDimensions()
      this.shown = true
    }
  }

  async close () {
    if (!this.disabled && this.shown) {
      this.shown = false
      this.searchText = null
    }
  }

  selectItem (item) {
    this.selectedItem = item
    this.itemSelected.emit(item)
    if (this.closeOnSelect) {
      this.close()
    }
  }

  searchText: string
  @HostListener('document:keypress', ['$event'])
  keypress (event: KeyboardEvent) {
    if (!this.disabled && this.shown && this.searchable) {
      switch (event.key) {
        case 'Backspace': {
          if (this.searchText.length) {
            this.searchText = this.searchText.slice(0, this.searchText.length - 1)
          }
          break
        }
        case 'Escape': {
          this.close()
          break
        }
        case 'Enter': {
          break
        }
        default: {
          if (/^[+a-zA-Z0-9_.-\s]$/.test(event.key)) {
            this.searchText = (this.searchText ?? '') + event.key
          }
        }
      }
    }
  }

  get filteredItems () {
    if (this.searchable && this.searchText) {
      return this.items.filter(item => item[this.labelParam].toLowerCase().includes(this.searchText.toLowerCase()))
    } else {
      return this.items
    }
  }
}

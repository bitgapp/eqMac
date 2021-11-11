import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output, NgZone, HostBinding, HostListener, ChangeDetectionStrategy } from '@angular/core'
import { SelectBoxComponent } from '../select-box/select-box.component'
import { UtilitiesService } from '../../services/utilities.service'
import { FadeInOutAnimation } from '../../animations'
import { ColorsService } from '../../services/colors.service'

@Component({
  selector: 'eqm-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: [ './dropdown.component.scss' ],
  animations: [ FadeInOutAnimation ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent implements OnInit {
  constructor (
    public utils: UtilitiesService,
    public zone: NgZone,
    public ref: ElementRef,
    public colors: ColorsService
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
    this.searchText = undefined
    this._items = newItems
  }

  @Output() refChanged = new EventEmitter<DropdownComponent>()
  @HostBinding('class.enabled') @Input() enabled = true
  @Input() selectedItem = null
  @Output() selectedItemChange = new EventEmitter<any>()
  @Input() labelParam = 'text'
  @Input() numberOfVisibleItems = 6
  @Input() placeholder = 'Select item'
  @Input() noItemsPlaceholder = 'No items'
  @Input() closeOnSelect = true
  @Input() searchable = true
  @Output() itemSelected = new EventEmitter()

  @ViewChild('container', { read: ElementRef, static: true }) container!: ElementRef
  @ViewChild('box', { read: ElementRef, static: true }) box!: ElementRef
  @ViewChild('box', { static: true }) boxComponent!: SelectBoxComponent
  shown = false
  yCoordinate = 0
  @Input() forceDirection?: 'down' | 'up'
  direction: 'down' | 'up' = 'down'

  public padding = 5

  async ngOnInit () {
    if (!this.items) this.items = []
    this.setDimensions()
    this.calculateYCoordinate()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ of [ ...Array(3) ]) {
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
    const inputEl: HTMLElement = this.container.nativeElement

    const inputHeight = inputEl.offsetHeight
    const inputRect = inputEl.getBoundingClientRect()
    const scale = inputRect.width / inputEl.offsetWidth

    const boxHeight = this.boxComponent.height

    const downYScaled = inputRect.y / scale + inputHeight + this.padding / 2
    const downYNotScaled = inputRect.y + inputHeight + this.padding / 2
    const downSpaceLeft = viewHeight - (downYNotScaled + boxHeight)

    const upYScaled = inputRect.top / scale - boxHeight - this.padding
    const upYNotScaled = inputRect.top - boxHeight - this.padding
    const upSpaceLeft = upYNotScaled

    this.direction = this.forceDirection ?? (downSpaceLeft > upSpaceLeft ? 'down' : 'up')
    const y = this.direction === 'down' ? downYScaled : upYScaled

    this.yCoordinate = Math.round(y)
  }

  async toggle (event: MouseEvent) {
    event.stopPropagation()
    if (this.shown) {
      this.close()
    } else {
      this.open()
    }
  }

  async open () {
    if (this.enabled && !this.shown && this.items.length) {
      this.calculateYCoordinate()
      this.setDimensions()
      this.shown = true
    }
  }

  async close () {
    if (this.enabled && this.shown) {
      this.shown = false
      this.searchText = undefined
    }
  }

  selectItem (item: any) {
    this.selectedItem = item
    this.selectedItemChange.emit(item)
    this.itemSelected.emit(item)
    if (this.closeOnSelect) {
      this.close()
    }
  }

  searchText?: string
  @HostListener('document:keypress', [ '$event' ])
  keypress (event: KeyboardEvent) {
    if (this.enabled && this.shown && this.searchable) {
      switch (event.key) {
        case 'Backspace': {
          if (this.searchText?.length) {
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
      return this.items.filter(item => item[this.labelParam].toLowerCase().includes(this.searchText?.toLowerCase()))
    } else {
      return this.items
    }
  }
}

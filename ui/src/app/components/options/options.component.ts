import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core'
import { DropdownComponent, FlatSliderValueChangedEvent, IconName, SkeuomorphSliderValueChangedEvent } from '@eqmac/components'
import { ApplicationService } from '../../services/app.service'

interface BaseOptions {
  type: string
  isEnabled?: () => boolean
  style?: { [style: string]: string | number }
  tooltip?: string
  tooltipAsComponent?: boolean
}

export interface ButtonOption extends BaseOptions {
  type: 'button'
  label: string
  hoverable?: boolean
  action: () => any
}

export interface DividerOption extends BaseOptions {
  type: 'divider'
  orientation: 'horizontal' | 'vertical'
}

export interface LabelOption extends BaseOptions {
  type: 'label'
  label: string
  url?: string
}

export interface HTMLOption extends BaseOptions {
  type: 'html'
  html: string
}

export interface DropdownOption extends BaseOptions {
  type: 'dropdown'
  items: any[]
  labelParam: string
  selectedItem?: any
  numberOfVisibleItems?: number
  placeholder?: string
  noItemsPlaceholder?: string
  forceDirection?: 'up' | 'down'
  closeOnSelect?: boolean
  refChanged?: (ref: DropdownComponent) => void
  itemSelected: (item: any) => any
}

export interface CheckboxOption extends BaseOptions {
  type: 'checkbox'
  label: string
  value: boolean
  toggled?: (value: boolean) => any
}

export interface SelectOptionOption <T = string> {
  id: T
  label?: string
  icon?: IconName
  iconStroke?: number
}
export interface SelectOption <T = string> extends BaseOptions {
  type: 'select'
  label: string
  options: SelectOptionOption<T>[]
  selectedId: T
  selected?: (id: T) => any
}

export interface BreadcrumbsOption extends BaseOptions {
  type: 'breadcrumbs'
  crumbs: string[]
  crumbClicked: (event: { crumb: string, index: number }) => any
}

export interface InputOption extends BaseOptions {
  type: 'input'
  value?: string
  placeholder?: string
  changed?: (value: string) => any
  enter?: () => any
  editable?: boolean
  fontSize?: number
}

interface SliderOption extends BaseOptions {
  value: number
  min?: number
  middle?: number
  max?: number
  animationDuration?: number
  animationFps?: number
  scrollEnabled?: boolean
  stickToMiddle?: boolean
  stickedToMiddle?: () => any
  changed?: (value: number) => any
}

export interface FlatSliderOption extends SliderOption {
  type: 'flat-slider'
  scale?: 'linear' | 'logarithmic'
  orientation?: 'vertical' | 'horizontal'
  showMiddleNotch?: boolean
  doubleClickToAnimateToMiddle?: boolean
  userChangedValue?: (event: FlatSliderValueChangedEvent) => any
}

export interface SkeuomorphSliderOption extends SliderOption {
  type: 'skeuomorph-slider'
  userChangedValue?: (event: SkeuomorphSliderValueChangedEvent) => any
}

export interface ValueScreenOption extends BaseOptions {
  type: 'value-screen'
  value: string
  tooltip?: string
  clicked?: () => any
}

export type Option = ButtonOption | CheckboxOption | SelectOption
| DividerOption | LabelOption | HTMLOption | DropdownOption
| BreadcrumbsOption | InputOption | FlatSliderOption | SkeuomorphSliderOption
| ValueScreenOption

export type Options = Option[][]
@Component({
  selector: 'eqm-options',
  templateUrl: './options.component.html',
  styleUrls: [ './options.component.scss' ]
})
export class OptionsComponent {
  @Input() options: Options = []
  @Output() checkboxToggled = new EventEmitter<CheckboxOption>()

  constructor (
    public app: ApplicationService,
    public ref: ChangeDetectorRef
  ) {}

  getOptionStyle (option: Option, row: Option[]) {
    const style = option.style || {}
    if (!style.width) {
      style.width = `${100 / row.length}%`
    }

    if (option.isEnabled && !option.isEnabled()) {
      style.filter = 'grayscale(1)'
    }

    if (option.type === 'dropdown') {
      style['z-index'] = 9000
    }

    return style
  }

  toggleCheckbox (checkbox: CheckboxOption) {
    if (checkbox.isEnabled && !checkbox.isEnabled()) {
      return
    }
    checkbox.value = !checkbox.value
    if (checkbox.toggled) checkbox.toggled(checkbox.value)
    this.checkboxToggled.emit(checkbox)
  }

  selectedOption (option: SelectOption, selectOption: SelectOptionOption) {
    if (option.isEnabled && !option.isEnabled()) {
      return
    }
    if (option.selectedId !== selectOption.id) {
      option.selectedId = selectOption.id
      this.ref.detectChanges()
      option.selected(selectOption.id)
    }
  }

  openUrl (url?: string) {
    if (!url) return
    this.app.openURL(new URL(url))
  }

  sliderUserChangedValue (option: FlatSliderOption | SkeuomorphSliderOption, event: FlatSliderValueChangedEvent | SkeuomorphSliderValueChangedEvent) {
    if (option.userChangedValue) {
      option.userChangedValue(event)
    }
    this.ref.detectChanges()
  }
}

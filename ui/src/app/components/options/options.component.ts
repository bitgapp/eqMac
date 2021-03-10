import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core'
import { ApplicationService } from '../../services/app.service'

interface BaseOptions {
  key: string
  type: string
  label: string
  isEnabled?: () => boolean
}

export interface ButtonOption extends BaseOptions {
  type: 'button'
  hoverable?: boolean
  action: () => any
}

export interface DividerOption extends Omit<BaseOptions, 'key' | 'label'> {
  type: 'divider'
  orientation: 'horizontal' | 'vertical'
}

export interface LabelOption extends Omit<BaseOptions, 'key'> {
  type: 'label'
  url?: string
  tooltip?: string
}

export interface HTMLOption extends Omit<BaseOptions, 'key' | 'label'> {
  type: 'html'
  html: string
}

export interface DropdownOption extends Omit<BaseOptions, 'label'> {
  type: 'dropdown'
  items: any[]
  labelParam: string
  label?: string
  selectedItem?: any
  numberOfVisibleItems?: number
  placeholder?: string
  noItemsPlaceholder?: string
  forceDirection?: 'up' | 'down'
  itemSelected: (item: any) => void | Promise<void>
}

export interface CheckboxOption extends BaseOptions {
  type: 'checkbox'
  value: boolean
  toggled?: (value: boolean) => any
}

export interface SelectOptionOption {
  id: string
  label: string
}
export interface SelectOption extends BaseOptions {
  type: 'select'
  options: SelectOptionOption[]
  selectedId: string
  selected?: (id: string) => any
}

export interface BreadcrumbsOption extends Omit<BaseOptions, 'key' | 'label'> {
  type: 'breadcrumbs'
  crumbs: string[]
  crumbClicked: (event: { crumb: string, index: number }) => void | Promise<void>
}

export type Option = ButtonOption | CheckboxOption | SelectOption 
| DividerOption | LabelOption | HTMLOption | DropdownOption
| BreadcrumbsOption

export type Options = Option[][]
@Component({
  selector: 'eqm-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent {
  @Input() options: Options = []
  @Output() checkboxToggled = new EventEmitter<CheckboxOption>()

  constructor (
    public app: ApplicationService,
    public ref: ChangeDetectorRef
    ) {}

  getOptionStyle (option: Option) {
    let style: any = {}
    if (option.type === 'button') {
      style.width = '100%'
    }

    if (!!option.isEnabled && option.isEnabled() === false) {
      style.filter = 'grayscale(1)'
    }

    return style
  }

  toggleCheckbox (checkbox: CheckboxOption) {
    if (!!checkbox.isEnabled && checkbox.isEnabled() === false) {
      return
    }
    checkbox.value = !checkbox.value
    if (checkbox.toggled) checkbox.toggled(checkbox.value)
    this.checkboxToggled.emit(checkbox)
  }

  selectedOption (option: SelectOption, selectOption: SelectOptionOption) {
    if (!!option.isEnabled && option.isEnabled() === false) {
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
}

import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core'

interface BaseOptions {
  key: string
  type: string
  label: string
}

export interface ButtonOption extends BaseOptions {
  type: 'button'
  hoverable?: boolean
  action: () => any
}

export interface DividerOption extends BaseOptions {
  type: 'divider'
  orientation: 'horizontal' | 'vertical'
  label: never
  key: never
}

export interface LabelOption extends BaseOptions {
  type: 'label'
  key: never
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

export type Option = ButtonOption | CheckboxOption | SelectOption | DividerOption | LabelOption

export type Options = Option[][]
@Component({
  selector: 'eqm-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent {
  @Input() options: Options = []
  @Output() checkboxToggled = new EventEmitter<CheckboxOption>()

  constructor (public ref: ChangeDetectorRef) {}

  getOptionStyle (type: Option['type']) {
    let style: any = {}
    if (type === 'button') {
      style.width = '100%'
    }

    return style
  }

  toggleCheckbox (checkbox: CheckboxOption) {
    checkbox.value = !checkbox.value
    if (checkbox.toggled) checkbox.toggled(checkbox.value)
    this.checkboxToggled.emit(checkbox)
  }

  selectedOption (option: SelectOption, selectOption: SelectOptionOption) {
    if (option.selectedId !== selectOption.id) {
      option.selectedId = selectOption.id
      this.ref.detectChanges()
      option.selected(selectOption.id)
    }
  }
}

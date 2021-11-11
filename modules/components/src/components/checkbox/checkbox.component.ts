import { Component, Input, Output, EventEmitter, HostBinding, HostListener, ViewChild, ElementRef, ContentChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'
import { ColorsService } from '../../services/colors.service'

@Component({
  selector: 'eqm-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: [ './checkbox.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent {
  @Input() labelSide: 'left' | 'right'
  @Input() labelColor = ColorsService.light
  @Input() interactive: boolean = true
  @Input() checked: boolean = false
  @Output() checkedChange = new EventEmitter<boolean>()
  @Input() color = ColorsService.accent
  @Input() bgColor = ColorsService.dark
  @HostBinding('class.enabled') @Input() enabled = true

  constructor (
    private readonly change: ChangeDetectorRef
  ) {}

  @HostListener('click')
  toggle () {
    if (this.interactive && this.enabled) {
      this.checked = !this.checked
      this.checkedChange.emit(this.checked)
      this.change.detectChanges()
    }
  }
}

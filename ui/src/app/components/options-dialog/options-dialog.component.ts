import { Component, OnInit, Inject, Input } from '@angular/core'
import { Options } from '../options/options.component'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

export interface OptionsDialogData {
  title?: string
  options: Options
}
@Component({
  selector: 'eqm-options-dialog',
  templateUrl: './options-dialog.component.html',
  styleUrls: [ './options-dialog.component.scss' ]
})
export class OptionsDialogComponent implements OnInit {
  @Input() options: Options
  @Input() title: string

  constructor (
    public dialogRef: MatDialogRef<OptionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OptionsDialogData
  ) { }

  ngOnInit () {
    if (this.data) {
      for (const [ key, value ] of Object.entries(this.data)) {
        this[key] = value || this[key]
      }
    }
  }
}

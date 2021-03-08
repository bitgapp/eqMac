import { Component, OnInit, Inject, Input } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

export interface ConfirmDialogData {
  text: string
  confirmText?: string
  cancelText?: string
}

@Component({
  selector: 'eqm-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  @Input() text: string
  @Input() confirmText = 'Ok'
  @Input() onConfirm: () => any
  @Input() cancelText = 'Cancel'

  constructor (
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {
  }

  ngOnInit () {
    if (this.data) {
      for (const [key, value] of Object.entries(this.data)) {
        this[key] = value || this[key]
      }
    }
  }

  cancel () {
    this.dialogRef.close(false)
  }

  confirm () {
    if (this.onConfirm && typeof this.onConfirm === 'function') {
      this.onConfirm()
    } else {
      this.dialogRef.close(true)
    }
  }

}

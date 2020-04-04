import { Component, Input, Inject } from '@angular/core'
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog/confirm-dialog.component'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

export interface PromptDialogData extends ConfirmDialogData {
  prompt?: string
  placeholder?: string
}

@Component({
  selector: 'eqm-prompt-dialog',
  templateUrl: './prompt-dialog.component.html',
  styleUrls: ['./prompt-dialog.component.scss']
})
export class PromptDialogComponent extends ConfirmDialogComponent {
  @Input() prompt
  @Input() placeholder = 'Please enter here'
  @Input() promptRequiredToConfirm = true

  constructor (
    public dialogRef: MatDialogRef<PromptDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PromptDialogData
  ) {
    super(dialogRef, data)
  }

  confirm () {
    if (this.promptRequiredToConfirm && this.prompt) {
      this.dialogRef.close(this.prompt)
    } else {
      this.dialogRef.close(this.prompt)
    }
  }
}

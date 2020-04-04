import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { MatDialog } from '@angular/material'
import { PromptDialogComponent } from 'src/app/components/prompt-dialog/prompt-dialog.component'
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component'

export interface EqualizerPreset {
  id?: string
  name: string
  isDefault?: boolean
}

@Component({
  selector: 'eqm-equalizer-presets',
  templateUrl: './equalizer-presets.component.html',
  styleUrls: ['./equalizer-presets.component.scss']
})
export class EqualizerPresetsComponent implements OnInit {
  @Input() presets: EqualizerPreset[]
  @Input() disabled = false
  @Input() selectedPreset: EqualizerPreset
  @Output() presetSelected = new EventEmitter<EqualizerPreset>()
  @Output() presetSaved = new EventEmitter<string>()
  @Output() presetDeleted = new EventEmitter()

  constructor (
    private dialog: MatDialog
  ) { }

  ngOnInit () {
  }

  async savePreset () {
    const dialog = this.dialog.open(PromptDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      data: {
        confirmText: 'Save',
        cancelText: 'Cancel',
        text: 'Please enter a name',
        placeholder: 'New Preset name'
      }
    })

    const presetName = await dialog.afterClosed().toPromise()
    if (presetName) {
      this.presetSaved.emit(presetName)
    }
  }

  async deletePreset () {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      data: {
        confirmText: 'Yes, remove',
        cancelText: 'No, cancel',
        text: `Are you sure you want to delete this Preset?`
      }
    })

    if (await dialog.afterClosed().toPromise()) {
      this.presetDeleted.emit()
    }
  }

}

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
    public dialog: MatDialog
  ) { }

  ngOnInit () {
  }

  async savePreset (presetName?: string) {
    presetName = await this.dialog.open(PromptDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      data: {
        confirmText: 'Save',
        cancelText: 'Cancel',
        text: 'Please enter a name',
        placeholder: 'New Preset name',
        prompt: presetName
      }
    }).afterClosed().toPromise()

    if (presetName) {
      const existingPreset = this.presets.find(preset => preset.name === presetName)
      if (existingPreset) {
        if (existingPreset.isDefault) {
          const saveAnyway: boolean = await this.dialog.open(ConfirmDialogComponent, {
            hasBackdrop: true,
            disableClose: true,
            data: {
              confirmText: 'Yes, save',
              cancelText: 'No, cancel',
              text: `A Default preset with this name already exists. Would you like to use this name anyway? You might see Duplicate names in the Preset list.`
            }
          }).afterClosed().toPromise()
          if (!saveAnyway) return this.savePreset(presetName)
        } else {
          const overwrite: boolean = await this.dialog.open(ConfirmDialogComponent, {
            hasBackdrop: true,
            disableClose: true,
            data: {
              confirmText: 'Yes, overwrite',
              cancelText: 'No, cancel',
              text: `A preset with this name already exists. Would you like to overwrite it?`
            }
          }).afterClosed().toPromise()
          if (!overwrite) return this.savePreset(presetName)
        }
      }
      this.presetSaved.emit(presetName)
    }
  }

  async deletePreset () {
    const shouldDelete = await this.dialog.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      data: {
        confirmText: 'Yes, remove',
        cancelText: 'No, cancel',
        text: `Are you sure you want to remove this Preset?`
      }
    }).afterClosed().toPromise()

    if (shouldDelete) {
      this.presetDeleted.emit()
    }
  }

}

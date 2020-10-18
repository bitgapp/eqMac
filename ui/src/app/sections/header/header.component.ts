import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { ApplicationService } from 'src/app/services/app.service'
import { UIService, UIMode } from 'src/app/services/ui.service'
import { FadeInOutAnimation } from 'src/app/modules/animations'
import { MatDialog } from '@angular/material'
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component'
import { SettingsService, IconMode } from '../settings/settings.service'

@Component({
  selector: 'eqm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [ FadeInOutAnimation ]
})
export class HeaderComponent implements OnInit {
  showLeftIcons = false
  showBooleanDebouncers: { [name: string]: any } = {}
  uiMode: UIMode

  @Output() settingsToggled = new EventEmitter()
  @Output() helpToggled = new EventEmitter()
  // mode: UIMode = 'popover'
  constructor (
    public app: ApplicationService,
    public ui: UIService,
    public dialog: MatDialog,
    public settings: SettingsService
    ) { }

  async ngOnInit () {
    await this.sync()
  }

  async sync () {
    await Promise.all([
      this.syncUIMode()
    ])
  }

  async syncUIMode () {
    this.uiMode = await this.ui.getMode()
  }

  setShowBoolean (name, bool) {
    if (this.showBooleanDebouncers.hasOwnProperty(name)) {
      clearTimeout(this.showBooleanDebouncers[name])
      delete this.showBooleanDebouncers[name]
      this[name] = bool
    } else {
      this.showBooleanDebouncers[name] = setTimeout(() => {
        this[name] = bool
        clearTimeout(this.showBooleanDebouncers[name])
        delete this.showBooleanDebouncers[name]
      }, 50)
    }
  }

  async quit () {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      data: {
        confirmText: 'Yes, quit',
        cancelText: 'No, cancel',
        text: 'Are you sure you want to quit eqMac?'
      }
    })

    const quit = await dialog.afterClosed().toPromise()

    this.showLeftIcons = false
    if (quit) return this.app.quit()
  }

  close () {
    this.showLeftIcons = false
    return this.ui.close()
  }

  hide () {
    this.showLeftIcons = false
    return this.ui.hide()
  }

  toggleSettings (event) {
    event.stopPropagation()
    this.settingsToggled.emit()
  }

  toggleHelp (event) {
    event.stopPropagation()
    this.helpToggled.emit()
  }

  async toggleUIMode () {
    this.uiMode = this.uiMode === 'window' ? 'popover' : 'window'
    const iconMode = await this.settings.getIconMode()
    if (this.uiMode === 'popover' && iconMode === IconMode.dock) {
      await this.settings.setIconMode(IconMode.both)
    }
    await this.ui.setMode(this.uiMode)
  }
  // toggleMode () {
  //   this.mode = this.mode === 'window' ? 'popover' : 'window'
  //   return this.ui.setMode(this.mode)
  // }

}

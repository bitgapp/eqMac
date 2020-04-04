import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { ApplicationService } from 'src/app/services/app.service'
import { UIService, UIMode } from 'src/app/services/ui.service'
import { FadeInOutAnimation } from 'src/app/modules/animations'
import { MatDialog } from '@angular/material'
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component'

@Component({
  selector: 'eqm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [ FadeInOutAnimation ]
})
export class HeaderComponent implements OnInit {
  showLeftIcons = false
  showRightIcons = false
  showBooleanDebouncers: { [name: string]: any } = {}

  @Output() settingsToggled = new EventEmitter()
  @Output() helpToggled = new EventEmitter()
  // mode: UIMode = 'popover'
  constructor (
    private app: ApplicationService,
    private ui: UIService,
    private dialog: MatDialog
    ) { }

  ngOnInit () {
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
  // toggleMode () {
  //   this.mode = this.mode === 'window' ? 'popover' : 'window'
  //   return this.ui.setMode(this.mode)
  // }

}

import { Component, OnInit } from '@angular/core'
import { CheckboxOption, ButtonOption, Options, SelectOption } from 'src/app/components/options/options.component'
import { SettingsService, IconMode } from './settings.service'
import { ApplicationService } from '../../services/app.service'
import { MatDialog } from '@angular/material/dialog'
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component'
import { UIService } from '../../services/ui.service'

@Component({
  selector: 'eqm-settings',
  templateUrl: './settings.component.html',
  styleUrls: [ './settings.component.scss' ]
})
export class SettingsComponent implements OnInit {
  launchOnStartupOption: CheckboxOption = {
    type: 'checkbox',
    label: 'Launch on start-up',
    value: false,
    toggled: launchOnStartup => this.settingsService.setLaunchOnStartup(launchOnStartup)
  }

  replaceKnobsWithSlidersOption: CheckboxOption = {
    type: 'checkbox',
    label: 'Replace Knobs with Sliders',
    value: false,
    toggled: replaceKnobsWithSliders => this.ui.setSettings({ replaceKnobsWithSliders })
  }

  iconModeOption: SelectOption = {
    type: 'select',
    label: 'Show Icon',
    options: [ {
      id: IconMode.dock,
      label: 'Dock'
    }, {
      id: IconMode.both,
      label: 'Both'
    }, {
      id: IconMode.statusBar,
      label: 'Status Bar'
    } ],
    selectedId: IconMode.both,
    selected: async iconMode => {
      const uiMode = await this.ui.getMode()
      if (iconMode === IconMode.dock && uiMode === 'popover') {
        await this.ui.setMode('window')
      }
      await this.settingsService.setIconMode(iconMode as IconMode)
    }
  }

  uninstallOption: ButtonOption = {
    type: 'button',
    label: 'Uninstall eqMac',
    hoverable: false,
    action: this.uninstall.bind(this)
  }

  updateOption: ButtonOption = {
    type: 'button',
    label: 'Check for Updates',
    action: this.update.bind(this)
  }

  reinstallDriverOption: ButtonOption = {
    type: 'button',
    label: 'Reinstall Driver',
    action: this.reinstallDriver.bind(this)
  }

  settings: Options = [
    [
      this.updateOption
    ],
    [
      this.iconModeOption
    ],
    [
      this.replaceKnobsWithSlidersOption,
      this.launchOnStartupOption
    ],
    [
      this.uninstallOption
    ]
  ]

  constructor (
    public settingsService: SettingsService,
    public app: ApplicationService,
    public dialog: MatDialog,
    public ui: UIService
  ) {
    this.getDriverReinstallAvailable()
  }

  ngOnInit () {
    this.sync()
  }

  async getDriverReinstallAvailable () {
    if (await this.app.getDriverReinstallAvailable()) {
      this.settings[3].unshift(this.reinstallDriverOption)
    }
  }

  async reinstallDriver () {
    this.app.reinstallDriver()
  }

  async sync () {
    await Promise.all([
      this.syncSettings()
    ])
  }

  async syncSettings () {
    const [
      launchOnStartup,
      iconMode,
      UISettings
    ] = await Promise.all([
      this.settingsService.getLaunchOnStartup(),
      this.settingsService.getIconMode(),
      this.ui.getSettings()
    ])
    this.iconModeOption.selectedId = iconMode
    this.launchOnStartupOption.value = launchOnStartup
    this.replaceKnobsWithSlidersOption.value = UISettings.replaceKnobsWithSliders
  }

  async update () {
    this.app.update()
  }

  async uninstall () {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      data: {
        confirmText: 'Yes, uninstall',
        cancelText: 'No, cancel',
        text: 'Are you sure you want to uninstall eqMac?'
      }
    })

    const uninstall = await dialog.afterClosed().toPromise()
    if (uninstall) {
      this.app.uninstall()
    }
  }
}

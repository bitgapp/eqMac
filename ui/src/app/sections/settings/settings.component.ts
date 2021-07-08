import { Component, OnInit } from '@angular/core'
import { CheckboxOption, ButtonOption, Options, SelectOption } from 'src/app/components/options/options.component'
import { SettingsService, IconMode } from './settings.service'
import { ApplicationService } from '../../services/app.service'
import { MatDialog } from '@angular/material/dialog'
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component'
import { UIService } from '../../services/ui.service'
import { AnalyticsService } from '../../services/analytics.service'
import { SemanticVersion } from '../../services/semantic-version.service'

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
    label: 'Knobs → Sliders',
    value: false,
    toggled: replaceKnobsWithSliders => {
      this.ui.setSettings({ replaceKnobsWithSliders })
      this.app.ref.closeDropdownSection('settings')
    }
  }

  doCollectTelemetryOption: CheckboxOption = {
    type: 'checkbox',
    label: 'Send Anonymous Analytics data',
    tooltip: `
eqMac would collect anonymous Telemetry analytics data like:

• macOS Version
• App and UI Version
• Country (IP Addresses are anonymized)

This helps us understand distribution of our users.
`,
    value: false,
    toggled: doCollectTelemetry => {
      this.ui.setSettings({ doCollectTelemetry })
      if (doCollectTelemetry) {
        this.analytics.init()
      } else {
        this.analytics.deinit()
      }
    }
  }

  doCollectCrashReportsOption: CheckboxOption = {
    type: 'checkbox',
    label: 'Send Anonymous Crash reports',
    tooltip: `
eqMac would send anonymized crash reports
back to the developer in case eqMac crashes.
This helps us understand improve eqMac 
and make it a more stable product.
`,
    value: false,
    toggled: doCollectCrashReports => {
      this.settingsService.setDoCollectCrashReports({
        doCollectCrashReports
      })
    }
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

  autoCheckUpdatesOption: CheckboxOption = {
    type: 'checkbox',
    value: false,
    label: 'Check Automatically',
    toggled: doAutoCheckUpdates => {
      this.settingsService.setDoAutoCheckUpdates({
        doAutoCheckUpdates
      })
    }
  }

  otaUpdatesOption: CheckboxOption = {
    type: 'checkbox',
    value: false,
    label: 'OTA User Interface Updates',
    toggled: doOTAUpdates => {
      this.settingsService.setDoOTAUpdates({
        doOTAUpdates
      })
    }
  }

  settings: Options = [
    [ { type: 'label', label: 'Settings' } ],
    [ this.iconModeOption ],
    [
      this.replaceKnobsWithSlidersOption,
      this.launchOnStartupOption
    ],

    [ { type: 'divider', orientation: 'horizontal' } ],

    [ { type: 'label', label: 'Updates' } ],
    [
      this.updateOption
    ],

    [ { type: 'divider', orientation: 'horizontal' } ],

    // Privacy
    [ { type: 'label', label: 'Privacy' } ],
    [
      this.doCollectTelemetryOption
    ],

    [ { type: 'divider', orientation: 'horizontal' } ],
    // Misc
    [ this.uninstallOption ]
  ]

  constructor (
    public settingsService: SettingsService,
    public app: ApplicationService,
    public dialog: MatDialog,
    public ui: UIService,
    public analytics: AnalyticsService
  ) {
  }

  ngOnInit () {
    this.sync()
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
      UISettings,
      info
    ] = await Promise.all([
      this.settingsService.getLaunchOnStartup(),
      this.settingsService.getIconMode(),
      this.ui.getSettings(),
      this.app.getInfo()
    ])
    this.iconModeOption.selectedId = iconMode
    this.launchOnStartupOption.value = launchOnStartup
    this.replaceKnobsWithSlidersOption.value = UISettings.replaceKnobsWithSliders
    this.doCollectTelemetryOption.value = UISettings.doCollectTelemetry

    // Some settings that are only available from v1.1.0
    if (new SemanticVersion(info.version).isGreaterThanOrEqualTo('1.1.0')) {
      const [
        doCollectCrashReports,
        doAutoCheckUpdates,
        doOTAUpdates
      ] = await Promise.all([
        this.settingsService.getDoCollectCrashReports(),
        this.settingsService.getDoAutoCheckUpdates(),
        this.settingsService.getDoOTAUpdates()
      ])

      this.doCollectCrashReportsOption.value = doCollectCrashReports
      this.autoCheckUpdatesOption.value = doAutoCheckUpdates
      this.otaUpdatesOption.value = doOTAUpdates

      // Add Update options
      this.settings.splice(this.settings.length - 6, 0, [
        this.autoCheckUpdatesOption,
        this.otaUpdatesOption
      ])

      // Add Privacy option
      this.settings.splice(this.settings.length - 2, 0, [
        this.doCollectCrashReportsOption
      ])
    }
  }

  async update () {
    this.app.update()
  }

  async uninstall () {
    this.app.uninstall()
  }
}

import { Component, OnInit } from '@angular/core'
import { CheckboxOption, ButtonOption, Options, SelectOption } from 'src/app/components/options/options.component'
import { SettingsService, IconMode } from './settings.service'
import { ApplicationService } from '../../services/app.service'
import { MatDialog } from '@angular/material/dialog'
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component'
import { StatusItemIconType, UIService } from '../../services/ui.service'
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
    label: 'Launch on login',
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

  alwaysOnTopOption: CheckboxOption = {
    type: 'checkbox',
    label: 'Always on top',
    value: false,
    toggled: alwaysOnTop => {
      this.ui.setAlwaysOnTop({ alwaysOnTop })
    }
  }

  doCollectTelemetryOption: CheckboxOption = {
    type: 'checkbox',
    label: 'Send Analytics telemetry',
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
    label: 'Send Crash reports',
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
    label: 'OTA Updates',
    tooltip: `
Because eqMac's User Interface is built with Web Technologies 
the developer can periodically push Over the Air (OTA) updates,
make minor bug fixes and UI improvements,
all without needing the user to do a full app update.
`,
    tooltipAsComponent: true,
    toggled: doOTAUpdates => {
      this.settingsService.setDoOTAUpdates({
        doOTAUpdates
      })
    }
  }

  statusItemIconTypeOption: SelectOption = {
    type: 'select',
    label: 'Status Icon Type',
    isEnabled: () => ([ IconMode.both, IconMode.statusBar ] as IconMode[]).includes(this.iconModeOption.selectedId as any),
    options: [ {
      id: StatusItemIconType.classic,
      label: 'Classic'
    }, {
      id: StatusItemIconType.colored,
      label: 'Colored'
    }, {
      id: StatusItemIconType.macOS,
      label: 'macOS'
    } ],
    selectedId: StatusItemIconType.classic,
    selected: async (statusItemIconType: StatusItemIconType) => {
      await this.ui.setStatusItemIconType(statusItemIconType)
    }
  }

  settings: Options = [
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
        doOTAUpdates,
        alwaytOnTop,
        statusItemIconType
      ] = await Promise.all([
        this.settingsService.getDoCollectCrashReports(),
        this.settingsService.getDoAutoCheckUpdates(),
        this.settingsService.getDoOTAUpdates(),
        this.ui.getAlwaysOnTop(),
        this.ui.getStatusItemIconType()
      ])

      this.doCollectCrashReportsOption.value = doCollectCrashReports
      this.autoCheckUpdatesOption.value = doAutoCheckUpdates
      this.otaUpdatesOption.value = doOTAUpdates
      this.alwaysOnTopOption.value = alwaytOnTop
      this.statusItemIconTypeOption.selectedId = statusItemIconType

      // Add Update options
      this.settings.splice(this.settings.length - 6, 0, [
        this.autoCheckUpdatesOption,
        this.otaUpdatesOption
      ])

      // Add Privacy option
      this.settings[8].push(
        this.doCollectCrashReportsOption
      )

      // Add always on top option
      this.settings[1].push(this.alwaysOnTopOption)

      // Add Neither option for IconMode
      this.iconModeOption.options.push({
        id: IconMode.neither,
        label: 'Neither'
      })

      // Add Status Item Icon type option
      this.settings.splice(1, 0, [ this.statusItemIconTypeOption ])
    }
  }

  async update () {
    this.app.update()
  }

  async uninstall () {
    this.app.uninstall()
  }
}

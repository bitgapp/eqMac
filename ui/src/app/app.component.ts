import {
  Component,
  OnInit,
  ViewChild,
  AfterContentInit
} from '@angular/core'
import { UtilitiesService } from './services/utilities.service'
import { UIService, UIDimensions, UIShownChangedEventCallback } from './services/ui.service'
import { FadeInOutAnimation, FromTopAnimation } from '@eqmac/components'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { TransitionService } from './services/transitions.service'
import { AnalyticsService } from './services/analytics.service'
import { ApplicationService } from './services/app.service'
import { SettingsService, IconMode } from './sections/settings/settings.service'
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component'
import { SemanticVersion } from './services/semantic-version.service'
import { OptionsDialogComponent } from './components/options-dialog/options-dialog.component'
import { Option, Options } from './components/options/options.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
  animations: [ FadeInOutAnimation, FromTopAnimation ]
})

export class AppComponent implements OnInit, AfterContentInit {
  @ViewChild('container', { static: true }) container
  loaded = false
  animationDuration = 500
  animationFps = 30

  showDropdownSections = {
    settings: false,
    help: false
  }

  constructor (
    public utils: UtilitiesService,
    public ui: UIService,
    public dialog: MatDialog,
    public transitions: TransitionService,
    public analytics: AnalyticsService,
    public app: ApplicationService,
    public settings: SettingsService
  ) {
    this.app.ref = this
  }

  async ngOnInit () {
    await this.sync()
    await this.fixUIMode()
    await this.setupPrivacy()
  }

  async setupPrivacy () {
    const [ uiSettings, info ] = await Promise.all([
      this.ui.getSettings(),
      this.app.getInfo()
    ])

    // Starting from v1.1.0 we need to show the Crash Reports consent as well
    if (new SemanticVersion(info.version).isGreaterThanOrEqualTo('1.1.0')) {
      let doCollectCrashReports = await this.settings.getDoCollectCrashReports()
      if (typeof uiSettings.privacyFormSeen !== 'boolean') {
        const doCollectTelemetryOption: Option = {
          type: 'checkbox',
          label: 'Send Anonymous Analytics data',
          tooltip: `
eqMac would collect anonymous Telemetry analytics data like:

• macOS Version
• App and UI Version
• Country (IP Addresses are anonymized)

This helps us understand distribution of our users.
`,
          value: uiSettings.doCollectTelemetry ?? false,
          toggled: doCollectTelemetry => {
            uiSettings.doCollectTelemetry = doCollectTelemetry
            this.ui.setSettings({ doCollectTelemetry })
          }
        }

        const doCollectCrashReportsOption: Option = {
          type: 'checkbox',
          label: 'Send Anonymous Crash reports',
          tooltip: `
eqMac would send anonymized crash reports
back to the developer in case eqMac crashes.
This helps us understand improve eqMac 
and make it a more stable product.
      `,
          value: doCollectCrashReports,
          toggled: doCollect => {
            doCollectCrashReports = doCollect
            this.settings.setDoCollectCrashReports({
              doCollectCrashReports
            })
          }
        }
        const privacyDialog: MatDialogRef<OptionsDialogComponent> = this.dialog.open(OptionsDialogComponent, {
          hasBackdrop: true,
          disableClose: true,
          data: {
            options: [
              [ { type: 'label', label: 'Privacy' } ],
              [ {
                type: 'label', label: `eqMac respects it's user's privacy 
and is giving you a choice what data you wish to share with the developer.
This data would help us improve and grow the product.`
              } ],
              [ doCollectTelemetryOption ],
              [ doCollectCrashReportsOption ],
              [
                {
                  type: 'button',
                  label: 'Save',
                  action: () => privacyDialog.close()
                }
              ]
            ] as Options
          }
        })

        await privacyDialog.afterClosed().toPromise()
        await this.ui.setSettings({
          privacyFormSeen: true
        })
      }
    } else {
      // Can only show Analytics consent form on < v1.1.0
      if (typeof uiSettings.doCollectTelemetry !== 'boolean') {
        uiSettings.doCollectTelemetry = await this.dialog.open(ConfirmDialogComponent, {
          hasBackdrop: true,
          disableClose: true,
          data: {
            text: `Is it okay with you if eqMac will collect anonymous Telemetry analytics data like:
  
            • macOS Version
            • App and UI Version
            • Country (IP Addresses are anonymized)
  
            This helps us understand distribution of eqMac's users.
            You can change this setting any time later in the Settings.`,
            cancelText: 'Don\'t collect',
            confirmText: 'It\'s okay'
          }
        }).afterClosed().toPromise()
        await this.ui.setSettings({
          doCollectTelemetry: uiSettings.doCollectTelemetry
        })
      }
    }

    if (uiSettings.doCollectTelemetry) {
      await this.analytics.init()
    }
  }

  async ngAfterContentInit () {
    await this.utils.delay(this.animationDuration)
    this.syncDimensions()
    this.startDimensionsSync()
    this.loaded = true
    this.ui.loaded()
  }

  async sync () {
    await Promise.all([
      this.getTransitionSettings()
    ])
  }

  async syncDimensions (dimensions?: UIDimensions) {
    await Promise.all([
      this.syncHeight(dimensions),
      this.syncWidth(dimensions)
    ])
  }

  async getTransitionSettings () {
    const settings = await this.transitions.getSettings()
    this.animationDuration = settings.duration
    this.animationFps = settings.fps
  }

  async syncHeight (dimensions?: UIDimensions) {
    await this.utils.delay(10)
    let height: number = this.container.nativeElement.offsetHeight
    if (dimensions) {
      if (dimensions.heightDiff) {
        height += dimensions.heightDiff
      } else if (dimensions.height) {
        height = dimensions.height
      }
    }
    this.ui.setHeight(height)
  }

  async syncWidth (dimensions?: UIDimensions) {
    await this.utils.delay(10)
    let width: number = this.container.nativeElement.offsetWidth
    if (dimensions) {
      if (dimensions.widthDiff) {
        width += dimensions.widthDiff
      } else if (dimensions.width) {
        width = dimensions.width
      }
    }
    this.ui.setWidth(width)
  }

  startDimensionsSync () {
    this.ui.dimensionsChanged.subscribe(async dimensions => await this.syncDimensions(dimensions))
    setInterval(async () => await this.syncDimensions(), 1000)
  }

  toggleDropdownSection (section: string) {
    for (const key in this.showDropdownSections) {
      this.showDropdownSections[key] = key === section ? !this.showDropdownSections[key] : false
    }
  }

  async fixUIMode () {
    const [ mode, iconMode ] = await Promise.all([
      this.ui.getMode(),
      this.settings.getIconMode()
    ])

    if (mode === 'popover' && iconMode === IconMode.dock) {
      await this.ui.setMode('window')
    }
  }

  closeDropdownSection (section: string, event?: any) {
    // if (event && event.target && ['backdrop', 'mat-dialog'].some(e => event.target.className.includes(e))) return
    if (this.dialog.openDialogs.length > 0) return
    if (section in this.showDropdownSections) {
      this.showDropdownSections[section] = false
    }
  }
}

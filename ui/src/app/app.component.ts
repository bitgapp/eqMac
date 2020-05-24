import '@iconfu/svg-inject'
import {
  Component,
  OnInit,
  ViewChild,
  AfterContentInit
} from '@angular/core'
import { UtilitiesService } from './services/utilities.service'
import { UIService, UIDimensions } from './services/ui.service'
import { FadeInOutAnimation, FromTopAnimation } from 'src/app/modules/animations'
import { MatDialog } from '@angular/material'
import { TransitionService } from './services/transitions.service'
import { AnalyticsService } from './services/analytics.service'
import { ApplicationService } from './services/app.service'
import { SettingsService, IconMode } from './sections/settings/settings.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [FadeInOutAnimation, FromTopAnimation]
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
    private utils: UtilitiesService,
    private ui: UIService,
    public matDialog: MatDialog,
    private transitions: TransitionService,
    private analytics: AnalyticsService,
    private app: ApplicationService,
    private settings: SettingsService
  ) { }

  async ngOnInit () {
    await this.sync()
    await this.fixUIMode()
    this.analytics.send()
  }

  async ngAfterContentInit () {
    await this.utils.delay(this.animationDuration)
    this.syncDimensions()
    this.startDimensionsSync()
    this.loaded = true
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
    let height = this.container.nativeElement.offsetHeight
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
    let width = this.container.nativeElement.offsetWidth
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
    this.ui.dimensionsChanged.subscribe(dimensions => this.syncDimensions(dimensions))
    setInterval(() => this.syncDimensions(), 1000)
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
    if (this.matDialog.openDialogs.length) return
    if (section in this.showDropdownSections) {
      this.showDropdownSections[section] = false
    }
  }
}

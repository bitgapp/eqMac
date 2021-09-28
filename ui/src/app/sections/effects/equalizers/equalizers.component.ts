import { Component, OnInit, EventEmitter, Output, ViewChild, Input, ChangeDetectorRef, OnDestroy, HostBinding, HostListener } from '@angular/core'
import { EqualizersService, EqualizersTypeChangedEventCallback, EqualizerType } from './equalizers.service'
import { BasicEqualizerComponent } from './basic-equalizer/basic-equalizer.component'
import { AdvancedEqualizerComponent } from './advanced-equalizer/advanced-equalizer.component'
import { EqualizerComponent } from './equalizer.component'
import { ColorsService, FadeInOutAnimation, FromTopAnimation } from '@eqmac/components'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { OptionsDialogComponent } from '../../../components/options-dialog/options-dialog.component'
import { EqualizerPreset } from './presets/equalizer-presets.component'
import { UIService } from '../../../services/ui.service'
import { EffectEnabledChangedEventCallback } from '../effect.service'
import { ApplicationService } from '../../../services/app.service'
import { UtilitiesService } from '../../../services/utilities.service'

@Component({
  selector: 'eqm-equalizers',
  templateUrl: './equalizers.component.html',
  styleUrls: [ './equalizers.component.scss' ],
  animations: [ FadeInOutAnimation, FromTopAnimation ]
})
export class EqualizersComponent implements OnInit, OnDestroy {
  @Input() animationDuration = 500
  @Input() animationFps = 30

  @Output() visibilityToggled = new EventEmitter()
  @ViewChild('basicEqualizer', { static: false }) basicEqualizer: BasicEqualizerComponent
  @ViewChild('advancedEqualizer', { static: false }) advancedEqualizer: AdvancedEqualizerComponent

  toolbarHeight = 30
  presetsHeight = 46
  @HostBinding('style.min-height.px') get height () {
    return this.toolbarHeight + (this.show ? ((this.activeEqualizer?.height ?? 0) + this.presetsHeight) : 0)
  }

  @HostBinding('style.max-height.px') get maxHeight () {
    let maxHeight = this.toolbarHeight

    if (this.show) {
      const eqMaxHeight = (() => {
        switch (this.type) {
          default: return this.activeEqualizer?.height ?? 0
        }
      })()
      maxHeight += this.presetsHeight + eqMaxHeight
    }

    return maxHeight
  }

  loaded = false
  enabled = true
  show = true
  enabledToggleHighlighted = false

  activeEqualizer? = this.getEqualizerFromType('Basic')
  presets: EqualizerPreset[] = []
  selectedPreset: EqualizerPreset

  _type: EqualizerType
  set type (newType: EqualizerType) {
    if (this._type === newType) return
    this._type = newType
    this.changeRef.detectChanges()
    this.activeEqualizer = this.getEqualizerFromType(this.type)
  }

  get type () { return this._type }

  gain: number = 0

  public settingsDialog: MatDialogRef<OptionsDialogComponent>

  constructor (
    public service: EqualizersService,
    public dialog: MatDialog,
    public ui: UIService,
    public app: ApplicationService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly utils: UtilitiesService,
    public colors: ColorsService
  ) {
    this.service.ref = this
  }

  async ngOnInit () {
    await this.sync()
    this.setupEvents()
    this.loaded = true
    this.changeRef.detectChanges()
    this.activeEqualizer = this.getEqualizerFromType(this.type)
  }

  protected async sync () {
    const [
      type,
      enabled,
      uiSettings
    ] = await Promise.all([
      this.service.getType(),
      this.service.getEnabled(),
      this.ui.getSettings()
    ])
    this.type = type
    this.enabled = enabled
    this.show = uiSettings.showEqualizers ?? true
  }

  private onEnabledChangedEventCallback: EffectEnabledChangedEventCallback
  private onTypeChangedEventCallback: EqualizersTypeChangedEventCallback
  protected setupEvents () {
    this.onEnabledChangedEventCallback = ({ enabled }) => {
      this.enabled = enabled
    }
    this.service.onEnabledChanged(this.onEnabledChangedEventCallback)

    this.onTypeChangedEventCallback = ({ type }) => {
      this.type = type
    }
    this.service.onTypeChanged(this.onTypeChangedEventCallback)
  }

  private destroyEvents () {
    this.service.offEnabledChanged(this.onEnabledChangedEventCallback)
    this.service.offTypeChanged(this.onTypeChangedEventCallback)
  }

  setEnabled () {
    this.service.setEnabled(this.enabled)
  }

  async setType (type: EqualizerType) {
    if (!this.app.enabled) return
    await this.service.setType(type)
    this.type = type
    await this.utils.delay(this.animationDuration)
    this.ui.dimensionsChanged.next()
  }

  public getEqualizerFromType (type: EqualizerType): EqualizerComponent {
    switch (type) {
      case 'Basic': return this.basicEqualizer
      case 'Advanced': return this.advancedEqualizer
    }
  }

  toggleVisibility () {
    this.show = !this.show
    this.ui.setSettings({ showEqualizers: this.show })
    this.visibilityToggled.emit(this.show)

    setTimeout(() => {
      this.activeEqualizer = this.getEqualizerFromType(this.type)
    })
  }

  openSettings () {
    if (!this.app.enabled || !this.enabled) {
      return this.clicked()
    }
    const width = '90vw'
    this.settingsDialog = this.dialog.open(OptionsDialogComponent, {
      hasBackdrop: true,
      disableClose: false,
      width: width,
      maxWidth: width,
      panelClass: 'options-dialog-container',
      data: {
        options: this.activeEqualizer.settings,
        title: `${this.type} Equalizer Settings`
      }
    })
  }

  savePreset (name: string) {
    return this.activeEqualizer.savePreset(name)
  }

  deletePreset () {
    return this.activeEqualizer.deletePreset()
  }

  selectPreset (preset: EqualizerPreset) {
    return this.activeEqualizer.selectPreset(preset)
  }

  clicked () {
    if (!this.enabled) {
      this.blinkEnabledToggle()
    }
  }

  private async blinkEnabledToggle () {
    this.enabledToggleHighlighted = true
    await this.utils.delay(100)
    this.enabledToggleHighlighted = false
    await this.utils.delay(100)
    this.enabledToggleHighlighted = true
    await this.utils.delay(100)
    this.enabledToggleHighlighted = false
    await this.utils.delay(100)
  }

  ngOnDestroy () {
    this.destroyEvents()
  }
}

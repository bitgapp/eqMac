import { Component, OnInit, EventEmitter, Output, ViewChild, Input, ChangeDetectorRef, OnDestroy } from '@angular/core'
import { EqualizersService, EqualizersTypeChangedEventCallback, EqualizerType } from './equalizers.service'
import { BasicEqualizerComponent } from './basic-equalizer/basic-equalizer.component'
import { AdvancedEqualizerComponent } from './advanced-equalizer/advanced-equalizer.component'
import { EqualizerComponent } from './equalizer.component'
import { FadeInOutAnimation, FromTopAnimation } from '@eqmac/components'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { OptionsDialogComponent } from '../../../components/options-dialog/options-dialog.component'
import { EqualizerPreset } from './presets/equalizer-presets.component'
import { UIService } from '../../../services/ui.service'
import { EffectEnabledChangedEventCallback } from '../effect.service'
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

  loaded = false
  enabled = true
  show = true
  activeEqualizer: EqualizerComponent = this.getEqualizerFromType('Basic')

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
    public equalizersService: EqualizersService,
    public dialog: MatDialog,
    public ui: UIService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly utils: UtilitiesService
  ) { }

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
      this.equalizersService.getType(),
      this.equalizersService.getEnabled(),
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
    this.equalizersService.onEnabledChanged(this.onEnabledChangedEventCallback)

    this.onTypeChangedEventCallback = ({ type }) => {
      this.type = type
    }
    this.equalizersService.onTypeChanged(this.onTypeChangedEventCallback)
  }

  private destroyEvents () {
    this.equalizersService.offEnabledChanged(this.onEnabledChangedEventCallback)
    this.equalizersService.offTypeChanged(this.onTypeChangedEventCallback)
  }

  setEnabled () {
    this.equalizersService.setEnabled(this.enabled)
  }

  async setType (type: EqualizerType) {
    await this.equalizersService.setType(type)
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
    this.visibilityToggled.emit(this.show)
  }

  openSettings () {
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

  ngOnDestroy () {
    this.destroyEvents()
  }
}

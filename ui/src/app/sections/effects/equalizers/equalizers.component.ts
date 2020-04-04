import { Component, OnInit, EventEmitter, Output, ViewChild, Input } from '@angular/core'
import { EqualizersService, EqualizerType } from './equalizers.service'
import { BasicEqualizerComponent } from './basic-equalizer/basic-equalizer.component'
import { AdvancedEqualizerComponent } from './advanced-equalizer/advanced-equalizer.component'
import { EqualizerComponent } from './equalizer.component'
import { CarouselComponent } from 'src/app/modules/eqmac-components/components/carousel/carousel.component'
import { FadeInOutAnimation } from 'src/app/modules/animations'
import { MatDialog, MatDialogRef } from '@angular/material'
import { OptionsDialogComponent } from '../../../components/options-dialog/options-dialog.component'
import { EqualizerPreset } from './presets/equalizer-presets.component'
import { UIService } from '../../../services/ui.service'

@Component({
  selector: 'eqm-equalizers',
  templateUrl: './equalizers.component.html',
  styleUrls: ['./equalizers.component.scss'],
  animations: [ FadeInOutAnimation ]
})
export class EqualizersComponent implements OnInit {
  @Input() animationDuration = 500
  @Input() animationFps = 30

  @Output() visibilityToggled = new EventEmitter()
  @ViewChild('equalizersCarousel', { static: false }) equalizersCarousel: CarouselComponent
  @ViewChild('basicEqualizer', { static: false }) basicEqualizer: BasicEqualizerComponent
  @ViewChild('advancedEqualizer', { static: false }) advancedEqualizer: AdvancedEqualizerComponent
  // @ViewChild('expertEqualizer') expertEqualizer: BasicEqualizerComponent

  loaded = false
  enabled = true
  hide = false
  activeEqualizer: EqualizerComponent

  presets: EqualizerPreset[] = []
  selectedPreset: EqualizerPreset

  _type: EqualizerType
  set type (newType: EqualizerType) {
    if (this._type === newType) return
    this._type = newType
    this.activeEqualizer = this.getEqualizerFromType(this.type)
  }
  get type () { return this._type }

  gain: number = 0

  typeSwitched (newType: EqualizerType) {
    this.type = newType
    this.equalizersService.setType(newType)
  }

  private settingsDialog: MatDialogRef<OptionsDialogComponent>

  constructor (
    private equalizersService: EqualizersService,
    private dialog: MatDialog,
    protected ui: UIService
    ) { }

  async ngOnInit () {
    await this.sync()
    this.setupEvents()
    this.loaded = true
  }

  protected sync () {
    return Promise.all([
      this.syncType(),
      this.syncEnabled()
    ])
  }

  protected async syncType () {
    this.type = await this.equalizersService.getType()
  }

  protected async syncEnabled () {
    this.enabled = await this.equalizersService.getEnabled()
  }

  protected setupEvents () {
    this.equalizersService.onEnabledChanged(enabled => {
      this.enabled = enabled
    })

    this.equalizersService.onTypeChanged(type => {
      this.type = type
    })
  }

  setEnabled () {
    this.equalizersService.setEnabled(this.enabled)
  }

  previousType () {
    this.equalizersCarousel.prev()
  }

  nextType () {
    this.equalizersCarousel.next()
  }

  equalizerCameIntoView (type: EqualizerType) {
    const equalizer = this.getEqualizerFromType(type)
    equalizer && equalizer.selected()
  }

  carouselHeightChanged (heightDiff: number) {
    this.ui.dimensionsChanged.next({ heightDiff })
  }

  private getEqualizerFromType (type: EqualizerType): EqualizerComponent {
    switch (type) {
      case 'Basic': return this.basicEqualizer
      case 'Advanced': return this.advancedEqualizer
    }
  }

  toggleVisibility () {
    this.hide = !this.hide
    this.visibilityToggled.emit()
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

}

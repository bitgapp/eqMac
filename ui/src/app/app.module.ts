import {
  BrowserModule
} from '@angular/platform-browser'
import {
  NgModule
} from '@angular/core'

import {
  AppComponent
} from './app.component'

import {
  environment
} from '../environments/environment'

import {
  FlexLayoutModule
} from '@angular/flex-layout'

import {
  EqmacComponentsModule
} from './modules/eqmac-components/eqmac-components.module'

import { PipesModule } from './modules/pipes/pipes.module'

import {
  CommonModule
} from '@angular/common'

import {
  HeaderComponent
} from './sections/header/header.component'
import {
  SourceComponent
} from './sections/source/source.component'
import {
  BoosterComponent
} from './sections/volume/booster-balance/booster/booster.component'
import {
  BalanceComponent
} from './sections/volume/booster-balance/balance/balance.component'
import {
  EqualizersComponent
} from './sections/effects/equalizers/equalizers.component'
import {
  ReverbComponent
} from './sections/effects/reverb/reverb.component'
import {
  RecorderComponent
} from './sections/recorder/recorder.component'
import {
  OutputsComponent
} from './sections/outputs/outputs.component'

import {
  InputComponent
} from './sections/source/input/input.component'
import {
  FileComponent
} from './sections/source/file/file.component'
import {
  SystemComponent
} from './sections/source/system/system.component'
import {
  BasicEqualizerComponent
} from './sections/effects/equalizers/basic-equalizer/basic-equalizer.component'
import {
  AdvancedEqualizerComponent
} from './sections/effects/equalizers/advanced-equalizer/advanced-equalizer.component'
import {
  ExpertEqualizerComponent
} from './sections/effects/equalizers/expert-equalizer/expert-equalizer.component'
import {
  VolumeBoosterBalanceComponent
} from './sections/volume/booster-balance/volume-booster-balance.component'
import {
  VolumeMixerComponent
} from './sections/volume/volume-mixer/volume-mixer.component'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { SettingsComponent } from './sections/settings/settings.component'
import { ClickOutsideModule } from 'ng-click-outside'
import { OptionsComponent } from './components/options/options.component'
import { HelpComponent } from './sections/help/help.component'
import { MatDialogModule } from '@angular/material'
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component'
import { EqualizerPresetsComponent } from './sections/effects/equalizers/presets/equalizer-presets.component'
import { PromptDialogComponent } from './components/prompt-dialog/prompt-dialog.component'
import { OptionsDialogComponent } from './components/options-dialog/options-dialog.component'

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    PipesModule,
    EqmacComponentsModule,
    MatDialogModule,
    BrowserModule,
    ClickOutsideModule
  ],
  entryComponents: [
    ConfirmDialogComponent,
    PromptDialogComponent,
    OptionsDialogComponent
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    SourceComponent,
    BoosterComponent,
    BalanceComponent,
    EqualizersComponent,
    ReverbComponent,
    RecorderComponent,
    OutputsComponent,
    InputComponent,
    FileComponent,
    SystemComponent,
    BasicEqualizerComponent,
    AdvancedEqualizerComponent,
    ExpertEqualizerComponent,
    VolumeBoosterBalanceComponent,
    VolumeMixerComponent,
    SettingsComponent,
    OptionsComponent,
    HelpComponent,
    ConfirmDialogComponent,
    EqualizerPresetsComponent,
    PromptDialogComponent,
    OptionsDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

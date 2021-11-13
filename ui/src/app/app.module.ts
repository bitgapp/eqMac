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
  FlexLayoutModule
} from '@angular/flex-layout'

import {
  ComponentsModule
} from '@eqmac/components'

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
  VolumeBoosterBalanceComponent
} from './sections/volume/booster-balance/volume-booster-balance.component'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { SettingsComponent } from './sections/settings/settings.component'
import { OptionsComponent } from './components/options/options.component'
import { HelpComponent } from './sections/help/help.component'
import { MatDialogConfig, MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog'
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component'
import { EqualizerPresetsComponent } from './sections/effects/equalizers/presets/equalizer-presets.component'
import { PromptDialogComponent } from './components/prompt-dialog/prompt-dialog.component'
import { OptionsDialogComponent } from './components/options-dialog/options-dialog.component'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { UIService } from './services/ui.service'

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    PipesModule,
    ComponentsModule,
    MatDialogModule,
    MatSnackBarModule,
    BrowserModule
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
    RecorderComponent,
    OutputsComponent,
    InputComponent,
    FileComponent,
    SystemComponent,
    BasicEqualizerComponent,
    AdvancedEqualizerComponent,
    VolumeBoosterBalanceComponent,
    SettingsComponent,
    OptionsComponent,
    HelpComponent,
    ConfirmDialogComponent,
    EqualizerPresetsComponent,
    PromptDialogComponent,
    OptionsDialogComponent
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        ...new MatDialogConfig(),
        hasBackdrop: true,
        maxWidth: 10,
        width: '10px'
      } as MatDialogConfig
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}

import { NgModule } from '@angular/core'
import { ServerModule } from '@angular/platform-server'

import { SiteModule } from './site.module'
import { SiteComponent } from './site.component'
import { FlexLayoutServerModule } from '@angular/flex-layout/server'

@NgModule({
  imports: [
    SiteModule,
    ServerModule,
    FlexLayoutServerModule
  ],
  bootstrap: [SiteComponent],
})
export class SiteServerModule {}

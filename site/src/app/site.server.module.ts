import { NgModule } from '@angular/core'
import { ServerModule } from '@angular/platform-server'

import { SiteModule } from './site.module'
import { SiteComponent } from './site.component'

@NgModule({
  imports: [
    SiteModule,
    ServerModule,
  ],
  bootstrap: [SiteComponent],
})
export class SiteServerModule {}

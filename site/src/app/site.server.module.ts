import { NgModule } from '@angular/core'
import { ServerModule } from '@angular/platform-server'

import { SiteModule } from './site.module'
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader'
import { SiteComponent } from './site.component'

@NgModule({
  imports: [
    SiteModule,
    ServerModule,
    ModuleMapLoaderModule,
  ],
  bootstrap: [SiteComponent],
})
export class SiteServerModule {}

import { NgModule } from '@angular/core'
import { ServerModule } from '@angular/platform-server'

import { SiteModule } from './site.module'
import { SiteComponent } from './site.component'
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader'

@NgModule({
  imports: [
    SiteModule,
    ServerModule,
    ModuleMapLoaderModule,
  ],
  bootstrap: [SiteComponent],
})
export class AppServerModule {}

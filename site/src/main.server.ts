import { enableProdMode } from '@angular/core'

import { environment } from './environments/environment'

if (environment.production) {
  enableProdMode()
}

export { SiteServerModule as AppServerModule } from './app/site.server.module'
export { ngExpressEngine } from '@nguniversal/express-engine'
export { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader'


import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { SiteModule } from './app/site.module'
import { environment } from './environments/environment'

if (environment.production) {
  enableProdMode()
}

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(SiteModule)
  .catch(err => console.error(err))
})

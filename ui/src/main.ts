import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { AppModule } from './app/app.module'
import { environment } from './environments/environment'

if (environment.production) {
  enableProdMode()
  // document.body.setAttribute('oncontextmenu', 'event.preventDefault();')
}

platformBrowserDynamic()
.bootstrapModule(AppModule)
  .then(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration('ngsw-worker.js')
        .then(registration => registration && registration.unregister())
    }
  })
  .catch(err => console.error(err))

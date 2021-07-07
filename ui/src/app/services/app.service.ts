import { Injectable } from '@angular/core'
import { AppComponent } from '../app.component'
import { ConstantsService } from './constants.service'
import { DataService } from './data.service'
import { ToastService } from './toast.service'

export interface Info {
  name: string
  model: string
  version: string
  isOpenSource: boolean
  driverVersion?: string
}
@Injectable({
  providedIn: 'root'
})
export class ApplicationService extends DataService {
  ref?: AppComponent
  info?: Info

  constructor (
    public toast: ToastService,
    public CONST: ConstantsService
  ) {
    super()
    this.on('/error', ({ error }) => {
      this.toast.show({
        message: error,
        type: 'warning'
      })
    })
  }

  async getInfo (): Promise<Info> {
    if (!this.info) {
      this.info = await this.request({ method: 'GET', endpoint: '/info' })
      // < v1.0.0 didn't return isOpenSource property so need to set it
      this.info.isOpenSource ??= true
    }
    return this.info
  }

  quit () {
    return this.request({ method: 'GET', endpoint: '/quit' })
  }

  openURL (url: URL) {
    return this.request({ method: 'POST', endpoint: '/open-url', data: { url: url.href } })
  }

  uninstall () {
    return this.openURL(new URL(`https://${this.CONST.DOMAIN}#uninstall`))
  }

  haptic () {
    return this.request({ method: 'GET', endpoint: '/haptic' })
  }

  update () {
    return this.request({ method: 'GET', endpoint: '/update' })
  }
}

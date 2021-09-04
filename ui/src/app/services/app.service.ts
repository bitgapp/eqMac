import { EventEmitter, Injectable } from '@angular/core'
import { AppComponent } from '../app.component'
import { ConstantsService } from './constants.service'
import { DataService } from './data.service'
import { ToastService } from './toast.service'
import { UIService } from './ui.service'

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
  enabled: boolean
  ref?: AppComponent
  info?: Info

  constructor (
    public toast: ToastService,
    public CONST: ConstantsService,
    public ui: UIService
  ) {
    super()
    this.on('/error', ({ error }) => {
      this.toast.show({
        message: error,
        type: 'warning'
      })
    })
    this.sync()
  }

  async sync () {
    const [ enabled ] = await Promise.all([
      this.getEnabled()
    ])
    this.enabled = enabled
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

  lastHaptic: Date
  haptic () {
    if (!this.lastHaptic || new Date().getTime() - this.lastHaptic.getTime() > 1000) {
      this.lastHaptic = new Date()
      return this.request({ method: 'GET', endpoint: '/haptic' })
    }
  }

  update () {
    return this.request({ method: 'GET', endpoint: '/update' })
  }

  async getEnabled (): Promise<boolean> {
    const { enabled } = await this.request({ method: 'GET', endpoint: '/enabled' })
    this.enabled = enabled
    return enabled
  }

  setEnabled (enabled: boolean) {
    this.enabled = enabled
    return this.request({ method: 'POST', endpoint: '/enabled', data: { enabled } })
  }
}

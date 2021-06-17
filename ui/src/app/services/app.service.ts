import { Injectable } from '@angular/core'
import { AppComponent } from '../app.component'
import { DataService } from './data.service'

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

  async getInfo (): Promise<Info> {
    if (!this.info) {
      this.info = await this.request({ method: 'GET', endpoint: '/info' })
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
    return this.request({ method: 'GET', endpoint: '/uninstall' })
  }

  haptic () {
    return this.request({ method: 'GET', endpoint: '/haptic' })
  }

  update () {
    return this.request({ method: 'GET', endpoint: '/update' })
  }
}

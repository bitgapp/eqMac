import { Injectable } from '@angular/core'
import { AppComponent } from '../app.component'
import { DataService } from './data.service'

export interface MacInfo {
  name: string
  model: string
  version: string
  driverVersion?: string
}
@Injectable({
  providedIn: 'root'
})
export class ApplicationService extends DataService {
  ref?: AppComponent

  getMacInfo (): Promise<MacInfo> {
    return this.request({ method: 'GET', endpoint: '/info' })
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

  async getDriverReinstallAvailable () {
    return new Promise(async (resolve) => {
      setTimeout(() => resolve(false), 1000)
      try {
        await this.request({ method: 'GET', endpoint: '/driver/reinstall/available' })
        resolve(true)
      } catch (err) {
        resolve(false)
      }
    })
  }

  reinstallDriver () {
    return this.request({ method: 'GET', endpoint: '/driver/reinstall' })
  }
}

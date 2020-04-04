import { Injectable } from '@angular/core'
import { DataService } from './data.service'

export interface MacInfo {
  name: string
  model: string
  version: string
}
@Injectable({
  providedIn: 'root'
})
export class ApplicationService extends DataService {
  getMacInfo (): Promise<MacInfo> {
    return this.request({ method: 'GET', endpoint: '/info' })
  }

  quit () {
    return this.request({ method: 'GET', endpoint: '/quit' })
  }

  faq () {
    return this.request({ method: 'GET', endpoint: '/faq' })
  }

  reportBug () {
    return this.request({ method: 'POST', endpoint: '/bug' })
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

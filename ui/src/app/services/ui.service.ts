import { Injectable, EventEmitter } from '@angular/core'
import { DataService } from './data.service'
import { Observable, Subject } from 'rxjs'

export type UISettings = {
  replaceKnobsWithSliders?: boolean
}

export interface UIDimensions {
  height?: number
  width?: number
  heightDiff?: number
  widthDiff?: number
}
@Injectable({
  providedIn: 'root'
})
export class UIService extends DataService {
  route = `${this.route}/ui`
  dimensionsChanged = new Subject<UIDimensions>()
  settingsChanged = new Subject<UISettings>()

  async getWidth () {
    const { width } = await this.request({ method: 'GET', endpoint: '/width' })
    return width
  }

  setWidth (width: number) {
    return this.request({ method: 'POST', endpoint: '/width', data: { width } })
  }

  async getHeight () {
    const { height } = await this.request({ method: 'GET', endpoint: '/height' })
    return height
  }

  setHeight (height: number) {
    return this.request({ method: 'POST', endpoint: '/height', data: { height } })
  }

  hide () {
    return this.request({ method: 'GET', endpoint: '/hide' })
  }

  async getSettings (): Promise<UISettings> {
    const settings = await this.request({ method: 'GET', endpoint: '/settings' })
    return settings || {}
  }

  async setSettings (settings: Partial<UISettings>) {
    settings = await this.request({ method: 'POST', endpoint: '/settings', data: settings })
    this.settingsChanged.next(settings)
  }

}

import { Injectable } from '@angular/core'
import { DataService } from './data.service'
import { Subject } from 'rxjs'
import packageJson from '../../../package.json'

export interface UISettings {
  replaceKnobsWithSliders?: boolean
  doCollectTelemetry?: boolean
  privacyFormSeen?: boolean

  uiScale?: number

  volumeFeatureEnabled?: boolean
  boostFeatureEnabled?: boolean
  balanceFeatureEnabled?: boolean
  equalizersFeatureEnabled?: boolean
  outputFeatureEnabled?: boolean

  showEqualizers?: boolean
}

export interface UIDimensions {
  height?: number
  width?: number
  heightDiff?: number
  widthDiff?: number
}

export type UIMode = 'window' | 'popover'
export enum StatusItemIconType {
  classic = 'classic',
  colored = 'colored',
  macOS = 'macOS'
}

@Injectable({
  providedIn: 'root'
})
export class UIService extends DataService {
  route = `${this.route}/ui`
  dimensionsChanged = new Subject<UIDimensions>()
  settingsChanged = new Subject<UISettings>()

  readonly colors = {
    accent: '#4f8d71',
    warning: '#e80415',
    'gradient-start': '#5a5b5f',
    'gradient-end': '#2c2c2e',
    light: '#c9cdd0',
    dark: '#16191c'
  }

  get version () {
    return packageJson.version
  }

  get isLocal () {
    return window.location.href.includes('file://')
  }

  get isRemote () {
    return !this.isLocal
  }

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

  close () {
    return this.request({ method: 'GET', endpoint: '/close' })
  }

  async getMode (): Promise<UIMode> {
    const { mode } = await this.request({ method: 'GET', endpoint: '/mode' })
    return mode
  }

  async setMode (mode: UIMode) {
    return this.request({ method: 'POST', endpoint: '/mode', data: { mode } })
  }

  async getAlwaysOnTop (): Promise<boolean> {
    const { alwaysOnTop } = await this.request({ method: 'GET', endpoint: '/always-on-top' })
    return alwaysOnTop
  }

  async setAlwaysOnTop ({ alwaysOnTop }: { alwaysOnTop: boolean }) {
    return this.request({ method: 'POST', endpoint: '/always-on-top', data: { alwaysOnTop } })
  }

  async getStatusItemIconType (): Promise<StatusItemIconType> {
    const { statusItemIconType } = await this.request({ method: 'GET', endpoint: '/status-item-icon-type' })
    return statusItemIconType
  }

  setStatusItemIconType (statusItemIconType: StatusItemIconType) {
    return this.request({ method: 'POST', endpoint: '/status-item-icon-type', data: { statusItemIconType } })
  }

  async getSettings (): Promise<UISettings> {
    const settings = await this.request({ method: 'GET', endpoint: '/settings' })
    return settings || {}
  }

  async setSettings (settings: Partial<UISettings>) {
    settings = await this.request({ method: 'POST', endpoint: '/settings', data: settings })
    this.settingsChanged.next(settings)
    return settings
  }

  async loaded () {
    return this.request({ method: 'POST', endpoint: '/loaded' })
  }

  onShownChanged (cb: UIShownChangedEventCallback) {
    this.on('/shown', cb)
  }

  offShownChanged (cb: UIShownChangedEventCallback) {
    this.off('/shown', cb)
  }
}

export type UIShownChangedEventCallback = (data: { isShown: boolean }) => void | Promise<void>

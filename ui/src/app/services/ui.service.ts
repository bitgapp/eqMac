import { EventEmitter, Injectable } from '@angular/core'
import { DataService } from './data.service'
import { Subject } from 'rxjs'
import packageJson from '../../../package.json'
import { KnobControlStyle } from '../../../../modules/components/src'

export interface UISettings {
  replaceKnobsWithSliders?: boolean
  doCollectTelemetry?: boolean
  privacyFormSeen?: boolean
  knobControlStyle?: KnobControlStyle

  volumeFeatureEnabled?: boolean
  balanceFeatureEnabled?: boolean
  equalizersFeatureEnabled?: boolean
  outputFeatureEnabled?: boolean

  showEqualizers?: boolean

  reverbsShownBefore?: boolean
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
  settings: UISettings = {}
  private _scale = 1
  uiScaleChanged = new EventEmitter<number>()

  get scale () { return this._scale }
  set scale (newScale: number) {
    if (this._scale !== newScale) {
      this._scale = newScale
      this.uiScaleChanged.emit(this._scale)
    }
  }

  readonly colors = {
    accent: '#4f8d71',
    warning: '#e80415',
    'gradient-start': '#5a5b5f',
    'gradient-end': '#2c2c2e',
    light: '#c9cdd0',
    dark: '#16191c'
  }

  constructor () {
    super()
    this.sync()
  }

  async sync () {
    const [ uiSettings, uiScale ] = await Promise.all([
      this.getSettings(),
      this.getScale()
    ])
    this.settings = uiSettings
    if (!uiSettings.knobControlStyle) {
      this.settings.knobControlStyle = 'directional'
    }
    if (typeof uiSettings.volumeFeatureEnabled !== 'boolean') {
      this.settings.volumeFeatureEnabled = true
    }

    if (typeof uiSettings.balanceFeatureEnabled !== 'boolean') {
      this.settings.balanceFeatureEnabled = true
    }
    if (typeof uiSettings.equalizersFeatureEnabled !== 'boolean') {
      this.settings.equalizersFeatureEnabled = true
    }
    if (typeof uiSettings.outputFeatureEnabled !== 'boolean') {
      this.settings.outputFeatureEnabled = true
    }
    this.setSettings(this.settings)

    this.scale = uiScale
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

  async getWidth (): Promise<number> {
    const { width } = await this.request({ method: 'GET', endpoint: '/width' })
    return width
  }

  setWidth (width: number) {
    return this.request({ method: 'POST', endpoint: '/width', data: { width } })
  }

  async changeWidth ({ diff }: { diff: number }) {
    const currentWidth = await this.getWidth()
    const width = currentWidth + diff
    await this.setWidth(width)
  }

  async getHeight (): Promise<number> {
    const { height } = await this.request({ method: 'GET', endpoint: '/height' })
    return height
  }

  setHeight (height: number) {
    return this.request({ method: 'POST', endpoint: '/height', data: { height } })
  }

  async changeHeight ({ diff }: { diff: number }) {
    const currentHeight = await this.getHeight()
    const height = currentHeight + diff
    await this.setHeight(height)
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
    this.settings = settings || {}
    return this.settings
  }

  async setSettings (settings: Partial<UISettings>) {
    this.settings = await this.request({ method: 'POST', endpoint: '/settings', data: settings })
    this.settingsChanged.next(this.settings)
    return this.settings
  }

  async loaded () {
    return this.request({ method: 'POST', endpoint: '/loaded' })
  }

  async getScale (): Promise<number> {
    const { scale } = await this.request({ method: 'GET', endpoint: '/scale' })
    return scale
  }

  async setScale (scale: number) {
    const oldScale = this.scale
    this.scale = scale
    let [ height, width ] = await Promise.all([
      this.getHeight(),
      this.getWidth()
    ])
    height = scale * height / oldScale
    width = scale * width / oldScale
    await this.request({ method: 'POST', endpoint: '/scale', data: { scale } })
    await Promise.all([
      this.setHeight(height),
      this.setWidth(width)
    ])
  }

  onMinHeightChanged = new EventEmitter()
  async getMinHeight (): Promise<number> {
    const { minHeight } = await this.request({ method: 'GET', endpoint: '/min-height' })
    return minHeight
  }

  async setMinHeight ({ minHeight }: { minHeight: number }) {
    return this.request({ method: 'POST', endpoint: '/min-height', data: { minHeight } })
  }

  async getMinWidth (): Promise<number> {
    const { minWidth } = await this.request({ method: 'GET', endpoint: '/min-width' })
    return minWidth
  }

  async setMinWidth ({ minWidth }: { minWidth: number }) {
    return this.request({ method: 'POST', endpoint: '/min-width', data: { minWidth } })
  }

  async getMaxHeight (): Promise<number | null> {
    const { maxHeight } = await this.request({ method: 'GET', endpoint: '/max-height' })
    return maxHeight
  }

  async setMaxHeight ({ maxHeight }: { maxHeight?: number }) {
    return this.request({ method: 'POST', endpoint: '/max-height', data: { maxHeight } })
  }

  async getMaxWidth (): Promise<number | null> {
    const { maxWidth } = await this.request({ method: 'GET', endpoint: '/max-width' })
    return maxWidth
  }

  async setMaxWidth ({ maxWidth }: { maxWidth?: number }) {
    return this.request({ method: 'POST', endpoint: '/max-width', data: { maxWidth } })
  }

  onShownChanged (cb: UIShownChangedEventCallback) {
    this.on('/shown', cb)
  }

  offShownChanged (cb: UIShownChangedEventCallback) {
    this.off('/shown', cb)
  }
}

export type UIShownChangedEventCallback = (data: { isShown: boolean }) => void | Promise<void>

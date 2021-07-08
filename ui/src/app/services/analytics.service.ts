import { Injectable } from '@angular/core'
import { UtilitiesService } from './utilities.service'
import { ApplicationService } from './app.service'
import { UIService, UIShownChangedEventCallback } from './ui.service'

declare global {
  interface Window {
    gaData: any
    gaGlobal: any
    gaplugins: any
  }
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor (
    public utils: UtilitiesService,
    public app: ApplicationService,
    private readonly ui: UIService
  ) {}

  private injected = false
  private readonly SCRIPT_ID = 'google-analytics'
  private readonly UIIsShownListener: UIShownChangedEventCallback = ({ isShown }) => {
    if (isShown) {
      this.ping()
    }
  }

  async init () {
    if (this.injected) return

    await UtilitiesService.injectScript({
      id: this.SCRIPT_ID,
      src: 'https://www.google-analytics.com/analytics.js'
    })
    this.injected = true

    window.ga('create', 'UA-96287398-6')
    this.send()

    this.clearPingTimer()
    this.pingTimer = setInterval(() => {
      this.ping()
    }, this.pingIntervalMs) as any
    this.ui.onShownChanged(this.UIIsShownListener)
  }

  private async send () {
    const info = await this.app.getInfo()
    const data = {
      appName: 'eqMac',
      appVersion: `${info.version}`,
      screenName: 'Home',
      dimension1: `${this.ui.version}`,
      dimension2: `${info.isOpenSource}`,
      dimension3: `${this.ui.isRemote}`
    }
    window.ga('send', 'screenview', data)
  }

  private pingTimer: number
  private readonly pingIntervalMs = 10 * 60 * 1000

  private async ping () {
    if (!this.injected) return
    window.ga('send', 'screenview', {
      screenview: 'Home'
    })
  }

  private clearPingTimer () {
    if (this.pingTimer) {
      clearInterval(this.pingTimer)
      this.pingTimer = undefined
    }
  }

  deinit () {
    this.clearPingTimer()
    this.ui.offShownChanged(this.UIIsShownListener)
    window.document.getElementById(this.SCRIPT_ID)?.remove()
    delete window.ga
    delete window.gaData
    delete window.gaGlobal
    delete window.gaplugins
    this.injected = false
  }
}

import { Injectable } from '@angular/core'
import { UtilitiesService } from './utilities.service'
import { ApplicationService } from './app.service'
import packageJson from '../../../package.json'

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor (
    public utils: UtilitiesService,
    public app: ApplicationService
  ) {}

  private _tracker: UniversalAnalytics.Tracker

  public get tracker () {
    return new Promise<UniversalAnalytics.Tracker>(async (resolve, reject) => {
      try {
        if (!this._tracker) {
          await this.utils.waitForProperty(window, 'ga')
          await this.utils.delay(1000)
          await this.utils.waitForProperty(ga, 'getAll')
          this._tracker = ga.getAll()[0]
        }
        resolve(this._tracker)
      } catch (err) {
        reject(err)
      }
    })
  }

  async send () {
    const [ tracker, info ] = await Promise.all([
      this.tracker,
      this.app.getInfo()
    ])
    const data = {
      appName: 'eqMac',
      appVersion: `${info.version}`,
      screenName: 'Home',
      dimension1: `${packageJson.version}`
    }
    tracker.send('screenview', data)
  }

  async ping () {
    const tracker = await this.tracker
    tracker.send('screenview', {
      screenview: 'Home'
    })
  }
}

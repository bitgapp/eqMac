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

  public async load () {
    await this.utils.waitForProperty(window, 'ga')
    await this.utils.delay(1000)
    await this.utils.waitForProperty(ga, 'getAll')
    return ga.getAll()[0]
  }

  async send () {
    const [ tracker, info ] = await Promise.all([
      this.load(),
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
}

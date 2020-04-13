import { Injectable } from '@angular/core'
import { BridgeService } from './bridge.service'
import { Logger } from './logger.service'
import { CookiesService } from './cookies.service'

export type JSONEncodable = null | boolean | number | string | JSONData
export interface JSONData {
  [key: string]: JSONEncodable | JSONEncodable[]
}
export interface RequestOptions {
  method: 'GET' | 'POST' | 'DELETE' | 'OPTIONS'
  endpoint?: string
  data?: JSONData
}

type EventCallback = (data?: any) => void
@Injectable({
  providedIn: 'root'
})
export class DataService {
  route = ''

  constructor (
    public bridge: BridgeService,
    public cookies: CookiesService
  ) {}

  async request (opts: RequestOptions): Promise<any> {
    if (opts.endpoint && opts.endpoint[0] !== '/') opts.endpoint = `/${opts.endpoint}`
    const args: [string, any?] = [`${opts.method} ${this.route}${opts.endpoint || ''}`, opts.data]
    const resp = await this.bridge.call(...args)
    return resp
  }

  async on (callback: EventCallback)
  async on (event: string, callback: EventCallback)
  async on (eventOrCallback: string | EventCallback, callback?: EventCallback) {
    const eventName = typeof eventOrCallback === 'string' ? eventOrCallback : ''
    callback = typeof eventOrCallback === 'function' ? eventOrCallback : callback
    this.bridge.on(`${this.route}${eventName}`, callback)
  }
}

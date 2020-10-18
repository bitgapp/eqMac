import * as JSCookies from 'js-cookie'
import { Injectable } from '@angular/core'
import { ConstantsService } from './constants.service'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CookiesService {
  constructor (
    public CONST: ConstantsService
  ) {}
  set (key: string, value: any) {
    if (typeof value !== 'string') {
      value = JSON.stringify(value)
    }
    JSCookies.set(key, value, {
      domain: environment.production ? `.${this.CONST.DOMAIN}` : '.localhost'
    })
  }

  get (key: string): any {
    let value = JSCookies.get(key)
    try {
      value = JSON.parse(value)
    } catch (_) {}
    return value
  }
}

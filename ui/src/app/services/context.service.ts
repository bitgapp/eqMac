import { Injectable } from '@angular/core'

export type Context = 'EQ_TYPE_EXPERT'

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  private static readonly key = 'CONTEXT'

  static get (): Context {
    return window.localStorage.getItem(this.key) as Context
  }

  static set (context: Context) {
    return window.localStorage.setItem(this.key, context)
  }

  static clear () {
    window.localStorage.removeItem(this.key)
  }

  get () { return ContextService.get() }
  set (context: Context) { return ContextService.set(context) }
  clear () { ContextService.clear() }
}

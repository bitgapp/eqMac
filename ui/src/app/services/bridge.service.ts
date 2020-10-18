import { Injectable } from '@angular/core'
import { JSONData } from './data.service'

interface BridgeResponseData {
  error?: string
  data?: JSONData
}

interface BridgeResponse {
  send: (data?: JSONData) => void
  error: (err: string | Error) => void
}

type CallHandler = (handler: string, data: JSONData, cb: CallHandlerCallback) => void
type CallHandlerCallback = (data?: BridgeResponseData) => void

type RegisterHandler = (handler: string, cb: RegisterHandlerCallback) => void
type RegisterHandlerCallback = (data: JSONData, cb: (data?: BridgeResponseData) => void) => void

interface JSBridge {
  callHandler: CallHandler
  registerHandler: RegisterHandler
}

/**
 * Class Bridge class that connect JavaScript runtime to Swift if page is rendered in WKWebView<br>
 * Under the hood uses [WebViewJavascriptBridge](https://github.com/marcuswestin/WebViewJavascriptBridge)
 */
@Injectable({
  providedIn: 'root'
})
export class BridgeService {
  public static bridgeLoadTimeout = 10000
  public static bridgeLoadPromise: Promise<JSBridge> = null

  public get bridge () {
    if (BridgeService.bridgeLoadPromise) {
      return BridgeService.bridgeLoadPromise
    }
    BridgeService.bridgeLoadPromise = new Promise(async (resolve, reject) => {
      const bridgeKey = 'WebViewJavascriptBridge'
      if (window[bridgeKey]) {
        return resolve(window[bridgeKey])
      }

      const bridgeCallbacksKey = 'WVJBCallbacks'
      if (window[bridgeCallbacksKey]) {
        return window[bridgeCallbacksKey].push(resolve)
      }
      window[bridgeCallbacksKey] = [resolve]

      const WVJBIframe = document.createElement('iframe')
      WVJBIframe.style.display = 'none'
      WVJBIframe.src = 'https://__bridge_loaded__'
      document.documentElement.appendChild(WVJBIframe)
      setTimeout(() => document.documentElement.removeChild(WVJBIframe), 0)

      setTimeout(() => {
        reject(new Error('Bridge loading timed out'))
      }, BridgeService.bridgeLoadTimeout)
    })

    return BridgeService.bridgeLoadPromise
  }

  async call (handler: string, data?: JSONData): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const bridge = await this.bridge
      bridge.callHandler(handler, data, res => {
        const err = res.error
        return err ? reject(new Error(err)) : resolve(res.data)
      })
    })
  }

  async on (event: string, handler: (data: JSONData, res: BridgeResponse) => void | Promise<void>) {
    const bridge = await this.bridge
    bridge.registerHandler(event, async (data, cb) => {
      const handleError = (err: string | Error) => {
        console.error(err)
        cb({ error: err.toString() })
      }
      try {
        await handler(data, {
          send: (data) => cb({ data }),
          error: (err) => handleError(err)
        })
      } catch (err) {
        handleError(err)
      }
    })
  }
}

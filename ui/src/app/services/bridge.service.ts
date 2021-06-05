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

type EventHandler = (data: JSONData, res: BridgeResponse) => void | Promise<void>

interface JSBridge {
  callHandler: CallHandler
  registerHandler: RegisterHandler
  disableJavscriptAlertBoxSafetyTimeout: () => void
}

/**
 * Class Bridge class that connect JavaScript runtime to Swift if page is rendered in WKWebView<br>
 * Under the hood uses [WebViewJavascriptBridge](https://github.com/marcuswestin/WebViewJavascriptBridge)
 */
export class Bridge {
  public static loadTimeout = 10000
  public static loadPromise: Promise<JSBridge> = null
  private static didSpeedUp = false
  private static readonly handlers: {
    [event: string]: EventHandler[]
  } = {}

  public static get bridge () {
    if (Bridge.loadPromise) {
      return Bridge.loadPromise
    }
    Bridge.loadPromise = new Promise(async (resolve, reject) => {
      const bridgeKey = 'WebViewJavascriptBridge'
      if (window[bridgeKey]) {
        return resolve(window[bridgeKey])
      }

      const bridgeCallbacksKey = 'WVJBCallbacks'
      if (window[bridgeCallbacksKey]) {
        return window[bridgeCallbacksKey].push(resolve)
      }
      window[bridgeCallbacksKey] = [ resolve ]

      const WVJBIframe = document.createElement('iframe')
      WVJBIframe.style.display = 'none'
      WVJBIframe.src = 'https://__bridge_loaded__'
      document.documentElement.appendChild(WVJBIframe)
      setTimeout(() => document.documentElement.removeChild(WVJBIframe), 0)

      setTimeout(() => {
        reject(new Error('Bridge loading timed out'))
      }, Bridge.loadTimeout)
    })

    return Bridge.loadPromise
  }

  static async call (handler: string, data?: JSONData): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const bridge = await this.bridge
      if (!Bridge.didSpeedUp) {
        Bridge.didSpeedUp = true
        bridge.disableJavscriptAlertBoxSafetyTimeout()
      }
      bridge.callHandler(handler, data, res => {
        const err = res.error
        return err ? reject(new Error(err)) : resolve(res.data)
      })
    })
  }

  static async on (event: string, handler: EventHandler) {
    const bridge = await this.bridge
    let shouldRegister = false
    if (!(event in Bridge.handlers)) {
      Bridge.handlers[event] = []
      shouldRegister = true
    }

    Bridge.handlers[event].push(handler)

    if (shouldRegister) {
      bridge.registerHandler(event, async (data, cb) => {
        const handleError = (err: string | Error) => {
          console.error(err)
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          cb({ error: err.toString() })
        }

        for (const handler of Bridge.handlers[event]) {
          try {
            await handler(data, {
              send: (data) => cb({ data }),
              error: (err) => handleError(err)
            })
          } catch (err) {
            handleError(err)
          }
        }
      })
    }
  }

  static async off (event: string, handler: EventHandler) {
    if (!Bridge.handlers[event]?.length) {
      console.error(`Trying to unsubscribe from event: "${event}" when there are no handlers registered`)
      return
    }
    const index = Bridge.handlers[event]?.indexOf(handler)
    if (index > -1) {
      Bridge.handlers[event].splice(index, 1)
    } else {
      console.error(`Trying to unsubscribe from event: "${event}" with a handler that is not registered`)
    }
  }
}

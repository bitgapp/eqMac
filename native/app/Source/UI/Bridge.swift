//
//  File.swift
//  eqMac
//
//  Created by Roman Kisil on 09/05/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//
import Foundation
import WebKit
import WebViewJavascriptBridge
import SwiftyJSON

struct BridgeResponseData: Codable {
  let error: String?
  let data: JSON?
}

struct BridgeResponse {
  let send: (_ data: JSON?) -> Void
  let error: (_ err: String) -> Void
}

class Bridge {
  var bridge: WebViewJavascriptBridge!
  init(webView: WKWebView) {
    self.bridge = WebViewJavascriptBridge(forWebView: webView)
  }

  func call (handler: String, data: JSON?, _ callback: ((String?, JSON?) -> Void)? = nil) {
    self.bridge.callHandler(handler, data: data?.dictionaryObject ?? data?.object, responseCallback: { respData in
      if let data: BridgeResponseData = respData as? BridgeResponseData {
        if let error = data.error {
          if callback != nil {
            callback!(error, nil)
          }
          return
        }
        if callback != nil {
          callback!(nil, data.data)
        }
        return
      }
      if callback != nil {
        callback!("Invalid Response Data: \(String(describing: respData))", nil)
      }
      return
    })
  }

  func on (event: String, handler: @escaping (_ data: JSON?, _ res: BridgeResponse) -> Void) {
    self.bridge.registerHandler(event) { (data, responseCallback) in
      let send = { (resp: JSON?) in
        if (resp == nil || resp == JSON.null || resp!.type == SwiftyJSON.Type.unknown) {
          responseCallback!([ "data": nil ])
        } else if let dict = resp!.dictionaryObject {
          responseCallback!([ "data": dict ])
        } else if let array = resp!.arrayObject {
          responseCallback!([ "data": array ])
        } else if let str = resp!.string {
          responseCallback!([ "data": str ])
        }
      }
      let error = { (err: String) in
        responseCallback!([ "error": err ])
      }
      handler(data != nil ? JSON(data!) : nil, BridgeResponse(send: send, error: error))
    }
  }
}

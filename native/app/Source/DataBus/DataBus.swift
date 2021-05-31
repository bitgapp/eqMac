//
//  DataBus.swift
//  eqMac
//
//  Created by Romans Kisils on 18/10/2019.
//  Copyright © 2019 Romans Kisils. All rights reserved.
//

import Foundation
import SwiftyJSON

enum DataMethod: String {
  case GET = "GET"
  case POST = "POST"
  case DELETE = "DELETE"
}

typealias DataBusHandler = (JSON?, BridgeResponse) throws -> JSON?
typealias DataBusMiddlewareHandler = (JSON?) throws -> Void

class DataBus {
  private var childBuses: [DataBus] = []
  private let route: String!
  private var bridge: Bridge!
  private var middlewares: [String: [DataBusMiddlewareHandler]] = [:]
  
  required init (route: String, bridge: Bridge) {
    self.route = route
    self.bridge = bridge
  }
  
  convenience init (bridge: Bridge) {
    self.init(route: "", bridge: bridge)
  }
  
  func send (to path: String, data: JSON) {
    self.bridge.call(handler: self.route + path, data: data)
  }
  
  func on (_ method: DataMethod, _ path: String, _ handler: @escaping DataBusHandler) {
    let event = "\(method.rawValue) \(self.route!)\(path)"
    self.bridge.on(event: event) { (data, res) in
      do {
        let middlewareHandlers = self.getMiddlewareHandlersMatching(path: path)
        
        if (middlewareHandlers.count > 0) {
          for middlewareHandler in middlewareHandlers {
            try middlewareHandler(data)
          }
        }
        if let resp = try handler(data, res) {
          res.send(resp)
        }
      } catch {
        res.error(error.localizedDescription)
      }
    }
  }
  
  private func getMiddlewareHandlersMatching (path: String) -> [DataBusMiddlewareHandler] {
    var handlers: [DataBusMiddlewareHandler] = []
    let keys = middlewares.map { String($0.key) }
    let matchingKeys = keys.filter { key in
      return path.hasPrefix(key)
    }

    for (_, key) in matchingKeys.enumerated() {
      if let matchingHandlers = middlewares[key] {
        for matchingHandler in matchingHandlers {
          handlers.append(matchingHandler)
        }
      }
    }
    
    return handlers
  }

  func onAll (_ path: String, _ handler: @escaping DataBusMiddlewareHandler) {
    if middlewares[path] == nil {
      middlewares[path] = []
    }
    
    middlewares[path]!.append(handler)
  }
  
  func add (_ route: String, _ Bus: DataBus.Type) {
    childBuses.append(Bus.init(
      route: self.route + route,
      bridge: self.bridge
    ))
  }
  
  func add (_ Bus: DataBus.Type) {
    self.add("", Bus)
  }
  
}

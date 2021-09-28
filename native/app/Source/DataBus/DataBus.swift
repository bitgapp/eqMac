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
  case ANY = "ANY"
}

typealias DataBusHandler = (JSON?, BridgeResponse) throws -> JSON?
typealias DataBusMiddlewareHandler = (JSON?) throws -> Void

class DataBus {
  private var childBuses: [DataBus] = []
  private let route: String
  private var bridge: Bridge
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
    let event = constructEventName(method: method, path: path)
    self.bridge.on(event: event) { (data, res) in
      do {
        let middlewareHandlers = self.getMiddlewareHandlersMatching(method: method, path: path)
        
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
  
  private func getMiddlewareHandlersMatching (method: DataMethod, path: String) -> [DataBusMiddlewareHandler] {
    var handlers: [DataBusMiddlewareHandler] = []
    let keys = middlewares.map { String($0.key) }
    let event = constructEventName(method: method, path: path)
    let wildcardEvent = constructEventName(method: .ANY, path: path)
    let matchingKeys = keys.filter { key in
      return event.hasPrefix(key) || event.hasPrefix(wildcardEvent)
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

  private func constructEventName (method: DataMethod, path: String) -> String {
    return "\(method.rawValue) \(self.route)\(path)"
  }

  func middleware (method: DataMethod = .ANY, path: String = "/", _ handler: @escaping DataBusMiddlewareHandler) {
    let event = constructEventName(method: method, path: path)
    if middlewares[event] == nil {
      middlewares[event] = []
    }
    
    middlewares[event]!.append(handler)
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

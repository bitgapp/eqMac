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

class DataBus {
  private var childBuses: [DataBus] = []
  private let route: String!
  private var bridge: Bridge!
  
  required init (route: String, bridge: Bridge) {
    self.route = route
    self.bridge = bridge
  }
  
  convenience init (bridge: Bridge) {
    self.init(route: "", bridge: bridge)
  }
  
  func send (to path: String, data: JSON) {
    _ = self.bridge.call(handler: self.route + path, data: data)
  }
  
  func on (_ method: DataMethod, _ path: String, _ handler: @escaping (JSON?, BridgeResponse) throws -> JSON?) {
    let event = "\(method.rawValue) \(self.route!)\(path)"
    self.bridge.on(event: event) { (data, res) in
      do {
        if let resp = try handler(data, res) {
          res.send(resp)
        }
      } catch {
        res.error(error.localizedDescription)
      }
    }
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

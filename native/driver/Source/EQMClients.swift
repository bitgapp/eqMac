//
//  EQMClients.swift
//  eqMac
//
//  Created by Nodeful on 29/08/2021.
//  Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation
import CoreAudio.AudioServerPlugIn

class EQMClients {
  static var clients: [UInt32: EQMClient] = [:]

  static func add (_ client: EQMClient) {
    clients[client.clientId] = client
  }

  static func remove (_ client: EQMClient) {
    clients.removeValue(forKey: client.clientId)
  }

  static func get (by clientId: UInt32) -> EQMClient? {
    return clients[clientId]
  }

  static func get (by processId: pid_t) -> EQMClient? {
    return clients.values.first { $0.processId == processId }
  }

  static func get (by bundleId: String) -> [EQMClient] {
    return clients.values.filter { client in
      return client.bundleId == bundleId
    }
  }

  static func get (by client: EQMClient) -> EQMClient? {
    if let byClient = get(by: client.clientId) {
      return byClient
    }

    if let byProcessId = get(by: client.processId) {
      return byProcessId
    }

    if let bundleId = client.bundleId {
      let bundles = get(by: bundleId)
      return bundles[0]
    }

    return nil
  }
}


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
  static var clients: [UInt32: AudioServerPlugInClientInfo] = [:]

  static func add (_ client: AudioServerPlugInClientInfo) {
    clients[client.mClientID] = client
  }

  static func remove (_ client: AudioServerPlugInClientInfo) {
    clients.removeValue(forKey: client.mClientID)
  }

  static func get (by clientId: UInt32) -> AudioServerPlugInClientInfo? {
    return clients[clientId]
  }

  static func get (by processId: pid_t) -> AudioServerPlugInClientInfo? {
    return clients.values.first { $0.mProcessID == processId }
  }

  static func get (by bundleId: String) -> AudioServerPlugInClientInfo? {
    return clients.values.first { client in
      guard let clientBundleId = client.mBundleID?.takeUnretainedValue() else { return false }
      return clientBundleId as String == bundleId
    }
  }
}

extension AudioServerPlugInClientInfo {
  var bundleId: String? {
    guard let id = mBundleID?.takeUnretainedValue() else { return nil }
    return id as String
  }
}

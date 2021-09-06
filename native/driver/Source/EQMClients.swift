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
    clients[client.mClientID] = client
  }

  static func remove (_ client: EQMClient) {
    clients.removeValue(forKey: client.mClientID)
  }

  static func get (by clientId: UInt32) -> EQMClient? {
    return clients[clientId]
  }

  static func get (by processId: pid_t) -> EQMClient? {
    return clients.values.first { $0.mProcessID == processId }
  }

  static func get (by bundleId: String) -> EQMClient? {
    return clients.values.first { client in
      return client.bundleId == bundleId
    }
  }
}

class EQMClient {
  var mClientID: UInt32
  var mProcessID: pid_t
  var mIsNativeEndian: DarwinBoolean
  var bundleId: String?

  init (from clientInfo: AudioServerPlugInClientInfo) {
    mClientID = clientInfo.mClientID
    mProcessID = clientInfo.mProcessID
    mIsNativeEndian = clientInfo.mIsNativeEndian
    bundleId = clientInfo.mBundleID?.takeUnretainedValue() as String?
  }
}

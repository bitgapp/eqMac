//
//  EQMClient.swift
//  Driver
//
//  Created by Nodeful on 07/09/2021.
//  Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation
import CoreAudio.AudioServerPlugIn

class EQMClient {
  var clientId: UInt32
  var processId: pid_t
  var bundleId: String?

  init (clientId: UInt32, processId: pid_t, bundleId: String? = nil, volume: Float = 1) {
    self.clientId = clientId
    self.processId = processId
    self.bundleId = bundleId
  }

  init (from clientInfo: AudioServerPlugInClientInfo) {
    clientId = clientInfo.mClientID
    processId = clientInfo.mProcessID
    bundleId = clientInfo.mBundleID?.takeUnretainedValue() as String?
  }

  var dictionary: [String: Any] {
    var dict = [
      "clientId": clientId,
      "processId": processId,
    ] as [String : Any]

    if bundleId != nil {
      dict["bundleId"] = bundleId!
    }

    return dict
  }

  var cfDictionary: CFDictionary {
    let dict = NSDictionary(dictionary: dictionary)

    return dict as CFDictionary
  }

  static func fromDictionary (_ dict: [String: Any]) -> EQMClient? {
    guard
      let clientId = dict["clientId"] as? UInt32,
      let processId = dict["processId"] as? pid_t,
      let volume = dict["volume"] as? Float
    else {
      return nil
    }
    let bundleId = dict["bundleId"] as? String

    return EQMClient(clientId: clientId, processId: processId, bundleId: bundleId, volume: volume)
  }
}

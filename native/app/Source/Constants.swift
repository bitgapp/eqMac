//
//  Constants.swift
//  eqMac
//
//  Created by Roman Kisil on 22/01/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import AMCoreAudio


struct Constants {
  
  #if DEBUG
  static let UI_ENDPOINT_URL = URL(string: "http://localhost:4200")!
//  static let UI_ENDPOINT_URL = URL(string: "https://ui-v1.eqmac.app")!
  static let DEBUG = true
  #else
  static let DEBUG = false
  static let UI_ENDPOINT_URL = URL(string: "https://ui-v1.eqmac.app")!
  #endif
  
  static let SENTRY_ENDPOINT = "https://afd95e4c332b4b1da4bb23b9cc66782c@sentry.io/1243254"
  static let DRIVER_BUNDLE_ID = "com.bitgapp.eqmac.driver"
  static let DOMAIN = "eqmac.app"
  static let FAQ_URL = URL(string: "https://\(Constants.DOMAIN)/faq")!
  static let BUG_REPORT_URL = URL(string: "https://\(Constants.DOMAIN)/bug-report")!
  static let PASSTHROUGH_DEVICE_UID = "EQMDevice"
  static let LEGACY_DRIVER_UIDS = ["EQMAC2.1_DRIVER_ENGINE", "EQMAC2_DRIVER_ENGINE"]
  static let TOKEN_STORAGE_KEY = "eqMac Server Tokens"
  static let UI_SERVER_PREFERRED_PORT: UInt = 37628
  static let HTTP_SERVER_PREFERRED_PORT: UInt = 37624
  static let SOCKET_SERVER_PREFERRED_PORT: UInt = 37629
  static let FULL_VOLUME_STEP = 1.0 / 16
  static let QUARTER_VOLUME_STEP = FULL_VOLUME_STEP / 4
  static let FULL_VOLUME_STEPS: [Double] = Array(stride(from: 0.0, through: 2.0, by: FULL_VOLUME_STEP))
  static let QUARTER_VOLUME_STEPS: [Double] = Array(stride(from: 0.0, through: 2.0, by: QUARTER_VOLUME_STEP))
  
  static let TRANSITION_DURATION: Int = 500
  static let TRANSITION_FPS: Double = 30
  static let TRANSITION_FRAME_DURATION: Double = 1000 / TRANSITION_FPS
  static let TRANSITION_FRAME_COUNT = Int(round(TRANSITION_FPS * (Double(TRANSITION_DURATION) / 1000)))
  static let SUPPORTED_TRANSPORT_TYPES = [
    TransportType.airPlay,
    TransportType.bluetooth,
    TransportType.bluetoothLE,
    TransportType.builtIn,
    TransportType.displayPort,
    TransportType.fireWire,
    TransportType.hdmi,
    TransportType.pci,
    TransportType.thunderbolt,
    TransportType.usb,
    TransportType.aggregate
  ]
}


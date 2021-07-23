//
//  Outputs.swift
//  eqMac
//
//  Created by Romans Kisils on 04/11/2019.
//  Copyright © 2019 Romans Kisils. All rights reserved.
//

import Foundation
import AVFoundation
import AMCoreAudio

class Outputs {
  static var current: AudioDeviceID? {
    get {
      return Application.enabled ? Application.selectedDevice?.id : AudioDevice.currentOutputDevice.id
    }
  }
  
  static func isDeviceAllowed(_ device: AudioDevice) -> Bool {
    return device.transportType != nil
      && SUPPORTED_TRANSPORT_TYPES.contains(device.transportType!)
      && !device.isInputOnlyDevice()
      && !device.name.contains("CADefaultDeviceAggregate")
      && device.uid != Constants.DRIVER_DEVICE_UID
      && !Constants.LEGACY_DRIVER_UIDS.contains(device.uid ?? "")
  }
  
  static func shouldAutoSelect (_ device: AudioDevice) -> Bool {
    let types: [TransportType] = [.bluetooth, .bluetoothLE, .builtIn]
    return isDeviceAllowed(device) && types.contains(device.transportType!)
  }
  
  static var allowedDevices: [AudioDevice] {
    return AudioDevice.allOutputDevices().filter({ isDeviceAllowed($0) })
  }
  
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
    TransportType.aggregate,
    TransportType.virtual
  ]
}

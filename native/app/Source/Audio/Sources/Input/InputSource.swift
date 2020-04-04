//
//  DeviceInput.swift
//  eqMac
//
//  Created by Roman Kisil on 06/11/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import AMCoreAudio
import AVFoundation

class InputSource {
  let device: AudioDevice!
  
  public init(device: AudioDevice) {
    self.device = device
  }
  
  func setInputDevice (engine: AVAudioEngine) {
    engine.setInputDevice(device)
  }
  
  static var hasPermission: Bool {
    get {
      if #available(OSX 10.14, *) {
        let status = AVCaptureDevice.authorizationStatus(for: AVMediaType.audio)
        return status == .authorized
      } else {
        return true
      }
    }
  }
  
  static func requestPermission (_ callback: @escaping (Bool) -> Void) {
    if #available(OSX 10.14, *) {
      AVCaptureDevice.requestAccess(for: AVMediaType.audio, completionHandler: callback)
    } else {
      callback(true)
    }
  }
}


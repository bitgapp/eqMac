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
  static var current: AudioDeviceID {
    get {
      return Application.selectedDevice.id
    }
  }
}

//
//  System.swift
//  eqMac
//
//  Created by Roman Kisil on 13/08/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import ReSwift
import CoreAudio
import EmitterKit
import AMCoreAudio
import SwiftyUserDefaults

class SystemAudioSource: InputSource {
  init () {
    super.init(device: Driver.device!)
  }
}

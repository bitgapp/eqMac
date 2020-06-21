//
//  Storage.swift
//  eqMac
//
//  Created by Roman Kisil on 12/05/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import KeychainSwift
import SwiftyUserDefaults
import AVFoundation

extension DefaultsKeys {
  static let state = DefaultsKey<ApplicationState?>("state")
  
  static let isFirstLaunch = DefaultsKey<Bool?>("isFirstLaunch")
  // Device
  static let lastKnownOutputDeviceId = DefaultsKey<Int?>("lastKnownOutputDeviceId")
  static let lastKnownInputDeviceId = DefaultsKey<Int?>("lastKnownInputDeviceId")
  
  // Effects
  // Effects - Equalizer
  // Effects - Equalizer - Basic
  static let basicEqualizerPresets = DefaultsKey<[BasicEqualizerPreset]?>("basicEqualizerPresets")
  
  // Effects - Equalizer - Advanced
  static let advancedEqualizerPresets = DefaultsKey<[AdvancedEqualizerPreset]?>("advancedEqualizerPresets")
  static let lastInstalledDriverVersion = DefaultsKey<String?>("lastInstalledDriverVersion")
  static let lastSkippedDriverVersion = DefaultsKey<String?>("lastSkippedDriverVersion")
}

let Storage = Defaults
let StorageKeys = DefaultsKeys.self

let Keychain = KeychainSwift()

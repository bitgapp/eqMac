//
//  BasicEqualizerPreset.swift
//  eqMac
//
//  Created by Romans Kisils on 10/04/2019.
//  Copyright © 2019 Romans Kisils. All rights reserved.
//

import Foundation
import SwiftyUserDefaults

struct BasicEqualizerPresetGains: Codable, DefaultsSerializable, Equatable {
  let bass: Double
  let mid: Double
  let treble: Double
  
  static func == (lhs: BasicEqualizerPresetGains, rhs: BasicEqualizerPresetGains) -> Bool {
    return lhs.bass == rhs.bass && lhs.mid == rhs.mid && lhs.treble == rhs.treble
  }
}
struct BasicEqualizerPreset: Codable, DefaultsSerializable {
  let id: String
  let name: String
  let isDefault: Bool
  let gains: BasicEqualizerPresetGains
}

let BASIC_EQUALIZER_DEFAULT_PRESETS: [ String : BasicEqualizerPresetGains ] = [
  "Flat": BasicEqualizerPresetGains(
    bass: 0,
    mid: 0,
    treble: 0
  )
]


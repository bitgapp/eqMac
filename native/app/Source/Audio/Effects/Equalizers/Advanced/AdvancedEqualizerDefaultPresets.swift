//
//  AdvancedEqualizerPresets.swift
//  eqMac
//
//  Created by Romans Kisils on 31/03/2019.
//  Copyright © 2019 Romans Kisils. All rights reserved.
//

import Foundation
import SwiftyUserDefaults

struct AdvancedEqualizerPreset: Codable, DefaultsSerializable {
  let id: String
  let name: String
  let isDefault: Bool
  let gains: AdvancedEqualizerPresetGains
}
struct AdvancedEqualizerPresetGains: Codable, DefaultsSerializable {
  let global: Double
  let bands: [Double]
  
  static func == (lhs: AdvancedEqualizerPresetGains, rhs: AdvancedEqualizerPresetGains) -> Bool {
    return lhs.global == rhs.global && lhs.bands == rhs.bands
  }
  
  static func != (lhs: AdvancedEqualizerPresetGains, rhs: AdvancedEqualizerPresetGains) -> Bool {
    return !(lhs == rhs)
  }
}

let ADVANCED_EQUALIZER_DEFAULT_PRESETS: [String : [Double]] = [
  "Flat": Array(repeating: 0, count: 10),
  "Acoustic": [
    -8.3,
    9.8,
    -15.68,
    2.1,
    18.22,
    3.5,
    7,
    8.2,
    7.1,
    4.3
  ],
  "Bass Booster": [
    11,
    8.5,
    7,
    5,
    2.5,
    0,
    0,
    0,
    0,
    0
  ],
  "Bass Reducer": [
    -11,
    -8.5,
    -7,
    -5,
    -2.5,
    0,
    0,
    0,
    0,
    0
  ],
  "Classic": [
    9.5,
    7.5,
    6,
    5,
    -3,
    -3,
    0,
    4.5,
    6.5,
    7.5
  ],
  "Dance": [
    7.14,
    13.1,
    9.98,
    0,
    3.84,
    7.3,
    10.3,
    9.08,
    7.18,
    0
  ],
  "Deep": [
    9.9,
    7.1,
    3.5,
    2,
    5.7,
    5,
    2.9,
    -4.3,
    -7.1,
    -9.2
  ],
  "Electronic": [
    8.5,
    7.6,
    2.4,
    0,
    -4.3,
    4.5,
    1.7,
    2.5,
    7.9,
    9.6
  ],
  "Hip-Hop": [
    10,
    8.5,
    3,
    6,
    -2,
    -2,
    3,
    -1,
    4,
    6
  ],
  "Jazz": [
    8,
    6,
    3,
    4.5,
    -3,
    -3,
    0,
    3,
    6,
    7.5
  ],
  "Latin": [
    9,
    6,
    0,
    0,
    -3,
    -3,
    -3,
    0,
    6,
    9
  ],
  "Loudness": [
    12,
    8,
    0,
    0,
    -4,
    0,
    -2,
    -10,
    10,
    2
  ],
  "Lounge": [
    -6,
    -3,
    -1,
    3,
    8,
    5,
    0,
    -3,
    4,
    2
  ],
  "Piano": [
    6,
    4,
    0,
    5,
    6,
    3,
    7,
    9,
    6,
    7
  ],
  "Pop": [
    -3,
    -2,
    0,
    4,
    8,
    8,
    4,
    0,
    -2,
    -3
  ],
  "RnB": [
    5.24,
    13.84,
    11.3,
    2.66,
    -4.38,
    -3,
    4.64,
    5.3,
    6,
    7.5
  ],
  "Rock": [
    10,
    8,
    6,
    3,
    -1,
    -2,
    1,
    5,
    7,
    9
  ],
  "Small Speakers": [
    11,
    8.5,
    7,
    5,
    2.5,
    0,
    -2.5,
    -5,
    -7,
    -8.5
  ],
  "Spoken Word": [
    -6.92,
    -0.94,
    0,
    1.38,
    6.92,
    9.22,
    9.68,
    8.56,
    5.08,
    0
  ],
  "Treble Booster": [
    0,
    0,
    0,
    0,
    0,
    2.5,
    5,
    7,
    8.5,
    11
  ],
  "Treble Reducer": [
    0,
    0,
    0,
    0,
    0,
    -2.5,
    -5,
    -7,
    -8.5,
    -11
  ],
  "Vocal Booster": [
    -3,
    -6,
    -6,
    3,
    7.5,
    7.5,
    6,
    3,
    0,
    -3
  ]
]

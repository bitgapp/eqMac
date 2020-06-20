//
//  eqMac2.swift
//  eqMac
//
//  Created by Romans Kisils on 20/06/2020.
//  Copyright © 2020 Romans Kisils. All rights reserved.
//

import Foundation


class eqMac2 {
  
  static var defaults: Dictionary<String, Any>? {
    return UserDefaults(suiteName: "com.bitgapp.eqMac2")?.dictionaryRepresentation()
  }

  static func get10BandPresets () -> [AdvancedEqualizerPreset] {
    if defaults != nil, let presets = defaults!["kStoragePresets"] as? Dictionary<String, Dictionary<String, Any>> {
      var result: [AdvancedEqualizerPreset] = []
      for (name, preset) in presets {
        if let gains = preset["gains"] as? [Double] {
          if gains.count == 10 {
            result.append(AdvancedEqualizerPreset(
              id: UUID().uuidString,
              name: name,
              isDefault: false,
              gains: AdvancedEqualizerPresetGains(
                global: 0,
                bands: gains.map { Utilities.mapValue(value: $0, inMin: -1, inMax: 1, outMin: -24, outMax: 24) }
              )
            ))
          }
        }
      }
      return result
    }
    return []
  }
}

//
//  Volume.swift
//  eqMac
//
//  Created by Romans Kisils on 21/08/2021.
//  Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation

class Volume {
  static func toDecibel (_ volume: Float32) -> Float32 {
    if (volume <= powf(10.0, kMinVolumeDB / 20.0)) {
      return kMinVolumeDB
    } else {
      return 20.0 * log10f(volume)
    }
  }

  static func fromDecibel (_ decibel: Float32) -> Float32 {
    if (decibel <= kMinVolumeDB) {
      return 0.0
    } else {
      return powf(10.0, decibel / 20.0)
    }
  }

  static func toScalar (_ volume: Float32) -> Float32 {
    let decibel = toDecibel(volume);
    return (decibel - kMinVolumeDB) / (kMaxVolumeDB - kMinVolumeDB);
  }

  static func fromScalar (_ scalar: Float32) -> Float32 {
    let decibel = scalar * (kMaxVolumeDB - kMinVolumeDB) + kMinVolumeDB
    return fromDecibel(decibel)
  }
}
